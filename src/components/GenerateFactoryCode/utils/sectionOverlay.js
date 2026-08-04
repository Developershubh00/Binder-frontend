// Per-section resilience net — overlay the `factory_code_sections` rows back onto a
// SKU's stepData on load.
//
// Why: the big `FactoryCodeDraft` (one JSON blob per IPO, images inlined) is the
// fragile store — a large PUT can be rejected/lost/half-written while the MUCH smaller
// per-section PUTs (bomwo / artwork / cutsew / packaging) succeed. Before this, a lost
// draft meant a whole step vanished on reload ("I filled BOM & WO, came back two days
// later and it was gone") even though the section store still had it.
//
// Safety rules, applied to EVERY section:
//   1. FILL-EMPTY ONLY. A value the draft already carries is never overwritten — worst
//      case an overlay is a no-op, it can never destroy newer draft data.
//   2. A whole list is restored only when the draft's list is empty / all-blank. That
//      keeps a deleted row deleted (the draft is authoritative about how many rows
//      exist).
//   3. Row-level gap filling only when the two lists line up 1:1 AND the row at that
//      index is the same row (identity keys below). Never merge across different rows.

// ---------------------------------------------------------------------------
// Shared predicates
// ---------------------------------------------------------------------------

const isEmpty = (v) => v === '' || v == null;

// "Nothing worth keeping" — '' / null / [] / {} / a File that JSON turned into {}.
const isBlank = (v) => {
  if (isEmpty(v)) return true;
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === 'object') return Object.keys(v).length === 0;
  return false;
};

// Does this scaffold row hold any user input at all? Structural keys (srNo, the
// always-present empty size/workOrder scaffolds) don't count as data.
const STRUCTURAL_KEYS = new Set(['srNo', 'id', 'size', 'workOrders', 'productIndex', 'componentIndex']);
const hasAnyValue = (row) => {
  if (!row || typeof row !== 'object') return false;
  return Object.entries(row).some(([k, v]) => !STRUCTURAL_KEYS.has(k) && !isBlank(v));
};
const listHasData = (list) => Array.isArray(list) && list.some(hasAnyValue);

// Copy every key the source has and the target is missing/blank. Returns the target
// unchanged (same reference) when there was nothing to fill.
const fillGaps = (target, source, skipKeys = STRUCTURAL_KEYS) => {
  if (!source || typeof source !== 'object') return target;
  let out = target;
  for (const [k, v] of Object.entries(source)) {
    if (skipKeys.has(k)) continue;
    if (isBlank(v)) continue; // nothing to give
    if (!isBlank(out[k])) continue; // draft already has a value — never overwrite
    if (out === target) out = { ...target };
    out[k] = v;
  }
  return out;
};

// Pair two lists index-by-index, but only when they are the same length and the rows
// at each index are the same row (per `sameRow`). Anything else → no row-level merge,
// because the draft may legitimately have added/removed/reordered rows.
const mergeAligned = (draftList, sliceList, sameRow) => {
  if (!Array.isArray(draftList) || !Array.isArray(sliceList)) return draftList;
  if (draftList.length !== sliceList.length) return draftList;
  let touched = false;
  const out = draftList.map((row, i) => {
    const src = sliceList[i];
    if (!src || !sameRow(row, src)) return row;
    const merged = fillGaps(row, src);
    if (merged !== row) touched = true;
    return merged;
  });
  return touched ? out : draftList;
};

/**
 * Writer-side guard: does a freshly-built slice hold anything worth persisting?
 *
 * Every step's stepData is scaffolded on read (`ensureStepDataShape`), so an untouched
 * Artwork/Packaging step still produces a slice full of empty rows. Without this check
 * simply *opening* an IPC would PUT that blank scaffold over a real saved slice and
 * destroy the very backup this store exists to provide.
 */
export const sliceHasData = (section, slice) => {
  if (!slice || typeof slice !== 'object') return false;
  switch (section) {
    case 'bomwo':
      return (slice.rawMaterials || []).length > 0 || listHasData(slice.consumptionMaterials);
    case 'cutsew':
      return (slice.workOrderSpecs || []).length > 0;
    case 'artwork':
      return listHasData(slice.artworkMaterials);
    case 'packaging': {
      const p = slice.packaging;
      if (!p) return false;
      return listHasData(p.materials)
        || (Array.isArray(p.extraPacks) && p.extraPacks.some((x) => listHasData(x?.materials)))
        || hasAnyValue({ ...p, materials: undefined, extraPacks: undefined });
    }
    default:
      return false;
  }
};

// ---------------------------------------------------------------------------
// cutsew — sizes, units, the cutting/sewing/finishing spec and the process clubs
// ---------------------------------------------------------------------------

// Every Cut/Sew/Finishing spec field the slice carries and this overlay restores
// (fill-empty). Keep in sync with buildCutSewSlice() in GenerateFactoryCode.jsx.
const CUT_SEW_SPEC_KEYS = [
  'receivedUnit', 'processUnit', 'dispatchUnit',
  'cutLength', 'cutWidth', 'cutUnit', 'cutWastage',
  'sewLength', 'sewWidth', 'sewUnit', 'sewWastage',
  'spi', 'threadType', 'sewingMachineType', 'cutType', 'approval', 'wastage',
  'qualityVerification', 'finishingProcess', 'remarks',
];
const hasClubs = (pa) => Boolean(pa && (pa.cutting?.clubs?.length || pa.sewing?.clubs?.length));

export const overlayCutSewSlice = (stepData, slice) => {
  if (!stepData || !slice) return stepData;
  const specs = Array.isArray(slice.workOrderSpecs) ? slice.workOrderSpecs : [];

  // Group specs by componentName + type, preserving order (= occurrence).
  const byKey = new Map();
  for (const s of specs) {
    const key = `${s.componentName || ''}||${(s.workOrder || '').toUpperCase()}`;
    if (!byKey.has(key)) byKey.set(key, []);
    byKey.get(key).push(s);
  }

  const cursor = new Map();
  let touched = false;
  const rawMaterials = (stepData.rawMaterials || []).map((m) => ({
    ...m,
    workOrders: (m.workOrders || []).map((wo) => {
      const type = (wo?.workOrder || '').toUpperCase();
      if (type !== 'CUTTING' && type !== 'SEWING' && type !== 'FINISHING') return wo;
      const key = `${m.componentName || ''}||${type}`;
      const i = (cursor.get(key) ?? -1) + 1;
      cursor.set(key, i);
      const spec = byKey.get(key)?.[i];
      if (!spec) return wo;

      let next = wo;
      for (const k of CUT_SEW_SPEC_KEYS) {
        if (isEmpty(next[k]) && !isEmpty(spec[k])) {
          if (next === wo) next = { ...wo };
          next[k] = spec[k];
          touched = true;
        }
      }
      // finishingTypes is an array — fill only when the WO has none yet.
      if (Array.isArray(spec.finishingTypes) && spec.finishingTypes.length
          && !(Array.isArray(next.finishingTypes) && next.finishingTypes.length)) {
        if (next === wo) next = { ...wo };
        next.finishingTypes = spec.finishingTypes;
        touched = true;
      }
      // Finishing groups — only when the work order has none yet.
      if (type === 'FINISHING' && Array.isArray(spec.finishingGroups) && spec.finishingGroups.length
          && !(Array.isArray(next.finishingGroups) && next.finishingGroups.length)) {
        if (next === wo) next = { ...wo };
        next.finishingGroups = spec.finishingGroups;
        touched = true;
      }
      return next;
    }),
  }));

  // Clubs: keep the draft's if it has any; otherwise fall back to the slice's.
  let processAssignments = stepData.processAssignments;
  if (!hasClubs(processAssignments) && hasClubs(slice.processAssignments)) {
    processAssignments = slice.processAssignments;
    touched = true;
  }

  if (!touched) return stepData;
  return { ...stepData, rawMaterials, processAssignments };
};

// ---------------------------------------------------------------------------
// bomwo — raw materials (with their work orders), consumption rows and the
//         per-component "saved" bookkeeping the IPC-selector badges read
// ---------------------------------------------------------------------------

// Two raw-material rows are the same row when they sit on the same component and are
// the same material type. That is stable across a reload and cheap to compare; if it
// doesn't hold we simply skip the row rather than risk merging Fabric into Fiber.
const sameRawMaterial = (a, b) =>
  String(a?.componentName || '') === String(b?.componentName || '') &&
  String(a?.materialType || '') === String(b?.materialType || '');

// Work orders line up by position + type within an already-matched material.
const mergeWorkOrders = (draftWos, sliceWos) =>
  mergeAligned(draftWos, sliceWos, (a, b) =>
    String(a?.workOrder || '').toUpperCase() === String(b?.workOrder || '').toUpperCase());

export const overlayBomWoSlice = (stepData, slice) => {
  if (!stepData || !slice) return stepData;
  const next = { ...stepData };
  let touched = false;

  // --- raw materials -------------------------------------------------------
  const sliceRaw = Array.isArray(slice.rawMaterials) ? slice.rawMaterials : [];
  const draftRaw = Array.isArray(stepData.rawMaterials) ? stepData.rawMaterials : [];
  if (sliceRaw.length && !listHasData(draftRaw)) {
    // The draft lost the whole BOM — restore it wholesale. This is the case that
    // makes "my BOM & WO disappeared" recoverable.
    next.rawMaterials = sliceRaw;
    touched = true;
  } else if (sliceRaw.length && draftRaw.length) {
    // Both present — fill only the gaps (e.g. a spec block the draft dropped).
    const merged = mergeAligned(draftRaw, sliceRaw, sameRawMaterial).map((m, i) => {
      const src = sliceRaw[i];
      if (!src || !sameRawMaterial(m, src)) return m;
      const wos = mergeWorkOrders(m.workOrders, src.workOrders);
      return wos === m.workOrders ? m : { ...m, workOrders: wos };
    });
    if (merged !== draftRaw && JSON.stringify(merged) !== JSON.stringify(draftRaw)) {
      next.rawMaterials = merged;
      touched = true;
    }
  }

  // --- consumption rows ----------------------------------------------------
  const sliceCons = Array.isArray(slice.consumptionMaterials) ? slice.consumptionMaterials : [];
  if (sliceCons.length && !listHasData(stepData.consumptionMaterials)) {
    next.consumptionMaterials = sliceCons;
    touched = true;
  }

  // --- saved-state bookkeeping --------------------------------------------
  // These two drive the "BOM & WO ✓" badge on the IPC selector. They live only in
  // the draft, so a lost draft made a fully-filled IPC read as unfilled.
  const sliceSaved = Array.isArray(slice.rawSavedComponents) ? slice.rawSavedComponents : [];
  if (sliceSaved.length && !(stepData.rawSavedComponents || []).length) {
    next.rawSavedComponents = sliceSaved;
    touched = true;
  }
  // Only when the draft has NO flags object at all. A present-but-false flag is a
  // deliberate "you edited this, save it again" signal and must not be overridden.
  if (slice.ipcSavedState && typeof slice.ipcSavedState === 'object' && !stepData.ipcSavedState) {
    next.ipcSavedState = slice.ipcSavedState;
    touched = true;
  }

  return touched ? next : stepData;
};

// ---------------------------------------------------------------------------
// artwork — the Artwork & Labelling material rows
// ---------------------------------------------------------------------------

const sameArtworkMaterial = (a, b) =>
  String(a?.artworkCategory || '') === String(b?.artworkCategory || '') &&
  String(a?.componentName || '') === String(b?.componentName || '');

export const overlayArtworkSlice = (stepData, slice) => {
  if (!stepData || !slice) return stepData;
  const sliceArt = Array.isArray(slice.artworkMaterials) ? slice.artworkMaterials : [];
  if (!sliceArt.length) return stepData;
  const draftArt = Array.isArray(stepData.artworkMaterials) ? stepData.artworkMaterials : [];

  if (!listHasData(draftArt)) {
    return { ...stepData, artworkMaterials: sliceArt };
  }
  const merged = mergeAligned(draftArt, sliceArt, sameArtworkMaterial);
  return merged === draftArt ? stepData : { ...stepData, artworkMaterials: merged };
};

// ---------------------------------------------------------------------------
// packaging — the pack plan + its material rows (incl. extra packs)
// ---------------------------------------------------------------------------

const samePackagingMaterial = (a, b) =>
  String(a?.materialDescription || '') === String(b?.materialDescription || '') &&
  String(a?.packagingMaterialType || '') === String(b?.packagingMaterialType || '');

const overlayPackObject = (draftPack, slicePack) => {
  if (!slicePack) return draftPack;
  if (!draftPack) return slicePack;
  const sliceMats = Array.isArray(slicePack.materials) ? slicePack.materials : [];
  const draftMats = Array.isArray(draftPack.materials) ? draftPack.materials : [];

  let materials = draftMats;
  if (sliceMats.length && !listHasData(draftMats)) materials = sliceMats;
  else if (sliceMats.length) materials = mergeAligned(draftMats, sliceMats, samePackagingMaterial);

  const filled = fillGaps(draftPack, slicePack, new Set(['materials', 'extraPacks']));
  if (filled === draftPack && materials === draftMats) return draftPack;
  return { ...filled, materials };
};

export const overlayPackagingSlice = (stepData, slice) => {
  if (!stepData || !slice?.packaging) return stepData;
  const draftPack = stepData.packaging;
  const slicePack = slice.packaging;

  const merged = overlayPackObject(draftPack, slicePack);

  // Extra packs: restore the whole list only when the draft has none, otherwise fill
  // gaps pack-by-pack (a removed extra pack must stay removed).
  const sliceExtras = Array.isArray(slicePack.extraPacks) ? slicePack.extraPacks : [];
  const draftExtras = Array.isArray(draftPack?.extraPacks) ? draftPack.extraPacks : [];
  let extraPacks = draftExtras;
  if (sliceExtras.length && !draftExtras.length) extraPacks = sliceExtras;
  else if (sliceExtras.length && sliceExtras.length === draftExtras.length) {
    extraPacks = draftExtras.map((p, i) => overlayPackObject(p, sliceExtras[i]));
  }

  if (merged === draftPack && extraPacks === draftExtras) return stepData;
  return { ...stepData, packaging: { ...merged, extraPacks } };
};

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

const OVERLAYS = {
  cutsew: overlayCutSewSlice,
  bomwo: overlayBomWoSlice,
  artwork: overlayArtworkSlice,
  packaging: overlayPackagingSlice,
};

// Resolve a section row's `sku_key` ('product_{i}' / 'subproduct_{i}_{s}') to the SKU
// (or subproduct) object that owns the stepData. Returns null for unknown keys.
const resolveTarget = (skus, key) => {
  const mainMatch = String(key).match(/^product_(\d+)$/);
  if (mainMatch) return skus[+mainMatch[1]] || null;
  const subMatch = String(key).match(/^subproduct_(\d+)_(\d+)$/);
  if (subMatch) return skus[+subMatch[1]]?.subproducts?.[+subMatch[2]] || null;
  return null;
};

// The buyer SKU of the IPC a slice was written for. Slices are keyed positionally
// ('product_2'), and removing an IPC shifts every later one down — so without this the
// removed IPC's saved BOM would be overlaid onto whichever IPC inherited its index.
// Written by mirrorSections(); rows saved before it existed have no ref and stay on the
// old positional behaviour (no regression for existing data).
const skuRefOf = (target) => String(target?.sku ?? target?.buyerSku ?? '').trim();
const identityMatches = (target, payload) => {
  const saved = String(payload?.__skuRef ?? '').trim();
  const current = skuRefOf(target);
  if (!saved || !current) return true; // legacy row, or an IPC with no SKU typed yet
  return saved === current;
};

/**
 * Apply every saved section slice (from GET factory-codes/sections) onto the loaded
 * SKUs, in place. Best-effort: unknown sections / missing SKUs are skipped and one bad
 * row never blocks the rest. Returns the same `skus` reference.
 *
 * Order matters: `bomwo` can restore the whole rawMaterials array, so it must run
 * before `cutsew`, which fills the per-work-order spec on top of it.
 */
const SECTION_ORDER = ['bomwo', 'cutsew', 'artwork', 'packaging'];

export const applySections = (skus, sections) => {
  if (!Array.isArray(skus) || !Array.isArray(sections)) return skus;
  const ordered = [...sections].sort(
    (a, b) => SECTION_ORDER.indexOf(a?.section) - SECTION_ORDER.indexOf(b?.section)
  );
  for (const row of ordered) {
    const overlay = OVERLAYS[row?.section];
    if (!overlay || !row?.payload) continue;
    const target = resolveTarget(skus, row.sku_key ?? row.skuKey ?? '');
    if (!target) continue;
    // Positional key + a removed IPC = this row may belong to a different IPC now.
    if (!identityMatches(target, row.payload)) continue;
    try {
      target.stepData = overlay(target.stepData, row.payload);
    } catch (e) {
      console.warn(`Section overlay '${row.section}' failed for ${row.sku_key}`, e);
    }
  }
  return skus;
};

export default applySections;

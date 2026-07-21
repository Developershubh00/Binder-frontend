// Cut/Sew resilience net — overlay the per-section `cutsew` store back onto a SKU's
// stepData on load.
//
// Why: the big `FactoryCodeDraft` (one JSON blob per IPO, images inlined) is the
// fragile store — a large PUT can be rejected/lost while the MUCH smaller `cutsew`
// section PUT (just sizes + clubs) succeeds. Before this, a lost draft save meant the
// cut/sew sizes vanished on reload even though the section store still had them. This
// overlay fills them back in.
//
// Safety: FILL-EMPTY ONLY. It never overwrites a value the draft already carries — it
// only fills gaps — so it can never destroy newer draft data; worst case it is a no-op.
// Matching is by (componentName + work-order type + occurrence order), the same order
// `buildCutSewSlice` flattens, so the two CUTTING / two SEWING steps line up correctly.

// Every Cut/Sew/Finishing spec field the slice carries and this overlay restores
// (fill-empty). Keep in sync with buildCutSewSlice() in GenerateFactoryCode.jsx.
// Sizes + units + the sewing/cutting spec (SPI, thread, approval, wastage, quality)
// — the spec fields were draft-only, so a lost draft wiped them on reload (Problem 2).
const CUT_SEW_SPEC_KEYS = [
  'receivedUnit', 'processUnit', 'dispatchUnit',
  'cutLength', 'cutWidth', 'cutUnit', 'cutWastage',
  'sewLength', 'sewWidth', 'sewUnit', 'sewWastage',
  'spi', 'threadType', 'sewingMachineType', 'cutType', 'approval', 'wastage',
  'qualityVerification', 'finishingProcess', 'remarks',
];
const isEmpty = (v) => v === '' || v == null;
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

// Apply every `cutsew` section row (from GET factory-codes/sections) onto the loaded
// SKUs in place, keyed by sku_key ('product_{i}' / 'subproduct_{i}_{s}'). Best-effort:
// unknown keys / missing SKUs are skipped. Returns the same `skus` reference.
export const applyCutSewSections = (skus, sections) => {
  if (!Array.isArray(skus) || !Array.isArray(sections)) return skus;
  for (const row of sections) {
    if (!row || row.section !== 'cutsew' || !row.payload) continue;
    const key = String(row.sku_key ?? row.skuKey ?? '');
    const mainMatch = key.match(/^product_(\d+)$/);
    const subMatch = key.match(/^subproduct_(\d+)_(\d+)$/);
    if (mainMatch) {
      const idx = +mainMatch[1];
      if (skus[idx]) skus[idx].stepData = overlayCutSewSlice(skus[idx].stepData, row.payload);
    } else if (subMatch) {
      const i = +subMatch[1];
      const s = +subMatch[2];
      const sub = skus[i]?.subproducts?.[s];
      if (sub) sub.stepData = overlayCutSewSlice(sub.stepData, row.payload);
    }
  }
  return skus;
};
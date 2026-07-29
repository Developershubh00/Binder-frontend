// Assortment ledger — the single source of truth for Clubbed / ASSORTED packaging.
//
// A packaging config is an ordered list of "packs": the main pack (round 1) followed
// by each extra pack (round 2, 3, …). When a pack is ASSORTED (To Be Shipped = Merged),
// one master carton holds an equal share of every clubbed IPC, so the number of cartons
// is limited by the IPC with the smallest remaining balance. This runs in rounds until
// every IPC's balance reaches zero — the user adds an extra pack per leftover round.
//
// Rules (from the packaging spec):
//   1. Assorted Qty = the LOWEST remaining balance among the pack's clubbed IPCs.
//      Every clubbed IPC in that pack contributes exactly that qty ("capped to lowest").
//   2. Balances carry forward: a later pack only sees what earlier packs left unpacked.
//   3. Inner Casepack Qty per IPC = casepack ÷ (number of IPCs clubbed in that pack).
//   4. Required Material Qty (per pack) = Σ(packed qty) ÷ casepack.
//
// Non-assorted (STANDALONE / STANDARD) packs are left alone: each IPC packs whatever
// was manually allocated to it (pack.packQty[ipc]), so mixed configs stay consistent.
//
// PO quantities are treated as pieces. `setOf` is intentionally NOT multiplied in here —
// it matches the diagram (PO QTY in PCS) and the existing Step5 ledger.

const toNum = (v) => {
  const n = parseFloat(String(v ?? '').trim());
  return Number.isFinite(n) ? n : 0;
};

export const getSelectedIpcs = (pack) => {
  const s = pack?.productSelection;
  return Array.isArray(s) ? s : (s ? [s] : []);
};

// A pack is ASSORTED when it ships Merged (or its master pack is explicitly ASSORTED).
// Extra packs inherit the main pack's "To Be Shipped" when their own is blank.
export const isAssortedPack = (pack, mainPack) => {
  const shipped = String(pack?.toBeShipped ?? mainPack?.toBeShipped ?? '').toLowerCase();
  const type = String(pack?.type ?? '').toUpperCase();
  return shipped === 'merged' || type === 'ASSORTED';
};

// Ordered packs of a packaging config: main pack first, then every extra pack.
export const getOrderedPacks = (packagingConfig) => {
  if (!packagingConfig) return [];
  const extras = Array.isArray(packagingConfig.extraPacks) ? packagingConfig.extraPacks : [];
  return [packagingConfig, ...extras];
};

// Forward pass over the ordered packs. Returns one result per pack, in the same order.
//   getPoQty: (ipc) => number   — PO qty in pieces for an IPC
//
// Each result:
//   { pack, isAssorted, casepack, selectedIpcs, numIpcs,
//     assortedQty,            // capped-to-lowest qty (null for non-assorted packs)
//     innerCasepackQty,       // casepack ÷ numIpcs
//     requiredMaterialQty,    // Σ(packed) ÷ casepack
//     totalPackedQty,         // Σ(packed) across the pack's IPCs (pieces packed this round)
//     rows: [{ ipc, poQty, balanceBefore, packedQty, balanceAfter, innerCasepackQty }] }
export const computeAssortmentRounds = (packs, getPoQty) => {
  const orderedPacks = Array.isArray(packs) ? packs : [];
  const mainPack = orderedPacks[0];
  const poQtyFn = typeof getPoQty === 'function' ? getPoQty : () => 0;
  const consumed = {}; // ipc -> total packed across all earlier packs (and this one)

  return orderedPacks.map((pack) => {
    const selectedIpcs = getSelectedIpcs(pack);
    const casepack = toNum(pack?.casepackQty);
    const assorted = isAssortedPack(pack, mainPack);
    const numIpcs = selectedIpcs.length;

    const balancesBefore = selectedIpcs.map((ipc) =>
      Math.max(0, poQtyFn(ipc) - (consumed[ipc] || 0))
    );

    // ASSORTED: one shared qty, capped to the lowest active balance.
    const assortedQty = assorted && numIpcs > 0 ? Math.min(...balancesBefore) : 0;
    const innerCasepackQty = numIpcs > 0 && casepack > 0 ? casepack / numIpcs : 0;

    const rows = selectedIpcs.map((ipc, i) => {
      const poQty = poQtyFn(ipc);
      const balanceBefore = balancesBefore[i];
      // ASSORTED packs the capped qty for every IPC; otherwise honour the manual allocation.
      const packedQty = assorted ? assortedQty : toNum(pack?.packQty?.[ipc]);
      consumed[ipc] = (consumed[ipc] || 0) + packedQty;
      const balanceAfter = Math.max(0, poQty - consumed[ipc]);
      return { ipc, poQty, balanceBefore, packedQty, balanceAfter, innerCasepackQty };
    });

    const totalPackedQty = rows.reduce((sum, r) => sum + r.packedQty, 0);
    const requiredMaterialQty = casepack > 0 ? totalPackedQty / casepack : 0;

    return {
      pack,
      isAssorted: assorted,
      casepack,
      selectedIpcs,
      numIpcs,
      assortedQty: assorted ? assortedQty : null,
      innerCasepackQty,
      requiredMaterialQty,
      totalPackedQty,
      rows,
    };
  });
};

// Convenience: total pieces packed per IPC across all packs (drives PO reconciliation).
export const getPackedByIpc = (rounds) => {
  const packed = {};
  (rounds || []).forEach((round) => {
    (round.rows || []).forEach((r) => {
      packed[r.ipc] = (packed[r.ipc] || 0) + r.packedQty;
    });
  });
  return packed;
};
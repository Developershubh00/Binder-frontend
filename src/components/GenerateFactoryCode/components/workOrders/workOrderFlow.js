// Work-order FLOW identity — derived, never stored.
//
// A component-material's `workOrders` array is an *ordered process flow*
// (e.g. DYEING → CUTTING → QUILTING → CUTTING → SEWING). The array order IS the
// flow and we never reorder it. From that order we derive a stable identity for
// every work order so the same type appearing twice (two CUTTING steps) can be told
// apart in BOM & WO, in the Cut & Sew spec, and in the clubbing view.
//
// Deriving (instead of storing an id) keeps the identity always in sync with the
// flow and adds ZERO data-model / DB risk — it is pure display metadata.
//
// Per work order we expose:
//   step            1-based position in the flow (unique within the material)
//   total           number of work orders in the flow
//   type            work-order type ('CUTTING', 'DYEING', …)
//   occurrence      the Nth work order OF THIS TYPE (1-based)
//   occurrenceTotal how many work orders share this type
//   repeats         true when the type appears more than once
//   code            'WO-2' — the unique flow code within the material
//   typeCode        'CUTTING #1' when the type repeats, else 'CUTTING'
//   label           'CUTTING #1 · Step 2 of 5' — full human identity
//   remark          the BOM remark, if any (the user's own naming for this step)

export const buildFlowMeta = (workOrders = []) => {
  const totals = {};
  workOrders.forEach((wo) => {
    const t = wo?.workOrder || '';
    totals[t] = (totals[t] || 0) + 1;
  });

  const running = {};
  return workOrders.map((wo, i) => {
    const type = wo?.workOrder || '';
    running[type] = (running[type] || 0) + 1;
    const occurrence = running[type];
    const occurrenceTotal = totals[type] || 0;
    const repeats = occurrenceTotal > 1;
    const typeLabel = type || '—';
    const typeCode = repeats ? `${typeLabel} #${occurrence}` : typeLabel;
    return {
      step: i + 1,
      total: workOrders.length,
      type,
      occurrence,
      occurrenceTotal,
      repeats,
      code: `WO-${i + 1}`,
      typeCode,
      label: `${typeCode} · Step ${i + 1} of ${workOrders.length}`,
      remark: wo?.remarks || '',
    };
  });
};

// Compact chain for the flow strip: [{ step, type, typeCode, code }, …] in order.
export const flowChain = (workOrders = []) =>
  buildFlowMeta(workOrders).map((m) => ({ step: m.step, type: m.type || '—', typeCode: m.typeCode, code: m.code }));
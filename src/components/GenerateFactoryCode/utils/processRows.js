// Cut/Sew · Section-2 (process) ROW identity.
//
// A clubbing ROW is ONE work order of a given type for a component — NOT the whole
// component. So "Front Panel" with CUTTING #1 + CUTTING #2 is TWO rows, each with
// its own cut size, and each can be clubbed / isolated on its own. This mirrors the
// factory reality: a cutting layout groups pieces of the same size, and one
// component's two cutting steps are two different pieces.
//
// The row `key` is what a club stores in `club.components`. It is derived (never
// stored) and MUST be reproduced identically wherever clubs are read (the Process
// view and propagateClubs), so both use this single helper.

import { buildFlowMeta } from '../components/workOrders/workOrderFlow';

// Enumerate every work order of `woType` across the raw materials as a flat list of
// rows. `key` = "<component> · <typeCode>" (e.g. "Front Panel · CUTTING #1"); a
// running suffix is appended only in the rare case the same key repeats (a component
// split across two materials that both yield a bare "CUTTING"), keeping keys unique.
export const enumerateProcessRows = (rawMaterials = [], woType) => {
  const rows = [];
  const seen = new Map();
  rawMaterials.forEach((m, materialIndex) => {
    if (!m?.componentName) return;
    const meta = buildFlowMeta(m.workOrders || []);
    (m.workOrders || []).forEach((wo, woIndex) => {
      if (wo?.workOrder !== woType) return;
      const typeCode = meta[woIndex]?.typeCode || woType;
      let key = `${m.componentName} · ${typeCode}`;
      const n = (seen.get(key) || 0) + 1;
      seen.set(key, n);
      if (n > 1) key = `${key} #${n}`;
      rows.push({ key, name: m.componentName, typeCode, materialIndex, woIndex, wo });
    });
  });
  return rows;
};

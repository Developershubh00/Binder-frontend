// ── Permission model for the master-panel "Add / Edit User" flow ──────────────
// Mirrors the product's own navigation: modules → rows (screens), each granted a
// cumulative access level per IPO-type column, plus an optional "Approve" grant.
// UI-only for now — the effective-access payload is assembled on save and logged;
// wire to real endpoints when they exist.

// Cumulative access ladder. Index === stored level value (0..3).
// Palette is orange + grey only: grey shades escalate, orange marks full edit access.
export const LEVELS = [
  { v: 0, opt: '—',                   short: '—',     color: '#9ca3af', bg: '#ffffff' },
  { v: 1, opt: 'Read',                short: 'Read',  color: '#6b7280', bg: '#f3f4f6' },
  { v: 2, opt: 'Read + Write',        short: 'R+W',   color: '#374151', bg: '#e9ebef' },
  { v: 3, opt: 'Read + Write + Edit', short: 'R+W+E', color: '#f94d00', bg: '#fdece4' },
];

// IPO-type column sets.
export const T3 = ['Production', 'Sampling', 'Company'];
export const T4 = ['Production', 'Sampling', 'Company', 'Essentials'];

// Permission tree = the product's navigation, per IPO type.
export const MODULES = [
  {
    id: 'code',
    name: 'Code Creation',
    desc: 'Master codes — the data every other module references',
    cols: null,
    rows: [
      { id: 'buyer',  name: 'Buyer',                          sub: 'Generate code · Master sheet',            max: 3 },
      { id: 'vendor', name: 'Vendor',                         sub: 'Generate code · Master sheet',            max: 3 },
      { id: 'ess',    name: 'Company Essentials',             sub: 'Generate code · Master sheet · Print',    max: 2, cap: 'No edit in the product — print sits in its place' },
      { id: 'ipo',    name: 'Internal Purchase Order (IPO)',  sub: 'Generate · Master sheet · Completed',     max: 2, cap: 'IPO editing lives in IPO Management' },
    ],
  },
  {
    id: 'ipom',
    name: 'IPO Management',
    desc: 'Specs & consumption sheets — each IPO type set separately',
    cols: T3,
    rows: [
      { id: 'spec', name: 'IPC Spec',        sub: 'Product spec · subproducts · SKUs',                          max: 3, approve: true },
      { id: 'dcns', name: 'IPC Derived CNS', sub: 'Derived consumption sheet',                                  max: 1, cap: 'View-only in the product — approve still possible', approve: true },
      { id: 'mcns', name: 'IPO Master CNS',  sub: 'Raw material · packaging · club/unclub · share to purchase', max: 3, approve: true },
    ],
  },
  {
    id: 'pur',
    name: 'Purchase',
    desc: 'Consumption → vendor purchase orders — each IPO type set separately',
    cols: T3,
    rows: [
      { id: 'raw',  name: 'Raw Material',        sub: 'CNS tab · yarn / fabric / fiber / foam / trims', max: 3 },
      { id: 'job',  name: 'Job Work',            sub: 'CNS tab',                                        max: 3 },
      { id: 'art',  name: 'Artwork & Labeling',  sub: 'CNS tab',                                        max: 3 },
      { id: 'pack', name: 'Packaging',           sub: 'CNS tab',                                        max: 3 },
      { id: 'vpo',  name: 'VPO History',         sub: 'View · close',                                   max: 3 },
    ],
  },
  {
    id: 'ims',
    name: 'IMS — Inventory',
    desc: 'Receiving, dispatch, stock, quality, courier — each IPO type set separately',
    cols: T4,
    note: 'Essentials column = the Company-Essentials IPO type carried by Outward & Stock forms.',
    rows: [
      { id: 'in',    name: 'Inward Store Sheet',  sub: 'Form · database · UIN / USN', max: 3 },
      { id: 'out',   name: 'Outward Store Sheet', sub: 'Form · database',             max: 3 },
      { id: 'stock', name: 'Stock Sheet',         sub: 'Add items · master sheet',    max: 3 },
      { id: 'uqr',   name: 'UQR — Quality',       sub: 'Forms · database',            max: 3, approve: true },
      { id: 'cour',  name: 'Courier',             sub: 'Slip · master sheet · print', max: 3 },
    ],
  },
];

// Key helper for the level / approve maps.
export const permKey = (m, r, c) => `${m}.${r}.${c || 'all'}`;

// Assemble the effective-access payload from the level/approve maps.
export function buildAccessPayload(lv, ap) {
  const modules = [];
  let cells = 0;
  let approvals = 0;
  MODULES.forEach((mod) => {
    const cols = mod.cols || ['all'];
    const grants = [];
    cols.forEach((col) => {
      mod.rows.forEach((row) => {
        const v = lv[permKey(mod.id, row.id, col)] || 0;
        if (v > 0) {
          const approver = !!ap[permKey(mod.id, row.id, col)];
          grants.push({
            row: row.id,
            name: row.name,
            ipoType: col === 'all' ? null : col,
            level: v,
            levelLabel: LEVELS[v].opt,
            approver,
          });
          cells += 1;
          if (approver) approvals += 1;
        }
      });
    });
    if (grants.length) modules.push({ module: mod.id, name: mod.name, grants });
  });
  return { modules, cells, approvals };
}

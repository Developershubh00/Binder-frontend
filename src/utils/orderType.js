const ORDER_TYPE_MAP = {
  production: 'Production',
  pd: 'Production',
  sampling: 'Sampling',
  sam: 'Sampling',
  company: 'Company',
  self: 'Company',
};

export const normalizeOrderType = (value) => {
  const key = String(value || '').trim().toLowerCase();
  return ORDER_TYPE_MAP[key] || String(value || '').trim();
};

export const toOrderTypeApiValue = (value) => {
  const normalized = normalizeOrderType(value);
  if (normalized === 'Production') return 'PD';
  if (normalized === 'Sampling') return 'SAM';
  if (normalized === 'Company') return 'SELF';
  return 'PD';
};


// Fiber SIZE SPEC formulas — shared by every fiber-type block so the numbers
// match wherever a fiber size spec is rendered.
//
//   SQ. METER = LENGTH(cm) × WIDTH(cm) / 10000     (cm² → m²)
//   QTY (KGS) = GSM(g/m²) × SQ.METER(m²) / 1000    (grams → kg)
import { useEffect } from 'react';

// Parse a possibly-string field; return null unless it's a positive finite number.
export const toPositiveNumber = (value) => {
  const n = parseFloat(value);
  return Number.isFinite(n) && n > 0 ? n : null;
};

// SQ. METER = LENGTH × WIDTH / 10000  (length/width in cm)
export const computeSqMeter = (length, width) => {
  const l = toPositiveNumber(length);
  const w = toPositiveNumber(width);
  if (l === null || w === null) return null;
  return (l * w) / 10000;
};

// QTY in KGS = GSM × SQ.METER / 1000
export const computeFiberKgs = (gsm, length, width) => {
  const g = toPositiveNumber(gsm);
  const sqm = computeSqMeter(length, width);
  if (g === null || sqm === null) return null;
  return (g * sqm) / 1000;
};

// Trim trailing zeros; empty string when the inputs aren't complete.
export const formatCalc = (value, decimals = 3) =>
  value === null || value === undefined ? '' : String(Number(value.toFixed(decimals)));

// Keeps the KGS quantity field in sync with the size-spec formula and returns
// the formatted KGS string for display. `enabled` lets the KGS/Yardage dropdown
// layouts skip syncing while "Yardage" is selected.
export const useFiberKgsAutoFill = ({
  material,
  actualIndex,
  onChange,
  targetField,
  enabled = true,
}) => {
  const kgsStr = formatCalc(
    computeFiberKgs(material.fiberGsm, material.fiberLength, material.fiberWidth)
  );
  const current = material[targetField] || '';
  useEffect(() => {
    if (!enabled) return;
    if (kgsStr) {
      // Size inputs complete → keep the stored KGS in sync with the formula.
      if (kgsStr !== current) onChange(actualIndex, targetField, kgsStr);
    } else if (current) {
      // Size inputs incomplete → clear the stale auto value.
      onChange(actualIndex, targetField, '');
    }
  }, [enabled, kgsStr, current, actualIndex, targetField, onChange]);
  return kgsStr;
};
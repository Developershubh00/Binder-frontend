import { ARTWORK_APPROVAL_OPTIONS } from './approvalOptions';
// QC / INSPECTION LABELS Data for Artwork & Labeling Specifications
// Based on the image specifications provided

// TYPE options
export const QC_INSPECTION_TYPES = [
  'Passed/Inspected Sticker',
  'Hold/Defective Sticker',
  'Audit Sample Tag',
  'Final Inspection Seal',
  'OTHERS (TEXT)'
];

// MATERIAL options
export const QC_INSPECTION_MATERIALS = [
  'Non-Residue Adhesive Paper',
  'Tamper-Proof Seal (for carton)',
  'OTHERS (TEXT)'
];

// CONTENT options
export const QC_INSPECTION_CONTENT = [
  'Inspector ID Number',
  'Date of Inspection',
  'Result Status (Pass/Fail/Hold)',
  'QC Stamp',
  'OTHERS (TEXT)'
];

// CODING SYSTEM options
export const QC_INSPECTION_CODING_SYSTEM = [
  'Inspector Number',
  'Shift Code',
  'Line Number',
  'Date Code',
  'OTHERS (TEXT)'
];

// GUMMING QUALITY options
export const QC_INSPECTION_GUMMING_QUALITY = [
  'Non-marking (no residue)',
  'Tamper-evident (shows if removed)',
  'OTHERS (TEXT)'
];

// TESTING REQUIREMENTS options (simple dropdown)
export const QC_INSPECTION_TESTING_REQUIREMENTS = [
  'Adhesive Release Test (peel cleanly)',
  'Print Smudge Resistance',
  'OTHERS (TEXT)'
];

// SIZE UNITS
export const QC_INSPECTION_SIZE_UNITS = ['MM', 'CM', 'INCHES'];

// APPROVAL options
export const QC_INSPECTION_APPROVAL_OPTIONS = ARTWORK_APPROVAL_OPTIONS;


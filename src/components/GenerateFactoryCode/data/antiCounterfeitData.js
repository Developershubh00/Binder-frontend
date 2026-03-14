import { ARTWORK_APPROVAL_OPTIONS } from './approvalOptions';
// Anti-Counterfeit Data for Artwork & Labeling Specifications
// Based on the image specifications provided

// TYPE options
export const ANTI_COUNTERFEIT_TYPES = [
  'Authenticity Patch',
  'Hologram Sticker',
  'Invisible Ink Print',
  'Security Thread',
  'Void/Tamper-Evident Label',
  'OTHERS (TEXT)'
];

// MATERIAL options
export const ANTI_COUNTERFEIT_MATERIALS = [
  'Destructible Vinyl',
  'Specialized Holographic Film',
  'Woven Patch with Micro-Text',
  'OTHERS (TEXT)'
];

// SECURITY FEATURE options
export const ANTI_COUNTERFEIT_SECURITY_FEATURES = [
  '3D Holography',
  'Destructible Substrate',
  'Micro-Text',
  'QR Code',
  'Sequential Numbering',
  'UV-Sensitive Ink',
  'OTHERS (TEXT)'
];

// HOLOGRAM TYPE options
export const ANTI_COUNTERFEIT_HOLOGRAM_TYPES = [
  '2D',
  '2D/3D Combination',
  '3D',
  'Dot Matrix',
  'E-beam',
  'Flip-flop',
  'OTHERS (TEXT)'
];

// NUMBERING options
export const ANTI_COUNTERFEIT_NUMBERING_OPTIONS = [
  'Encrypted Code',
  'Random Numbers',
  'Sequential Serial Numbers',
  'OTHERS (TEXT)'
];

// TESTING REQUIREMENTS options (simple dropdown)
export const ANTI_COUNTERFEIT_TESTING_REQUIREMENTS = [
  'Adhesion Strength',
  'Tamper Evidence Test (visible destroy on removal)',
  'UV Light Readability'
];

// APPROVAL options
export const ANTI_COUNTERFEIT_APPROVAL_OPTIONS = ARTWORK_APPROVAL_OPTIONS;

// Advanced Filter Options

// VERIFICATION options
export const ANTI_COUNTERFEIT_VERIFICATION_OPTIONS = [
  'Consumer Verification Link (Website/App)',
  'NFC Tap',
  'SMS Verification',
  'OTHERS (TEXT)'
];

// QR/CODE CONTENT options
export const ANTI_COUNTERFEIT_QR_CODE_CONTENT_OPTIONS = [
  'Authentication Code',
  'Batch/Lot Number',
  'Product Info',
  'URL',
  'OTHERS (TEXT)'
];

// APPLICATION options
export const ANTI_COUNTERFEIT_APPLICATION_OPTIONS = [
  'High-Bond Permanent Adhesive',
  'Sew-in (patches)',
  'OTHERS (TEXT)'
];

// TAMPER EVIDENCE options
export const ANTI_COUNTERFEIT_TAMPER_EVIDENCE_OPTIONS = [
  'Color Change',
  'Destructible (breaks apart)',
  'Void Pattern on Removal',
  'OTHERS (TEXT)'
];

// DATABASE options
export const ANTI_COUNTERFEIT_DATABASE_OPTIONS = [
  'Security database registration before shipment',
  'OTHERS (TEXT)'
];

// GUMMING QUALITY options
export const ANTI_COUNTERFEIT_GUMMING_QUALITY_OPTIONS = [
  'Permanent (shipping carton)',
  'Removable (peel cleanly)',
  'OTHERS (TEXT)'
];

// SIZE Units
export const ANTI_COUNTERFEIT_SIZE_UNITS = ['MM', 'CM', 'INCHES'];


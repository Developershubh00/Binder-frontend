// RFID Security Data for Artwork & Labeling Specifications
// Based on the RFID SECURITY GENERAL UI STRUCTURE specifications

// TYPE options
export const RFID_TYPES = [
  'Soft EAS Label (Acousto-Magnetic)',
  'UHF RFID Sticker',
  'Hard Tag (requires detacher)',
  'Dual (RFID+EAS)',
  'OTHERS (TEXT)'
];

// FORM FACTOR options
export const RFID_FORM_FACTORS = [
  'Adhesive Label (on product or swing tag)',
  'Integrated Woven Label',
  'Hang Tag RFID',
  'Sewn-in',
  'OTHERS (TEXT)'
];

// CHIP MODEL options
export const RFID_CHIP_MODELS = [
  'Impinj Monza R6',
  'NXP UCODE',
  'Alien Higgs',
  'Custom',
  'OTHERS (TEXT)'
];

// PLACEMENT options
export const RFID_PLACEMENT_OPTIONS = [
  'Avoid metal/liquid/RFID-blocking areas',
  'Interior seam',
  'Polybag',
  'Carton'
];

// TESTING REQUIREMENTS options (multi-select)
export const RFID_TESTING_REQUIREMENTS = [
  'Read Range',
  'Adhesion/Peel Strength',
  'Deactivation Reliability',
  'OTHERS (TEXT FIELD)'
];

// CODING options
export const RFID_CODING_OPTIONS = [
  'Pre-Encoded Serialization (Sequential)',
  'Blank for In-House Encoding'
];

// ENCODING STANDARD options
export const RFID_ENCODING_STANDARD_OPTIONS = [
  'EPC Gen2',
  'GS1 SGTIN',
  'ISO 18000-6C'
];

// SECURITY options
export const RFID_SECURITY_OPTIONS = [
  'Required Tamper-Evident Design',
  'Detection Rate (%)'
];

// MEMORY options
export const RFID_MEMORY_OPTIONS = [
  '96-bit EPC',
  '128-bit EPC',
  'User Memory (additional data)'
];

// CHIP / FREQUENCY options
export const RFID_CHIP_FREQUENCY_OPTIONS = [
  'Specific IC Type',
  'Frequency (860-960 MHz for UHF, 13.56 MHz for HF)'
];

// ADHESIVE options
export const RFID_ADHESIVE_OPTIONS = [
  'High-Bond Adhesive (resist peeling)',
  'Security Slot (hard tags)'
];

// SIZE UNITS
export const RFID_SIZE_UNITS = ['MM', 'CM', 'INCHES'];

// APPROVAL options
export const RFID_APPROVAL_OPTIONS = [
  'BUYER\'S / INITIAL / IPP / Technical Integration Approval'
];


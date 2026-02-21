import { WORK_ORDER_APPROVAL_OPTIONS } from './approvalOptions';
// Sewing Data for Work Order Specifications
// Based on the image specifications provided

// Sewing machine type specifications
export const SEWING_MACHINE_TYPES = {
  'SNLS MACHINE': {
    stitchType: '301 LOCKSTITCH',
    variants: ['Single Needle Lockstitch (SNLS)', 'Plain Sewing', 'Needle Feed', 'Walking Foot', 'Compound Feed'],
    threadType: 'Spun Poly, Core Spun',
    needleSize: 'TEXT'
  },
  'DNLS MACHINE': {
    stitchType: '301 DOUBLE NEEDLE',
    variants: ['Twin Needle', '2-Needle Lockstitch', 'Variable Gauge'],
    threadType: 'Spun Poly',
    needleSize: 'TEXT'
  },
  'ZIGZAG MACHINE': {
    stitchType: '304 ZIGZAG',
    variants: ['Zigzag Lockstitch', '2-Step', '3-Step Zigzag'],
    threadType: 'Spun Poly',
    needleSize: 'TEXT'
  },
  'CHAINSTITCH MACHINE': {
    stitchType: '401 SINGLE CHAIN',
    variants: ['Single Thread Chainstitch', 'Basting'],
    threadType: 'Spun Poly',
    needleSize: 'TEXT'
  },
  '2-NEEDLE CHAIN': {
    stitchType: '401 DOUBLE CHAIN',
    variants: ['Two Thread Chainstitch', '401 Stitch'],
    threadType: 'Spun Poly, Tex 40-60',
    needleSize: 'TEXT'
  },
  'FOTA MACHINE': {
    stitchType: '406 MULTI-NEEDLE CHAIN',
    variants: ['Feed-off-the-Arm (FOTA)', '3-Needle'],
    threadType: 'Spun Poly',
    needleSize: 'TEXT'
  },
  '3-THREAD OVERLOCK': {
    stitchType: '503/504 3-THREAD OVERLOCK',
    variants: ['3-Thread Edge Neatening', 'Mock Safety'],
    threadType: 'Spun Poly, Tex 18-27',
    needleSize: 'TEXT'
  },
  '4-THREAD OVERLOCK': {
    stitchType: '504 4-THREAD OVERLOCK',
    variants: ['4-Thread Safety Stitch', '2x2 Configuration'],
    threadType: 'Spun Poly, Tex 18-27',
    needleSize: 'TEXT'
  },
  '5-THREAD SAFETY': {
    stitchType: '516 5-THREAD OVERLOCK',
    variants: ['5-Thread Safety', '401 + 504 Combo'],
    threadType: 'Spun Poly',
    needleSize: 'TEXT'
  },
  'COVERSTITCH MACHINE': {
    stitchType: '602 2-NEEDLE COVER',
    variants: ['2-Needle Coverstitch', 'Flatlock', 'Bottom Cover'],
    threadType: 'Spun Poly, Tex 27',
    needleSize: 'TEXT'
  },
  '3-NEEDLE COVER': {
    stitchType: '605 3-NEEDLE COVER',
    variants: ['3-Needle Wide Coverstitch'],
    threadType: 'Spun Poly',
    needleSize: 'TEXT'
  },
  '4-NEEDLE COVER': {
    stitchType: '607 4-NEEDLE COVER',
    variants: ['4-Needle Extra Wide Cover'],
    threadType: 'Spun Poly',
    needleSize: 'TEXT'
  },
  'BARTACK MACHINE': {
    stitchType: 'BARTACK',
    variants: ['42-Stitch Bartack', 'Programmable Bartack'],
    threadType: 'Heavy Poly Tex 40-70',
    needleSize: 'TEXT'
  },
  'BUTTONHOLE MACHINE (KAAJ)': {
    stitchType: 'BUTTONHOLE (KAAJ)',
    variants: ['Keyhole', 'Straight', 'Round', 'Eyelet'],
    threadType: 'Spun Poly, Gimp',
    needleSize: 'TEXT'
  },
  'BUTTON SEWER': {
    stitchType: 'BUTTON ATTACH',
    variants: ['4-Hole', '2-Hole', 'Shank Button', 'Snap'],
    threadType: 'Heavy Poly',
    needleSize: 'TEXT'
  },
  'BLINDSTITCH MACHINE': {
    stitchType: 'BLINDSTITCH',
    variants: ['Blind Hem', 'Invisible Stitch'],
    threadType: 'Monofilament, Poly',
    needleSize: 'TEXT'
  },
  'KANSAI MACHINE': {
    stitchType: 'KANSAI SPECIAL',
    variants: ['Multi-Needle Decorative', '12-23 Needle'],
    threadType: 'Spun Poly',
    needleSize: 'TEXT'
  }
};

// Thread type options (common across all sewing types)
export const SEWING_THREAD_TYPE_OPTIONS = [
  'Spun Poly',
  'Core Spun',
  'Spun Poly, Core Spun',
  'Spun Poly, Tex 40-60',
  'Spun Poly, Tex 18-27',
  'Spun Poly, Tex 27',
  'Heavy Poly Tex 40-70',
  'Spun Poly, Gimp',
  'Heavy Poly',
  'Monofilament, Poly'
];

// Approval options (common across all sewing types)
export const SEWING_APPROVAL_OPTIONS = WORK_ORDER_APPROVAL_OPTIONS;

// Helper function to get stitch type for a sewing machine type
export const getSewingStitchType = (machineType) => {
  return SEWING_MACHINE_TYPES[machineType]?.stitchType || '';
};

// Helper function to get variants for a sewing machine type
export const getSewingVariants = (machineType) => {
  return SEWING_MACHINE_TYPES[machineType]?.variants || [];
};

// Helper function to get thread type format for a sewing machine type
export const getSewingThreadType = (machineType) => {
  return SEWING_MACHINE_TYPES[machineType]?.threadType || '';
};

// Helper function to get needle size format for a sewing machine type
export const getSewingNeedleSize = (machineType) => {
  return SEWING_MACHINE_TYPES[machineType]?.needleSize || '';
};

// Get all unique sewing machine types
export const getAllSewingMachineTypes = () => {
  return Object.keys(SEWING_MACHINE_TYPES);
};


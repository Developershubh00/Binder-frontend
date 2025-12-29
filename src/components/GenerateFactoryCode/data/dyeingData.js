// Dyeing Data for Work Order Specifications
// Based on the image specifications provided

// Dyeing type specifications
export const DYEING_TYPES = {
  // Synthetic Fabric Dyeing
  'JIGGER DYEING': {
    colorRef: 'PANTONE/ARS/CSI/PMS',
    referenceType: 'PANTONE CHIP/REF#/SWATCH/PHYSICAL SAMPLE, TPG/TCX/COATED/UNCOATED',
    shrinkageWidth: true,
    shrinkageLength: true,
    variants: ['Polyester Fabric', 'Nylon Fabric', 'Acrylic Fabric', 'Synthetic Blends']
  },
  'JET DYEING': {
    colorRef: 'PANTONE/ARS/CSI/PMS',
    referenceType: 'PANTONE CHIP/REF#/SWATCH/PHYSICAL SAMPLE, TPG/TCX/COATED/UNCOATED',
    shrinkageWidth: true,
    shrinkageLength: true,
    variants: ['Polyester Fabric', 'Nylon Fabric', 'Acrylic Fabric', 'Synthetic Blends', 'Polyester Tufted', 'Microfiber', 'Chenille Polyester']
  },
  'BEAM DYEING': {
    colorRef: 'PANTONE/ARS/CSI/PMS',
    referenceType: 'PANTONE CHIP/REF#/SWATCH/PHYSICAL SAMPLE, TPG/TCX/COATED/UNCOATED',
    shrinkageWidth: true,
    shrinkageLength: true,
    variants: ['Polyester Fabric', 'Nylon Fabric', 'Acrylic Fabric', 'Synthetic Blends', 'Polyester Tufted', 'Microfiber', 'Chenille Polyester']
  },
  'PAD DYEING': {
    colorRef: 'PANTONE/ARS/CSI/PMS',
    referenceType: 'PANTONE CHIP/REF#/SWATCH/PHYSICAL SAMPLE, TPG/TCX/COATED/UNCOATED',
    shrinkageWidth: true,
    shrinkageLength: true,
    variants: ['Polyester Fabric', 'Nylon Fabric', 'Acrylic Fabric', 'Synthetic Blends']
  },
  'WINCH DYEING': {
    colorRef: 'PANTONE/ARS/CSI/PMS',
    referenceType: 'PANTONE CHIP/REF#/SWATCH/PHYSICAL SAMPLE, TPG/TCX/COATED/UNCOATED',
    shrinkageWidth: true,
    shrinkageLength: true,
    variants: ['Cotton Fabric', 'Linen Fabric', 'Silk Fabric', 'Wool Fabric', 'Natural Blends']
  },
  'SOFT FLOW DYEING': {
    colorRef: 'PANTONE/ARS/CSI/PMS',
    referenceType: 'PANTONE CHIP/SWATCH',
    shrinkageWidth: true,
    shrinkageLength: true,
    variants: ['Atmospheric Soft Flow', 'HTHP Soft Flow (135°C)', 'Multi-Nozzle Soft Flow', 'Twin Soft Flow']
  },
  'OVERFLOW DYEING': {
    colorRef: 'PANTONE/ARS/CSI/PMS',
    referenceType: 'PANTONE CHIP/SWATCH',
    shrinkageWidth: true,
    shrinkageLength: true,
    variants: ['Atmospheric Overflow', 'HTHP Overflow', 'Dual Flow Overflow']
  },
  'AIRFLOW DYEING': {
    colorRef: 'PANTONE/ARS/CSI/PMS',
    referenceType: 'PANTONE CHIP/SWATCH',
    shrinkageWidth: true,
    shrinkageLength: true,
    variants: ['Then-Airflow (AFA)', 'Aerodynamic HT', 'Air-Steam Transport']
  },
  'CPB DYEING': {
    colorRef: 'PANTONE/ARS/CSI/PMS',
    referenceType: 'PANTONE CHIP/SWATCH',
    shrinkageWidth: true,
    shrinkageLength: true,
    variants: ['Reactive CPB', 'Pigment CPB', 'Pad-Batch-Wash']
  },
  'THERMOSOL DYEING': {
    colorRef: 'PANTONE/ARS/CSI/PMS',
    referenceType: 'PANTONE CHIP/SWATCH',
    shrinkageWidth: true,
    shrinkageLength: true,
    variants: ['Pad-Dry-Thermosol-Wash', 'Continuous Thermosol']
  },
  'CONTINUOUS DYEING': {
    colorRef: 'PANTONE/ARS/CSI/PMS',
    referenceType: 'PANTONE CHIP/SWATCH',
    shrinkageWidth: true,
    shrinkageLength: true,
    variants: ['Pad-Steam', 'Pad-Dry-Steam', 'Pad-Dry-Cure Range']
  },

  // Yarn Dyeing
  'PACKAGE DYEING': {
    colorRef: 'PANTONE/ARS/CSI/PMS',
    referenceType: 'PANTONE CHIP/REF#/SWATCH/PHYSICAL SAMPLE, TPG/TCX/COATED/UNCOATED',
    shrinkageWidth: false,
    shrinkageLength: false,
    variants: ['Polyester Yarn', 'Nylon Yarn', 'Acrylic Yarn', 'Viscose Yarn', 'Cotton Yarn', 'Linen Yarn', 'Silk Yarn', 'Wool Yarn', 'Soft Package', 'Hard Package', 'Cheese Dyeing', 'Precision Winding']
  },
  'HANK DYEING': {
    colorRef: 'PANTONE/ARS/CSI/PMS',
    referenceType: 'PANTONE CHIP/REF#/SWATCH/PHYSICAL SAMPLE, TPG/TCX/COATED/UNCOATED',
    shrinkageWidth: false,
    shrinkageLength: false,
    variants: ['Polyester Yarn', 'Nylon Yarn', 'Acrylic Yarn', 'Viscose Yarn', 'Cotton Yarn', 'Linen Yarn', 'Silk Yarn', 'Wool Yarn']
  },
  'SPACE DYEING': {
    colorRef: 'Color Sequence Reference',
    referenceType: 'PHYSICAL SAMPLE/COLOR SEQUENCE CHART',
    shrinkageWidth: false,
    shrinkageLength: false,
    variants: ['Knit-De-Knit', 'Warp Print', 'Injection Space Dye']
  },
  'WARP DYEING': {
    colorRef: 'PANTONE/ARS/CSI/PMS',
    referenceType: 'PANTONE CHIP/SWATCH',
    shrinkageWidth: false,
    shrinkageLength: false,
    variants: ['Indigo Range', 'Ball Warp', 'Slasher Dyeing', 'Loop Dyeing']
  },
  'STOCK DYEING': {
    colorRef: 'PANTONE/ARS/CSI/PMS',
    referenceType: 'PANTONE CHIP/REF#/SWATCH/PHYSICAL SAMPLE',
    shrinkageWidth: false,
    shrinkageLength: false,
    variants: ['Loose Fiber Dyeing', 'Top Dyeing', 'Sliver Dyeing']
  },

  // Garment Dyeing
  'GARMENT DYEING': {
    colorRef: 'PANTONE/ARS/CSI/PMS',
    referenceType: 'PANTONE CHIP/REF#/SWATCH/PHYSICAL SAMPLE',
    shrinkageWidth: true,
    shrinkageLength: true,
    variants: ['Cotton Tufted', 'Cotton Woven', 'Cotton Chenille', 'Rotary Dyeing', 'Paddle Dyeing', 'Jet Garment']
  },

  // Special Processes
  'STONEWASH': {
    colorRef: 'Visual Reference',
    referenceType: 'PHYSICAL SAMPLE/REFERENCE GARMENT',
    shrinkageWidth: true,
    shrinkageLength: true,
    variants: ['Pumice Stone', 'Enzyme + Stone', 'Acid Stone']
  },
  'ENZYME WASH': {
    colorRef: 'Visual Reference',
    referenceType: 'PHYSICAL SAMPLE/REFERENCE GARMENT',
    shrinkageWidth: true,
    shrinkageLength: true,
    variants: ['Cellulase', 'Acid Cellulase', 'Neutral Cellulase', 'Bio-Polish']
  },
  'ACID WASH': {
    colorRef: 'Visual Reference',
    referenceType: 'PHYSICAL SAMPLE/REFERENCE GARMENT',
    shrinkageWidth: true,
    shrinkageLength: true,
    variants: ['Bleach + Stone', 'Spray Bleach', 'Snow Wash']
  },
  'BLEACHING': {
    colorRef: 'White Shade Reference',
    referenceType: 'PHYSICAL SAMPLE/WHITENESS INDEX',
    shrinkageWidth: true,
    shrinkageLength: true,
    variants: ['Full Bleach', 'Partial Bleach', 'Spray Bleach', 'Optical Brightening']
  },
  'INDIGO DYEING': {
    colorRef: 'Visual Reference',
    referenceType: 'PHYSICAL SAMPLE/SHADE BAND',
    shrinkageWidth: true,
    shrinkageLength: true,
    variants: ['Rope Dyeing (6-12 dips)', 'Slasher Dyeing', 'Sheet Dyeing', 'Loop Dyeing']
  },
  'DIP DYEING': {
    colorRef: 'Visual Reference',
    referenceType: 'PHYSICAL SAMPLE',
    shrinkageWidth: true,
    shrinkageLength: true,
    variants: ['Manual Dip', 'Machine Dip', 'Gradient Dye']
  },
  'SPRAY DYEING': {
    colorRef: 'Visual Reference',
    referenceType: 'PHYSICAL SAMPLE',
    shrinkageWidth: true,
    shrinkageLength: true,
    variants: ['Airless Spray', 'HVLP Spray', 'Localized Spray']
  },
  'OZONE WASH': {
    colorRef: 'Visual Reference',
    referenceType: 'PHYSICAL SAMPLE',
    shrinkageWidth: true,
    shrinkageLength: true,
    variants: ['Ozone Fading', 'Ozone Bleaching', 'Laser + Ozone']
  },
  'LASER FINISHING': {
    colorRef: 'Visual Reference',
    referenceType: 'PHYSICAL SAMPLE/DESIGN FILE',
    shrinkageWidth: true,
    shrinkageLength: true,
    variants: ['Laser Fading', 'Laser Engraving', 'Laser Whisker']
  },

  // Natural Fabric Dyeing
  'COTTON DYEING': {
    colorRef: 'PANTONE/ARS/CSI/PMS',
    referenceType: 'PANTONE CHIP/REF#/SWATCH/PHYSICAL SAMPLE, TPG/TCX/COATED/UNCOATED',
    shrinkageWidth: true,
    shrinkageLength: true,
    variants: ['Cotton Fabric', 'Linen Fabric', 'Silk Fabric', 'Wool Fabric', 'Natural Blends']
  },

  // Pre-treatment/Finishing
  'MERCERIZING': {
    colorRef: 'N/A (Process)',
    referenceType: 'N/A',
    shrinkageWidth: true,
    shrinkageLength: true,
    variants: ['Chain Mercerizing', 'Chainless Mercerizing', 'Yarn Mercerizing']
  },
  'PRETREATMENT': {
    colorRef: 'N/A (Process)',
    referenceType: 'N/A',
    shrinkageWidth: true,
    shrinkageLength: true,
    variants: ['Enzymatic', 'Alkaline', 'Combined']
  },
  'DESIZING': {
    colorRef: 'N/A (Process)',
    referenceType: 'N/A',
    shrinkageWidth: true,
    shrinkageLength: true,
    variants: ['Enzymatic Desizing (Amylase)', 'Oxidative Desizing (H2O2)', 'Acid Desizing', 'Combined Desize-Scour']
  },
  'SCOURING': {
    colorRef: 'N/A (Process)',
    referenceType: 'N/A',
    shrinkageWidth: true,
    shrinkageLength: true,
    variants: ['Alkaline Scouring (NaOH)', 'Enzyme Scouring (Pectinase)', 'Bio-Scouring', 'Kier Boiling']
  },
  'SOFTENING': {
    colorRef: 'Handle Reference',
    referenceType: 'PHYSICAL SAMPLE/HANDLE STANDARD',
    shrinkageWidth: true,
    shrinkageLength: true,
    variants: ['Silicone Softener', 'Micro-Silicone', 'Macro-Silicone', 'Cationic Softener', 'Non-Ionic']
  },
  'OTHERS': {
    colorRef: 'As Required',
    referenceType: 'As Required',
    shrinkageWidth: true,
    shrinkageLength: true,
    variants: ['Specialized dyeing processes']
  }
};

// Color Reference options - Individual options separated by "/"
export const COLOR_REF_OPTIONS = [
  'PANTONE',
  'ARS',
  'CSI',
  'PMS',
  'Visual Reference',
  'White Shade Reference',
  'Handle Reference',
  'Color Sequence Reference',
  'N/A (Process)',
  'As Required'
];

// Reference Type options - Individual options separated by "/"
export const REFERENCE_TYPE_OPTIONS = [
  'PANTONE CHIP',
  'REF#',
  'SWATCH',
  'PHYSICAL SAMPLE',
  'TPG',
  'TCX',
  'COATED',
  'UNCOATED',
  'REFERENCE GARMENT',
  'WHITENESS INDEX',
  'SHADE BAND',
  'DESIGN FILE',
  'HANDLE STANDARD',
  'COLOR SEQUENCE CHART',
  'N/A',
  'As Required'
];

// Approval options (common across all dyeing types)
export const DYEING_APPROVAL_OPTIONS = [
  'SELF',
  'BUYER\'S',
  'PROTO',
  'FIT',
  'SIZE SET',
  'PP',
  'TOP SAMPLE'
];

// Helper function to parse color ref string into array of options
const parseColorRefOptions = (colorRefString) => {
  if (!colorRefString) return [];
  // Split by "/" and trim each option
  return colorRefString.split('/').map(opt => opt.trim()).filter(opt => opt);
};

// Helper function to parse reference type string into array of options
const parseReferenceTypeOptions = (referenceTypeString) => {
  if (!referenceTypeString) return [];
  // Split by comma first, then by "/", and trim each option
  const parts = referenceTypeString.split(',');
  const options = [];
  parts.forEach(part => {
    const subOptions = part.split('/').map(opt => opt.trim()).filter(opt => opt);
    options.push(...subOptions);
  });
  return options;
};

// Helper function to get color ref options array for a dyeing type
export const getDyeingColorRefOptions = (dyeingType) => {
  const colorRef = DYEING_TYPES[dyeingType]?.colorRef;
  return parseColorRefOptions(colorRef);
};

// Helper function to get reference type options array for a dyeing type
export const getDyeingReferenceTypeOptions = (dyeingType) => {
  const referenceType = DYEING_TYPES[dyeingType]?.referenceType;
  return parseReferenceTypeOptions(referenceType);
};

// Legacy helper functions (keeping for backward compatibility if needed)
export const getDyeingColorRef = (dyeingType) => {
  return DYEING_TYPES[dyeingType]?.colorRef || '';
};

export const getDyeingReferenceType = (dyeingType) => {
  return DYEING_TYPES[dyeingType]?.referenceType || '';
};

// Helper function to check if shrinkage width is applicable
export const isShrinkageWidthApplicable = (dyeingType) => {
  return DYEING_TYPES[dyeingType]?.shrinkageWidth !== false;
};

// Helper function to check if shrinkage length is applicable
export const isShrinkageLengthApplicable = (dyeingType) => {
  return DYEING_TYPES[dyeingType]?.shrinkageLength !== false;
};

// Helper function to get variants for a dyeing type
export const getDyeingVariants = (dyeingType) => {
  return DYEING_TYPES[dyeingType]?.variants || [];
};

// Get all unique dyeing types
export const getAllDyeingTypes = () => {
  return Object.keys(DYEING_TYPES);
};


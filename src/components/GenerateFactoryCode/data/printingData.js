// Printing Data for Work Order Specifications
// Based on the image specifications provided

// Printing type specifications
export const PRINTING_TYPES = {
  'BLOCK PRINT': {
    variants: ['Hand Block', 'Wooden Block', 'Metal Block', 'Bagh', 'Ajrakh', 'Sanganeri', 'Bagru', 'Dabu'],
    designs: ['Bagh', 'Ajrakh', 'Sanganeri', 'Bagru', 'Dabu', 'Traditional Motifs', 'Geometric', 'Floral', 'Abstract', 'Indigo'],
    repeatSize: 'Block Size',
    numberOfScreens: '1-20',
    colors: '% Coverage',
    coveragePercent: 'N/A',
    resolution: 'N/A'
  },
  'SCREEN PRINT': {
    variants: ['Hand Screen', 'Semi-Auto Flatbed', 'Auto Flatbed'],
    designs: ['All Designs', 'Photo-realistic', 'Fine Detail', 'Gradients', 'Spot Colors', 'Halftone', 'Multi-color'],
    repeatSize: 'Screen Size',
    numberOfScreens: '1-24',
    colors: '% Coverage',
    coveragePercent: 'Mesh Count',
    resolution: 'N/A'
  },
  'ROTARY PRINT': {
    variants: ['Rotary Screen', 'Engraved Roller', 'Stork', 'Reggiani'],
    designs: ['Continuous Patterns', 'All-over', 'Seamless Repeats', 'Geometric', 'Floral', 'Abstract', 'Stripes'],
    repeatSize: 'Circumference',
    numberOfScreens: '1-24',
    colors: '% Coverage',
    coveragePercent: 'Mesh/LPI',
    resolution: 'N/A'
  },
  'DIGITAL PRINT': {
    variants: ['Inkjet Reactive', 'Pigment Digital', 'Kornit', 'MS', 'Durst'],
    designs: ['Photo Quality', 'Unlimited Colors', 'Fine Detail', 'No Repeat Limit', 'Gradients', 'Custom', 'Variable Data'],
    repeatSize: 'No Limit',
    numberOfScreens: 'Unlimited',
    colors: '% Coverage',
    coveragePercent: '300-1200 DPI',
    resolution: 'N/A'
  },
  'SUBLIMATION TRANSFER': {
    variants: ['Sublimation Transfer', 'Direct Disperse', 'Dye-Sub'],
    designs: ['Photo Quality', 'Vibrant Colors', 'All-over Print', 'Sports Graphics', 'Soft Hand'],
    repeatSize: 'No Limit',
    numberOfScreens: 'Unlimited',
    colors: '% Coverage',
    coveragePercent: '300-1200 DPI',
    resolution: 'N/A'
  },
  'LAMINATION TRANSFER': {
    variants: ['Heat Transfer', 'Film Lamination', 'Paper Transfer'],
    designs: ['Photo Print', 'Graphics', 'Metallic', 'Holographic', 'Glitter', 'Foil Effect'],
    repeatSize: 'Film Size',
    numberOfScreens: 'Full Color',
    colors: '% Coverage',
    coveragePercent: 'Print DPI',
    resolution: 'N/A'
  },
  'FLOCKING': {
    variants: ['Electrostatic Flocking', 'Mechanical Flocking'],
    designs: ['Velvet Texture', 'Raised Patterns', 'Logos', 'Lettering', 'All-over Flock', 'Spot Flock'],
    repeatSize: 'Screen/Stencil',
    numberOfScreens: '1-6',
    colors: '% Coverage',
    coveragePercent: 'Flock Length',
    resolution: 'N/A'
  },
  'FOIL PRINT': {
    variants: ['Hot Stamping', 'Cold Foil', 'Transfer Foil'],
    designs: ['Metallic', 'Holographic', 'Matte Foil', 'Gloss Foil', 'Colored Foil', 'Patterns'],
    repeatSize: 'Die/Screen',
    numberOfScreens: '1-5',
    colors: '% Coverage',
    coveragePercent: 'N/A',
    resolution: 'N/A'
  },
  'DISCHARGE': {
    variants: ['Discharge', 'Illuminating', 'Extract'],
    designs: ['Bleach-out Patterns', 'Soft Hand Feel', 'White/Color on Dark', 'Vintage Look'],
    repeatSize: 'Screen Size',
    numberOfScreens: '1-8',
    colors: '% Coverage',
    coveragePercent: 'N/A',
    resolution: 'N/A'
  },
  'BURNOUT': {
    variants: ['Chemical Burnout', 'Devore Velvet'],
    designs: ['Sheer Patterns', 'Transparent Effects', 'Velvet Devore', 'Blend Burnout'],
    repeatSize: 'Screen Size',
    numberOfScreens: '1-3',
    colors: '% Coverage',
    coveragePercent: 'N/A',
    resolution: 'N/A'
  },
  'RESIST PRINT': {
    variants: ['Batik', 'Tie-Dye', 'Wax Resist', 'Paste Resist', 'Shibori'],
    designs: ['Batik', 'Tie-Dye', 'Shibori', 'Wax Resist Patterns', 'Itajime', 'Arashi'],
    repeatSize: 'Design Based',
    numberOfScreens: 'Varies',
    colors: '% Coverage',
    coveragePercent: 'N/A',
    resolution: 'N/A'
  },
  'PIGMENT PRINT': {
    variants: ['Pigment Paste', 'Binder Based', 'Water Based'],
    designs: ['All Designs', 'Cost Effective', 'Basic Colors', 'Solid', 'All-over'],
    repeatSize: 'Screen Size',
    numberOfScreens: '1-12',
    colors: '% Coverage',
    coveragePercent: 'Mesh Count',
    resolution: 'N/A'
  },
  'PLASTISOL': {
    variants: ['Plastisol', 'PVC Based', 'High Density', 'Puff'],
    designs: ['Opaque Colors', 'High Density', 'Puff/Raised', 'Dark Base Printing'],
    repeatSize: 'Screen Size',
    numberOfScreens: '1-12',
    colors: '% Coverage',
    coveragePercent: 'Mesh Count',
    resolution: 'N/A'
  },
  'DTF PRINTING': {
    variants: ['DTF Transfer', 'Hot Peel DTF', 'Cold Peel DTF'],
    designs: ['Any Design'],
    repeatSize: 'Variable',
    numberOfScreens: 'N/A',
    colors: 'CMYK + White',
    coveragePercent: 'N/A',
    resolution: 'N/A'
  },
  'DTG PRINTING': {
    variants: ['Epson', 'Brother', 'Kornit DTG'],
    designs: ['Photo Quality', 'Full Color'],
    repeatSize: 'Variable',
    numberOfScreens: 'N/A',
    colors: 'CMYK + White',
    coveragePercent: 'N/A',
    resolution: 'N/A'
  },
  'HD PRINTING': {
    variants: ['HD Plastisol', 'HD Silicone', '3D HD'],
    designs: ['Raised Text', 'Logos'],
    repeatSize: 'Variable',
    numberOfScreens: 'N/A',
    colors: '1-4',
    coveragePercent: 'N/A',
    resolution: 'N/A'
  },
  'PUFF PRINTING': {
    variants: ['Standard Puff', 'HD Puff'],
    designs: ['Raised/Expanded Areas'],
    repeatSize: 'Variable',
    numberOfScreens: 'N/A',
    colors: '1-3',
    coveragePercent: 'N/A',
    resolution: 'N/A'
  },
  'REFLECTIVE PRINTING': {
    variants: ['Glass Bead Reflective', 'Prismatic Reflective'],
    designs: ['Safety Graphics'],
    repeatSize: 'Variable',
    numberOfScreens: 'N/A',
    colors: '1-2',
    coveragePercent: 'N/A',
    resolution: 'N/A'
  },
  'BLOCK PRINTING': {
    variants: ['Single Side Ajrakh', 'Double Side Ajrakh'],
    designs: ['Geometric', 'Indigo + Red (Alizarin)'],
    repeatSize: 'Variable',
    numberOfScreens: 'N/A',
    colors: 'Natural Dyes',
    coveragePercent: 'N/A',
    resolution: 'N/A'
  },
  'RESIST PRINTING': {
    variants: ['Dabu Print', 'Mud Resist'],
    designs: ['Geometric', 'Floral'],
    repeatSize: 'Variable',
    numberOfScreens: 'N/A',
    colors: 'Natural/Synthetic',
    coveragePercent: 'N/A',
    resolution: 'N/A'
  },
  'SCREEN/BLOCK PRINTING': {
    variants: ['Warli Art Print'],
    designs: ['Tribal Motifs', 'Folk Art'],
    repeatSize: 'Variable',
    numberOfScreens: 'N/A',
    colors: '1-2',
    coveragePercent: 'N/A',
    resolution: 'N/A'
  },
  'OTHERS': {
    variants: ['Warp Print', 'Yarn Print', 'Specialized'],
    designs: ['As per requirement'],
    repeatSize: 'Variable',
    numberOfScreens: 'Variable',
    colors: '% Coverage',
    coveragePercent: 'Various',
    resolution: 'N/A'
  }
};

// Approval options (common across all printing types)
export const PRINTING_APPROVAL_OPTIONS = [
  'SELF',
  'BUYER\'S',
  'PROTO',
  'FIT',
  'SIZE SET',
  'PP',
  'TOP SAMPLE'
];

// Helper function to get variants for a printing type
export const getPrintingVariants = (printingType) => {
  return PRINTING_TYPES[printingType]?.variants || [];
};

// Helper function to get designs for a printing type
export const getPrintingDesigns = (printingType) => {
  return PRINTING_TYPES[printingType]?.designs || [];
};

// Helper function to get repeat size format for a printing type
export const getPrintingRepeatSize = (printingType) => {
  return PRINTING_TYPES[printingType]?.repeatSize || '';
};

// Helper function to get number of screens format for a printing type
export const getPrintingNumberOfScreens = (printingType) => {
  return PRINTING_TYPES[printingType]?.numberOfScreens || '';
};

// Helper function to get colors format for a printing type
export const getPrintingColors = (printingType) => {
  return PRINTING_TYPES[printingType]?.colors || '';
};

// Helper function to get coverage percent format for a printing type
export const getPrintingCoveragePercent = (printingType) => {
  return PRINTING_TYPES[printingType]?.coveragePercent || '';
};

// Helper function to get resolution format for a printing type
export const getPrintingResolution = (printingType) => {
  return PRINTING_TYPES[printingType]?.resolution || '';
};

// Get all unique printing types
export const getAllPrintingTypes = () => {
  return Object.keys(PRINTING_TYPES);
};


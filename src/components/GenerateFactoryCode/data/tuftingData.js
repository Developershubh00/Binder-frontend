// Tufting Data for Work Order Specifications
// Based on the image specifications provided

// Tufting machine type specifications
export const TUFTING_MACHINE_TYPES = {
  'TABLE TOP, CNC, COMPUTERISED': {
    designs: ['High-Low Loop', 'Cut Pile', 'Cut-Loop', 'Sculptured', 'Level Loop', 'Multi-Level', 'Geometric', 'Abstract', 'Floral', 'Custom', 'Photo-realistic'],
    variants: ['Loop Pile CNC', 'Cut Pile CNC', 'Cut-Loop CNC', 'Multi-Level CNC', 'Pattern Attachment'],
    machineGauge: '1/8, 1/10, 5/32, 5/64',
    stitchRate: 'Numeric'
  },
  'MULTI NEEDLE': {
    designs: ['Level Loop', 'High-Low', 'Textured', 'Patterned', 'Striped', 'Berber', 'Saxony'],
    variants: ['Single Color Multineedle', 'Multi-Color', 'Graphics Tufting', 'Loop', 'Cut', 'Cut-Loop'],
    machineGauge: '1/8, 1/10, 5/32',
    stitchRate: 'Numeric'
  },
  'SINGLE NEEDLE, GUN': {
    designs: ['Free-form Designs', 'Artistic', 'Custom Shapes', 'Portraits', 'Logos', 'Abstract', 'Any Design'],
    variants: ['Hand Gun', 'Pneumatic Gun', 'Cut Pile Gun', 'Loop Pile Gun', 'AK-I', 'AK-II'],
    machineGauge: 'N/A',
    stitchRate: 'Manual'
  },
  'FOUR NEEDLE, TABLE TOP': {
    designs: ['Basic Patterns', 'Simple Designs', 'Stripes', 'Blocks'],
    variants: ['Manual Table', 'Frame Tufting', '4-Needle Setup'],
    machineGauge: 'Fixed',
    stitchRate: 'Manual'
  },
  'HAND FRAME': {
    designs: ['Custom Artistic', 'Portrait', 'Logo', 'Complex Designs', 'Any Freeform'],
    variants: ['Vertical Frame', 'Horizontal Frame', 'Cloth Frame'],
    machineGauge: 'N/A',
    stitchRate: 'Manual'
  },
  'CUT PILE TUFTING': {
    designs: ['Solid', 'Tip-Shear', 'Carved', 'Sculptured'],
    variants: ['Velvet Cut', 'Saxony', 'Plush', 'Frieze', 'Shag (50mm+)'],
    machineGauge: 'Gauge 1/8", 1/10", 5/32". Higher pile = softer.',
    stitchRate: 'NUMERIC'
  },
  'LOOP PILE TUFTING': {
    designs: ['Commercial', 'Berber', 'Textured Loop'],
    variants: ['Level Loop', 'Berber', 'Multi-Level Loop', 'Sisal Look'],
    machineGauge: 'Most durable. Commercial carpet, High traffic.',
    stitchRate: 'NUMERIC'
  },
  'CUT & LOOP TUFTING': {
    designs: ['Pattern C&L', 'Sculptured', 'Hi-Lo'],
    variants: ['Cut & Loop Pattern', 'Sculptured', 'Random C&L'],
    machineGauge: 'Pattern variation. Decorative carpets.',
    stitchRate: 'NUMERIC'
  },
  'BATH MAT TUFTING': {
    designs: ['Cut Pile', 'Loop Pile', 'Stripe Pattern'],
    variants: ['Cotton Tufted', 'Microfiber Tufted', 'Chenille Tufted'],
    machineGauge: 'Panipat specialty. Anti-slip backing applied later.',
    stitchRate: 'NUMERIC'
  },
  'HAND GUN TUFTING': {
    designs: ['Custom Designs', 'Artistic', 'Any Pattern'],
    variants: ['Hand Tufting Gun', 'Electric Gun', 'Pneumatic Gun'],
    machineGauge: 'Low volume, Custom rugs. Primary backing on frame.',
    stitchRate: 'NUMERIC'
  },
  'GRAPHICS TUFTING': {
    designs: ['Logos', 'Complex Multi-Color', 'Custom Art'],
    variants: ['Colortech', 'Multi-Color Programmed'],
    machineGauge: 'CMC, Tuftco machines. Commercial logos, Custom.',
    stitchRate: 'NUMERIC'
  },
  'OTHERS': {
    designs: ['As per requirement'],
    variants: ['Specialized tufting equipment'],
    machineGauge: 'Various',
    stitchRate: 'Various'
  }
};

// Approval options (common across all tufting types)
export const TUFTING_APPROVAL_OPTIONS = [
  '1st PC',
  'SELF',
  'BUYER\'S',
  'PROTO',
  'FIT',
  'SIZE SET',
  'PP',
  'TOP SAMPLE'
];

// Helper function to get designs for a tufting machine type
export const getTuftingDesigns = (machineType) => {
  return TUFTING_MACHINE_TYPES[machineType]?.designs || [];
};

// Helper function to get variants for a tufting machine type
export const getTuftingVariants = (machineType) => {
  return TUFTING_MACHINE_TYPES[machineType]?.variants || [];
};

// Helper function to get machine gauge format for a tufting machine type
export const getTuftingMachineGauge = (machineType) => {
  return TUFTING_MACHINE_TYPES[machineType]?.machineGauge || '';
};

// Helper function to get stitch rate format for a tufting machine type
export const getTuftingStitchRate = (machineType) => {
  return TUFTING_MACHINE_TYPES[machineType]?.stitchRate || '';
};

// Get all unique tufting machine types
export const getAllTuftingMachineTypes = () => {
  return Object.keys(TUFTING_MACHINE_TYPES);
};


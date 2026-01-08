// Knitting Data for Work Order Specifications
// Based on the image specifications provided

// Knitting machine type specifications
export const KNITTING_MACHINE_TYPES = {
  'CIRCULAR': {
    designs: ['Single Jersey', 'Interlock', 'Rib 1x1/2x2/3x3', 'Pique', 'Lacoste', 'Ponte', 'French Terry', 'Fleece', 'Velour', 'Pointelle', 'Mesh', 'Jacquard', 'Double Knit'],
    variants: ['Single Jersey', 'Double Jersey', 'Rib', 'Interlock', 'Fleece', 'French Terry', 'Jacquard', 'Pique', 'Velour', 'Mesh'],
    gaugeRange: '' // General circular - no specific range
  },
  'FLATBED': {
    designs: ['Plain Knit', 'Rib', 'Cable', 'Aran', 'Intarsia', 'Jacquard', 'Pointelle', 'Tuck', 'Miss', 'Links-Links', '3D Knit', 'Transfer'],
    variants: ['Manual Flatbed', 'Semi-Auto', 'Computerized', 'Fully Fashioned', 'Whole Garment (Shima Seiki, Stoll)'],
    gaugeRange: ''
  },
  'V-BED': {
    designs: ['Rib', 'Half Cardigan', 'Full Cardigan', 'Milano Rib', 'Cable', 'Transfer Patterns'],
    variants: ['V-Bed Flat', 'Computerized V-Bed'],
    gaugeRange: ''
  },
  'TRICOT': {
    designs: ['Tricot', 'Satin Tricot', 'Brushed Tricot', 'Locknit', 'Sharkskin', 'Atlas', 'Queens Cord'],
    variants: ['Single Bar', 'Two Bar', 'Three Bar', 'Multi-Bar', 'Karl Mayer'],
    gaugeRange: ''
  },
  'RASCHEL': {
    designs: ['Mesh', 'Lace', 'Net', 'Jacquard Lace', 'Crochet-look', 'Power Net', 'Spacer Fabrics', 'Curtain Net'],
    variants: ['Standard Raschel', 'Jacquard Raschel', 'Double Needle Bar', 'Karl Mayer'],
    gaugeRange: ''
  },
  'CROCHET': {
    designs: ['Chain', 'Single/Double/Treble Crochet', 'Shell', 'Granny Square', 'Filet', 'Afghan', 'Lace Crochet'],
    variants: ['Hand Crochet', 'Machine Crochet', 'Crochet Galloon'],
    gaugeRange: ''
  },
  'HAND KNIT': {
    designs: ['Stockinette', 'Garter', 'Seed', 'Moss', 'Cable', 'Lace', 'Fair Isle', 'Intarsia', 'Brioche'],
    variants: ['Needle Knitting', 'Loom Knitting', 'Finger Knitting'],
    gaugeRange: ''
  },
  'SEAMLESS': {
    designs: ['3D Shaped', 'Tubular', 'Complete Garments', 'Integrated Structures'],
    variants: ['Shima Seiki WHOLEGARMENT', 'Stoll Knit & Wear'],
    gaugeRange: 'Variable'
  },
  'SPACER': {
    designs: ['3D Spacer Mesh', 'Sandwich Structures', 'Air Mesh', 'Cushion Fabric'],
    variants: ['3D Spacer', 'Sandwich Fabric'],
    gaugeRange: ''
  },
  'OTHERS': {
    designs: [],
    variants: ['Any other specialized knitting'],
    gaugeRange: ''
  },
  // Specific circular knitting types with gauge ranges
  'SINGLE JERSEY CIRCULAR': {
    designs: ['Plain', 'Pique Diamond', 'Lacoste', 'Mesh', 'Eyelet'],
    variants: ['Pique', 'Lacoste', 'Pointelle', 'Slub Jersey', 'Injection Jersey'],
    gaugeRange: '120-200'
  },
  'DOUBLE JERSEY CIRCULAR': {
    designs: ['Interlock', 'Ponte', 'Ottoman Rib'],
    variants: ['Double Interlock', 'Punto Roma', 'Milano Rib', 'Ottoman'],
    gaugeRange: '180-300'
  },
  'FLEECE CIRCULAR': {
    designs: ['Loop Terry (inside)', 'Brushed Fleece'],
    variants: ['Single Fleece', 'Double Fleece', 'Polar Fleece', 'Anti-Pill Fleece'],
    gaugeRange: '200-400'
  },
  'FRENCH TERRY CIRCULAR': {
    designs: ['Loop Back (inside)', 'Smooth (outside)'],
    variants: ['Standard French Terry', 'Loop Back', 'Brushed French Terry'],
    gaugeRange: '220-320'
  },
  'JACQUARD CIRCULAR': {
    designs: ['Multi-Color Patterns', 'Logos', 'Stripes', 'All-Over'],
    variants: ['Single Jacquard', 'Double Jacquard', 'Intarsia', 'Fair Isle'],
    gaugeRange: '180-350'
  },
  'TRICOT WARP KNIT': {
    designs: ['Smooth Face', 'Loops Back', 'Tricot Net'],
    variants: ['Single Bar', 'Two Bar', 'Three Bar Tricot'],
    gaugeRange: '40-120'
  },
  'RASCHEL WARP KNIT': {
    designs: ['Lace', 'Net', 'Mesh', 'Open Work', 'Crochet Look'],
    variants: ['Standard Raschel', 'Jacquard Raschel', 'Double Needle Raschel'],
    gaugeRange: '60-200'
  },
  'SPACER KNITTING': {
    designs: ['3D Structure', 'Air Mesh', 'Sandwich'],
    variants: ['3D Spacer', 'Air Mesh', 'Double Wall'],
    gaugeRange: '200-600'
  },
  'SEAMLESS CIRCULAR': {
    designs: ['Complete Garment Shape', 'Shaping Programs'],
    variants: ['Seamless Circular', 'Whole Garment', 'Body Size Knitting'],
    gaugeRange: 'Variable'
  }
};

// Approval options (common across all knitting types)
export const KNITTING_APPROVAL_OPTIONS = [
  '1st PC',
  'SELF',
  'BUYER\'S',
  'PROTO',
  'FIT',
  'SIZE SET',
  'PP',
  'TOP SAMPLE'
];

// Helper function to get variants for a knitting machine type
export const getKnittingVariants = (machineType) => {
  return KNITTING_MACHINE_TYPES[machineType]?.variants || [];
};

// Helper function to get designs for a knitting machine type
export const getKnittingDesigns = (machineType) => {
  return KNITTING_MACHINE_TYPES[machineType]?.designs || [];
};

// Helper function to get gauge range for a knitting machine type
export const getKnittingGaugeRange = (machineType) => {
  return KNITTING_MACHINE_TYPES[machineType]?.gaugeRange || '';
};

// Get all unique knitting machine types
export const getAllKnittingMachineTypes = () => {
  return Object.keys(KNITTING_MACHINE_TYPES);
};


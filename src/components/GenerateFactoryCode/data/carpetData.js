// Carpet Data for Work Order Specifications
// Based on the image specification provided

// Carpet machine type specifications
export const CARPET_MACHINE_TYPES = {
  'HAND KNOTTED': {
    variants: [
      'Persian Knot',
      'Turkish Knot',
      'Tibetan Knot',
      'Jufti Knot',
      'Single Knot',
      'Double Knot'
    ],
    designs: [
      'Persian',
      'Turkish',
      'Tibetan',
      'Moroccan',
      'Oushak',
      'Sultanabad',
      'Heriz',
      'Tabriz',
      'Kashan',
      'Modern',
      'Geometric',
      'Floral',
      'Medallion',
      'All-over',
      'Custom'
    ]
  },
  'HAND TUFTED': {
    variants: [
      'Cut Pile Hand Tuft',
      'Loop Pile',
      'Cut-Loop',
      'High-Low'
    ],
    designs: [
      'Traditional',
      'Modern',
      'Geometric',
      'Floral',
      'Abstract',
      'Custom',
      'High-Low',
      'Sculptured',
      'Carved'
    ]
  },
  'FLATWEAVE': {
    variants: [
      'Kilim',
      'Dhurrie',
      'Soumak',
      'Punja',
      'Panja'
    ],
    designs: [
      'Kilim',
      'Dhurrie',
      'Geometric',
      'Tribal',
      'Striped',
      'Solid',
      'Soumak',
      'Traditional'
    ]
  },
  'WILTON': {
    variants: [
      'Face-to-Face Wilton',
      'Single Piece Wilton'
    ],
    designs: [
      'Cut Pile',
      'Loop',
      'Cut-Loop',
      'Sculptured',
      'Patterned',
      'Level Loop',
      'Multi-Level'
    ]
  },
  'AXMINSTER': {
    variants: [
      'Spool Axminster',
      'Gripper Axminster'
    ],
    designs: [
      'Multi-color Patterns',
      'Complex Designs',
      'Custom',
      'Unlimited Colors',
      'Hospitality'
    ]
  },
  'MACHINE MADE- WAN DE VEILE': {
    // Also handles "VAN DE WIELE" variant name
    variants: [
      'Carpet Weaving',
      'Rug Weaving',
      'Face-to-Face'
    ],
    designs: [
      'Jacquard Carpet',
      'Woven Patterns',
      'Flatweave Look',
      'Belgian Style'
    ]
  },
  'VAN DE WIELE': {
    variants: [
      'Carpet Weaving',
      'Rug Weaving',
      'Face-to-Face'
    ],
    designs: [
      'Jacquard Carpet',
      'Woven Patterns',
      'Flatweave Look',
      'Belgian Style'
    ]
  },
  'BROADLOOM': {
    variants: [
      'Loop',
      'Cut',
      'Cut-Loop',
      'Textured',
      'Graphics'
    ],
    designs: [
      'Level Loop',
      'Berber',
      'Saxony',
      'Frieze',
      'Plush',
      'Textured',
      'Patterned'
    ]
  },
  'WALL 2 WALL': {
    variants: [
      'Loop',
      'Cut',
      'Cut-Loop',
      'Textured',
      'Graphics'
    ],
    designs: [
      'Level Loop',
      'Berber',
      'Saxony',
      'Frieze',
      'Plush',
      'Textured',
      'Patterned'
    ]
  },
  'NEEDLE PUNCH': {
    variants: [
      'Single Punch',
      'Double Punch',
      'Velour Punch',
      'Dilour'
    ],
    designs: [
      'Flat',
      'Ribbed',
      'Velour Surface',
      'Patterned',
      'Printed'
    ]
  },
  'OTHERS': {
    variants: [
      'Bonded',
      'Flocked',
      'Specialized'
    ],
    designs: [
      'As per requirement'
    ]
  }
};

// Knot Type options
export const KNOT_TYPE_OPTIONS = [
  'Persian Knot',
  'Turkish Knot',
  'Tibetan Knot',
  'Jufti Knot',
  'Single Knot',
  'Double Knot',
  'N/A'
];

// Approval options (common across all machine types)
export const CARPET_APPROVAL_OPTIONS = [
  '1st PC',
  'SELF',
  'BUYER\'S',
  'PROTO',
  'FIT',
  'SIZE SET',
  'PP',
  'TOP SAMPLE'
];

// Helper function to get variants for a machine type
export const getCarpetVariants = (machineType) => {
  return CARPET_MACHINE_TYPES[machineType]?.variants || [];
};

// Helper function to get designs for a machine type
export const getCarpetDesigns = (machineType) => {
  return CARPET_MACHINE_TYPES[machineType]?.designs || [];
};


// Cutting Data for Work Order Specifications
// Based on the image specification provided

// Cutting machine type specifications
export const CUTTING_MACHINE_TYPES = {
  'SCISSOR': {
    variants: [
      'Tailoring Scissor',
      'Electric Scissor'
    ],
    cutTypes: [
      'SINGLE PLY',
      'LAYERED (few)'
    ]
  },
  'STRAIGHT KNIFE': {
    variants: [
      'Vertical Knife',
      'End Cutter',
      'Eastman',
      'KM'
    ],
    cutTypes: [
      'LAYERED',
      'MULTI-PLY'
    ]
  },
  'ROUND KNIFE': {
    variants: [
      'Circular Blade',
      'Rotary'
    ],
    cutTypes: [
      'LAYERED',
      'CURVED'
    ]
  },
  'BAND KNIFE': {
    variants: [
      'Stationary Blade',
      'Table Mounted'
    ],
    cutTypes: [
      'LAYERED',
      'PRECISE'
    ]
  },
  'DIE CUTTER': {
    variants: [
      'Hydraulic Press',
      'Beam Press',
      'Swing Arm'
    ],
    cutTypes: [
      'SINGLE PLY',
      'MULTI-PLY',
      'NESTED'
    ]
  },
  'CNC CUTTER': {
    variants: [
      'Single Ply',
      'Multi-Ply',
      'Conveyorized',
      'Gerber',
      'Lectra',
      'Bullmer',
      'Morgan'
    ],
    cutTypes: [
      'SINGLE PLY',
      'MULTI-PLY',
      'NESTED',
      'Pattern'
    ]
  },
  'LASER': {
    variants: [
      'CO2 Laser',
      'Fiber Laser',
      'Galvo',
      'Flying Optics'
    ],
    cutTypes: [
      'SINGLE PLY',
      'NESTED'
    ]
  },
  'WATERJET': {
    variants: [
      'Abrasive Waterjet',
      'Pure Water'
    ],
    cutTypes: [
      'SINGLE PLY',
      'MULTI-PLY'
    ]
  },
  'ULTRASONIC': {
    variants: [
      'Ultrasonic Blade',
      'Rotary Ultrasonic'
    ],
    cutTypes: [
      'SINGLE PLY'
    ]
  },
  'ROTARY HAND': {
    variants: [
      'Hand Rotary',
      'Mat Cutter'
    ],
    cutTypes: [
      'SINGLE PLY',
      'FEW LAYERS'
    ]
  },
  'OTHERS': {
    variants: [
      'Specialized cutting equipment'
    ],
    cutTypes: [
      'As Required'
    ]
  }
};

// Approval options (common across all machine types)
export const CUTTING_APPROVAL_OPTIONS = [
  '1st PC',
  'SELF',
  'BUYER\'S',
  'PROTO',
  'FIT',
  'SIZE SET',
  'PP',
  'TOP SAMPLE'
];

// Nesting options
export const NESTING_OPTIONS = [
  'Manual',
  'Automatic',
  'CAD Generated',
  'Optimized',
  'N/A'
];

// Helper function to get variants for a machine type
export const getCuttingVariants = (machineType) => {
  return CUTTING_MACHINE_TYPES[machineType]?.variants || [];
};

// Helper function to get cut types for a machine type
export const getCuttingCutTypes = (machineType) => {
  return CUTTING_MACHINE_TYPES[machineType]?.cutTypes || [];
};


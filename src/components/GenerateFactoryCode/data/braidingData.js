import { WORK_ORDER_APPROVAL_OPTIONS } from './approvalOptions';
// Braiding Data for Work Order Specifications
// Based on the image specification provided

// Braiding machine type specifications
export const BRAIDING_MACHINE_TYPES = {
  'HAND BRAID': {
    strandCount: '3-12+',
    widthDiameter: 'Width/Dia',
    variants: [
      '3-Strand',
      'Multi-Strand (4,5,6,8)',
      'Flat Hand Braid',
      'Round Hand Braid',
      'Coiled'
    ],
    designs: [
      '3-Strand',
      '4-Strand',
      '5-Strand',
      'Flat',
      'Round',
      'Square',
      'Spiral',
      'Coiled',
      'Mixed Material',
      'Rag Braid'
    ],
    patternType: 'Pattern Name'
  },
  'MACHINE BRAID': {
    strandCount: '8-144 Carriers',
    widthDiameter: 'Width/Dia',
    variants: [
      'Horizontal Braider',
      'Vertical Braider',
      'Maypole Braider',
      'Rotary Braider'
    ],
    designs: [
      'Round',
      'Flat',
      'Tubular',
      'Diamond',
      'Herringbone',
      'Spiral',
      'Complex Interlocked',
      'Hollow'
    ],
    patternType: 'Pattern Name'
  },
  'ROPE MACHINE': {
    strandCount: '3-16',
    widthDiameter: 'Diameter',
    variants: [
      'Rope Laying',
      'Rope Braiding',
      'Strand Twisting'
    ],
    designs: [
      '3-Strand Rope',
      '8-Strand',
      '12-Strand',
      'Kernmantle',
      'Hawser Laid',
      'Cable Laid'
    ],
    patternType: 'Lay Type'
  },
  'OTHERS': {
    strandCount: 'Variable',
    widthDiameter: 'Variable',
    variants: [
      'Specialized braiding equipment',
      'Kumihimo',
      'Finger Loop'
    ],
    designs: [
      'As per requirement'
    ],
    patternType: 'Various'
  }
};

// Approval options (common across all machine types)
export const BRAIDING_APPROVAL_OPTIONS = WORK_ORDER_APPROVAL_OPTIONS;

// Helper function to get variants for a machine type
export const getBraidingVariants = (machineType) => {
  return BRAIDING_MACHINE_TYPES[machineType]?.variants || [];
};

// Helper function to get designs for a machine type
export const getBraidingDesigns = (machineType) => {
  return BRAIDING_MACHINE_TYPES[machineType]?.designs || [];
};

// Helper function to get pattern type label for a machine type
export const getBraidingPatternType = (machineType) => {
  return BRAIDING_MACHINE_TYPES[machineType]?.patternType || 'Pattern Name';
};

// Helper function to get strand count info for a machine type
export const getBraidingStrandCount = (machineType) => {
  return BRAIDING_MACHINE_TYPES[machineType]?.strandCount || '';
};

// Helper function to get width/diameter info for a machine type
export const getBraidingWidthDiameter = (machineType) => {
  return BRAIDING_MACHINE_TYPES[machineType]?.widthDiameter || '';
};


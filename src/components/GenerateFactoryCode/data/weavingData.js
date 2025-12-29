// Weaving Data for Work Order Specifications
// Based on the image specifications provided

// Weaving machine type specifications
export const WEAVING_MACHINE_TYPES = {
  'WATER JET': {
    variants: ['Standard Waterjet', 'High-Speed Waterjet'],
    designs: ['Plain', 'Twill', 'Satin', 'Taffeta', 'Pongee', 'Lining', 'Oxford'],
    reedRange: '',
    pickRange: ''
  },
  'AIRJET': {
    variants: ['Single Nozzle', 'Multi-Nozzle', 'Tandem Nozzle', 'Toyota', 'Tsudakoma', 'Picanol'],
    designs: ['Plain', 'Twill', 'Satin', 'Dobby', 'Light Jacquard', 'Shirting', 'Sheeting'],
    reedRange: '',
    pickRange: ''
  },
  'RAPIER': {
    variants: ['Single Rapier', 'Double Rapier', 'Flexible Rapier', 'Rigid Rapier', 'Picanol', 'Dornier', 'Itema'],
    designs: ['Plain', 'Twill', 'Satin', 'Dobby', 'Jacquard', 'Terry', 'Velvet', 'Double Cloth', 'Brocade'],
    reedRange: '',
    pickRange: ''
  },
  'PROJECTILE': {
    variants: ['Sulzer Type', 'Single Color', 'Multi-Color Weft'],
    designs: ['Plain', 'Twill', 'Satin', 'Canvas', 'Denim', 'Heavy Fabrics', 'Industrial'],
    reedRange: '',
    pickRange: ''
  },
  'DOBBY': {
    variants: ['Mechanical Dobby', 'Electronic Dobby', 'Rotary Dobby', 'Positive Dobby', 'Staubli'],
    designs: ['Honeycomb', 'Waffle', 'Huckaback', 'Birdseye', 'Pique', 'Bedford Cord', 'Crepe', 'Cord', 'Small Geometrics'],
    reedRange: '',
    pickRange: ''
  },
  'JACQUARD': {
    variants: ['Mechanical Jacquard', 'Electronic Jacquard', 'Single Lift', 'Double Lift', 'Staubli', 'Bonas'],
    designs: ['Damask', 'Brocade', 'Matelasse', 'Tapestry', 'Figured', 'Paisley', 'Floral', 'Geometric', 'Medallion', 'All Complex'],
    reedRange: '',
    pickRange: ''
  },
  'JUMBO JACQUARD': {
    variants: ['Wide Width Jacquard', 'High Density', '4000+ Hooks'],
    designs: ['Large Repeat Jacquard', 'Wide Damask', 'Photo-realistic', 'Complex Figured', 'Scenic'],
    reedRange: '',
    pickRange: ''
  },
  'FRAMELOOM': {
    variants: ['Vertical Frame', 'Horizontal Frame', 'Tapestry Loom', 'Shaft Handloom'],
    designs: ['Plain', 'Twill', 'Tapestry', 'Kilim', 'Soumak', 'Brocade', 'Ikat', 'Traditional'],
    reedRange: '',
    pickRange: ''
  },
  'HANDLOOM': {
    variants: ['Vertical Frame', 'Horizontal Frame', 'Tapestry Loom', 'Shaft Handloom'],
    designs: ['Plain', 'Twill', 'Tapestry', 'Kilim', 'Soumak', 'Brocade', 'Ikat', 'Traditional'],
    reedRange: '',
    pickRange: ''
  },
  'PITLOOM': {
    variants: ['Hand Pitloom', 'Semi-Auto Pitloom', 'Fly Shuttle Pitloom'],
    designs: ['Plain', 'Twill', 'Herringbone', 'Houndstooth', 'Basic Dobby', 'Stripes', 'Checks'],
    reedRange: '',
    pickRange: ''
  },
  'POWERLOOM': {
    variants: ['Plain Powerloom', 'Dobby Powerloom', 'Semi-Auto', 'Auto'],
    designs: ['Plain', 'Twill', 'Basic Dobby', 'Stripes', 'Checks', 'Sheeting'],
    reedRange: '',
    pickRange: ''
  },
  'PANJA LOOM': {
    variants: ['Traditional Panja', 'Modified Panja', 'Punja'],
    designs: ['Plain', 'Ribbed', 'Punja Weave', 'Striped', 'Checked', 'Flatweave'],
    reedRange: '',
    pickRange: ''
  },
  'SHUTTLELESS': {
    variants: ['Multiphase', 'Circular Weaving'],
    designs: ['Plain', 'Twill', 'Satin', 'Specialized'],
    reedRange: '',
    pickRange: ''
  },
  'NEEDLE LOOM': {
    variants: ['Narrow Width Needle', 'Label Loom', 'Ribbon Loom'],
    designs: ['Ribbons', 'Tapes', 'Labels', 'Elastics', 'Narrow Fabrics'],
    reedRange: '',
    pickRange: ''
  },
  'SOFT JET LOOM': {
    variants: ['Multi-Nozzle Soft Jet'],
    designs: ['Terry', 'Velour', 'Loop Pile'],
    reedRange: '8-14',
    pickRange: 'Variable'
  },
  'AIRJET WEAVING': {
    variants: ['Single Nozzle', 'Tandem Nozzle', 'Multi-Nozzle'],
    designs: ['Plain', 'Twill (2/1, 3/1)', 'Poplin', 'Sheeting'],
    reedRange: '12-20',
    pickRange: '40-150'
  },
  'WATERJET WEAVING': {
    variants: ['Single Pump', 'Multi-Pump'],
    designs: ['Plain', 'Twill', 'Satin (Synthetic Only)'],
    reedRange: '14-24',
    pickRange: '60-200'
  },
  'RAPIER JACQUARD': {
    variants: ['Single Rapier', 'Double Rapier with Electronic Jacquard 1408/2688/4096 hooks'],
    designs: ['Damask', 'Brocade', 'Floral', 'Geometric', 'Large Motifs'],
    reedRange: '6-16',
    pickRange: '80-400'
  },
  'RAPIER DOBBY': {
    variants: ['Flexible/Rigid Rapier with Staubli/Bonas Dobby 8-24 shafts'],
    designs: ['Dobby Stripes', 'Check', 'Waffle', 'Honeycomb', 'Pique', 'Huckaback'],
    reedRange: '8-18',
    pickRange: '60-300'
  },
  'LENO WEAVING': {
    variants: ['Doup Leno', 'Mock Leno'],
    designs: ['Net', 'Mesh', 'Open Weave', 'Mosquito Net'],
    reedRange: '4-10',
    pickRange: '20-80'
  },
  'NARROW WEAVING': {
    variants: ['Needle Loom', 'Shuttle-less Tape Loom'],
    designs: ['Labels', 'Tapes', 'Ribbons', 'Elastic Bands'],
    reedRange: 'Variable',
    pickRange: 'N/A'
  },
  'OTHERS': {
    variants: ['Any other specialized looms'],
    designs: ['As per requirement'],
    reedRange: '',
    pickRange: ''
  }
};

// Approval options (common across all weaving types)
export const WEAVING_APPROVAL_OPTIONS = [
  '1st PC',
  'SELF',
  'BUYER\'S',
  'PROTO',
  'FIT',
  'SIZE SET',
  'PP',
  'TOP SAMPLE'
];

// Helper function to get variants for a weaving machine type
export const getWeavingVariants = (machineType) => {
  return WEAVING_MACHINE_TYPES[machineType]?.variants || [];
};

// Helper function to get designs for a weaving machine type
export const getWeavingDesigns = (machineType) => {
  return WEAVING_MACHINE_TYPES[machineType]?.designs || [];
};

// Helper function to get reed range for a weaving machine type
export const getWeavingReedRange = (machineType) => {
  return WEAVING_MACHINE_TYPES[machineType]?.reedRange || '';
};

// Helper function to get pick range for a weaving machine type
export const getWeavingPickRange = (machineType) => {
  return WEAVING_MACHINE_TYPES[machineType]?.pickRange || '';
};

// Get all unique weaving machine types
export const getAllWeavingMachineTypes = () => {
  return Object.keys(WEAVING_MACHINE_TYPES);
};


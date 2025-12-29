// Quilting Data for Work Order Specifications
// Based on the image specifications provided

// Quilting type specifications
export const QUILTING_TYPES = {
  'MULTI NEEDLE': {
    variants: ['Lock Stitch', 'Chain Stitch', 'Multi-Head', 'Single Head Multi-Needle'],
    designs: ['Straight Line', 'Diamond', 'Square', 'Ogee', 'Channel', 'Box', 'Vermicelli', 'Wave', 'Clamshell', 'Custom Patterns'],
    stitchLength: '2-6mm',
    patternRepeat: 'Repeat Size',
    needleSpacing: '1-4 inch'
  },
  'SINGLE NEEDLE, LONGARM': {
    variants: ['Computerized Longarm', 'Manual Longarm', 'Domestic', 'Statler', 'Gammill', 'APQS'],
    designs: ['Free Motion', 'Edge-to-Edge', 'Custom', 'Pantograph', 'All-over', 'Block-based', 'Stipple', 'Feather', 'Any Design'],
    stitchLength: '1.5-4mm',
    patternRepeat: 'As Design',
    needleSpacing: 'N/A'
  },
  'MULTINEEDLE+EMBROIDERY': {
    variants: ['Combination Machines', 'Quilting + Embroidery Head'],
    designs: ['Quilted + Embroidered Designs', 'Logo + Quilt', 'Decorative Quilting', 'Embroidered Borders'],
    stitchLength: '2-4mm',
    patternRepeat: 'As Design',
    needleSpacing: 'Variable'
  },
  'SCHIFFLEY': {
    variants: ['Schiffli Frame', 'Continuous Pattern'],
    designs: ['Continuous Pattern', 'All-over Embroidered Quilt Look', 'Eyelet + Quilt'],
    stitchLength: '1.5-3mm',
    patternRepeat: 'Frame Repeat',
    needleSpacing: 'Frame Width'
  },
  'PESCE SLIDING': {
    variants: ['Continuous Sliding', 'Intermittent'],
    designs: ['Large Repeat Patterns', 'Continuous Designs', 'Wide Patterns'],
    stitchLength: '2-5mm',
    patternRepeat: 'Large Repeat',
    needleSpacing: 'Frame Width'
  },
  'ULTRASONIC': {
    variants: ['Ultrasonic Bonding', 'Thermal Bonding', 'No Thread'],
    designs: ['Geometric Patterns', 'Clean Lines', 'No Thread Patterns', 'Technical'],
    stitchLength: 'N/A (Bond)',
    patternRepeat: 'Roller Repeat',
    needleSpacing: 'Roller Pattern'
  },
  'HAND QUILTING': {
    variants: ['Hand Stitch', 'Big Stitch', 'Running Stitch', 'Kantha', 'Sashiko'],
    designs: ['Running Stitch', 'Kantha', 'Sashiko', 'Trapunto', 'Echo', 'Stipple', 'Custom', 'Wholecloth', 'Medallion'],
    stitchLength: '2-10mm',
    patternRepeat: 'As Design',
    needleSpacing: 'N/A'
  },
  'TRAPUNTO': {
    variants: ['Stuffed Quilting', 'Corded Quilting', 'Raised'],
    designs: ['Raised/Stuffed Designs', 'Corded', 'Boutis', 'High Relief Patterns'],
    stitchLength: '1.5-3mm',
    patternRepeat: 'As Design',
    needleSpacing: 'N/A'
  },
  'OTHERS': {
    variants: ['Tack Quilting', 'Tie Quilting', 'Specialized'],
    designs: ['As per requirement'],
    stitchLength: 'Variable',
    patternRepeat: 'Various',
    needleSpacing: 'Variable'
  }
};

// Approval options (common across all quilting types)
export const QUILTING_APPROVAL_OPTIONS = [
  '1st PC',
  'SELF',
  'BUYER\'S',
  'PROTO',
  'FIT',
  'SIZE SET',
  'PP',
  'TOP SAMPLE'
];

// Helper function to get variants for a quilting type
export const getQuiltingVariants = (quiltingType) => {
  return QUILTING_TYPES[quiltingType]?.variants || [];
};

// Helper function to get designs for a quilting type
export const getQuiltingDesigns = (quiltingType) => {
  return QUILTING_TYPES[quiltingType]?.designs || [];
};

// Helper function to get stitch length format for a quilting type
export const getQuiltingStitchLength = (quiltingType) => {
  return QUILTING_TYPES[quiltingType]?.stitchLength || '';
};

// Helper function to get pattern repeat format for a quilting type
export const getQuiltingPatternRepeat = (quiltingType) => {
  return QUILTING_TYPES[quiltingType]?.patternRepeat || '';
};

// Helper function to get needle spacing format for a quilting type
export const getQuiltingNeedleSpacing = (quiltingType) => {
  return QUILTING_TYPES[quiltingType]?.needleSpacing || '';
};

// Helper function to check if stitch length is applicable (not N/A)
export const isQuiltingStitchLengthApplicable = (quiltingType) => {
  const stitchLength = getQuiltingStitchLength(quiltingType);
  return stitchLength && stitchLength !== 'N/A (Bond)' && stitchLength !== 'Variable';
};

// Helper function to check if needle spacing is applicable (not N/A)
export const isQuiltingNeedleSpacingApplicable = (quiltingType) => {
  const needleSpacing = getQuiltingNeedleSpacing(quiltingType);
  return needleSpacing && needleSpacing !== 'N/A' && needleSpacing !== 'Variable';
};

// Get all unique quilting types
export const getAllQuiltingTypes = () => {
  return Object.keys(QUILTING_TYPES);
};


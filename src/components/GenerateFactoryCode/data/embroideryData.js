import { WORK_ORDER_APPROVAL_OPTIONS } from './approvalOptions';
// Embroidery Data for Work Order Specifications
// Based on the image specifications provided

// Embroidery machine type specifications
export const EMBROIDERY_MACHINE_TYPES = {
  'SINGLE THREAD, AARI': {
    variants: ['Aari Hook Work', 'Chain Stitch Machine', 'Tambour', 'Crewel'],
    designs: ['Chain Stitch Patterns', 'Floral', 'Paisley', 'Kashmiri', 'Traditional', 'Crewel', 'Jacobean', 'Tree of Life'],
    threadColors: '1-20',
    stitchCount: 'Numeric',
    hoopFrameSize: 'Frame Size',
    approvalOptions: ['1st PC', 'SELF', 'BUYER\'S']
  },
  'DORI/CORD': {
    variants: ['Cord Work', 'Cording', 'Gimp', 'Soutache'],
    designs: ['Raised Patterns', 'Cord Outlines', 'Textured Designs', 'Scrolls', 'Borders'],
    threadColors: 'Cord Colors',
    stitchCount: 'Length (m)',
    hoopFrameSize: 'Frame Size',
    approvalOptions: ['1st PC', 'SELF', 'BUYER\'S']
  },
  'HAND EMBROIDERY': {
    variants: ['Phulkari', 'Bagh', 'Chope', 'Sainchi'],
    designs: ['Geometric', 'Floral', 'Traditional Motifs', 'All-over', 'Bagh Pattern'],
    threadColors: '1-20',
    stitchCount: 'N/A',
    hoopFrameSize: 'N/A',
    approvalOptions: ['1st PC', 'SELF', 'BUYER\'S']
  },
  'MULTI THREAD, ZARDOZI': {
    variants: ['Zardozi', 'Dabka', 'Bullion', 'Metallic', 'Gota', 'Mukaish'],
    designs: ['Heavy Embroidery', 'Bridal', 'Royal', 'Traditional', 'Mughal', 'Floral', 'Paisley'],
    threadColors: 'Multiple',
    stitchCount: 'N/A',
    hoopFrameSize: 'Frame Size',
    approvalOptions: ['1st PC', 'SELF', 'BUYER\'S']
  },
  'SINGLE THREAD': {
    variants: ['Surface Embroidery', 'Crewel', 'Freestyle'],
    designs: ['Satin', 'Stem', 'Chain', 'French Knot', 'Bullion', 'Lazy Daisy', 'Long & Short', 'All Hand Stitches'],
    threadColors: '1-10',
    stitchCount: 'N/A',
    hoopFrameSize: 'Hoop Size',
    approvalOptions: ['1st PC', 'SELF', 'BUYER\'S']
  },
  'COUCHING': {
    variants: ['Basic Couching', 'Bokhara', 'Romanian', 'Goldwork'],
    designs: ['Laid Work', 'Textured Lines', 'Gold Work', 'Metal Thread', 'Ecclesiastical'],
    threadColors: 'Base + Couching',
    stitchCount: 'Cord Length',
    hoopFrameSize: 'Frame Size',
    approvalOptions: ['1st PC', 'SELF', 'BUYER\'S']
  },
  'PIN TUCKING': {
    variants: ['Machine Pin Tuck', 'Twin Needle', 'Corded Tuck'],
    designs: ['Parallel Tucks', 'Cross Tucks', 'Decorative Tucks', 'Shell Tucks', 'Curved'],
    threadColors: '1-2',
    stitchCount: 'Tuck Count',
    hoopFrameSize: 'N/A',
    approvalOptions: ['1st PC', 'SELF', 'BUYER\'S']
  },
  'PLEATING': {
    variants: ['Machine Pleating', 'Crystal', 'Box', 'Knife', 'Accordion'],
    designs: ['Crystal', 'Box', 'Knife', 'Accordion', 'Sunburst', 'Mushroom', 'Fortuny', 'Cartridge'],
    threadColors: 'N/A',
    stitchCount: 'Pleat Count',
    hoopFrameSize: 'Panel Size',
    approvalOptions: ['1st PC', 'SELF', 'BUYER\'S']
  },
  'SINGLE HEAD': {
    variants: ['Single Needle', 'Multi-Needle (6-15)', 'Tajima', 'Brother', 'SWF'],
    designs: ['All Digitized', 'Satin', 'Fill', 'Running', '3D Puff', 'Applique', 'Sequin', 'Logo', 'Monogram', 'Custom'],
    threadColors: '1-15',
    stitchCount: '100-500000',
    hoopFrameSize: 'Hoop Size',
    approvalOptions: ['1st PC', 'SELF', 'BUYER\'S']
  },
  'MULTI HEAD': {
    variants: ['4-Head to 56-Head', 'Bridge Type', 'Barudan', 'Tajima', 'SWF'],
    designs: ['All Digitized Designs', 'Mass Production', 'Consistent Quality', 'Applique', 'Sequin'],
    threadColors: '1-15 per head',
    stitchCount: '100-500000',
    hoopFrameSize: 'Hoop Size',
    approvalOptions: ['1st PC', 'SELF', 'BUYER\'S']
  },
  'SCHIFFLEY': {
    variants: ['Schiffli Frame', 'Automat', 'Lace Machine'],
    designs: ['All-over Patterns', 'Lace', 'Eyelet', 'Continuous', 'Chemical Lace', 'Guipure', 'Cutwork'],
    threadColors: '1-12',
    stitchCount: 'Per Repeat',
    hoopFrameSize: 'Frame Width',
    approvalOptions: ['1st PC', 'SELF', 'BUYER\'S']
  },
  'APPLIQUE': {
    variants: ['Cut Applique', 'Raw Edge', 'Turned Edge', 'Reverse', 'Laser Cut'],
    designs: ['Layered Designs', 'Shapes', 'Logos', 'Decorative', 'Cutwork Applique'],
    threadColors: '2-10',
    stitchCount: 'Stitch Around',
    hoopFrameSize: 'Hoop/Frame',
    approvalOptions: ['1st PC', 'SELF', 'BUYER\'S']
  },
  'CHIKANKARI': {
    variants: ['Shadow Work', 'Jaali', 'Tepchi', 'Murri', 'Phanda', 'Bakhiya'],
    designs: ['Lucknowi', 'Floral', 'Paisley', 'Jaali (Net)', 'All Chikan Stitches', 'White-on-White'],
    threadColors: '1-3',
    stitchCount: 'N/A',
    hoopFrameSize: 'N/A',
    approvalOptions: ['1st PC', 'SELF', 'BUYER\'S']
  },
  'OTHERS': {
    variants: ['Cutwork', 'Hardanger', 'Broderie Anglaise', 'Specialized'],
    designs: ['As per requirement'],
    threadColors: 'Variable',
    stitchCount: 'Variable',
    hoopFrameSize: 'Various',
    approvalOptions: ['1st PC', 'SELF', 'BUYER\'S']
  }
};

// Approval options (common across all embroidery types)
export const EMBROIDERY_APPROVAL_OPTIONS = WORK_ORDER_APPROVAL_OPTIONS;

// Helper function to get variants for an embroidery machine type
export const getEmbroideryVariants = (machineType) => {
  return EMBROIDERY_MACHINE_TYPES[machineType]?.variants || [];
};

// Helper function to get designs for an embroidery machine type
export const getEmbroideryDesigns = (machineType) => {
  return EMBROIDERY_MACHINE_TYPES[machineType]?.designs || [];
};

// Helper function to get thread colors format for an embroidery machine type
export const getEmbroideryThreadColors = (machineType) => {
  return EMBROIDERY_MACHINE_TYPES[machineType]?.threadColors || '';
};

// Helper function to get stitch count format for an embroidery machine type
export const getEmbroideryStitchCount = (machineType) => {
  return EMBROIDERY_MACHINE_TYPES[machineType]?.stitchCount || '';
};

// Helper function to get hoop/frame size format for an embroidery machine type
export const getEmbroideryHoopFrameSize = (machineType) => {
  return EMBROIDERY_MACHINE_TYPES[machineType]?.hoopFrameSize || '';
};

// Helper function to check if stitch count is applicable (not N/A)
export const isEmbroideryStitchCountApplicable = (machineType) => {
  const stitchCount = getEmbroideryStitchCount(machineType);
  return stitchCount && stitchCount !== 'N/A' && stitchCount !== 'Variable';
};

// Helper function to check if hoop/frame size is applicable (not N/A)
export const isEmbroideryHoopFrameSizeApplicable = (machineType) => {
  const hoopFrameSize = getEmbroideryHoopFrameSize(machineType);
  return hoopFrameSize && hoopFrameSize !== 'N/A' && hoopFrameSize !== 'Variable' && hoopFrameSize !== 'Various';
};

// Get all unique embroidery machine types
export const getAllEmbroideryMachineTypes = () => {
  return Object.keys(EMBROIDERY_MACHINE_TYPES);
};


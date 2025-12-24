// Advanced Filter Data for Fiber Specifications
// Based on the images provided

export const FIBER_CATEGORIES = [
  'Natural - Cellulosic',
  'Synthetic',
  'Regenerated - Cellulosic',
  'Natural - Protein',
  'Natural - Bast',
  'Technical/High Performance',
  'Natural - Leaf',
  'Natural - Fruit',
  'Blended'
];

export const ORIGINS = [
  'Plant (Seed)',
  'Petroleum',
  'Wood Pulp',
  'Animal (Sheep)',
  'Plant (Flax)',
  'Insect (Silkworm)',
  'Petroleum',
  'Various',
  'Plant',
  'Coconut',
  'Mixed'
];

export const TESTING_REQUIREMENTS = [
  'Content'
];

// Get all unique spinning methods from textile fiber data
export const getAllSpinningMethods = (textileFiberData) => {
  const spinningMethods = new Set();
  
  Object.keys(textileFiberData).forEach(fiberType => {
    Object.keys(textileFiberData[fiberType]).forEach(yarnType => {
      const spinningMethod = textileFiberData[fiberType][yarnType].spinningMethod;
      if (spinningMethod) {
        // Add the full spinning method
        spinningMethods.add(spinningMethod);
        // If spinning method contains a slash, also add individual parts as options
        if (spinningMethod.includes('/')) {
          spinningMethod.split('/').forEach(method => {
            const trimmed = method.trim();
            if (trimmed) {
              spinningMethods.add(trimmed);
            }
          });
        }
      }
    });
  });
  
  return Array.from(spinningMethods).sort();
};

// Fiber Type to Category mapping (based on images)
export const FIBER_TYPE_TO_CATEGORY = {
  'Cotton': 'Natural - Cellulosic',
  'Polyester': 'Synthetic',
  'Viscose': 'Regenerated - Cellulosic',
  'Viscose/Rayon': 'Regenerated - Cellulosic',
  'Wool': 'Natural - Protein',
  'Linen': 'Natural - Bast',
  'Linen/Flax': 'Natural - Bast',
  'Silk': 'Natural - Protein',
  'Nylon': 'Synthetic',
  'Nylon/Polyamide': 'Synthetic',
  'Acrylic': 'Synthetic',
  'Elastane': 'Synthetic',
  'Technical': 'Technical/High Performance',
  'Specialty/Technical': 'Technical/High Performance',
  'Jute': 'Natural - Bast',
  'Jute & Bast Fibers': 'Natural - Bast',
  'Hemp': 'Natural - Bast',
  'Ramie': 'Natural - Bast',
  'Sisal': 'Natural - Leaf',
  'Coir': 'Natural - Fruit',
  'Cotton Blend': 'Blended',
  'Cotton Blends': 'Blended',
  'Polyester Blend': 'Blended',
  'Polyester Blends': 'Blended',
  'Wool Blend': 'Blended',
  'Wool Blends': 'Blended',
  'Viscose Blend': 'Blended',
  'Viscose/Regenerated Blends': 'Blended'
};

// Fiber Type to Origin mapping (based on images)
export const FIBER_TYPE_TO_ORIGIN = {
  'Cotton': 'Plant (Seed)',
  'Polyester': 'Petroleum',
  'Viscose': 'Wood Pulp',
  'Viscose/Rayon': 'Wood Pulp',
  'Wool': 'Animal (Sheep)',
  'Linen': 'Plant (Flax)',
  'Linen/Flax': 'Plant (Flax)',
  'Silk': 'Insect (Silkworm)',
  'Nylon': 'Petroleum',
  'Nylon/Polyamide': 'Petroleum',
  'Acrylic': 'Petroleum',
  'Elastane': 'Petroleum',
  'Technical': 'Various',
  'Specialty/Technical': 'Various',
  'Jute': 'Plant',
  'Jute & Bast Fibers': 'Plant',
  'Hemp': 'Plant',
  'Ramie': 'Plant',
  'Sisal': 'Plant',
  'Coir': 'Coconut',
  'Cotton Blend': 'Mixed',
  'Cotton Blends': 'Mixed',
  'Polyester Blend': 'Mixed',
  'Polyester Blends': 'Mixed',
  'Wool Blend': 'Mixed',
  'Wool Blends': 'Mixed',
  'Viscose Blend': 'Mixed',
  'Viscose/Regenerated Blends': 'Mixed'
};


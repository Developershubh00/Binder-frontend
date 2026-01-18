import { TEXTILE_FABRIC_DATA } from './textileFabricData';

// Get all fiber types from TEXTILE_FABRIC_DATA
export const getTextileFabricFiberTypes = () => {
  return Object.keys(TEXTILE_FABRIC_DATA);
};

// Get all fabric names for a given fiber type (case-insensitive)
export const getTextileFabricNames = (fiberType) => {
  if (!fiberType) return [];
  // Find matching fiber type (case-insensitive)
  const matchingFiberType = Object.keys(TEXTILE_FABRIC_DATA).find(
    key => key.toLowerCase() === fiberType.toLowerCase()
  );
  if (!matchingFiberType || !TEXTILE_FABRIC_DATA[matchingFiberType]) return [];
  return Object.keys(TEXTILE_FABRIC_DATA[matchingFiberType]);
};

// Get fabric details for a given fiber type and fabric name (case-insensitive)
export const getTextileFabricDetails = (fiberType, fabricName) => {
  if (!fiberType || !fabricName) return null;
  // Find matching fiber type (case-insensitive)
  const matchingFiberType = Object.keys(TEXTILE_FABRIC_DATA).find(
    key => key.toLowerCase() === fiberType.toLowerCase()
  );
  if (!matchingFiberType || !TEXTILE_FABRIC_DATA[matchingFiberType]) return null;
  // Find matching fabric name (case-insensitive)
  const matchingFabricName = Object.keys(TEXTILE_FABRIC_DATA[matchingFiberType]).find(
    key => key.toLowerCase() === fabricName.toLowerCase()
  );
  if (!matchingFabricName) return null;
  return TEXTILE_FABRIC_DATA[matchingFiberType][matchingFabricName];
};

// Get all unique compositions from the data
export const getAllCompositions = () => {
  const compositions = new Set();
  Object.keys(TEXTILE_FABRIC_DATA).forEach(fiberType => {
    Object.keys(TEXTILE_FABRIC_DATA[fiberType]).forEach(fabricName => {
      const fabric = TEXTILE_FABRIC_DATA[fiberType][fabricName];
      if (fabric && fabric.composition) {
        compositions.add(fabric.composition);
      }
    });
  });
  return Array.from(compositions).sort();
};

// Get composition for a specific fabric
export const getFabricComposition = (fiberType, fabricName) => {
  const details = getTextileFabricDetails(fiberType, fabricName);
  return details ? details.composition : '';
};

// Get all unique construction types
export const getAllConstructionTypes = () => {
  const types = new Set();
  Object.keys(TEXTILE_FABRIC_DATA).forEach(fiberType => {
    Object.keys(TEXTILE_FABRIC_DATA[fiberType]).forEach(fabricName => {
      const fabric = TEXTILE_FABRIC_DATA[fiberType][fabricName];
      if (fabric && fabric['construction type']) {
        types.add(fabric['construction type']);
      }
    });
  });
  return Array.from(types).sort();
};

// Get all unique weave/knit types
export const getAllWeaveKnitTypes = () => {
  const types = new Set();
  Object.keys(TEXTILE_FABRIC_DATA).forEach(fiberType => {
    Object.keys(TEXTILE_FABRIC_DATA[fiberType]).forEach(fabricName => {
      const fabric = TEXTILE_FABRIC_DATA[fiberType][fabricName];
      if (fabric && fabric['weave/knit type']) {
        // Split by comma or slash if it's a string with separators
        const weaveKnitType = fabric['weave/knit type'];
        if (typeof weaveKnitType === 'string' && (weaveKnitType.includes(',') || weaveKnitType.includes('/'))) {
          weaveKnitType.split(/[,/]/).forEach(opt => {
            const trimmed = opt.trim();
            if (trimmed) types.add(trimmed);
          });
        } else {
          types.add(weaveKnitType);
        }
      }
    });
  });
  return Array.from(types).sort();
};

// Get all approval options
export const getAllApprovalOptions = () => {
  const approvals = new Set();
  Object.keys(TEXTILE_FABRIC_DATA).forEach(fiberType => {
    Object.keys(TEXTILE_FABRIC_DATA[fiberType]).forEach(fabricName => {
      const fabric = TEXTILE_FABRIC_DATA[fiberType][fabricName];
      if (fabric && fabric.approval && Array.isArray(fabric.approval)) {
        fabric.approval.forEach(approval => {
          approvals.add(approval);
        });
      }
    });
  });
  // Add standard approval options
  const standardApprovals = ['BUYER', 'PROTO', 'FIT', 'SIZE SET', 'PP', 'TOP SAMPLE'];
  standardApprovals.forEach(approval => approvals.add(approval));
  return Array.from(approvals).sort();
};

// Get composition options for a specific fabric (handles comma and slash separators)
export const getFabricCompositionOptions = (fiberType, fabricName) => {
  const details = getTextileFabricDetails(fiberType, fabricName);
  if (details && details.composition) {
    const composition = details.composition;
    // If it's a string with comma or slash separators, split them
    if (typeof composition === 'string' && (composition.includes(',') || composition.includes('/'))) {
      return composition.split(/[,/]/).map(opt => opt.trim()).filter(opt => opt);
    }
    return [composition];
  }
  return [];
};

// Get construction type options for a specific fabric
export const getFabricConstructionTypeOptions = (fiberType, fabricName) => {
  const details = getTextileFabricDetails(fiberType, fabricName);
  if (details && details['construction type']) {
    return [details['construction type']];
  }
  return [];
};

// Get weave/knit type options for a specific fabric
export const getFabricWeaveKnitTypeOptions = (fiberType, fabricName) => {
  const details = getTextileFabricDetails(fiberType, fabricName);
  if (details && details['weave/knit type']) {
    const weaveKnitType = details['weave/knit type'];
    // If it's a string with comma or slash separators, split them
    if (typeof weaveKnitType === 'string' && (weaveKnitType.includes(',') || weaveKnitType.includes('/'))) {
      return weaveKnitType.split(/[,/]/).map(opt => opt.trim()).filter(opt => opt);
    }
    return [weaveKnitType];
  }
  return [];
};

// Get approval options for a specific fabric
export const getFabricApprovalOptions = (fiberType, fabricName) => {
  const details = getTextileFabricDetails(fiberType, fabricName);
  if (details && details.approval && Array.isArray(details.approval)) {
    return details.approval;
  }
  return [];
};


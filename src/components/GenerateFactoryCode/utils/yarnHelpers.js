import TEXTILE_FIBER_DATA from '../data/textileFiberData';

export const getFiberTypes = () => {
  return Object.keys(TEXTILE_FIBER_DATA);
};

export const getYarnTypes = (fiberType) => {
  if (!fiberType || !TEXTILE_FIBER_DATA[fiberType]) return [];
  return Object.keys(TEXTILE_FIBER_DATA[fiberType]);
};

export const getSpinningMethod = (fiberType, yarnType) => {
  if (!fiberType || !yarnType || !TEXTILE_FIBER_DATA[fiberType] || !TEXTILE_FIBER_DATA[fiberType][yarnType]) {
    return null;
  }
  return TEXTILE_FIBER_DATA[fiberType][yarnType].spinningMethod;
};

export const getYarnDetails = (fiberType, yarnType) => {
  if (!fiberType || !yarnType || !TEXTILE_FIBER_DATA[fiberType] || !TEXTILE_FIBER_DATA[fiberType][yarnType]) {
    return null;
  }
  const details = TEXTILE_FIBER_DATA[fiberType][yarnType];
  return {
    composition: details.composition || '',
    countRange: details.countRange || '',
    spinningMethod: details.spinningMethod,
    countSystem: details.countSystem,
    doublingOptions: details.doublingOptions,
    plyOptions: details.plyOptions,
    windingOptions: details.windingOptions
  };
};

// Get yarn-specific options (case-insensitive)
export const getYarnCompositionOptions = (fiberType, yarnType) => {
  const details = getYarnDetails(fiberType, yarnType);
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

export const getYarnCountRangeOptions = (fiberType, yarnType) => {
  const details = getYarnDetails(fiberType, yarnType);
  if (details && details.countRange) {
    return [details.countRange];
  }
  return [];
};

export const getYarnDoublingOptions = (fiberType, yarnType) => {
  const details = getYarnDetails(fiberType, yarnType);
  if (details && details.doublingOptions) {
    // If it's a string, split by comma or slash and trim
    if (typeof details.doublingOptions === 'string') {
      return details.doublingOptions.split(/[,/]/).map(opt => opt.trim()).filter(opt => opt);
    }
    return [details.doublingOptions];
  }
  return [];
};

export const getYarnPlyOptions = (fiberType, yarnType) => {
  const details = getYarnDetails(fiberType, yarnType);
  if (details && details.plyOptions) {
    // If it's an array, convert to string array
    if (Array.isArray(details.plyOptions)) {
      return details.plyOptions.map(opt => String(opt));
    }
    // If it's a string, split by comma or slash and trim
    if (typeof details.plyOptions === 'string') {
      return details.plyOptions.split(/[,/]/).map(opt => opt.trim()).filter(opt => opt);
    }
    return [String(details.plyOptions)];
  }
  return [];
};

export const getYarnSpinningMethodOptions = (fiberType, yarnType) => {
  const details = getYarnDetails(fiberType, yarnType);
  if (details && details.spinningMethod) {
    const spinningMethod = details.spinningMethod;
    // If it's a string with comma or slash separators, split them
    if (typeof spinningMethod === 'string' && (spinningMethod.includes(',') || spinningMethod.includes('/'))) {
      return spinningMethod.split(/[,/]/).map(opt => opt.trim()).filter(opt => opt);
    }
    return [spinningMethod];
  }
  return [];
};

export const getYarnWindingOptions = (fiberType, yarnType) => {
  const details = getYarnDetails(fiberType, yarnType);
  if (details && details.windingOptions) {
    // If it's a string, split by comma or slash and trim
    if (typeof details.windingOptions === 'string') {
      return details.windingOptions.split(/[,/]/).map(opt => opt.trim()).filter(opt => opt);
    }
    return [details.windingOptions];
  }
  return [];
};


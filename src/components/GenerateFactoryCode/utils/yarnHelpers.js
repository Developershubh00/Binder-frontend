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
    spinningMethod: details.spinningMethod,
    countSystem: details.countSystem,
    doublingOptions: details.doublingOptions,
    plyOptions: details.plyOptions,
    windingOptions: details.windingOptions
  };
};


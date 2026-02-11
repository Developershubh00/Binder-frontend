// Product and Subproduct categories with their codes
// Used in Step0 PRODUCT and SUBPRODUCT searchable dropdowns

export const PRODUCT_SUBPRODUCT_OPTIONS = [
  { category: 'RUG', code: '' },
  { category: 'BATHRUG', code: '' },
  { category: 'BATHMAT', code: '' },
  { category: 'CARPET', code: '' },
  { category: 'TREE SKIRT', code: '' },
  { category: 'TOTE BAGS', code: '' },
  { category: 'BAGS', code: '' },
  { category: 'CUSHION', code: '' },
  { category: 'APRON', code: '' },
  { category: 'TABLE RUNNER', code: '' },
  { category: 'PLACEMAT', code: '' },
  { category: 'KITCHEN GLOVES', code: '' },
  { category: 'THROW', code: '' },
  { category: 'BLANKETS', code: '' },
  { category: 'COMFORTER', code: '' },
  { category: 'QUILT', code: '' },
  { category: 'DUVET', code: '' },
  { category: 'SHEET SET', code: '' },
  { category: 'CURTAIN', code: '' },
  { category: 'SHOWER CURTAIN', code: '' },
  { category: 'BATHROB', code: '' },
  { category: 'TOWEL', code: '' },
  { category: 'BASKET', code: '' },
  { category: 'OTTOMAN', code: '' },
  { category: 'PET BED', code: '' },
  { category: 'SOFT TOY', code: '' },
  { category: 'FLOOR CUSHION', code: '' },
  { category: 'CHAIRPAD', code: '' },
  { category: 'SHAM', code: '' },
  { category: 'PACKAGING BAG', code: '' },
];

// Options for SearchableDropdown: "CATEGORY (CODE)"
export const PRODUCT_SUBPRODUCT_DROPDOWN_OPTIONS = PRODUCT_SUBPRODUCT_OPTIONS.map(
  (item) => `${item.category} ${item.code}`
);

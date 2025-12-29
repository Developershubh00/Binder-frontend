// Fabric Data - Based on images provided
// This data structure maps Fiber Type -> Fabric Name -> Fabric Details

const FABRIC_DATA = {
  'Cotton': {
    'Percale': {
      composition: '100% Cotton',
      constructionType: 'Woven - Plain Weave',
      weaveKnitType: '1x1 Plain'
    },
    'Poplin': {
      composition: '100% Cotton',
      constructionType: 'Woven - Plain Weave',
      weaveKnitType: '1x1 Plain (fine rib)'
    },
    'Muslin': {
      composition: '100% Cotton',
      constructionType: 'Woven - Plain Weave',
      weaveKnitType: '1x1 Plain (loose)'
    },
    'Voile': {
      composition: '100% Cotton',
      constructionType: 'Woven - Plain Weave',
      weaveKnitType: '1x1 Plain (sheer)'
    },
    'Lawn': {
      composition: '100% Cotton',
      constructionType: 'Woven - Plain Weave',
      weaveKnitType: '1x1 Plain (fine)'
    },
    'Cambric': {
      composition: '100% Cotton',
      constructionType: 'Woven - Plain Weave',
      weaveKnitType: '1x1 Plain (calendered)'
    },
    'Organdy': {
      composition: '100% Cotton',
      constructionType: 'Woven - Plain Weave',
      weaveKnitType: '1x1 Plain (crisp/sheer)'
    },
    'Sheeting': {
      composition: '100% Cotton',
      constructionType: 'Woven - Plain Weave',
      weaveKnitType: '1x1 Plain (medium)'
    },
    'Canvas': {
      composition: '100% Cotton',
      constructionType: 'Woven - Plain Weave',
      weaveKnitType: '1x1 Plain (heavy)'
    },
    'Duck': {
      composition: '100% Cotton',
      constructionType: 'Woven - Plain Weave',
      weaveKnitType: '2x2 Basket'
    },
    'Oxford': {
      composition: '100% Cotton',
      constructionType: 'Woven - Plain Weave',
      weaveKnitType: '2x2 Basket'
    },
    'Chambray': {
      composition: '100% Cotton',
      constructionType: 'Woven - Plain Weave',
      weaveKnitType: '1x1 Plain (colored warp)'
    },
    'Gingham': {
      composition: '100% Cotton',
      constructionType: 'Woven - Plain Weave',
      weaveKnitType: '1x1 Plain (check pattern)'
    },
    'Seersucker': {
      composition: '100% Cotton',
      constructionType: 'Woven - Plain Weave',
      weaveKnitType: '1x1 Plain (puckered)'
    },
    'Denim': {
      composition: '100% Cotton',
      constructionType: 'Woven - Twill Weave',
      weaveKnitType: '3x1 Right Hand Twill'
    },
    'Chino/Khaki': {
      composition: '100% Cotton',
      constructionType: 'Woven - Twill Weave',
      weaveKnitType: '2x2 Twill'
    },
    'Gabardine': {
      composition: '100% Cotton',
      constructionType: 'Woven - Twill Weave',
      weaveKnitType: '2x2 Steep Twill (45-63°)'
    },
    'Drill': {
      composition: '100% Cotton',
      constructionType: 'Woven - Twill Weave',
      weaveKnitType: '3x1 or 2x1 Twill'
    },
    'Twill (Basic)': {
      composition: '100% Cotton',
      constructionType: 'Woven - Twill Weave',
      weaveKnitType: '2x1 or 2x2 Twill'
    },
    'Herringbone': {
      composition: '100% Cotton',
      constructionType: 'Woven - Twill Weave',
      weaveKnitType: 'Broken Twill (V-pattern)'
    },
    'Cotton Flannel': {
      composition: '100% Cotton',
      constructionType: 'Woven - Twill Weave',
      weaveKnitType: '2x2 Twill (brushed)'
    },
    'Sateen': {
      composition: '100% Cotton',
      constructionType: 'Woven - Satin Weave',
      weaveKnitType: '4/1 or 5/1 Weft Satin'
    },
    'Cotton Damask': {
      composition: '100% Cotton',
      constructionType: 'Woven - Jacquard',
      weaveKnitType: 'Jacquard (reversible pattern)'
    },
    'Dobby Cotton': {
      composition: '100% Cotton',
      constructionType: 'Woven - Dobby',
      weaveKnitType: 'Dobby (small geometric)'
    },
    'Piqué': {
      composition: '100% Cotton',
      constructionType: 'Woven - Dobby',
      weaveKnitType: 'Dobby (raised cords)'
    },
    'Waffle Cloth': {
      composition: '100% Cotton',
      constructionType: 'Woven - Dobby',
      weaveKnitType: 'Honeycomb Weave'
    },
    'Matelassé': {
      composition: '100% Cotton',
      constructionType: 'Woven - Jacquard',
      weaveKnitType: 'Double Cloth Jacquard'
    },
    'Terry Cloth': {
      composition: '100% Cotton',
      constructionType: 'Woven - Pile Weave',
      weaveKnitType: 'Loop Pile (uncut)'
    },
    'Velveteen': {
      composition: '100% Cotton',
      constructionType: 'Woven - Pile Weave',
      weaveKnitType: 'Weft Cut Pile'
    },
    'Corduroy': {
      composition: '100% Cotton',
      constructionType: 'Woven - Pile Weave',
      weaveKnitType: 'Weft Cut Pile (ribs/wales)'
    },
    'Cotton Chenille': {
      composition: '100% Cotton',
      constructionType: 'Woven - Pile Weave',
      weaveKnitType: 'Chenille Yarn Pile'
    },
    'Gauze/Leno': {
      composition: '100% Cotton',
      constructionType: 'Woven - Leno/Open',
      weaveKnitType: 'Leno (crossed warp)'
    },
    'Cotton Crepe': {
      composition: '100% Cotton',
      constructionType: 'Woven - Crepe',
      weaveKnitType: 'Crepe Weave (crinkled)'
    },
    'Double Cloth': {
      composition: '100% Cotton',
      constructionType: 'Woven - Double Cloth',
      weaveKnitType: 'Two-layer Woven'
    },
    'Single Jersey': {
      composition: '100% Cotton',
      constructionType: 'Knitted - Weft Knit',
      weaveKnitType: 'Single Jersey (plain)'
    },
    'Interlock': {
      composition: '100% Cotton',
      constructionType: 'Knitted - Weft Knit',
      weaveKnitType: 'Interlock (double knit)'
    },
    'Rib Knit': {
      composition: '100% Cotton',
      constructionType: 'Knitted - Weft Knit',
      weaveKnitType: '1x1 or 2x2 Rib'
    },
    'French Terry': {
      composition: '100% Cotton',
      constructionType: 'Knitted - Weft Knit',
      weaveKnitType: 'Terry Loop Back'
    },
    'Cotton Fleece': {
      composition: '100% Cotton',
      constructionType: 'Knitted - Weft Knit',
      weaveKnitType: 'Brushed Loop Back'
    },
    'Piqué Knit': {
      composition: '100% Cotton',
      constructionType: 'Knitted - Weft Knit',
      weaveKnitType: 'Piqué/Lacoste Knit'
    },
    'Taffeta': {
      composition: '100% Cotton',
      constructionType: 'Woven - Plain Weave',
      weaveKnitType: '1x1 Plain (crisp)'
    },
    'Chiffon': {
      composition: '100% Cotton',
      constructionType: 'Woven - Plain Weave',
      weaveKnitType: '1x1 Plain (sheer)'
    },
    'Georgette': {
      composition: '100% Cotton',
      constructionType: 'Woven - Plain Weave',
      weaveKnitType: '1x1 Plain (crepe twist)'
    }
  },
  'Polyester': {
    'Taffeta': {
      composition: '100% Polyester',
      constructionType: 'Woven - Plain Weave',
      weaveKnitType: '1x1 Plain (crisp)'
    },
    'Chiffon': {
      composition: '100% Polyester',
      constructionType: 'Woven - Plain Weave',
      weaveKnitType: '1x1 Plain (sheer)'
    },
    'Georgette': {
      composition: '100% Polyester',
      constructionType: 'Woven - Plain Weave',
      weaveKnitType: '1x1 Plain (crepe twist)'
    }
  },
  'Viscose/Rayon': {
    'Viscose Twill': {
      composition: '100% Viscose',
      constructionType: 'Woven - Twill Weave',
      weaveKnitType: '2x2 Twill'
    },
    'Viscose Satin': {
      composition: '100% Viscose',
      constructionType: 'Woven - Satin Weave',
      weaveKnitType: '4/1 Satin'
    },
    'Viscose Crepe': {
      composition: '100% Viscose',
      constructionType: 'Woven - Crepe',
      weaveKnitType: 'Crepe Weave'
    },
    'Viscose Jersey': {
      composition: '100% Viscose',
      constructionType: 'Knitted - Weft Knit',
      weaveKnitType: 'Single Jersey'
    }
  },
  'Modal': {
    'Modal Jersey': {
      composition: '100% Modal',
      constructionType: 'Knitted - Weft Knit',
      weaveKnitType: 'Single Jersey'
    }
  },
  'Lyocell/Tencel': {
    'Tencel Twill': {
      composition: '100% Tencel',
      constructionType: 'Woven - Twill Weave',
      weaveKnitType: '2x2 Twill'
    },
    'Tencel Jersey': {
      composition: '100% Tencel',
      constructionType: 'Knitted - Weft Knit',
      weaveKnitType: 'Single Jersey'
    }
  },
  'Bamboo Viscose': {
    'Bamboo Jersey': {
      composition: '100% Bamboo Viscose',
      constructionType: 'Knitted - Weft Knit',
      weaveKnitType: 'Single Jersey'
    }
  },
  'Linen/Flax': {
    'Linen Plain': {
      composition: '100% Linen',
      constructionType: 'Woven - Plain Weave',
      weaveKnitType: '1x1 Plain'
    },
    'Linen Cambric': {
      composition: '100% Linen',
      constructionType: 'Woven - Plain Weave',
      weaveKnitType: '1x1 Plain (fine)'
    },
    'Linen Sheeting': {
      composition: '100% Linen',
      constructionType: 'Woven - Plain Weave',
      weaveKnitType: '1x1 Plain (medium)'
    },
    'Linen Canvas': {
      composition: '100% Linen',
      constructionType: 'Woven - Plain Weave',
      weaveKnitType: '1x1 Plain (heavy)'
    },
    'Linen Damask': {
      composition: '100% Linen',
      constructionType: 'Woven - Jacquard',
      weaveKnitType: 'Jacquard (reversible)'
    },
    'Linen Twill': {
      composition: '100% Linen',
      constructionType: 'Woven - Twill Weave',
      weaveKnitType: '2x2 Twill'
    },
    'Handkerchief Linen': {
      composition: '100% Linen',
      constructionType: 'Woven - Plain Weave',
      weaveKnitType: '1x1 Plain (sheer fine)'
    }
  },
  'Wool': {
    'Wool Suiting': {
      composition: '100% Wool',
      constructionType: 'Woven - Twill Weave',
      weaveKnitType: '2x2 Twill'
    },
    'Wool Gabardine': {
      composition: '100% Wool',
      constructionType: 'Woven - Twill Weave',
      weaveKnitType: 'Steep Twill (45-63°)'
    },
    'Serge': {
      composition: '100% Wool',
      constructionType: 'Woven - Twill Weave',
      weaveKnitType: '2x2 Twill (clear finish)'
    },
    'Wool Flannel': {
      composition: '100% Wool',
      constructionType: 'Woven - Twill/Plain',
      weaveKnitType: 'Twill/Plain (napped)'
    },
    'Melton': {
      composition: '100% Wool',
      constructionType: 'Woven - Twill Weave',
      weaveKnitType: 'Twill (heavily fulled)'
    },
    'Wool Broadcloth': {
      composition: '100% Wool',
      constructionType: 'Woven - Twill Weave',
      weaveKnitType: 'Twill (fulled/napped)'
    },
    'Wool Crepe': {
      composition: '100% Wool',
      constructionType: 'Woven - Crepe',
      weaveKnitType: 'Crepe Weave'
    },
    'Wool Challis': {
      composition: '100% Wool',
      constructionType: 'Woven - Plain Weave',
      weaveKnitType: '1x1 Plain (soft)'
    },
    'Tweed': {
      composition: '100% Wool',
      constructionType: 'Woven - Twill/Plain',
      weaveKnitType: 'Various (textured)'
    },
    'Wool Herringbone': {
      composition: '100% Wool',
      constructionType: 'Woven - Twill Weave',
      weaveKnitType: 'Broken Twill (V-pattern)'
    },
    'Houndstooth': {
      composition: '100% Wool',
      constructionType: 'Woven - Twill Weave',
      weaveKnitType: '2x2 Twill (check pattern)'
    },
    'Wool Jersey': {
      composition: '100% Wool',
      constructionType: 'Knitted - Weft Knit',
      weaveKnitType: 'Single Jersey'
    },
    'Wool Double Knit': {
      composition: '100% Wool',
      constructionType: 'Knitted - Weft Knit',
      weaveKnitType: 'Double Knit/Interlock'
    }
  },
  'Cashmere': {
    'Cashmere': {
      composition: '100% Cashmere',
      constructionType: 'Woven - Twill/Plain',
      weaveKnitType: 'Various'
    }
  },
  'Merino': {
    'Merino Jersey': {
      composition: '100% Merino',
      constructionType: 'Knitted - Weft Knit',
      weaveKnitType: 'Single Jersey (fine)'
    }
  },
  'Silk': {
    'Charmeuse': {
      composition: '100% Silk',
      constructionType: 'Woven - Satin Weave',
      weaveKnitType: '4/1 Satin (lustrous face)'
    },
    'Crepe de Chine': {
      composition: '100% Silk',
      constructionType: 'Woven - Plain Weave',
      weaveKnitType: '1x1 Plain (crepe twist)'
    },
    'Silk Georgette': {
      composition: '100% Silk',
      constructionType: 'Woven - Plain Weave',
      weaveKnitType: '1x1 Plain (crepe twist)'
    },
    'Silk Chiffon': {
      composition: '100% Silk',
      constructionType: 'Woven - Plain Weave',
      weaveKnitType: '1x1 Plain (sheer)'
    },
    'Silk Taffeta': {
      composition: '100% Silk',
      constructionType: 'Woven - Plain Weave',
      weaveKnitType: '1x1 Plain (crisp)'
    },
    'Habotai/China Silk': {
      composition: '100% Silk',
      constructionType: 'Woven - Plain Weave',
      weaveKnitType: '1x1 Plain'
    },
    'Dupioni': {
      composition: '100% Silk',
      constructionType: 'Woven - Plain Weave',
      weaveKnitType: '1x1 Plain (slub)'
    },
    'Shantung': {
      composition: '100% Silk',
      constructionType: 'Woven - Plain Weave',
      weaveKnitType: '1x1 Plain (slub)'
    },
    'Silk Satin': {
      composition: '100% Silk',
      constructionType: 'Woven - Satin Weave',
      weaveKnitType: '4/1 or 5/1 Satin'
    },
    'Silk Velvet': {
      composition: '100% Silk',
      constructionType: 'Woven - Pile Weave',
      weaveKnitType: 'Warp Cut Pile'
    },
    'Silk Twill': {
      composition: '100% Silk',
      constructionType: 'Woven - Twill Weave',
      weaveKnitType: '2x2 Twill'
    },
    'Silk Noil': {
      composition: '100% Silk Noil',
      constructionType: 'Woven - Plain Weave',
      weaveKnitType: '1x1 Plain (textured)'
    },
    'Silk Organza': {
      composition: '100% Silk',
      constructionType: 'Woven - Plain Weave',
      weaveKnitType: '1x1 Plain (crisp/sheer)'
    }
  },
  'Specialty/Technical': {
    'Fiberglass': {
      composition: '100% E-Glass',
      constructionType: 'Woven - Plain/Satin',
      weaveKnitType: 'Various'
    }
  },
  'Non-Woven': {
    'Spunbond': {
      composition: '100% Polypropylene',
      constructionType: 'Non-Woven - Spunbond',
      weaveKnitType: 'Thermal Bonded'
    },
    'Meltblown': {
      composition: '100% Polypropylene',
      constructionType: 'Non-Woven - Meltblown',
      weaveKnitType: 'Self-Bonded'
    },
    'SMS': {
      composition: '100% Polypropylene',
      constructionType: 'Non-Woven - Composite',
      weaveKnitType: 'Spunbond-Meltblown-Spunbond'
    },
    'Needlepunch': {
      composition: 'Poly, Viscose, Blends',
      constructionType: 'Non-Woven - Mechanical',
      weaveKnitType: 'Needle Entangled'
    },
    'Spunlace': {
      composition: 'Viscose, Poly, Cotton',
      constructionType: 'Non-Woven - Hydroentangled',
      weaveKnitType: 'Water Jet Bonded'
    },
    'Felt': {
      composition: 'Wool, Poly, Blends',
      constructionType: 'Non-Woven - Mechanical',
      weaveKnitType: 'Needle/Wet Felted'
    }
  }
};

// Helper functions
export const getFabricFiberTypes = () => {
  return Object.keys(FABRIC_DATA);
};

export const getFabricNames = (fiberType) => {
  if (!fiberType || !FABRIC_DATA[fiberType]) return [];
  return Object.keys(FABRIC_DATA[fiberType]);
};

export const getFabricDetails = (fiberType, fabricName) => {
  if (!fiberType || !fabricName || !FABRIC_DATA[fiberType] || !FABRIC_DATA[fiberType][fabricName]) {
    return null;
  }
  return FABRIC_DATA[fiberType][fabricName];
};

export default FABRIC_DATA;


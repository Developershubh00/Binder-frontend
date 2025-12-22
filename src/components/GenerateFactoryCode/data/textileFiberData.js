const TEXTILE_FIBER_DATA = {
  'Cotton': {
    'Cotton Carded': {
      spinningMethod: 'Carded/Ring Spun',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2, 3, 4],
      windingOptions: 'Cone, Hank'
    },
    'Cotton Combed': {
      spinningMethod: 'Combed/Ring Spun',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2, 3, 4],
      windingOptions: 'Cone, Hank'
    },
    'Cotton Compact': {
      spinningMethod: 'Compact Spun',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    },
    'Cotton OE': {
      spinningMethod: 'Open End/Rotor',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2, 4],
      windingOptions: 'Cone'
    },
    'Cotton Slub': {
      spinningMethod: 'Ring Spun + Slub Attachment',
      countSystem: 'Ne',
      doublingOptions: 'Single',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    },
    'Cotton Melange': {
      spinningMethod: 'Ring Spun',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    },
    'Cotton Gassed': {
      spinningMethod: 'Ring Spun + Gassing',
      countSystem: 'Ne',
      doublingOptions: '2-ply, 3-ply',
      plyOptions: [2, 3, 4, 6],
      windingOptions: 'Cone, Hank'
    },
    'Cotton Sewing Thread': {
      spinningMethod: 'Ring Spun + Mercerized',
      countSystem: 'Ne (Ticket)',
      doublingOptions: '3-ply',
      plyOptions: [3, 6],
      windingOptions: 'Spool, Cone'
    },
    'Organic Cotton': {
      spinningMethod: 'Ring Spun/Combed',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone, Hank'
    },
    'BCI Cotton': {
      spinningMethod: 'Carded/Combed',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    },
    'Supima Cotton': {
      spinningMethod: 'Combed/Compact',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    },
    'Egyptian Cotton': {
      spinningMethod: 'Combed',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone, Hank'
    },
    'Pima Cotton': {
      spinningMethod: 'Combed',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    }
  },
  'Cotton Blends': {
    'PC (Polyester-Cotton)': {
      spinningMethod: 'Ring/OE Spun',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    },
    'CVC (Chief Value Cotton)': {
      spinningMethod: 'Ring Spun',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    },
    'Cotton-Viscose': {
      spinningMethod: 'Ring Spun',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    },
    'Cotton-Modal': {
      spinningMethod: 'Ring Spun',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    },
    'Cotton-Linen': {
      spinningMethod: 'Ring Spun',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone, Hank'
    },
    'Cotton-Bamboo': {
      spinningMethod: 'Ring Spun',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    },
    'Cotton-Tencel': {
      spinningMethod: 'Ring Spun',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    },
    'Cotton-Spandex Core': {
      spinningMethod: 'Core Spun',
      countSystem: 'Ne',
      doublingOptions: 'Single',
      plyOptions: [1],
      windingOptions: 'Cone'
    }
  },
  'Wool': {
    'Wool Worsted': {
      spinningMethod: 'Worsted System',
      countSystem: 'Nm',
      doublingOptions: '2-ply',
      plyOptions: [2, 3, 4],
      windingOptions: 'Cone, Hank'
    },
    'Wool Woolen': {
      spinningMethod: 'Woolen System',
      countSystem: 'Nm',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2, 3],
      windingOptions: 'Cone, Hank'
    },
    'Merino Wool': {
      spinningMethod: 'Worsted Combed',
      countSystem: 'Nm',
      doublingOptions: '2-ply',
      plyOptions: [2, 3, 4],
      windingOptions: 'Cone, Hank'
    },
    'Lambswool': {
      spinningMethod: 'Woolen/Worsted',
      countSystem: 'Nm',
      doublingOptions: '2-ply',
      plyOptions: [2, 3],
      windingOptions: 'Cone, Hank'
    },
    'Shetland Wool': {
      spinningMethod: 'Woolen',
      countSystem: 'Nm',
      doublingOptions: '2-ply',
      plyOptions: [2, 3],
      windingOptions: 'Hank'
    },
    'Cashmere': {
      spinningMethod: 'Worsted',
      countSystem: 'Nm',
      doublingOptions: '2-ply',
      plyOptions: [2, 3],
      windingOptions: 'Cone, Hank'
    },
    'Alpaca': {
      spinningMethod: 'Worsted',
      countSystem: 'Nm',
      doublingOptions: '2-ply',
      plyOptions: [2, 3],
      windingOptions: 'Cone, Hank'
    },
    'Mohair': {
      spinningMethod: 'Worsted',
      countSystem: 'Nm',
      doublingOptions: '2-ply, Brushed',
      plyOptions: [2, 3],
      windingOptions: 'Cone, Hank'
    },
    'Angora': {
      spinningMethod: 'Woolen',
      countSystem: 'Nm',
      doublingOptions: '2-ply',
      plyOptions: [2],
      windingOptions: 'Hank'
    }
  },
  'Wool Blends': {
    'Wool-Nylon': {
      spinningMethod: 'Worsted',
      countSystem: 'Nm',
      doublingOptions: '2-ply',
      plyOptions: [2, 3],
      windingOptions: 'Cone, Hank'
    },
    'Wool-Acrylic': {
      spinningMethod: 'Worsted/Woolen',
      countSystem: 'Nm',
      doublingOptions: '2-ply',
      plyOptions: [2, 3],
      windingOptions: 'Cone, Hank'
    },
    'Wool-Silk': {
      spinningMethod: 'Worsted',
      countSystem: 'Nm',
      doublingOptions: '2-ply',
      plyOptions: [2],
      windingOptions: 'Cone, Hank'
    },
    'Wool-Cashmere': {
      spinningMethod: 'Worsted',
      countSystem: 'Nm',
      doublingOptions: '2-ply',
      plyOptions: [2],
      windingOptions: 'Cone, Hank'
    },
    'Merino-Tencel': {
      spinningMethod: 'Worsted',
      countSystem: 'Nm',
      doublingOptions: '2-ply',
      plyOptions: [2],
      windingOptions: 'Cone'
    }
  },
  'Polyester': {
    'Polyester Spun': {
      spinningMethod: 'Ring Spun',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    },
    'Polyester DTY': {
      spinningMethod: 'Draw Texturized',
      countSystem: 'Denier',
      doublingOptions: 'N/A',
      plyOptions: [1, 2],
      windingOptions: 'Cone, Bobbin'
    },
    'Polyester POY': {
      spinningMethod: 'Partially Oriented',
      countSystem: 'Denier',
      doublingOptions: 'N/A',
      plyOptions: [1],
      windingOptions: 'Bobbin'
    },
    'Polyester FDY': {
      spinningMethod: 'Fully Drawn',
      countSystem: 'Denier',
      doublingOptions: 'N/A',
      plyOptions: [1, 2],
      windingOptions: 'Cone, Bobbin'
    },
    'Polyester ATY': {
      spinningMethod: 'Air Texturized',
      countSystem: 'Denier',
      doublingOptions: 'N/A',
      plyOptions: [1],
      windingOptions: 'Cone'
    },
    'PSF Yarn': {
      spinningMethod: 'Ring/OE Spun',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    },
    'Recycled Polyester': {
      spinningMethod: 'Ring Spun/DTY',
      countSystem: 'Ne/Denier',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    },
    'Poly Sewing Thread': {
      spinningMethod: 'Core Spun/Texturized',
      countSystem: 'Ticket No.',
      doublingOptions: '3-ply',
      plyOptions: [2, 3],
      windingOptions: 'Spool, Cone'
    },
    'Polyester HT': {
      spinningMethod: 'High Tenacity FDY',
      countSystem: 'Denier',
      doublingOptions: 'N/A',
      plyOptions: [1],
      windingOptions: 'Cone'
    },
    'Polyester Microfiber': {
      spinningMethod: 'Micro Denier',
      countSystem: 'Denier',
      doublingOptions: 'N/A',
      plyOptions: [1],
      windingOptions: 'Cone'
    }
  },
  'Polyester Blends': {
    'PV (Polyester-Viscose)': {
      spinningMethod: 'Ring Spun',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    },
    'Poly-Wool': {
      spinningMethod: 'Worsted',
      countSystem: 'Nm',
      doublingOptions: '2-ply',
      plyOptions: [2],
      windingOptions: 'Cone'
    },
    'Poly-Acrylic': {
      spinningMethod: 'Ring Spun',
      countSystem: 'Nm',
      doublingOptions: '2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    },
    'Poly-Linen': {
      spinningMethod: 'Ring Spun',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    }
  },
  'Viscose/Rayon': {
    'Viscose Spun': {
      spinningMethod: 'Ring Spun',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone, Hank'
    },
    'Viscose Filament': {
      spinningMethod: 'Continuous Filament',
      countSystem: 'Denier',
      doublingOptions: 'N/A',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    },
    'Modal': {
      spinningMethod: 'Ring Spun',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    },
    'Lyocell/Tencel': {
      spinningMethod: 'Ring Spun',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    },
    'Bamboo Viscose': {
      spinningMethod: 'Ring Spun',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    },
    'Cupro': {
      spinningMethod: 'Continuous Filament',
      countSystem: 'Denier',
      doublingOptions: 'N/A',
      plyOptions: [1],
      windingOptions: 'Cone'
    }
  },
  'Viscose/Regenerated Blends': {
    'Viscose-Linen': {
      spinningMethod: 'Ring Spun',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    },
    'Modal-Cotton': {
      spinningMethod: 'Ring Spun',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    },
    'Tencel-Wool': {
      spinningMethod: 'Worsted',
      countSystem: 'Nm',
      doublingOptions: '2-ply',
      plyOptions: [2],
      windingOptions: 'Cone'
    }
  },
  'Nylon/Polyamide': {
    'Nylon 6': {
      spinningMethod: 'Melt Spun FDY/DTY',
      countSystem: 'Denier',
      doublingOptions: 'N/A',
      plyOptions: [1, 2],
      windingOptions: 'Cone, Bobbin'
    },
    'Nylon 66': {
      spinningMethod: 'Melt Spun FDY/DTY',
      countSystem: 'Denier',
      doublingOptions: 'N/A',
      plyOptions: [1, 2],
      windingOptions: 'Cone, Bobbin'
    },
    'Nylon High Tenacity': {
      spinningMethod: 'High Tenacity',
      countSystem: 'Denier',
      doublingOptions: 'N/A',
      plyOptions: [1],
      windingOptions: 'Cone'
    },
    'Nylon Textured': {
      spinningMethod: 'Air Jet Textured',
      countSystem: 'Denier',
      doublingOptions: 'N/A',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    },
    'Nylon Staple Spun': {
      spinningMethod: 'Ring Spun',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    }
  },
  'Acrylic': {
    'Acrylic HB (High Bulk)': {
      spinningMethod: 'Ring Spun HB',
      countSystem: 'Nm',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2, 3],
      windingOptions: 'Cone, Hank'
    },
    'Acrylic Non-HB': {
      spinningMethod: 'Ring Spun',
      countSystem: 'Nm',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    },
    'Modacrylic': {
      spinningMethod: 'Ring Spun',
      countSystem: 'Nm',
      doublingOptions: '2-ply',
      plyOptions: [2],
      windingOptions: 'Cone'
    },
    'Acrylic Chenille': {
      spinningMethod: 'Cut Pile',
      countSystem: 'Nm',
      doublingOptions: 'Chenille',
      plyOptions: [2],
      windingOptions: 'Cone'
    }
  },
  'Linen/Flax': {
    'Linen Wet Spun': {
      spinningMethod: 'Wet Spinning',
      countSystem: 'Lea/Nm',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2, 3],
      windingOptions: 'Cone, Hank'
    },
    'Linen Dry Spun': {
      spinningMethod: 'Dry Spinning',
      countSystem: 'Lea/Nm',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone, Hank'
    },
    'Linen Tow': {
      spinningMethod: 'Tow Spinning',
      countSystem: 'Lea',
      doublingOptions: 'Single',
      plyOptions: [1, 2],
      windingOptions: 'Hank'
    },
    'Linen Line': {
      spinningMethod: 'Line Spinning',
      countSystem: 'Lea',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone, Hank'
    }
  },
  'Jute & Bast Fibers': {
    'Jute Yarn': {
      spinningMethod: 'Jute Spinning',
      countSystem: 'Lbs/Spindle',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2, 3],
      windingOptions: 'Hank, Cone'
    },
    'Hemp Yarn': {
      spinningMethod: 'Wet/Dry Spun',
      countSystem: 'Nm/Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone, Hank'
    },
    'Ramie Yarn': {
      spinningMethod: 'Wet Spun',
      countSystem: 'Nm',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone, Hank'
    },
    'Sisal Yarn': {
      spinningMethod: 'Sisal Spinning',
      countSystem: 'Lbs/Spindle',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2, 3],
      windingOptions: 'Ball, Coil'
    },
    'Coir Yarn': {
      spinningMethod: 'Coir Spinning',
      countSystem: 'Runnage',
      doublingOptions: '2-ply, 3-ply',
      plyOptions: [2, 3],
      windingOptions: 'Coil, Ball'
    }
  },
  'Silk': {
    'Mulberry Silk': {
      spinningMethod: 'Reeled/Thrown',
      countSystem: 'Denier',
      doublingOptions: '2-ply to 6-ply',
      plyOptions: [2, 3, 4, 6],
      windingOptions: 'Hank, Cone'
    },
    'Tussah/Wild Silk': {
      spinningMethod: 'Reeled',
      countSystem: 'Denier',
      doublingOptions: '2-ply, 3-ply',
      plyOptions: [2, 3],
      windingOptions: 'Hank'
    },
    'Silk Noil': {
      spinningMethod: 'Spun Silk',
      countSystem: 'Nm',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone, Hank'
    },
    'Spun Silk': {
      spinningMethod: 'Ring Spun (from waste)',
      countSystem: 'Nm',
      doublingOptions: '2-ply',
      plyOptions: [2, 3],
      windingOptions: 'Cone, Hank'
    },
    'Dupioni Silk': {
      spinningMethod: 'Reeled/Raw',
      countSystem: 'Denier',
      doublingOptions: 'Raw',
      plyOptions: [2, 3],
      windingOptions: 'Hank'
    }
  },
  'Specialty/Technical': {
    'Spandex/Elastane': {
      spinningMethod: 'Melt Spun',
      countSystem: 'Denier',
      doublingOptions: 'N/A',
      plyOptions: [1],
      windingOptions: 'Bobbin, Spool'
    },
    'Carbon Fiber': {
      spinningMethod: 'Continuous Tow',
      countSystem: 'K (thousands)',
      doublingOptions: 'N/A',
      plyOptions: "Tow",
      windingOptions: 'Spool'
    },
    'Glass Fiber': {
      spinningMethod: 'Continuous Filament',
      countSystem: 'Tex',
      doublingOptions: 'N/A',
      plyOptions: "Roving",
      windingOptions: 'Spool'
    },
    'Aramid (Kevlar)': {
      spinningMethod: 'Solution Spun',
      countSystem: 'Denier',
      doublingOptions: 'N/A',
      plyOptions: [1],
      windingOptions: 'Spool, Cone'
    },
    'UHMWPE (Dyneema)': {
      spinningMethod: 'Gel Spun',
      countSystem: 'Denier',
      doublingOptions: 'N/A',
      plyOptions: [1],
      windingOptions: 'Spool'
    },
    'Metallic/Lurex': {
      spinningMethod: 'Laminated/Slit',
      countSystem: 'Denier',
      doublingOptions: 'N/A',
      plyOptions: [1],
      windingOptions: 'Bobbin, Cone'
    },
    'Stainless Steel': {
      spinningMethod: 'Drawn Wire',
      countSystem: 'Micron',
      doublingOptions: 'N/A',
      plyOptions: "Multi-filament",
      windingOptions: 'Spool'
    }
  }
};

export default TEXTILE_FIBER_DATA;

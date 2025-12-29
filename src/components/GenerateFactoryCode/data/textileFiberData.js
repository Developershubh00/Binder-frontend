const TEXTILE_FIBER_DATA = {
  'Cotton': {
    'Cotton Carded': {
      composition: '100% Cotton',
      countRange: '6-40',
      spinningMethod: 'Carded/Ring Spun',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2, 3, 4],
      windingOptions: 'Cone, Hank'
    },
    'Cotton Combed': {
      composition: '100% Cotton',
      countRange: '20-120',
      spinningMethod: 'Combed/Ring Spun',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2, 3, 4],
      windingOptions: 'Cone, Hank'
    },
    'Cotton Compact': {
      composition: '100% Cotton',
      countRange: '30-100',
      spinningMethod: 'Compact Spun',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    },
    'Cotton OE': {
      composition: '100% Cotton',
      countRange: '6-30',
      spinningMethod: 'Open End/Rotor',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2, 4],
      windingOptions: 'Cone'
    },
    'Cotton Slub': {
      composition: '100% Cotton',
      countRange: '10-40',
      spinningMethod: 'Ring Spun + Slub Attachment',
      countSystem: 'Ne',
      doublingOptions: 'Single',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    },
    'Cotton Melange': {
      composition: '100% Cotton (dyed fibers)',
      countRange: '16-40',
      spinningMethod: 'Ring Spun',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    },
    'Cotton Gassed': {
      composition: '100% Cotton',
      countRange: '40-120',
      spinningMethod: 'Ring Spun + Gassing',
      countSystem: 'Ne',
      doublingOptions: '2-ply, 3-ply',
      plyOptions: [2, 3, 4, 6],
      windingOptions: 'Cone, Hank'
    },
    'Cotton Sewing Thread': {
      composition: '100% Cotton',
      countRange: '40-120 (Tkt 40-120)',
      spinningMethod: 'Ring Spun + Mercerized',
      countSystem: 'Ne (Ticket)',
      doublingOptions: '3-ply',
      plyOptions: [3, 6],
      windingOptions: 'Spool, Cone'
    },
    'Organic Cotton': {
      composition: '100% Organic Cotton',
      countRange: '20-80',
      spinningMethod: 'Ring Spun/Combed',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone, Hank'
    },
    'BCI Cotton': {
      composition: '100% BCI Cotton',
      countRange: '16-60',
      spinningMethod: 'Carded/Combed',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    },
    'Supima Cotton': {
      composition: '100% Supima Cotton',
      countRange: '40-100',
      spinningMethod: 'Combed/Compact',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    },
    'Egyptian Cotton': {
      composition: '100% Egyptian Cotton',
      countRange: '40-140',
      spinningMethod: 'Combed',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone, Hank'
    },
    'Pima Cotton': {
      composition: '100% Pima Cotton',
      countRange: '40-100',
      spinningMethod: 'Combed',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    }
  },
  'Cotton Blends': {
    'PC (Polyester-Cotton)': {
      composition: 'PC Blend, 65/35, 52/48 PC',
      countRange: '10-60',
      spinningMethod: 'Ring/OE Spun',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    },
    'CVC (Chief Value Cotton)': {
      composition: 'CVC Blend, 60/40, 55/45 C/P',
      countRange: '16-60',
      spinningMethod: 'Ring Spun',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    },
    'Cotton-Viscose': {
      composition: 'Cotton-Viscose, Various ratios CV',
      countRange: '20-50',
      spinningMethod: 'Ring Spun',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    },
    'Cotton-Modal': {
      composition: 'Cotton-Modal, 50/50, 60/40 C/Mod',
      countRange: '30-60',
      spinningMethod: 'Ring Spun',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    },
    'Cotton-Linen': {
      composition: 'Cotton-Linen, 55/45, 70/30 C/L',
      countRange: '16-40',
      spinningMethod: 'Ring Spun',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone, Hank'
    },
    'Cotton-Bamboo': {
      composition: 'Cotton-Bamboo, 50/50, 70/30 C/Bam',
      countRange: '30-50',
      spinningMethod: 'Ring Spun',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    },
    'Cotton-Tencel': {
      composition: 'Cotton-Tencel, 50/50 C/Ten',
      countRange: '30-60',
      spinningMethod: 'Ring Spun',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    },
    'Cotton-Spandex Core': {
      composition: 'Cotton-Spandex, 95-98% Cotton + 2-5% Spx',
      countRange: '20-50',
      spinningMethod: 'Core Spun',
      countSystem: 'Ne',
      doublingOptions: 'Single',
      plyOptions: [1],
      windingOptions: 'Cone'
    }
  },
  'Wool': {
    'Wool Worsted': {
      composition: '100% Wool',
      countRange: '24-80 Nm (2/24-2/80)',
      spinningMethod: 'Worsted System',
      countSystem: 'Nm',
      doublingOptions: '2-ply',
      plyOptions: [2, 3, 4],
      windingOptions: 'Cone, Hank'
    },
    'Wool Woolen': {
      composition: '100% Wool',
      countRange: '6-24 Nm',
      spinningMethod: 'Woolen System',
      countSystem: 'Nm',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2, 3],
      windingOptions: 'Cone, Hank'
    },
    'Merino Wool': {
      composition: '100% Merino',
      countRange: '28-80 Nm',
      spinningMethod: 'Worsted Combed',
      countSystem: 'Nm',
      doublingOptions: '2-ply',
      plyOptions: [2, 3, 4],
      windingOptions: 'Cone, Hank'
    },
    'Lambswool': {
      composition: '100% Lambswool',
      countRange: '20-48 Nm',
      spinningMethod: 'Woolen/Worsted',
      countSystem: 'Nm',
      doublingOptions: '2-ply',
      plyOptions: [2, 3],
      windingOptions: 'Cone, Hank'
    },
    'Shetland Wool': {
      composition: '100% Shetland',
      countRange: '12-28 Nm',
      spinningMethod: 'Woolen',
      countSystem: 'Nm',
      doublingOptions: '2-ply',
      plyOptions: [2, 3],
      windingOptions: 'Hank'
    },
    'Cashmere': {
      composition: '100% Cashmere',
      countRange: '26-56 Nm (2/26-2/56)',
      spinningMethod: 'Worsted',
      countSystem: 'Nm',
      doublingOptions: '2-ply',
      plyOptions: [2, 3],
      windingOptions: 'Cone, Hank'
    },
    'Alpaca': {
      composition: '100% Alpaca',
      countRange: '16-48 Nm',
      spinningMethod: 'Worsted',
      countSystem: 'Nm',
      doublingOptions: '2-ply',
      plyOptions: [2, 3],
      windingOptions: 'Cone, Hank'
    },
    'Mohair': {
      composition: '100% Mohair',
      countRange: '20-48 Nm',
      spinningMethod: 'Worsted',
      countSystem: 'Nm',
      doublingOptions: '2-ply, Brushed',
      plyOptions: [2, 3],
      windingOptions: 'Cone, Hank'
    },
    'Angora': {
      composition: '100% Angora / Blend',
      countRange: '20-40 Nm',
      spinningMethod: 'Woolen',
      countSystem: 'Nm',
      doublingOptions: '2-ply',
      plyOptions: [2],
      windingOptions: 'Hank'
    }
  },
  'Wool Blends': {
    'Wool-Nylon': {
      composition: 'Wool-Nylon, 80/20, 75/25 W/N',
      countRange: '28-48 Nm',
      spinningMethod: 'Worsted',
      countSystem: 'Nm',
      doublingOptions: '2-ply',
      plyOptions: [2, 3],
      windingOptions: 'Cone, Hank'
    },
    'Wool-Acrylic': {
      composition: 'Wool-Acrylic, 50/50, 60/40 W/A',
      countRange: '20-48 Nm',
      spinningMethod: 'Worsted/Woolen',
      countSystem: 'Nm',
      doublingOptions: '2-ply',
      plyOptions: [2, 3],
      windingOptions: 'Cone, Hank'
    },
    'Wool-Silk': {
      composition: 'Wool-Silk, 70/30, 80/20 W/S',
      countRange: '36-60 Nm',
      spinningMethod: 'Worsted',
      countSystem: 'Nm',
      doublingOptions: '2-ply',
      plyOptions: [2],
      windingOptions: 'Cone, Hank'
    },
    'Wool-Cashmere': {
      composition: 'Wool-Cashmere, 90/10, 80/20 W/C',
      countRange: '28-56 Nm',
      spinningMethod: 'Worsted',
      countSystem: 'Nm',
      doublingOptions: '2-ply',
      plyOptions: [2],
      windingOptions: 'Cone, Hank'
    },
    'Merino-Tencel': {
      composition: 'Merino-Tencel, 50/50 Mer/Ten',
      countRange: '36-60 Nm',
      spinningMethod: 'Worsted',
      countSystem: 'Nm',
      doublingOptions: '2-ply',
      plyOptions: [2],
      windingOptions: 'Cone'
    }
  },
  'Polyester': {
    'Polyester Spun': {
      composition: '100% Polyester',
      countRange: '10-60',
      spinningMethod: 'Ring Spun',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    },
    'Polyester DTY': {
      composition: '100% Polyester',
      countRange: '50-600D',
      spinningMethod: 'Draw Texturized',
      countSystem: 'Denier',
      doublingOptions: 'N/A',
      plyOptions: [1, 2],
      windingOptions: 'Cone, Bobbin'
    },
    'Polyester POY': {
      composition: '100% Polyester',
      countRange: '80-300D',
      spinningMethod: 'Partially Oriented',
      countSystem: 'Denier',
      doublingOptions: 'N/A',
      plyOptions: [1],
      windingOptions: 'Bobbin'
    },
    'Polyester FDY': {
      composition: '100% Polyester',
      countRange: '50-300D',
      spinningMethod: 'Fully Drawn',
      countSystem: 'Denier',
      doublingOptions: 'N/A',
      plyOptions: [1, 2],
      windingOptions: 'Cone, Bobbin'
    },
    'Polyester ATY': {
      composition: '100% Polyester',
      countRange: '150-1200D',
      spinningMethod: 'Air Texturized',
      countSystem: 'Denier',
      doublingOptions: 'N/A',
      plyOptions: [1],
      windingOptions: 'Cone'
    },
    'PSF Yarn': {
      composition: '100% Polyester Staple',
      countRange: '10-40',
      spinningMethod: 'Ring/OE Spun',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    },
    'Recycled Polyester': {
      composition: '100% rPET',
      countRange: 'Ne 20-40 / 75-300D',
      spinningMethod: 'Ring Spun/DTY',
      countSystem: 'Ne/Denier',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    },
    'Poly Sewing Thread': {
      composition: '100% Polyester',
      countRange: 'Tkt 20-120',
      spinningMethod: 'Core Spun/Texturized',
      countSystem: 'Ticket No.',
      doublingOptions: '3-ply',
      plyOptions: [2, 3],
      windingOptions: 'Spool, Cone'
    },
    'Polyester HT': {
      composition: '100% Polyester',
      countRange: '150-2000D',
      spinningMethod: 'High Tenacity FDY',
      countSystem: 'Denier',
      doublingOptions: 'N/A',
      plyOptions: [1],
      windingOptions: 'Cone'
    },
    'Polyester Microfiber': {
      composition: '100% Polyester',
      countRange: '0.5-1.0 dpf',
      spinningMethod: 'Micro Denier',
      countSystem: 'Denier',
      doublingOptions: 'N/A',
      plyOptions: [1],
      windingOptions: 'Cone'
    }
  },
  'Polyester Blends': {
    'PV (Polyester-Viscose)': {
      composition: 'PV Blend, 65/35, 70/30 P/V',
      countRange: '20-50',
      spinningMethod: 'Ring Spun',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    },
    'Poly-Wool': {
      composition: 'Poly-Wool, 55/45, 45/55 P/W',
      countRange: '24-60 Nm',
      spinningMethod: 'Worsted',
      countSystem: 'Nm',
      doublingOptions: '2-ply',
      plyOptions: [2],
      windingOptions: 'Cone'
    },
    'Poly-Acrylic': {
      composition: 'Poly-Acrylic, 50/50 P/A',
      countRange: '24-48 Nm',
      spinningMethod: 'Ring Spun',
      countSystem: 'Nm',
      doublingOptions: '2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    },
    'Poly-Linen': {
      composition: 'Poly-Linen, 55/45 P/L',
      countRange: '16-40',
      spinningMethod: 'Ring Spun',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    }
  },
  'Viscose/Rayon': {
    'Viscose Spun': {
      composition: '100% Viscose',
      countRange: '20-60',
      spinningMethod: 'Ring Spun',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone, Hank'
    },
    'Viscose Filament': {
      composition: '100% Viscose',
      countRange: '75-450D',
      spinningMethod: 'Continuous Filament',
      countSystem: 'Denier',
      doublingOptions: 'N/A',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    },
    'Modal': {
      composition: '100% Modal',
      countRange: '30-60',
      spinningMethod: 'Ring Spun',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    },
    'Lyocell/Tencel': {
      composition: '100% Lyocell',
      countRange: '20-60',
      spinningMethod: 'Ring Spun',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    },
    'Bamboo Viscose': {
      composition: '100% Bamboo Viscose',
      countRange: '20-50',
      spinningMethod: 'Ring Spun',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    },
    'Cupro': {
      composition: '100% Cuprammonium',
      countRange: '75-150D',
      spinningMethod: 'Continuous Filament',
      countSystem: 'Denier',
      doublingOptions: 'N/A',
      plyOptions: [1],
      windingOptions: 'Cone'
    }
  },
  'Viscose/Regenerated Blends': {
    'Viscose-Linen': {
      composition: 'Viscose-Linen, 70/30 V/L',
      countRange: '20-40',
      spinningMethod: 'Ring Spun',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    },
    'Modal-Cotton': {
      composition: 'Modal-Cotton, 50/50 Mod/C',
      countRange: '30-60',
      spinningMethod: 'Ring Spun',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    },
    'Tencel-Wool': {
      composition: 'Tencel-Wool, 50/50 Ten/W',
      countRange: '36-56 Nm',
      spinningMethod: 'Worsted',
      countSystem: 'Nm',
      doublingOptions: '2-ply',
      plyOptions: [2],
      windingOptions: 'Cone'
    }
  },
  'Nylon/Polyamide': {
    'Nylon 6': {
      composition: '100% Nylon 6',
      countRange: '20-420D',
      spinningMethod: 'Melt Spun FDY/DTY',
      countSystem: 'Denier',
      doublingOptions: 'N/A',
      plyOptions: [1, 2],
      windingOptions: 'Cone, Bobbin'
    },
    'Nylon 66': {
      composition: '100% Nylon 66',
      countRange: '20-420D',
      spinningMethod: 'Melt Spun FDY/DTY',
      countSystem: 'Denier',
      doublingOptions: 'N/A',
      plyOptions: [1, 2],
      windingOptions: 'Cone, Bobbin'
    },
    'Nylon High Tenacity': {
      composition: '100% Nylon',
      countRange: '210-1680D',
      spinningMethod: 'High Tenacity',
      countSystem: 'Denier',
      doublingOptions: 'N/A',
      plyOptions: [1],
      windingOptions: 'Cone'
    },
    'Nylon Textured': {
      composition: '100% Nylon',
      countRange: '40-200D',
      spinningMethod: 'Air Jet Textured',
      countSystem: 'Denier',
      doublingOptions: 'N/A',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    },
    'Nylon Staple Spun': {
      composition: '100% Nylon Staple',
      countRange: '20-50 Ne',
      spinningMethod: 'Ring Spun',
      countSystem: 'Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    }
  },
  'Acrylic': {
    'Acrylic HB (High Bulk)': {
      composition: '100% Acrylic',
      countRange: '28-48 Nm (1/28-2/48)',
      spinningMethod: 'Ring Spun HB',
      countSystem: 'Nm',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2, 3],
      windingOptions: 'Cone, Hank'
    },
    'Acrylic Non-HB': {
      composition: '100% Acrylic',
      countRange: '24-48 Nm',
      spinningMethod: 'Ring Spun',
      countSystem: 'Nm',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone'
    },
    'Modacrylic': {
      composition: '100% Modacrylic',
      countRange: '20-40 Nm',
      spinningMethod: 'Ring Spun',
      countSystem: 'Nm',
      doublingOptions: '2-ply',
      plyOptions: [2],
      windingOptions: 'Cone'
    },
    'Acrylic Chenille': {
      composition: '100% Acrylic',
      countRange: '2/5-2/10 Nm',
      spinningMethod: 'Cut Pile',
      countSystem: 'Nm',
      doublingOptions: 'Chenille',
      plyOptions: [2],
      windingOptions: 'Cone'
    }
  },
  'Linen/Flax': {
    'Linen Wet Spun': {
      composition: '100% Flax',
      countRange: '10-60 Lea',
      spinningMethod: 'Wet Spinning',
      countSystem: 'Lea/Nm',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2, 3],
      windingOptions: 'Cone, Hank'
    },
    'Linen Dry Spun': {
      composition: '100% Flax',
      countRange: '6-24 Lea',
      spinningMethod: 'Dry Spinning',
      countSystem: 'Lea/Nm',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone, Hank'
    },
    'Linen Tow': {
      composition: '100% Linen Tow',
      countRange: '4-12 Lea',
      spinningMethod: 'Tow Spinning',
      countSystem: 'Lea',
      doublingOptions: 'Single',
      plyOptions: [1, 2],
      windingOptions: 'Hank'
    },
    'Linen Line': {
      composition: '100% Line Flax',
      countRange: '20-80 Lea',
      spinningMethod: 'Line Spinning',
      countSystem: 'Lea',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone, Hank'
    }
  },
  'Jute & Bast Fibers': {
    'Jute Yarn': {
      composition: '100% Jute',
      countRange: '4-20 lbs',
      spinningMethod: 'Jute Spinning',
      countSystem: 'Lbs/Spindle',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2, 3],
      windingOptions: 'Hank, Cone'
    },
    'Hemp Yarn': {
      composition: '100% Hemp',
      countRange: '10-40 Nm',
      spinningMethod: 'Wet/Dry Spun',
      countSystem: 'Nm/Ne',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone, Hank'
    },
    'Ramie Yarn': {
      composition: '100% Ramie',
      countRange: '20-60 Nm',
      spinningMethod: 'Wet Spun',
      countSystem: 'Nm',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone, Hank'
    },
    'Sisal Yarn': {
      composition: '100% Sisal',
      countRange: '2-8 lbs',
      spinningMethod: 'Sisal Spinning',
      countSystem: 'Lbs/Spindle',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2, 3],
      windingOptions: 'Ball, Coil'
    },
    'Coir Yarn': {
      composition: '100% Coir',
      countRange: 'Various',
      spinningMethod: 'Coir Spinning',
      countSystem: 'Runnage',
      doublingOptions: '2-ply, 3-ply',
      plyOptions: [2, 3],
      windingOptions: 'Coil, Ball'
    }
  },
  'Silk': {
    'Mulberry Silk': {
      composition: '100% Mulberry Silk',
      countRange: '13-27 Denier (2/20-6/20)',
      spinningMethod: 'Reeled/Thrown',
      countSystem: 'Denier',
      doublingOptions: '2-ply to 6-ply',
      plyOptions: [2, 3, 4, 6],
      windingOptions: 'Hank, Cone'
    },
    'Tussah/Wild Silk': {
      composition: '100% Tussah Silk',
      countRange: '20-40 Denier',
      spinningMethod: 'Reeled',
      countSystem: 'Denier',
      doublingOptions: '2-ply, 3-ply',
      plyOptions: [2, 3],
      windingOptions: 'Hank'
    },
    'Silk Noil': {
      composition: '100% Silk Noil',
      countRange: '20-60 Nm',
      spinningMethod: 'Spun Silk',
      countSystem: 'Nm',
      doublingOptions: 'Single, 2-ply',
      plyOptions: [1, 2],
      windingOptions: 'Cone, Hank'
    },
    'Spun Silk': {
      composition: '100% Spun Silk',
      countRange: '40-120 Nm (2/40-2/120)',
      spinningMethod: 'Ring Spun (from waste)',
      countSystem: 'Nm',
      doublingOptions: '2-ply',
      plyOptions: [2, 3],
      windingOptions: 'Cone, Hank'
    },
    'Dupioni Silk': {
      composition: '100% Dupioni',
      countRange: '20-50 Denier',
      spinningMethod: 'Reeled/Raw',
      countSystem: 'Denier',
      doublingOptions: 'Raw',
      plyOptions: [2, 3],
      windingOptions: 'Hank'
    }
  },
  'Specialty/Technical': {
    'Spandex/Elastane': {
      composition: '100% Elastane',
      countRange: '20-1120D',
      spinningMethod: 'Melt Spun',
      countSystem: 'Denier',
      doublingOptions: 'N/A',
      plyOptions: [1],
      windingOptions: 'Bobbin, Spool'
    },
    'Carbon Fiber': {
      composition: '100% Carbon',
      countRange: '1K-24K',
      spinningMethod: 'Continuous Tow',
      countSystem: 'K (thousands)',
      doublingOptions: 'N/A',
      plyOptions: "Tow",
      windingOptions: 'Spool'
    },
    'Glass Fiber': {
      composition: '100% Glass',
      countRange: '22-2400 Tex',
      spinningMethod: 'Continuous Filament',
      countSystem: 'Tex',
      doublingOptions: 'N/A',
      plyOptions: "Roving",
      windingOptions: 'Spool'
    },
    'Aramid (Kevlar)': {
      composition: '100% Para-Aramid',
      countRange: '200-3000D',
      spinningMethod: 'Solution Spun',
      countSystem: 'Denier',
      doublingOptions: 'N/A',
      plyOptions: [1],
      windingOptions: 'Spool, Cone'
    },
    'UHMWPE (Dyneema)': {
      composition: '100% UHMWPE',
      countRange: '100-1760D',
      spinningMethod: 'Gel Spun',
      countSystem: 'Denier',
      doublingOptions: 'N/A',
      plyOptions: [1],
      windingOptions: 'Spool'
    },
    'Metallic/Lurex': {
      composition: 'Poly + Metal Coating',
      countRange: '50-200D',
      spinningMethod: 'Laminated/Slit',
      countSystem: 'Denier',
      doublingOptions: 'N/A',
      plyOptions: [1],
      windingOptions: 'Bobbin, Cone'
    },
    'Stainless Steel': {
      composition: '100% SS',
      countRange: '1-22 micron',
      spinningMethod: 'Drawn Wire',
      countSystem: 'Micron',
      doublingOptions: 'N/A',
      plyOptions: "Multi-filament",
      windingOptions: 'Spool'
    }
  }
};

export default TEXTILE_FIBER_DATA;



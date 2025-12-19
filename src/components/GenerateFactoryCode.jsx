import { useState, useEffect } from 'react';

const GenerateFactoryCode = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Step 0 - Single product
    sku: '',
    image: null,
    imagePreview: null,
    itemNo: '',
    product: '',
    poQty: '',
    overagePercentage: '',
    overageQty: '',
    deliveryDueDate: '',
    // Step 1 - Multiple products, each with multiple components/materials with cut & sew specs
    products: [{
      name: '',
      components: [{
        srNo: 1,
        productComforter: '',
        unit: '',
        gsm: '',
        wastage: '',
        cuttingSize: { length: '', width: '' },
        sewSize: { cns: '', length: '', width: '', netCns: '' },
      }],
    }],
    // Step 2 - Raw Material Sourcing for each component
    rawMaterials: [], // Will be populated based on products and components
    // Step 3 - Consumption calculation materials
    consumptionMaterials: [], // Will be populated based on raw materials or can be added manually
    // Step 4 - Artwork & Labeling materials
    artworkMaterials: [{
      srNo: 1,
      materialDescription: '',
      netConsumption: '',
      unit: '',
      placement: '',
      workOrder: '',
      wastage: '',
      forField: '',
      packagingWorkOrder: '',
      // Conditional fields for R.Mtr unit
      width: '',
      size: '',
      gsm: '',
      // New Artwork Category Fields
      artworkCategory: '',
      specificType: '',
      material: '',
      sizeArtworkId: '',
      foldType: '',
      colours: '',
      finishing: '',
      testingRequirement: '',
      lengthQuantity: '',
      surplus: '',
      approval: '',
      remarks: '',
      careSymbols: '',
      countryOfOrigin: '',
      manufacturerId: '',
      language: '',
      permanence: '',
      sizeShape: '',
      attachment: '',
      content: '',
      symbol: '',
      certificationId: '',
      formFactor: '',
      chipFrequency: '',
      coding: '',
      adhesive: '',
      security: '',
      contentMandates: '',
      fillingMaterials: '',
      newUsedStatus: '',
      registrationLicenses: '',
      lawLabelType: '',
      lawLabelMaterial: '',
      hangTagType: '',
      hangTagMaterial: '',
      priceTicketType: '',
      priceTicketMaterial: '',
      heatTransferType: '',
      heatTransferMaterialBase: '',
      upcType: '',
      upcMaterial: '',
      sizeLabelType: '',
      sizeLabelMaterial: '',
      antiCounterfeitType: '',
      antiCounterfeitMaterial: '',
      qcLabelType: '',
      qcLabelMaterial: '',
      bellyBandType: '',
      bellyBandMaterial: '',
      tyvekType: '',
      tyvekMaterial: '',
      taffetaType: '',
      taffetaMaterial: '',
      closureFinish: '',
      sealShape: '',
      fastening: '',
      preStringing: '',
      application: '',
      barcodeType: '',
      applicationSpec: '',
      finishHandFeel: '',
      quality: '',
      sizeCode: '',
      securityFeature: '',
      verification: '',
      removal: '',
      traceability: '',
      closure: '',
      durability: '',
      inkType: '',
      printQuality: '',
      sizeFold: '',
      referenceImage: null
    }],
    // Step 5 - Packaging
    packaging: {
      type: 'STANDARD',
      casepackQty: '',
      qtyToBePacked: 'AS_PER_PO',
      customQty: '',
      productSelection: '',
      isAssortedPack: false,
      assortedSkuLink: '',
      artworkAndPackaging: '',
      materials: [{
        srNo: 1,
        product: '',
        components: '',
        materialDescription: '',
        netConsumptionPerPc: '',
        unit: '',
        casepack: '',
        placement: '',
        // Size fields (conditional for CUSHION/FILLER/TOTE BAG)
        size: {
          width: '',
          length: '',
          height: '',
          unit: '',
        },
        // Work orders (two sets)
        workOrders: [
          { workOrder: '', wastage: '', for: '' },
          { workOrder: '', wastage: '', for: '' },
        ],
        // Calculated fields
        totalNetConsumption: '',
        totalWastage: '',
        calculatedUnit: '',
        overage: '',
        grossConsumption: '',
        // New conditional fields for Part 5
        packagingMaterialType: '',
        noOfPlys: '',
        jointType: '',
        burstingStrength: '',
        surplus: '',
        surplusForSection: '',
        approvalAgainst: '',
        remarks: '',
        guage: '',
        printingRef: null,
        gummingQuality: '',
        punchHoles: '',
        flapSize: '',
        guageGsm: '',
        rollWidth: '',
        rollWidthUnit: '',
        tapeWidth: '',
        tapeWidthUnit: ''
      }],
    },
  });
  const [errors, setErrors] = useState({});

  const totalSteps = 5;

  // Step labels for progress bar
  const stepLabels = [
    'Product Identification',
    'Cut & Sew Spec',
    'Raw Material Sourcing',
    'Trims & Accessories',
    'Artwork & Labeling',
    'Packaging',
  ];

  // Update consumption materials when overage or poQty changes from Step 0
  useEffect(() => {
    if (formData.consumptionMaterials && formData.consumptionMaterials.length > 0 && currentStep === 3) {
      setFormData(prev => {
        if (!prev.consumptionMaterials || prev.consumptionMaterials.length === 0) {
          return prev;
        }
        const updatedMaterials = prev.consumptionMaterials.map(material => {
          if (!material) return material;
          const wastage = parseFloat(material.wastage?.replace('%', '') || material.wastage || '0') || 0;
          const net = parseFloat(material.netConsumption || '0') || 0;
          const overagePercent = parseFloat(prev.overagePercentage?.replace('%', '') || prev.overagePercentage || '0') || 0;
          const qty = parseFloat(prev.poQty || '0') || 0;
          
          let grossConsumption = '0';
          if (net > 0 && qty > 0) {
            const result = net * (1 + wastage / 100) * (1 + overagePercent / 100) * qty;
            grossConsumption = result.toFixed(6);
          }
          
          return {
            ...material,
            overage: prev.overagePercentage || '',
            poQty: prev.poQty || '',
            grossConsumption: grossConsumption
          };
        });
        return { ...prev, consumptionMaterials: updatedMaterials };
      });
    }
  }, [formData.overagePercentage, formData.poQty, currentStep]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'image' && files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep0 = () => {
    const newErrors = {};
    
    if (!formData.sku?.trim()) {
      newErrors.sku = 'SKU / Item No. is required';
    }
    if (!formData.image) {
      newErrors.image = 'Image is required';
    }
    if (!formData.product?.trim()) {
      newErrors.product = 'Product is required';
    }
    if (!formData.poQty) {
      newErrors.poQty = 'PO Qty is required';
    }
    if (!formData.overagePercentage?.trim()) {
      newErrors.overagePercentage = 'Overage % is required';
    }
    if (!formData.overageQty) {
      newErrors.overageQty = 'Overage Qty is required';
    }
    if (!formData.deliveryDueDate) {
      newErrors.deliveryDueDate = 'Delivery Due Date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    // Validate products and their components
    formData.products.forEach((product, productIndex) => {
      if (!product.name?.trim()) {
        newErrors[`product_${productIndex}_name`] = 'Product name is required';
      }
      
      // Validate components for each product
      product.components.forEach((component, componentIndex) => {
        if (!component.productComforter?.trim()) {
          newErrors[`product_${productIndex}_component_${componentIndex}_productComforter`] = 'Product/Comforter is required';
        }
        if (!component.unit?.trim()) {
          newErrors[`product_${productIndex}_component_${componentIndex}_unit`] = 'Unit is required';
        }
        if (component.unit === 'R METERS' && !component.gsm && component.gsm !== 0) {
          newErrors[`product_${productIndex}_component_${componentIndex}_gsm`] = 'GSM is required when unit is R METERS';
        }
        if (!component.wastage && component.wastage !== 0) {
          newErrors[`product_${productIndex}_component_${componentIndex}_wastage`] = 'Wastage is required';
        }
        // Validate cutting size for each component
        if (!component.cuttingSize.length && component.cuttingSize.length !== 0) {
          newErrors[`product_${productIndex}_component_${componentIndex}_cuttingLength`] = 'Cutting Length is required';
        }
        if (!component.cuttingSize.width && component.cuttingSize.width !== 0) {
          newErrors[`product_${productIndex}_component_${componentIndex}_cuttingWidth`] = 'Cutting Width is required';
        }
        // Validate sew size for each component
        if (!component.sewSize.length && component.sewSize.length !== 0) {
          newErrors[`product_${productIndex}_component_${componentIndex}_sewLength`] = 'Length is required';
        }
        if (!component.sewSize.width && component.sewSize.width !== 0) {
          newErrors[`product_${productIndex}_component_${componentIndex}_sewWidth`] = 'Width is required';
        }
      });
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProductNameChange = (productIndex, value) => {
    setFormData(prev => {
      const updatedProducts = [...prev.products];
      updatedProducts[productIndex] = {
        ...updatedProducts[productIndex],
        name: value
      };
      return { ...prev, products: updatedProducts };
    });
    
    // Clear error
    const errorKey = `product_${productIndex}_name`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const handleComponentChange = (productIndex, componentIndex, field, value) => {
    setFormData(prev => {
      const updatedProducts = [...prev.products];
      updatedProducts[productIndex] = {
        ...updatedProducts[productIndex],
        components: updatedProducts[productIndex].components.map((comp, idx) => 
          idx === componentIndex 
            ? { ...comp, [field]: value, ...(field === 'unit' && value !== 'R METERS' ? { gsm: '' } : {}) }
            : comp
        )
      };
      return { ...prev, products: updatedProducts };
    });
    
    // Clear error
    const errorKey = `product_${productIndex}_component_${componentIndex}_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
    // Clear GSM error when unit changes
    if (field === 'unit') {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`product_${productIndex}_component_${componentIndex}_gsm`];
        return newErrors;
      });
    }
  };

  const handleComponentCuttingSizeChange = (productIndex, componentIndex, field, value) => {
    setFormData(prev => {
      const updatedProducts = [...prev.products];
      updatedProducts[productIndex] = {
        ...updatedProducts[productIndex],
        components: updatedProducts[productIndex].components.map((comp, idx) => 
          idx === componentIndex 
            ? {
                ...comp,
                cuttingSize: {
                  ...comp.cuttingSize,
                  [field]: value
                }
              }
            : comp
        )
      };
      return { ...prev, products: updatedProducts };
    });
    
    // Clear error
    const errorKey = `product_${productIndex}_component_${componentIndex}_cutting${field.charAt(0).toUpperCase() + field.slice(1)}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const handleComponentSewSizeChange = (productIndex, componentIndex, field, value) => {
    setFormData(prev => {
      const updatedProducts = [...prev.products];
      updatedProducts[productIndex] = {
        ...updatedProducts[productIndex],
        components: updatedProducts[productIndex].components.map((comp, idx) => 
          idx === componentIndex 
            ? {
                ...comp,
                sewSize: {
                  ...comp.sewSize,
                  [field]: value
                }
              }
            : comp
        )
      };
      return { ...prev, products: updatedProducts };
    });
    
    // Clear error
    const errorKey = `product_${productIndex}_component_${componentIndex}_sew${field.charAt(0).toUpperCase() + field.slice(1)}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const addProduct = () => {
    setFormData(prev => ({
      ...prev,
      products: [...prev.products, {
        name: '',
        components: [{
          srNo: 1,
          productComforter: '',
          unit: '',
          gsm: '',
          cuttingSize: { length: '', width: '', unit: '' },
          sewSize: { length: '', width: '', unit: '' },
        }],
      }]
    }));
  };

  const removeProduct = (productIndex) => {
    if (formData.products.length > 1) {
      setFormData(prev => ({
        ...prev,
        products: prev.products.filter((_, i) => i !== productIndex)
      }));
    }
  };

  const addComponent = (productIndex) => {
    setFormData(prev => {
      const updatedProducts = [...prev.products];
      const currentComponents = updatedProducts[productIndex].components;
      updatedProducts[productIndex] = {
        ...updatedProducts[productIndex],
        components: [...currentComponents, {
          srNo: currentComponents.length + 1,
          productComforter: '',
          unit: '',
          gsm: '',
          wastage: '',
          cuttingSize: { length: '', width: '' },
          sewSize: { cns: '', length: '', width: '', netCns: '' },
        }]
      };
      return { ...prev, products: updatedProducts };
    });
  };

  const handleRawMaterialChange = (materialIndex, field, value) => {
    setFormData(prev => {
      const updatedRawMaterials = [...prev.rawMaterials];
      updatedRawMaterials[materialIndex] = {
        ...updatedRawMaterials[materialIndex],
        [field]: value
      };
      return { ...prev, rawMaterials: updatedRawMaterials };
    });
    
    // Clear error
    const errorKey = `rawMaterial_${materialIndex}_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const handleWorkOrderChange = (materialIndex, workOrderIndex, field, value) => {
    setFormData(prev => {
      const updatedRawMaterials = [...prev.rawMaterials];
      updatedRawMaterials[materialIndex] = {
        ...updatedRawMaterials[materialIndex],
        workOrders: updatedRawMaterials[materialIndex].workOrders.map((wo, idx) => {
          if (idx === workOrderIndex) {
            let updatedWO = { ...wo, [field]: value };
            
            // Clear conditional fields when work order type changes
            if (field === 'workOrder') {
              updatedWO = {
                workOrder: value,
                wastage: wo.wastage,
                forField: wo.forField,
                approvalAgainst: '',
                remarks: '',
                design: '',
                imageRef: null,
                machineType: '',
                reed: '',
                pick: '',
                warp: false,
                weft: false,
                ratioWarp: '',
                ratioWeft: '',
                ratioWeightWarp: '',
                ratioWeightWeft: '',
                pileHeight: '',
                tpi: '',
                quiltingType: '',
                printingType: '',
                wales: false,
                courses: false,
                ratioWales: '',
                ratioCourses: '',
                ratioWeightWales: '',
                ratioWeightCourses: '',
                receivedColorReference: '',
                referenceType: '',
                shrinkageWidth: false,
                shrinkageLength: false,
                shrinkageWidthPercent: '',
                shrinkageLengthPercent: '',
                ratioWidth: '',
                ratioLength: '',
                forSection: '',
                forSectionWidth: '',
                forSectionLength: '',
                cutType: '',
                cutSize: '',
                // Keep old fields for backward compatibility
                dyeingType: '',
                shrinkage: '',
                width: '',
                length: '',
                weavingType: '',
                warpWeft: '',
                ratio: '',
              };
            }

            const totalCns = parseFloat(updatedRawMaterials[materialIndex].netConsumption) || 0;

            // WEAVING: Warp/Weft logic
            if (field === 'warp' || field === 'weft') {
              if (updatedWO.warp && !updatedWO.weft) {
                updatedWO.ratioWarp = totalCns.toFixed(3);
                updatedWO.ratioWeft = '';
              } else if (!updatedWO.warp && updatedWO.weft) {
                updatedWO.ratioWeft = totalCns.toFixed(3);
                updatedWO.ratioWarp = '';
              } else if (!updatedWO.warp && !updatedWO.weft) {
                updatedWO.ratioWarp = '';
                updatedWO.ratioWeft = '';
              }
            }

            if (field === 'ratioWarp' || field === 'ratioWeft') {
              if (updatedWO.warp && updatedWO.weft) {
                if (field === 'ratioWarp') {
                  const val = parseFloat(value) || 0;
                  updatedWO.ratioWeft = Math.max(0, totalCns - val).toFixed(3);
                } else {
                  const val = parseFloat(value) || 0;
                  updatedWO.ratioWarp = Math.max(0, totalCns - val).toFixed(3);
                }
              }
            }

            // KNITTING: Wales/Courses logic
            if (field === 'wales' || field === 'courses') {
              if (updatedWO.wales && !updatedWO.courses) {
                updatedWO.ratioWales = totalCns.toFixed(3);
                updatedWO.ratioCourses = '';
              } else if (!updatedWO.wales && updatedWO.courses) {
                updatedWO.ratioCourses = totalCns.toFixed(3);
                updatedWO.ratioWales = '';
              } else if (!updatedWO.wales && !updatedWO.courses) {
                updatedWO.ratioWales = '';
                updatedWO.ratioCourses = '';
              }
            }

            if (field === 'ratioWales' || field === 'ratioCourses') {
              if (updatedWO.wales && updatedWO.courses) {
                if (field === 'ratioWales') {
                  const val = parseFloat(value) || 0;
                  updatedWO.ratioCourses = Math.max(0, totalCns - val).toFixed(3);
                } else {
                  const val = parseFloat(value) || 0;
                  updatedWO.ratioWales = Math.max(0, totalCns - val).toFixed(3);
                }
              }
            }

            // DYEING: Shrinkage Width/Length logic
            if (field === 'shrinkageWidth' || field === 'shrinkageLength') {
              if (updatedWO.shrinkageWidth && !updatedWO.shrinkageLength) {
                updatedWO.ratioWidth = totalCns.toFixed(3);
                updatedWO.ratioLength = '';
              } else if (!updatedWO.shrinkageWidth && updatedWO.shrinkageLength) {
                updatedWO.ratioLength = totalCns.toFixed(3);
                updatedWO.ratioWidth = '';
              } else if (!updatedWO.shrinkageWidth && !updatedWO.shrinkageLength) {
                updatedWO.ratioWidth = '';
                updatedWO.ratioLength = '';
              }
            }

            if (field === 'ratioWidth' || field === 'ratioLength') {
              if (updatedWO.shrinkageWidth && updatedWO.shrinkageLength) {
                if (field === 'ratioWidth') {
                  const val = parseFloat(value) || 0;
                  updatedWO.ratioLength = Math.max(0, totalCns - val).toFixed(3);
                } else {
                  const val = parseFloat(value) || 0;
                  updatedWO.ratioWidth = Math.max(0, totalCns - val).toFixed(3);
                }
              }
            }

            return updatedWO;
          }
          return wo;
        })
      };
      return { ...prev, rawMaterials: updatedRawMaterials };
    });
    
    // Clear error
    const errorKey = `rawMaterial_${materialIndex}_workOrder_${workOrderIndex}_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const addWorkOrder = (materialIndex) => {
    setFormData(prev => {
      const updatedRawMaterials = [...prev.rawMaterials];
      updatedRawMaterials[materialIndex] = {
        ...updatedRawMaterials[materialIndex],
        workOrders: [...updatedRawMaterials[materialIndex].workOrders, {
          workOrder: '',
          wastage: '',
          forField: '',
          approvalAgainst: '',
          remarks: '',
          design: '',
          imageRef: null,
          machineType: '',
          reed: '',
          pick: '',
          warp: false,
          weft: false,
          ratioWarp: '',
          ratioWeft: '',
          ratioWeightWarp: '',
          ratioWeightWeft: '',
          pileHeight: '',
          tpi: '',
          quiltingType: '',
          printingType: '',
          wales: false,
          courses: false,
          ratioWales: '',
          ratioCourses: '',
          ratioWeightWales: '',
          ratioWeightCourses: '',
          receivedColorReference: '',
          referenceType: '',
          shrinkageWidth: false,
          shrinkageLength: false,
          shrinkageWidthPercent: '',
          shrinkageLengthPercent: '',
          ratioWidth: '',
          ratioLength: '',
          forSection: '',
          cutType: '',
          cutSize: '',
          // Compatibility
          dyeingType: '',
          shrinkage: '',
          width: '',
          length: '',
          weavingType: '',
          warpWeft: '',
          ratio: '',
        }]
      };
      return { ...prev, rawMaterials: updatedRawMaterials };
    });
  };

  const validateStep3 = () => {
    const newErrors = {};
    
    if (!formData.consumptionMaterials || formData.consumptionMaterials.length === 0) {
      newErrors['consumptionMaterials'] = 'At least one consumption material is required';
      setErrors(newErrors);
      return false;
    }
    
    formData.consumptionMaterials.forEach((material, materialIndex) => {
      if (!material) return;
      if (!material.materialDescription?.trim()) {
        newErrors[`consumptionMaterial_${materialIndex}_materialDescription`] = 'Material Description is required';
      }
      if (!material.netConsumption?.trim()) {
        newErrors[`consumptionMaterial_${materialIndex}_netConsumption`] = 'Net Consumption per Pc is required';
      }
      if (!material.unit?.trim()) {
        newErrors[`consumptionMaterial_${materialIndex}_unit`] = 'Unit is required';
      }
      if (!material.workOrder?.trim()) {
        newErrors[`consumptionMaterial_${materialIndex}_workOrder`] = 'Work Order is required';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConsumptionMaterialChange = (materialIndex, field, value) => {
    setFormData(prev => {
      if (!prev.consumptionMaterials || !prev.consumptionMaterials[materialIndex]) {
        return prev;
      }
      const updatedMaterials = [...prev.consumptionMaterials];
      const currentMaterial = updatedMaterials[materialIndex];
      
      // If trimAccessory changes, clear all category-specific fields
      if (field === 'trimAccessory') {
        const clearedMaterial = {
          ...currentMaterial,
          trimAccessory: value,
          // Clear all conditional fields
          zipNumber: '', zipType: '', brand: '', teeth: '', puller: '', pullerType: '', length: '',
          velcroType: '', velcroMaterial: '', width: '', colour: '', hookDensityLoopType: '', cycleLife: '', attachmentMethod: '',
          threadType: '', fibreContent: '', countTicketNo: '', ply: '', threadFinish: '', usage: '',
          buttonType: '', buttonMaterial: '', sizeLigne: '', finishColour: '', buttonAttachmentMethod: '', function: '',
          rivetType: '', rivetMaterial: '', capSize: '', postHeightLength: '', finishPlating: '', pullerStrength: '', rivetPullerType: '',
          niwarType: '', niwarMaterial: '', niwarWidth: '', niwarThickness: '', niwarColour: '', finishCoating: '', tensileStrength: '',
          laceType: '', laceMaterial: '', laceWidth: '', laceColour: '', laceFinishing: '', laceUsage: '', designReference: '',
          interliningType: '', interliningMaterial: '', gsmWeight: '', adhesive: '', interliningColour: '', fusingSpec: '',
          hookEyeType: '', hookEyeMaterial: '', hookEyeSize: '', hookEyeColour: '', hookEyeFinish: '', strength: '', application: '',
          buckleType: '', buckleMaterial: '', buckleSize: '', buckleFinishColour: '', buckleFunction: '', buckleTensileStrength: '',
          eyeletType: '', eyeletMaterial: '', innerDiameter: '', outerDiameter: '', eyeletColour: '', eyeletApplication: '', tooling: '',
          elasticType: '', elasticMaterial: '', elasticWidth: '', elasticColour: '', stretchTension: '', elasticPacking: '',
          feltType: '', feltMaterial: '', feltThickness: '', densityGsm: '', feltColour: '', feltFinishForm: '', feltApplication: '',
          shoulderPadType: '', shoulderPadMaterial: '', shoulderPadSize: '', shape: '', covering: '', shoulderPadAttachment: '', weight: '',
          tubularType: '', tubularMaterial: '', widthDiameter: '', weightDensity: '', tubularColour: '', stretchPercent: '', cutting: '',
          rfidType: '', formFactor: '', frequency: '', chipIcType: '', rfidSize: '', coding: '', security: '',
          cableTieType: '', cableTieMaterial: '', cableTieSize: '', cableTieColour: '', cableTieTensileStrength: '', cableTieFinish: '', cableTieUsage: '',
          fringeType: '', fringeMaterial: '', dropLength: '', tapeWidth: '', fringeColour: '', fringeFinish: '', construction: '',
          pipeType: '', pipeMaterial: '', diameterDimensions: '', pipeLength: '', pipeColour: '', endCaps: '', flexibility: '', pipeUsage: '',
          seamTapeType: '', seamTapeMaterial: '', seamTapeWidth: '', seamTapeColour: '', seamTapeAdhesiveType: '', applicationSpec: '', elasticity: '',
          adhesiveType: '', materialBase: '', adhesiveApplication: '', viscosity: '', settingTime: '', adhesiveColour: '', applicator: '',
          hemType: '', hemMaterial: '', cutType: '', hemWidth: '', foldType: '', hemColour: '', hemPackaging: '',
          reflectiveType: '', reflectiveMaterial: '', reflectiveWidth: '', reflectiveColour: '', certification: '', baseFabric: '',
          frType: '', frMaterial: '', complianceLevel: '', frColour: '', durability: '', frComponents: '',
          repairKitType: '', repairKitMaterial: '', sizeShape: '', repairKitColour: '', repairKitPackaging: '', userApplication: '', contents: '',
          cordStopType: '', cordStopMaterial: '', cordStopSize: '', cordStopColour: '', lockingMechanism: '', cordStopFunction: '',
          dRingType: '', dRingMaterial: '', dRingSize: '', thicknessGauge: '', dRingFinishPlating: '', loadRating: '', dRingApplication: '',
          foamType: '', foamDensity: '', foamThickness: '', shapeId: '', foamColour: '', properties: '', foamAttachment: '',
          pinType: '', pinMaterial: '', pinSize: '', pinColour: '', pinTensileStrength: '', headType: '', pinApplication: '',
          magneticType: '', magneticMaterial: '', magneticSize: '', magneticStrength: '', polarity: '', magneticApplication: '',
          // Clear common fields
          testingRequirement: '', testingRequirementFile: null, lengthQuantity: '', buyersInitialIpp: '', unitAdditional: '',
        };
        updatedMaterials[materialIndex] = clearedMaterial;
      } else {
        // Handle nested fields like size.width, size.length, etc.
        if (field.startsWith('size.')) {
          const sizeField = field.split('.')[1];
      updatedMaterials[materialIndex] = {
            ...currentMaterial,
            size: {
              ...currentMaterial.size,
              [sizeField]: value
            }
          };
        } else {
          updatedMaterials[materialIndex] = {
            ...currentMaterial,
        [field]: value
      };
        }
      }
      
      // Recalculate total wastage and gross consumption when relevant fields change
      if (field === 'wastage' || field === 'netConsumption') {
        const wastage = parseFloat(updatedMaterials[materialIndex].wastage?.replace('%', '') || updatedMaterials[materialIndex].wastage || '0') || 0;
        updatedMaterials[materialIndex].totalWastage = `${wastage}%`;
        updatedMaterials[materialIndex].grossConsumption = calculateGrossConsumption(
          updatedMaterials[materialIndex].netConsumption || '0',
          wastage,
          prev.overagePercentage || '0',
          prev.poQty || '0'
        );
      }
      
      return { ...prev, consumptionMaterials: updatedMaterials };
    });
    
    // Clear error
    const errorKey = `consumptionMaterial_${materialIndex}_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const addConsumptionMaterial = () => {
    setFormData(prev => {
      const newSrNo = prev.consumptionMaterials.length + 1;
      return {
        ...prev,
        consumptionMaterials: [...prev.consumptionMaterials, {
          srNo: newSrNo,
          components: '',
          trimAccessory: '',
          materialDescription: '',
          netConsumption: '',
          unit: '',
          placement: '',
          size: {
            width: '',
            length: '',
            height: '',
            unit: '',
          },
          workOrder: '',
          surplus: '',
          surplusForSection: '',
          approval: '',
          remarks: '',
          testingRequirement: '',
          testingRequirementFile: null,
          lengthQuantity: '',
          buyersInitialIpp: '',
          unitAdditional: '',
          // Conditional fields for different trim types
          // ZIPPERS
          zipNumber: '',
          zipType: '',
          brand: '',
          teeth: '',
          puller: '',
          pullerType: '',
          length: '',
          // VELCRO
          velcroType: '',
          velcroMaterial: '',
          width: '',
          colour: '',
          hookDensityLoopType: '',
          cycleLife: '',
          attachmentMethod: '',
          // STITCHING THREAD
          threadType: '',
          fibreContent: '',
          countTicketNo: '',
          ply: '',
          threadFinish: '',
          usage: '',
          // BUTTONS
          buttonType: '',
          buttonMaterial: '',
          sizeLigne: '',
          finishColour: '',
          buttonAttachmentMethod: '',
          function: '',
          // RIVETS
          rivetType: '',
          rivetMaterial: '',
          capSize: '',
          postHeightLength: '',
          finishPlating: '',
          pullerStrength: '',
          rivetPullerType: '',
          // NIWAR
          niwarType: '',
          niwarMaterial: '',
          niwarWidth: '',
          niwarThickness: '',
          niwarColour: '',
          finishCoating: '',
          tensileStrength: '',
          // LACE
          laceType: '',
          laceMaterial: '',
          laceWidth: '',
          laceColour: '',
          laceFinishing: '',
          laceUsage: '',
          designReference: '',
          // INTERLINING/FUSING
          interliningType: '',
          interliningMaterial: '',
          gsmWeight: '',
          adhesive: '',
          interliningColour: '',
          fusingSpec: '',
          // HOOKS & EYES
          hookEyeType: '',
          hookEyeMaterial: '',
          hookEyeSize: '',
          hookEyeColour: '',
          hookEyeFinish: '',
          strength: '',
          application: '',
          // BUCKLES & ADJUSTERS
          buckleType: '',
          buckleMaterial: '',
          buckleSize: '',
          buckleFinishColour: '',
          buckleFunction: '',
          buckleTensileStrength: '',
          // EYELETS & GROMMETS
          eyeletType: '',
          eyeletMaterial: '',
          innerDiameter: '',
          outerDiameter: '',
          eyeletColour: '',
          eyeletApplication: '',
          tooling: '',
          // ELASTIC
          elasticType: '',
          elasticMaterial: '',
          elasticWidth: '',
          elasticColour: '',
          stretchTension: '',
          elasticPacking: '',
          // FELT
          feltType: '',
          feltMaterial: '',
          feltThickness: '',
          densityGsm: '',
          feltColour: '',
          feltFinishForm: '',
          feltApplication: '',
          // SHOULDER PADS
          shoulderPadType: '',
          shoulderPadMaterial: '',
          shoulderPadSize: '',
          shape: '',
          covering: '',
          shoulderPadAttachment: '',
          weight: '',
          // TUBULAR KNITS
          tubularType: '',
          tubularMaterial: '',
          widthDiameter: '',
          weightDensity: '',
          tubularColour: '',
          stretchPercent: '',
          cutting: '',
          // RFID / EAS TAGS
          rfidType: '',
          formFactor: '',
          frequency: '',
          chipIcType: '',
          rfidSize: '',
          coding: '',
          security: '',
          // PLASTIC CABLE TIES
          cableTieType: '',
          cableTieMaterial: '',
          cableTieSize: '',
          cableTieColour: '',
          cableTieTensileStrength: '',
          cableTieFinish: '',
          cableTieUsage: '',
          // FRINGE/TASSELS
          fringeType: '',
          fringeMaterial: '',
          dropLength: '',
          tapeWidth: '',
          fringeColour: '',
          fringeFinish: '',
          construction: '',
          // PLASTIC PIPES/RODS
          pipeType: '',
          pipeMaterial: '',
          diameterDimensions: '',
          pipeLength: '',
          pipeColour: '',
          endCaps: '',
          flexibility: '',
          pipeUsage: '',
          // SEAM SEALING TAPE
          seamTapeType: '',
          seamTapeMaterial: '',
          seamTapeWidth: '',
          seamTapeColour: '',
          seamTapeAdhesiveType: '',
          applicationSpec: '',
          elasticity: '',
          // ADHESIVES/GUNNING
          adhesiveType: '',
          materialBase: '',
          adhesiveApplication: '',
          viscosity: '',
          settingTime: '',
          adhesiveColour: '',
          applicator: '',
          // PRE-CUT HEMS/BINDINGS
          hemType: '',
          hemMaterial: '',
          cutType: '',
          hemWidth: '',
          foldType: '',
          hemColour: '',
          hemPackaging: '',
          // REFLECTIVE TAPES/TRIMS
          reflectiveType: '',
          reflectiveMaterial: '',
          reflectiveWidth: '',
          reflectiveColour: '',
          certification: '',
          baseFabric: '',
          // FIRE RETARDANT TRIMS
          frType: '',
          frMaterial: '',
          complianceLevel: '',
          frColour: '',
          durability: '',
          frComponents: '',
          // REPAIR KITS/PATCHES
          repairKitType: '',
          repairKitMaterial: '',
          sizeShape: '',
          repairKitColour: '',
          repairKitPackaging: '',
          userApplication: '',
          contents: '',
          // CORD STOPS
          cordStopType: '',
          cordStopMaterial: '',
          cordStopSize: '',
          cordStopColour: '',
          lockingMechanism: '',
          cordStopFunction: '',
          // D-RINGS
          dRingType: '',
          dRingMaterial: '',
          dRingSize: '',
          thicknessGauge: '',
          dRingFinishPlating: '',
          loadRating: '',
          dRingApplication: '',
          // FOAM/WADDING
          foamType: '',
          foamDensity: '',
          foamThickness: '',
          shapeId: '',
          foamColour: '',
          properties: '',
          foamAttachment: '',
          // PINS/TAGGING BARBS
          pinType: '',
          pinMaterial: '',
          pinSize: '',
          pinColour: '',
          pinTensileStrength: '',
          headType: '',
          pinApplication: '',
          // MAGNETIC CLOSURES
          magneticType: '',
          magneticMaterial: '',
          magneticSize: '',
          magneticStrength: '',
          polarity: '',
          magneticApplication: '',
        }]
      };
    });
  };

  const removeConsumptionMaterial = (materialIndex) => {
    if (formData.consumptionMaterials.length > 1) {
      setFormData(prev => ({
        ...prev,
        consumptionMaterials: prev.consumptionMaterials.filter((_, i) => i !== materialIndex).map((material, i) => ({
          ...material,
          srNo: i + 1
        }))
      }));
    }
  };

  const validateStep5 = () => {
    const newErrors = {};
    const { packaging } = formData;
    
    if (!packaging.casepackQty?.trim()) {
      newErrors['packaging_casepackQty'] = 'Casepack Qty is required';
    }
    
    if (packaging.qtyToBePacked === 'CUSTOM_QTY' && !packaging.customQty?.trim()) {
      newErrors['packaging_customQty'] = 'Custom Qty is required';
    }
    
    if (packaging.isAssortedPack && !packaging.assortedSkuLink?.trim()) {
      newErrors['packaging_assortedSkuLink'] = 'Assorted SKU Link/IPC# is required';
    }
    
    // Validate materials
    packaging.materials.forEach((material, materialIndex) => {
      if (!material.product?.trim()) {
        newErrors[`packaging_material_${materialIndex}_product`] = 'Product is required';
      }
      if (!material.materialDescription?.trim()) {
        newErrors[`packaging_material_${materialIndex}_materialDescription`] = 'Material Description is required';
      }
      if (!material.netConsumptionPerPc?.trim()) {
        newErrors[`packaging_material_${materialIndex}_netConsumptionPerPc`] = 'Net Consumption per Pc is required';
      }
      if (!material.unit?.trim()) {
        newErrors[`packaging_material_${materialIndex}_unit`] = 'Unit is required';
      }
      if (!material.casepack?.trim()) {
        newErrors[`packaging_material_${materialIndex}_casepack`] = 'Casepack is required';
      }
      
      // Validate size if required
      if (requiresSizeFields(packaging.productSelection)) {
        if (!material.size.width?.trim()) {
          newErrors[`packaging_material_${materialIndex}_size_width`] = 'Width is required';
        }
        if (!material.size.length?.trim()) {
          newErrors[`packaging_material_${materialIndex}_size_length`] = 'Length is required';
        }
        if (!material.size.height?.trim()) {
          newErrors[`packaging_material_${materialIndex}_size_height`] = 'Height is required';
        }
        if (!material.size.unit?.trim()) {
          newErrors[`packaging_material_${materialIndex}_size_unit`] = 'Size Unit is required';
        }
      }
      
      // Validate work orders
      material.workOrders.forEach((wo, woIndex) => {
        if (wo.workOrder && !wo.wastage?.trim()) {
          newErrors[`packaging_material_${materialIndex}_workOrder_${woIndex}_wastage`] = 'Wastage is required';
        }
        if (wo.workOrder && !wo.for?.trim()) {
          newErrors[`packaging_material_${materialIndex}_workOrder_${woIndex}_for`] = 'FOR is required';
        }
      });
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep4 = () => {
    const newErrors = {};
    
    if (!formData.artworkMaterials || formData.artworkMaterials.length === 0) {
      newErrors['artworkMaterials'] = 'At least one artwork material is required';
      setErrors(newErrors);
      return false;
    }
    
    formData.artworkMaterials.forEach((material, materialIndex) => {
      if (!material) return;
      if (!material.materialDescription?.trim()) {
        newErrors[`artworkMaterial_${materialIndex}_materialDescription`] = 'Material Description is required';
      }
      if (!material.netConsumption?.trim()) {
        newErrors[`artworkMaterial_${materialIndex}_netConsumption`] = 'Net Consumption per Pc is required';
      }
      if (!material.unit?.trim()) {
        newErrors[`artworkMaterial_${materialIndex}_unit`] = 'Unit is required';
      }
      if (!material.placement?.trim()) {
        newErrors[`artworkMaterial_${materialIndex}_placement`] = 'PLACEMENT is required';
      }
      if (!material.workOrder?.trim()) {
        newErrors[`artworkMaterial_${materialIndex}_workOrder`] = 'Work Order is required';
      }
      
      // Validate conditional fields for R.Mtr unit
      if (material.unit === 'R.Mtr' || material.unit === 'R METER' || material.unit === 'R METERS') {
        if (!material.width?.trim()) {
          newErrors[`artworkMaterial_${materialIndex}_width`] = 'Width is required when unit is R.Mtr';
        }
        if (!material.size?.trim()) {
          newErrors[`artworkMaterial_${materialIndex}_size`] = 'Size is required when unit is R.Mtr';
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleArtworkMaterialChange = (materialIndex, field, value) => {
    setFormData(prev => {
      if (!prev.artworkMaterials || !prev.artworkMaterials[materialIndex]) {
        return prev;
      }
      const updatedMaterials = [...prev.artworkMaterials];
      updatedMaterials[materialIndex] = {
        ...updatedMaterials[materialIndex],
        [field]: value
      };

      // Clear category-specific fields when category changes
      if (field === 'artworkCategory') {
        const resetFields = {
          specificType: '', material: '', sizeArtworkId: '', foldType: '', colours: '',
          finishing: '', testingRequirement: '', lengthQuantity: '', surplus: '',
          surplusForSection: '',
          approval: '', remarks: '', careSymbols: '', countryOfOrigin: '',
          manufacturerId: '', language: '', permanence: '', sizeShape: '',
          attachment: '', content: '', symbol: '', certificationId: '',
          formFactor: '', chipFrequency: '', coding: '', adhesive: '',
          security: '', contentMandates: '', fillingMaterials: '',
          newUsedStatus: '', registrationLicenses: '', lawLabelType: '',
          lawLabelMaterial: '', hangTagType: '', hangTagMaterial: '',
          priceTicketType: '', priceTicketMaterial: '', heatTransferType: '',
          heatTransferMaterialBase: '', upcType: '', upcMaterial: '',
          sizeLabelType: '', sizeLabelMaterial: '', antiCounterfeitType: '',
          antiCounterfeitMaterial: '', qcLabelType: '', qcLabelMaterial: '',
          bellyBandType: '', bellyBandMaterial: '', tyvekType: '', tyvekMaterial: '',
          taffetaType: '', taffetaMaterial: '', closureFinish: '',
          sealShape: '', fastening: '', preStringing: '', application: '', barcodeType: '',
          applicationSpec: '', finishHandFeel: '', quality: '', sizeCode: '',
          securityFeature: '', verification: '', removal: '', traceability: '',
          closure: '', durability: '', inkType: '', printQuality: '',
          sizeFold: '', referenceImage: null
        };
        updatedMaterials[materialIndex] = {
          ...updatedMaterials[materialIndex],
          ...resetFields,
          artworkCategory: value
        };
      }

      // Clear width and size when unit changes away from R.Mtr
      if (field === 'unit' && value !== 'R.Mtr' && value !== 'R METER' && value !== 'R METERS') {
        updatedMaterials[materialIndex].width = '';
        updatedMaterials[materialIndex].size = '';
      }
      return { ...prev, artworkMaterials: updatedMaterials };
    });
    
    // Clear error
    const errorKey = `artworkMaterial_${materialIndex}_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
    // Clear width and size errors when unit changes
    if (field === 'unit') {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`artworkMaterial_${materialIndex}_width`];
        delete newErrors[`artworkMaterial_${materialIndex}_size`];
        return newErrors;
      });
    }
  };

  const addArtworkMaterial = () => {
    setFormData(prev => {
      const newSrNo = prev.artworkMaterials ? prev.artworkMaterials.length + 1 : 1;
      return {
        ...prev,
        artworkMaterials: [...(prev.artworkMaterials || []), {
          srNo: newSrNo,
          components: '',
          materialDescription: '',
          netConsumption: '',
          unit: '',
          placement: '',
          workOrder: '',
          wastage: '',
          forField: '',
          packagingWorkOrder: '',
          width: '',
          size: '',
          gsm: '',
          sizeWidth: '',
          sizeLength: '',
          sizeHeight: '',
          sizeUnit: '',
          artworkCategory: '',
          specificType: '',
          material: '',
          sizeArtworkId: '',
          foldType: '',
          colours: '',
          finishing: '',
          testingRequirement: '',
          lengthQuantity: '',
          surplus: '',
          surplusForSection: '',
          approval: '',
          remarks: '',
          careSymbols: '',
          countryOfOrigin: '',
          manufacturerId: '',
          language: '',
          permanence: '',
          sizeShape: '',
          attachment: '',
          content: '',
          symbol: '',
          certificationId: '',
          formFactor: '',
          chipFrequency: '',
          coding: '',
          adhesive: '',
          security: '',
          contentMandates: '',
          fillingMaterials: '',
          newUsedStatus: '',
          registrationLicenses: '',
          lawLabelType: '',
          lawLabelMaterial: '',
          hangTagType: '',
          hangTagMaterial: '',
          priceTicketType: '',
          priceTicketMaterial: '',
          heatTransferType: '',
          heatTransferMaterialBase: '',
          upcType: '',
          upcMaterial: '',
          sizeLabelType: '',
          sizeLabelMaterial: '',
          antiCounterfeitType: '',
          antiCounterfeitMaterial: '',
          qcLabelType: '',
          qcLabelMaterial: '',
          bellyBandType: '',
          bellyBandMaterial: '',
          tyvekType: '',
          tyvekMaterial: '',
          taffetaType: '',
          taffetaMaterial: '',
          closureFinish: '',
          sealShape: '',
          fastening: '',
          preStringing: '',
          application: '',
          barcodeType: '',
          applicationSpec: '',
          finishHandFeel: '',
          quality: '',
          sizeCode: '',
          securityFeature: '',
          verification: '',
          removal: '',
          traceability: '',
          closure: '',
          durability: '',
          inkType: '',
          printQuality: '',
          sizeFold: '',
          referenceImage: null,
          usage: '',
          ribbonWidth: ''
        }]
      };
    });
  };

  const removeArtworkMaterial = (materialIndex) => {
    if (formData.artworkMaterials && formData.artworkMaterials.length > 1) {
      setFormData(prev => ({
        ...prev,
        artworkMaterials: prev.artworkMaterials.filter((_, i) => i !== materialIndex).map((material, i) => ({
          ...material,
          srNo: i + 1
        }))
      }));
    }
  };

  // Packaging Configuration Change Handler
  const handlePackagingChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      packaging: {
        ...prev.packaging,
        [field]: value,
        // Reset custom qty related fields when type changes
        ...(field === 'qtyToBePacked' && value !== 'CUSTOM_QTY' ? { customQty: '', isAssortedPack: false } : {}),
      }
    }));
    
    const errorKey = `packaging_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  // Packaging Material Change Handler
  const handlePackagingMaterialChange = (materialIndex, field, value) => {
    setFormData(prev => {
      const updatedMaterials = [...prev.packaging.materials];
      
      // Clear material-specific fields when description changes
      if (field === 'materialDescription') {
        const resetFields = {
          noOfPlys: '', jointType: '', burstingStrength: '',
          surplus: '', surplusForSection: '', approvalAgainst: '',
          remarks: '', guage: '', printingRef: null,
          gummingQuality: '', punchHoles: '', flapSize: '',
          guageGsm: '', rollWidth: '', rollWidthUnit: '',
          tapeWidth: '', tapeWidthUnit: ''
        };
      updatedMaterials[materialIndex] = {
        ...updatedMaterials[materialIndex],
          ...resetFields,
        [field]: value
      };
      } else {
        updatedMaterials[materialIndex] = {
          ...updatedMaterials[materialIndex],
          [field]: value
        };
      }
      
      // Auto-calculate gross consumption when relevant fields change
      const material = updatedMaterials[materialIndex];
      if (['netConsumptionPerPc', 'overage'].includes(field) || field.startsWith('workOrder')) {
        const netConsumption = parseFloat(material.netConsumptionPerPc) || 0;
        const overage = parseFloat(material.overage) || 0;
        const poQty = parseFloat(prev.poQty) || 0;
        
        // Calculate total wastage from work orders
        let totalWastagePercent = 0;
        material.workOrders.forEach(wo => {
          totalWastagePercent += parseFloat(wo.wastage) || 0;
        });
        
        const baseConsumption = netConsumption * poQty;
        const wastageAmount = baseConsumption * (totalWastagePercent / 100);
        const overageAmount = baseConsumption * (overage / 100);
        const grossConsumption = baseConsumption + wastageAmount + overageAmount;
        
        updatedMaterials[materialIndex].totalWastage = totalWastagePercent.toFixed(2);
        updatedMaterials[materialIndex].grossConsumption = grossConsumption.toFixed(4);
      }
      
      return {
        ...prev,
        packaging: {
          ...prev.packaging,
          materials: updatedMaterials
        }
      };
    });
    
    const errorKey = `packaging_material_${materialIndex}_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  // Packaging Material Size Change Handler
  const handlePackagingMaterialSizeChange = (materialIndex, field, value) => {
    setFormData(prev => {
      const updatedMaterials = [...prev.packaging.materials];
      updatedMaterials[materialIndex] = {
        ...updatedMaterials[materialIndex],
        size: {
          ...updatedMaterials[materialIndex].size,
          [field]: value
        }
      };
      return {
        ...prev,
        packaging: {
          ...prev.packaging,
          materials: updatedMaterials
        }
      };
    });
    
    const errorKey = `packaging_material_${materialIndex}_size_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  // Packaging Work Order Change Handler
  const handlePackagingWorkOrderChange = (materialIndex, workOrderIndex, field, value) => {
    setFormData(prev => {
      const updatedMaterials = [...prev.packaging.materials];
      updatedMaterials[materialIndex] = {
        ...updatedMaterials[materialIndex],
        workOrders: updatedMaterials[materialIndex].workOrders.map((wo, idx) =>
          idx === workOrderIndex ? { ...wo, [field]: value } : wo
        )
      };
      
      // Recalculate total wastage
      let totalWastagePercent = 0;
      updatedMaterials[materialIndex].workOrders.forEach(wo => {
        totalWastagePercent += parseFloat(wo.wastage) || 0;
      });
      updatedMaterials[materialIndex].totalWastage = totalWastagePercent.toFixed(2);
      
      // Recalculate gross consumption
      const material = updatedMaterials[materialIndex];
      const netConsumption = parseFloat(material.netConsumptionPerPc) || 0;
      const overage = parseFloat(material.overage) || 0;
      const poQty = parseFloat(prev.poQty) || 0;
      
      const baseConsumption = netConsumption * poQty;
      const wastageAmount = baseConsumption * (totalWastagePercent / 100);
      const overageAmount = baseConsumption * (overage / 100);
      const grossConsumption = baseConsumption + wastageAmount + overageAmount;
      
      updatedMaterials[materialIndex].grossConsumption = grossConsumption.toFixed(4);
      
      return {
        ...prev,
        packaging: {
          ...prev.packaging,
          materials: updatedMaterials
        }
      };
    });
    
    const errorKey = `packaging_material_${materialIndex}_workOrder_${workOrderIndex}_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  // Add Packaging Material
  const addPackagingMaterial = () => {
    setFormData(prev => ({
      ...prev,
      packaging: {
        ...prev.packaging,
        materials: [...prev.packaging.materials, {
          srNo: prev.packaging.materials.length + 1,
          product: '',
          components: '',
          materialDescription: '',
          netConsumptionPerPc: '',
          unit: '',
          casepack: '',
          placement: '',
          size: {
            width: '',
            length: '',
            height: '',
            unit: '',
          },
          workOrders: [
            { workOrder: '', wastage: '', for: '' },
            { workOrder: '', wastage: '', for: '' },
          ],
          totalNetConsumption: '',
          totalWastage: '',
          calculatedUnit: '',
          overage: '',
          grossConsumption: '',
          // New conditional fields for Part 5
          packagingMaterialType: '',
          noOfPlys: '',
          jointType: '',
          burstingStrength: '',
          surplus: '',
          surplusForSection: '',
          approvalAgainst: '',
          remarks: '',
          guage: '',
          printingRef: null,
          gummingQuality: '',
          punchHoles: '',
          flapSize: '',
          guageGsm: '',
          rollWidth: '',
          rollWidthUnit: '',
          tapeWidth: '',
          tapeWidthUnit: ''
        }]
      }
    }));
  };

  // Remove Packaging Material
  const removePackagingMaterial = (materialIndex) => {
    if (formData.packaging.materials.length > 1) {
      setFormData(prev => {
        const filteredMaterials = prev.packaging.materials.filter((_, i) => i !== materialIndex);
        filteredMaterials.forEach((material, i) => {
          material.srNo = i + 1;
        });
        return {
          ...prev,
          packaging: {
            ...prev.packaging,
            materials: filteredMaterials
          }
        };
      });
    }
  };

  // Check if product requires size fields (CUSHION/FILLER/TOTE BAG)
  const requiresSizeFields = (productSelection) => {
    const sizeRequiredProducts = ['CUSHION', 'FILLER', 'TOTE BAG', 'VELVET CUSHION', 'COMFORTER', 'PILLOW', 'BAG'];
    return sizeRequiredProducts.some(p => 
      productSelection?.toUpperCase().includes(p)
    );
  };

  const removeWorkOrder = (materialIndex, workOrderIndex) => {
    setFormData(prev => {
      const updatedRawMaterials = [...prev.rawMaterials];
      if (updatedRawMaterials[materialIndex].workOrders.length > 1) {
        updatedRawMaterials[materialIndex] = {
          ...updatedRawMaterials[materialIndex],
          workOrders: updatedRawMaterials[materialIndex].workOrders.filter((_, idx) => idx !== workOrderIndex)
        };
      }
      return { ...prev, rawMaterials: updatedRawMaterials };
    });
  };

  const removeComponent = (productIndex, componentIndex) => {
    setFormData(prev => {
      const updatedProducts = [...prev.products];
      const currentComponents = updatedProducts[productIndex].components;
      if (currentComponents.length > 1) {
        const filteredComponents = currentComponents.filter((_, i) => i !== componentIndex);
        // Update SR numbers
        filteredComponents.forEach((component, i) => {
          component.srNo = i + 1;
        });
        updatedProducts[productIndex] = {
          ...updatedProducts[productIndex],
          components: filteredComponents
        };
      }
      return { ...prev, products: updatedProducts };
    });
  };

  const initializeRawMaterials = () => {
    // Initialize raw materials based on products and components from Step 1
    const rawMaterials = [];
    formData.products.forEach((product, productIndex) => {
      product.components.forEach((component, componentIndex) => {
        rawMaterials.push({
          productIndex,
          componentIndex,
          productName: product.name,
          componentName: component.productComforter,
          srNo: component.srNo,
          materialDescription: '',
          netConsumption: '',
          unit: component.unit || '',
          workOrders: [{
            workOrder: '',
            wastage: '',
            forField: '',
            approvalAgainst: '',
            remarks: '',
            design: '',
            imageRef: null,
            machineType: '',
            reed: '',
            pick: '',
            warp: false,
            weft: false,
            ratioWarp: '',
            ratioWeft: '',
            ratioWeightWarp: '',
            ratioWeightWeft: '',
            pileHeight: '',
            tpi: '',
            quiltingType: '',
            printingType: '',
            wales: false,
            courses: false,
            ratioWales: '',
            ratioCourses: '',
            ratioWeightWales: '',
            ratioWeightCourses: '',
            receivedColorReference: '',
            referenceType: '',
            shrinkageWidth: false,
            shrinkageLength: false,
            shrinkageWidthPercent: '',
            shrinkageLengthPercent: '',
            ratioWidth: '',
            ratioLength: '',
            forSection: '',
            forSectionWidth: '',
            forSectionLength: '',
            cutType: '',
            cutSize: '',
            // Compatibility
            dyeingType: '',
            shrinkage: '',
            width: '',
            length: '',
            weavingType: '',
            warpWeft: '',
            ratio: '',
          }],
        });
      });
    });
    return rawMaterials;
  };

  const initializeConsumptionMaterials = () => {
    // Initialize consumption materials based on raw materials from Step 2
    if (!formData.rawMaterials || formData.rawMaterials.length === 0) {
      return [{
        srNo: 1,
        productName: '',
        componentName: '',
        materialDescription: '',
        netConsumption: '',
        unit: '',
        workOrder: '',
        wastage: '',
        forField: '',
        totalWastage: '0%',
        overage: formData.overagePercentage || '',
        poQty: formData.poQty || '',
        grossConsumption: '0',
      }];
    }
    
    const consumptionMaterials = formData.rawMaterials.map((material, index) => {
      if (!material) return null;
      const totalWastage = calculateTotalWastage(material.workOrders || []);
      return {
        srNo: material.srNo || index + 1,
        productName: material.productName || '',
        componentName: material.componentName || '',
        materialDescription: material.materialDescription || '',
        netConsumption: material.netConsumption || '',
        unit: material.unit || '',
        workOrder: material.workOrders?.[0]?.workOrder || '',
        wastage: material.workOrders?.[0]?.wastage || '',
        forField: material.workOrders?.[0]?.forField || '',
        totalWastage: `${totalWastage}%`,
        overage: formData.overagePercentage || '',
        poQty: formData.poQty || '',
        grossConsumption: calculateGrossConsumption(
          material.netConsumption || '0',
          totalWastage,
          formData.overagePercentage || '0',
          formData.poQty || '0'
        ),
      };
    }).filter(Boolean); // Remove any null entries
    return consumptionMaterials;
  };

  const calculateTotalWastage = (workOrders) => {
    if (!workOrders || workOrders.length === 0) return 0;
    // Sum all wastage percentages
    const total = workOrders.reduce((sum, wo) => {
      const wastage = parseFloat(wo.wastage?.replace('%', '')) || 0;
      return sum + wastage;
    }, 0);
    return total;
  };

  const calculateGrossConsumption = (netConsumption, totalWastage, overage, poQty) => {
    const net = parseFloat(netConsumption) || 0;
    const wastage = parseFloat(totalWastage) || 0;
    const overagePercent = parseFloat(overage?.replace('%', '')) || 0;
    const qty = parseFloat(poQty) || 0;
    
    if (net === 0 || qty === 0) return 0;
    
    // Gross Consumption = Net Consumption * (1 + Total Wastage/100) * (1 + OVERAGE/100) * Po QTY
    const result = net * (1 + wastage / 100) * (1 + overagePercent / 100) * qty;
    return result.toFixed(6);
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    // Allow navigation if no raw materials are added (optional step)
    if (!formData.rawMaterials || formData.rawMaterials.length === 0) {
      setErrors(newErrors);
      return true;
    }
    
    formData.rawMaterials.forEach((material, materialIndex) => {
      if (!material.materialDescription?.trim()) {
        newErrors[`rawMaterial_${materialIndex}_materialDescription`] = 'Material Description is required';
      }
      if (!material.netConsumption?.trim()) {
        newErrors[`rawMaterial_${materialIndex}_netConsumption`] = 'Net Consumption per Pc is required';
      }
      if (!material.unit?.trim()) {
        newErrors[`rawMaterial_${materialIndex}_unit`] = 'Unit is required';
      }
      
      // Validate work orders
      if (material.workOrders && material.workOrders.length > 0) {
      material.workOrders.forEach((workOrder, woIndex) => {
        // Only validate if workOrder type is selected
        if (!workOrder.workOrder?.trim()) {
          // Skip validation for empty work orders
          return;
        }
        if (!workOrder.wastage?.trim()) {
          newErrors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_wastage`] = 'Wastage is required';
        }
        // FOR field is not required for CUTTING
        if (workOrder.workOrder !== 'CUTTING' && !workOrder.forField?.trim()) {
          newErrors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_forField`] = 'FOR is required';
        }
        
        // Validate conditional fields for DYEING
        if (workOrder.workOrder === 'DYEING') {
          // Check if at least one of shrinkage width or length is selected
          if (!workOrder.shrinkageWidth && !workOrder.shrinkageLength) {
            newErrors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_shrinkage`] = 'At least one of WIDTH or LENGTH must be selected for SHRINKAGE';
          }
          // If shrinkageWidth is selected, validate its fields
          if (workOrder.shrinkageWidth) {
            if (!workOrder.shrinkageWidthPercent?.trim()) {
              newErrors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_shrinkageWidthPercent`] = 'Shrinkage Width Percentage is required';
            }
            if (!workOrder.ratioWidth?.trim()) {
              newErrors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_ratioWidth`] = 'Ratio Width is required when WIDTH is selected';
            }
          }
          // If shrinkageLength is selected, validate its fields
          if (workOrder.shrinkageLength) {
            if (!workOrder.shrinkageLengthPercent?.trim()) {
              newErrors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_shrinkageLengthPercent`] = 'Shrinkage Length Percentage is required';
            }
            if (!workOrder.ratioLength?.trim()) {
              newErrors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_ratioLength`] = 'Ratio Length is required when LENGTH is selected';
            }
          }
        }
        
        // Validate conditional fields for WEAVING
        if (workOrder.workOrder === 'WEAVING') {
            if (!workOrder.machineType?.trim()) {
              newErrors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_machineType`] = 'Machine Type is required';
            }
            // Check if at least one of warp or weft is selected
            if (!workOrder.warp && !workOrder.weft) {
              newErrors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_warpWeft`] = 'At least one of WARP or WEFT must be selected';
            }
            // If warp is selected, ratioWarp is required
            if (workOrder.warp && !workOrder.ratioWarp?.trim()) {
              newErrors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_ratioWarp`] = 'Ratio Warp is required when WARP is selected';
            }
            // If weft is selected, ratioWeft is required
            if (workOrder.weft && !workOrder.ratioWeft?.trim()) {
              newErrors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_ratioWeft`] = 'Ratio Weft is required when WEFT is selected';
            }
        }
        
        // Validate conditional fields for KNITTING
        if (workOrder.workOrder === 'KNITTING') {
          // Check if at least one of wales or courses is selected
          if (!workOrder.wales && !workOrder.courses) {
            newErrors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_walesCourses`] = 'At least one of WALES or COURSES must be selected';
          }
          // If wales is selected, ratioWales is required
          if (workOrder.wales && !workOrder.ratioWales?.trim()) {
            newErrors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_ratioWales`] = 'Ratio Wales is required when WALES is selected';
          }
          // If courses is selected, ratioCourses is required
          if (workOrder.courses && !workOrder.ratioCourses?.trim()) {
            newErrors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_ratioCourses`] = 'Ratio Courses is required when COURSES is selected';
          }
        }
      });
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 0) {
      if (!validateStep0()) {
        return;
      }
    } else if (currentStep === 1) {
      if (!validateStep1()) {
        return;
      }
      // Initialize raw materials when moving from Step 1 to Step 2
      const rawMaterials = initializeRawMaterials();
      setFormData(prev => ({ ...prev, rawMaterials }));
    } else if (currentStep === 2) {
      if (!validateStep2()) {
        return;
      }
      // Initialize consumption materials when moving from Step 2 to Step 3
      if (!formData.consumptionMaterials || formData.consumptionMaterials.length === 0) {
        const consumptionMaterials = initializeConsumptionMaterials();
        setFormData(prev => ({ ...prev, consumptionMaterials }));
      }
    } else if (currentStep === 3) {
      if (!validateStep3()) {
        return;
      }
    } else if (currentStep === 4) {
      if (!validateStep4()) {
        return;
      }
    } else if (currentStep === 5) {
      if (!validateStep5()) {
        return;
      }
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getProgressPercentage = () => {
    return ((currentStep + 1) / (totalSteps + 1)) * 100;
  };

  const renderStep0 = () => (
    <div className="w-full">
      {/* Header Section */}
      <div style={{ marginBottom: '32px' }}>
        <h2 className="text-2xl font-bold text-gray-900" style={{ marginBottom: '8px' }}>PART-0 PRODUCT SPEC</h2>
        <p className="text-base text-gray-500">Enter product specification details</p>
      </div>
      
      {/* Form Container */}
      <div className="bg-gray-50 rounded-xl" style={{ padding: '32px', border: '1px solid #e5e7eb' }}>
        {/* Row 1: SKU, Product, PO QTY */}
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '24px', marginBottom: '24px' }}>
          {/* SKU / ITEM NO */}
          <div className="flex flex-col">
            <label htmlFor="sku" className="text-sm font-semibold text-gray-700 mb-2">
              SKU / ITEM NO. <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="sku"
              name="sku"
              value={formData.sku}
              onChange={handleInputChange}
              className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                errors.sku 
                  ? 'border-red-600' 
                  : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
              }`}
              style={{ padding: '12px 16px', height: '48px' }}
              onFocus={(e) => {
                if (!errors.sku) {
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = '';
              }}
              placeholder="e.g., SKU-001"
              required
            />
            {errors.sku && (
              <span className="text-red-600 text-xs font-medium mt-1">{errors.sku}</span>
            )}
          </div>

          {/* PRODUCT */}
          <div className="flex flex-col">
            <label htmlFor="product" className="text-sm font-semibold text-gray-700 mb-2">
              PRODUCT <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="product"
              name="product"
              value={formData.product}
              onChange={handleInputChange}
              className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                errors.product 
                  ? 'border-red-600' 
                  : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
              }`}
              style={{ padding: '12px 16px', height: '48px' }}
              onFocus={(e) => {
                if (!errors.product) {
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = '';
              }}
              placeholder="e.g., Cushion"
              required
            />
            {errors.product && (
              <span className="text-red-600 text-xs font-medium mt-1">{errors.product}</span>
            )}
          </div>

          {/* PO QTY */}
          <div className="flex flex-col">
            <label htmlFor="poQty" className="text-sm font-semibold text-gray-700 mb-2">
              PO QTY <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              id="poQty"
              name="poQty"
              value={formData.poQty}
              onChange={handleInputChange}
              className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                errors.poQty 
                  ? 'border-red-600' 
                  : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
              }`}
              style={{ padding: '12px 16px', height: '48px' }}
              onFocus={(e) => {
                if (!errors.poQty) {
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = '';
              }}
              placeholder="e.g., 1000"
              required
            />
            {errors.poQty && (
              <span className="text-red-600 text-xs font-medium mt-1">{errors.poQty}</span>
            )}
          </div>
        </div>

        {/* Row 2: Overage %, Overage Qty, Delivery Date */}
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '24px', marginBottom: '24px' }}>
          {/* OVERAGE (%AGE) */}
          <div className="flex flex-col">
            <label htmlFor="overagePercentage" className="text-sm font-semibold text-gray-700 mb-2">
              OVERAGE (%) <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="overagePercentage"
              name="overagePercentage"
              value={formData.overagePercentage}
              onChange={handleInputChange}
              className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                errors.overagePercentage 
                  ? 'border-red-600' 
                  : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
              }`}
              style={{ padding: '12px 16px', height: '48px' }}
              onFocus={(e) => {
                if (!errors.overagePercentage) {
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = '';
              }}
              placeholder="e.g., 5%"
              required
            />
            {errors.overagePercentage && (
              <span className="text-red-600 text-xs font-medium mt-1">{errors.overagePercentage}</span>
            )}
          </div>

          {/* OVERAGE (QTY) */}
          <div className="flex flex-col">
            <label htmlFor="overageQty" className="text-sm font-semibold text-gray-700 mb-2">
              OVERAGE (QTY) <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              id="overageQty"
              name="overageQty"
              value={formData.overageQty}
              onChange={handleInputChange}
              className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                errors.overageQty 
                  ? 'border-red-600' 
                  : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
              }`}
              style={{ padding: '12px 16px', height: '48px' }}
              onFocus={(e) => {
                if (!errors.overageQty) {
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = '';
              }}
              placeholder="e.g., 50"
              required
            />
            {errors.overageQty && (
              <span className="text-red-600 text-xs font-medium mt-1">{errors.overageQty}</span>
            )}
          </div>

          {/* DELIVERY DUE DATE */}
          <div className="flex flex-col">
            <label htmlFor="deliveryDueDate" className="text-sm font-semibold text-gray-700 mb-2">
              DELIVERY DUE DATE <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              id="deliveryDueDate"
              name="deliveryDueDate"
              value={formData.deliveryDueDate}
              onChange={handleInputChange}
              className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                errors.deliveryDueDate 
                  ? 'border-red-600' 
                  : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
              }`}
              style={{ padding: '12px 16px', height: '48px' }}
              onFocus={(e) => {
                if (!errors.deliveryDueDate) {
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = '';
              }}
              required
            />
            {errors.deliveryDueDate && (
              <span className="text-red-600 text-xs font-medium mt-1">{errors.deliveryDueDate}</span>
            )}
          </div>
        </div>

        {/* Row 3: Image Upload */}
        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '24px' }}>
          <label htmlFor="image" className="text-sm font-semibold text-gray-700 mb-2 block">
            PRODUCT IMAGE <span className="text-red-600">*</span>
          </label>
          <div className="flex items-start" style={{ gap: '24px' }}>
            <div className="flex flex-col" style={{ flex: '0 0 auto' }}>
              <div 
                className={`border-2 border-dashed rounded-lg bg-white flex items-center justify-center cursor-pointer hover:border-indigo-400 transition-all ${
                  errors.image ? 'border-red-600' : 'border-gray-300'
                }`}
                style={{ width: '160px', height: '120px', position: 'relative' }}
                onClick={() => document.getElementById('image').click()}
              >
                {formData.imagePreview ? (
                  <img 
                    src={formData.imagePreview} 
                    alt="Preview" 
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <div className="text-center">
                    <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xs text-gray-500 mt-1">Click to upload</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleInputChange}
                className="hidden"
                required
              />
              {errors.image && (
                <span className="text-red-600 text-xs font-medium mt-1">{errors.image}</span>
              )}
            </div>
            <div className="text-sm text-gray-500" style={{ paddingTop: '8px' }}>
              <p className="font-medium text-gray-700 mb-1">Upload product image</p>
              <p>Supported formats: JPG, PNG, GIF</p>
              <p>Maximum file size: 5MB</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="w-full">
      {/* Header with proper spacing */}
      <div style={{ marginBottom: '28px' }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">PART-1 CUT & SEW SPEC</h2>
            <p className="text-sm text-gray-600">Enter cutting and sewing specifications for each product and their components</p>
          </div>
          <button
            type="button"
            onClick={addProduct}
            className="border rounded-md cursor-pointer text-sm font-medium transition-all hover:-translate-x-0.5"
            style={{
              backgroundColor: '#f3f4f6',
              borderColor: '#d1d5db',
              color: '#374151',
              padding: '10px 16px',
              height: '42px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e5e7eb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
          >
            + Add Product
          </button>
        </div>
      </div>
      
      {/* Products Section */}
      <div>
        {formData.products.map((product, productIndex) => (
          <div key={productIndex} className="bg-gray-50 rounded-xl border border-gray-200" style={{ padding: '24px', marginBottom: '24px' }}>
            {/* Product Header */}
            <div className="flex items-end gap-4 mb-6">
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  PRODUCT <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={product.name}
                  onChange={(e) => handleProductNameChange(productIndex, e.target.value)}
                  className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                    errors[`product_${productIndex}_name`] 
                      ? 'border-red-600' 
                      : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                  }`}
                  style={{ padding: '10px 14px', width: '220px', height: '44px' }}
                  onFocus={(e) => {
                    if (!errors[`product_${productIndex}_name`]) {
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = '';
                  }}
                  placeholder="e.g., Cushion"
                  required
                />
                {errors[`product_${productIndex}_name`] && (
                  <span className="text-red-600 text-xs mt-1 font-medium block">
                    {errors[`product_${productIndex}_name`]}
                  </span>
                )}
              </div>
              {formData.products.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeProduct(productIndex)}
                  className="border rounded-md cursor-pointer text-sm font-medium transition-all hover:-translate-x-0.5"
                  style={{
                    backgroundColor: '#f3f4f6',
                    borderColor: '#d1d5db',
                    color: '#374151',
                    padding: '8px 14px',
                    height: '42px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e5e7eb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }}
                >
                  Remove
                </button>
              )}
            </div>

            {/* Components Section for this Product */}
            <div style={{ marginTop: '16px' }}>
              <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
                <h3 className="text-sm font-bold text-gray-800">COMPONENTS</h3>
                <button
                  type="button"
                  onClick={() => addComponent(productIndex)}
                  className="border rounded-md cursor-pointer text-xs font-medium transition-all hover:-translate-x-0.5"
                  style={{
                    backgroundColor: '#f3f4f6',
                    borderColor: '#d1d5db',
                    color: '#374151',
                    padding: '6px 12px',
                    height: '32px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e5e7eb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }}
                >
                  + Add
                </button>
              </div>

              {product.components.map((component, componentIndex) => (
                <div key={componentIndex} className="bg-white rounded-lg border border-gray-200" style={{ padding: '20px', marginBottom: '16px' }}>
                  <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
                    <h4 className="text-sm font-semibold text-gray-700">COMPONENT {component.srNo}</h4>
                    {product.components.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeComponent(productIndex, componentIndex)}
                        className="border rounded-md cursor-pointer text-xs font-medium transition-all hover:-translate-x-0.5"
                        style={{
                          backgroundColor: '#f3f4f6',
                          borderColor: '#d1d5db',
                          color: '#374151',
                          padding: '4px 10px',
                          height: '28px'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#e5e7eb';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#f3f4f6';
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {/* Component Details - All in one row */}
                  <div className="flex flex-wrap items-start gap-4" style={{ marginBottom: '28px' }}>
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-2">
                        NAME <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={component.productComforter}
                        onChange={(e) => handleComponentChange(productIndex, componentIndex, 'productComforter', e.target.value)}
                        className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                          errors[`product_${productIndex}_component_${componentIndex}_productComforter`] 
                            ? 'border-red-600' 
                            : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                        }`}
                        style={{ padding: '10px 14px', width: '180px', height: '44px' }}
                        onFocus={(e) => {
                          if (!errors[`product_${productIndex}_component_${componentIndex}_productComforter`]) {
                            e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                          }
                        }}
                        onBlur={(e) => {
                          e.target.style.boxShadow = '';
                        }}
                        placeholder="e.g., Top Panel"
                        required
                      />
                      {errors[`product_${productIndex}_component_${componentIndex}_productComforter`] && (
                        <span className="text-red-600 text-xs mt-1 font-medium">
                          {errors[`product_${productIndex}_component_${componentIndex}_productComforter`]}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-2">
                        UNIT <span className="text-red-600">*</span>
                      </label>
                      <select
                        value={component.unit}
                        onChange={(e) => handleComponentChange(productIndex, componentIndex, 'unit', e.target.value)}
                        className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                          errors[`product_${productIndex}_component_${componentIndex}_unit`] 
                            ? 'border-red-600' 
                            : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                        }`}
                        style={{ padding: '10px 14px', width: '140px', height: '44px' }}
                        onFocus={(e) => {
                          if (!errors[`product_${productIndex}_component_${componentIndex}_unit`]) {
                            e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                          }
                        }}
                        onBlur={(e) => {
                          e.target.style.boxShadow = '';
                        }}
                        required
                      >
                        <option value="">Select</option>
                        <option value="R METERS">R METERS</option>
                        <option value="CM">CM</option>
                        <option value="Inches">Inches</option>
                        <option value="Meter">Meter</option>
                        <option value="KGS">KGS</option>
                      </select>
                      {errors[`product_${productIndex}_component_${componentIndex}_unit`] && (
                        <span className="text-red-600 text-xs mt-1 font-medium">
                          {errors[`product_${productIndex}_component_${componentIndex}_unit`]}
                        </span>
                      )}
                    </div>

                    {/* WASTAGE field (always shown) */}
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-2">
                        WASTAGE % <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="number"
                        value={component.wastage}
                        onChange={(e) => handleComponentChange(productIndex, componentIndex, 'wastage', e.target.value)}
                        className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                          errors[`product_${productIndex}_component_${componentIndex}_wastage`] 
                            ? 'border-red-600' 
                            : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                        }`}
                        style={{ padding: '10px 14px', width: '120px', height: '44px' }}
                        onFocus={(e) => {
                          if (!errors[`product_${productIndex}_component_${componentIndex}_wastage`]) {
                            e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                          }
                        }}
                        onBlur={(e) => {
                          e.target.style.boxShadow = '';
                        }}
                        placeholder="e.g., 5"
                        required
                      />
                      {errors[`product_${productIndex}_component_${componentIndex}_wastage`] && (
                        <span className="text-red-600 text-xs mt-1 font-medium">
                          {errors[`product_${productIndex}_component_${componentIndex}_wastage`]}
                        </span>
                      )}
                    </div>

                    {/* GSM field (shown only when UNIT is R METERS) */}
                    {component.unit === 'R METERS' && (
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">
                          GSM <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="number"
                          value={component.gsm}
                          onChange={(e) => handleComponentChange(productIndex, componentIndex, 'gsm', e.target.value)}
                          className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                            errors[`product_${productIndex}_component_${componentIndex}_gsm`] 
                              ? 'border-red-600' 
                              : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                          }`}
                          style={{ padding: '10px 14px', width: '120px', height: '44px' }}
                          onFocus={(e) => {
                            if (!errors[`product_${productIndex}_component_${componentIndex}_gsm`]) {
                              e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                            }
                          }}
                          onBlur={(e) => {
                            e.target.style.boxShadow = '';
                          }}
                          placeholder="e.g., 200"
                          required
                        />
                        {errors[`product_${productIndex}_component_${componentIndex}_gsm`] && (
                          <span className="text-red-600 text-xs mt-1 font-medium">
                            {errors[`product_${productIndex}_component_${componentIndex}_gsm`]}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Cutting Size for this component */}
                  <div style={{ marginBottom: '28px' }}>
                    <h4 className="text-sm font-semibold text-gray-800" style={{ marginBottom: '16px' }}>
                      CUTTING SIZE
                    </h4>
                    <div className="flex flex-wrap items-start gap-4">
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">
                          LENGTH <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="number"
                          value={component.cuttingSize.length}
                          onChange={(e) => handleComponentCuttingSizeChange(productIndex, componentIndex, 'length', e.target.value)}
                          className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                            errors[`product_${productIndex}_component_${componentIndex}_cuttingLength`] 
                              ? 'border-red-600' 
                              : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                          }`}
                          style={{ padding: '10px 14px', width: '140px', height: '44px' }}
                          onFocus={(e) => {
                            if (!errors[`product_${productIndex}_component_${componentIndex}_cuttingLength`]) {
                              e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                            }
                          }}
                          onBlur={(e) => {
                            e.target.style.boxShadow = '';
                          }}
                          placeholder="e.g., 24"
                          required
                        />
                        {errors[`product_${productIndex}_component_${componentIndex}_cuttingLength`] && (
                          <span className="text-red-600 text-xs mt-1 font-medium">
                            {errors[`product_${productIndex}_component_${componentIndex}_cuttingLength`]}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">
                          WIDTH <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="number"
                          value={component.cuttingSize.width}
                          onChange={(e) => handleComponentCuttingSizeChange(productIndex, componentIndex, 'width', e.target.value)}
                          className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                            errors[`product_${productIndex}_component_${componentIndex}_cuttingWidth`] 
                              ? 'border-red-600' 
                              : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                          }`}
                          style={{ padding: '10px 14px', width: '140px', height: '44px' }}
                          onFocus={(e) => {
                            if (!errors[`product_${productIndex}_component_${componentIndex}_cuttingWidth`]) {
                              e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                            }
                          }}
                          onBlur={(e) => {
                            e.target.style.boxShadow = '';
                          }}
                          placeholder="e.g., 18"
                          required
                        />
                        {errors[`product_${productIndex}_component_${componentIndex}_cuttingWidth`] && (
                          <span className="text-red-600 text-xs mt-1 font-medium">
                            {errors[`product_${productIndex}_component_${componentIndex}_cuttingWidth`]}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Sew Size for this component */}
                  <div style={{ marginTop: '8px' }}>
                    <h4 className="text-sm font-semibold text-gray-800" style={{ marginBottom: '16px' }}>
                      SEW SIZE
                    </h4>
                    <div className="flex flex-wrap items-start gap-4">
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">
                          LENGTH <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="number"
                          value={component.sewSize.length}
                          onChange={(e) => handleComponentSewSizeChange(productIndex, componentIndex, 'length', e.target.value)}
                          className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                            errors[`product_${productIndex}_component_${componentIndex}_sewLength`] 
                              ? 'border-red-600' 
                              : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                          }`}
                          style={{ padding: '10px 14px', width: '140px', height: '44px' }}
                          onFocus={(e) => {
                            if (!errors[`product_${productIndex}_component_${componentIndex}_sewLength`]) {
                              e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                            }
                          }}
                          onBlur={(e) => {
                            e.target.style.boxShadow = '';
                          }}
                          placeholder="e.g., 22"
                          required
                        />
                        {errors[`product_${productIndex}_component_${componentIndex}_sewLength`] && (
                          <span className="text-red-600 text-xs mt-1 font-medium">
                            {errors[`product_${productIndex}_component_${componentIndex}_sewLength`]}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">
                          WIDTH <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="number"
                          value={component.sewSize.width}
                          onChange={(e) => handleComponentSewSizeChange(productIndex, componentIndex, 'width', e.target.value)}
                          className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                            errors[`product_${productIndex}_component_${componentIndex}_sewWidth`] 
                              ? 'border-red-600' 
                              : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                          }`}
                          style={{ padding: '10px 14px', width: '140px', height: '44px' }}
                          onFocus={(e) => {
                            if (!errors[`product_${productIndex}_component_${componentIndex}_sewWidth`]) {
                              e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                            }
                          }}
                          onBlur={(e) => {
                            e.target.style.boxShadow = '';
                          }}
                          placeholder="e.g., 16"
                          required
                        />
                        {errors[`product_${productIndex}_component_${componentIndex}_sewWidth`] && (
                          <span className="text-red-600 text-xs mt-1 font-medium">
                            {errors[`product_${productIndex}_component_${componentIndex}_sewWidth`]}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="w-full">
      {/* Header with proper spacing */}
      <div style={{ marginBottom: '28px' }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">PART-3 TRIMS & ACCESSORIES</h2>
            <p className="text-sm text-gray-600">Trims & accessories specification</p>
          </div>
          <button
            type="button"
            onClick={addConsumptionMaterial}
            className="border rounded-md cursor-pointer text-sm font-medium transition-all hover:-translate-x-0.5"
            style={{
              backgroundColor: '#f3f4f6',
              borderColor: '#d1d5db',
              color: '#374151',
              padding: '10px 16px',
              height: '42px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e5e7eb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
          >
            + Add Material
          </button>
        </div>
      </div>
      
      {/* Trim Materials */}
      <div>
        {formData.consumptionMaterials.map((material, materialIndex) => (
          <div key={materialIndex} className="bg-gray-50 rounded-xl border border-gray-200" style={{ padding: '24px', marginBottom: '24px' }}>
            {/* Material Header with Remove Button */}
            <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
              <h4 className="text-sm font-bold text-gray-700">MATERIAL {materialIndex + 1}</h4>
              {formData.consumptionMaterials.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeConsumptionMaterial(materialIndex)}
                  className="border rounded-md cursor-pointer text-xs font-medium transition-all hover:-translate-x-0.5"
                  style={{
                    backgroundColor: '#f3f4f6',
                    borderColor: '#d1d5db',
                    color: '#374151',
                    padding: '4px 10px',
                    height: '28px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e5e7eb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }}
                >
                  Remove
                </button>
              )}
            </div>

            {/* Row 1: COMPONENTS, Material Description, Net Consumption per Pc, UNIT */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-5" style={{ marginBottom: '24px' }}>
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">COMPONENTS</label>
                <input
                  type="text"
                  value={material.components || ''}
                  onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'components', e.target.value)}
                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                  style={{ padding: '10px 14px', height: '44px' }}
                  placeholder="e.g., COMFORTER +"
                />
              </div>
              
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL DESC</label>
                <input
                  type="text"
                  value={material.materialDescription || ''}
                  onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'materialDescription', e.target.value)}
                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                  style={{ padding: '10px 14px', height: '44px' }}
                  placeholder="e.g., Stitching Thread"
                />
              </div>
              
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">NET CNS/PC</label>
                <input
                  type="number"
                  step="0.001"
                  value={material.netConsumption || ''}
                  onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'netConsumption', e.target.value)}
                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                  style={{ padding: '10px 14px', height: '44px' }}
                  placeholder="0.000"
                />
              </div>
              
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">UNIT</label>
                <select
                  value={material.unit || ''}
                  onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'unit', e.target.value)}
                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                  style={{ padding: '10px 14px', height: '44px' }}
                >
                  <option value="">Select</option>
                  <option value="Kgs">Kgs</option>
                  <option value="Pcs">Pcs</option>
                  <option value="Meters">Meters</option>
                  <option value="Yards">Yards</option>
                  <option value="Sets">Sets</option>
                  <option value="Rolls">Rolls</option>
                  <option value="Gross">Gross</option>
                </select>
              </div>
            </div>

            {/* Row 2: WORK ORDER, PLACEMENT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5" style={{ marginTop: '20px', marginBottom: '20px' }}>
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">WORK ORDER</label>
                <input
                  type="text"
                  value={material.workOrder || ''}
                  onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'workOrder', e.target.value)}
                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                  style={{ padding: '10px 14px', height: '44px' }}
                  placeholder="e.g., SEWING"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">PLACEMENT</label>
                <input
                  type="text"
                  value={material.placement || ''}
                  onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'placement', e.target.value)}
                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                  style={{ padding: '10px 14px', height: '44px' }}
                  placeholder="e.g., ON BAG STRAP"
                />
              </div>
            </div>

            {/* SIZE Row */}
            <div className="flex flex-wrap items-start gap-4" style={{ marginTop: '20px', marginBottom: '24px' }}>
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">WIDTH</label>
                  <input
                    type="number"
                  value={material.size?.width || ''}
                  onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'size.width', e.target.value)}
                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                    style={{ padding: '10px 14px', width: '100px', height: '44px' }}
                  placeholder="52"
                />
                </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH</label>
                <input
                  type="number"
                  value={material.size?.length || ''}
                  onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'size.length', e.target.value)}
                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                  style={{ padding: '10px 14px', width: '100px', height: '44px' }}
                  placeholder="48"
                />
            </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">HEIGHT</label>
                <input
                  type="number"
                  value={material.size?.height || ''}
                  onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'size.height', e.target.value)}
                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                  style={{ padding: '10px 14px', width: '100px', height: '44px' }}
                  placeholder="52"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">UNIT</label>
                <select
                  value={material.size?.unit || ''}
                  onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'size.unit', e.target.value)}
                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                  style={{ padding: '10px 14px', width: '120px', height: '44px' }}
                >
                  <option value="">Select</option>
                  <option value="CMS">CMS</option>
                  <option value="INCHES">INCHES</option>
                  <option value="MM">MM</option>
                </select>
              </div>
              </div>
              
            {/* TRIM/ACCESSORY CATEGORY SELECTOR */}
            <div className="w-full mt-8 pt-6 border-t border-gray-100">
              <div className="flex flex-col" style={{ width: '280px', marginBottom: '20px' }}>
                <label className="text-sm font-bold text-gray-800 mb-2">TRIM/ACCESSORY</label>
                <select
                  value={material.trimAccessory || ''}
                  onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'trimAccessory', e.target.value)}
                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                  style={{ padding: '10px 14px', height: '44px' }}
                  onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                  onBlur={(e) => e.target.style.boxShadow = ''}
                >
                  <option value="">Select Trim/Accessory</option>
                  <option value="ZIPPERS">ZIPPERS</option>
                  <option value="VELCRO (Hook & Loop)">VELCRO (Hook & Loop)</option>
                  <option value="STITCHING THREAD">STITCHING THREAD</option>
                  <option value="BUTTONS">BUTTONS</option>
                  <option value="RIVETS">RIVETS</option>
                  <option value="NIWAR (Webbing/Tapes)">NIWAR (Webbing/Tapes)</option>
                  <option value="LACE">LACE</option>
                  <option value="INTERLINING/FUSING">INTERLINING/FUSING</option>
                  <option value="HOOKS & EYES">HOOKS & EYES</option>
                  <option value="BUCKLES & ADJUSTERS">BUCKLES & ADJUSTERS</option>
                  <option value="EYELETS & GROMMETS">EYELETS & GROMMETS</option>
                  <option value="ELASTIC">ELASTIC</option>
                  <option value="FELT">FELT</option>
                  <option value="SHOULDER PADS / CUPS">SHOULDER PADS / CUPS</option>
                  <option value="TUBULAR KNITS / RIBBING">TUBULAR KNITS / RIBBING</option>
                  <option value="RFID / EAS TAGS">RFID / EAS TAGS</option>
                  <option value="PLASTIC CABLE TIES / LOOPS">PLASTIC CABLE TIES / LOOPS</option>
                  <option value="FRINGE / TASSELS">FRINGE / TASSELS</option>
                  <option value="PLASTIC PIPES / RODS">PLASTIC PIPES / RODS</option>
                  <option value="SEAM SEALING TAPE">SEAM SEALING TAPE</option>
                  <option value="ADHESIVES / GUNNING">ADHESIVES / GUNNING</option>
                  <option value="PRE-CUT HEMS / BINDINGS">PRE-CUT HEMS / BINDINGS</option>
                  <option value="REFLECTIVE TAPES / TRIMS">REFLECTIVE TAPES / TRIMS</option>
                  <option value="FIRE RETARDANT (FR) TRIMS">FIRE RETARDANT (FR) TRIMS</option>
                  <option value="REPAIR KITS / PATCHES">REPAIR KITS / PATCHES</option>
                  <option value="CORD STOPS / CORD LOCKS / TOGGLES">CORD STOPS / CORD LOCKS / TOGGLES</option>
                  <option value="D-RINGS / O-RINGS / WEBBING LOOPS">D-RINGS / O-RINGS / WEBBING LOOPS</option>
                  <option value="FOAM / WADDING (Pre-Cut Shapes)">FOAM / WADDING (Pre-Cut Shapes)</option>
                  <option value="PINS / TAGGING BARBS">PINS / TAGGING BARBS</option>
                  <option value="MAGNETIC CLOSURES / SNAPS">MAGNETIC CLOSURES / SNAPS</option>
                </select>
              </div>

              {/* Conditional fields based on trim/accessory type */}
              {material.trimAccessory && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-5">
                  {/* ZIPPERS Fields */}
                  {material.trimAccessory === 'ZIPPERS' && (
                    <>
              <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">ZIP #</label>
                <input
                  type="text"
                          value={material.zipNumber || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'zipNumber', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="3 or 5 (Common sizes)"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <select
                          value={material.zipType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'zipType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        >
                          <option value="">Select</option>
                          <option value="Concealed (Invisible)">Concealed (Invisible)</option>
                          <option value="Open (Separating)">Open (Separating)</option>
                          <option value="Closed-End (Non-Separating)">Closed-End (Non-Separating)</option>
                        </select>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">BRAND</label>
                        <input
                          type="text"
                          value={material.brand || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'brand', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="YKK, RIRI, SBS, or Unbranded - Specify supplier name"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TEETH</label>
                        <select
                          value={material.teeth || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'teeth', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        >
                          <option value="">Select</option>
                          <option value="Coil (Nylon/Polyester)">Coil (Nylon/Polyester)</option>
                          <option value="Plastic (Molded Vislon)">Plastic (Molded Vislon)</option>
                          <option value="Metal (Brass, Aluminium)">Metal (Brass, Aluminium)</option>
                        </select>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">PULLER</label>
                        <input
                          type="text"
                          value={material.puller || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'puller', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Metal / DTM (Dyed-to-Match Plastic) / Custom Logo / Ring"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">PULLER TYPE</label>
                        <select
                          value={material.pullerType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'pullerType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        >
                          <option value="">Select</option>
                          <option value="Lockable (Auto-lock for secure closure)">Lockable (Auto-lock for secure closure)</option>
                          <option value="Non-Lockable (Free-gliding)">Non-Lockable (Free-gliding)</option>
                          <option value="Semi-">Semi-</option>
                        </select>
                      </div>
                    </>
                  )}

                  {/* VELCRO Fields */}
                  {material.trimAccessory === 'VELCRO (Hook & Loop)' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <select
                          value={material.velcroType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'velcroType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        >
                          <option value="">Select</option>
                          <option value="Sew-on tape">Sew-on tape</option>
                          <option value="Adhesive Backed">Adhesive Backed</option>
                          <option value="Die-Cut Shapes">Die-Cut Shapes</option>
                          <option value="ONE-WRAP (Back-to-Back)">ONE-WRAP (Back-to-Back)</option>
                        </select>
              </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <select
                          value={material.velcroMaterial || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'velcroMaterial', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        >
                          <option value="">Select</option>
                          <option value="Nylon">Nylon</option>
                          <option value="Polyester">Polyester</option>
                        </select>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">WIDTH</label>
                        <input
                          type="text"
                          value={material.width || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'width', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="16mm, 20mm, 25mm, 50mm"
                        />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">UNIT</label>
                          <input
                            type="text"
                            value={material.unitAdditional || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'unitAdditional', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px', width: '100px' }}
                            placeholder="mm/in"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                        <input
                          type="text"
                          value={material.colour || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'colour', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="DTM, White, Black"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">HOOK DENSITY</label>
                        <input
                          type="text"
                          value={material.hookDensityLoopType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'hookDensityLoopType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="HOOK Density / Loop Type"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">CYCLE LIFE</label>
                        <input
                          type="text"
                          value={material.cycleLife || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'cycleLife', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Number of Open/Close Cycles"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">ATTACHMENT METHOD</label>
                        <input
                          type="text"
                          value={material.attachmentMethod || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'attachmentMethod', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Sewing / Adhesive"
                        />
                      </div>
                    </>
                  )}

                  {/* STITCHING THREAD Fields */}
                  {material.trimAccessory === 'STITCHING THREAD' && (
                    <>
              <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <select
                          value={material.threadType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'threadType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        >
                          <option value="">Select</option>
                          <option value="Spun Polyester (Poly)">Spun Polyester (Poly)</option>
                          <option value="Cotton">Cotton</option>
                          <option value="Core Spun (Poly-Wrapped)">Core Spun (Poly-Wrapped)</option>
                        </select>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FIBRE CONTENT</label>
                <input
                  type="text"
                          value={material.fibreContent || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'fibreContent', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 100% Spun"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COUNT/TICKET NO.</label>
                        <input
                          type="text"
                          value={material.countTicketNo || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'countTicketNo', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Metric Count (Nm) or Ticket"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">PLY</label>
                        <input
                          type="text"
                          value={material.ply || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'ply', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 2 Ply, 3 Ply"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                        <input
                          type="text"
                          value={material.colour || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'colour', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Colour Code (Pantone)"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FINISH</label>
                        <select
                          value={material.threadFinish || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'threadFinish', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        >
                          <option value="">Select</option>
                          <option value="Bonded">Bonded</option>
                          <option value="Lubricated">Lubricated</option>
                          <option value="Matte">Matte</option>
                        </select>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">USAGE</label>
                        <input
                          type="text"
                          value={material.usage || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'usage', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Main seam, Overlock, Embroidery"
                        />
                      </div>
                    </>
                  )}

                  {/* BUTTONS Fields */}
                  {material.trimAccessory === 'BUTTONS' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <select
                          value={material.buttonType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'buttonType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        >
                          <option value="">Select</option>
                          <option value="Sewing (Flat/Shank)">Sewing (Flat/Shank)</option>
                          <option value="Snap (Press Stud)">Snap (Press Stud)</option>
                          <option value="Tack">Tack</option>
                        </select>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <select
                          value={material.buttonMaterial || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'buttonMaterial', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        >
                          <option value="">Select</option>
                          <option value="Polyester (Plastic)">Polyester (Plastic)</option>
                          <option value="Metal (Brass, Alloy)">Metal (Brass, Alloy)</option>
                          <option value="Natural (Shell, Wood)">Natural (Shell, Wood)</option>
                        </select>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SIZE/LIGNE</label>
                        <input
                          type="text"
                          value={material.sizeLigne || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'sizeLigne', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="14L, 16L, 20L, 24L"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FINISH/COLOUR</label>
                        <input
                          type="text"
                          value={material.finishColour || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'finishColour', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="DTM, Contrast, Glossy, Matte"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">ATTACHMENT METHOD</label>
                        <input
                          type="text"
                          value={material.buttonAttachmentMethod || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'buttonAttachmentMethod', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Machine sew, Hand Sew, Pneumatic"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FUNCTION</label>
                        <input
                          type="text"
                          value={material.function || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'function', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Functional / Decorative"
                        />
                      </div>
                    </>
                  )}

                  {/* RIVETS Fields */}
                  {material.trimAccessory === 'RIVETS' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <select
                          value={material.rivetType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'rivetType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        >
                          <option value="">Select</option>
                          <option value="Open-End">Open-End</option>
                          <option value="Close-End">Close-End</option>
                          <option value="Blind Rivet">Blind Rivet</option>
                        </select>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <select
                          value={material.rivetMaterial || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'rivetMaterial', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        >
                          <option value="">Select</option>
                          <option value="Brass">Brass</option>
                          <option value="Copper">Copper</option>
                          <option value="Zinc Alloy">Zinc Alloy</option>
                          <option value="Steel">Steel</option>
                        </select>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">CAP SIZE</label>
                        <input
                          type="text"
                          value={material.capSize || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'capSize', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="8mm, 9mm, 10mm"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">POST HEIGHT/LENGTH</label>
                        <input
                          type="text"
                          value={material.postHeightLength || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'postHeightLength', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Short, Medium, Long"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FINISH/PLATING</label>
                        <input
                          type="text"
                          value={material.finishPlating || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'finishPlating', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Nickel, Copper, Antique Brass"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">PULLER</label>
                        <input
                          type="text"
                          value={material.pullerStrength || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'pullerStrength', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Pull Strength"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">PULLER TYPE</label>
                        <input
                          type="text"
                          value={material.rivetPullerType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'rivetPullerType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Machine Applied"
                        />
                      </div>
                    </>
                  )}

                  {/* NIWAR (Webbing/Tapes) Fields */}
                  {material.trimAccessory === 'NIWAR (Webbing/Tapes)' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <input
                          type="text"
                          value={material.niwarType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'niwarType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Woven (Twill, Plain, Herringbone), Knitted"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <input
                          type="text"
                          value={material.niwarMaterial || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'niwarMaterial', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Fibre Content (e.g., Cotton, Polyester, Polypropylene)"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">WIDTH / SIZE</label>
                        <input
                          type="text"
                          value={material.niwarWidth || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'niwarWidth', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Measurement (e.g., 20mm, 25mm, 38mm, 50mm) or Inches (e.g., 3/4 inch, 1 inch, 1.5 inch)"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">UNIT</label>
                          <input
                            type="text"
                            value={material.unitAdditional || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'unitAdditional', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px', width: '100px' }}
                            placeholder="mm/in"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">THICKNESS</label>
                        <input
                          type="text"
                          value={material.niwarThickness || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'niwarThickness', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Gage / Density (e.g., Thin, Medium, Heavy-duty) - Specified in millimeters"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                        <input
                          type="text"
                          value={material.niwarColour || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'niwarColour', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="DTM, White, Black, Colour Code"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FINISH / COATING</label>
                        <input
                          type="text"
                          value={material.finishCoating || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'finishCoating', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Soft Finish / Stiff Finish, Water Repellent, UV Resistant, Fire Retardant"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TENSILE STRENGTH</label>
                        <input
                          type="text"
                          value={material.tensileStrength || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'tensileStrength', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Breaking Strength (Force required to break the webbing, specified in...)"
                        />
                      </div>
                    </>
                  )}

                  {/* LACE Fields */}
                  {material.trimAccessory === 'LACE' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <input
                          type="text"
                          value={material.laceType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'laceType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Woven/Twill tape (Plain/Patterned) / Braided / Crochet / Knit"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <input
                          type="text"
                          value={material.laceMaterial || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'laceMaterial', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Fibre Content (e.g., 100% Cotton, Nylon, Rayon, Polyester)"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">WIDTH / SIZE</label>
                        <input
                          type="text"
                          value={material.laceWidth || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'laceWidth', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Measurement (e.g., 5mm, 10mm, 1 inch)"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">UNIT</label>
                          <input
                            type="text"
                            value={material.unitAdditional || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'unitAdditional', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px', width: '100px' }}
                            placeholder="mm/in"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                        <input
                          type="text"
                          value={material.laceColour || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'laceColour', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="DTM (Dyed to Match) / White / Ecru / Black / Colour Code (Pantone)"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FINISHING</label>
                        <input
                          type="text"
                          value={material.laceFinishing || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'laceFinishing', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Starch (stiff finish) / Soft Finish / Mercerized (for Cotton) / Scalloped"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">USAGE</label>
                        <input
                          type="text"
                          value={material.laceUsage || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'laceUsage', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Edging, Insertion, Applique, Beading"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">DESIGN REFERENCE</label>
                        <input
                          type="text"
                          value={material.designReference || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'designReference', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Supplier Pattern ID or Design Name (Essential for reordering the same)"
                        />
                      </div>
                    </>
                  )}

                  {/* ZIPPERS - Complete fields matching table exactly */}
                  {material.trimAccessory === 'ZIPPERS' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENT</label>
                        <input
                          type="text"
                          value={material.testingRequirement || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Slider Durability (Cycling test), Lateral Strength (Teeth-pulling strength), Puller"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                            className="hidden"
                            id={`upload-zippers-${materialIndex}`}
                          />
                          <label
                            htmlFor={`upload-zippers-${materialIndex}`}
                            className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}
                          >
                            {material.testingRequirementFile ? 'UPLOADED' : 'UPLOAD'}
                          </label>
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH</label>
                        <input
                          type="text"
                            value={material.length || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'length', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Specific Length (e.g., 20 cm, 7 inches, 500 mm)"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">UNIT</label>
                          <input
                            type="text"
                            value={material.unitAdditional || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'unitAdditional', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px', width: '100px' }}
                            placeholder="cm/in/mm"
                          />
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS</label>
                        <input
                          type="text"
                          value={material.surplus || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplus', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="%AGE (e.g., 2-3%)"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FOR-SECTION</label>
                          <input
                            type="text"
                            value={material.surplusForSection || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplusForSection', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                            placeholder="FOR"
                          />
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S/INITIAL/IPP"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.remarks || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'remarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="Required for industrial wash, Must match fabric composition, Specific"
                        />
                      </div>
                    </>
                  )}

                  {/* VELCRO - Complete fields matching table exactly */}
                  {material.trimAccessory === 'VELCRO (Hook & Loop)' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENT</label>
                <input
                  type="text"
                          value={material.testingRequirement || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Shear Strength, Peel Strength, Cycle"
                />
              </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                        <input
                            type="file"
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                            className="hidden"
                            id={`upload-velcro-${materialIndex}`}
                          />
                          <label
                            htmlFor={`upload-velcro-${materialIndex}`}
                            className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}
                          >
                            {material.testingRequirementFile ? 'UPLOADED' : 'UPLOAD'}
                          </label>
                      </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH/QUANTITY</label>
                        <input
                          type="text"
                          value={material.lengthQuantity || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'lengthQuantity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Unit: Meters or Yards per Roll"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS</label>
                        <input
                          type="text"
                          value={material.surplus || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplus', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="%AGE (e.g., 2-5%)"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FOR-SECTION</label>
                          <input
                            type="text"
                            value={material.surplusForSection || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplusForSection', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                            placeholder="FOR"
                          />
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S/INITIAL/IPP"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.remarks || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'remarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="Hook and Loop to be packed separately..."
                        />
                      </div>
                    </>
                  )}

                  {/* STITCHING THREAD - Complete fields matching table exactly */}
                  {material.trimAccessory === 'STITCHING THREAD' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENT</label>
                        <input
                          type="text"
                            value={material.testingRequirement || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Tensile Strength, Elongation, Abrasion"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                        <input
                          type="file"
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                          className="hidden"
                            id={`upload-thread-${materialIndex}`}
                        />
                        <label
                            htmlFor={`upload-thread-${materialIndex}`}
                          className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}
                        >
                            {material.testingRequirementFile ? 'UPLOADED' : 'UPLOAD'}
                        </label>
                      </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">UNIT</label>
                        <input
                          type="text"
                          value={material.unitAdditional || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'unitAdditional', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Unit: Yards or Meters per Cone"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH/QUANTITY</label>
                        <input
                          type="text"
                          value={material.lengthQuantity || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'lengthQuantity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 5000"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS</label>
                        <input
                          type="text"
                          value={material.surplus || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplus', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="%AGE (e.g., 1-2%)"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FOR-SECTION</label>
                          <input
                            type="text"
                            value={material.surplusForSection || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplusForSection', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                            placeholder="FOR"
                          />
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S/INITIAL/IPP"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.remarks || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'remarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="Required for Class 1 Safety Seams..."
                        />
                      </div>
                    </>
                  )}

                  {/* BUTTONS - Complete fields matching table exactly */}
                  {material.trimAccessory === 'BUTTONS' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENT</label>
                        <input
                          type="text"
                            value={material.testingRequirement || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Needle Detection, Pull Strength"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                        <input
                          type="file"
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                          className="hidden"
                            id={`upload-buttons-${materialIndex}`}
                        />
                        <label
                            htmlFor={`upload-buttons-${materialIndex}`}
                          className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}
                        >
                            {material.testingRequirementFile ? 'UPLOADED' : 'UPLOAD'}
                </label>
                      </div>
              </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH/QUANTITY</label>
                        <input
                          type="text"
                          value={material.lengthQuantity || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'lengthQuantity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Unit: Gross (144 pcs) or Pieces"
                        />
            </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS</label>
                        <input
                          type="text"
                          value={material.surplus || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplus', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="%AGE (e.g., 3-5%)"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FOR-SECTION</label>
                        <input
                          type="text"
                            value={material.surplusForSection || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplusForSection', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                            placeholder="FOR"
                        />
                      </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.remarks || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'remarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="Self-Shank, Laser Engraved..."
                        />
                      </div>
                    </>
                  )}

                  {/* RIVETS - Complete fields matching table exactly */}
                  {material.trimAccessory === 'RIVETS' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENT</label>
                        <input
                          type="text"
                          value={material.testingRequirement || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Needle Detection, Pull Strength"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH/QUANTITY</label>
                        <input
                          type="text"
                          value={material.lengthQuantity || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'lengthQuantity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Unit: Gross (144 pcs) or Pieces"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS</label>
                        <input
                          type="text"
                          value={material.surplus || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplus', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="%AGE (e.g., 3-5%)"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                            className="hidden"
                            id={`upload-rivets-${materialIndex}`}
                          />
                          <label
                            htmlFor={`upload-rivets-${materialIndex}`}
                            className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}
                          >
                            {material.testingRequirementFile ? 'UPLOADED' : 'UPLOAD'}
                          </label>
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S/INITIAL/IPP"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.remarks || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'remarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="Specific Logo Engraving on Cap..."
                        />
                      </div>
                    </>
                  )}

                  {/* NIWAR - Complete fields matching table exactly */}
                  {material.trimAccessory === 'NIWAR (Webbing/Tapes)' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENT</label>
                        <input
                          type="text"
                            value={material.testingRequirement || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Tensile strength test, Colour Fastness (to Light, Washing), Abrasion"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                        <input
                          type="file"
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                          className="hidden"
                            id={`upload-niwar-${materialIndex}`}
                        />
                        <label
                            htmlFor={`upload-niwar-${materialIndex}`}
                          className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}
                        >
                            {material.testingRequirementFile ? 'UPLOADED' : 'UPLOAD'}
                </label>
                      </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH / QUANTITY</label>
                        <input
                          type="text"
                          value={material.lengthQuantity || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'lengthQuantity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Unit: Meters or Yards per Roll (e.g., 100m Roll)"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS</label>
                        <input
                          type="text"
                          value={material.surplus || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplus', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="%AGE (e.g., 2-5% for cutting)"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FOR-SECTION</label>
                          <input
                            type="text"
                            value={material.surplusForSection || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplusForSection', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                            placeholder="FOR"
                          />
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S/INITIAL/IPP"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.remarks || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'remarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="Required weave pattern (e.g., seatbelt-style), For high-load application"
                        />
                      </div>
                    </>
                  )}

                  {/* LACE - Complete fields matching table exactly */}
                  {material.trimAccessory === 'LACE' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENT</label>
                        <input
                          type="text"
                            value={material.testingRequirement || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Colour Fastness (to Washing, Light, Crocking) / Residual"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                        <input
                          type="file"
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                          className="hidden"
                            id={`upload-lace-${materialIndex}`}
                        />
                        <label
                            htmlFor={`upload-lace-${materialIndex}`}
                          className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}
                        >
                            {material.testingRequirementFile ? 'UPLOADED' : 'UPLOAD'}
                        </label>
                      </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH / QUANTITY</label>
                        <input
                          type="text"
                          value={material.lengthQuantity || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'lengthQuantity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Unit: Meters or Yards per Roll (e.g., 50m Roll)"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS</label>
                        <input
                          type="text"
                          value={material.surplus || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplus', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="%AGE (e.g., 5-10%, due to cut ends/pattern)"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FOR-SECTION</label>
                          <input
                            type="text"
                            value={material.surplusForSection || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplusForSection', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                            placeholder="FOR"
                          />
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S/INITIAL/IPP"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.remarks || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'remarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="Required: Continuous pattern repeat, No visible knots, Specific"
                        />
                      </div>
                    </>
                  )}

                  {/* ELASTIC Fields */}
                  {material.trimAccessory === 'ELASTIC' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <input
                          type="text"
                          value={material.elasticType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'elasticType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Woven, Braided, Knitted"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <input
                          type="text"
                          value={material.elasticMaterial || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'elasticMaterial', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Rubber, Spandex, Latex"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">WIDTH</label>
                        <input
                          type="text"
                          value={material.elasticWidth || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'elasticWidth', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 10mm, 20mm, 25mm"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">STRETCH/TENSION</label>
                <input
                          type="text"
                          value={material.stretchTension || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'stretchTension', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Stretch percentage, Tension"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                        <input
                          type="text"
                          value={material.elasticColour || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'elasticColour', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="DTM, White, Black"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">PACKING</label>
                        <input
                          type="text"
                          value={material.elasticPacking || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'elasticPacking', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Unit: Meters or Yards per Roll"
                        />
                      </div>
                    </>
                  )}

                  {/* ELASTIC - Complete fields matching table exactly */}
                  {material.trimAccessory === 'ELASTIC' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENT</label>
                          <input
                            type="text"
                            value={material.testingRequirement || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirement', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Tensile Strength, Elongation, Recovery"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                        <input
                          type="file"
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                          className="hidden"
                          id={`upload-elastic-${materialIndex}`}
                        />
                        <label
                          htmlFor={`upload-elastic-${materialIndex}`}
                          className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}
                        >
                            {material.testingRequirementFile ? 'UPLOADED' : 'UPLOAD'}
                        </label>
                      </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH/QUANTITY</label>
                        <input
                          type="text"
                          value={material.lengthQuantity || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'lengthQuantity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Unit: Meters or Yards per Roll"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS</label>
                          <input
                            type="text"
                            value={material.surplus || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplus', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="%AGE (e.g., 2-5%)"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FOR-SECTION</label>
                        <input
                          type="text"
                          value={material.surplusForSection || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplusForSection', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                          placeholder="FOR"
                        />
                      </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S/INITIAL/IPP"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.remarks || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'remarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="For Waistband, should not narrow"
                        />
                      </div>
                    </>
                  )}

                  {/* FELT Fields */}
                  {material.trimAccessory === 'FELT' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <input
                          type="text"
                          value={material.feltType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'feltType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Wool, Synthetic, Blended"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <input
                          type="text"
                          value={material.feltMaterial || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'feltMaterial', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Fibre Content"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">THICKNESS</label>
                        <input
                          type="text"
                          value={material.feltThickness || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'feltThickness', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 2mm, 3mm, 5mm"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">DENSITY/GSM</label>
                        <input
                          type="text"
                          value={material.densityGsm || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'densityGsm', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 200 GSM, 300 GSM"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                        <input
                          type="text"
                          value={material.feltColour || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'feltColour', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="DTM, White, Black, Grey"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FINISH/FORM</label>
                        <input
                          type="text"
                          value={material.feltFinishForm || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'feltFinishForm', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Smooth, Textured, Pre-cut shapes"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPLICATION</label>
                        <input
                          type="text"
                          value={material.feltApplication || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'feltApplication', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Padding, Insulation, Reinforcement"
                        />
                      </div>
                    </>
                  )}

                  {/* FELT - Complete fields matching table exactly */}
                  {material.trimAccessory === 'FELT' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENT</label>
                        <input
                          type="text"
                          value={material.testingRequirement || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Flammability Rating, Pilling Resistance"
                        />
              </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                        <input
                          type="file"
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                          className="hidden"
                          id={`upload-felt-${materialIndex}`}
                        />
                        <label
                          htmlFor={`upload-felt-${materialIndex}`}
                          className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}
                        >
                            {material.testingRequirementFile ? 'UPLOADED' : 'UPLOAD'}
                        </label>
                      </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH/QUANTITY</label>
                        <input
                          type="text"
                          value={material.lengthQuantity || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'lengthQuantity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Unit: Meters or Yards or Sheets"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS</label>
                        <input
                          type="text"
                          value={material.surplus || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplus', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="%AGE (e.g., 5% for cutting)"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FOR-SECTION</label>
                        <input
                          type="text"
                            value={material.surplusForSection || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplusForSection', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                            placeholder="FOR"
                        />
                      </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S/INITIAL/IPP"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.remarks || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'remarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="Required: Non-Toxic, Anti-Fraying edge..."
                        />
                      </div>
                    </>
                  )}

                  {/* INTERLINING/FUSING Fields */}
                  {material.trimAccessory === 'INTERLINING/FUSING' && (
                    <>
              <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <input
                          type="text"
                          value={material.interliningType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'interliningType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Woven, Non-woven, Knitted, Fusible"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <input
                          type="text"
                          value={material.interliningMaterial || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'interliningMaterial', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Polyester, Cotton, Viscose, Blend"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">GSM/WEIGHT</label>
                        <input
                          type="text"
                          value={material.gsmWeight || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'gsmWeight', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 80 GSM, 100 GSM, 120 GSM"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">ADHESIVE</label>
                        <input
                          type="text"
                          value={material.adhesive || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'adhesive', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="PA (Polyamide), PES (Polyester), EVA"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                        <input
                          type="text"
                          value={material.interliningColour || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'interliningColour', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="White, Black, Grey, DTM"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FUSING SPEC</label>
                        <input
                          type="text"
                          value={material.fusingSpec || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'fusingSpec', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Temperature, Pressure, Time (e.g., 150°C, 3 bar, 12 sec)"
                        />
                      </div>
                    </>
                  )}

                  {/* INTERLINING/FUSING - Complete fields matching table exactly */}
                  {material.trimAccessory === 'INTERLINING/FUSING' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENT</label>
                        <input
                          type="text"
                          value={material.testingRequirement || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Bond strength, Residual Shrinkage"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                        <input
                          type="file"
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                          className="hidden"
                          id={`upload-interlining-${materialIndex}`}
                        />
                        <label
                          htmlFor={`upload-interlining-${materialIndex}`}
                          className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}
                        >
                            {material.testingRequirementFile ? 'UPLOADED' : 'UPLOAD'}
                </label>
                      </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH/QUANTITY</label>
                        <input
                          type="text"
                          value={material.lengthQuantity || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'lengthQuantity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Unit: Meters or Yards per Roll"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS</label>
                        <input
                          type="text"
                          value={material.surplus || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplus', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="%AGE (e.g., 2-5%)"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FOR-SECTION</label>
                          <input
                            type="text"
                            value={material.surplusForSection || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplusForSection', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                            placeholder="FOR"
                          />
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S/INITIAL/IPP"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.remarks || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'remarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="Specific hand feel required, Low shrinkage..."
                        />
                      </div>
                    </>
                  )}

                  {/* HOOKS & EYES Fields */}
                  {material.trimAccessory === 'HOOKS & EYES' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <input
                          type="text"
                          value={material.hookEyeType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'hookEyeType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Hook, Eye, Hook & Eye Set, Bar"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <input
                          type="text"
                          value={material.hookEyeMaterial || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'hookEyeMaterial', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Brass, Steel, Nickel Plated, DTM"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SIZE</label>
                        <input
                          type="text"
                          value={material.hookEyeSize || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'hookEyeSize', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., #1, #2, #3, Small, Medium, Large"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                        <input
                          type="text"
                          value={material.hookEyeColour || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'hookEyeColour', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Black, Silver, Nickel, DTM"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FINISH</label>
                        <input
                          type="text"
                          value={material.hookEyeFinish || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'hookEyeFinish', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Polished, Matte, Plated, Coated"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">STRENGTH</label>
                        <input
                          type="text"
                          value={material.strength || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'strength', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Holding Power (e.g., 5kg, 10kg)"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPLICATION</label>
                        <input
                          type="text"
                          value={material.application || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'application', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Waistband, Bra closure, Garment fastening"
                        />
                      </div>
                    </>
                  )}

                  {/* HOOKS & EYES - Complete fields matching table exactly */}
                  {material.trimAccessory === 'HOOKS & EYES' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENT</label>
                        <input
                          type="text"
                          value={material.testingRequirement || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Holding Power Test, Corrosion Resistance"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                        <input
                          type="file"
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                          className="hidden"
                          id={`upload-hooks-${materialIndex}`}
                        />
                        <label
                          htmlFor={`upload-hooks-${materialIndex}`}
                          className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}
                        >
                            {material.testingRequirementFile ? 'UPLOADED' : 'UPLOAD'}
                        </label>
                      </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH/QUANTITY</label>
                        <input
                          type="text"
                          value={material.lengthQuantity || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'lengthQuantity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Unit: Gross (144 sets) or Sets"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS</label>
                        <input
                          type="text"
                          value={material.surplus || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplus', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="%AGE (e.g., 3-5%)"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FOR-SECTION</label>
                          <input
                            type="text"
                            value={material.surplusForSection || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplusForSection', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                            placeholder="FOR"
                          />
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S/INITIAL/IPP"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.remarks || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'remarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="Ensure the bar is flat and non-bulky..."
                        />
                      </div>
                    </>
                  )}

                  {/* BUCKLES & ADJUSTERS Fields */}
                  {material.trimAccessory === 'BUCKLES & ADJUSTERS' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <input
                          type="text"
                          value={material.buckleType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'buckleType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Side Release, Center Bar, Ladder Lock"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <input
                          type="text"
                          value={material.buckleMaterial || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'buckleMaterial', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Plastic, Metal, Nylon"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SIZE</label>
                        <input
                          type="text"
                          value={material.buckleSize || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'buckleSize', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 20mm, 25mm, 30mm"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FINISH/COLOUR</label>
                        <input
                          type="text"
                          value={material.buckleFinishColour || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'buckleFinishColour', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Black, White, DTM, Nickel Plated"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FUNCTION</label>
                        <input
                          type="text"
                          value={material.buckleFunction || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'buckleFunction', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Adjustable, Quick Release, Locking"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TENSILE STRENGTH</label>
                        <input
                          type="text"
                          value={material.buckleTensileStrength || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'buckleTensileStrength', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Breaking strength in kg/lbs"
                        />
                      </div>
                    </>
                  )}

                  {/* BUCKLES & ADJUSTERS - Complete fields matching table exactly */}
                  {material.trimAccessory === 'BUCKLES & ADJUSTERS' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENT</label>
                        <input
                          type="text"
                          value={material.testingRequirement || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Corrosion Resistance, Salt Spray"
                        />
              </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                        <input
                          type="file"
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                          className="hidden"
                          id={`upload-buckles-${materialIndex}`}
                        />
                        <label
                          htmlFor={`upload-buckles-${materialIndex}`}
                          className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}
                        >
                            {material.testingRequirementFile ? 'UPLOADED' : 'UPLOAD'}
                        </label>
                      </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH/QUANTITY</label>
                        <input
                          type="text"
                          value={material.lengthQuantity || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'lengthQuantity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Unit: Pieces"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS</label>
                        <input
                          type="text"
                          value={material.surplus || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplus', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="%AGE (e.g., 3-5%)"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FOR-SECTION</label>
                          <input
                            type="text"
                            value={material.surplusForSection || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplusForSection', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                            placeholder="FOR"
                          />
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S/INITIAL/IPP"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.remarks || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'remarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="Required: specific finger guard for release..."
                        />
                      </div>
                    </>
                  )}

                  {/* EYELETS & GROMMETS Fields */}
                  {material.trimAccessory === 'EYELETS & GROMMETS' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <input
                          type="text"
                          value={material.eyeletType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'eyeletType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Eyelet, Grommet, Two-piece set"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <input
                          type="text"
                          value={material.eyeletMaterial || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'eyeletMaterial', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Brass, Steel, Aluminium, Plastic"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">INNER DIAMETER</label>
                        <input
                          type="text"
                          value={material.innerDiameter || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'innerDiameter', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 3mm, 4mm, 5mm"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">OUTER DIAMETER</label>
                        <input
                          type="text"
                          value={material.outerDiameter || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'outerDiameter', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 8mm, 10mm, 12mm"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                        <input
                          type="text"
                          value={material.eyeletColour || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'eyeletColour', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Black, Silver, DTM, Nickel Plated"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPLICATION</label>
                        <input
                          type="text"
                          value={material.eyeletApplication || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'eyeletApplication', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Shoe laces, Drawstrings, Reinforcement"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TOOLING</label>
                        <input
                          type="text"
                          value={material.tooling || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'tooling', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Hand tool, Machine press, Die set"
                        />
                      </div>
                    </>
                  )}

                  {/* EYELETS & GROMMETS - Complete fields matching table exactly */}
                  {material.trimAccessory === 'EYELETS & GROMMETS' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENT</label>
                        <input
                          type="text"
                          value={material.testingRequirement || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Pull-Off Strength, Corrosion"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                        <input
                          type="file"
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                          className="hidden"
                          id={`upload-eyelets-${materialIndex}`}
                        />
                        <label
                          htmlFor={`upload-eyelets-${materialIndex}`}
                          className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}
                        >
                            {material.testingRequirementFile ? 'UPLOADED' : 'UPLOAD'}
                  </label>
                      </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH/QUANTITY</label>
                  <input
                          type="text"
                          value={material.lengthQuantity || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'lengthQuantity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Unit: Gross (144 sets) or Sets"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS</label>
                        <input
                          type="text"
                          value={material.surplus || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplus', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="%AGE (e.g., 5-8%)"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FOR-SECTION</label>
                          <input
                            type="text"
                            value={material.surplusForSection || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplusForSection', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                            placeholder="FOR"
                          />
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S/INITIAL/IPP"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.remarks || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'remarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="Two-piece set (Eyelet and Washer) required..."
                        />
                      </div>
                    </>
                  )}

                  {/* SHOULDER PADS / CUPS Fields */}
                  {material.trimAccessory === 'SHOULDER PADS / CUPS' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <input
                          type="text"
                          value={material.shoulderPadType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'shoulderPadType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Shoulder Pad, Shoulder Cup, Epaulette"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <input
                          type="text"
                          value={material.shoulderPadMaterial || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'shoulderPadMaterial', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Polyurethane Foam, Polyester Fiber, Cotton"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SIZE</label>
                        <input
                          type="text"
                          value={material.shoulderPadSize || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'shoulderPadSize', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Small, Medium, Large, Custom dimensions"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SHAPE</label>
                        <input
                          type="text"
                          value={material.shape || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'shape', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Rounded, Square, Tapered, Contoured"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COVERING</label>
                        <input
                          type="text"
                          value={material.covering || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'covering', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Fabric, Mesh, Non-woven, Uncovered"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">ATTACHMENT</label>
                        <input
                          type="text"
                          value={material.shoulderPadAttachment || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'shoulderPadAttachment', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Sewn-in, Removable, Snap-on, Velcro"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">WEIGHT</label>
                        <input
                          type="text"
                          value={material.weight || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'weight', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Light, Medium, Heavy (e.g., 5g, 10g)"
                        />
                      </div>
                    </>
                  )}

                  {/* SHOULDER PADS / CUPS - Complete fields matching table exactly */}
                  {material.trimAccessory === 'SHOULDER PADS / CUPS' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENT</label>
                        <input
                          type="text"
                          value={material.testingRequirement || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Dry Cleaning, Washing Resistance"
                        />
                </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                        <input
                          type="file"
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                          className="hidden"
                          id={`upload-shoulder-${materialIndex}`}
                        />
                        <label
                          htmlFor={`upload-shoulder-${materialIndex}`}
                          className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}
                        >
                            {material.testingRequirementFile ? 'UPLOADED' : 'UPLOAD'}
                        </label>
                      </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH/QUANTITY</label>
                        <input
                          type="text"
                          value={material.lengthQuantity || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'lengthQuantity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Unit: Pairs"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS</label>
                        <input
                          type="text"
                          value={material.surplus || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplus', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="%AGE (e.g., 2-5%)"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S/INITIAL/IPP"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.remarks || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'remarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="Required: Lightweight, resilient to pressure..."
                        />
                      </div>
                    </>
                  )}

                  {/* TUBULAR KNITS / RIBBING Fields */}
                  {material.trimAccessory === 'TUBULAR KNITS / RIBBING' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <input
                          type="text"
                          value={material.tubularType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'tubularType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="1x1 Rib, 2x2 Rib, Interlock, Jersey"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <input
                          type="text"
                          value={material.tubularMaterial || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'tubularMaterial', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Cotton, Polyester, Spandex, Blend"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">WIDTH/DIAMETER</label>
                        <input
                          type="text"
                          value={material.widthDiameter || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'widthDiameter', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 1.5cm, 2cm, 3cm or inches"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">WEIGHT/DENSITY</label>
                        <input
                          type="text"
                          value={material.weightDensity || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'weightDensity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="GSM or oz/yd² (e.g., 180 GSM, 5.3 oz/yd²)"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                        <input
                          type="text"
                          value={material.tubularColour || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'tubularColour', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="White, Black, Navy, DTM"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">STRETCH%</label>
                        <input
                          type="text"
                          value={material.stretchPercent || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'stretchPercent', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 50%, 100%, 150%"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">CUTTING</label>
                        <input
                          type="text"
                          value={material.cutting || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'cutting', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Straight cut, Bias cut, Anti-curl"
                        />
                      </div>
                    </>
                  )}

                  {/* TUBULAR KNITS / RIBBING - Complete fields matching table exactly */}
                  {material.trimAccessory === 'TUBULAR KNITS / RIBBING' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENT</label>
                        <input
                          type="text"
                          value={material.testingRequirement || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Skewness, Colour Fastness, Pilling"
                        />
            </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                        <input
                          type="file"
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                          className="hidden"
                          id={`upload-tubular-${materialIndex}`}
                        />
                        <label
                          htmlFor={`upload-tubular-${materialIndex}`}
                          className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}
                        >
                            {material.testingRequirementFile ? 'UPLOADED' : 'UPLOAD'}
                        </label>
                      </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH/QUANTITY</label>
                        <input
                          type="text"
                          value={material.lengthQuantity || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'lengthQuantity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Unit: Meters or Yards per Roll"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS</label>
                        <input
                          type="text"
                          value={material.surplus || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplus', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="%AGE (e.g., 2-5%)"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FOR-SECTION</label>
                          <input
                            type="text"
                            value={material.surplusForSection || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplusForSection', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                            placeholder="FOR"
                          />
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S/INITIAL/IPP"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.remarks || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'remarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="Required: Must be anti-curl on the cut edge..."
                        />
                      </div>
                    </>
                  )}

                  {/* RFID / EAS TAGS Fields */}
                  {material.trimAccessory === 'RFID / EAS TAGS' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <input
                          type="text"
                          value={material.rfidType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'rfidType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="UHF RFID, HF RFID, LF RFID, EAS Tag"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FORM FACTOR</label>
                        <input
                          type="text"
                          value={material.formFactor || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'formFactor', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Label, Sticker, Hard Tag, Inlay"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FREQUENCY</label>
                        <input
                          type="text"
                          value={material.frequency || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'frequency', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="860-960 MHz (UHF), 13.56 MHz (HF), 125 kHz (LF)"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">CHIP/IC TYPE</label>
                        <input
                          type="text"
                          value={material.chipIcType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'chipIcType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Impinj Monza, NXP UCODE, Alien Higgs"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SIZE</label>
                        <input
                          type="text"
                          value={material.rfidSize || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'rfidSize', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 50mm x 20mm, 100mm x 30mm"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">CODING</label>
                        <input
                          type="text"
                          value={material.coding || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'coding', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="EPC Gen 2, ISO 18000-6C, TID Programming"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SECURITY</label>
                        <input
                          type="text"
                          value={material.security || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'security', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Tamper-evident, Kill Password, Lock Memory"
                        />
                      </div>
                    </>
                  )}

                  {/* RFID / EAS TAGS - Complete fields matching table exactly */}
                  {material.trimAccessory === 'RFID / EAS TAGS' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENT</label>
                        <input
                          type="text"
                          value={material.testingRequirement || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Read Range, Washing Resistance"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                        <input
                          type="file"
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                          className="hidden"
                          id={`upload-rfid-${materialIndex}`}
                        />
                        <label
                          htmlFor={`upload-rfid-${materialIndex}`}
                          className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}
                        >
                            {material.testingRequirementFile ? 'UPLOADED' : 'UPLOAD'}
                </label>
                      </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH/QUANTITY</label>
                        <input
                          type="text"
                          value={material.lengthQuantity || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'lengthQuantity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Unit: Pieces"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS</label>
                        <input
                          type="text"
                          value={material.surplus || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplus', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="%AGE (e.g., 2%)"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FOR-SECTION</label>
                        <input
                          type="text"
                          value={material.surplusForSection || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplusForSection', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                          placeholder="FOR"
                        />
                      </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S/INITIAL/IPP / Technical Integration"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.remarks || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'remarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="Required: Global Gen 2 standard..."
                        />
                      </div>
                    </>
                  )}

                  {/* PLASTIC CABLE TIES / LOOPS Fields */}
                  {material.trimAccessory === 'PLASTIC CABLE TIES / LOOPS' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <input
                          type="text"
                          value={material.cableTieType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'cableTieType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Standard, Releasable, Beaded, Loop"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <input
                          type="text"
                          value={material.cableTieMaterial || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'cableTieMaterial', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Nylon 6/6, Polypropylene, Stainless Steel"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SIZE</label>
                        <input
                          type="text"
                          value={material.cableTieSize || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'cableTieSize', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Length x Width (e.g., 100mm x 2.5mm, 150mm x 3.6mm)"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                        <input
                          type="text"
                          value={material.cableTieColour || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'cableTieColour', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="White, Black, Natural, DTM"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TENSILE STRENGTH</label>
                        <input
                          type="text"
                          value={material.cableTieTensileStrength || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'cableTieTensileStrength', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 18 lbs, 50 lbs, 120 lbs"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FINISH</label>
                        <input
                          type="text"
                          value={material.cableTieFinish || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'cableTieFinish', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Smooth, Textured, UV Stabilized"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">USAGE</label>
                        <input
                          type="text"
                          value={material.cableTieUsage || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'cableTieUsage', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Hang tags, Security loops, Cable management"
                        />
                      </div>
                    </>
                  )}

                  {/* PLASTIC CABLE TIES / LOOPS - Complete fields matching table exactly */}
                  {material.trimAccessory === 'PLASTIC CABLE TIES / LOOPS' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENT</label>
                          <input
                            type="text"
                            value={material.testingRequirement || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirement', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Tensile Test, UV Resistance"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                        <input
                          type="file"
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                          className="hidden"
                          id={`upload-cable-${materialIndex}`}
                        />
                        <label
                          htmlFor={`upload-cable-${materialIndex}`}
                          className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}
                        >
                            {material.testingRequirementFile ? 'UPLOADED' : 'UPLOAD'}
                        </label>
                      </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH/QUANTITY</label>
                        <input
                          type="text"
                          value={material.lengthQuantity || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'lengthQuantity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Unit: Pieces or Bundles"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS</label>
                        <input
                          type="text"
                          value={material.surplus || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplus', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="%AGE (e.g., 5-10%)"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FOR-SECTION</label>
                        <input
                          type="text"
                          value={material.surplusForSection || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplusForSection', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                          placeholder="FOR"
                        />
                      </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S/INITIAL/IPP"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.remarks || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'remarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="Required: Must have rounded, non-scratching edges..."
                        />
                      </div>
                    </>
                  )}

                  {/* FRINGE / TASSELS Fields */}
                  {material.trimAccessory === 'FRINGE / TASSELS' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <input
                          type="text"
                          value={material.fringeType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'fringeType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Fringe, Tassel, Pom-pom, Bullion"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <input
                          type="text"
                          value={material.fringeMaterial || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'fringeMaterial', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Cotton, Polyester, Rayon, Wool, Blend"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">DROP LENGTH</label>
                        <input
                          type="text"
                          value={material.dropLength || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'dropLength', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 2cm, 3cm, 5cm, 10cm"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TAPE WIDTH</label>
                        <input
                          type="text"
                          value={material.tapeWidth || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'tapeWidth', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 1cm, 1.5cm, 2cm, 3cm"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                        <input
                          type="text"
                          value={material.fringeColour || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'fringeColour', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="White, Black, Navy, DTM, Multi-color"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FINISH</label>
                        <input
                          type="text"
                          value={material.fringeFinish || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'fringeFinish', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Brushed, Twisted, Knotted, Cut edge"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">CONSTRUCTION</label>
                        <input
                          type="text"
                          value={material.construction || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'construction', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Hand-tied, Machine-made, Woven, Knitted"
                        />
                      </div>
                    </>
                  )}

                  {/* FRINGE / TASSELS - Complete fields matching table exactly */}
                  {material.trimAccessory === 'FRINGE / TASSELS' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENT</label>
                        <input
                          type="text"
                          value={material.testingRequirement || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Colour Fastness, Washing Resistance"
                        />
              </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                            className="hidden"
                            id={`upload-fringe-${materialIndex}`}
                          />
                          <label
                            htmlFor={`upload-fringe-${materialIndex}`}
                            className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}
                          >
                            {material.testingRequirementFile ? 'UPLOADED' : 'UPLOAD'}
                          </label>
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH/QUANTITY</label>
                        <input
                          type="text"
                          value={material.lengthQuantity || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'lengthQuantity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Unit: Meters or Pieces per Roll"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS</label>
                        <input
                          type="text"
                          value={material.surplus || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplus', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="%AGE (e.g., 5-10%)"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FOR-SECTION</label>
                          <input
                            type="text"
                            value={material.surplusForSection || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplusForSection', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                            placeholder="FOR"
                          />
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S/INITIAL/IPP / Design Sample Approval"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.remarks || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'remarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="Required: Hand-tied appearance..."
                        />
                      </div>
                    </>
                  )}

                  {/* PLASTIC PIPES / RODS Fields */}
                  {material.trimAccessory === 'PLASTIC PIPES / RODS' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <input
                          type="text"
                          value={material.pipeType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'pipeType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Round Pipe, Square Rod, Flat Bar, Custom Shape"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <input
                          type="text"
                          value={material.pipeMaterial || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'pipeMaterial', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="PVC, Polypropylene, Nylon, ABS, Polyethylene"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">DIAMETER/DIM.</label>
                        <input
                          type="text"
                          value={material.diameterDimensions || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'diameterDimensions', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 6mm, 8mm, 10mm or 5mm x 3mm"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH</label>
                        <input
                          type="text"
                          value={material.pipeLength || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'pipeLength', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 50cm, 1m, 1.5m, Custom length"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                        <input
                          type="text"
                          value={material.pipeColour || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'pipeColour', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="White, Black, Clear, DTM"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">END CAPS</label>
                        <input
                          type="text"
                          value={material.endCaps || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'endCaps', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Open, Closed, Rounded, Flat"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FLEXIBILITY</label>
                        <input
                          type="text"
                          value={material.flexibility || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'flexibility', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Rigid, Semi-flexible, Flexible"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">USAGE</label>
                        <input
                          type="text"
                          value={material.pipeUsage || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'pipeUsage', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Hood drawstring channel, Waistband support, Reinforcement"
                        />
                      </div>
                    </>
                  )}

                  {/* PLASTIC PIPES / RODS - Complete fields matching table exactly */}
                  {material.trimAccessory === 'PLASTIC PIPES / RODS' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENT</label>
                        <input
                          type="text"
                          value={material.testingRequirement || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="UV Stability, Load Bearing, Deflection"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                            className="hidden"
                            id={`upload-pipes-${materialIndex}`}
                          />
                          <label
                            htmlFor={`upload-pipes-${materialIndex}`}
                            className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}
                          >
                            {material.testingRequirementFile ? 'UPLOADED' : 'UPLOAD'}
                          </label>
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH/QUANTITY</label>
                        <input
                          type="text"
                          value={material.lengthQuantity || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'lengthQuantity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Unit: Meters or Pieces"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS</label>
                        <input
                          type="text"
                          value={material.surplus || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplus', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="%AGE (e.g., 2-5%)"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S/INITIAL/IPP"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.remarks || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'remarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="Required: must fit precisely into a 6mm stitched channel..."
                        />
                      </div>
                    </>
                  )}

                  {/* SEAM SEALING TAPE Fields */}
                  {material.trimAccessory === 'SEAM SEALING TAPE' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <input
                          type="text"
                          value={material.seamTapeType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'seamTapeType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="PU Tape, TPU Tape, Hot Melt"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                <input
                  type="text"
                          value={material.seamTapeMaterial || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'seamTapeMaterial', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Polyurethane, Thermoplastic Polyurethane"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">WIDTH</label>
                        <input
                          type="text"
                          value={material.seamTapeWidth || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'seamTapeWidth', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 12mm, 15mm, 20mm"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                        <input
                          type="text"
                          value={material.seamTapeColour || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'seamTapeColour', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Transparent, White, DTM"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">ADHESIVE TYPE</label>
                        <input
                          type="text"
                          value={material.seamTapeAdhesiveType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'seamTapeAdhesiveType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Hot Melt, Pressure Sensitive, Heat Activated"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPLICATION SPEC</label>
                        <input
                          type="text"
                          value={material.applicationSpec || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'applicationSpec', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Temperature, Pressure, Speed (e.g., 150°C, 3 bar)"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">ELASTICITY</label>
                        <input
                          type="text"
                          value={material.elasticity || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'elasticity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Stretch %, Recovery %, Elastic Modulus"
                        />
                      </div>
                    </>
                  )}

                  {/* SEAM SEALING TAPE - Complete fields matching table exactly */}
                  {material.trimAccessory === 'SEAM SEALING TAPE' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENT</label>
                        <input
                          type="text"
                          value={material.testingRequirement || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Hydrostatic Head test"
                        />
              </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                            className="hidden"
                            id={`upload-seam-${materialIndex}`}
                          />
                          <label
                            htmlFor={`upload-seam-${materialIndex}`}
                            className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}
                          >
                            {material.testingRequirementFile ? 'UPLOADED' : 'UPLOAD'}
                          </label>
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH/QUANTITY</label>
                        <input
                          type="text"
                          value={material.lengthQuantity || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'lengthQuantity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Unit: Meters or Yards per Roll"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS</label>
                        <input
                          type="text"
                          value={material.surplus || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplus', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="%AGE (e.g., 5-10%)"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FOR-SECTION</label>
                          <input
                            type="text"
                            value={material.surplusForSection || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplusForSection', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                            placeholder="FOR"
                          />
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S / INITIAL / IPP / Technical Data Sheet"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.remarks || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'remarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="Required: Matte finish on the exterior face..."
                        />
                      </div>
                    </>
                  )}

                  {/* ADHESIVES / GUNNING Fields */}
                  {material.trimAccessory === 'ADHESIVES / GUNNING' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <input
                          type="text"
                          value={material.adhesiveType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'adhesiveType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Hot Melt, Contact Adhesive, Spray Adhesive"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL BASE</label>
                        <input
                          type="text"
                          value={material.materialBase || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'materialBase', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="EVA, PU, Polyamide, Acrylic, Rubber-based"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPLICATION</label>
                        <input
                          type="text"
                          value={material.adhesiveApplication || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'adhesiveApplication', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Foam-to-fabric, Fabric-to-fabric, Lamination"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">VISCOSITY</label>
                        <input
                          type="text"
                          value={material.viscosity || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'viscosity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Low, Medium, High (e.g., 5000 cPs, 15000 cPs)"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SETTING TIME</label>
                        <input
                          type="text"
                          value={material.settingTime || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'settingTime', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 5 sec, 30 sec, 2 min, 24 hours"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                        <input
                          type="text"
                          value={material.adhesiveColour || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'adhesiveColour', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Transparent, White, Yellow, DTM"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPLICATOR</label>
                        <input
                          type="text"
                          value={material.applicator || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'applicator', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Gun applicator, Spray gun, Roller, Brush"
                        />
                      </div>
                    </>
                  )}

                  {/* ADHESIVES / GUNNING - Complete fields matching table exactly */}
                  {material.trimAccessory === 'ADHESIVES / GUNNING' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENT</label>
                        <input
                          type="text"
                          value={material.testingRequirement || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Bond strength, Toxicity / VOC Content"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                            className="hidden"
                            id={`upload-adhesives-${materialIndex}`}
                          />
                          <label
                            htmlFor={`upload-adhesives-${materialIndex}`}
                            className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}
                          >
                            {material.testingRequirementFile ? 'UPLOADED' : 'UPLOAD'}
                          </label>
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH/QUANTITY</label>
                        <input
                          type="text"
                          value={material.lengthQuantity || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'lengthQuantity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Unit: Liters (L), Kilograms (Kgs), or Cans"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS</label>
                        <input
                          type="text"
                          value={material.surplus || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplus', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="%AGE (e.g., 5-10%)"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FOR-SECTION</label>
                          <input
                            type="text"
                            value={material.surplusForSection || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplusForSection', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                            placeholder="FOR"
                          />
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S / INITIAL / IPP / Safety Data Sheet (SDS)"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.remarks || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'remarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="Required: Non-toxic, suitable for foam-to-fabric bond..."
                        />
                      </div>
                    </>
                  )}

                  {/* PRE-CUT HEMS / BINDINGS Fields */}
                  {material.trimAccessory === 'PRE-CUT HEMS / BINDINGS' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <input
                          type="text"
                          value={material.hemType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'hemType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Bias Binding, Straight Cut, Curved Hem"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                <input
                  type="text"
                          value={material.hemMaterial || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'hemMaterial', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Cotton, Polyester, Blend, DTM"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">CUT TYPE</label>
                        <input
                          type="text"
                          value={material.cutType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'cutType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Straight, Bias (45°), Curved"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">WIDTH</label>
                        <input
                          type="text"
                          value={material.hemWidth || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'hemWidth', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 1cm, 1.5cm, 2cm, 2.5cm"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FOLD TYPE</label>
                        <input
                          type="text"
                          value={material.foldType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'foldType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Single fold, Double fold, Unfolded"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                        <input
                          type="text"
                          value={material.hemColour || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'hemColour', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="White, Black, Navy, DTM"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">PACKAGING</label>
                        <input
                          type="text"
                          value={material.hemPackaging || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'hemPackaging', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Roll, Folded, Continuous length"
                        />
                      </div>
                    </>
                  )}

                  {/* PRE-CUT HEMS / BINDINGS - Complete fields matching table exactly */}
                  {material.trimAccessory === 'PRE-CUT HEMS / BINDINGS' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENT</label>
                        <input
                          type="text"
                          value={material.testingRequirement || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Residual shrinkage, Skewing"
                        />
              </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                            className="hidden"
                            id={`upload-hems-${materialIndex}`}
                          />
                          <label
                            htmlFor={`upload-hems-${materialIndex}`}
                            className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}
                          >
                            {material.testingRequirementFile ? 'UPLOADED' : 'UPLOAD'}
                          </label>
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH/QUANTITY</label>
                        <input
                          type="text"
                          value={material.lengthQuantity || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'lengthQuantity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Unit: Meters or Yards per Roll"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS</label>
                        <input
                          type="text"
                          value={material.surplus || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplus', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="%AGE (e.g., 5%)"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FOR-SECTION</label>
                          <input
                            type="text"
                            value={material.surplusForSection || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplusForSection', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                            placeholder="FOR"
                          />
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S/INITIAL/IPP"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.remarks || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'remarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="Required: must be stretch-stabilized for curved edges..."
                        />
                      </div>
                    </>
                  )}

                  {/* REFLECTIVE TAPES / TRIMS Fields */}
                  {material.trimAccessory === 'REFLECTIVE TAPES / TRIMS' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <input
                          type="text"
                          value={material.reflectiveType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'reflectiveType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Glass Bead, Prismatic, Microprismatic"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <input
                          type="text"
                          value={material.reflectiveMaterial || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'reflectiveMaterial', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="PVC, Polyester, Polyurethane, Fabric-backed"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">WIDTH</label>
                        <input
                          type="text"
                          value={material.reflectiveWidth || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'reflectiveWidth', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 25mm, 50mm, 75mm"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                        <input
                          type="text"
                          value={material.reflectiveColour || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'reflectiveColour', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Silver, Yellow, Orange, DTM"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">CERTIFICATION</label>
                        <input
                          type="text"
                          value={material.certification || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'certification', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="EN ISO 20471, ANSI/ISEA 107, CSA Z96"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">BASE FABRIC</label>
                        <input
                          type="text"
                          value={material.baseFabric || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'baseFabric', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Polyester, Nylon, Cotton, Blend"
                        />
                      </div>
                    </>
                  )}

                  {/* REFLECTIVE TAPES / TRIMS - Complete fields matching table exactly */}
                  {material.trimAccessory === 'REFLECTIVE TAPES / TRIMS' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENT</label>
                        <input
                          type="text"
                          value={material.testingRequirement || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Retro-reflection Coefficient"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH/QUANTITY</label>
                        <input
                          type="text"
                          value={material.lengthQuantity || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'lengthQuantity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Unit: Meters or Yards per Roll"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                            className="hidden"
                            id={`upload-reflective-${materialIndex}`}
                          />
                          <label
                            htmlFor={`upload-reflective-${materialIndex}`}
                            className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}
                          >
                            {material.testingRequirementFile ? 'UPLOADED' : 'UPLOAD'}
                          </label>
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS</label>
                        <input
                          type="text"
                          value={material.surplus || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplus', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="%AGE (e.g., 5-10%)"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S/INITIAL/IPP / Compliance Certificate"
                        />
                      </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FOR-SECTION</label>
                          <input
                            type="text"
                            value={material.surplusForSection || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplusForSection', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                            placeholder="FOR"
                          />
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.remarks || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'remarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="Required: must be compatible with industrial laundering..."
                        />
                      </div>
                    </>
                  )}

                  {/* FIRE RETARDANT (FR) TRIMS Fields */}
                  {material.trimAccessory === 'FIRE RETARDANT (FR) TRIMS' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <input
                          type="text"
                          value={material.frType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'frType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Tape, Trim, Binding, Webbing"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <input
                          type="text"
                          value={material.frMaterial || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'frMaterial', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Nomex, Kevlar, FR Cotton, FR Polyester"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COMPLIANCE LEVEL</label>
                        <input
                          type="text"
                          value={material.complianceLevel || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'complianceLevel', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="NFPA 701, EN 11612, ASTM D6413, CPAI-84"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                        <input
                          type="text"
                          value={material.frColour || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'frColour', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Yellow, Orange, DTM"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">DURABILITY</label>
                        <input
                          type="text"
                          value={material.durability || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'durability', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Wash durability, Lightfastness, Abrasion resistance"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COMPONENTS</label>
                        <input
                          type="text"
                          value={material.frComponents || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'frComponents', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Base fabric, Coating, Thread, Adhesive"
                        />
                      </div>
                    </>
                  )}

                  {/* FIRE RETARDANT (FR) TRIMS - Complete fields matching table exactly */}
                  {material.trimAccessory === 'FIRE RETARDANT (FR) TRIMS' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENT</label>
                        <input
                          type="text"
                          value={material.testingRequirement || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Vertical Flame test, LOI"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH/QUANTITY</label>
                        <input
                          type="text"
                          value={material.lengthQuantity || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'lengthQuantity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Unit: Meters or Pieces"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                        <input
                          type="file"
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                          className="hidden"
                          id={`upload-fr-${materialIndex}`}
                        />
                        <label
                          htmlFor={`upload-fr-${materialIndex}`}
                          className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}
                        >
                            {material.testingRequirementFile ? 'UPLOADED' : 'UPLOAD'}
                        </label>
                      </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS</label>
                        <input
                          type="text"
                          value={material.surplus || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplus', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="%AGE (e.g., 5%)"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S/INITIAL/IPP / Certification Test Report"
                        />
                      </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FOR-SECTION</label>
                          <input
                            type="text"
                            value={material.surplusForSection || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplusForSection', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                            placeholder="FOR"
                          />
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.remarks || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'remarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="Required: must be inherently FR (not treated)..."
                        />
                      </div>
                    </>
                  )}

                  {/* REPAIR KITS / PATCHES Fields */}
                  {material.trimAccessory === 'REPAIR KITS / PATCHES' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <input
                          type="text"
                          value={material.repairKitType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'repairKitType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Patch Kit, Repair Tape, Adhesive Patch"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <input
                          type="text"
                          value={material.repairKitMaterial || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'repairKitMaterial', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Fabric, Vinyl, PU Coated, DTM"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SIZE/SHAPE</label>
                        <input
                          type="text"
                          value={material.sizeShape || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'sizeShape', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 5cm x 5cm, Round, Custom shape"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                        <input
                          type="text"
                          value={material.repairKitColour || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'repairKitColour', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Black, Navy, DTM, Multi-color"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">PACKAGING</label>
                        <input
                          type="text"
                          value={material.repairKitPackaging || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'repairKitPackaging', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Pouch, Envelope, Box, Individual wrap"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">USER APPLICATION</label>
                        <input
                          type="text"
                          value={material.userApplication || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'userApplication', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Heat press, Iron-on, Adhesive, Sew-on"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">CONTENTS</label>
                        <input
                          type="text"
                          value={material.contents || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'contents', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Patch, Adhesive, Instructions, Cleaning wipes"
                        />
                      </div>
                    </>
                  )}

                  {/* REPAIR KITS / PATCHES - Complete fields matching table exactly */}
                  {material.trimAccessory === 'REPAIR KITS / PATCHES' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENT</label>
                        <input
                          type="text"
                          value={material.testingRequirement || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Adhesion strength, Shelf Life"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                            className="hidden"
                            id={`upload-repair-${materialIndex}`}
                          />
                          <label
                            htmlFor={`upload-repair-${materialIndex}`}
                            className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}
                          >
                            {material.testingRequirementFile ? 'UPLOADED' : 'UPLOAD'}
                          </label>
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH/QUANTITY</label>
                        <input
                          type="text"
                          value={material.lengthQuantity || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'lengthQuantity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Unit: Pieces or Sets"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS</label>
                        <input
                          type="text"
                          value={material.surplus || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplus', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="%AGE (e.g., 5-10%)"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FOR-SECTION</label>
                        <input
                            type="text"
                            value={material.surplusForSection || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplusForSection', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                            placeholder="FOR"
                          />
                      </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S/INITIAL/IPP / Instruction Manual"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.remarks || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'remarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="Required: must be included in the product packaging..."
                        />
                      </div>
                    </>
                  )}

                  {/* CORD STOPS / CORD LOCKS / TOGGLES Fields */}
                  {material.trimAccessory === 'CORD STOPS / CORD LOCKS / TOGGLES' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <input
                          type="text"
                          value={material.cordStopType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'cordStopType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Cord Stop, Cord Lock, Toggle, Spring Lock"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <input
                          type="text"
                          value={material.cordStopMaterial || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'cordStopMaterial', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Nylon, Acetal, POM, Plastic"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SIZE</label>
                        <input
                          type="text"
                          value={material.cordStopSize || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'cordStopSize', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 3mm, 4mm, 5mm, Small, Medium, Large"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                        <input
                          type="text"
                          value={material.cordStopColour || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'cordStopColour', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Black, White, DTM"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">LOCKING MECHANISM</label>
                        <input
                          type="text"
                          value={material.lockingMechanism || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'lockingMechanism', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Spring-loaded, Friction, Cam lock, Push-pull"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FUNCTION</label>
                        <input
                          type="text"
                          value={material.cordStopFunction || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'cordStopFunction', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Adjustable tension, Lock cord, Release mechanism"
                        />
                      </div>
                    </>
                  )}

                  {/* CORD STOPS / CORD LOCKS / TOGGLES - Complete fields matching table exactly */}
                  {material.trimAccessory === 'CORD STOPS / CORD LOCKS / TOGGLES' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENT</label>
                        <input
                          type="text"
                          value={material.testingRequirement || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Locking Strength, UV"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH/QUANTITY</label>
                        <input
                          type="text"
                          value={material.lengthQuantity || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'lengthQuantity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Unit: Pieces"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                            className="hidden"
                            id={`upload-cord-${materialIndex}`}
                          />
                          <label
                            htmlFor={`upload-cord-${materialIndex}`}
                            className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}
                          >
                            {material.testingRequirementFile ? 'UPLOADED' : 'UPLOAD'}
                          </label>
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS</label>
                        <input
                          type="text"
                          value={material.surplus || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplus', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="%AGE (e.g., 3-5%)"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S / INITIAL / IPP / Functionality Approval"
                        />
                      </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FOR-SECTION</label>
                          <input
                            type="text"
                            value={material.surplusForSection || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplusForSection', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                            placeholder="FOR"
                          />
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.remarks || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'remarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="Required: ergonomic finger grip, No snagging edges..."
                        />
                      </div>
                    </>
                  )}

                  {/* D-RINGS / O-RINGS / WEBBING LOOPS Fields */}
                  {material.trimAccessory === 'D-RINGS / O-RINGS / WEBBING LOOPS' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <input
                          type="text"
                          value={material.dRingType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'dRingType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="D-Ring, O-Ring, Webbing Loop, Triangle Ring"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <input
                          type="text"
                          value={material.dRingMaterial || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'dRingMaterial', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Steel, Stainless Steel, Brass, Aluminium, Plastic"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SIZE</label>
                        <input
                          type="text"
                          value={material.dRingSize || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'dRingSize', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 25mm, 38mm, 50mm, 1 inch, 1.5 inch"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">THICKNESS/GAUGE</label>
                        <input
                          type="text"
                          value={material.thicknessGauge || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'thicknessGauge', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 2mm, 3mm, 16 gauge, 18 gauge"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FINISH/PLATING</label>
                        <input
                          type="text"
                          value={material.dRingFinishPlating || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'dRingFinishPlating', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Zinc plated, Nickel plated, Black oxide, DTM"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">LOAD RATING</label>
                        <input
                          type="text"
                          value={material.loadRating || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'loadRating', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 50kg, 100kg, 200kg, 500 lbs"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPLICATION</label>
                        <input
                          type="text"
                          value={material.dRingApplication || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'dRingApplication', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Backpack straps, Bag handles, Load bearing, Attachment point"
                        />
                      </div>
                    </>
                  )}

                  {/* D-RINGS / O-RINGS / WEBBING LOOPS - Complete fields matching table exactly */}
                  {material.trimAccessory === 'D-RINGS / O-RINGS / WEBBING LOOPS' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENT</label>
                        <input
                          type="text"
                          value={material.testingRequirement || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Tensile strength, Corrosion Resistance"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                            className="hidden"
                            id={`upload-drings-${materialIndex}`}
                          />
                          <label
                            htmlFor={`upload-drings-${materialIndex}`}
                            className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}
                          >
                            {material.testingRequirementFile ? 'UPLOADED' : 'UPLOAD'}
                          </label>
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH/QUANTITY</label>
                        <input
                          type="text"
                          value={material.lengthQuantity || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'lengthQuantity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Unit: Pieces"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS</label>
                        <input
                          type="text"
                          value={material.surplus || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplus', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="%AGE (e.g., 2-5%)"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FOR-SECTION</label>
                          <input
                            type="text"
                            value={material.surplusForSection || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplusForSection', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                            placeholder="FOR"
                          />
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S / INITIAL / IPP / Load Test Certificate"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.remarks || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'remarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="Required: must be non-magnetic for military use..."
                        />
                      </div>
                    </>
                  )}

                  {/* FOAM / WADDING (PRE-CUT SHAPES) Fields */}
                  {material.trimAccessory === 'FOAM / WADDING (Pre-Cut Shapes)' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <input
                          type="text"
                          value={material.foamType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'foamType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Polyurethane, Polyethylene, EVA, Memory Foam"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">DENSITY</label>
                        <input
                          type="text"
                          value={material.foamDensity || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'foamDensity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 25 kg/m³, 35 kg/m³, 50 kg/m³"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">THICKNESS</label>
                        <input
                          type="text"
                          value={material.foamThickness || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'foamThickness', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 5mm, 10mm, 15mm, 20mm"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SHAPE ID</label>
                        <input
                          type="text"
                          value={material.shapeId || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'shapeId', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., SH-001, SH-002, Custom shape reference"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                        <input
                          type="text"
                          value={material.foamColour || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'foamColour', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="White, Grey, Black, DTM"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">PROPERTIES</label>
                        <input
                          type="text"
                          value={material.properties || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'properties', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Firm, Soft, High resilience, Anti-microbial"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">ATTACHMENT</label>
                        <input
                          type="text"
                          value={material.foamAttachment || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'foamAttachment', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Adhesive-backed, Sewn-in, Velcro, Snap-on"
                        />
                      </div>
                    </>
                  )}

                  {/* FOAM / WADDING (PRE-CUT SHAPES) - Complete fields matching table exactly */}
                  {material.trimAccessory === 'FOAM / WADDING (Pre-Cut Shapes)' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENT</label>
                        <input
                          type="text"
                          value={material.testingRequirement || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Compression set"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                            className="hidden"
                            id={`upload-foam-${materialIndex}`}
                          />
                          <label
                            htmlFor={`upload-foam-${materialIndex}`}
                            className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}
                          >
                            {material.testingRequirementFile ? 'UPLOADED' : 'UPLOAD'}
                          </label>
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH/QUANTITY</label>
                        <input
                          type="text"
                          value={material.lengthQuantity || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'lengthQuantity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Unit: Pieces or Sheets"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS</label>
                        <input
                          type="text"
                          value={material.surplus || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplus', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="%AGE (e.g., 5%)"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FOR</label>
                          <input
                            type="text"
                            value={material.surplusForSection || ''}
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplusForSection', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                            placeholder="FOR"
                          />
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S/INITIAL/IPP / Foam Sample Approval"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.remarks || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'remarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="Required: must be neat, sealed on the edge..."
                        />
                      </div>
                    </>
                  )}

                  {/* PINS / TAGGING BARBS Fields */}
                  {material.trimAccessory === 'PINS / TAGGING BARBS' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <input
                          type="text"
                          value={material.pinType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'pinType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Tagging Pin, Safety Pin, T-Pin, U-Pin"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <input
                          type="text"
                          value={material.pinMaterial || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'pinMaterial', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Stainless Steel, Nickel-plated, Brass, Plastic"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SIZE</label>
                        <input
                          type="text"
                          value={material.pinSize || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'pinSize', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 1.5 inch, 2 inch, 3 inch, Small, Medium, Large"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                        <input
                          type="text"
                          value={material.pinColour || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'pinColour', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Silver, Gold, Black, DTM"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TENSILE STRENGTH</label>
                        <input
                          type="text"
                          value={material.pinTensileStrength || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'pinTensileStrength', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 5kg, 10kg, 15kg"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">HEAD TYPE</label>
                        <input
                          type="text"
                          value={material.headType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'headType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Round head, Flat head, Ball head, T-head"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPLICATION</label>
                        <input
                          type="text"
                          value={material.pinApplication || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'pinApplication', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Tagging, Pattern holding, Temporary fastening"
                        />
                      </div>
                    </>
                  )}

                  {/* PINS / TAGGING BARBS - Complete fields matching table exactly */}
                  {material.trimAccessory === 'PINS / TAGGING BARBS' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENT</label>
                        <input
                          type="text"
                          value={material.testingRequirement || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Needle sharpness, Non-Rusting"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirementFile', e.target.files[0])}
                            className="hidden"
                            id={`upload-pins-${materialIndex}`}
                          />
                          <label
                            htmlFor={`upload-pins-${materialIndex}`}
                            className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}
                          >
                            {material.testingRequirementFile ? 'UPLOADED' : 'UPLOAD'}
                          </label>
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH/QUANTITY</label>
                        <input
                          type="text"
                          value={material.lengthQuantity || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'lengthQuantity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Unit: Pieces or Boxes"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS</label>
                        <input
                          type="text"
                          value={material.surplus || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplus', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="%AGE (e.g., 10%)"
                        />
                      </div>
                      <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FOR-SECTION</label>
                        <input
                          type="text"
                          value={material.surplusForSection || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplusForSection', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                          placeholder="FOR"
                        />
                      </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S/INITIAL/IPP"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.remarks || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'remarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="Required: must be non-marking on delicate fabrics..."
                        />
                      </div>
                    </>
                  )}

                  {/* MAGNETIC CLOSURES / SNAPS Fields */}
                  {material.trimAccessory === 'MAGNETIC CLOSURES / SNAPS' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                        <input
                          type="text"
                          value={material.magneticType || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'magneticType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Magnetic Snap, Magnetic Button, Magnetic Closure"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                        <input
                          type="text"
                          value={material.magneticMaterial || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'magneticMaterial', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Neodymium, Ferrite, Samarium Cobalt, Plastic housing"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SIZE</label>
                        <input
                          type="text"
                          value={material.magneticSize || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'magneticSize', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 12mm, 15mm, 20mm, Small, Medium, Large"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">STRENGTH</label>
                        <input
                          type="text"
                          value={material.magneticStrength || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'magneticStrength', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Pull force (e.g., 1kg, 2kg, 3kg, 5 lbs)"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">POLARITY</label>
                        <input
                          type="text"
                          value={material.polarity || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'polarity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="North-South, Attracting pair, Repelling pair"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPLICATION</label>
                        <input
                          type="text"
                          value={material.magneticApplication || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'magneticApplication', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Pocket closure, Bag closure, Garment fastening"
                        />
                      </div>
                    </>
                  )}

                  {/* MAGNETIC CLOSURES / SNAPS - Complete fields matching table exactly */}
                  {material.trimAccessory === 'MAGNETIC CLOSURES / SNAPS' && (
                    <>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENT</label>
                        <input
                          type="text"
                          value={material.testingRequirement || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'testingRequirement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Pull Force test, Corrosion Resistance"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH/QUANTITY</label>
                        <input
                          type="text"
                          value={material.lengthQuantity || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'lengthQuantity', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Unit: Pairs (Male/Female set)"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS</label>
                        <input
                          type="text"
                          value={material.surplus || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'surplus', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="%AGE (e.g., 3-5%)"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                        <input
                          type="text"
                          value={material.approval || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'approval', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="BUYER'S/INITIAL/IPP / Magnet Field Strength"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                        <textarea
                          value={material.remarks || ''}
                          onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'remarks', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', minHeight: '44px' }}
                          rows="1"
                          placeholder="Required: must be RF-shielded if near RFID tags..."
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="w-full">
      {/* Header with proper spacing */}
      <div style={{ marginBottom: '28px' }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">PART-2 RAW MATERIAL SOURCING</h2>
        <p className="text-sm text-gray-600">Bill of material & work order</p>
      </div>
      
      {/* Raw Materials Table */}
      <div>
        {formData.rawMaterials.map((material, materialIndex) => (
          <div key={materialIndex} className="bg-gray-50 rounded-xl border border-gray-200" style={{ padding: '24px', marginBottom: '24px' }}>
            {/* Material Header */}
            <div className="mb-5">
              <div className="flex flex-wrap items-end gap-3" style={{ marginBottom: '24px' }}>
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    PRODUCT
                  </label>
                  <input
                    type="text"
                    value={material.productName}
                    readOnly
                    className="border-2 rounded-lg text-sm bg-gray-100 text-gray-600 cursor-not-allowed"
                    style={{ padding: '10px 14px', width: '160px', height: '44px', borderColor: '#e5e7eb' }}
                  />
                </div>
                
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    COMPONENT
                  </label>
                  <input
                    type="text"
                    value={material.componentName}
                    readOnly
                    className="border-2 rounded-lg text-sm bg-gray-100 text-gray-600 cursor-not-allowed"
                    style={{ padding: '10px 14px', width: '160px', height: '44px', borderColor: '#e5e7eb' }}
                  />
                </div>
              </div>
              
              {/* Material Details */}
              <div className="flex flex-wrap items-start gap-6">
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    MATERIAL DESC <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={material.materialDescription}
                    onChange={(e) => handleRawMaterialChange(materialIndex, 'materialDescription', e.target.value)}
                    className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                      errors[`rawMaterial_${materialIndex}_materialDescription`] 
                        ? 'border-red-600' 
                        : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                    }`}
                    style={{ padding: '10px 14px', width: '180px', height: '44px' }}
                    onFocus={(e) => {
                      if (!errors[`rawMaterial_${materialIndex}_materialDescription`]) {
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = '';
                    }}
                    placeholder="e.g., Cotton 200TC"
                    required
                  />
                  {errors[`rawMaterial_${materialIndex}_materialDescription`] && (
                    <span className="text-red-600 text-xs mt-1 font-medium">
                      {errors[`rawMaterial_${materialIndex}_materialDescription`]}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    NET CNS/PC <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={material.netConsumption}
                    onChange={(e) => handleRawMaterialChange(materialIndex, 'netConsumption', e.target.value)}
                    className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                      errors[`rawMaterial_${materialIndex}_netConsumption`] 
                        ? 'border-red-600' 
                        : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                    }`}
                    style={{ padding: '10px 14px', width: '120px', height: '44px' }}
                    onFocus={(e) => {
                      if (!errors[`rawMaterial_${materialIndex}_netConsumption`]) {
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = '';
                    }}
                    placeholder="0.000"
                    required
                  />
                  {errors[`rawMaterial_${materialIndex}_netConsumption`] && (
                    <span className="text-red-600 text-xs mt-1 font-medium">
                      {errors[`rawMaterial_${materialIndex}_netConsumption`]}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    UNIT <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={material.unit}
                    onChange={(e) => handleRawMaterialChange(materialIndex, 'unit', e.target.value)}
                    className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                      errors[`rawMaterial_${materialIndex}_unit`] 
                        ? 'border-red-600' 
                        : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                    }`}
                    style={{ padding: '10px 14px', width: '130px', height: '44px' }}
                    onFocus={(e) => {
                      if (!errors[`rawMaterial_${materialIndex}_unit`]) {
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = '';
                    }}
                    required
                  >
                    <option value="">Select</option>
                    <option value="R METERS">R METERS</option>
                    <option value="CM">CM</option>
                    <option value="Inches">Inches</option>
                    <option value="Meter">Meter</option>
                    <option value="KGS">KGS</option>
                  </select>
                  {errors[`rawMaterial_${materialIndex}_unit`] && (
                    <span className="text-red-600 text-xs mt-1 font-medium">
                      {errors[`rawMaterial_${materialIndex}_unit`]}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Work Orders Section */}
            <div style={{ marginTop: '20px' }}>
              <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
                <h3 className="text-sm font-bold text-gray-800">WORK ORDERS</h3>
                <button
                  type="button"
                  onClick={() => addWorkOrder(materialIndex)}
                  className="border rounded-md cursor-pointer text-xs font-medium transition-all hover:-translate-x-0.5"
                  style={{
                    backgroundColor: '#f3f4f6',
                    borderColor: '#d1d5db',
                    color: '#374151',
                    padding: '6px 12px',
                    height: '32px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e5e7eb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }}
                >
                  + Add
                </button>
              </div>
              
              {material.workOrders.map((workOrder, woIndex) => (
                <div key={woIndex} className="bg-white rounded-lg border border-gray-200" style={{ padding: '16px', marginBottom: '12px' }}>
                  <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
                    <h4 className="text-sm font-semibold text-gray-700">
                      WORK ORDER {woIndex + 1}
                    </h4>
                    {material.workOrders.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeWorkOrder(materialIndex, woIndex)}
                        className="border rounded-md cursor-pointer text-xs font-medium transition-all hover:-translate-x-0.5"
                        style={{
                          backgroundColor: '#f3f4f6',
                          borderColor: '#d1d5db',
                          color: '#374151',
                          padding: '4px 10px',
                          height: '28px'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#e5e7eb';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#f3f4f6';
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  {/* Work Order Fields */}
                  <div className="flex flex-wrap items-start gap-6">
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-2">
                        WORK ORDER <span className="text-red-600">*</span>
                      </label>
                      <select
                        value={workOrder.workOrder}
                        onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'workOrder', e.target.value)}
                        className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                          errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_workOrder`] 
                            ? 'border-red-600' 
                            : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                        }`}
                        style={{ padding: '10px 14px', width: '160px', height: '44px' }}
                        onFocus={(e) => {
                          if (!errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_workOrder`]) {
                            e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                          }
                        }}
                        onBlur={(e) => {
                          e.target.style.boxShadow = '';
                        }}
                        required
                      >
                        <option value="">Select</option>
                        <option value="WEAVING">WEAVING</option>
                        <option value="TUFTING">TUFTING</option>
                        <option value="QUILTING">QUILTING</option>
                        <option value="PRINTING">PRINTING</option>
                        <option value="KNITTING">KNITTING</option>
                        <option value="EMBROIDERY">EMBROIDERY</option>
                        <option value="DYEING">DYEING</option>
                        <option value="BRAIDING">BRAIDING</option>
                        <option value="CARPET">CARPET</option>
                        <option value="CUTTING">CUTTING</option>
                      </select>
                      {errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_workOrder`] && (
                        <span className="text-red-600 text-xs mt-1 font-medium">
                          {errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_workOrder`]}
                        </span>
                      )}
                    </div>
                    
                    {/* WASTAGE and FOR fields - Hidden for KNITTING, DYEING, and CUTTING as they have their own sections */}
                    {workOrder.workOrder !== 'KNITTING' && workOrder.workOrder !== 'DYEING' && (
                      <>
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-2">
                        WASTAGE % <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={workOrder.wastage}
                        onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'wastage', e.target.value)}
                        className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                          errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_wastage`] 
                            ? 'border-red-600' 
                            : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                        }`}
                        style={{ padding: '10px 14px', width: '100px', height: '44px' }}
                        onFocus={(e) => {
                          if (!errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_wastage`]) {
                            e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                          }
                        }}
                        onBlur={(e) => {
                          e.target.style.boxShadow = '';
                        }}
                        placeholder="e.g., 2"
                        required
                      />
                      {errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_wastage`] && (
                        <span className="text-red-600 text-xs mt-1 font-medium">
                          {errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_wastage`]}
                        </span>
                      )}
                    </div>
                    
                        {/* FOR field - Hidden for CUTTING */}
                        {workOrder.workOrder !== 'CUTTING' && (
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-2">
                        FOR <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={workOrder.forField}
                        onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'forField', e.target.value)}
                        className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                          errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_forField`] 
                            ? 'border-red-600' 
                            : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                        }`}
                        style={{ padding: '10px 14px', width: '180px', height: '44px' }}
                        onFocus={(e) => {
                          if (!errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_forField`]) {
                            e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                          }
                        }}
                        onBlur={(e) => {
                          e.target.style.boxShadow = '';
                        }}
                        placeholder="e.g., Front Fabric"
                        required
                      />
                      {errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_forField`] && (
                        <span className="text-red-600 text-xs mt-1 font-medium">
                          {errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_forField`]}
                        </span>
                      )}
                    </div>
                        )}
                      </>
                    )}
                  </div>
                  
                  {/* Conditional Fields based on Work Order Type */}
                  {workOrder.workOrder && (
                    <div className="w-full flex flex-wrap items-start mt-14 pt-6 border-t border-gray-50" style={{ gap: '24px 32px', marginTop: '20px' }}>
                      {/* Machine Type / Specific Type Dropdown */}
                        {(['WEAVING', 'TUFTING', 'KNITTING', 'EMBROIDERY', 'BRAIDING', 'CARPET', 'CUTTING'].includes(workOrder.workOrder)) && (
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">MACHINE TYPE</label>
                            <select
                              value={workOrder.machineType}
                              onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'machineType', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', width: '160px', height: '44px' }}
                              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                            >
                              <option value="">Select</option>
                              {workOrder.workOrder === 'WEAVING' && ['WATER JET', 'AIRJET', 'DOBBY', 'FRAMELOOM', 'PITLOOM', 'JACQUARD', 'JUMBO JACQUARD', 'POWERLOOM', 'SHUTTLELESS', 'PANJA LOOM', 'OTHERS'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                              {workOrder.workOrder === 'TUFTING' && ['COMPUTERISED', 'MULTINEEDLE', 'FOUR NEEDLE/ TABLE TUFTING', 'OTHERS'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                              {workOrder.workOrder === 'KNITTING' && ['CIRCULAR', 'FLATBED', 'CROCHET', 'OTHERS'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                              {workOrder.workOrder === 'EMBROIDERY' && ['AARI/ TERRY EMBROIDERY', 'DORI/ ROPE EMBROIDERY', 'RICE STITCH', 'MULTI THREAD', 'SINGLE THREAD', 'COUCHING', 'PIN TUCKING', 'PLEATING'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                              {workOrder.workOrder === 'BRAIDING' && ['HAND BRAID', 'MACHINE BRAID', 'OTHERS'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                              {workOrder.workOrder === 'CARPET' && ['BROADLOOM', 'HAND TUFTED', 'MACHINE MADE- WAN DE VEILE', 'WALL 2 WALL', 'HAND KNOTTED', 'OTHERS'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                              {workOrder.workOrder === 'CUTTING' && ['CUTTER', 'SCISSOR', 'LASER'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                          </div>
                        )}

                        {/* Other specific type dropdowns */}
                        {workOrder.workOrder === 'QUILTING' && (
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">QUILTING TYPE</label>
                            <select
                              value={workOrder.quiltingType}
                              onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'quiltingType', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', width: '160px', height: '44px' }}
                              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                            >
                              <option value="">Select</option>
                              {['HAND QUILTING', 'MULTINEEDLE', 'MULTINEEDLE+EMBROIDERY', 'SINGLE NEEDLE', 'SCHIFFLEY', 'PESCE SLIDING', 'ULTRASONIC', 'OTHERS'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                          </div>
                        )}

                        {workOrder.workOrder === 'PRINTING' && (
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">PRINTING TYPE</label>
                            <select
                              value={workOrder.printingType}
                              onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'printingType', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', width: '160px', height: '44px' }}
                              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                            >
                              <option value="">Select</option>
                              {['BLOCK PRINT', 'COTTON-DIGITAL PRINT', 'LAMINATION POLYESTER DIGITAL PRINT', 'ROTARY PRINT', 'SCREEN PRINT', 'FLOCKING', 'OTHER'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                          </div>
                        )}

                  {workOrder.workOrder === 'DYEING' && (
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">DYEING TYPE</label>
                            <select
                              value={workOrder.dyeingType}
                              onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'dyeingType', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', width: '160px', height: '44px' }}
                              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                            >
                              <option value="">Select</option>
                              {['ARTIFICIAL FABRIC', 'ARTIFICIAL YARN', 'COTTON BATHMAT/ BATHRUG', 'NATURAL FABRIC', 'NATURAL YARN', 'POLYESTER BATHMAT', 'STONEWASH', 'ENZYME WASH', 'ACID WASH'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                      </div>
                        )}

                        {/* DESIGN (Input) - Applicable to many */}
                        {['WEAVING', 'TUFTING', 'QUILTING', 'PRINTING', 'KNITTING', 'EMBROIDERY', 'BRAIDING', 'CARPET'].includes(workOrder.workOrder) && (
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">DESIGN</label>
                          <input
                            type="text"
                              value={workOrder.design}
                              onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'design', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', width: '160px', height: '44px' }}
                              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                              placeholder="e.g. TWILL WEAVE"
                            />
                          </div>
                        )}

                        {/* RECEIVED COLOR REFERENCE for DYEING */}
                        {workOrder.workOrder === 'DYEING' && (
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">RECEIVED COLOR REFERENCE</label>
                            <select
                              value={workOrder.receivedColorReference}
                              onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'receivedColorReference', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', width: '200px', height: '44px' }}
                              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                            >
                              <option value="">Select</option>
                              {['PANTONE', 'ARS', 'CSI', 'PMS'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>
                        )}
                        
                        {/* REFERENCE TYPE for DYEING */}
                        {workOrder.workOrder === 'DYEING' && (
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">REFERENCE TYPE</label>
                            <select
                              value={workOrder.referenceType}
                              onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'referenceType', e.target.value)}
                              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                              style={{ padding: '10px 14px', width: '200px', height: '44px' }}
                              onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                              onBlur={(e) => e.target.style.boxShadow = ''}
                            >
                              <option value="">Select</option>
                              {['TPG', 'TCX', 'COATED', 'UNCOAT'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                          </div>
                        )}
                        
                        {/* Image Upload - Hidden for CUTTING */}
                        {workOrder.workOrder !== 'CUTTING' && (
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            {workOrder.workOrder === 'DYEING' ? 'REFERENCE IMAGE' : 'IMAGE REF'}
                          </label>
                          <div className="flex items-center gap-2">
                          <input
                              type="file"
                              onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'imageRef', e.target.files[0])}
                              className="hidden"
                              id={`file-${materialIndex}-${woIndex}`}
                            />
                            <label
                              htmlFor={`file-${materialIndex}-${woIndex}`}
                              className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb]"
                              style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                              </svg>
                              <span className="truncate">{workOrder.imageRef ? 'UPLOADED' : 'UPLOAD'}</span>
                            </label>
                          </div>
                        </div>
                        )}
                        
                        {/* Specific Fields for WEAVING */}
                        {workOrder.workOrder === 'WEAVING' && (
                          <>
                            {/* REED and PICK Fields */}
                            <div className="w-full mt-4">
                              <div className="flex flex-wrap items-start gap-4" style={{ marginBottom: '24px' }}>
                                <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">REED</label>
                                  <input
                                    type="text"
                                    value={workOrder.reed || ''}
                                    onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'reed', e.target.value)}
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', width: '120px', height: '44px' }}
                                    onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                                    onBlur={(e) => e.target.style.boxShadow = ''}
                                    placeholder="Enter reed"
                                  />
                                </div>
                                <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">PICK</label>
                                  <input
                                    type="text"
                                    value={workOrder.pick || ''}
                                    onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'pick', e.target.value)}
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', width: '120px', height: '44px' }}
                                    onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                                    onBlur={(e) => e.target.style.boxShadow = ''}
                                    placeholder="Enter pick"
                                  />
                                </div>
                              </div>
                              
                              {/* WARP & WEFT Radio Buttons Section */}
                              <div className="w-full">
                              <div className="flex flex-wrap items-start gap-6">
                                <div className="flex items-center gap-4" style={{ minWidth: '200px' }}>
                                  <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={workOrder.warp || false}
                                      onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'warp', e.target.checked)}
                                      className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                    />
                                    <span className="text-sm font-semibold text-gray-700">WARP</span>
                                  </label>
                                  {workOrder.warp && (
                                    <input
                                      type="number"
                                      step="0.001"
                                      value={workOrder.ratioWarp || ''}
                                      onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'ratioWarp', e.target.value)}
                                      className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                      style={{ padding: '10px 14px', width: '100px', height: '44px' }}
                                      onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                                      onBlur={(e) => e.target.style.boxShadow = ''}
                                      placeholder="0.4"
                                    />
                                  )}
                                </div>
                                <div className="flex items-center gap-4" style={{ minWidth: '200px' }}>
                                  <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={workOrder.weft || false}
                                      onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'weft', e.target.checked)}
                                      className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                    />
                                    <span className="text-sm font-semibold text-gray-700">WEFT</span>
                                  </label>
                                  {workOrder.weft && (
                                    <input
                                      type="number"
                                      step="0.001"
                                      value={workOrder.ratioWeft || ''}
                                      onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'ratioWeft', e.target.value)}
                                      className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                      style={{ padding: '10px 14px', width: '100px', height: '44px' }}
                                      onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                                      onBlur={(e) => e.target.style.boxShadow = ''}
                                      placeholder="0.25"
                                    />
                                  )}
                                  </div>
                                </div>
                              </div>
                              {/* RATIO WEIGHT/%AGE Row */}
                              <div className="flex items-center gap-4" style={{ marginTop: '24px' }}>
                                <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">RATIO WEIGHT/%AGE</label>
                                  <input
                                    type="text"
                                    value={workOrder.ratioWeightWarp || ''}
                                    onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'ratioWeightWarp', e.target.value)}
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', height: '44px' }}
                                  />
                                </div>
                              </div>
                              {/* WASTAGE Row */}
                              <div className="flex items-center gap-4" style={{ marginTop: '24px' }}>
                                <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">WASTAGE</label>
                                  <input
                                    type="text"
                                    value={workOrder.wastage || ''}
                                    onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'wastage', e.target.value)}
                            className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                                      errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_wastage`] 
                                ? 'border-red-600' 
                                : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                            }`}
                                    style={{ padding: '10px 14px', width: '120px', height: '44px' }}
                            onFocus={(e) => {
                                      if (!errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_wastage`]) {
                                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                              }
                            }}
                                    onBlur={(e) => e.target.style.boxShadow = ''}
                                    placeholder="%AGE"
                                  />
                                  {errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_wastage`] && (
                            <span className="text-red-600 text-xs mt-1 font-medium">
                                      {errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_wastage`]}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">FOR-SECTION</label>
                                  <input
                                    type="text"
                                    value={workOrder.forSection || ''}
                                    onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'forSection', e.target.value)}
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', width: '150px', height: '44px' }}
                                    placeholder="FOR-SECTION"
                                  />
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        {/* Specific Fields for KNITTING */}
                        {workOrder.workOrder === 'KNITTING' && (
                          <div className="w-full mt-4">
                            <div className="flex flex-wrap items-start gap-6">
                              <div className="flex items-center gap-4" style={{ minWidth: '200px' }}>
                                <label className="flex items-center gap-3 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={workOrder.wales || false}
                                    onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'wales', e.target.checked)}
                                    className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                  />
                                  <span className="text-sm font-semibold text-gray-700">WALES:</span>
                          </label>
                                {workOrder.wales && (
                                  <input
                                    type="number"
                                    step="0.001"
                                    value={workOrder.ratioWales || ''}
                                    onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'ratioWales', e.target.value)}
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', width: '100px', height: '44px' }}
                                    onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                                    onBlur={(e) => e.target.style.boxShadow = ''}
                                    placeholder="0.4"
                                  />
                                )}
                              </div>
                              <div className="flex items-center gap-4" style={{ minWidth: '200px' }}>
                                <label className="flex items-center gap-3 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={workOrder.courses || false}
                                    onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'courses', e.target.checked)}
                                    className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                  />
                                  <span className="text-sm font-semibold text-gray-700">COURSES:</span>
                                </label>
                                {workOrder.courses && (
                                  <input
                                    type="number"
                                    step="0.001"
                                    value={workOrder.ratioCourses || ''}
                                    onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'ratioCourses', e.target.value)}
                                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                    style={{ padding: '10px 14px', width: '100px', height: '44px' }}
                                    onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                                    onBlur={(e) => e.target.style.boxShadow = ''}
                                    placeholder="0.25"
                                  />
                                )}
                              </div>
                            </div>
                            {/* RATIO WEIGHT/%AGE Row */}
                            <div className="flex items-center gap-4" style={{ marginTop: '24px' }}>
                              <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700 mb-2">RATIO WEIGHT/%AGE</label>
                                <input
                                  type="text"
                                  value={workOrder.ratioWeightWales || ''}
                                  onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'ratioWeightWales', e.target.value)}
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', height: '44px' }}
                                />
                              </div>
                            </div>
                            {/* WASTAGE Row */}
                            <div className="flex items-center gap-4" style={{ marginTop: '24px' }}>
                              <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700 mb-2">WASTAGE</label>
                                <input
                                  type="text"
                                  value={workOrder.wastage || ''}
                                  onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'wastage', e.target.value)}
                            className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                                    errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_wastage`] 
                                ? 'border-red-600' 
                                : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                            }`}
                                  style={{ padding: '10px 14px', width: '120px', height: '44px' }}
                            onFocus={(e) => {
                                    if (!errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_wastage`]) {
                                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                              }
                            }}
                                  onBlur={(e) => e.target.style.boxShadow = ''}
                                  placeholder="%AGE"
                                />
                                {errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_wastage`] && (
                            <span className="text-red-600 text-xs mt-1 font-medium">
                                    {errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_wastage`]}
                            </span>
                          )}
                        </div>
                              <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700 mb-2">FOR-SECTION</label>
                                <input
                                  type="text"
                                  value={workOrder.forSection || ''}
                                  onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'forSection', e.target.value)}
                                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                  style={{ padding: '10px 14px', width: '150px', height: '44px' }}
                                  placeholder="FOR-SECTION"
                                />
                              </div>
                      </div>
                    </div>
                  )}
                  
                        {/* Specific Fields for DYEING Shrinkage */}
                        {workOrder.workOrder === 'DYEING' && (
                          <div className="w-full mt-4">
                            <div className="mb-4">
                              <h5 className="text-sm font-bold text-gray-800 mb-3">SHRINKAGE</h5>
                              <div className="grid grid-cols-2 gap-6 mb-6">
                                <div className="flex flex-col">
                                  <label className="flex items-center gap-3 cursor-pointer mb-2">
                                    <input
                                      type="checkbox"
                                      checked={workOrder.shrinkageWidth || false}
                                      onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'shrinkageWidth', e.target.checked)}
                                      className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                    />
                                    <span className="text-sm font-semibold text-gray-700">WIDTH</span>
                                  </label>
                                  {workOrder.shrinkageWidth && (
                                    <input
                                      type="text"
                                      value={workOrder.shrinkageWidthPercent || ''}
                                      onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'shrinkageWidthPercent', e.target.value)}
                                      className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                      style={{ padding: '10px 14px', height: '44px' }}
                                      onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                                      onBlur={(e) => e.target.style.boxShadow = ''}
                                      placeholder="3%"
                                    />
                                  )}
                      </div>
                        <div className="flex flex-col">
                                  <label className="flex items-center gap-3 cursor-pointer mb-2">
                                    <input
                                      type="checkbox"
                                      checked={workOrder.shrinkageLength || false}
                                      onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'shrinkageLength', e.target.checked)}
                                      className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                    />
                                    <span className="text-sm font-semibold text-gray-700">LENGTH</span>
                          </label>
                                  {workOrder.shrinkageLength && (
                          <input
                            type="text"
                                      value={workOrder.shrinkageLengthPercent || ''}
                                      onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'shrinkageLengthPercent', e.target.value)}
                                      className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                      style={{ padding: '10px 14px', height: '44px' }}
                                      onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                                      onBlur={(e) => e.target.style.boxShadow = ''}
                                      placeholder="1%"
                                    />
                                  )}
                                </div>
                              </div>
                              
                              {/* RATIO %AGE Section - Always Visible */}
                              <div className="mb-6" style={{ marginTop: '24px' }}>
                                <h5 className="text-sm font-bold text-gray-800 mb-3">RATIO %AGE</h5>
                                <div className="flex items-center gap-4">
                                  <div className="flex flex-col">
                                    <label className="text-xs font-semibold text-gray-600 mb-1">RATIO %AGE</label>
                                    <input
                                      type="number"
                                      step="0.001"
                                      value={workOrder.ratioWidth || workOrder.ratioLength || ''}
                                      onChange={(e) => {
                                        if (workOrder.shrinkageWidth && workOrder.shrinkageLength) {
                                          // If both selected, update both
                                          handleWorkOrderChange(materialIndex, woIndex, 'ratioWidth', e.target.value);
                                          handleWorkOrderChange(materialIndex, woIndex, 'ratioLength', e.target.value);
                                        } else if (workOrder.shrinkageWidth) {
                                          handleWorkOrderChange(materialIndex, woIndex, 'ratioWidth', e.target.value);
                                        } else if (workOrder.shrinkageLength) {
                                          handleWorkOrderChange(materialIndex, woIndex, 'ratioLength', e.target.value);
                                        }
                                      }}
                                      className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                      style={{ padding: '10px 14px', width: '150px', height: '44px' }}
                                      onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                                      onBlur={(e) => e.target.style.boxShadow = ''}
                                      placeholder="RATIO %AGE"
                                    />
                                  </div>
                                  <div className="flex flex-col">
                                    <label className="text-xs font-semibold text-gray-600 mb-1">FOR-SECTION</label>
                                    <input
                                      type="text"
                                      value={workOrder.forSection || ''}
                                      onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'forSection', e.target.value)}
                                      className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                      style={{ padding: '10px 14px', width: '150px', height: '44px' }}
                                      onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                                      onBlur={(e) => e.target.style.boxShadow = ''}
                                      placeholder="FOR-SECTION"
                                    />
                                  </div>
                                </div>
                              </div>
                              
                              {/* WASTAGE Row - Separate */}
                              <div className="flex items-center gap-4" style={{ marginTop: '24px' }}>
                                <div className="flex flex-col">
                                  <label className="text-sm font-semibold text-gray-700 mb-2">WASTAGE</label>
                                  <input
                                    type="text"
                                    value={workOrder.wastage || ''}
                                    onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'wastage', e.target.value)}
                            className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                                      errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_wastage`] 
                                ? 'border-red-600' 
                                : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                            }`}
                            style={{ padding: '10px 14px', width: '120px', height: '44px' }}
                            onFocus={(e) => {
                                      if (!errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_wastage`]) {
                                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                              }
                            }}
                                    onBlur={(e) => e.target.style.boxShadow = ''}
                                    placeholder="%AGE"
                                  />
                                  {errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_wastage`] && (
                            <span className="text-red-600 text-xs mt-1 font-medium">
                                      {errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_wastage`]}
                            </span>
                          )}
                        </div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Specific Fields for TUFTING & CARPET */}
                        {(['TUFTING', 'CARPET'].includes(workOrder.workOrder)) && (
                          <>
                        <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">PILE HEIGHT</label>
                          <input
                            type="text"
                                value={workOrder.pileHeight}
                                onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'pileHeight', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', width: '120px', height: '44px' }}
                                onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                                onBlur={(e) => e.target.style.boxShadow = ''}
                              />
                        </div>
                            <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">TPI</label>
                              <input
                                type="text"
                                value={workOrder.tpi}
                                onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'tpi', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', width: '100px', height: '44px' }}
                                onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                                onBlur={(e) => e.target.style.boxShadow = ''}
                              />
                            </div>
                          </>
                        )}

                        {workOrder.workOrder === 'CUTTING' && (
                          <>
                        <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">CUT TYPE</label>
                          <select
                                value={workOrder.cutType}
                                onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'cutType', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', width: '140px', height: '44px' }}
                                onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                                onBlur={(e) => e.target.style.boxShadow = ''}
                          >
                            <option value="">Select</option>
                                {['LAYERED', 'PANEL'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        </div>
                          <div className="flex flex-col">
                              <label className="text-sm font-semibold text-gray-700 mb-2">CUT SIZE (LENGTH)</label>
                            <input
                              type="text"
                                value={workOrder.cutSize}
                                onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'cutSize', e.target.value)}
                                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                                style={{ padding: '10px 14px', width: '140px', height: '44px' }}
                                onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                                onBlur={(e) => e.target.style.boxShadow = ''}
                              />
                          </div>
                          </>
                        )}

                        {/* Common Approval Against */}
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL AGAINST</label>
                          <select
                            value={workOrder.approvalAgainst}
                            onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'approvalAgainst', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', width: '180px', height: '44px' }}
                            onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                            onBlur={(e) => e.target.style.boxShadow = ''}
                          >
                            <option value="">Select</option>
                            <option value="BUYER'S SAMPLE">BUYER'S SAMPLE</option>
                            <option value="INITIAL SAMPLE">INITIAL SAMPLE</option>
                            <option value="PP SAMPLE">PP SAMPLE</option>
                          </select>
                        </div>

                      {/* Remarks */}
                      <div className="w-full flex flex-col mt-8">
                          <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                          <textarea
                            value={workOrder.remarks}
                            onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'remarks', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '12px 16px', width: '100%' }}
                            onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                            onBlur={(e) => e.target.style.boxShadow = ''}
                            rows="2"
                          ></textarea>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Helper functions for Step 5 input styling
  const getInputStyle = (errorKey) => {
    return `border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
      errors[errorKey] 
        ? 'border-red-600' 
        : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
    }`;
  };

  const inputFocusHandler = (e, errorKey) => {
    if (!errors[errorKey]) {
      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
    }
  };

  const inputBlurHandler = (e) => {
    e.target.style.boxShadow = '';
  };

  const renderStep5 = () => (
    <div className="w-full">
      {/* Header with proper spacing */}
      <div style={{ marginBottom: '28px' }}>
        <div className="flex items-center justify-between">
          <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">PART-5 PACKAGING</h2>
        <p className="text-sm text-gray-600">Configure packaging specifications and materials</p>
          </div>
          <button
            type="button"
            onClick={addPackagingMaterial}
            className="border rounded-md cursor-pointer text-sm font-medium transition-all hover:-translate-x-0.5"
            style={{
              backgroundColor: '#f3f4f6',
              borderColor: '#d1d5db',
              color: '#374151',
              padding: '10px 16px',
              height: '42px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e5e7eb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
          >
            + Add Material
          </button>
        </div>
      </div>

      {/* Header Configuration */}
      <div className="bg-gray-50 rounded-xl border border-gray-200" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 className="text-sm font-bold text-gray-800" style={{ marginBottom: '16px' }}>PACKAGING HEADER</h3>
        
        <div className="flex flex-wrap items-start gap-4">
          {/* PRODUCT */}
          <div className="flex flex-col" style={{ width: '250px' }}>
            <label className="text-sm font-semibold text-gray-700 mb-2">PRODUCT</label>
            <input
              type="text"
              value={formData.packaging.productSelection}
              onChange={(e) => handlePackagingChange('productSelection', e.target.value)}
              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
              style={{ padding: '10px 14px', height: '44px' }}
              placeholder="e.g., COMFORTER+PILLOW+BAG"
            />
          </div>

          {/* TYPE */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
            <select
              value={formData.packaging.type}
              onChange={(e) => handlePackagingChange('type', e.target.value)}
              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
              style={{ padding: '10px 14px', width: '200px', height: '44px' }}
            >
              <option value="STANDARD">STANDARD</option>
              <option value="ASSORTED">ASSORTED (LINK IPC#)</option>
            </select>
          </div>

          {/* CASEPACK QTY */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-2">CASEPACK QTY</label>
            <input
              type="number"
              value={formData.packaging.casepackQty}
              onChange={(e) => handlePackagingChange('casepackQty', e.target.value)}
              className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                style={{ padding: '10px 14px', width: '120px', height: '44px' }}
              placeholder="10"
              />
            </div>

          {/* IPC Link for Assorted */}
        {formData.packaging.type === 'ASSORTED' && (
              <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">LINK IPC#</label>
                <input
                  type="text"
                  value={formData.packaging.assortedSkuLink}
                  onChange={(e) => handlePackagingChange('assortedSkuLink', e.target.value)}
                className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                style={{ padding: '10px 14px', width: '150px', height: '44px' }}
                placeholder="IPC-123"
              />
          </div>
        )}
      </div>
        </div>

      {/* Packaging Materials */}
      <div>
        {formData.packaging.materials && formData.packaging.materials.length > 0 ? formData.packaging.materials.map((material, materialIndex) => (
          <div key={materialIndex} className="bg-white rounded-xl border-2 border-gray-200" style={{ padding: '24px', marginBottom: '24px' }}>
            {/* Material Header with Remove Button */}
            <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
              <h4 className="text-sm font-bold text-gray-800 underline underline-offset-4">MATERIAL {materialIndex + 1}</h4>
              {formData.packaging.materials.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePackagingMaterial(materialIndex)}
                  className="border rounded-md cursor-pointer text-xs font-medium transition-all hover:-translate-x-0.5"
                  style={{
                    backgroundColor: '#fee2e2',
                    borderColor: '#fca5a5',
                    color: '#b91c1c',
                    padding: '4px 10px',
                    height: '28px'
                  }}
                >
                  Remove
                </button>
              )}
            </div>

            {/* Basic Info: Components, Material Description, Consumption, Unit, Work Order, Placement */}
            <div style={{ marginBottom: '24px' }}>
              <div className="flex flex-wrap items-start gap-4">
              <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">COMPONENTS</label>
                <input
                  type="text"
                    value={material.components}
                    onChange={(e) => handlePackagingMaterialChange(materialIndex, 'components', e.target.value)}
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                    style={{ padding: '10px 14px', width: '150px', height: '44px' }}
                    placeholder="e.g., N/A"
                  />
              </div>

              <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL DESCRIPTION</label>
                <input
                  type="text"
                    value={material.product}
                    onChange={(e) => handlePackagingMaterialChange(materialIndex, 'product', e.target.value)}
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                    style={{ padding: '10px 14px', width: '180px', height: '44px' }}
                    placeholder="e.g., Corrugated Box"
                />
              </div>

              <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">CONS. PER PC</label>
                <input
                  type="number"
                    step="0.01"
                  value={material.netConsumptionPerPc}
                  onChange={(e) => handlePackagingMaterialChange(materialIndex, 'netConsumptionPerPc', e.target.value)}
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                    style={{ padding: '10px 14px', width: '110px', height: '44px' }}
                    placeholder="0.5"
                  />
            </div>

              <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">UNIT</label>
                <select
                  value={material.unit}
                  onChange={(e) => handlePackagingMaterialChange(materialIndex, 'unit', e.target.value)}
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                    style={{ padding: '10px 14px', width: '100px', height: '44px' }}
                  >
                    <option value="Pc">Pc</option>
                    <option value="Set">Set</option>
                    <option value="Roll">Roll</option>
                    <option value="Kgs">Kgs</option>
                </select>
              </div>

              <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">WORK ORDER</label>
                <input
                    type="text"
                    value={material.workOrders[0].workOrder}
                    onChange={(e) => handlePackagingWorkOrderChange(materialIndex, 0, 'workOrder', e.target.value)}
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                    style={{ padding: '10px 14px', width: '150px', height: '44px' }}
                    placeholder="PACKAGING"
                  />
              </div>

                <div className="flex flex-col" style={{ flexGrow: 1, minWidth: '250px' }}>
                <label className="text-sm font-semibold text-gray-700 mb-2">PLACEMENT</label>
                <input
                  type="text"
                  value={material.placement}
                  onChange={(e) => handlePackagingMaterialChange(materialIndex, 'placement', e.target.value)}
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                    style={{ padding: '10px 14px', height: '44px' }}
                    placeholder="1 ON THE CENTER OF THE LARGER SIDE..."
                />
              </div>
            </div>

              {/* SIZE Row */}
              <div className="flex flex-wrap items-start gap-4 mt-8" style={{marginTop: '20px'}}>
                  <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">WIDTH</label>
                    <input
                      type="number"
                      value={material.size.width}
                      onChange={(e) => handlePackagingMaterialSizeChange(materialIndex, 'width', e.target.value)}
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                    style={{ padding: '10px 14px', width: '100px', height: '44px' }}
                      placeholder="52"
                    />
                  </div>

                  <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH</label>
                    <input
                      type="number"
                      value={material.size.length}
                      onChange={(e) => handlePackagingMaterialSizeChange(materialIndex, 'length', e.target.value)}
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                    style={{ padding: '10px 14px', width: '100px', height: '44px' }}
                    placeholder="48"
                  />
                  </div>

                  <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">HEIGHT</label>
                    <input
                      type="number"
                      value={material.size.height}
                      onChange={(e) => handlePackagingMaterialSizeChange(materialIndex, 'height', e.target.value)}
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                    style={{ padding: '10px 14px', width: '100px', height: '44px' }}
                    placeholder="52"
                  />
                  </div>

                  <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">UNIT</label>
                    <select
                      value={material.size.unit}
                      onChange={(e) => handlePackagingMaterialSizeChange(materialIndex, 'unit', e.target.value)}
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                    style={{ padding: '10px 14px', width: '120px', height: '44px' }}
                    >
                      <option value="CMS">CMS</option>
                      <option value="INCHES">INCHES</option>
                      <option value="MM">MM</option>
                    </select>
                  </div>
                </div>
              </div>

            {/* CATEGORY SELECTOR & CONDITIONAL FIELDS */}
            <div className="w-full mt-6 pt-6 border-t border-gray-100">
              <div className="flex flex-col" style={{ width: '280px', marginBottom: '24px' }}>
                <label className="text-sm font-bold text-gray-800 mb-2">PACKAGING MATERIAL TYPE</label>
                <select
                  value={material.packagingMaterialType || ''}
                  onChange={(e) => handlePackagingMaterialChange(materialIndex, 'packagingMaterialType', e.target.value)}
                  className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                  style={{ padding: '10px 14px', height: '44px' }}
                >
                  <option value="">Select Type</option>
                  <option value="CARTONS/CORRUGATED BOX">CARTONS/CORRUGATED BOX</option>
                  <option value="PACKAGING ACCESSORIES">PACKAGING ACCESSORIES</option>
                  <option value="TAPE">TAPE</option>
                  <option value="POLYBAG">POLYBAG</option>
                  <option value="POLY BAG WITH FLAP">POLY BAG WITH FLAP</option>
                  <option value="POLYSHEET">POLYSHEET</option>
                  <option value="BALE WRAP">BALE WRAP</option>
                  <option value="OTHER">OTHER</option>
                </select>
              </div>

              {material.packagingMaterialType && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-6">
                  {/* Specific Fields for CARTONS/CORRUGATED BOX */}
                  {material.packagingMaterialType === 'CARTONS/CORRUGATED BOX' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2"># OF PLYS</label>
                        <input
                          type="text"
                          value={material.noOfPlys || ''}
                          onChange={(e) => handlePackagingMaterialChange(materialIndex, 'noOfPlys', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="5 PLY/7 PLY"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">JOINT TYPE</label>
                        <input
                          type="text"
                          value={material.jointType || ''}
                          onChange={(e) => handlePackagingMaterialChange(materialIndex, 'jointType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="STAPLE/BINDED"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">BURSTING STRENGTH</label>
                        <input
                          type="text"
                          value={material.burstingStrength || ''}
                          onChange={(e) => handlePackagingMaterialChange(materialIndex, 'burstingStrength', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="175 LBS"
                        />
                      </div>
                    </>
                  )}

                  {/* Specific Fields for POLY BAG WITH FLAP */}
                  {material.packagingMaterialType === 'POLY BAG WITH FLAP' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">GUAGE</label>
                        <input
                          type="text"
                          value={material.guage || ''}
                          onChange={(e) => handlePackagingMaterialChange(materialIndex, 'guage', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="200"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">GUMMING QUALITY</label>
                        <input
                          type="text"
                          value={material.gummingQuality || ''}
                          onChange={(e) => handlePackagingMaterialChange(materialIndex, 'gummingQuality', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="High/Standard"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">PUNCH HOLES</label>
                        <input
                          type="text"
                          value={material.punchHoles || ''}
                          onChange={(e) => handlePackagingMaterialChange(materialIndex, 'punchHoles', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 2 holes"
                        />
                      </div>
                    </>
                  )}

                  {/* Specific Fields for POLY SHEET / BALE WRAP */}
                  {(material.packagingMaterialType === 'POLYSHEET' || material.packagingMaterialType === 'BALE WRAP') && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">GUAGE/GSM</label>
                        <input
                          type="text"
                          value={material.guageGsm || ''}
                          onChange={(e) => handlePackagingMaterialChange(materialIndex, 'guageGsm', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="200"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">ROLL WIDTH</label>
                        <div className="flex items-center gap-0 border-2 border-[#e5e7eb] rounded-lg bg-white overflow-hidden focus-within:border-indigo-500 transition-all" style={{ height: '44px' }}>
                          <input
                            type="text"
                            value={material.rollWidth || ''}
                            onChange={(e) => handlePackagingMaterialChange(materialIndex, 'rollWidth', e.target.value)}
                            className="text-sm bg-transparent text-gray-900 focus:outline-none border-r border-gray-200"
                            style={{ padding: '10px 14px', width: '80px' }}
                            placeholder="60"
                          />
                          <select
                            value={material.rollWidthUnit || ''}
                            onChange={(e) => handlePackagingMaterialChange(materialIndex, 'rollWidthUnit', e.target.value)}
                            className="text-sm bg-transparent text-gray-900 focus:outline-none flex-grow"
                            style={{ padding: '0 10px', height: '100%' }}
                          >
                            <option value="INCHES">INCHES</option>
                            <option value="CMS">CMS</option>
                            <option value="MM">MM</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Specific Fields for TAPE */}
                  {material.packagingMaterialType === 'TAPE' && (
                    <>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">GUAGE</label>
                        <input
                          type="text"
                          value={material.guage || ''}
                          onChange={(e) => handlePackagingMaterialChange(materialIndex, 'guage', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="200"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">GUMMING QUALITY</label>
                        <input
                          type="text"
                          value={material.gummingQuality || ''}
                          onChange={(e) => handlePackagingMaterialChange(materialIndex, 'gummingQuality', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Strong/Standard"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">WIDTH</label>
                        <div className="flex items-center gap-0 border-2 border-[#e5e7eb] rounded-lg bg-white overflow-hidden focus-within:border-indigo-500 transition-all" style={{ height: '44px' }}>
                          <input
                            type="text"
                            value={material.tapeWidth || ''}
                            onChange={(e) => handlePackagingMaterialChange(materialIndex, 'tapeWidth', e.target.value)}
                            className="text-sm bg-transparent text-gray-900 focus:outline-none border-r border-gray-200"
                            style={{ padding: '10px 14px', width: '80px' }}
                            placeholder="3"
                          />
                          <select
                            value={material.tapeWidthUnit || ''}
                            onChange={(e) => handlePackagingMaterialChange(materialIndex, 'tapeWidthUnit', e.target.value)}
                            className="text-sm bg-transparent text-gray-900 focus:outline-none flex-grow"
                            style={{ padding: '0 10px', height: '100%' }}
                          >
                            <option value="INCHES">INCHES</option>
                            <option value="CMS">CMS</option>
                            <option value="MM">MM</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {/* PRINTING REF with UPLOAD for POLY BAG WITH FLAP and TAPE */}
                  {(material.packagingMaterialType === 'POLY BAG WITH FLAP' || material.packagingMaterialType === 'TAPE') && (
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-2">PRINTING REF</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          onChange={(e) => handlePackagingMaterialChange(materialIndex, 'printingRef', e.target.files[0])}
                          className="hidden"
                          id={`pkg-file-${materialIndex}`}
                        />
                        <label
                          htmlFor={`pkg-file-${materialIndex}`}
                          className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb] flex-shrink-0"
                          style={{ padding: '10px 14px', height: '44px', width: '110px' }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          <span className="truncate">{material.printingRef ? 'DONE' : 'UPLOAD'}</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Dimensions Field for CARTONS/CORRUGATED BOX */}
                  {material.packagingMaterialType === 'CARTONS/CORRUGATED BOX' && (
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                      <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">DIMENSIONS (LXWXH)</label>
                        <input
                          type="text"
                          value={material.size.width || ''}
                          onChange={(e) => handlePackagingMaterialSizeChange(materialIndex, 'width', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="L x W x H"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">UNIT</label>
                        <select
                          value={material.size.unit || ''}
                          onChange={(e) => handlePackagingMaterialSizeChange(materialIndex, 'unit', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px', width: '120px' }}
                        >
                          <option value="CMS">CMS</option>
                          <option value="INCHES">INCHES</option>
                          <option value="MM">MM</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Dimensions Field for POLY BAG WITH FLAP */}
                  {material.packagingMaterialType === 'POLY BAG WITH FLAP' && (
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                      <div className="flex flex-col flex-1">
                        <label className="text-sm font-semibold text-gray-700 mb-2">DIMENSIONS (WXL + FLAP)</label>
                        <input
                          type="text"
                          value={material.size.width || ''}
                          onChange={(e) => handlePackagingMaterialSizeChange(materialIndex, 'width', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="W x L + FLAP"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">UNIT</label>
                        <select
                          value={material.size.unit || ''}
                          onChange={(e) => handlePackagingMaterialSizeChange(materialIndex, 'unit', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px', width: '120px' }}
                        >
                          <option value="CMS">CMS</option>
                          <option value="INCHES">INCHES</option>
                          <option value="MM">MM</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Surplus & For Section - For all types */}
                  <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                    <div className="flex flex-col flex-1">
                      <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS</label>
                      <input
                        type="text"
                        value={material.surplus || ''}
                        onChange={(e) => handlePackagingMaterialChange(materialIndex, 'surplus', e.target.value)}
                        className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                        style={{ padding: '10px 14px', height: '44px' }}
                        placeholder="%AGE"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-2">FOR-SECTION</label>
                      <input
                        type="text"
                        value={material.surplusForSection || ''}
                        onChange={(e) => handlePackagingMaterialChange(materialIndex, 'surplusForSection', e.target.value)}
                        className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                        style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                        placeholder="FOR"
                      />
                    </div>
                  </div>

                  {/* Approval Against - For all types */}
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL AGAINST</label>
                    <input
                      type="text"
                      value={material.approvalAgainst || ''}
                      onChange={(e) => handlePackagingMaterialChange(materialIndex, 'approvalAgainst', e.target.value)}
                      className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                      style={{ padding: '10px 14px', height: '44px' }}
                      placeholder="BUYER'S/INITIAL/PP SAMPLE"
                    />
                  </div>

                  {/* Remarks - For all types */}
                  <div className="col-span-full flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                    <textarea
                      value={material.remarks || ''}
                      onChange={(e) => handlePackagingMaterialChange(materialIndex, 'remarks', e.target.value)}
                      className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                      style={{ padding: '10px 14px', width: '100%' }}
                      rows="2"
                      placeholder="Additional notes..."
                    ></textarea>
                  </div>
                </div>
              )}
            </div>
          </div>
        )) : (
          <div className="text-center text-gray-500 py-8">
            No packaging materials added yet. Click "+ Add Material" to add one.
          </div>
        )}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="w-full">
      {/* Header with proper spacing */}
      <div style={{ marginBottom: '28px' }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">PART-4 ARTWORK & LABELING</h2>
            <p className="text-sm text-gray-600">Artwork & packaging materials</p>
          </div>
          <button
            type="button"
            onClick={addArtworkMaterial}
            className="border rounded-md cursor-pointer text-sm font-medium transition-all hover:-translate-x-0.5"
            style={{
              backgroundColor: '#f3f4f6',
              borderColor: '#d1d5db',
              color: '#374151',
              padding: '10px 16px',
              height: '42px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e5e7eb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
          >
            + Add Material
          </button>
        </div>
      </div>
      
      {/* Artwork Materials */}
      <div>
        {formData.artworkMaterials && formData.artworkMaterials.length > 0 ? formData.artworkMaterials.map((material, materialIndex) => (
          <div key={materialIndex} className="bg-gray-50 rounded-xl border border-gray-200" style={{ padding: '24px', marginBottom: '24px' }}>
            {/* Material Header with Remove Button */}
            <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
              <h4 className="text-sm font-bold text-gray-700">MATERIAL {materialIndex + 1}</h4>
              {formData.artworkMaterials && formData.artworkMaterials.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArtworkMaterial(materialIndex)}
                  className="border rounded-md cursor-pointer text-xs font-medium transition-all hover:-translate-x-0.5"
                  style={{
                    backgroundColor: '#f3f4f6',
                    borderColor: '#d1d5db',
                    color: '#374151',
                    padding: '4px 10px',
                    height: '28px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e5e7eb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }}
                >
                  Remove
                </button>
              )}
            </div>

            {/* Row 1: Components, Material Desc, Net CNS, Unit */}
            <div style={{ marginBottom: '24px' }}>
              <div className="flex flex-wrap items-start gap-3">
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    COMPONENTS <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={material.components || ''}
                    onChange={(e) => handleArtworkMaterialChange(materialIndex, 'components', e.target.value)}
                    className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                      errors[`artworkMaterial_${materialIndex}_components`] 
                        ? 'border-red-600' 
                        : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                    }`}
                    style={{ padding: '10px 14px', width: '180px', height: '44px' }}
                    onFocus={(e) => {
                      if (!errors[`artworkMaterial_${materialIndex}_components`]) {
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = '';
                    }}
                    placeholder="e.g., COMFORTER"
                    required
                  />
                  {errors[`artworkMaterial_${materialIndex}_components`] && (
                    <span className="text-red-600 text-xs mt-1 font-medium">
                      {errors[`artworkMaterial_${materialIndex}_components`]}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    MATERIAL DESC <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={material.materialDescription}
                    onChange={(e) => handleArtworkMaterialChange(materialIndex, 'materialDescription', e.target.value)}
                    className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                      errors[`artworkMaterial_${materialIndex}_materialDescription`] 
                        ? 'border-red-600' 
                        : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                    }`}
                    style={{ padding: '10px 14px', width: '180px', height: '44px' }}
                    onFocus={(e) => {
                      if (!errors[`artworkMaterial_${materialIndex}_materialDescription`]) {
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = '';
                    }}
                    placeholder="e.g., Care Label"
                    required
                  />
                  {errors[`artworkMaterial_${materialIndex}_materialDescription`] && (
                    <span className="text-red-600 text-xs mt-1 font-medium">
                      {errors[`artworkMaterial_${materialIndex}_materialDescription`]}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    NET CNS/PC <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={material.netConsumption}
                    onChange={(e) => handleArtworkMaterialChange(materialIndex, 'netConsumption', e.target.value)}
                    className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                      errors[`artworkMaterial_${materialIndex}_netConsumption`] 
                        ? 'border-red-600' 
                        : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                    }`}
                    style={{ padding: '10px 14px', width: '120px', height: '44px' }}
                    onFocus={(e) => {
                      if (!errors[`artworkMaterial_${materialIndex}_netConsumption`]) {
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = '';
                    }}
                    placeholder="0.000"
                    required
                  />
                  {errors[`artworkMaterial_${materialIndex}_netConsumption`] && (
                    <span className="text-red-600 text-xs mt-1 font-medium">
                      {errors[`artworkMaterial_${materialIndex}_netConsumption`]}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    UNIT <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={material.unit}
                    onChange={(e) => handleArtworkMaterialChange(materialIndex, 'unit', e.target.value)}
                    className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                      errors[`artworkMaterial_${materialIndex}_unit`] 
                        ? 'border-red-600' 
                        : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                    }`}
                    style={{ padding: '10px 14px', width: '130px', height: '44px' }}
                    onFocus={(e) => {
                      if (!errors[`artworkMaterial_${materialIndex}_unit`]) {
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = '';
                    }}
                    required
                  >
                    <option value="">Select</option>
                    <option value="R METERS">R METERS</option>
                    <option value="CM">CM</option>
                    <option value="Inches">Inches</option>
                    <option value="Meter">Meter</option>
                    <option value="KGS">KGS</option>
                  </select>
                  {errors[`artworkMaterial_${materialIndex}_unit`] && (
                    <span className="text-red-600 text-xs mt-1 font-medium">
                      {errors[`artworkMaterial_${materialIndex}_unit`]}
                    </span>
                  )}
                </div>
              </div>
              
              {/* PLACEMENT and WORK ORDER Row */}
              <div style={{ marginBottom: '24px', marginTop: '24px' }}>
                <div className="flex flex-wrap items-start gap-4">
                  <div className="flex flex-col" style={{ flex: 1, minWidth: '300px', maxWidth: '600px' }}>
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    PLACEMENT <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={material.placement}
                    onChange={(e) => handleArtworkMaterialChange(materialIndex, 'placement', e.target.value)}
                    className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                      errors[`artworkMaterial_${materialIndex}_placement`] 
                        ? 'border-red-600' 
                        : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                    }`}
                    style={{ padding: '12px 16px' }}
                    onFocus={(e) => {
                      if (!errors[`artworkMaterial_${materialIndex}_placement`]) {
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = '';
                    }}
                    placeholder="2&quot; FROM RIGHT CORNER AT FLAP"
                    required
                  />
                  {errors[`artworkMaterial_${materialIndex}_placement`] && (
                    <span className="text-red-600 text-xs mt-1 font-medium">
                      {errors[`artworkMaterial_${materialIndex}_placement`]}
                    </span>
                  )}
              </div>
              
                    <div className="flex flex-col" style={{ width: '180px' }}>
                      <label className="text-sm font-semibold text-gray-700 mb-2">
                      WORK ORDER <span className="text-red-600">*</span>
                      </label>
                    <select
                      value={material.workOrder}
                      onChange={(e) => handleArtworkMaterialChange(materialIndex, 'workOrder', e.target.value)}
                        className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                        errors[`artworkMaterial_${materialIndex}_workOrder`] 
                            ? 'border-red-600' 
                            : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                        }`}
                        style={{ padding: '12px 16px' }}
                        onFocus={(e) => {
                        if (!errors[`artworkMaterial_${materialIndex}_workOrder`]) {
                            e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                          }
                        }}
                        onBlur={(e) => {
                          e.target.style.boxShadow = '';
                        }}
                        required
                    >
                      <option value="">Select Work Order</option>
                      <option value="Sewing">Sewing</option>
                      <option value="DYEING">DYEING</option>
                      <option value="WEAVING">WEAVING</option>
                      <option value="PRINTING">PRINTING</option>
                      <option value="CUTTING">CUTTING</option>
                    </select>
                    {errors[`artworkMaterial_${materialIndex}_workOrder`] && (
                        <span className="text-red-600 text-xs mt-1 font-medium">
                        {errors[`artworkMaterial_${materialIndex}_workOrder`]}
                        </span>
                      )}
                  </div>
                </div>
                    </div>
                    
              {/* SIZE Section: WIDTH, LENGTH, HEIGHT, UNIT */}
              <div className="w-full mt-6 pt-6 border-t border-gray-100">
                <h5 className="text-sm font-bold text-gray-800 mb-4">SIZE</h5>
                <div className="flex flex-wrap items-start gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">WIDTH</label>
                    <input
                      type="text"
                      value={material.sizeWidth || ''}
                      onChange={(e) => handleArtworkMaterialChange(materialIndex, 'sizeWidth', e.target.value)}
                      className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                      style={{ padding: '10px 14px', width: '120px', height: '44px' }}
                      placeholder="e.g., 52"
                    />
                  </div>
                  
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH</label>
                    <input
                      type="text"
                      value={material.sizeLength || ''}
                      onChange={(e) => handleArtworkMaterialChange(materialIndex, 'sizeLength', e.target.value)}
                      className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                      style={{ padding: '10px 14px', width: '120px', height: '44px' }}
                      placeholder="e.g., 48"
                    />
                  </div>
                  
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">HEIGHT</label>
                    <input
                      type="text"
                      value={material.sizeHeight || ''}
                      onChange={(e) => handleArtworkMaterialChange(materialIndex, 'sizeHeight', e.target.value)}
                      className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                      style={{ padding: '10px 14px', width: '120px', height: '44px' }}
                      placeholder="e.g., 52"
                    />
                  </div>
                  
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">UNIT</label>
                    <select
                      value={material.sizeUnit || ''}
                      onChange={(e) => handleArtworkMaterialChange(materialIndex, 'sizeUnit', e.target.value)}
                      className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                      style={{ padding: '10px 14px', width: '130px', height: '44px' }}
                    >
                      <option value="">Select</option>
                      <option value="CMS">CMS</option>
                      <option value="INCHES">INCHES</option>
                      <option value="MM">MM</option>
                      <option value="CM">CM</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* ARTWORK CATEGORY SELECTOR */}
              <div className="w-full" style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                <div className="flex flex-col" style={{ width: '280px', marginBottom: '20px' }}>
                  <label className="text-sm font-bold text-gray-800 mb-2">ARTWORK CATEGORY</label>
                  <select
                    value={material.artworkCategory}
                    onChange={(e) => handleArtworkMaterialChange(materialIndex, 'artworkCategory', e.target.value)}
                    className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                    style={{ padding: '10px 14px', height: '44px' }}
                    onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                    onBlur={(e) => e.target.style.boxShadow = ''}
                  >
                    <option value="">Select Category</option>
                    <option value="LABELS (BRAND/MAIN)">LABELS (BRAND/MAIN)</option>
                    <option value="CARE & COMPOSITION">CARE & COMPOSITION</option>
                    <option value="TAGS & SPECIAL LABELS">TAGS & SPECIAL LABELS</option>
                    <option value="FLAMMABILITY / SAFETY LABELS">FLAMMABILITY / SAFETY LABELS</option>
                    <option value="RFID / SECURITY TAGS">RFID / SECURITY TAGS</option>
                    <option value="LAW LABEL / CONTENTS TAG">LAW LABEL / CONTENTS TAG</option>
                    <option value="HANG TAG SEALS / STRINGS">HANG TAG SEALS / STRINGS</option>
                    <option value="PRICE TICKET / BARCODE TAG">PRICE TICKET / BARCODE TAG</option>
                    <option value="HEAT TRANSFER LABELS">HEAT TRANSFER LABELS</option>
                    <option value="UPC LABEL / BARCODE STICKER">UPC LABEL / BARCODE STICKER</option>
                    <option value="SIZE LABELS (INDIVIDUAL)">SIZE LABELS (INDIVIDUAL)</option>
                    <option value="ANTI-COUNTERFEIT & HOLOGRAMS">ANTI-COUNTERFEIT & HOLOGRAMS</option>
                    <option value="QC / INSPECTION LABELS">QC / INSPECTION LABELS</option>
                    <option value="BELLY BAND / WRAPPER">BELLY BAND / WRAPPER</option>
                    <option value="TYVEK LABELS">TYVEK LABELS</option>
                    <option value="TAFFETA LABELS">TAFFETA LABELS</option>
                    <option value="INSERT CARDS">INSERT CARDS</option>
                    <option value="RIBBONS">RIBBONS</option>
                  </select>
                </div>

                {material.artworkCategory && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-5">
                    {/* TYPE Field */}
                    {!['LAW LABEL / CONTENTS TAG', 'HANG TAG SEALS / STRINGS', 'PRICE TICKET / BARCODE TAG', 'HEAT TRANSFER LABELS', 'UPC LABEL / BARCODE STICKER', 'SIZE LABELS (INDIVIDUAL)', 'ANTI-COUNTERFEIT & HOLOGRAMS', 'QC / INSPECTION LABELS', 'BELLY BAND / WRAPPER', 'TYVEK LABELS', 'TAFFETA LABELS'].includes(material.artworkCategory) && (
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                      <select
                        value={material.specificType}
                        onChange={(e) => handleArtworkMaterialChange(materialIndex, 'specificType', e.target.value)}
                        className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                        style={{ padding: '10px 14px', height: '44px' }}
                      >
                        <option value="">Select</option>
                          {material.artworkCategory === 'LABELS (BRAND/MAIN)' && ['Woven (Damask, Taffeta, Satin)', 'Printed (Satin, Cotton)', 'Heat Transfer', 'Leather', 'Metal'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        {material.artworkCategory === 'CARE & COMPOSITION' && ['Woven', 'Printed', 'Heat Transfer'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        {material.artworkCategory === 'TAGS & SPECIAL LABELS' && ['Hang Tag (Paper/Card)', 'Price Tag', 'Size Label', 'Flag'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        {material.artworkCategory === 'FLAMMABILITY / SAFETY LABELS' && ['Permanent Sew-in Label', 'Removable Hang Tag'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        {material.artworkCategory === 'RFID / SECURITY TAGS' && ['Soft EAS Label', 'UHF RFID Sticker', 'Hard Tag'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        {material.artworkCategory === 'PRICE TICKET / BARCODE TAG' && ['Adhesive Sticker', 'Printed Area', 'Dedicated Small Tag'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        {material.artworkCategory === 'HEAT TRANSFER LABELS' && ['Brand Logo', 'Size Tag', 'Minimal Care', 'Instructions', 'Reflective'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        {material.artworkCategory === 'UPC LABEL / BARCODE STICKER' && ['Adhesive Sticker', 'Pre-Printed Barcode Area'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        {material.artworkCategory === 'SIZE LABELS (INDIVIDUAL)' && ['Woven Flag Label', 'Printed Flag Label', 'Heat Transfer', 'Small Sticker'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        {material.artworkCategory === 'ANTI-COUNTERFEIT & HOLOGRAMS' && ['Hologram Sticker', 'Void/Tamper-Evident Label', 'Authenticity Patch', 'Invisible Ink Print'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        {material.artworkCategory === 'QC / INSPECTION LABELS' && ['Passed/Inspected Sticker', 'Hold/Defective Sticker', 'Audit Sample Tag'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        {material.artworkCategory === 'BELLY BAND / WRAPPER' && ['Cardboard Sleeve', 'Printed Paper Band', 'Plastic Film Wrapper'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        {material.artworkCategory === 'TYVEK LABELS' && ['Law Label', 'Shipping Tag', 'Permanent Industrial/Outdoor Care Label'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        {material.artworkCategory === 'TAFFETA LABELS' && ['Printed Care Label', 'Composition Label', 'Temporary Size Label'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          {material.artworkCategory === 'INSERT CARDS' && ['Shirt Board', 'Neck Support', 'Tissue Paper Insert', 'Promotional Insert Card'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          {material.artworkCategory === 'RIBBONS' && ['Satin', 'Grosgrain', 'Sheer Organza', 'Printed Polyester', 'Woven Edge'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                    )}

                    {/* MATERIAL Field */}
                    {!['RFID / SECURITY TAGS', 'LAW LABEL / CONTENTS TAG', 'HANG TAG SEALS / STRINGS', 'PRICE TICKET / BARCODE TAG', 'HEAT TRANSFER LABELS', 'UPC LABEL / BARCODE STICKER', 'SIZE LABELS (INDIVIDUAL)', 'ANTI-COUNTERFEIT & HOLOGRAMS', 'QC / INSPECTION LABELS', 'BELLY BAND / WRAPPER', 'TYVEK LABELS', 'TAFFETA LABELS'].includes(material.artworkCategory) && (
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-2">
                          {material.artworkCategory === 'CARE & COMPOSITION' ? 'FIBER CONTENT' : 'MATERIAL'}
                      </label>
                      <input
                        type="text"
                        value={material.material}
                        onChange={(e) => handleArtworkMaterialChange(materialIndex, 'material', e.target.value)}
                        className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                        style={{ padding: '10px 14px', height: '44px' }}
                          placeholder={
                            material.artworkCategory === 'CARE & COMPOSITION' ? 'Fiber Content' : 
                            material.artworkCategory === 'BELLY BAND / WRAPPER' ? 'Card Stock GSM' : 
                            material.artworkCategory === 'INSERT CARDS' ? 'Card Stock GSM (200-400 GSM) / Corrugated Board / Acid-Free Tissue' :
                            material.artworkCategory === 'RIBBONS' ? 'Polyester / Nylon / Rayon / Cotton' :
                            'e.g., Polyester'
                          }
                      />
                    </div>
                    )}

                    {/* Specific Fields for CARE & COMPOSITION */}
                    {material.artworkCategory === 'CARE & COMPOSITION' && (
                      <>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">COUNTRY OF ORIGIN</label>
                          <input
                            type="text"
                            value={material.countryOfOrigin}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'countryOfOrigin', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="e.g., Made in India"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">MANUFACTURER ID</label>
                          <input
                            type="text"
                            value={material.manufacturerId}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'manufacturerId', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="e.g., RN# / CA#"
                          />
                        </div>
                      </>
                    )}

                    {/* Specific Fields for RFID / SECURITY TAGS */}
                    {material.artworkCategory === 'RFID / SECURITY TAGS' && (
                      <>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FORM FACTOR</label>
                          <select
                            value={material.formFactor}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'formFactor', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                          >
                            <option value="">Select</option>
                            <option value="Adhesive Label">Adhesive Label</option>
                            <option value="Integrated Woven Label">Integrated Woven Label</option>
                          </select>
                    </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">CHIP / FREQUENCY</label>
                          <input
                            type="text"
                            value={material.chipFrequency}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'chipFrequency', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="e.g., 860-960 MHz for UHF"
                          />
                  </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">CODING</label>
                          <input
                            type="text"
                            value={material.coding}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'coding', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="e.g., Pre-Encoded / Sequential"
                          />
                </div>
                      </>
                    )}

                    {/* Specific Fields for LAW LABEL / CONTENTS TAG */}
                    {material.artworkCategory === 'LAW LABEL / CONTENTS TAG' && (
                      <>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                          <input
                            type="text"
                            value={material.lawLabelType || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'lawLabelType', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Permanent Sew-in Label, Attached Label"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                          <input
                            type="text"
                            value={material.lawLabelMaterial || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'lawLabelMaterial', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Cotton, Polyester, Blend, Tyvek"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FILLING MATERIALS</label>
                          <input
                            type="text"
                            value={material.fillingMaterials || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'fillingMaterials', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Full disclosure of filling materials"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">NEW/USED STATUS</label>
                          <input
                            type="text"
                            value={material.newUsedStatus || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'newUsedStatus', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder='e.g., "ALL NEW MATERIAL"'
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">REGISTRATION/LICENSES</label>
                          <input
                            type="text"
                            value={material.registrationLicenses || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'registrationLicenses', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Manufacturer's License Number"
                          />
                        </div>
                      </>
                    )}

                    {/* Specific Fields for HANG TAG SEALS / STRINGS */}
                    {material.artworkCategory === 'HANG TAG SEALS / STRINGS' && (
                      <>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                          <input
                            type="text"
                            value={material.hangTagType || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'hangTagType', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Plastic Loop Lock, String & Seal, Security Pin"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                          <input
                            type="text"
                            value={material.hangTagMaterial || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'hangTagMaterial', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Plastic, Nylon, Polyester, Cotton String"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">SEAL/SHAPE</label>
                          <input
                            type="text"
                            value={material.sealShape || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'sealShape', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="e.g., Bullet Shape / Rectangular"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FASTENING</label>
                          <input
                            type="text"
                            value={material.fastening || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'fastening', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="e.g., Permanent Lock / Reusable"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">PRE-STRINGING</label>
                          <input
                            type="text"
                            value={material.preStringing || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'preStringing', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="e.g., Supplied Pre-strung"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">APPLICATION</label>
                          <input
                            type="text"
                            value={material.application || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'application', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Manual Attachment / Machine Application"
                          />
                        </div>
                      </>
                    )}

                    {/* Specific Fields for HEAT TRANSFER LABELS */}
                    {material.artworkCategory === 'HEAT TRANSFER LABELS' && (
                      <>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                          <input
                            type="text"
                            value={material.heatTransferType || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'heatTransferType', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Brand Logo, Size Tag, Minimal Care, Instructions, Reflective"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL BASE</label>
                          <input
                            type="text"
                            value={material.heatTransferMaterialBase || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'heatTransferMaterialBase', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Polyester Film, PU, TPU, DTM"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">APPLICATION SPEC</label>
                          <input
                            type="text"
                            value={material.applicationSpec || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'applicationSpec', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Temperature, Pressure, Time"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                          <input
                            type="text"
                            value={material.colours || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'colours', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="DTM / Colour Code (Pantone TPX/TCX)"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FINISH/HAND FEEL</label>
                          <input
                            type="text"
                            value={material.finishHandFeel || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'finishHandFeel', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Soft, Smooth, Textured"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">PLACEMENT</label>
                          <input
                            type="text"
                            value={material.placement || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'placement', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Collar, Side Seam, Care Label Area"
                          />
                        </div>
                      </>
                    )}

                    {/* Specific Field for TAFFETA LABELS */}
                    {material.artworkCategory === 'TAFFETA LABELS' && (
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">PRINT QUALITY</label>
                        <input
                          type="text"
                          value={material.printQuality}
                          onChange={(e) => handleArtworkMaterialChange(materialIndex, 'printQuality', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="High Contrast Printing"
                        />
                      </div>
                    )}

                    {/* Specific Fields for UPC LABEL / BARCODE STICKER */}
                    {material.artworkCategory === 'UPC LABEL / BARCODE STICKER' && (
                      <>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                          <input
                            type="text"
                            value={material.upcType || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'upcType', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Adhesive Sticker, Pre-Printed Barcode Area"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                          <input
                            type="text"
                            value={material.upcMaterial || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'upcMaterial', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Paper, Synthetic, Vinyl, DTM"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">CONTENT</label>
                          <input
                            type="text"
                            value={material.content || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'content', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="UPC Code, Barcode, Product Info"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">QUALITY</label>
                          <input
                            type="text"
                            value={material.quality || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'quality', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Print Contrast Ratio"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">ADHESIVE</label>
                          <input
                            type="text"
                            value={material.adhesive || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'adhesive', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Permanent, Removable"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">PLACEMENT</label>
                          <input
                            type="text"
                            value={material.placement || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'placement', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Inside Label, Hang Tag, Packaging"
                          />
                        </div>
                      </>
                    )}

                    {/* Specific Fields for PRICE TICKET / BARCODE TAG */}
                    {material.artworkCategory === 'PRICE TICKET / BARCODE TAG' && (
                      <>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                          <input
                            type="text"
                            value={material.priceTicketType || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'priceTicketType', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Adhesive Sticker, Printed Area, Dedicated Small Tag"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                          <input
                            type="text"
                            value={material.priceTicketMaterial || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'priceTicketMaterial', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Paper, Card Stock, Synthetic, DTM"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">CONTENT</label>
                          <input
                            type="text"
                            value={material.content || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'content', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Price, SKU, Barcode, Product Info"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">BARCODE TYPE</label>
                          <input
                            type="text"
                            value={material.barcodeType || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'barcodeType', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="e.g., UPC / EAN-13 / Code 128"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">ADHESIVE</label>
                          <input
                            type="text"
                            value={material.adhesive || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'adhesive', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Permanent, Removable, Repositionable"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FINISH</label>
                          <input
                            type="text"
                            value={material.finishing || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'finishing', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Matte, Gloss, Lamination"
                          />
                        </div>
                      </>
                    )}

                    {/* Specific Fields for SIZE LABELS (INDIVIDUAL) */}
                    {material.artworkCategory === 'SIZE LABELS (INDIVIDUAL)' && (
                      <>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                          <input
                            type="text"
                            value={material.sizeLabelType || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'sizeLabelType', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Woven Flag Label, Printed Flag Label, Heat Transfer, Small Sticker"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                          <input
                            type="text"
                            value={material.sizeLabelMaterial || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'sizeLabelMaterial', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Polyester, Cotton, Satin, DTM"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FINISH</label>
                          <input
                            type="text"
                            value={material.finishing || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'finishing', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Matte, Gloss, Lamination"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                          <input
                            type="text"
                            value={material.colours || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'colours', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="DTM / Colour Code (Pantone TPX/TCX)"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">PLACEMENT</label>
                          <input
                            type="text"
                            value={material.placement || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'placement', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Collar, Side Seam, Care Label Area"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">PERMANENCE</label>
                          <input
                            type="text"
                            value={material.permanence || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'permanence', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Permanent, Temporary"
                          />
                        </div>
                      </>
                    )}

                    {/* Specific Fields for ANTI-COUNTERFEIT & HOLOGRAMS */}
                    {material.artworkCategory === 'ANTI-COUNTERFEIT & HOLOGRAMS' && (
                      <>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                          <input
                            type="text"
                            value={material.antiCounterfeitType || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'antiCounterfeitType', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Hologram Sticker, Void/Tamper-Evident Label, Authenticity Patch, Invisible Ink Print"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                          <input
                            type="text"
                            value={material.antiCounterfeitMaterial || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'antiCounterfeitMaterial', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Holographic Film, Security Paper, Synthetic, DTM"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">SECURITY FEATURE</label>
                          <input
                            type="text"
                            value={material.securityFeature || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'securityFeature', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Hologram, UV Ink, Microtext, QR Code"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">APPLICATION</label>
                          <input
                            type="text"
                            value={material.application || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'application', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Adhesive, Sew-in, Heat Transfer"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">PLACEMENT</label>
                          <input
                            type="text"
                            value={material.placement || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'placement', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Inside Label, Hang Tag, Packaging"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">VERIFICATION</label>
                          <input
                            type="text"
                            value={material.verification || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'verification', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="App Scan, UV Light, Visual Check"
                          />
                        </div>
                      </>
                    )}

                    {/* Specific Fields for QC / INSPECTION LABELS */}
                    {material.artworkCategory === 'QC / INSPECTION LABELS' && (
                      <>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                          <input
                            type="text"
                            value={material.qcLabelType || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'qcLabelType', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Passed/Inspected Sticker, Hold/Defective Sticker, Audit Sample Tag"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                          <input
                            type="text"
                            value={material.qcLabelMaterial || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'qcLabelMaterial', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Paper, Synthetic, Vinyl, DTM"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">CONTENT</label>
                          <input
                            type="text"
                            value={material.content || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'content', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Passed, Hold, Defective, Audit Info"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">APPLICATION</label>
                          <input
                            type="text"
                            value={material.application || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'application', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Adhesive, Sew-in, Tag"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">REMOVAL</label>
                          <input
                            type="text"
                            value={material.removal || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'removal', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Permanent, Removable, Before Shipping"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">TRACEABILITY</label>
                          <input
                            type="text"
                            value={material.traceability || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'traceability', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Batch Number, Date, Inspector ID"
                          />
                        </div>
                      </>
                    )}

                    {/* Specific Fields for BELLY BAND / WRAPPER */}
                    {material.artworkCategory === 'BELLY BAND / WRAPPER' && (
                      <>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                          <input
                            type="text"
                            value={material.bellyBandType || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'bellyBandType', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Cardboard Sleeve, Printed Paper Band, Plastic Film Wrapper"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                          <input
                            type="text"
                            value={material.bellyBandMaterial || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'bellyBandMaterial', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Card Stock GSM, Paper, Plastic Film, DTM"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">CLOSURE</label>
                          <input
                            type="text"
                            value={material.closure || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'closure', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Adhesive, Tuck-in, Overlap"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">CONTENT</label>
                          <input
                            type="text"
                            value={material.content || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'content', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Brand Info, Product Details, Care Instructions"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">CLOSURE/FINISH</label>
                          <input
                            type="text"
                            value={material.closureFinish || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'closureFinish', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Sealed, Open End, Perforated"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">DURABILITY</label>
                          <input
                            type="text"
                            value={material.durability || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'durability', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Temporary, Reusable, Single Use"
                          />
                        </div>
                      </>
                    )}

                    {/* Specific Fields for TYVEK LABELS */}
                    {material.artworkCategory === 'TYVEK LABELS' && (
                      <>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                          <input
                            type="text"
                            value={material.tyvekType || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'tyvekType', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Law Label, Shipping Tag, Permanent Industrial/Outdoor Care Label"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                          <input
                            type="text"
                            value={material.tyvekMaterial || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'tyvekMaterial', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Tyvek, Synthetic Paper, DTM"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">CONTENT</label>
                          <input
                            type="text"
                            value={material.content || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'content', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Care Instructions, Composition, Law Label Info"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">INK TYPE</label>
                          <input
                            type="text"
                            value={material.inkType || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'inkType', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="e.g., Durable, Solvent-Resistant"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">DURABILITY</label>
                          <input
                            type="text"
                            value={material.durability || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'durability', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Waterproof, Tear-Resistant, UV Resistant"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">PERMANENCE</label>
                          <input
                            type="text"
                            value={material.permanence || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'permanence', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Permanent, Temporary"
                          />
                        </div>
                      </>
                    )}

                    {/* Specific Fields for TAFFETA LABELS */}
                    {material.artworkCategory === 'TAFFETA LABELS' && (
                      <>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
                          <input
                            type="text"
                            value={material.taffetaType || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'taffetaType', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Printed Care Label, Composition Label, Temporary Size Label"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">MATERIAL</label>
                          <input
                            type="text"
                            value={material.taffetaMaterial || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'taffetaMaterial', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Taffeta, Polyester, Satin, DTM"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">CONTENT</label>
                          <input
                            type="text"
                            value={material.content || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'content', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Care Instructions, Composition, Size Info"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">PRINT QUALITY</label>
                          <input
                            type="text"
                            value={material.printQuality || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'printQuality', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="High Contrast Printing"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">DURABILITY</label>
                          <input
                            type="text"
                            value={material.durability || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'durability', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Wash Fastness, Fade Resistance"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FINISHING</label>
                          <input
                            type="text"
                            value={material.finishing || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'finishing', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Matte, Gloss, Lamination"
                          />
                        </div>
                      </>
                    )}

                    {/* SIZE / DIMENSIONS Field */}
                    {(['LABELS (BRAND/MAIN)', 'TAGS & SPECIAL LABELS', 'RFID / SECURITY TAGS', 'LAW LABEL / CONTENTS TAG', 'HANG TAG SEALS / STRINGS', 'PRICE TICKET / BARCODE TAG', 'HEAT TRANSFER LABELS', 'UPC LABEL / BARCODE STICKER', 'SIZE LABELS (INDIVIDUAL)', 'ANTI-COUNTERFEIT & HOLOGRAMS', 'QC / INSPECTION LABELS', 'BELLY BAND / WRAPPER', 'TYVEK LABELS', 'TAFFETA LABELS'].includes(material.artworkCategory)) && (
                      <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                          {material.artworkCategory === 'LABELS (BRAND/MAIN)' ? 'SIZE / ARTWORK ID' :
                           material.artworkCategory === 'TAGS & SPECIAL LABELS' ? 'SIZE / SHAPE' : 
                           material.artworkCategory === 'HANG TAG SEALS / STRINGS' ? 'SIZE / LENGTH' : 
                           material.artworkCategory === 'SIZE LABELS (INDIVIDUAL)' ? 'SIZE / CODE' : 
                           material.artworkCategory === 'TYVEK LABELS' ? 'SIZE / FORMAT' : 
                           material.artworkCategory === 'TAFFETA LABELS' ? 'SIZE / FOLD' :
                           material.artworkCategory === 'LAW LABEL / CONTENTS TAG' ? 'SIZE / COLOUR' :
                           material.artworkCategory === 'PRICE TICKET / BARCODE TAG' ? 'SIZE / DIMENSION' :
                           material.artworkCategory === 'HEAT TRANSFER LABELS' ? 'SIZE / ARTWORK ID' :
                           material.artworkCategory === 'UPC LABEL / BARCODE STICKER' ? 'SIZE / SPEC' :
                           material.artworkCategory === 'ANTI-COUNTERFEIT & HOLOGRAMS' ? 'SIZE / ARTWORK' :
                           material.artworkCategory === 'QC / INSPECTION LABELS' ? 'SIZE / COLOUR' :
                           material.artworkCategory === 'BELLY BAND / WRAPPER' ? 'SIZE / DIMENSIONS' : 'SIZE / DIMENSIONS'}
                  </label>
                        <input
                          type="text"
                          value={material.sizeArtworkId || ''}
                          onChange={(e) => handleArtworkMaterialChange(materialIndex, 'sizeArtworkId', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 20mm x 40mm"
                        />
                      </div>
                    )}

                    {/* FOLD TYPE Field */}
                    {material.artworkCategory === 'LABELS (BRAND/MAIN)' && (
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">FOLD TYPE</label>
                  <select
                          value={material.foldType}
                          onChange={(e) => handleArtworkMaterialChange(materialIndex, 'foldType', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                        >
                          <option value="">Select</option>
                          {['End-fold', 'Center-fold', 'Miter-fold', 'Straight Cut'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                      </div>
                    )}

                    {/* COLOURS Field */}
                    {(['LABELS (BRAND/MAIN)', 'HANG TAG SEALS / STRINGS'].includes(material.artworkCategory)) && (
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">COLOURS</label>
                        <input
                          type="text"
                          value={material.colours}
                          onChange={(e) => handleArtworkMaterialChange(materialIndex, 'colours', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 4 colors"
                        />
                </div>
                    )}
                
                    {/* ATTACHMENT / CLOSURE Field */}
                    {(['TAGS & SPECIAL LABELS'].includes(material.artworkCategory)) && (
                      <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                          {material.artworkCategory === 'TAGS & SPECIAL LABELS' ? 'ATTACHMENT' : 'CLOSURE'}
                  </label>
                  <input
                    type="text"
                          value={material.attachment}
                          onChange={(e) => handleArtworkMaterialChange(materialIndex, 'attachment', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., Adhesive"
                        />
                      </div>
                    )}

                    {/* CONTENT Field */}
                    {(['TAGS & SPECIAL LABELS', 'FLAMMABILITY / SAFETY LABELS', 'LAW LABEL / CONTENTS TAG'].includes(material.artworkCategory)) && (
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">
                          {material.artworkCategory === 'LAW LABEL / CONTENTS TAG' ? 'CONTENT MANDATES' : 'CONTENT'}
                        </label>
                        <input
                          type="text"
                          value={material.content}
                          onChange={(e) => handleArtworkMaterialChange(materialIndex, 'content', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., Barcode"
                        />
                </div>
                    )}
                
                    {/* SYMBOL Field */}
                    {(['CARE & COMPOSITION', 'FLAMMABILITY / SAFETY LABELS'].includes(material.artworkCategory)) && (
                      <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                          {material.artworkCategory === 'CARE & COMPOSITION' ? 'CARE SYMBOLS' : 'SYMBOL'}
                  </label>
                  <input
                    type="text"
                          value={material.symbol}
                          onChange={(e) => handleArtworkMaterialChange(materialIndex, 'symbol', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., Bleaching"
                        />
                      </div>
                    )}

                    {/* CERTIFICATION ID Field - Only for FLAMMABILITY / SAFETY LABELS */}
                    {material.artworkCategory === 'FLAMMABILITY / SAFETY LABELS' && (
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">CERTIFICATION ID</label>
                        <input
                          type="text"
                          value={material.certificationId}
                          onChange={(e) => handleArtworkMaterialChange(materialIndex, 'certificationId', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Test Report Reference Number / Certification Body ID"
                        />
                      </div>
                    )}

                    {/* LANGUAGE Field */}
                    {(['CARE & COMPOSITION', 'FLAMMABILITY / SAFETY LABELS'].includes(material.artworkCategory)) && (
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">LANGUAGE</label>
                        <input
                          type="text"
                          value={material.language}
                          onChange={(e) => handleArtworkMaterialChange(materialIndex, 'language', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., English, French"
                        />
                </div>
                    )}
                
                    {/* FINISHING / FINISH Field */}
                    {(['LABELS (BRAND/MAIN)', 'TAGS & SPECIAL LABELS'].includes(material.artworkCategory)) && (
                      <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                          {material.artworkCategory === 'HEAT TRANSFER LABELS' ? 'FINISH / HAND FEEL' : 'FINISHING'}
                  </label>
                        <input
                          type="text"
                          value={material.finishing}
                          onChange={(e) => handleArtworkMaterialChange(materialIndex, 'finishing', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., Hot-cut"
                        />
                      </div>
                    )}

                    {/* PLACEMENT Field (Specific to artwork category) */}
                    {(['LABELS (BRAND/MAIN)', 'TAGS & SPECIAL LABELS', 'FLAMMABILITY / SAFETY LABELS'].includes(material.artworkCategory)) && (
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">PLACEMENT</label>
                        <input
                          type="text"
                          value={material.placement}
                          onChange={(e) => handleArtworkMaterialChange(materialIndex, 'placement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., Inside seam"
                        />
                      </div>
                    )}

                    {/* PERMANENCE / DURABILITY Field */}
                    {(['CARE & COMPOSITION'].includes(material.artworkCategory)) && (
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">
                          {material.artworkCategory === 'BELLY BAND / WRAPPER' || material.artworkCategory === 'TYVEK LABELS' || material.artworkCategory === 'TAFFETA LABELS' ? 'DURABILITY' : 'PERMANENCE'}
                        </label>
                        <input
                          type="text"
                          value={material.permanence}
                          onChange={(e) => handleArtworkMaterialChange(materialIndex, 'permanence', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., Permanent"
                        />
                      </div>
                    )}

                    {/* PERMANENCE Field with Upload for LAW LABEL / CONTENTS TAG */}
                    {material.artworkCategory === 'LAW LABEL / CONTENTS TAG' && (
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-semibold text-gray-700 mb-2">PERMANENCE</label>
                          <input
                            type="text"
                            value={material.permanence || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'permanence', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="e.g., Permanent"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2" style={{ visibility: 'hidden' }}>UPLOAD</label>
                          <input
                            type="file"
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'permanenceFile', e.target.files[0])}
                            className="hidden"
                            id={`upload-permanence-law-${materialIndex}`}
                          />
                          <label
                            htmlFor={`upload-permanence-law-${materialIndex}`}
                            className="border-2 rounded-lg text-sm font-medium cursor-pointer transition-all bg-white text-gray-900 border-[#e5e7eb] hover:bg-gray-50"
                            style={{ padding: '10px 16px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px' }}
                          >
                            {material.permanenceFile ? 'UPLOADED' : 'UPLOAD'}
                          </label>
                        </div>
                      </div>
                    )}

                    {/* ADHESIVE Field */}
                    {(['RFID / SECURITY TAGS', 'PRICE TICKET / BARCODE TAG', 'UPC LABEL / BARCODE STICKER'].includes(material.artworkCategory)) && (
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">ADHESIVE</label>
                        <input
                          type="text"
                          value={material.adhesive}
                          onChange={(e) => handleArtworkMaterialChange(materialIndex, 'adhesive', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., High-bond"
                        />
                      </div>
                    )}

                    {/* APPLICATION SPEC Field */}
                    {material.artworkCategory === 'HEAT TRANSFER LABELS' && (
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">APPLICATION SPEC</label>
                        <input
                          type="text"
                          value={material.applicationSpec}
                          onChange={(e) => handleArtworkMaterialChange(materialIndex, 'applicationSpec', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="Temp / Dwell Time / Pressure"
                        />
                      </div>
                    )}

                    {/* SECURITY / SECURITY FEATURE Field */}
                    {(['RFID / SECURITY TAGS', 'ANTI-COUNTERFEIT & HOLOGRAMS'].includes(material.artworkCategory)) && (
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">
                          {material.artworkCategory === 'ANTI-COUNTERFEIT & HOLOGRAMS' ? 'SECURITY FEATURE' : 'SECURITY'}
                        </label>
                        <input
                          type="text"
                          value={material.security}
                          onChange={(e) => handleArtworkMaterialChange(materialIndex, 'security', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., 3D Holography"
                        />
                      </div>
                    )}

                    {/* VERIFICATION Field */}
                    {material.artworkCategory === 'ANTI-COUNTERFEIT & HOLOGRAMS' && (
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">VERIFICATION</label>
                        <input
                          type="text"
                          value={material.verification}
                          onChange={(e) => handleArtworkMaterialChange(materialIndex, 'verification', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., Web Link"
                        />
                      </div>
                    )}

                    {/* REMOVAL / TRACEABILITY Field */}
                    {material.artworkCategory === 'QC / INSPECTION LABELS' && (
                      <>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">REMOVAL</label>
                          <input
                            type="text"
                            value={material.removal}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'removal', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="e.g., Easily removable"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">TRACEABILITY</label>
                          <input
                            type="text"
                            value={material.traceability}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'traceability', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="e.g., Sequential numbering"
                          />
                        </div>
                      </>
                    )}

                    {/* Specific Fields for INSERT CARDS */}
                    {material.artworkCategory === 'INSERT CARDS' && (
                      <>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">SIZE / SHAPE</label>
                          <input
                            type="text"
                            value={material.sizeShape}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'sizeShape', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Dimensions / Die-Cut Shape"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">CONTENT</label>
                          <input
                            type="text"
                            value={material.content}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'content', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Promotional Text / Product Features / Brand Story"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FINISH</label>
                          <input
                            type="text"
                            value={material.finishing}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'finishing', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Matte / Gloss Lamination / Varnished"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">PERMANENCE</label>
                          <input
                            type="text"
                            value={material.permanence}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'permanence', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Temporary (Removed by consumer)"
                          />
                        </div>
                      </>
                    )}

                    {/* Specific Fields for RIBBONS */}
                    {material.artworkCategory === 'RIBBONS' && (
                      <>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">WIDTH</label>
                          <input
                            type="text"
                            value={material.ribbonWidth}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'ribbonWidth', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="e.g., 10mm, 1 inch"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">COLOUR</label>
                          <input
                            type="text"
                            value={material.colours}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'colours', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="DTM / Colour Code (Pantone TPX/TCX)"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FINISH</label>
                          <input
                            type="text"
                            value={material.finishing}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'finishing', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Single Face / Double Face / Wired Edge"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">USAGE</label>
                          <input
                            type="text"
                            value={material.usage}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'usage', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="Packaging Tie / Decorative Trim / Hanging Loop"
                          />
                        </div>
                      </>
                    )}

                    {/* TESTING REQUIREMENT Field with Image Upload - For all except LAW LABEL / CONTENTS TAG */}
                    {material.artworkCategory !== 'LAW LABEL / CONTENTS TAG' && (
                    <div className="flex flex-col md:col-span-2">
                      <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENT</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                            value={material.testingRequirement || ''}
                          onChange={(e) => handleArtworkMaterialChange(materialIndex, 'testingRequirement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none flex-grow"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., Wash Fastness"
                        />
                        <input
                          type="file"
                          onChange={(e) => handleArtworkMaterialChange(materialIndex, 'referenceImage', e.target.files[0])}
                          className="hidden"
                          id={`art-file-${materialIndex}`}
                        />
                        <label
                          htmlFor={`art-file-${materialIndex}`}
                          className="border-2 rounded-lg text-sm transition-all bg-white cursor-pointer hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 border-[#e5e7eb] flex-shrink-0"
                          style={{ padding: '10px 14px', height: '44px', width: '110px' }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          <span className="truncate">{material.referenceImage ? 'DONE' : 'UPLOAD'}</span>
                        </label>
                      </div>
                    </div>
                    )}

                    {/* TESTING REQUIREMENT Field - Standalone for LAW LABEL / CONTENTS TAG */}
                    {material.artworkCategory === 'LAW LABEL / CONTENTS TAG' && (
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">TESTING REQUIREMENT</label>
                        <input
                          type="text"
                          value={material.testingRequirement || ''}
                          onChange={(e) => handleArtworkMaterialChange(materialIndex, 'testingRequirement', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="e.g., Wash Fastness, Durability"
                        />
                      </div>
                    )}

                    {/* LENGTH / QUANTITY Field - For all except LAW LABEL / CONTENTS TAG */}
                    {material.artworkCategory !== 'LAW LABEL / CONTENTS TAG' && (
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH / QUANTITY</label>
                      <input
                        type="text"
                          value={material.lengthQuantity || ''}
                        onChange={(e) => handleArtworkMaterialChange(materialIndex, 'lengthQuantity', e.target.value)}
                        className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                        style={{ padding: '10px 14px', height: '44px' }}
                        placeholder="e.g., 5000 pcs"
                      />
                    </div>
                    )}

                    {/* LENGTH / QUANTITY Field with FOR-SECTION - For LAW LABEL / CONTENTS TAG */}
                    {material.artworkCategory === 'LAW LABEL / CONTENTS TAG' && (
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-semibold text-gray-700 mb-2">LENGTH/QUANTITY</label>
                          <input
                            type="text"
                            value={material.lengthQuantity || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'lengthQuantity', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px' }}
                            placeholder="e.g., 5000 pcs"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">FOR-SECTION</label>
                          <input
                            type="text"
                            value={material.lengthQuantityForSection || ''}
                            onChange={(e) => handleArtworkMaterialChange(materialIndex, 'lengthQuantityForSection', e.target.value)}
                            className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                            style={{ padding: '10px 14px', height: '44px', width: '140px' }}
                            placeholder="FOR"
                          />
                        </div>
                      </div>
                    )}

                    {/* SURPLUS Field with FOR SECTION - For all except LAW LABEL / CONTENTS TAG */}
                    {material.artworkCategory !== 'LAW LABEL / CONTENTS TAG' && (
                    <div className="flex flex-col md:col-span-2">
                      <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS (%AGE / FOR)</label>
                      <div className="flex items-center gap-0 border-2 border-[#e5e7eb] rounded-lg bg-white overflow-hidden focus-within:border-indigo-500 transition-all" style={{ height: '44px' }}>
                        <input
                          type="text"
                            value={material.surplus || ''}
                          onChange={(e) => handleArtworkMaterialChange(materialIndex, 'surplus', e.target.value)}
                          className="text-sm bg-transparent text-gray-900 focus:outline-none border-r border-gray-200"
                          style={{ padding: '10px 14px', width: '80px' }}
                          placeholder="5%"
                        />
                        <input
                          type="text"
                            value={material.surplusForSection || ''}
                          onChange={(e) => handleArtworkMaterialChange(materialIndex, 'surplusForSection', e.target.value)}
                          className="text-sm bg-transparent text-gray-900 focus:outline-none flex-grow"
                          style={{ padding: '10px 14px' }}
                          placeholder="FOR SECTION (e.g., PACKAGING / QUALITY)"
                        />
                      </div>
                    </div>
                    )}

                    {/* SURPLUS Field - Standalone for LAW LABEL / CONTENTS TAG */}
                    {material.artworkCategory === 'LAW LABEL / CONTENTS TAG' && (
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2">SURPLUS</label>
                        <input
                          type="text"
                          value={material.surplus || ''}
                          onChange={(e) => handleArtworkMaterialChange(materialIndex, 'surplus', e.target.value)}
                          className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                          style={{ padding: '10px 14px', height: '44px' }}
                          placeholder="%AGE (e.g., 5%)"
                        />
                      </div>
                    )}

                    {/* APPROVAL Field */}
                    <div className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-2">APPROVAL</label>
                  <select
                        value={material.approval}
                        onChange={(e) => handleArtworkMaterialChange(materialIndex, 'approval', e.target.value)}
                        className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                        style={{ padding: '10px 14px', height: '44px' }}
                      >
                        <option value="">Select</option>
                        <option value="BUYER'S">BUYER'S</option>
                        <option value="INITIAL">INITIAL</option>
                        <option value="IPP">IPP</option>
                        <option value="PP">PP</option>
                        <option value="TOP">TOP</option>
                  </select>
                </div>

                    {/* REMARKS Field */}
                    <div className="col-span-full flex flex-col">
                      <label className="text-sm font-semibold text-gray-700 mb-2">REMARKS</label>
                      <textarea
                        value={material.remarks}
                        onChange={(e) => handleArtworkMaterialChange(materialIndex, 'remarks', e.target.value)}
                        className="border-2 rounded-lg text-sm transition-all bg-white text-gray-900 border-[#e5e7eb] focus:border-indigo-500 focus:outline-none"
                        style={{ padding: '10px 14px', width: '100%' }}
                        onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'}
                        onBlur={(e) => e.target.style.boxShadow = ''}
                        rows="1"
                        placeholder="Additional notes..."
                      ></textarea>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )) : (
          <div className="text-center text-gray-500 py-8">
            No artwork materials added yet. Click "+ Add Material" to add one.
          </div>
        )}
      </div>
    </div>
  );

  const renderStepContent = () => {
    try {
      switch (currentStep) {
        case 0:
          return renderStep0();
        case 1:
          return renderStep1();
        case 2:
          return renderStep2();
        case 3:
          return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      default:
          return (
            <div className="w-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Step {currentStep}</h2>
              <p className="text-sm text-gray-600 mb-8">This step will be implemented later</p>
            </div>
          );
      }
    } catch (error) {
      console.error('Error rendering step:', error);
      return (
        <div className="w-full p-8 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading Step {currentStep}</h2>
          <p className="text-red-600 mb-4">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reload Page
          </button>
        </div>
      );
    }
  };

  return (
    <div className="w-full h-full bg-white rounded-xl shadow-sm overflow-y-auto" style={{ padding: '40px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}>
      <div style={{ marginBottom: '40px' }}>
        <button 
          className="border px-4 py-2.5 rounded-md cursor-pointer text-sm font-medium transition-all hover:-translate-x-0.5"
          style={{
            backgroundColor: '#f3f4f6',
            borderColor: '#d1d5db',
            color: '#374151',
            marginBottom: '24px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#e5e7eb';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
          }}
          onClick={onBack} 
          type="button"
        >
          ← Back to Department
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontSize: '32px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' }}>Generate Factory Code</h1>
        <p className="text-base text-gray-600 mb-6" style={{ fontSize: '16px', color: '#6b7280', marginBottom: '24px' }}>Complete all steps to generate a factory code</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-10" style={{ marginBottom: '40px' }}>
        <div className="flex justify-between items-center relative" style={{ marginTop: '20px', marginBottom: '24px' }}>
          {/* Progress line behind the steps */}
          <div 
            className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200"
            style={{ 
              top: '20px',
              height: '2px',
              zIndex: 0
            }}
          ></div>
          <div 
            className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300"
            style={{ 
              top: '20px',
              height: '2px',
              width: `${((currentStep + 0.5) / (totalSteps + 1)) * 100}%`,
              zIndex: 1
            }}
          ></div>
          
          {/* Step numbers */}
          {Array.from({ length: totalSteps + 1 }, (_, i) => (
            <div key={i} className="flex flex-col items-center flex-1 relative" style={{ zIndex: 2 }}>
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-base transition-all cursor-pointer hover:scale-110 ${
                  i <= currentStep
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-600'
                } ${i === currentStep ? 'scale-110 shadow-xl' : ''}`}
                style={{ 
                  width: '40px',
                  height: '40px',
                  boxShadow: i <= currentStep ? '0 4px 12px rgba(102, 126, 234, 0.3)' : 'none'
                }}
                onClick={() => {
                  // Allow direct navigation for testing - bypass validation
                  setCurrentStep(i);
                }}
                title={`Go to ${stepLabels[i]}`}
              >
                {i}
              </div>
              <div className={`mt-2 text-xs font-medium text-center ${
                i <= currentStep ? 'text-indigo-600 font-semibold' : 'text-gray-500'
              }`} style={{ 
                marginTop: '8px', 
                fontSize: '10px', 
                lineHeight: '1.2',
                width: '100%',
                maxWidth: '120px',
                wordWrap: 'break-word'
              }}>
                {stepLabels[i]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="mb-8" style={{ maxWidth: '1000px' }}>
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-center gap-4" style={{ marginTop: '32px', gap: '16px' }}>
        {currentStep > 0 && (
          <button 
            type="button" 
            className="flex items-center gap-2 border rounded-lg text-sm font-semibold transition-all hover:bg-gray-200 hover:-translate-x-0.5"
            style={{
              padding: '12px 24px',
              background: '#f3f4f6',
              color: '#374151',
              borderColor: '#d1d5db',
              borderWidth: '1px'
            }}
            onClick={handlePrevious}
          >
            ← Previous
          </button>
        )}
        {currentStep < totalSteps ? (
          <button 
            type="button" 
            className="flex items-center gap-2 text-white rounded-lg text-sm font-semibold transition-all hover:-translate-y-0.5"
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 6px 16px rgba(102, 126, 234, 0.3)'
            }}
            onClick={handleNext}
          >
            Next →
          </button>
        ) : (
          <button 
            type="button" 
            className="flex items-center gap-3 text-white rounded-lg text-base font-semibold transition-all justify-center hover:-translate-y-0.5"
            style={{
              padding: '16px 32px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              minWidth: '200px',
              boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)'
            }}
            onClick={() => {
              // Handle final submission
              alert('Factory code generation will be implemented here');
            }}
          >
            🎯 Generate Factory Code
          </button>
        )}
      </div>
    </div>
  );
};

export default GenerateFactoryCode;

import { useState, useEffect } from 'react';
import TEXTILE_FIBER_DATA from './data/textileFiberData';
import { getFiberTypes, getYarnTypes, getSpinningMethod, getYarnDetails } from './utils/yarnHelpers';
import { initializeRawMaterials, initializeConsumptionMaterials } from './utils/initializers';
import { calculateTotalWastage, calculateGrossConsumption } from './utils/calculations';
import Step0 from './components/steps/Step0';
import Step1 from './components/steps/Step1';
import Step2 from './components/steps/Step2';
import Step3 from './components/steps/Step3';
import Step4 from './components/steps/Step4';
import Step5 from './components/steps/Step5';

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
    'Product Spec',
    'Cut & Sew Spec',
    'Raw Material',
    'Trims & Accessories',
    'Artwork & Labeling',
    'Packaging'
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

  // Helpers to decide if a row has any user input (for optional navigation)
  const isRawMaterialFilled = (material = {}) => {
    const hasWorkOrderSelection = material.workOrders?.some(wo => wo?.workOrder?.trim());
    return Boolean(
      material.materialDescription?.trim() ||
      material.netConsumption?.toString().trim() ||
      material.unit?.trim() ||
      material.fiberType?.trim() ||
      material.yarnType?.trim() ||
      hasWorkOrderSelection
    );
  };

  const isConsumptionMaterialFilled = (material = {}) => {
    return Boolean(
      material.materialDescription?.trim() ||
      material.netConsumption?.toString().trim() ||
      material.unit?.trim() ||
      material.workOrder?.trim() ||
      material.trimAccessory?.trim()
    );
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
      // Product name validation removed
      
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
      const material = updatedRawMaterials[materialIndex];
      
      // Reset child dropdowns when parent changes
      if (field === 'fiberType') {
        updatedRawMaterials[materialIndex] = {
          ...material,
          fiberType: value,
          yarnType: '',
          spinningMethod: '',
          yarnComposition: '',
          yarnCountRange: '',
          yarnDoublingOptions: '',
          yarnPlyOptions: ''
        };
      } else if (field === 'yarnType') {
        const spinningMethod = getSpinningMethod(material.fiberType, value);
        updatedRawMaterials[materialIndex] = {
          ...material,
          yarnType: value,
          spinningMethod: spinningMethod || '',
          // Composition, Count Range, Doubling Options, and Ply Options are input fields - NOT pre-filled
          yarnComposition: '',
          yarnCountRange: '',
          yarnDoublingOptions: '',
          yarnPlyOptions: ''
        };
      } else {
        updatedRawMaterials[materialIndex] = {
          ...material,
          [field]: value
        };
      }
      
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

    const materials = formData.consumptionMaterials || [];
    let hasFilledMaterial = false;

    materials.forEach((material, materialIndex) => {
      if (!material || !isConsumptionMaterialFilled(material)) {
        return;
      }
      hasFilledMaterial = true;
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

    if (!hasFilledMaterial) {
      return true;
    }

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

  const validateStep2 = () => {
    const newErrors = {};

    const materials = formData.rawMaterials || [];
    let hasFilledMaterial = false;

    materials.forEach((material, materialIndex) => {
      if (!material || !isRawMaterialFilled(material)) {
        return;
      }
      hasFilledMaterial = true;
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

    if (!hasFilledMaterial) {
      return true;
    }

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
      const rawMaterials = initializeRawMaterials(formData);
      setFormData(prev => ({ ...prev, rawMaterials }));
    } else if (currentStep === 2) {
      if (!validateStep2()) {
        return;
      }
      // Initialize consumption materials when moving from Step 2 to Step 3
      if (!formData.consumptionMaterials || formData.consumptionMaterials.length === 0) {
        const consumptionMaterials = initializeConsumptionMaterials(formData);
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

  const renderStepContent = () => {
    try {
      switch (currentStep) {
        case 0:
          return <Step0 formData={formData} errors={errors} handleInputChange={handleInputChange} />;
        case 1:
          return (
            <Step1
              formData={formData}
              errors={errors}
              addProduct={addProduct}
              removeProduct={removeProduct}
              addComponent={addComponent}
              removeComponent={removeComponent}
              handleProductNameChange={handleProductNameChange}
              handleComponentChange={handleComponentChange}
              handleComponentCuttingSizeChange={handleComponentCuttingSizeChange}
              handleComponentSewSizeChange={handleComponentSewSizeChange}
            />
          );
        case 2:
          return (
            <Step2
              formData={formData}
              errors={errors}
              handleRawMaterialChange={handleRawMaterialChange}
              handleWorkOrderChange={handleWorkOrderChange}
              addWorkOrder={addWorkOrder}
              removeWorkOrder={removeWorkOrder}
            />
          );
        case 3:
          return (
            <Step3
              formData={formData}
              errors={errors}
              handleConsumptionMaterialChange={handleConsumptionMaterialChange}
              addConsumptionMaterial={addConsumptionMaterial}
              removeConsumptionMaterial={removeConsumptionMaterial}
            />
          );
        case 4:
          return (
            <Step4
              formData={formData}
              errors={errors}
              handleArtworkMaterialChange={handleArtworkMaterialChange}
              addArtworkMaterial={addArtworkMaterial}
              removeArtworkMaterial={removeArtworkMaterial}
            />
          );
        case 5:
          return (
            <Step5
              formData={formData}
              errors={errors}
              handlePackagingChange={handlePackagingChange}
              handlePackagingMaterialChange={handlePackagingMaterialChange}
              handlePackagingMaterialSizeChange={handlePackagingMaterialSizeChange}
              handlePackagingWorkOrderChange={handlePackagingWorkOrderChange}
              addPackagingMaterial={addPackagingMaterial}
              removePackagingMaterial={removePackagingMaterial}
            />
          );
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

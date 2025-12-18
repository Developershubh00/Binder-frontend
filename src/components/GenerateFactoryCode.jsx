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
            const updatedWO = { ...wo, [field]: value };
            // Clear conditional fields when work order changes
            if (field === 'workOrder') {
              if (value !== 'DYEING') {
                updatedWO.dyeingType = '';
                updatedWO.shrinkage = '';
                updatedWO.width = '';
                updatedWO.length = '';
              }
              if (value !== 'WEAVING') {
                updatedWO.weavingType = '';
                updatedWO.warpWeft = '';
                updatedWO.ratio = '';
              }
            }
            // Clear ratio when warpWeft changes away from BOTH
            if (field === 'warpWeft' && value !== 'BOTH') {
              updatedWO.ratio = '';
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
      if (!material.wastage?.trim()) {
        newErrors[`consumptionMaterial_${materialIndex}_wastage`] = 'Wastage is required';
      }
      if (!material.forField?.trim()) {
        newErrors[`consumptionMaterial_${materialIndex}_forField`] = 'FOR is required';
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
      updatedMaterials[materialIndex] = {
        ...updatedMaterials[materialIndex],
        [field]: value
      };
      
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
      if (!material.wastage?.trim()) {
        newErrors[`artworkMaterial_${materialIndex}_wastage`] = 'Wastage is required';
      }
      if (!material.forField?.trim()) {
        newErrors[`artworkMaterial_${materialIndex}_forField`] = 'FOR is required';
      }
      if (!material.packagingWorkOrder?.trim()) {
        newErrors[`artworkMaterial_${materialIndex}_packagingWorkOrder`] = 'Packaging Work Order is required';
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
      updatedMaterials[materialIndex] = {
        ...updatedMaterials[materialIndex],
        [field]: value
      };
      
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
    const sizeRequiredProducts = ['CUSHION', 'FILLER', 'TOTE BAG', 'VELVET CUSHION'];
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
            // Conditional fields for DYEING
            dyeingType: '',
            shrinkage: '',
            width: '',
            length: '',
            // Conditional fields for WEAVING
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
      material.workOrders.forEach((workOrder, woIndex) => {
        if (!workOrder.workOrder?.trim()) {
          newErrors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_workOrder`] = 'Work Order is required';
        }
        if (!workOrder.wastage?.trim()) {
          newErrors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_wastage`] = 'Wastage is required';
        }
        if (!workOrder.forField?.trim()) {
          newErrors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_forField`] = 'FOR is required';
        }
        
        // Validate conditional fields for DYEING
        if (workOrder.workOrder === 'DYEING') {
          if (!workOrder.dyeingType?.trim()) {
            newErrors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_dyeingType`] = 'Dyeing Type is required';
          }
          if (!workOrder.shrinkage?.trim()) {
            newErrors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_shrinkage`] = 'Shrinkage is required';
          }
          if (!workOrder.width?.trim()) {
            newErrors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_width`] = 'Width is required';
          }
          if (!workOrder.length?.trim()) {
            newErrors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_length`] = 'Length is required';
          }
        }
        
        // Validate conditional fields for WEAVING
        if (workOrder.workOrder === 'WEAVING') {
          if (!workOrder.weavingType?.trim()) {
            newErrors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_weavingType`] = 'Weaving Type is required';
          }
          if (!workOrder.warpWeft?.trim()) {
            newErrors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_warpWeft`] = 'WARP/WEFT is required';
          }
          if (workOrder.warpWeft === 'BOTH' && !workOrder.ratio?.trim()) {
            newErrors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_ratio`] = 'Ratio is required when WARP/WEFT is BOTH';
          }
        }
      });
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
            <p className="text-sm text-gray-600">Gross consumption calculation with work orders</p>
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
      
      {/* Consumption Materials */}
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

            {/* Row 1: Product, Component */}
            <div className="flex flex-wrap items-start gap-3" style={{ marginBottom: '24px' }}>
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">
                  PRODUCT <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={material.productName}
                  onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'productName', e.target.value)}
                  className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                    errors[`consumptionMaterial_${materialIndex}_productName`] 
                      ? 'border-red-600' 
                      : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                  }`}
                  style={{ padding: '10px 14px', width: '140px', height: '44px' }}
                  onFocus={(e) => {
                    if (!errors[`consumptionMaterial_${materialIndex}_productName`]) {
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = '';
                  }}
                  placeholder="e.g., Cushion"
                  required
                />
              </div>
              
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">
                  COMPONENT <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={material.componentName}
                  onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'componentName', e.target.value)}
                  className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                    errors[`consumptionMaterial_${materialIndex}_componentName`] 
                      ? 'border-red-600' 
                      : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                  }`}
                  style={{ padding: '10px 14px', width: '140px', height: '44px' }}
                  onFocus={(e) => {
                    if (!errors[`consumptionMaterial_${materialIndex}_componentName`]) {
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = '';
                  }}
                  placeholder="e.g., Top Panel"
                  required
                />
              </div>
            </div>

            {/* Row 2: Material Desc, Net CNS/PC, Unit */}
            <div className="flex flex-wrap items-start gap-3" style={{ marginBottom: '24px' }}>
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">
                  MATERIAL DESC <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={material.materialDescription}
                  onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'materialDescription', e.target.value)}
                  className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                    errors[`consumptionMaterial_${materialIndex}_materialDescription`] 
                      ? 'border-red-600' 
                      : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                  }`}
                  style={{ padding: '10px 14px', width: '160px', height: '44px' }}
                  onFocus={(e) => {
                    if (!errors[`consumptionMaterial_${materialIndex}_materialDescription`]) {
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = '';
                  }}
                  placeholder="e.g., Zipper 20cm"
                  required
                />
                {errors[`consumptionMaterial_${materialIndex}_materialDescription`] && (
                  <span className="text-red-600 text-xs mt-1 font-medium">
                    {errors[`consumptionMaterial_${materialIndex}_materialDescription`]}
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
                  onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'netConsumption', e.target.value)}
                  className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                    errors[`consumptionMaterial_${materialIndex}_netConsumption`] 
                      ? 'border-red-600' 
                      : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                  }`}
                  style={{ padding: '10px 14px', width: '110px', height: '44px' }}
                  onFocus={(e) => {
                    if (!errors[`consumptionMaterial_${materialIndex}_netConsumption`]) {
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = '';
                  }}
                  placeholder="0.000"
                  required
                />
                {errors[`consumptionMaterial_${materialIndex}_netConsumption`] && (
                  <span className="text-red-600 text-xs mt-1 font-medium">
                    {errors[`consumptionMaterial_${materialIndex}_netConsumption`]}
                  </span>
                )}
              </div>
              
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">
                  UNIT <span className="text-red-600">*</span>
                </label>
                <select
                  value={material.unit}
                  onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'unit', e.target.value)}
                  className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                    errors[`consumptionMaterial_${materialIndex}_unit`] 
                      ? 'border-red-600' 
                      : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                  }`}
                  style={{ padding: '10px 14px', width: '120px', height: '44px' }}
                  onFocus={(e) => {
                    if (!errors[`consumptionMaterial_${materialIndex}_unit`]) {
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
                {errors[`consumptionMaterial_${materialIndex}_unit`] && (
                  <span className="text-red-600 text-xs mt-1 font-medium">
                    {errors[`consumptionMaterial_${materialIndex}_unit`]}
                  </span>
                )}
              </div>

              {/* GSM field (shown only when UNIT is R METERS) */}
              {material.unit === 'R METERS' && (
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    GSM <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    value={material.gsm || ''}
                    onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'gsm', e.target.value)}
                    className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                      errors[`consumptionMaterial_${materialIndex}_gsm`] 
                        ? 'border-red-600' 
                        : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                    }`}
                    style={{ padding: '10px 14px', width: '100px', height: '44px' }}
                    onFocus={(e) => {
                      if (!errors[`consumptionMaterial_${materialIndex}_gsm`]) {
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = '';
                    }}
                    placeholder="e.g., 200"
                    required
                  />
                  {errors[`consumptionMaterial_${materialIndex}_gsm`] && (
                    <span className="text-red-600 text-xs mt-1 font-medium">
                      {errors[`consumptionMaterial_${materialIndex}_gsm`]}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Row 3: Work Order, Wastage, FOR */}
            <div className="flex flex-wrap items-start gap-3">
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">
                  WORK ORDER <span className="text-red-600">*</span>
                </label>
                <select
                  value={material.workOrder}
                  onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'workOrder', e.target.value)}
                  className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                    errors[`consumptionMaterial_${materialIndex}_workOrder`] 
                      ? 'border-red-600' 
                      : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                  }`}
                  style={{ padding: '10px 14px', width: '140px', height: '44px' }}
                  onFocus={(e) => {
                    if (!errors[`consumptionMaterial_${materialIndex}_workOrder`]) {
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = '';
                  }}
                  required
                >
                  <option value="">Select</option>
                  <option value="Sewing">Sewing</option>
                  <option value="DYEING">DYEING</option>
                  <option value="WEAVING">WEAVING</option>
                  <option value="PRINTING">PRINTING</option>
                  <option value="CUTTING">CUTTING</option>
                  <option value="STITCHING">STITCHING</option>
                </select>
                {errors[`consumptionMaterial_${materialIndex}_workOrder`] && (
                  <span className="text-red-600 text-xs mt-1 font-medium">
                    {errors[`consumptionMaterial_${materialIndex}_workOrder`]}
                  </span>
                )}
              </div>
              
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">
                  WASTAGE % <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={material.wastage}
                  onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'wastage', e.target.value)}
                  className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                    errors[`consumptionMaterial_${materialIndex}_wastage`] 
                      ? 'border-red-600' 
                      : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                  }`}
                  style={{ padding: '10px 14px', width: '100px', height: '44px' }}
                  onFocus={(e) => {
                    if (!errors[`consumptionMaterial_${materialIndex}_wastage`]) {
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = '';
                  }}
                  placeholder="e.g., 2"
                  required
                />
                {errors[`consumptionMaterial_${materialIndex}_wastage`] && (
                  <span className="text-red-600 text-xs mt-1 font-medium">
                    {errors[`consumptionMaterial_${materialIndex}_wastage`]}
                  </span>
                )}
              </div>
              
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">
                  FOR <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={material.forField}
                  onChange={(e) => handleConsumptionMaterialChange(materialIndex, 'forField', e.target.value)}
                  className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                    errors[`consumptionMaterial_${materialIndex}_forField`] 
                      ? 'border-red-600' 
                      : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                  }`}
                  style={{ padding: '10px 14px', width: '160px', height: '44px' }}
                  onFocus={(e) => {
                    if (!errors[`consumptionMaterial_${materialIndex}_forField`]) {
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = '';
                  }}
                  placeholder="e.g., Front Panel"
                  required
                />
                {errors[`consumptionMaterial_${materialIndex}_forField`] && (
                  <span className="text-red-600 text-xs mt-1 font-medium">
                    {errors[`consumptionMaterial_${materialIndex}_forField`]}
                  </span>
                )}
              </div>
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
              <div className="flex flex-wrap items-start gap-3">
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
                  <div className="flex flex-wrap items-start gap-3">
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
                        style={{ padding: '10px 14px', width: '140px', height: '44px' }}
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
                        <option value="DYEING">DYEING</option>
                        <option value="WEAVING">WEAVING</option>
                        <option value="PRINTING">PRINTING</option>
                        <option value="CUTTING">CUTTING</option>
                        <option value="STITCHING">STITCHING</option>
                      </select>
                      {errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_workOrder`] && (
                        <span className="text-red-600 text-xs mt-1 font-medium">
                          {errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_workOrder`]}
                        </span>
                      )}
                    </div>
                    
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
                        style={{ padding: '10px 14px', width: '160px', height: '44px' }}
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
                  </div>
                  
                  {/* Conditional Fields for DYEING */}
                  {workOrder.workOrder === 'DYEING' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg" style={{ padding: '12px', marginTop: '12px' }}>
                      <div className="text-xs font-semibold text-yellow-800 mb-2">
                        DYEING DETAILS
                      </div>
                      <div className="flex flex-wrap items-start gap-3">
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            TYPE <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="text"
                            value={workOrder.dyeingType}
                            onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'dyeingType', e.target.value)}
                            className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                              errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_dyeingType`] 
                                ? 'border-red-600' 
                                : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                            }`}
                            style={{ padding: '10px 14px', width: '120px', height: '44px' }}
                            onFocus={(e) => {
                              if (!errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_dyeingType`]) {
                                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                              }
                            }}
                            onBlur={(e) => {
                              e.target.style.boxShadow = '';
                            }}
                            placeholder="e.g., Solid"
                            required
                          />
                          {errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_dyeingType`] && (
                            <span className="text-red-600 text-xs mt-1 font-medium">
                              {errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_dyeingType`]}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            SHRINKAGE <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="text"
                            value={workOrder.shrinkage}
                            onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'shrinkage', e.target.value)}
                            className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                              errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_shrinkage`] 
                                ? 'border-red-600' 
                                : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                            }`}
                            style={{ padding: '10px 14px', width: '100px', height: '44px' }}
                            onFocus={(e) => {
                              if (!errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_shrinkage`]) {
                                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                              }
                            }}
                            onBlur={(e) => {
                              e.target.style.boxShadow = '';
                            }}
                            placeholder="e.g., 3%"
                            required
                          />
                          {errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_shrinkage`] && (
                            <span className="text-red-600 text-xs mt-1 font-medium">
                              {errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_shrinkage`]}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            WIDTH <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="text"
                            value={workOrder.width}
                            onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'width', e.target.value)}
                            className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                              errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_width`] 
                                ? 'border-red-600' 
                                : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                            }`}
                            style={{ padding: '10px 14px', width: '100px', height: '44px' }}
                            onFocus={(e) => {
                              if (!errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_width`]) {
                                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                              }
                            }}
                            onBlur={(e) => {
                              e.target.style.boxShadow = '';
                            }}
                            placeholder="Enter width"
                            required
                          />
                          {errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_width`] && (
                            <span className="text-red-600 text-xs mt-1 font-medium">
                              {errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_width`]}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            LENGTH <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="text"
                            value={workOrder.length}
                            onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'length', e.target.value)}
                            className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                              errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_length`] 
                                ? 'border-red-600' 
                                : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                            }`}
                            style={{ padding: '10px 14px', width: '100px', height: '44px' }}
                            onFocus={(e) => {
                              if (!errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_length`]) {
                                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                              }
                            }}
                            onBlur={(e) => {
                              e.target.style.boxShadow = '';
                            }}
                            placeholder="e.g., 50"
                            required
                          />
                          {errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_length`] && (
                            <span className="text-red-600 text-xs mt-1 font-medium">
                              {errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_length`]}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Conditional Fields for WEAVING */}
                  {workOrder.workOrder === 'WEAVING' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg" style={{ padding: '12px', marginTop: '12px' }}>
                      <div className="text-xs font-semibold text-yellow-800 mb-2">
                        WEAVING DETAILS
                      </div>
                      <div className="flex flex-wrap items-start gap-3">
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            TYPE <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="text"
                            value={workOrder.weavingType}
                            onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'weavingType', e.target.value)}
                            className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                              errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_weavingType`] 
                                ? 'border-red-600' 
                                : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                            }`}
                            style={{ padding: '10px 14px', width: '120px', height: '44px' }}
                            onFocus={(e) => {
                              if (!errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_weavingType`]) {
                                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                              }
                            }}
                            onBlur={(e) => {
                              e.target.style.boxShadow = '';
                            }}
                            placeholder="e.g., Plain"
                            required
                          />
                          {errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_weavingType`] && (
                            <span className="text-red-600 text-xs mt-1 font-medium">
                              {errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_weavingType`]}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 mb-2">
                            WARP/WEFT <span className="text-red-600">*</span>
                          </label>
                          <select
                            value={workOrder.warpWeft}
                            onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'warpWeft', e.target.value)}
                            className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                              errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_warpWeft`] 
                                ? 'border-red-600' 
                                : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                            }`}
                            style={{ padding: '12px 16px', maxWidth: '200px' }}
                            onFocus={(e) => {
                              if (!errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_warpWeft`]) {
                                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                              }
                            }}
                            onBlur={(e) => {
                              e.target.style.boxShadow = '';
                            }}
                            required
                          >
                            <option value="">Select</option>
                            <option value="WARP">WARP</option>
                            <option value="WEFT">WEFT</option>
                            <option value="BOTH">BOTH</option>
                          </select>
                          {errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_warpWeft`] && (
                            <span className="text-red-600 text-xs mt-1 font-medium">
                              {errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_warpWeft`]}
                            </span>
                          )}
                        </div>
                        
                        {workOrder.warpWeft === 'BOTH' && (
                          <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-2">
                              RATIO <span className="text-red-600">*</span>
                            </label>
                            <input
                              type="text"
                              value={workOrder.ratio}
                              onChange={(e) => handleWorkOrderChange(materialIndex, woIndex, 'ratio', e.target.value)}
                              className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                                errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_ratio`] 
                                  ? 'border-red-600' 
                                  : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                              }`}
                              style={{ padding: '12px 16px', maxWidth: '200px' }}
                              onFocus={(e) => {
                                if (!errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_ratio`]) {
                                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                }
                              }}
                              onBlur={(e) => {
                                e.target.style.boxShadow = '';
                              }}
                              placeholder="Enter ratio"
                              required
                            />
                            {errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_ratio`] && (
                              <span className="text-red-600 text-xs mt-1 font-medium">
                                {errors[`rawMaterial_${materialIndex}_workOrder_${woIndex}_ratio`]}
                              </span>
                            )}
                          </div>
                        )}
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">PART-5 PACKAGING</h2>
        <p className="text-sm text-gray-600">Configure packaging specifications and materials</p>
      </div>

      {/* Header Configuration */}
      <div className="bg-gray-50 rounded-xl border border-gray-200" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 className="text-sm font-bold text-gray-800" style={{ marginBottom: '16px' }}>PACKAGING CONFIGURATION</h3>
        
        <div className="flex flex-wrap items-start gap-3">
          {/* TYPE */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-2">TYPE</label>
            <select
              value={formData.packaging.type}
              onChange={(e) => handlePackagingChange('type', e.target.value)}
              className={getInputStyle('packaging_type')}
              style={{ padding: '10px 14px', width: '130px', height: '44px' }}
            >
              <option value="STANDARD">STANDARD</option>
              <option value="ASSORTED">ASSORTED</option>
            </select>
          </div>

          {/* CASEPACK QTY */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-2">
              CASEPACK <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              value={formData.packaging.casepackQty}
              onChange={(e) => handlePackagingChange('casepackQty', e.target.value)}
              className={getInputStyle('packaging_casepackQty')}
              style={{ padding: '10px 14px', width: '100px', height: '44px' }}
              onFocus={(e) => inputFocusHandler(e, 'packaging_casepackQty')}
              onBlur={inputBlurHandler}
              placeholder="e.g., 25"
            />
            {errors['packaging_casepackQty'] && (
              <span className="text-red-600 text-xs mt-1 font-medium">{errors['packaging_casepackQty']}</span>
            )}
          </div>

          {/* QTY TO BE PACKED */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-2">QTY PACKED</label>
            <select
              value={formData.packaging.qtyToBePacked}
              onChange={(e) => handlePackagingChange('qtyToBePacked', e.target.value)}
              className={getInputStyle('packaging_qtyToBePacked')}
              style={{ padding: '10px 14px', width: '160px', height: '44px' }}
            >
              <option value="AS_PER_PO">AS PER PO</option>
              <option value="CUSTOM_QTY">CUSTOM QTY</option>
            </select>
          </div>

          {/* PRODUCT SELECTION */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-2">PRODUCT</label>
            <select
              value={formData.packaging.productSelection}
              onChange={(e) => handlePackagingChange('productSelection', e.target.value)}
              className={getInputStyle('packaging_productSelection')}
              style={{ padding: '10px 14px', width: '150px', height: '44px' }}
            >
              <option value="">Select Type</option>
              <option value="VELVET CUSHION">VELVET CUSHION</option>
              <option value="CUSHION">CUSHION</option>
              <option value="FILLER">FILLER</option>
              <option value="TOTE BAG">TOTE BAG</option>
              <option value="BEDDING">BEDDING</option>
              <option value="THROW">THROW</option>
              <option value="RUG">RUG</option>
              <option value="OTHER">OTHER</option>
            </select>
          </div>
        </div>

        {/* Custom Qty field */}
        {formData.packaging.qtyToBePacked === 'CUSTOM_QTY' && (
          <div className="flex flex-wrap items-start gap-3" style={{ marginTop: '16px' }}>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">
                CUSTOM QTY <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                value={formData.packaging.customQty}
                onChange={(e) => handlePackagingChange('customQty', e.target.value)}
                className={getInputStyle('packaging_customQty')}
                style={{ padding: '10px 14px', width: '120px', height: '44px' }}
                onFocus={(e) => inputFocusHandler(e, 'packaging_customQty')}
                onBlur={inputBlurHandler}
                placeholder="e.g., 100"
              />
              {errors['packaging_customQty'] && (
                <span className="text-red-600 text-xs mt-1 font-medium">{errors['packaging_customQty']}</span>
              )}
            </div>

            {/* Assorted Pack Toggle */}
            <div className="flex flex-col justify-end" style={{ paddingBottom: '10px' }}>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.packaging.isAssortedPack}
                  onChange={(e) => handlePackagingChange('isAssortedPack', e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700">Is Assorted Pack?</span>
              </label>
            </div>

            {/* Assorted SKU Link */}
            {formData.packaging.isAssortedPack && (
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">
                  SKU LINK <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.packaging.assortedSkuLink}
                  onChange={(e) => handlePackagingChange('assortedSkuLink', e.target.value)}
                  className={getInputStyle('packaging_assortedSkuLink')}
                  style={{ padding: '10px 14px', width: '160px', height: '44px' }}
                  onFocus={(e) => inputFocusHandler(e, 'packaging_assortedSkuLink')}
                  onBlur={inputBlurHandler}
                  placeholder="e.g., SKU-123"
                />
                {errors['packaging_assortedSkuLink'] && (
                  <span className="text-red-600 text-xs mt-1 font-medium">{errors['packaging_assortedSkuLink']}</span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Assorted Pack Info for Type = ASSORTED */}
        {formData.packaging.type === 'ASSORTED' && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700">
              <strong>Assorted Packaging Selected:</strong> Please provide the other SKU Link or IPC# for the assorted pack.
              The same details will be updated for the linked IPC#.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2" style={{ marginTop: '16px', gap: '24px' }}>
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">
                  OTHER SKU LINK / IPC# <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.packaging.assortedSkuLink}
                  onChange={(e) => handlePackagingChange('assortedSkuLink', e.target.value)}
                  className={getInputStyle('packaging_assortedSkuLink')}
                  style={{ padding: '12px 16px' }}
                  onFocus={(e) => inputFocusHandler(e, 'packaging_assortedSkuLink')}
                  onBlur={inputBlurHandler}
                  placeholder="Enter linked SKU or IPC#"
                />
                {errors['packaging_assortedSkuLink'] && (
                  <span className="text-red-600 text-xs mt-1 font-medium">{errors['packaging_assortedSkuLink']}</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Conditional Size Info Banner */}
      {requiresSizeFields(formData.packaging.productSelection) && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-r-lg">
          <p className="text-sm text-blue-700">
            <strong>Size Required:</strong> Since you selected {formData.packaging.productSelection}, 
            width and size information should be mentioned for each packaging material.
          </p>
        </div>
      )}

      {/* Packaging Materials */}
      <div style={{ marginTop: '32px' }}>
        {formData.packaging.materials.map((material, materialIndex) => (
          <div 
            key={materialIndex}
            className="bg-white rounded-lg border-2 border-gray-300"
            style={{ padding: '32px', marginBottom: '40px' }}
          >
            {/* Material Header */}
            <div className="flex justify-between items-center" style={{ marginBottom: '24px' }}>
              <h4 className="text-lg font-semibold text-gray-900">
                MATERIAL #{material.srNo}
              </h4>
              {formData.packaging.materials.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePackagingMaterial(materialIndex)}
                  className="flex items-center gap-2 border px-4 py-2.5 rounded-md cursor-pointer text-sm font-medium transition-all hover:-translate-x-0.5"
                  style={{
                    backgroundColor: '#f3f4f6',
                    borderColor: '#d1d5db',
                    color: '#374151',
                    marginBottom: '24px'
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Remove
                </button>
              )}
            </div>

            {/* Basic Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4" style={{ gap: '24px', marginBottom: '24px' }}>
              {/* PRODUCT */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">
                  PRODUCT <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={material.product}
                  onChange={(e) => handlePackagingMaterialChange(materialIndex, 'product', e.target.value)}
                  className={getInputStyle(`packaging_material_${materialIndex}_product`)}
                  style={{ padding: '12px 16px' }}
                  onFocus={(e) => inputFocusHandler(e, `packaging_material_${materialIndex}_product`)}
                  onBlur={inputBlurHandler}
                  placeholder="e.g., VELVET CUSHION"
                />
                {errors[`packaging_material_${materialIndex}_product`] && (
                  <span className="text-red-600 text-xs mt-1 font-medium">
                    {errors[`packaging_material_${materialIndex}_product`]}
                  </span>
                )}
              </div>

              {/* COMPONENTS */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">COMPONENTS</label>
                <input
                  type="text"
                  value={material.components}
                  onChange={(e) => handlePackagingMaterialChange(materialIndex, 'components', e.target.value)}
                  className={getInputStyle(`packaging_material_${materialIndex}_components`)}
                  style={{ padding: '12px 16px' }}
                  onFocus={(e) => inputFocusHandler(e, `packaging_material_${materialIndex}_components`)}
                  onBlur={inputBlurHandler}
                  placeholder="N/A or component name"
                />
              </div>

              {/* Material Description */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">
                  MATERIAL DESCRIPTION <span className="text-red-600">*</span>
                </label>
                <select
                  value={material.materialDescription}
                  onChange={(e) => handlePackagingMaterialChange(materialIndex, 'materialDescription', e.target.value)}
                  className={getInputStyle(`packaging_material_${materialIndex}_materialDescription`)}
                  style={{ padding: '12px 16px' }}
                >
                  <option value="">Select Material</option>
                  <option value="Corrugated Box">Corrugated Box</option>
                  <option value="Carton Marking">Carton Marking</option>
                  <option value="POLY WRAP">POLY WRAP</option>
                  <option value="Silica Gel">Silica Gel</option>
                  <option value="Foam Sheet">Foam Sheet</option>
                  <option value="Tissue Paper">Tissue Paper</option>
                  <option value="Header Card">Header Card</option>
                  <option value="Hang Tag">Hang Tag</option>
                  <option value="Sticker Label">Sticker Label</option>
                  <option value="OTHER">OTHER</option>
                </select>
                {errors[`packaging_material_${materialIndex}_materialDescription`] && (
                  <span className="text-red-600 text-xs mt-1 font-medium">
                    {errors[`packaging_material_${materialIndex}_materialDescription`]}
                  </span>
                )}
              </div>

              {/* Net Consumption per Pc */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">
                  NET CONSUMPTION/PC <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={material.netConsumptionPerPc}
                  onChange={(e) => handlePackagingMaterialChange(materialIndex, 'netConsumptionPerPc', e.target.value)}
                  className={getInputStyle(`packaging_material_${materialIndex}_netConsumptionPerPc`)}
                  style={{ padding: '12px 16px' }}
                  onFocus={(e) => inputFocusHandler(e, `packaging_material_${materialIndex}_netConsumptionPerPc`)}
                  onBlur={inputBlurHandler}
                  placeholder="e.g., 4 or 0.08"
                />
                {errors[`packaging_material_${materialIndex}_netConsumptionPerPc`] && (
                  <span className="text-red-600 text-xs mt-1 font-medium">
                    {errors[`packaging_material_${materialIndex}_netConsumptionPerPc`]}
                  </span>
                )}
              </div>
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4" style={{ gap: '24px', marginBottom: '24px' }}>
              {/* Unit */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">
                  UNIT <span className="text-red-600">*</span>
                </label>
                <select
                  value={material.unit}
                  onChange={(e) => handlePackagingMaterialChange(materialIndex, 'unit', e.target.value)}
                  className={getInputStyle(`packaging_material_${materialIndex}_unit`)}
                  style={{ padding: '12px 16px' }}
                >
                  <option value="">Select Unit</option>
                  <option value="R METERS">R METERS</option>
                  <option value="CM">CM</option>
                  <option value="Inches">Inches</option>
                  <option value="Meter">Meter</option>
                  <option value="KGS">KGS</option>
                </select>
                {errors[`packaging_material_${materialIndex}_unit`] && (
                  <span className="text-red-600 text-xs mt-1 font-medium">
                    {errors[`packaging_material_${materialIndex}_unit`]}
                  </span>
                )}
              </div>

              {/* Casepack */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2">
                  CASEPACK <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  value={material.casepack}
                  onChange={(e) => handlePackagingMaterialChange(materialIndex, 'casepack', e.target.value)}
                  className={getInputStyle(`packaging_material_${materialIndex}_casepack`)}
                  style={{ padding: '12px 16px' }}
                  onFocus={(e) => inputFocusHandler(e, `packaging_material_${materialIndex}_casepack`)}
                  onBlur={inputBlurHandler}
                  placeholder="e.g., 25"
                />
                {errors[`packaging_material_${materialIndex}_casepack`] && (
                  <span className="text-red-600 text-xs mt-1 font-medium">
                    {errors[`packaging_material_${materialIndex}_casepack`]}
                  </span>
                )}
              </div>

              {/* Placement */}
              <div className="flex flex-col lg:col-span-2">
                <label className="text-sm font-semibold text-gray-700 mb-2">PLACEMENT</label>
                <input
                  type="text"
                  value={material.placement}
                  onChange={(e) => handlePackagingMaterialChange(materialIndex, 'placement', e.target.value)}
                  className={getInputStyle(`packaging_material_${materialIndex}_placement`)}
                  style={{ padding: '12px 16px' }}
                  onFocus={(e) => inputFocusHandler(e, `packaging_material_${materialIndex}_placement`)}
                  onBlur={inputBlurHandler}
                  placeholder="e.g., 1 ON THE CENTER OF THE LARGER SIDE & 1 ON THE ADJACENT SIDE"
                />
              </div>
            </div>

            {/* Size Fields (Conditional) */}
            {requiresSizeFields(formData.packaging.productSelection) && (
              <div className="bg-gray-50 rounded-lg" style={{ padding: '24px', marginBottom: '24px' }}>
                <h5 className="text-sm font-semibold text-gray-700" style={{ marginBottom: '16px' }}>
                  SIZE <span className="text-gray-500 text-xs">(Required for {formData.packaging.productSelection})</span>
                </h5>
                <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: '24px' }}>
                  <div className="flex flex-col">
                    <label className="text-xs font-medium text-gray-600 mb-1">
                      WIDTH <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="number"
                      value={material.size.width}
                      onChange={(e) => handlePackagingMaterialSizeChange(materialIndex, 'width', e.target.value)}
                      className={getInputStyle(`packaging_material_${materialIndex}_size_width`)}
                      style={{ padding: '10px 12px' }}
                      onFocus={(e) => inputFocusHandler(e, `packaging_material_${materialIndex}_size_width`)}
                      onBlur={inputBlurHandler}
                      placeholder="52"
                    />
                    {errors[`packaging_material_${materialIndex}_size_width`] && (
                      <span className="text-red-600 text-xs mt-1">{errors[`packaging_material_${materialIndex}_size_width`]}</span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-medium text-gray-600 mb-1">
                      LENGTH <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="number"
                      value={material.size.length}
                      onChange={(e) => handlePackagingMaterialSizeChange(materialIndex, 'length', e.target.value)}
                      className={getInputStyle(`packaging_material_${materialIndex}_size_length`)}
                      style={{ padding: '10px 12px' }}
                      onFocus={(e) => inputFocusHandler(e, `packaging_material_${materialIndex}_size_length`)}
                      onBlur={inputBlurHandler}
                      placeholder="52"
                    />
                    {errors[`packaging_material_${materialIndex}_size_length`] && (
                      <span className="text-red-600 text-xs mt-1">{errors[`packaging_material_${materialIndex}_size_length`]}</span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-medium text-gray-600 mb-1">
                      HEIGHT <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="number"
                      value={material.size.height}
                      onChange={(e) => handlePackagingMaterialSizeChange(materialIndex, 'height', e.target.value)}
                      className={getInputStyle(`packaging_material_${materialIndex}_size_height`)}
                      style={{ padding: '10px 12px' }}
                      onFocus={(e) => inputFocusHandler(e, `packaging_material_${materialIndex}_size_height`)}
                      onBlur={inputBlurHandler}
                      placeholder="26"
                    />
                    {errors[`packaging_material_${materialIndex}_size_height`] && (
                      <span className="text-red-600 text-xs mt-1">{errors[`packaging_material_${materialIndex}_size_height`]}</span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-medium text-gray-600 mb-1">
                      UNIT <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={material.size.unit}
                      onChange={(e) => handlePackagingMaterialSizeChange(materialIndex, 'unit', e.target.value)}
                      className={getInputStyle(`packaging_material_${materialIndex}_size_unit`)}
                      style={{ padding: '10px 12px' }}
                    >
                      <option value="">Select</option>
                      <option value="CMS">CMS</option>
                      <option value="INCHES">INCHES</option>
                      <option value="MM">MM</option>
                    </select>
                    {errors[`packaging_material_${materialIndex}_size_unit`] && (
                      <span className="text-red-600 text-xs mt-1">{errors[`packaging_material_${materialIndex}_size_unit`]}</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Work Orders */}
            <div className="bg-indigo-50 rounded-lg" style={{ padding: '24px', marginBottom: '24px' }}>
              <h5 className="text-sm font-semibold text-gray-700" style={{ marginBottom: '16px' }}>WORK ORDERS & WASTAGE</h5>
              <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '24px' }}>
                {material.workOrders.map((wo, woIndex) => (
                  <div key={woIndex} className="bg-white rounded-lg p-3 border border-indigo-100">
                    <p className="text-xs font-medium text-indigo-600 mb-2">WORK ORDER SET {woIndex + 1}</p>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="flex flex-col">
                        <label className="text-xs font-medium text-gray-600 mb-1">WORK ORDER</label>
                        <select
                          value={wo.workOrder}
                          onChange={(e) => handlePackagingWorkOrderChange(materialIndex, woIndex, 'workOrder', e.target.value)}
                          className="border rounded-lg text-xs bg-white text-gray-900"
                          style={{ padding: '8px 10px' }}
                        >
                          <option value="">Select</option>
                          <option value="Packaging">Packaging</option>
                          <option value="Printing">Printing</option>
                          <option value="Labeling">Labeling</option>
                          <option value="Assembly">Assembly</option>
                        </select>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-xs font-medium text-gray-600 mb-1">WASTAGE %</label>
                        <input
                          type="number"
                          step="0.1"
                          value={wo.wastage}
                          onChange={(e) => handlePackagingWorkOrderChange(materialIndex, woIndex, 'wastage', e.target.value)}
                          className={getInputStyle(`packaging_material_${materialIndex}_workOrder_${woIndex}_wastage`)}
                          style={{ padding: '8px 10px' }}
                          placeholder="1%"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-xs font-medium text-gray-600 mb-1">FOR</label>
                        <input
                          type="text"
                          value={wo.for}
                          onChange={(e) => handlePackagingWorkOrderChange(materialIndex, woIndex, 'for', e.target.value)}
                          className={getInputStyle(`packaging_material_${materialIndex}_workOrder_${woIndex}_for`)}
                          style={{ padding: '8px 10px' }}
                          placeholder="Product name"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculated Values */}
            <div className="bg-green-50 rounded-lg" style={{ padding: '24px' }}>
              <h5 className="text-sm font-semibold text-gray-700" style={{ marginBottom: '16px' }}>CALCULATED VALUES</h5>
              <div className="grid grid-cols-2 md:grid-cols-5" style={{ gap: '24px' }}>
                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-600 mb-1">NET CONSUMPTION/PC</label>
                  <input
                    type="text"
                    value={material.netConsumptionPerPc || '-'}
                    readOnly
                    className="border rounded-lg text-sm bg-gray-100 text-gray-700"
                    style={{ padding: '10px 12px' }}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-600 mb-1">TOTAL WASTAGE %</label>
                  <input
                    type="text"
                    value={material.totalWastage ? `${material.totalWastage}%` : '-'}
                    readOnly
                    className="border rounded-lg text-sm bg-gray-100 text-gray-700"
                    style={{ padding: '10px 12px' }}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-600 mb-1">UNIT</label>
                  <input
                    type="text"
                    value={material.unit || '-'}
                    readOnly
                    className="border rounded-lg text-sm bg-gray-100 text-gray-700"
                    style={{ padding: '10px 12px' }}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-600 mb-1">OVERAGE %</label>
                  <input
                    type="number"
                    value={material.overage}
                    onChange={(e) => handlePackagingMaterialChange(materialIndex, 'overage', e.target.value)}
                    className="border-2 border-green-300 rounded-lg text-sm bg-white text-gray-900 focus:border-green-500 focus:outline-none"
                    style={{ padding: '10px 12px' }}
                    placeholder="10%"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-600 mb-1">GROSS CONSUMPTION</label>
                  <input
                    type="text"
                    value={material.grossConsumption || '-'}
                    readOnly
                    className="border rounded-lg text-sm bg-green-100 text-green-800 font-semibold"
                    style={{ padding: '10px 12px' }}
                  />
                </div>
              </div>
              {/* <div className="mt-2 text-xs text-gray-500">
                PO QTY: {formData.poQty || '0'} | Formula: (Net Consumption × PO QTY) + Wastage + Overage
              </div> */}
            </div>
          </div>
        ))}

        {/* Add Material Button */}
        <button
          type="button"
          onClick={addPackagingMaterial}
          className=" flex border px-4 py-2.5 rounded-md cursor-pointer text-sm font-medium transition-all hover:-translate-x-0.5"
          style={{
            backgroundColor: '#f3f4f6',
            borderColor: '#d1d5db',
            color: '#374151',
            marginBottom: '24px'
          }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Packaging Material
        </button>
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

            {/* Row 1: Material Desc, Net CNS, Unit */}
            <div style={{ marginBottom: '24px' }}>
              <div className="flex flex-wrap items-start gap-3">
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

                {/* GSM field (shown only when UNIT is R METERS) */}
                {material.unit === 'R METERS' && (
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">
                      GSM <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="number"
                      value={material.gsm || ''}
                      onChange={(e) => handleArtworkMaterialChange(materialIndex, 'gsm', e.target.value)}
                      className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                        errors[`artworkMaterial_${materialIndex}_gsm`] 
                          ? 'border-red-600' 
                          : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                      }`}
                      style={{ padding: '10px 14px', width: '100px', height: '44px' }}
                      onFocus={(e) => {
                        if (!errors[`artworkMaterial_${materialIndex}_gsm`]) {
                          e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                        }
                      }}
                      onBlur={(e) => {
                        e.target.style.boxShadow = '';
                      }}
                      placeholder="e.g., 200"
                      required
                    />
                    {errors[`artworkMaterial_${materialIndex}_gsm`] && (
                      <span className="text-red-600 text-xs mt-1 font-medium">
                        {errors[`artworkMaterial_${materialIndex}_gsm`]}
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              {/* PLACEMENT Field */}
              <div style={{ marginBottom: '24px', marginTop: '24px' }}>
                <div className="flex flex-col" style={{ maxWidth: '600px' }}>
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
              </div>
              
              {/* Conditional Fields for R.Mtr Unit */}
              {(material.unit === 'R.Mtr' || material.unit === 'R METER' || material.unit === 'R METERS') && (
                <div style={{ marginBottom: '24px' }}>
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col" style={{ width: '180px' }}>
                      <label className="text-sm font-semibold text-gray-700 mb-2">
                        Width <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={material.width}
                        onChange={(e) => handleArtworkMaterialChange(materialIndex, 'width', e.target.value)}
                        className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                          errors[`artworkMaterial_${materialIndex}_width`] 
                            ? 'border-red-600' 
                            : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                        }`}
                        style={{ padding: '12px 16px' }}
                        onFocus={(e) => {
                          if (!errors[`artworkMaterial_${materialIndex}_width`]) {
                            e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                          }
                        }}
                        onBlur={(e) => {
                          e.target.style.boxShadow = '';
                        }}
                        placeholder="Enter width"
                        required
                      />
                      {errors[`artworkMaterial_${materialIndex}_width`] && (
                        <span className="text-red-600 text-xs mt-1 font-medium">
                          {errors[`artworkMaterial_${materialIndex}_width`]}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-col" style={{ width: '180px' }}>
                      <label className="text-sm font-semibold text-gray-700 mb-2">
                        Size <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={material.size}
                        onChange={(e) => handleArtworkMaterialChange(materialIndex, 'size', e.target.value)}
                        className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                          errors[`artworkMaterial_${materialIndex}_size`] 
                            ? 'border-red-600' 
                            : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                        }`}
                        style={{ padding: '12px 16px' }}
                        onFocus={(e) => {
                          if (!errors[`artworkMaterial_${materialIndex}_size`]) {
                            e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                          }
                        }}
                        onBlur={(e) => {
                          e.target.style.boxShadow = '';
                        }}
                        placeholder="Enter size"
                        required
                      />
                      {errors[`artworkMaterial_${materialIndex}_size`] && (
                        <span className="text-red-600 text-xs mt-1 font-medium">
                          {errors[`artworkMaterial_${materialIndex}_size`]}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Work Order, Wastage, FOR Row */}
              <div className="flex items-start gap-4" style={{ marginBottom: '24px' }}>
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
                    <option value="STITCHING">STITCHING</option>
                  </select>
                  {errors[`artworkMaterial_${materialIndex}_workOrder`] && (
                    <span className="text-red-600 text-xs mt-1 font-medium">
                      {errors[`artworkMaterial_${materialIndex}_workOrder`]}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-col" style={{ width: '120px' }}>
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    WASTAGE <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={material.wastage}
                    onChange={(e) => handleArtworkMaterialChange(materialIndex, 'wastage', e.target.value)}
                    className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                      errors[`artworkMaterial_${materialIndex}_wastage`] 
                        ? 'border-red-600' 
                        : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                    }`}
                    style={{ padding: '12px 16px' }}
                    onFocus={(e) => {
                      if (!errors[`artworkMaterial_${materialIndex}_wastage`]) {
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = '';
                    }}
                    placeholder="1%"
                    required
                  />
                  {errors[`artworkMaterial_${materialIndex}_wastage`] && (
                    <span className="text-red-600 text-xs mt-1 font-medium">
                      {errors[`artworkMaterial_${materialIndex}_wastage`]}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-col" style={{ width: '250px' }}>
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    FOR <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={material.forField}
                    onChange={(e) => handleArtworkMaterialChange(materialIndex, 'forField', e.target.value)}
                    className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                      errors[`artworkMaterial_${materialIndex}_forField`] 
                        ? 'border-red-600' 
                        : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                    }`}
                    style={{ padding: '12px 16px' }}
                    onFocus={(e) => {
                      if (!errors[`artworkMaterial_${materialIndex}_forField`]) {
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = '';
                    }}
                    placeholder="VELVET CUSHION"
                    required
                  />
                  {errors[`artworkMaterial_${materialIndex}_forField`] && (
                    <span className="text-red-600 text-xs mt-1 font-medium">
                      {errors[`artworkMaterial_${materialIndex}_forField`]}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-col" style={{ width: '180px' }}>
                  <label className="text-sm font-semibold text-gray-700 mb-2">
                    Work Order (PACKAGING) <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={material.packagingWorkOrder}
                    onChange={(e) => handleArtworkMaterialChange(materialIndex, 'packagingWorkOrder', e.target.value)}
                    className={`border-2 rounded-lg text-sm transition-all bg-white text-gray-900 ${
                      errors[`artworkMaterial_${materialIndex}_packagingWorkOrder`] 
                        ? 'border-red-600' 
                        : 'border-[#e5e7eb] focus:border-indigo-500 focus:outline-none'
                    }`}
                    style={{ padding: '12px 16px' }}
                    onFocus={(e) => {
                      if (!errors[`artworkMaterial_${materialIndex}_packagingWorkOrder`]) {
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = '';
                    }}
                    required
                  >
                    <option value="">Select Work Order</option>
                    <option value="PACKAGING">PACKAGING</option>
                    <option value="Sewing">Sewing</option>
                    <option value="DYEING">DYEING</option>
                    <option value="WEAVING">WEAVING</option>
                    <option value="PRINTING">PRINTING</option>
                    <option value="CUTTING">CUTTING</option>
                    <option value="STITCHING">STITCHING</option>
                  </select>
                  {errors[`artworkMaterial_${materialIndex}_packagingWorkOrder`] && (
                    <span className="text-red-600 text-xs mt-1 font-medium">
                      {errors[`artworkMaterial_${materialIndex}_packagingWorkOrder`]}
                    </span>
                  )}
                </div>
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
              width: `${(currentStep / totalSteps) * 100}%`,
              zIndex: 1
            }}
          ></div>
          
          {/* Step numbers */}
          {Array.from({ length: totalSteps + 1 }, (_, i) => (
            <div key={i} className="flex flex-col items-center flex-1 relative" style={{ zIndex: 2 }}>
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-base transition-all ${
                  i <= currentStep
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-600'
                } ${i === currentStep ? 'scale-110 shadow-xl' : ''}`}
                style={{ 
                  width: '40px',
                  height: '40px',
                  boxShadow: i <= currentStep ? '0 4px 12px rgba(102, 126, 234, 0.3)' : 'none'
                }}
              >
                {i}
              </div>
              <div className={`mt-2 text-xs font-medium text-center max-w-20 ${
                i <= currentStep ? 'text-indigo-600 font-semibold' : 'text-gray-500'
              }`} style={{ marginTop: '8px', fontSize: '10px', lineHeight: '1.2' }}>
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

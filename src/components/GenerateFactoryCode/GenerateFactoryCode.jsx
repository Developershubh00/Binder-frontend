import { useState, useEffect, useRef } from 'react';
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
  const scrollContainerRef = useRef(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedSku, setSelectedSku] = useState('product_0'); // Format: 'product_0' or 'subproduct_0_1'
  const [formData, setFormData] = useState({
    // Step 0 - Multiple SKUs
    buyerCode: '',
    skus: [{
      sku: '',
      product: '',
      poQty: '',
      overagePercentage: '',
      deliveryDueDate: '',
      image: null,
      imagePreview: null,
      subproducts: [], // Array of subproducts for this SKU
      stepData: {
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
        rawMaterials: [],
        consumptionMaterials: [],
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
          width: '',
          size: '',
          gsm: '',
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
      }
    }],
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

  const totalSteps = 4;

  // Step labels for progress bar
  const stepLabels = [
    'Product Spec',
    'Cut & Sew Spec',
    'Raw Material',
    'Artwork & Labeling',
    'Packaging'
  ];

  // Update consumption materials when overage or poQty changes from Step 0
  useEffect(() => {
    if (formData.consumptionMaterials && formData.consumptionMaterials.length > 0 && currentStep === 2) {
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

  // SKU handlers
  const handleSkuChange = (skuIndex, field, value) => {
    setFormData(prev => {
      const updatedSkus = [...prev.skus];
      updatedSkus[skuIndex] = {
        ...updatedSkus[skuIndex],
        [field]: value
      };
      return {
        ...prev,
        skus: updatedSkus
      };
    });
  };

  const handleSkuImageChange = (skuIndex, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => {
          const updatedSkus = [...prev.skus];
          updatedSkus[skuIndex] = {
            ...updatedSkus[skuIndex],
            image: file,
            imagePreview: reader.result
          };
          return {
            ...prev,
            skus: updatedSkus
          };
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper to get initial step data for a new SKU
  const getInitialStepData = () => ({
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
    rawMaterials: [],
    consumptionMaterials: [],
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
      width: '',
      size: '',
      gsm: '',
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

  const addSku = () => {
    setFormData(prev => ({
      ...prev,
      skus: [...prev.skus, {
        sku: '',
        product: '',
        poQty: '',
        overagePercentage: '',
        deliveryDueDate: '',
        image: null,
        imagePreview: null,
        subproducts: [],
        stepData: getInitialStepData(),
      }]
    }));
  };

  // Subproduct handlers
  const addSubproduct = (skuIndex) => {
    setFormData(prev => {
      const updatedSkus = [...prev.skus];
      if (!updatedSkus[skuIndex].subproducts) {
        updatedSkus[skuIndex].subproducts = [];
      }
      updatedSkus[skuIndex].subproducts.push({
        subproduct: '',
        poQty: '',
        overagePercentage: '',
        deliveryDueDate: '',
        image: null,
        imagePreview: null,
        stepData: getInitialStepData(),
      });
      return { ...prev, skus: updatedSkus };
    });
  };

  const removeSubproduct = (skuIndex, subproductIndex) => {
    setFormData(prev => {
      const updatedSkus = [...prev.skus];
      if (updatedSkus[skuIndex].subproducts) {
        updatedSkus[skuIndex].subproducts = updatedSkus[skuIndex].subproducts.filter(
          (_, index) => index !== subproductIndex
        );
      }
      return { ...prev, skus: updatedSkus };
    });
  };

  const handleSubproductChange = (skuIndex, subproductIndex, field, value) => {
    setFormData(prev => {
      const updatedSkus = [...prev.skus];
      if (!updatedSkus[skuIndex].subproducts) {
        updatedSkus[skuIndex].subproducts = [];
      }
      updatedSkus[skuIndex].subproducts[subproductIndex] = {
        ...updatedSkus[skuIndex].subproducts[subproductIndex],
        [field]: value
      };
      return { ...prev, skus: updatedSkus };
    });
  };

  const handleSubproductImageChange = (skuIndex, subproductIndex, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => {
          const updatedSkus = [...prev.skus];
          if (!updatedSkus[skuIndex].subproducts) {
            updatedSkus[skuIndex].subproducts = [];
          }
          updatedSkus[skuIndex].subproducts[subproductIndex] = {
            ...updatedSkus[skuIndex].subproducts[subproductIndex],
            image: file,
            imagePreview: reader.result
          };
          return { ...prev, skus: updatedSkus };
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSku = (skuIndex) => {
    if (formData.skus.length > 1) {
      setFormData(prev => ({
        ...prev,
        skus: prev.skus.filter((_, index) => index !== skuIndex)
      }));
    }
  };

  // Helper functions to parse selectedSku string (format: 'product_0' or 'subproduct_0_1')
  const parseSelectedSku = () => {
    if (typeof selectedSku === 'number') {
      // Backward compatibility: if it's a number, treat as product index
      return { type: 'product', skuIndex: selectedSku };
    }
    const parts = selectedSku.split('_');
    if (parts[0] === 'product') {
      return { type: 'product', skuIndex: parseInt(parts[1]) };
    } else if (parts[0] === 'subproduct') {
      return { type: 'subproduct', skuIndex: parseInt(parts[1]), subproductIndex: parseInt(parts[2]) };
    }
    return { type: 'product', skuIndex: 0 };
  };

  // Helper functions to get/set selected SKU's step data
  const getSelectedSkuStepData = () => {
    const parsed = parseSelectedSku();
    const sku = formData.skus[parsed.skuIndex];
    
    if (!sku) {
      return null;
    }

    // For subproducts, get their stepData, otherwise get SKU's stepData
    if (parsed.type === 'subproduct' && sku.subproducts && sku.subproducts[parsed.subproductIndex]) {
      const subproduct = sku.subproducts[parsed.subproductIndex];
      if (!subproduct.stepData) {
        // Initialize stepData if it doesn't exist
      const updatedSkus = [...formData.skus];
        updatedSkus[parsed.skuIndex].subproducts[parsed.subproductIndex].stepData = getInitialStepData();
        setFormData(prev => ({ ...prev, skus: updatedSkus }));
        return getInitialStepData();
      }
      return subproduct.stepData;
    } else {
      // For products, use SKU's stepData
      if (!sku.stepData) {
        const updatedSkus = [...formData.skus];
        updatedSkus[parsed.skuIndex] = {
          ...updatedSkus[parsed.skuIndex],
        stepData: getInitialStepData()
      };
      setFormData(prev => ({ ...prev, skus: updatedSkus }));
      return getInitialStepData();
    }
      return sku.stepData;
    }
  };

  const updateSelectedSkuStepData = (updater) => {
    setFormData(prev => {
      const parsed = parseSelectedSku();
      const updatedSkus = [...prev.skus];
      if (!updatedSkus[parsed.skuIndex]) return prev;
      
      if (parsed.type === 'subproduct' && updatedSkus[parsed.skuIndex].subproducts) {
        const subproduct = updatedSkus[parsed.skuIndex].subproducts[parsed.subproductIndex];
        if (!subproduct) return prev;
      
        // Ensure stepData exists for subproduct
        if (!subproduct.stepData) {
          subproduct.stepData = getInitialStepData();
        }
        
        // Update subproduct's stepData
        updatedSkus[parsed.skuIndex].subproducts[parsed.subproductIndex] = {
          ...subproduct,
          stepData: updater(subproduct.stepData || getInitialStepData())
        };
      } else {
        // For products, update SKU's stepData
        if (!updatedSkus[parsed.skuIndex].stepData) {
          updatedSkus[parsed.skuIndex].stepData = getInitialStepData();
        }
        
        updatedSkus[parsed.skuIndex] = {
          ...updatedSkus[parsed.skuIndex],
          stepData: updater(updatedSkus[parsed.skuIndex].stepData || getInitialStepData())
      };
      }
      
      return { ...prev, skus: updatedSkus };
    });
  };

  // Helpers to decide if a row has any user input (for optional navigation)
  const isRawMaterialFilled = (material = {}) => {
    const hasWorkOrderSelection = material.workOrders?.some(wo => wo?.workOrder?.trim());
    return Boolean(
      material.materialType?.trim() ||
      material.materialDescription?.trim() ||
      material.netConsumption?.toString().trim() ||
      material.unit?.trim() ||
      material.fiberType?.trim() ||
      material.yarnType?.trim() ||
      material.fabricName?.trim() ||
      material.trimAccessory?.trim() ||
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
    
    // Validate each SKU
    formData.skus.forEach((sku, index) => {
      if (!sku.sku?.trim()) {
        newErrors[`sku_${index}`] = 'SKU / Item No. is required';
      }
      if (!sku.image) {
        newErrors[`image_${index}`] = 'Image is required';
      }
      if (!sku.product?.trim()) {
        newErrors[`product_${index}`] = 'Product is required';
      }
      if (!sku.poQty) {
        newErrors[`poQty_${index}`] = 'PO Qty is required';
      }
      if (!sku.overagePercentage?.trim()) {
        newErrors[`overagePercentage_${index}`] = 'Overage % is required';
      }
      if (!sku.deliveryDueDate) {
        newErrors[`deliveryDueDate_${index}`] = 'Delivery Due Date is required';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    // Get selected SKU's step data
    const stepData = getSelectedSkuStepData();
    if (!stepData || !stepData.products) {
      newErrors['products'] = 'Products data is required';
      setErrors(newErrors);
      return false;
    }
    
    // Validate products and their components
    stepData.products.forEach((product, productIndex) => {
      // Product name validation removed
      
      // Validate components for each product
      product.components.forEach((component, componentIndex) => {
        if (!component.productComforter?.trim()) {
          newErrors[`product_${productIndex}_component_${componentIndex}_productComforter`] = 'Product/Comforter is required';
        }
        if (!component.unit?.trim()) {
          newErrors[`product_${productIndex}_component_${componentIndex}_unit`] = 'Unit is required';
        }
        if (!component.gsm && component.gsm !== 0) {
          newErrors[`product_${productIndex}_component_${componentIndex}_gsm`] = 'GSM is required';
        }
        if (!component.wastage && component.wastage !== 0) {
          newErrors[`product_${productIndex}_component_${componentIndex}_wastage`] = 'Wastage is required';
        }
        // Validate cutting size for each component
        if (component.unit === 'KGS') {
          // For KGS, validate consumption field
          if (!component.cuttingSize.consumption && component.cuttingSize.consumption !== 0) {
            newErrors[`product_${productIndex}_component_${componentIndex}_cuttingConsumption`] = 'Cutting Consumption is required';
          }
        } else {
          // For CM, validate length and width
          if (!component.cuttingSize.length && component.cuttingSize.length !== 0) {
            newErrors[`product_${productIndex}_component_${componentIndex}_cuttingLength`] = 'Cutting Length is required';
          }
          if (!component.cuttingSize.width && component.cuttingSize.width !== 0) {
            newErrors[`product_${productIndex}_component_${componentIndex}_cuttingWidth`] = 'Cutting Width is required';
          }
        }
        // Validate sew size for each component
        if (component.unit === 'KGS') {
          // For KGS, validate consumption field
          if (!component.sewSize.consumption && component.sewSize.consumption !== 0) {
            newErrors[`product_${productIndex}_component_${componentIndex}_sewConsumption`] = 'Sew Consumption is required';
          }
        } else {
          // For CM, validate length and width
          if (!component.sewSize.length && component.sewSize.length !== 0) {
            newErrors[`product_${productIndex}_component_${componentIndex}_sewLength`] = 'Length is required';
          }
          if (!component.sewSize.width && component.sewSize.width !== 0) {
            newErrors[`product_${productIndex}_component_${componentIndex}_sewWidth`] = 'Width is required';
          }
        }
      });
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProductNameChange = (productIndex, value) => {
    updateSelectedSkuStepData((stepData) => {
      const updatedProducts = [...stepData.products];
      updatedProducts[productIndex] = {
        ...updatedProducts[productIndex],
        name: value
      };
      return { ...stepData, products: updatedProducts };
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
    updateSelectedSkuStepData((stepData) => {
      const updatedProducts = [...stepData.products];
      updatedProducts[productIndex] = {
        ...updatedProducts[productIndex],
        components: updatedProducts[productIndex].components.map((comp, idx) => {
          if (idx === componentIndex) {
            const updatedComp = { ...comp, [field]: value };
            // When unit changes, clear size fields appropriately
            if (field === 'unit') {
              if (value === 'KGS') {
                // Clear length/width, set consumption to empty
                updatedComp.cuttingSize = { consumption: '' };
                updatedComp.sewSize = { consumption: '' };
              } else if (value === 'CM') {
                // Clear consumption, set length/width to empty
                updatedComp.cuttingSize = { length: '', width: '' };
                updatedComp.sewSize = { length: '', width: '' };
              }
            }
            return updatedComp;
          }
          return comp;
        })
      };
      return { ...stepData, products: updatedProducts };
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
    // Clear size-related errors when unit changes
    if (field === 'unit') {
      setErrors(prev => {
        const newErrors = { ...prev };
        // Clear all size-related errors
        delete newErrors[`product_${productIndex}_component_${componentIndex}_gsm`];
        delete newErrors[`product_${productIndex}_component_${componentIndex}_cuttingLength`];
        delete newErrors[`product_${productIndex}_component_${componentIndex}_cuttingWidth`];
        delete newErrors[`product_${productIndex}_component_${componentIndex}_cuttingConsumption`];
        delete newErrors[`product_${productIndex}_component_${componentIndex}_sewLength`];
        delete newErrors[`product_${productIndex}_component_${componentIndex}_sewWidth`];
        delete newErrors[`product_${productIndex}_component_${componentIndex}_sewConsumption`];
        return newErrors;
      });
    }
  };

  const handleComponentCuttingSizeChange = (productIndex, componentIndex, field, value) => {
    updateSelectedSkuStepData((stepData) => {
      const updatedProducts = [...stepData.products];
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
      return { ...stepData, products: updatedProducts };
    });
    
    // Clear error
    const errorKey = field === 'consumption' 
      ? `product_${productIndex}_component_${componentIndex}_cuttingConsumption`
      : `product_${productIndex}_component_${componentIndex}_cutting${field.charAt(0).toUpperCase() + field.slice(1)}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const handleComponentSewSizeChange = (productIndex, componentIndex, field, value) => {
    updateSelectedSkuStepData((stepData) => {
      const updatedProducts = [...stepData.products];
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
      return { ...stepData, products: updatedProducts };
    });
    
    // Clear error
    const errorKey = field === 'consumption'
      ? `product_${productIndex}_component_${componentIndex}_sewConsumption`
      : `product_${productIndex}_component_${componentIndex}_sew${field.charAt(0).toUpperCase() + field.slice(1)}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const addProduct = () => {
    updateSelectedSkuStepData((stepData) => ({
      ...stepData,
      products: [...stepData.products, {
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
    const stepData = getSelectedSkuStepData();
    if (stepData && stepData.products.length > 1) {
      updateSelectedSkuStepData((stepData) => ({
        ...stepData,
        products: stepData.products.filter((_, i) => i !== productIndex)
      }));
    }
  };

  const addComponent = (productIndex) => {
    const stepData = getSelectedSkuStepData();
    if (!stepData) return;
    
    updateSelectedSkuStepData((stepData) => {
      const updatedProducts = [...stepData.products];
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
      return { ...stepData, products: updatedProducts };
    });
  };

  const handleRawMaterialChange = (materialIndex, field, value) => {
    updateSelectedSkuStepData((stepData) => {
      const updatedRawMaterials = [...(stepData.rawMaterials || [])];
      const material = updatedRawMaterials[materialIndex];
      
      // If materialType changes, clear all category-specific fields
      if (field === 'materialType') {
        const clearedMaterial = {
          ...material,
          materialType: value,
          // Clear Fabric fields
          fabricFiberType: '', fabricName: '', fabricComposition: '', gsm: '', fabricSurplus: '', fabricApproval: '', fabricRemarks: '', showFabricAdvancedFilter: false, constructionType: '', weaveKnitType: '', fabricMachineType: '', fabricTestingRequirements: '', fabricFiberCategory: '', fabricOrigin: '', fabricCertifications: '',
          // Clear Yarn fields
          fiberType: '', yarnType: '', spinningMethod: '', yarnComposition: '', yarnCountRange: '', yarnDoublingOptions: '', yarnPlyOptions: '', surplus: '', approval: '', remarks: '', showAdvancedFilter: false, spinningType: '', testingRequirements: '', fiberCategory: '', origin: '', certifications: '',
          // Clear Trim & Accessory fields (all trim/accessory specific fields will be cleared)
          trimAccessory: '',
          // Clear Fiber fields
          fiberTableType: '', fiberFiberType: '', fiberSubtype: '', fiberForm: '', fiberDenier: '', fiberSiliconized: '', fiberConjugateCrimp: '', fiberColour: '', fiberBirdType: '', fiberDownPercentage: '', fiberDownProofRequired: '', fiberWoolType: '', fiberMicron: '', fiberTestingRequirements: [], fiberQty: '', fiberGsm: '', fiberLength: '', fiberWidth: '', fiberQtyType: '', fiberQtyValue: '', fiberSurplus: '', fiberWastage: '', fiberApproval: '', fiberRemarks: '', showFiberAdvancedSpec: false, fiberFiberLength: '', fiberStructure: '', fiberThermalBonded: '', fiberAntiMicrobial: '', fiberFireRetardant: '', fiberCertification: '', fiberLoftFillPower: '', fiberFillPower: '', fiberProcessing: '', fiberOxygenNumber: '', fiberTurbidity: '', fiberOdor: '', fiberTraceability: '', fiberClusterSize: '', fiberLanolinContent: '', fiberTemperatureRegulating: '', fiberMoistureWicking: '', fiberMulesingFree: '', fiberOrganicCertified: '',fiberKapokSource: '', fiberKapokProperties: '', fiberBambooType: '', fiberBambooProperties: '', fiberSilkFlossType: '', fiberSilkFlossGrade: '', fiberRecycledSource: '', fiberRecycledCertification: '', fiberTencelType: '', fiberBlending: '', fiberEcoCertification: '', fiberBiodegradable: '',fiberMicrofiberFiberLength: '', fiberMicrofiberStructure: '', fiberMicrofiberClusterType: '', fiberMicrofiberClusterSize: '', fiberMicrofiberAntiMicrobial: '', fiberMicrofiberHypoallergenic: '', fiberMicrofiberLoftFillPower: '', fiberMicrofiberHandFeel: '', fiberMicrofiberCertification: '',fiberDownAlternativeConstruction: '', fiberDownAlternativeLoftRating: '', fiberDownAlternativeFillPowerEquivalent: '', fiberDownAlternativeWarmthToWeight: '', fiberDownAlternativeWaterResistance: '', fiberDownAlternativeQuickDry: '', fiberDownAlternativeHypoallergenic: '', fiberDownAlternativeAntiMicrobial: '', fiberDownAlternativeVeganCrueltyFree: '', fiberDownAlternativeCertification: '', fiberDownAlternativeMachineWashable: '',
          fiberCottonGrade: '', fiberCottonStapleLength: '', fiberCottonProcessing: '', fiberCottonBonding: '', fiberCottonNeedlePunched: '', fiberCottonFireRetardant: '', fiberCottonDustTrashContent: '', fiberCottonOrganicCertified: '',
          // Clear Foam fields
                    // Clear Foam fields
                    foamTableType: '', foamType: '', foamSubtype: '', foamVaContent: '', foamColour: '', foamThickness: '', foamShape: '', foamShapeRefImage: null, foamSheetPcs: '', foamGsm: '', foamLengthCm: '', foamWidthCm: '', foamKgsCns: '', foamYardageCns: '', foamTestingRequirements: [], foamTestingRequirementsFile: null, foamSurplus: '', foamWastage: '', foamApproval: '', foamRemarks: '', showFoamAdvancedSpec: false, foamShoreHardness: '', foamCellStructure: '', foamCompressionSet: '', foamTensileStrength: '', foamElongation: '', foamWaterResistance: '', foamUvResistance: '', foamFireRetardant: '', foamSurfaceTexture: '', foamAntiSlip: '', foamInterlocking: '', foamCertification: '', foamDensity: '', foamHrType: '', foamHrSubtype: '', foamHrGrade: '', foamHrColour: '', foamHrThickness: '', foamHrShape: '', foamHrShapeRefImage: null, foamHrSheetPcs: '', foamHrGsm: '', foamHrLengthCm: '', foamHrWidthCm: '', foamHrKgsCns: '', foamHrYardageCns: '', foamHrTestingRequirements: [], foamHrSurplus: '', foamHrWastage: '', foamHrApproval: '', foamHrRemarks: '', showFoamHrAdvancedSpec: false, foamHrIld: '', foamHrSupportFactor: '', foamHrResilience: '', foamHrCompressionSet: '', foamHrTensileStrength: '', foamHrElongation: '', foamHrFatigueResistance: '', foamHrFireRetardant: '', foamHrCertification: '', foamHrDensity: '', foamPeEpeType: '', foamPeEpeSubtype: '', foamPeEpeColour: '', foamPeEpeThickness: '', foamPeEpeShape: '', foamPeEpeShapeRefImage: null, foamPeEpeSheetPcs: '', foamPeEpeGsm: '', foamPeEpeLengthCm: '', foamPeEpeWidthCm: '', foamPeEpeKgsCns: '', foamPeEpeYardageCns: '', foamPeEpeTestingRequirements: [], foamPeEpeTestingRequirementsFile: null, foamPeEpeSurplus: '', foamPeEpeWastage: '', foamPeEpeApproval: '', foamPeEpeRemarks: '', showFoamPeEpeAdvancedSpec: false, foamPeEpeCellStructure: '', foamPeEpeLamination: '', foamPeEpeCrossLinked: '', foamPeEpeAntiStatic: '', foamPeEpeWaterResistance: '', foamPeEpeCushioning: '', foamPeEpeFireRetardant: '', foamPeEpeThermalInsulation: '', foamPeEpeCertification: '', foamPeEpeDensity: '', foamPuType: '', foamPuSubtype: '', foamPuGrade: '', foamPuColour: '', foamPuThickness: '', foamPuShape: '', foamPuShapeRefImage: null, foamPuSheetPcs: '', foamPuGsm: '', foamPuLengthCm: '', foamPuWidthCm: '', foamPuKgsCns: '', foamPuYardageCns: '', foamPuTestingRequirements: [], foamPuTestingRequirementsFile: null, foamPuSurplus: '', foamPuWastage: '', foamPuApproval: '', foamPuRemarks: '', showFoamPuAdvancedSpec: false, foamPuIld: '', foamPuSupportFactor: '', foamPuResilience: '', foamPuCellStructure: '', foamPuCompressionSet: '', foamPuTensileStrength: '', foamPuElongation: '', foamPuFireRetardant: '', foamPuAntiMicrobial: '', foamPuDensity: '', foamPuCertification: '', foamRebondedType: '', foamRebondedSubtype: '', foamRebondedChipSource: '', foamRebondedChipSize: '', foamRebondedBonding: '', foamRebondedColour: '', foamRebondedThickness: '', foamRebondedShape: '', foamRebondedShapeRefImage: null, foamRebondedSheetPcs: '', foamRebondedGsm: '', foamRebondedLengthCm: '', foamRebondedWidthCm: '', foamRebondedKgsCns: '', foamRebondedYardageCns: '', foamRebondedTestingRequirements: [], foamRebondedTestingRequirementsFile: null, foamRebondedSurplus: '', foamRebondedWastage: '', foamRebondedApproval: '', foamRebondedRemarks: '', showFoamRebondedAdvancedSpec: false, foamRebondedIld: '', foamRebondedCompressionSet: '', foamRebondedFireRetardant: '', foamRebondedCertification: '', foamRebondedDensity: '', foamGelInfusedType: '', foamGelInfusedBaseFoam: '', foamGelInfusedGelType: '', foamGelInfusedGelContent: '', foamGelInfusedSubtype: '', foamGelInfusedColour: '', foamGelInfusedThickness: '', foamGelInfusedShape: '', foamGelInfusedShapeRefImage: null, foamGelInfusedSheetPcs: '', foamGelInfusedGsm: '', foamGelInfusedLengthCm: '', foamGelInfusedWidthCm: '', foamGelInfusedKgsCns: '', foamGelInfusedYardageCns: '', foamGelInfusedTestingRequirements: [], foamGelInfusedTestingRequirementsFile: null, foamGelInfusedSurplus: '', foamGelInfusedWastage: '', foamGelInfusedApproval: '', foamGelInfusedRemarks: '', showFoamGelInfusedAdvancedSpec: false, foamGelInfusedDensity: '', foamGelInfusedIld: '', foamGelInfusedTemperatureRegulation: '', foamGelInfusedResponseTime: '', foamGelInfusedBreathability: '', foamGelInfusedFireRetardant: '', foamGelInfusedCoolingEffect: '', foamGelInfusedCertification: '', foamLatexType: '', foamLatexLatexType: '', foamLatexNaturalContent: '', foamLatexProcess: '', foamLatexSubtype: '', foamLatexColour: '', foamLatexThickness: '', foamLatexShape: '', foamLatexShapeRefImage: null, foamLatexSheetPcs: '', foamLatexGsm: '', foamLatexLengthCm: '', foamLatexWidthCm: '', foamLatexKgsCns: '', foamLatexYardageCns: '', foamLatexTestingRequirements: [], foamLatexTestingRequirementsFile: null, foamLatexSurplus: '', foamLatexWastage: '', foamLatexApproval: '', foamLatexRemarks: '', showFoamLatexAdvancedSpec: false, foamLatexIld: '', foamLatexResilience: '', foamLatexCompressionSet: '', foamLatexPincorePattern: '', foamLatexZoneConfiguration: '', foamLatexBreathability: '', foamLatexHypoallergenic: '', foamLatexAntiMicrobial: '', foamLatexFireRetardant: '', foamLatexDensity: '', foamLatexCertification: '', foamMemoryType: '', foamMemorySubtype: '', foamMemoryGrade: '', foamMemoryColour: '', foamMemoryThickness: '', foamMemoryShape: '', foamMemoryShapeRefImage: null, foamMemorySheetPcs: '', foamMemoryGsm: '', foamMemoryLengthCm: '', foamMemoryWidthCm: '', foamMemoryKgsCns: '', foamMemoryYardageCns: '', foamMemoryTestingRequirements: [], foamMemoryTestingRequirementsFile: null, foamMemorySurplus: '', foamMemoryWastage: '', foamMemoryApproval: '', foamMemoryRemarks: '', showFoamMemoryAdvancedSpec: false, foamMemoryIld: '', foamMemoryResponseTime: '', foamMemoryTemperatureSensitivity: '', foamMemoryActivationTemperature: '', foamMemoryCompressionSet: '', foamMemoryResilience: '', foamMemoryBreathability: '', foamMemoryInfusion: '', foamMemoryCoolingTechnology: '', foamMemoryFireRetardant: '', foamMemoryVocEmissions: '', foamMemoryDensity: '', foamMemoryCertification: '',
                    // All trim/accessory specific fields should be cleared here - this matches the clearing logic in handleConsumptionMaterialChange
          // For now, we'll initialize them as empty, and they'll be properly initialized when trimAccessory is selected
        };
        updatedRawMaterials[materialIndex] = clearedMaterial;
      } else if (field === 'fiberType') {
        updatedRawMaterials[materialIndex] = {
          ...material,
          fiberType: value,
          // Clear dependent fields when fiber type changes
          yarnType: '',
          spinningMethod: '',
          spinningType: '',
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
      
      return { ...stepData, rawMaterials: updatedRawMaterials };
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
    updateSelectedSkuStepData((stepData) => {
      const updatedRawMaterials = [...(stepData.rawMaterials || [])];
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
                dyeingReference: '',
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
                // FRINGE/TASSELS fields
                fringeType: '',
                fringeMaterial: '',
                dropLength: '',
                tapeHeaderWidth: '',
                fringeColour: '',
                fringeColourRefImage: null,
                fringePlacement: '',
                fringePlacementRefImage: null,
                fringeTestingRequirements: [],
                fringeTestingRequirementsUpload: null,
                fringeQtyType: '',
                fringeQtyPcs: '',
                fringeQtyCnsPerPc: '',
                fringeQtyUpload: null,
                fringeSurplus: '',
                fringeWastage: '',
                fringeApproval: '',
                fringeRemarks: '',
                fringeFinish: '',
                fringeAttachment: '',
                fringeConstruction: '',
                showFringeAdvancedSpec: false,
                // KNITTING fields
                knittingDesignRef: null,
                knittingGauge: '',
                knittingGsm: '',
                knittingWalesRatio: '',
                knittingCoursesRatio: '',
                knittingRatioWeightWales: '',
                knittingRatioWeightCourses: '',
                knittingDesign: '',
                knittingVariant: '',
                showKnittingAdvancedFilter: false,
                // Clear old knitting fields if they exist
                // wales: false,
                // courses: false,
                // ratioWales: '',
                // ratioCourses: '',
                // ratioWeightWales: '',
                // ratioWeightCourses: '',
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

            // KNITTING: Clear DESIGN and VARIANTS when machineType changes
            if (field === 'machineType' && updatedWO.workOrder === 'KNITTING') {
              updatedWO.knittingDesign = '';
              updatedWO.knittingVariant = '';
              updatedWO.knittingGauge = '';
            }

            // KNITTING: Wales/Courses ratio logic (using knittingWalesRatio and knittingCoursesRatio)
            if (field === 'knittingWalesRatio' || field === 'knittingCoursesRatio') {
              const walesRatio = parseFloat(updatedWO.knittingWalesRatio || '0');
              const coursesRatio = parseFloat(updatedWO.knittingCoursesRatio || '0');
              const totalRatio = walesRatio + coursesRatio;
              
              // If both are set and total is not 1, adjust them proportionally
              if (walesRatio > 0 && coursesRatio > 0 && Math.abs(totalRatio - 1) > 0.001) {
                if (field === 'knittingWalesRatio') {
                  // Adjust courses to make total = 1
                  updatedWO.knittingCoursesRatio = Math.max(0, Math.min(1, (1 - walesRatio).toFixed(3)));
                } else {
                  // Adjust wales to make total = 1
                  updatedWO.knittingWalesRatio = Math.max(0, Math.min(1, (1 - coursesRatio).toFixed(3)));
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
      return { ...stepData, rawMaterials: updatedRawMaterials };
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
    updateSelectedSkuStepData((stepData) => {
      const updatedRawMaterials = [...(stepData.rawMaterials || [])];
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
          dyeingReference: '',
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
          // FRINGE/TASSELS fields
          fringeType: '',
          fringeMaterial: '',
          dropLength: '',
          tapeHeaderWidth: '',
          fringeColour: '',
          fringeColourRefImage: null,
          fringePlacement: '',
          fringePlacementRefImage: null,
          fringeTestingRequirements: [],
          fringeTestingRequirementsUpload: null,
          fringeQtyType: '',
          fringeQtyPcs: '',
          fringeQtyCnsPerPc: '',
          fringeQtyUpload: null,
          fringeSurplus: '',
          fringeWastage: '',
          fringeApproval: '',
          fringeRemarks: '',
          fringeFinish: '',
          fringeAttachment: '',
          fringeConstruction: '',
          showFringeAdvancedSpec: false,
          // KNITTING fields
          knittingDesignRef: null,
          knittingGauge: '',
          knittingGsm: '',
          knittingWalesRatio: '',
          knittingCoursesRatio: '',
          knittingRatioWeightWales: '',
          knittingRatioWeightCourses: '',
          knittingDesign: '',
          knittingVariant: '',
          showKnittingAdvancedFilter: false,
        }]
      };
      return { ...stepData, rawMaterials: updatedRawMaterials };
    });
  };

  const addRawMaterialWithType = (materialType, componentName = '') => {
    updateSelectedSkuStepData((stepData) => {
      const mergedFormData = getMergedFormData();
      // Find the product and component index for the selected component
      let productIndex = null;
      let componentIndex = null;
      let productName = '';
      
      if (componentName) {
        (mergedFormData.products || []).forEach((product, pIdx) => {
          (product.components || []).forEach((component, cIdx) => {
            if (component.productComforter === componentName) {
              productIndex = pIdx;
              componentIndex = cIdx;
              productName = product.name;
            }
          });
        });
      }
      
      const baseMaterial = {
        productIndex,
        componentIndex,
        productName,
        componentName: componentName || '', // Use the provided component name
        srNo: (stepData.rawMaterials || []).length + 1,
        materialDescription: '',
        netConsumption: '',
        unit: '',
        materialType: materialType,
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
          dyeingReference: '',
          shrinkageWidth: false,
          shrinkageLength: false,
          shrinkageWidthPercent: '',
          shrinkageLengthPercent: '',
          ratioWidth: '',
          ratioLength: '',
          forSection: '',
          cutType: '',
          cutSize: '',
          dyeingType: '',
          shrinkage: '',
          width: '',
          length: '',
          weavingType: '',
          warpWeft: '',
          ratio: '',
        }],
      };

      // Add fields based on material type
      if (materialType === 'Yarn') {
        Object.assign(baseMaterial, {
          fiberType: '',
          yarnType: '',
          spinningMethod: '',
          yarnComposition: '',
          yarnCountRange: '',
          yarnDoublingOptions: '',
          yarnPlyOptions: '',
          surplus: '',
          approval: '',
          remarks: '',
          showAdvancedFilter: false,
          spinningType: '',
          testingRequirements: '',
          fiberCategory: '',
          origin: '',
          certifications: '',
        });
      } else if (materialType === 'Fabric') {
        Object.assign(baseMaterial, {
          fabricFiberType: '',
          fabricName: '',
          fabricComposition: '',
          gsm: '',
          fabricSurplus: '',
          fabricApproval: '',
          fabricRemarks: '',
          showFabricAdvancedFilter: false,
          constructionType: '',
          weaveKnitType: '',
          fabricMachineType: '',
          fabricTestingRequirements: '',
          fabricFiberCategory: '',
          fabricOrigin: '',
          fabricCertifications: '',
        });
      } else if (materialType === 'Trim & Accessory') {
        // Initialize all trim/accessory fields (similar to addConsumptionMaterial)
        Object.assign(baseMaterial, {
          trimAccessory: '',
          // All trim/accessory fields will be initialized here
          // We'll add the same fields as in addConsumptionMaterial for trim/accessory
        });
        // Import all trim fields from addConsumptionMaterial initialization
        // For now, we'll initialize them as empty, and handleRawMaterialChange will manage them
      } else if (materialType === 'Fiber') {
        Object.assign(baseMaterial, {
          fiberTableType: '',
          fiberFiberType: '',
          fiberSubtype: '',
          fiberBirdType: '',
          fiberDownPercentage: '',
          fiberDownProofRequired: '',
          fiberForm: '',
          fiberDenier: '',
          fiberSiliconized: '',
          fiberConjugateCrimp: '',
          fiberColour: '',
          fiberTestingRequirements: [],
          fiberQty: '',
          fiberGsm: '',
          fiberLength: '',
          fiberWidth: '',
          fiberQtyType: '',
          fiberQtyValue: '',
          fiberSurplus: '',
          fiberWastage: '',
          fiberApproval: '',
          fiberRemarks: '',
          showFiberAdvancedSpec: false,
          // Polyester-Fills Advanced Spec
          fiberFiberLength: '',
          fiberStructure: '',
          fiberThermalBonded: '',
          fiberAntiMicrobial: '',
          fiberFireRetardant: '',
          fiberCertification: '',
          fiberLoftFillPower: '',
          // Down-Feather Advanced Spec
          fiberFillPower: '',
          fiberProcessing: '',
          fiberOxygenNumber: '',
          fiberTurbidity: '',
          fiberOdor: '',
          fiberTraceability: '',
          fiberClusterSize: '',
          // Wool-Natural fields
          fiberWoolType: '',
          fiberMicron: '',
          // Wool-Natural Advanced Spec
          fiberLanolinContent: '',
          fiberTemperatureRegulating: '',
          fiberMoistureWicking: '',
          fiberMulesingFree: '',
          fiberOrganicCertified: '',

          // Specialty-Fills fields
          fiberKapokSource: '',
          fiberKapokProperties: '',
          fiberBambooType: '',
          fiberBambooProperties: '',
          fiberSilkFlossType: '',
          fiberSilkFlossGrade: '',
          fiberRecycledSource: '',
          fiberRecycledCertification: '',
          fiberTencelType: '',
          // Specialty-Fills Advanced Spec
          fiberBlending: '',
          fiberEcoCertification: '',
          fiberBiodegradable: '',

          // Microfiber-Fill Advanced Spec fields
          fiberMicrofiberFiberLength: '',
          fiberMicrofiberStructure: '',
          fiberMicrofiberClusterType: '',
          fiberMicrofiberClusterSize: '',
          fiberMicrofiberAntiMicrobial: '',
          fiberMicrofiberHypoallergenic: '',
          fiberMicrofiberLoftFillPower: '',
          fiberMicrofiberHandFeel: '',
          fiberMicrofiberCertification: '',

          // Down-Alternative fields
          fiberDownAlternativeConstruction: '',
          fiberDownAlternativeLoftRating: '',
          fiberDownAlternativeFillPowerEquivalent: '',
          fiberDownAlternativeWarmthToWeight: '',
          fiberDownAlternativeWaterResistance: '',
          fiberDownAlternativeQuickDry: '',
          fiberDownAlternativeHypoallergenic: '',
          fiberDownAlternativeAntiMicrobial: '',
          fiberDownAlternativeVeganCrueltyFree: '',
          fiberDownAlternativeCertification: '',
          fiberDownAlternativeMachineWashable: '',

          // Cotton-Fill fields
          fiberCottonGrade: '',
          fiberCottonStapleLength: '',
          fiberCottonProcessing: '',
          fiberCottonBonding: '',
          fiberCottonNeedlePunched: '',
          fiberCottonFireRetardant: '',
          fiberCottonDustTrashContent: '',
          fiberCottonOrganicCertified: '',
        });
      } else if (materialType === 'Foam') {
        Object.assign(baseMaterial, {
          foamTableType: '',
          foamType: '',
          foamSubtype: '',
          foamVaContent: '',
          foamColour: '',
          foamThickness: '',
          foamShape: '',
          foamShapeRefImage: null,
          foamSheetPcs: '',
          foamGsm: '',
          foamLengthCm: '',
          foamWidthCm: '',
          foamKgsCns: '',
          foamYardageCns: '',
          foamTestingRequirements: [],
          foamTestingRequirementsFile: null,
          foamSurplus: '',
          foamWastage: '',
          foamApproval: '',
          foamRemarks: '',
          showFoamAdvancedSpec: false,
          foamShoreHardness: '',
          foamCellStructure: '',
          foamCompressionSet: '',
          foamTensileStrength: '',
          foamElongation: '',
          foamWaterResistance: '',
          foamUvResistance: '',
          foamFireRetardant: '',
          foamSurfaceTexture: '',
          foamAntiSlip: '',
          foamInterlocking: '',
          foamCertification: '',
          foamDensity: '',
          // HR-form fields
          foamHrType: '',
          foamHrSubtype: '',
          foamHrGrade: '',
          foamHrColour: '',
          foamHrThickness: '',
          foamHrShape: '',
          foamHrShapeRefImage: null,
          foamHrSheetPcs: '',
          foamHrGsm: '',
          foamHrLengthCm: '',
          foamHrWidthCm: '',
          foamHrKgsCns: '',
          foamHrYardageCns: '',
          foamHrTestingRequirements: [],
          foamHrSurplus: '',
          foamHrWastage: '',
          foamHrApproval: '',
          foamHrRemarks: '',
          showFoamHrAdvancedSpec: false,
          foamHrIld: '',
          foamHrSupportFactor: '',
          foamHrResilience: '',
          foamHrCompressionSet: '',
          foamHrTensileStrength: '',
          foamHrElongation: '',
          foamHrFatigueResistance: '',
          foamHrFireRetardant: '',
          foamHrCertification: '',
          foamHrDensity: '',
          // pe-epe fields
          foamPeEpeType: '',
          foamPeEpeSubtype: '',
          foamPeEpeColour: '',
          foamPeEpeThickness: '',
          foamPeEpeShape: '',
          foamPeEpeShapeRefImage: null,
          foamPeEpeSheetPcs: '',
          foamPeEpeGsm: '',
          foamPeEpeLengthCm: '',
          foamPeEpeWidthCm: '',
          foamPeEpeKgsCns: '',
          foamPeEpeYardageCns: '',
          foamPeEpeTestingRequirements: [],
          foamPeEpeTestingRequirementsFile: null,
          foamPeEpeSurplus: '',
          foamPeEpeWastage: '',
          foamPeEpeApproval: '',
          foamPeEpeRemarks: '',
          showFoamPeEpeAdvancedSpec: false,
          foamPeEpeCellStructure: '',
          foamPeEpeLamination: '',
          foamPeEpeCrossLinked: '',
          foamPeEpeAntiStatic: '',
          foamPeEpeWaterResistance: '',
          foamPeEpeCushioning: '',
          foamPeEpeFireRetardant: '',
          foamPeEpeThermalInsulation: '',
          foamPeEpeCertification: '',
          foamPeEpeDensity: '',
          // pu-foam fields
          foamPuType: '',
          foamPuSubtype: '',
          foamPuGrade: '',
          foamPuColour: '',
          foamPuThickness: '',
          foamPuShape: '',
          foamPuShapeRefImage: null,
          foamPuSheetPcs: '',
          foamPuGsm: '',
          foamPuLengthCm: '',
          foamPuWidthCm: '',
          foamPuKgsCns: '',
          foamPuYardageCns: '',
          foamPuTestingRequirements: [],
          foamPuTestingRequirementsFile: null,
          foamPuSurplus: '',
          foamPuWastage: '',
          foamPuApproval: '',
          foamPuRemarks: '',
          showFoamPuAdvancedSpec: false,
          foamPuIld: '',
          foamPuSupportFactor: '',
          foamPuResilience: '',
          foamPuCellStructure: '',
          foamPuCompressionSet: '',
          foamPuTensileStrength: '',
          foamPuElongation: '',
          foamPuFireRetardant: '',
          foamPuAntiMicrobial: '',
          foamPuDensity: '',
          foamPuCertification: '',
                    // rebonded-foam fields
                    foamRebondedType: '',
                    foamRebondedSubtype: '',
                    foamRebondedChipSource: '',
                    foamRebondedChipSize: '',
                    foamRebondedBonding: '',
                    foamRebondedColour: '',
                    foamRebondedThickness: '',
                    foamRebondedShape: '',
                    foamRebondedShapeRefImage: null,
                    foamRebondedSheetPcs: '',
                    foamRebondedGsm: '',
                    foamRebondedLengthCm: '',
                    foamRebondedWidthCm: '',
                    foamRebondedKgsCns: '',
                    foamRebondedYardageCns: '',
                    foamRebondedTestingRequirements: [],
                    foamRebondedTestingRequirementsFile: null,
                    foamRebondedSurplus: '',
                    foamRebondedWastage: '',
                    foamRebondedApproval: '',
                    foamRebondedRemarks: '',
                    showFoamRebondedAdvancedSpec: false,
                    foamRebondedIld: '',
                    foamRebondedCompressionSet: '',
                    foamRebondedFireRetardant: '',
                    foamRebondedCertification: '',
                    foamRebondedDensity: '',
                    // gel-infused-foam fields
                    foamGelInfusedType: '',
                    foamGelInfusedBaseFoam: '',
                    foamGelInfusedGelType: '',
                    foamGelInfusedGelContent: '',
                    foamGelInfusedSubtype: '',
                    foamGelInfusedColour: '',
                    foamGelInfusedThickness: '',
                    foamGelInfusedShape: '',
                    foamGelInfusedShapeRefImage: null,
                    foamGelInfusedSheetPcs: '',
                    foamGelInfusedGsm: '',
                    foamGelInfusedLengthCm: '',
                    foamGelInfusedWidthCm: '',
                    foamGelInfusedKgsCns: '',
                    foamGelInfusedYardageCns: '',
                    foamGelInfusedTestingRequirements: [],
                    foamGelInfusedTestingRequirementsFile: null,
                    foamGelInfusedSurplus: '',
                    foamGelInfusedWastage: '',
                    foamGelInfusedApproval: '',
                    foamGelInfusedRemarks: '',
                    showFoamGelInfusedAdvancedSpec: false,
                    foamGelInfusedDensity: '',
                    foamGelInfusedIld: '',
                    foamGelInfusedTemperatureRegulation: '',
                    foamGelInfusedResponseTime: '',
                    foamGelInfusedBreathability: '',
                    foamGelInfusedFireRetardant: '',
                    foamGelInfusedCoolingEffect: '',
                    foamGelInfusedCertification: '',
                    // latex-foam fields
          foamLatexType: '',
          foamLatexLatexType: '',
          foamLatexNaturalContent: '',
          foamLatexProcess: '',
          foamLatexSubtype: '',
          foamLatexColour: '',
          foamLatexThickness: '',
          foamLatexShape: '',
          foamLatexShapeRefImage: null,
          foamLatexSheetPcs: '',
          foamLatexGsm: '',
          foamLatexLengthCm: '',
          foamLatexWidthCm: '',
          foamLatexKgsCns: '',
          foamLatexYardageCns: '',
          foamLatexTestingRequirements: [],
          foamLatexTestingRequirementsFile: null,
          foamLatexSurplus: '',
          foamLatexWastage: '',
          foamLatexApproval: '',
          foamLatexRemarks: '',
          showFoamLatexAdvancedSpec: false,
          foamLatexIld: '',
          foamLatexResilience: '',
          foamLatexCompressionSet: '',
          foamLatexPincorePattern: '',
          foamLatexZoneConfiguration: '',
          foamLatexBreathability: '',
          foamLatexHypoallergenic: '',
          foamLatexAntiMicrobial: '',
          foamLatexFireRetardant: '',
          foamLatexDensity: '',
          foamLatexCertification: '',
          // memory-foam fields
          foamMemoryType: '',
          foamMemorySubtype: '',
          foamMemoryGrade: '',
          foamMemoryColour: '',
          foamMemoryThickness: '',
          foamMemoryShape: '',
          foamMemoryShapeRefImage: null,
          foamMemorySheetPcs: '',
          foamMemoryGsm: '',
          foamMemoryLengthCm: '',
          foamMemoryWidthCm: '',
          foamMemoryKgsCns: '',
          foamMemoryYardageCns: '',
          foamMemoryTestingRequirements: [],
          foamMemoryTestingRequirementsFile: null,
          foamMemorySurplus: '',
          foamMemoryWastage: '',
          foamMemoryApproval: '',
          foamMemoryRemarks: '',
          showFoamMemoryAdvancedSpec: false,
          foamMemoryIld: '',
          foamMemoryResponseTime: '',
          foamMemoryTemperatureSensitivity: '',
          foamMemoryActivationTemperature: '',
          foamMemoryCompressionSet: '',
          foamMemoryResilience: '',
          foamMemoryBreathability: '',
          foamMemoryInfusion: '',
          foamMemoryCoolingTechnology: '',
          foamMemoryFireRetardant: '',
          foamMemoryVocEmissions: '',
          foamMemoryDensity: '',
          foamMemoryCertification: '',
        });
      }

      return {
        ...stepData,
        rawMaterials: [...(stepData.rawMaterials || []), baseMaterial]
      };
    });
  };

  const handleSaveStep2 = () => {
    // Save functionality for Step2
    console.log('Saving Step2 data');
    // You can add actual save logic here (API call, etc.)
  };

  const validateStep3 = () => {
    const newErrors = {};

    const stepData = getSelectedSkuStepData();
    const materials = (stepData && stepData.consumptionMaterials) || [];
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
    updateSelectedSkuStepData((stepData) => {
      if (!stepData.consumptionMaterials || !stepData.consumptionMaterials[materialIndex]) {
        return stepData;
      }
      const updatedMaterials = [...stepData.consumptionMaterials];
      const currentMaterial = updatedMaterials[materialIndex];
      
      // If trimAccessory changes, clear all category-specific fields
      if (field === 'trimAccessory') {
        const clearedMaterial = {
          ...currentMaterial,
          trimAccessory: value,
          // Clear all conditional fields
          zipNumber: '', zipType: '', brand: '', teeth: '', puller: '', pullerType: '', length: '',
          velcroPart: '', velcroType: '', velcroMaterial: '', velcroAttachment: '', velcroPlacement: '', velcroPlacementReferenceImage: null, velcroSizeSpec: '', velcroLengthCm: '', velcroWidthCm: '', velcroYardageCns: '', velcroKgsCns: '', velcroTestingRequirements: '', velcroTestingRequirementFile: null, velcroQty: '', velcroKgsPerPc: '', velcroYardagePerPc: '', velcroSurplus: '', velcroWastage: '', velcroApproval: '', velcroRemarks: '', velcroColour: '', velcroColorReference: null, velcroHookDensity: '', velcroLoopType: '', velcroCycleLife: '', velcroFlameRetardant: '', showVelcroAdvancedSpec: false,
          threadType: '', fibreContent: '', countTicketNo: '', ply: '', threadFinish: '', usage: '',
          buttonType: '', buttonMaterial: '', buttonSize: '', buttonLigne: '', buttonHoles: '', buttonFinishColour: '', buttonPlacement: '', buttonTestingRequirements: '', buttonDropdown: '', buttonMultiselect: '', buttonQty: '', buttonSurplus: '', buttonWastage: '', buttonApproval: '', buttonRemarks: '', buttonTestingRequirementFile: null, buttonColorReference: null, buttonReferenceImage: null, buttonAttachment: '', buttonFunction: '', buttonLogo: '', showButtonsAdvancedSpec: false,
          rivetType: '', rivetMaterial: '', rivetCapSize: '', rivetPostHeight: '', rivetFinishPlating: '', rivetPlacement: '', rivetPlacementReferenceImage: null, rivetTestingRequirements: '', rivetTestingRequirementFile: null, rivetQty: '', rivetSurplus: '', rivetWastage: '', rivetApproval: '', rivetRemarks: '', rivetLogo: '', rivetSetting: '', showRivetAdvancedSpec: false,
          niwarType: '', niwarMaterial: '', niwarWidth: '', niwarThickness: '', niwarColour: '', finishCoating: '', tensileStrength: '',
          laceType: '', laceMaterial: '', laceWidth: '', laceColour: '', laceFinishing: '', laceUsage: '', designReference: '',
          interliningType: '', interliningMaterial: '', interliningAdhesiveType: '', interliningColour: '', interliningPlacement: '', interliningPlacementReferenceImage: null, interliningSizeSpec: '', interliningGsm: '', interliningLength: '', interliningWidth: '', interliningQty: '', interliningKgs: '', interliningYardage: '', interliningTestingRequirements: '', interliningSurplus: '', interliningWastage: '', interliningApproval: '', interliningRemarks: '', interliningDotDensity: '', interliningStretch: '', interliningFusingSpec: '', interliningHandFeel: '', showInterliningAdvancedSpec: false,
          hookEyeType: '', hookEyeMaterial: '', hookEyeSize: '', hookEyeColour: '', hookEyeFinish: '', strength: '', application: '',
          buckleType: '', buckleMaterial: '', buckleSize: '', buckleFinishColour: '', buckleFunction: '', buckleTensileStrength: '',
          bucklesType: '', bucklesMaterial: '', bucklesSize: '', bucklesFinishColour: '', bucklesPlacement: '', bucklesTestingRequirements: '', bucklesQty: '', bucklesSurplus: '', bucklesWastage: '', bucklesApproval: '', bucklesRemarks: '', bucklesFunction: '', bucklesTensileStrength: '', bucklesSafety: '', bucklesReferenceImage: null, showBucklesAdvancedSpec: false,
          eyeletType: '', eyeletMaterial: '', innerDiameter: '', outerDiameter: '', eyeletColour: '', eyeletApplication: '', tooling: '',
          elasticType: '', elasticMaterial: '', elasticWidth: '', elasticColour: '', stretchTension: '', elasticPacking: '',
          feltType: '', feltMaterial: '', feltColour: '', feltColorReference: null, feltSizeSpec: '', feltGsm: '', feltLengthCm: '', feltYardage: '', feltWidthCm: '', feltKgs: '', feltQty: '', feltTestingRequirements: '', feltSurplus: '', feltWastage: '', feltApproval: '', feltRemarks: '', feltThickness: '', feltFinishForm: '', feltApplication: '', feltStiffness: '', showFeltAdvancedSpec: false,
          shoulderPadType: '', shoulderPadMaterial: '', shoulderPadSize: '', shape: '', covering: '', shoulderPadAttachment: '', weight: '',
          tubularType: '', tubularMaterial: '', widthDiameter: '', weightDensity: '', tubularColour: '', stretchPercent: '', cutting: '',
          rfidType: '', formFactor: '', frequency: '', chipIcType: '', rfidSize: '', coding: '', security: '',
          cableTieType: '', cableTieMaterial: '', cableTieSize: '', cableTieColour: '', cableTiePlacement: '', cableTieTensileStrength: '', cableTieFinish: '', cableTieUvResistance: '', cableTieTestingRequirements: '', cableTieQty: '', cableTieSurplus: '', cableTieWastage: '', cableTieApproval: '', cableTieRemarks: '', cableTieReferenceImage: null, showCableTieAdvancedSpec: false, cableTieUsage: '',
          fringeType: '', fringeMaterial: '', dropLength: '', tapeWidth: '', fringeColour: '', fringeFinish: '', construction: '',
          pipeType: '', pipeMaterial: '', diameterDimensions: '', pipeLength: '', pipeColour: '', endCaps: '', flexibility: '', pipeUsage: '',
          seamTapeType: '', seamTapeMaterial: '', seamTapeWidth: '', seamTapeColour: '', seamTapeAdhesiveType: '', seamTapePlacement: '', seamTapePlacementReferenceImage: null, seamTapeTestingRequirements: '', seamTapeTestingRequirementFile: null, seamTapeQty: '', seamTapeSurplus: '', seamTapeWastage: '', seamTapeApproval: '', seamTapeRemarks: '', seamTapeApplicationSpec: '', seamTapeElasticity: '', seamTapeBreathability: '', showSeamTapeAdvancedSpec: false,
          adhesiveType: '', materialBase: '', adhesiveApplication: '', viscosity: '', settingTime: '', adhesiveColour: '', applicator: '',
          hemType: '', hemMaterial: '', cutType: '', hemWidth: '', foldType: '', hemColour: '', hemPackaging: '',
          reflectiveTapeType: '', reflectiveTapeMaterial: '', reflectiveTapeColour: '', reflectiveTapeBaseFabric: '', reflectiveTapePlacement: '', reflectiveTapePlacementReferenceImage: null, reflectiveTapeSizeSpec: '', reflectiveTapeGsm: '', reflectiveTapeLengthCm: '', reflectiveTapeWidthCm: '', reflectiveTapeQty: '', reflectiveTapeKgs: '', reflectiveTapeYardage: '', reflectiveTapeTestingRequirements: '', reflectiveTapeTestingRequirementFile: null, reflectiveTapeSurplus: '', reflectiveTapeWastage: '', reflectiveTapeApproval: '', reflectiveTapeRemarks: '', reflectiveTapeCertification: '', reflectiveTapeWashDurability: '', reflectiveTapeReflectivity: '', showReflectiveTapeAdvancedSpec: false,
          frType: '', frMaterial: '', complianceLevel: '', frColour: '', durability: '', frComponents: '',
          repairKitType: '', repairKitMaterial: '', sizeShape: '', repairKitColour: '', repairKitPackaging: '', userApplication: '', contents: '',
          cordStopType: '', cordStopMaterial: '', cordStopSize: '', cordStopColour: '', cordStopLockingMechanism: '', cordStopPlacement: '', cordStopTestingRequirements: '', cordStopDropdown: '', cordStopMultiselect: '', cordStopQty: '', cordStopSurplus: '', cordStopWastage: '', cordStopApproval: '', cordStopRemarks: '', cordStopPlacementReferenceImage: null, cordStopDropdownFile: null, cordStopMultiselectFile: null, cordStopFunction: '', cordStopBreakaway: '', showCordStopAdvancedSpec: false,
          ringsLoopsType: '', ringsLoopsMaterial: '', ringsLoopsSize: '', ringsLoopsThicknessGauge: '', ringsLoopsFinishPlating: '', ringsLoopsPlacement: '', ringsLoopsPlacementReferenceImage: null, ringsLoopsTestingRequirements: '', ringsLoopsTestingRequirementFile: null, ringsLoopsQty: '', ringsLoopsSurplus: '', ringsLoopsWastage: '', ringsLoopsApproval: '', ringsLoopsRemarks: '', ringsLoopsLoadRating: '', ringsLoopsWelded: '', ringsLoopsApplication: '', showRingsLoopsAdvancedSpec: false,
          foamType: '', foamDensity: '', foamThickness: '', shapeId: '', foamColour: '', properties: '', foamAttachment: '',
          pinBarbType: '', pinBarbMaterial: '', pinBarbSize: '', pinBarbColour: '', pinBarbHeadType: '', pinBarbPlacement: '', pinBarbPlacementReferenceImage: null, pinBarbTestingRequirements: '', pinBarbTestingRequirementFile: null, pinBarbQty: '', pinBarbSurplus: '', pinBarbWastage: '', pinBarbApproval: '', pinBarbRemarks: '', pinBarbTensileStrength: '', pinBarbApplication: '', pinBarbMagazineCartridge: '', showPinBarbAdvancedSpec: false,
          magneticClosureType: '', magneticClosureMaterial: '', magneticClosureSize: '', magneticClosureStrength: '', magneticClosurePlacement: '', magneticClosurePlacementReferenceImage: null, magneticClosureTestingRequirements: '', magneticClosureTestingRequirementFile: null, magneticClosureQty: '', magneticClosureSurplus: '', magneticClosureWastage: '', magneticClosureApproval: '', magneticClosureRemarks: '', magneticClosurePolarity: '', magneticClosureApplication: '', magneticClosureEncasing: '', magneticClosureShielding: '', showMagneticClosureAdvancedSpec: false,
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
        const parsed = parseSelectedSku();
        const sku = formData.skus[parsed.skuIndex];
        const overagePercentage = (parsed.type === 'subproduct' && sku?.subproducts?.[parsed.subproductIndex]) 
          ? (sku.subproducts[parsed.subproductIndex].overagePercentage || '0')
          : (sku?.overagePercentage || '0');
        const poQty = (parsed.type === 'subproduct' && sku?.subproducts?.[parsed.subproductIndex]) 
          ? (sku.subproducts[parsed.subproductIndex].poQty || '0')
          : (sku?.poQty || '0');
        updatedMaterials[materialIndex].grossConsumption = calculateGrossConsumption(
          updatedMaterials[materialIndex].netConsumption || '0',
          wastage,
          overagePercentage,
          poQty
        );
      }
      
      return { ...stepData, consumptionMaterials: updatedMaterials };
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
    updateSelectedSkuStepData((stepData) => {
      const newSrNo = (stepData.consumptionMaterials || []).length + 1;
      return {
        ...stepData,
        consumptionMaterials: [...(stepData.consumptionMaterials || []), {
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
          velcroPart: '',
          velcroType: '',
          velcroMaterial: '',
          velcroAttachment: '',
          velcroPlacement: '',
          velcroPlacementReferenceImage: null,
          velcroSizeSpec: '',
          velcroLengthCm: '',
          velcroWidthCm: '',
          velcroYardageCns: '',
          velcroKgsCns: '',
          velcroTestingRequirements: '',
          velcroTestingRequirementFile: null,
          velcroQty: '',
          velcroKgsPerPc: '',
          velcroYardagePerPc: '',
          velcroSurplus: '',
          velcroWastage: '',
          velcroApproval: '',
          velcroRemarks: '',
          velcroColour: '',
          velcroColorReference: null,
          velcroHookDensity: '',
          velcroLoopType: '',
          velcroCycleLife: '',
          velcroFlameRetardant: '',
          showVelcroAdvancedSpec: false,
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
          buttonSize: '',
          buttonLigne: '',
          buttonHoles: '',
          buttonFinishColour: '',
          buttonPlacement: '',
          buttonTestingRequirements: '',
          buttonDropdown: '',
          buttonMultiselect: '',
          buttonQty: '',
          buttonSurplus: '',
          buttonWastage: '',
          buttonApproval: '',
          buttonRemarks: '',
          buttonTestingRequirementFile: null,
          buttonColorReference: null,
          buttonReferenceImage: null,
          buttonAttachment: '',
          buttonFunction: '',
          buttonLogo: '',
          showButtonsAdvancedSpec: false,
          // RIVETS
          rivetType: '',
          rivetMaterial: '',
          rivetCapSize: '',
          rivetPostHeight: '',
          rivetFinishPlating: '',
          rivetPlacement: '',
          rivetPlacementReferenceImage: null,
          rivetTestingRequirements: '',
          rivetTestingRequirementFile: null,
          rivetQty: '',
          rivetSurplus: '',
          rivetWastage: '',
          rivetApproval: '',
          rivetRemarks: '',
          rivetLogo: '',
          rivetSetting: '',
          showRivetAdvancedSpec: false,
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
          interliningAdhesiveType: '',
          interliningColour: '',
          interliningPlacement: '',
          interliningPlacementReferenceImage: null,
          interliningSizeSpec: '',
          interliningGsm: '',
          interliningLength: '',
          interliningWidth: '',
          interliningQty: '',
          interliningKgs: '',
          interliningYardage: '',
          interliningTestingRequirements: '',
          interliningSurplus: '',
          interliningWastage: '',
          interliningApproval: '',
          interliningRemarks: '',
          interliningDotDensity: '',
          interliningStretch: '',
          interliningFusingSpec: '',
          interliningHandFeel: '',
          showInterliningAdvancedSpec: false,
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
          feltColour: '',
          feltColorReference: null,
          feltSizeSpec: '',
          feltGsm: '',
          feltLengthCm: '',
          feltYardage: '',
          feltWidthCm: '',
          feltKgs: '',
          feltQty: '',
          feltTestingRequirements: '',
          feltSurplus: '',
          feltWastage: '',
          feltApproval: '',
          feltRemarks: '',
          feltThickness: '',
          feltFinishForm: '',
          feltApplication: '',
          feltStiffness: '',
          showFeltAdvancedSpec: false,
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
          seamTapePlacement: '',
          seamTapePlacementReferenceImage: null,
          seamTapeTestingRequirements: '',
          seamTapeTestingRequirementFile: null,
          seamTapeQty: '',
          seamTapeSurplus: '',
          seamTapeWastage: '',
          seamTapeApproval: '',
          seamTapeRemarks: '',
          seamTapeApplicationSpec: '',
          seamTapeElasticity: '',
          seamTapeBreathability: '',
          showSeamTapeAdvancedSpec: false,
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
          reflectiveTapeType: '',
          reflectiveTapeMaterial: '',
          reflectiveTapeColour: '',
          reflectiveTapeBaseFabric: '',
          reflectiveTapePlacement: '',
          reflectiveTapePlacementReferenceImage: null,
          reflectiveTapeSizeSpec: '',
          reflectiveTapeGsm: '',
          reflectiveTapeLengthCm: '',
          reflectiveTapeWidthCm: '',
          reflectiveTapeQty: '',
          reflectiveTapeKgs: '',
          reflectiveTapeYardage: '',
          reflectiveTapeTestingRequirements: '',
          reflectiveTapeTestingRequirementFile: null,
          reflectiveTapeSurplus: '',
          reflectiveTapeWastage: '',
          reflectiveTapeApproval: '',
          reflectiveTapeRemarks: '',
          reflectiveTapeCertification: '',
          reflectiveTapeWashDurability: '',
          reflectiveTapeReflectivity: '',
          showReflectiveTapeAdvancedSpec: false,
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
          cordStopLockingMechanism: '',
          cordStopPlacement: '',
          cordStopTestingRequirements: '',
          cordStopDropdown: '',
          cordStopMultiselect: '',
          cordStopQty: '',
          cordStopSurplus: '',
          cordStopWastage: '',
          cordStopApproval: '',
          cordStopRemarks: '',
          cordStopPlacementReferenceImage: null,
          cordStopDropdownFile: null,
          cordStopMultiselectFile: null,
          cordStopFunction: '',
          cordStopBreakaway: '',
          showCordStopAdvancedSpec: false,
          // D-RINGS
          ringsLoopsType: '',
          ringsLoopsMaterial: '',
          ringsLoopsSize: '',
          ringsLoopsThicknessGauge: '',
          ringsLoopsFinishPlating: '',
          ringsLoopsPlacement: '',
          ringsLoopsPlacementReferenceImage: null,
          ringsLoopsTestingRequirements: '',
          ringsLoopsTestingRequirementFile: null,
          ringsLoopsQty: '',
          ringsLoopsSurplus: '',
          ringsLoopsWastage: '',
          ringsLoopsApproval: '',
          ringsLoopsRemarks: '',
          ringsLoopsLoadRating: '',
          ringsLoopsWelded: '',
          ringsLoopsApplication: '',
          showRingsLoopsAdvancedSpec: false,
          // FOAM/WADDING
          foamType: '',
          foamDensity: '',
          foamThickness: '',
          shapeId: '',
          foamColour: '',
          properties: '',
          foamAttachment: '',
          // PIN-BARBS
          pinBarbType: '',
          pinBarbMaterial: '',
          pinBarbSize: '',
          pinBarbColour: '',
          pinBarbHeadType: '',
          pinBarbPlacement: '',
          pinBarbPlacementReferenceImage: null,
          pinBarbTestingRequirements: '',
          pinBarbTestingRequirementFile: null,
          pinBarbQty: '',
          pinBarbSurplus: '',
          pinBarbWastage: '',
          pinBarbApproval: '',
          pinBarbRemarks: '',
          pinBarbTensileStrength: '',
          pinBarbApplication: '',
          pinBarbMagazineCartridge: '',
          showPinBarbAdvancedSpec: false,
          // MAGNETIC CLOSURES
          magneticClosureType: '',
          magneticClosureMaterial: '',
          magneticClosureSize: '',
          magneticClosureStrength: '',
          magneticClosurePlacement: '',
          magneticClosurePlacementReferenceImage: null,
          magneticClosureTestingRequirements: '',
          magneticClosureTestingRequirementFile: null,
          magneticClosureQty: '',
          magneticClosureSurplus: '',
          magneticClosureWastage: '',
          magneticClosureApproval: '',
          magneticClosureRemarks: '',
          magneticClosurePolarity: '',
          magneticClosureApplication: '',
          magneticClosureEncasing: '',
          magneticClosureShielding: '',
          showMagneticClosureAdvancedSpec: false,
        }]
      };
    });
  };

  const removeConsumptionMaterial = (materialIndex) => {
    const stepData = getSelectedSkuStepData();
    if (stepData && stepData.consumptionMaterials && stepData.consumptionMaterials.length > 1) {
      updateSelectedSkuStepData((stepData) => ({
        ...stepData,
        consumptionMaterials: stepData.consumptionMaterials.filter((_, i) => i !== materialIndex).map((material, i) => ({
          ...material,
          srNo: i + 1
        }))
      }));
    }
  };

  const validateStep5 = () => {
    const newErrors = {};
    const stepData = getSelectedSkuStepData();
    const packaging = (stepData && stepData.packaging) || {};
    
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
    
    const stepData = getSelectedSkuStepData();
    if (!stepData || !stepData.artworkMaterials || stepData.artworkMaterials.length === 0) {
      newErrors['artworkMaterials'] = 'At least one artwork material is required';
      setErrors(newErrors);
      return false;
    }
    
    stepData.artworkMaterials.forEach((material, materialIndex) => {
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
    updateSelectedSkuStepData((stepData) => {
      if (!stepData.artworkMaterials || !stepData.artworkMaterials[materialIndex]) {
        return stepData;
      }
      const updatedMaterials = [...stepData.artworkMaterials];
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
          bellyBandType: '', bellyBandMaterial: '', closureFinish: '',
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
      return { ...stepData, artworkMaterials: updatedMaterials };
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
    const stepData = getSelectedSkuStepData();
    if (stepData && stepData.artworkMaterials && stepData.artworkMaterials.length > 1) {
      updateSelectedSkuStepData((stepData) => ({
        ...stepData,
        artworkMaterials: stepData.artworkMaterials.filter((_, i) => i !== materialIndex).map((material, i) => ({
          ...material,
          srNo: i + 1
        }))
      }));
    }
  };

  // Packaging Configuration Change Handler
  const handlePackagingChange = (field, value) => {
    updateSelectedSkuStepData((stepData) => ({
      ...stepData,
      packaging: {
        ...stepData.packaging,
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
    updateSelectedSkuStepData((stepData) => {
      const updatedMaterials = [...stepData.packaging.materials];
      
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
        const parsed = parseSelectedSku();
        const sku = formData.skus[parsed.skuIndex];
        const poQty = parseFloat((parsed.type === 'subproduct' && sku?.subproducts?.[parsed.subproductIndex]) 
          ? (sku.subproducts[parsed.subproductIndex].poQty || '0')
          : (sku?.poQty || '0')) || 0;
        
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
        ...stepData,
        packaging: {
          ...stepData.packaging,
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
    updateSelectedSkuStepData((stepData) => {
      const updatedMaterials = [...stepData.packaging.materials];
      updatedMaterials[materialIndex] = {
        ...updatedMaterials[materialIndex],
        size: {
          ...updatedMaterials[materialIndex].size,
          [field]: value
        }
      };
      return {
        ...stepData,
        packaging: {
          ...stepData.packaging,
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
    updateSelectedSkuStepData((stepData) => {
      const updatedMaterials = [...stepData.packaging.materials];
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
      const parsed = parseSelectedSku();
      const sku = formData.skus[parsed.skuIndex];
      const poQty = parseFloat((parsed.type === 'subproduct' && sku?.subproducts?.[parsed.subproductIndex]) 
        ? (sku.subproducts[parsed.subproductIndex].poQty || '0')
        : (sku?.poQty || '0')) || 0;
      
      const baseConsumption = netConsumption * poQty;
      const wastageAmount = baseConsumption * (totalWastagePercent / 100);
      const overageAmount = baseConsumption * (overage / 100);
      const grossConsumption = baseConsumption + wastageAmount + overageAmount;
      
      updatedMaterials[materialIndex].grossConsumption = grossConsumption.toFixed(4);
      
      return {
        ...stepData,
        packaging: {
          ...stepData.packaging,
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
    updateSelectedSkuStepData((stepData) => ({
      ...stepData,
      packaging: {
        ...stepData.packaging,
        materials: [...stepData.packaging.materials, {
          srNo: stepData.packaging.materials.length + 1,
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
    const stepData = getSelectedSkuStepData();
    if (stepData && stepData.packaging.materials.length > 1) {
      updateSelectedSkuStepData((stepData) => {
        const filteredMaterials = stepData.packaging.materials.filter((_, i) => i !== materialIndex);
        filteredMaterials.forEach((material, i) => {
          material.srNo = i + 1;
        });
        return {
          ...stepData,
          packaging: {
            ...stepData.packaging,
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

  const removeRawMaterial = (materialIndex) => {
    updateSelectedSkuStepData((stepData) => {
      const updatedRawMaterials = [...(stepData.rawMaterials || [])];
      updatedRawMaterials.splice(materialIndex, 1);
      // Update srNo for remaining materials
      updatedRawMaterials.forEach((material, index) => {
        material.srNo = index + 1;
      });
      return { ...stepData, rawMaterials: updatedRawMaterials };
    });
  };

  const removeWorkOrder = (materialIndex, workOrderIndex) => {
    updateSelectedSkuStepData((stepData) => {
      const updatedRawMaterials = [...(stepData.rawMaterials || [])];
      if (updatedRawMaterials[materialIndex] && updatedRawMaterials[materialIndex].workOrders.length > 1) {
        updatedRawMaterials[materialIndex] = {
          ...updatedRawMaterials[materialIndex],
          workOrders: updatedRawMaterials[materialIndex].workOrders.filter((_, idx) => idx !== workOrderIndex)
        };
      }
      return { ...stepData, rawMaterials: updatedRawMaterials };
    });
  };

  const removeComponent = (productIndex, componentIndex) => {
    updateSelectedSkuStepData((stepData) => {
      const updatedProducts = [...stepData.products];
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
      return { ...stepData, products: updatedProducts };
    });
  };

  const validateStep2 = () => {
    const newErrors = {};

    const stepData = getSelectedSkuStepData();
    const materials = (stepData && stepData.rawMaterials) || [];
    let hasFilledMaterial = false;

    console.log('Validating Step2 - Materials:', materials);
    console.log('Materials count:', materials.length);

    materials.forEach((material, materialIndex) => {
      if (!material || !isRawMaterialFilled(material)) {
        console.log(`Skipping material ${materialIndex} - not filled:`, material);
        return;
      }
      hasFilledMaterial = true;
      console.log(`Validating filled material ${materialIndex}:`, material);
      
      // Validate materialType
      if (!material.materialType?.trim()) {
        newErrors[`rawMaterial_${materialIndex}_materialType`] = 'Material Type is required';
      }
      
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
        // FOR field is not required - removed by user request
        
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
            // WARP/WEFT checkboxes removed - they're in the weaving advance table
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

    console.log('Step2 Validation Results:');
    console.log('- Has filled material:', hasFilledMaterial);
    console.log('- Errors:', newErrors);
    console.log('- Error count:', Object.keys(newErrors).length);
    console.log('- Error keys:', Object.keys(newErrors));

    if (!hasFilledMaterial) {
      console.log('No filled materials - allowing to proceed');
      return true;
    }

    const isValid = Object.keys(newErrors).length === 0;
    console.log('Validation result:', isValid);
    if (!isValid) {
      console.log('Validation failed. Please check the following fields:');
      Object.keys(newErrors).forEach(errorKey => {
        console.log(`- ${errorKey}: ${newErrors[errorKey]}`);
      });
    }
    return isValid;
  };

  // Reset selected SKU when going back to step 0
  useEffect(() => {
    if (currentStep === 0) {
      setSelectedSku(0);
    } else if (currentStep > 0 && formData.skus && formData.skus.length > 0) {
      // Ensure selectedSku is valid when moving to steps 1-5
      if (selectedSku >= formData.skus.length) {
        setSelectedSku(0);
      }
    }
  }, [currentStep, formData.skus?.length]);

  const handleNext = () => {
    if (currentStep === 0) {
      if (!validateStep0()) {
        return;
      }
      // When moving from step 0 to step 1, ensure we have a valid SKU selected
      if (formData.skus && formData.skus.length > 0) {
        setSelectedSku(0);
      }
    } else if (currentStep === 1) {
      if (!validateStep1()) {
        return;
      }
      // Don't auto-initialize raw materials - user will select component first
    } else if (currentStep === 2) {
      console.log('handleNext - Step 2 - Validating...');
      const isValid = validateStep2();
      console.log('handleNext - Step 2 - Validation result:', isValid);
      if (!isValid) {
        console.log('handleNext - Step 2 - Validation failed, not proceeding');
        return;
      }
      console.log('handleNext - Step 2 - Validation passed, proceeding to next step');
    } else if (currentStep === 3) {
      if (!validateStep4()) {
        return;
      }
    } else if (currentStep === 4) {
      if (!validateStep5()) {
        return;
      }
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      // Scroll to top after step change
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      // Scroll to top after step change
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const getProgressPercentage = () => {
    return ((currentStep + 1) / (totalSteps + 1)) * 100;
  };

  // Get merged formData with selected SKU's step data for steps 1-5
  const getMergedFormData = () => {
    if (currentStep === 0) {
      return formData;
    }
    
    const stepData = getSelectedSkuStepData();
    if (!stepData) {
      return formData;
    }
    
    // Merge selected SKU's step data with main formData
    return {
      ...formData,
      products: stepData.products || [],
      rawMaterials: stepData.rawMaterials || [],
      consumptionMaterials: stepData.consumptionMaterials || [],
      artworkMaterials: stepData.artworkMaterials || [],
      packaging: stepData.packaging || formData.packaging,
      // Also include SKU-specific data for calculations
      poQty: (() => {
        const parsed = parseSelectedSku();
        const sku = formData.skus[parsed.skuIndex];
        if (parsed.type === 'subproduct' && sku?.subproducts?.[parsed.subproductIndex]) {
          return sku.subproducts[parsed.subproductIndex].poQty || '';
        }
        return sku?.poQty || formData.poQty || '';
      })(),
      overagePercentage: (() => {
        const parsed = parseSelectedSku();
        const sku = formData.skus[parsed.skuIndex];
        if (parsed.type === 'subproduct' && sku?.subproducts?.[parsed.subproductIndex]) {
          return sku.subproducts[parsed.subproductIndex].overagePercentage || '';
        }
        return sku?.overagePercentage || formData.overagePercentage || '';
      })(),
    };
  };

  const renderStepContent = () => {
    try {
      const mergedFormData = getMergedFormData();
      
      switch (currentStep) {
        case 0:
          return (
            <Step0 
              formData={formData} 
              errors={errors} 
              handleInputChange={handleInputChange}
              handleSkuChange={handleSkuChange}
              handleSkuImageChange={handleSkuImageChange}
              addSku={addSku}
              removeSku={removeSku}
              addSubproduct={addSubproduct}
              removeSubproduct={removeSubproduct}
              handleSubproductChange={handleSubproductChange}
              handleSubproductImageChange={handleSubproductImageChange}
            />
          );
        case 1:
          return (
            <Step1
              formData={mergedFormData}
              errors={errors}
              addComponent={addComponent}
              removeComponent={removeComponent}
              handleComponentChange={handleComponentChange}
              handleComponentCuttingSizeChange={handleComponentCuttingSizeChange}
              handleComponentSewSizeChange={handleComponentSewSizeChange}
            />
          );
        case 2:
          return (
            <Step2
              formData={mergedFormData}
              errors={errors}
              handleRawMaterialChange={handleRawMaterialChange}
              handleWorkOrderChange={handleWorkOrderChange}
              addWorkOrder={addWorkOrder}
              removeWorkOrder={removeWorkOrder}
              addRawMaterialWithType={addRawMaterialWithType}
              handleSave={handleSaveStep2}
              removeRawMaterial={removeRawMaterial}
            />
          );
        case 3:
          return (
            <Step4
              formData={mergedFormData}
              errors={errors}
              handleArtworkMaterialChange={handleArtworkMaterialChange}
              addArtworkMaterial={addArtworkMaterial}
              removeArtworkMaterial={removeArtworkMaterial}
            />
          );
        case 4:
          return (
            <Step5
              formData={mergedFormData}
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
    <div ref={scrollContainerRef} className="w-full h-full bg-white rounded-xl shadow-sm overflow-y-auto" style={{ padding: '40px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}>
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
                  // Scroll to top after step change
                  setTimeout(() => {
                    if (scrollContainerRef.current) {
                      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }, 100);
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

      {/* SKU Selector - Show only for steps 1-5 */}
      {currentStep > 0 && formData.skus && formData.skus.length > 0 && (
        <div style={{ 
          marginBottom: '24px', 
          padding: '20px', 
          background: '#f9fafb', 
          borderRadius: '12px', 
          border: '1px solid #e5e7eb' 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 className="text-base font-semibold text-gray-800">Select SKU to Work On</h3>
            <div style={{ 
              padding: '4px 12px', 
              background: '#e0e7ff', 
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              color: '#4338ca'
            }}>
              {formData.skus.length} {formData.skus.length === 1 ? 'SKU' : 'SKUs'} Total
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Products and Subproducts */}
            {formData.skus.map((skuItem, index) => {
              const productId = `product_${index}`;
              const isProductSelected = selectedSku === productId || (typeof selectedSku === 'number' && selectedSku === index);
              
              return (
                <div key={productId} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {/* Product Button */}
              <button
                type="button"
                    onClick={() => setSelectedSku(productId)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                      border: isProductSelected ? '2px solid #667eea' : '1px solid #d1d5db',
                      background: isProductSelected ? '#eef2ff' : '#ffffff',
                      color: isProductSelected ? '#4338ca' : '#374151',
                  fontSize: '14px',
                      fontWeight: isProductSelected ? '600' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: '10px',
                      width: '100%',
                      maxWidth: '300px',
                      boxShadow: isProductSelected ? '0 2px 8px rgba(102, 126, 234, 0.2)' : 'none'
                }}
                onMouseEnter={(e) => {
                      if (!isProductSelected) {
                    e.currentTarget.style.borderColor = '#9ca3af';
                    e.currentTarget.style.background = '#f9fafb';
                  }
                }}
                onMouseLeave={(e) => {
                      if (!isProductSelected) {
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.background = '#ffffff';
                  }
                }}
              >
                {/* Product Image */}
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  border: '1px solid #e5e7eb',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#f9fafb'
                }}>
                  {skuItem.imagePreview ? (
                    <img
                      src={skuItem.imagePreview}
                      alt={`SKU ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  )}
                </div>

                    {/* Product Details */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                        {isProductSelected && (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="6" fill="#667eea" />
                        <path d="M6 8L7.5 9.5L10 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                        <span style={{ fontWeight: '600' }}>Product - SKU #{index + 1}</span>
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                        color: isProductSelected ? '#6366f1' : '#6b7280',
                    marginTop: '4px',
                    textAlign: 'left',
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                        {skuItem.sku || 'No SKU code'} - {skuItem.product || 'No product name'}
                      </div>
                    </div>
                  </button>

                  {/* Subproducts for this SKU */}
                  {skuItem.subproducts && skuItem.subproducts.length > 0 && (
                    <div style={{ marginLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: '2px solid #e5e7eb', paddingLeft: '12px' }}>
                      {skuItem.subproducts.map((subproduct, subproductIndex) => {
                        const subproductId = `subproduct_${index}_${subproductIndex}`;
                        const isSubproductSelected = selectedSku === subproductId;
                        
                        return (
                          <button
                            key={subproductId}
                            type="button"
                            onClick={() => setSelectedSku(subproductId)}
                            style={{
                              padding: '8px 12px',
                              borderRadius: '6px',
                              border: isSubproductSelected ? '2px solid #667eea' : '1px solid #d1d5db',
                              background: isSubproductSelected ? '#eef2ff' : '#ffffff',
                              color: isSubproductSelected ? '#4338ca' : '#374151',
                              fontSize: '13px',
                              fontWeight: isSubproductSelected ? '600' : '500',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                              gap: '8px',
                              width: '100%',
                              maxWidth: '280px',
                              boxShadow: isSubproductSelected ? '0 2px 8px rgba(102, 126, 234, 0.2)' : 'none'
                            }}
                            onMouseEnter={(e) => {
                              if (!isSubproductSelected) {
                                e.currentTarget.style.borderColor = '#9ca3af';
                                e.currentTarget.style.background = '#f9fafb';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isSubproductSelected) {
                                e.currentTarget.style.borderColor = '#d1d5db';
                                e.currentTarget.style.background = '#ffffff';
                              }
                            }}
                          >
                            {/* Subproduct Image */}
                            <div style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '6px',
                              overflow: 'hidden',
                              border: '1px solid #e5e7eb',
                              flexShrink: 0,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: '#f9fafb'
                            }}>
                              {subproduct.imagePreview ? (
                                <img
                                  src={subproduct.imagePreview}
                                  alt={`Subproduct ${subproductIndex + 1}`}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                  }}
                                />
                              ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                  <circle cx="8.5" cy="8.5" r="1.5" />
                                  <polyline points="21 15 16 10 5 21" />
                                </svg>
                              )}
                            </div>

                            {/* Subproduct Details */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%' }}>
                                {isSubproductSelected && (
                                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                    <circle cx="8" cy="8" r="6" fill="#667eea" />
                                    <path d="M6 8L7.5 9.5L10 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                )}
                                <span style={{ fontWeight: '600', fontSize: '12px' }}>Subproduct #{subproductIndex + 1}</span>
                  </div>
                  <div style={{ 
                    fontSize: '11px', 
                                color: isSubproductSelected ? '#6366f1' : '#6b7280',
                    marginTop: '2px',
                    textAlign: 'left',
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                                {skuItem.sku || 'No SKU code'} - {subproduct.subproduct || 'No subproduct name'}
                  </div>
                </div>
              </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

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

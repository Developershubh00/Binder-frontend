import { useState, useEffect, useRef } from 'react';
import TEXTILE_FIBER_DATA from './data/textileFiberData';
import { getFiberTypes, getYarnTypes, getSpinningMethod, getYarnDetails } from './utils/yarnHelpers';
import { initializeRawMaterials, initializeConsumptionMaterials } from './utils/initializers';
import { calculateTotalWastage, calculateGrossConsumption } from './utils/calculations';
import { isShrinkageWidthApplicable, isShrinkageLengthApplicable, DYEING_TYPES } from './data/dyeingData';
import {
  FABRIC_SCHEMA,
  YARN_BASE_SCHEMA,
  STITCHING_THREAD_SCHEMA,
  WORK_ORDER_SCHEMAS,
  TRIM_ACCESSORY_SCHEMAS,
  FOAM_SCHEMAS,
  FIBER_SCHEMAS,
  ARTWORK_SCHEMAS,
  PACKAGING_HEADER_SCHEMA,
  PACKAGING_COMMON_SCHEMA,
  PACKAGING_MATERIAL_SCHEMAS,
  isEmpty,
  validateMaterialAgainstSchema
} from '@/utils/validationSchemas';
import Step0 from './components/steps/Step0';
import Step1 from './components/steps/Step1';
import Step2 from './components/steps/Step2';
import Step3 from './components/steps/Step3';
import Step4 from './components/steps/Step4';
import Step5 from './components/steps/Step5';
import ValidationErrorsDialog from './components/ValidationErrorsDialog';
import { Button } from '@/components/ui/button';
import { FormCard } from '@/components/ui/form-layout';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const GenerateFactoryCode = ({ onBack, initialFormData = {}, onNavigateToCodeCreation, onNavigateToIPO }) => {
  const scrollContainerRef = useRef(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedSku, setSelectedSku] = useState('product_0'); // Format: 'product_0' or 'subproduct_0_1'
  const [showIPCPopup, setShowIPCPopup] = useState(false);
  const [generatedIPCCodes, setGeneratedIPCCodes] = useState([]);
  const [step2ComponentErrorsDialog, setStep2ComponentErrorsDialog] = useState({
    open: false,
    componentErrors: [] // Array of { componentName, errorCount, errors: [{ fieldKey, message }] }
  });
  const [step0Saved, setStep0Saved] = useState(false);
  const [step1Saved, setStep1Saved] = useState(false);
  const [step2SavedComponents, setStep2SavedComponents] = useState(new Set()); // Track saved components in Step-2
  const step3SelectedComponentRef = useRef(''); // Current component selected in Step-3 (for per-component save)
  const [step3Saved, setStep3Saved] = useState(false); // Step-3 = Artwork / Labelling
  const [step3SaveStatus, setStep3SaveStatus] = useState('idle'); // 'idle' | 'success' | 'error'
  const [step4Saved, setStep4Saved] = useState(false); // Last step = Packaging
  const [step4SaveStatus, setStep4SaveStatus] = useState('idle'); // 'idle' | 'success' | 'error'
  const [showSaveMessage, setShowSaveMessage] = useState(false); // Show "save first" message
  const [saveMessage, setSaveMessage] = useState(''); // Message to display
  const [showFactoryCodePopup, setShowFactoryCodePopup] = useState(false);
  const [shippingGroups, setShippingGroups] = useState({}); // { "0-product": 1, "0-sp-0": 2, ... } -> itemId -> groupNum
  const [validationErrorsPopup, setValidationErrorsPopup] = useState({
    open: false,
    messages: []
  });
  const [formData, setFormData] = useState({
    // Internal Purchase Order fields (if provided)
    orderType: initialFormData.orderType || '',
    programName: initialFormData.programName || '',
    ipoCode: initialFormData.ipoCode || '',
    poSrNo: initialFormData.poSrNo || null,
    // Step 0 - Multiple SKUs
    buyerCode: initialFormData.buyerCode || '',
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
              { workOrder: 'Packaging', wastage: '', for: '' },
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
          { workOrder: 'Packaging', wastage: '', for: '' },
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

  const STORAGE_KEY = 'factoryCodeFormData';

  const fileToBase64 = (file) => {
    return new Promise((resolve) => {
      if (!file || !(file instanceof File)) {
        resolve(null);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => resolve({ data: reader.result, name: file.name, type: file.type });
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  };

  const base64ToFile = (base64Obj) => {
    if (!base64Obj || !base64Obj.data) return null;
    try {
      const arr = base64Obj.data.split(',');
      const mime = arr[0].match(/:(.*?);/)?.[1] || base64Obj.type;
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) u8arr[n] = bstr.charCodeAt(n);
      return new File([u8arr], base64Obj.name, { type: mime });
    } catch {
      return null;
    }
  };

  const saveToLocalStorage = async (data) => {
    try {
      const cloned = JSON.parse(JSON.stringify(data, (key, value) => {
        if (value instanceof File) return null;
        return value;
      }));

      for (let i = 0; i < (cloned.skus || []).length; i++) {
        const sku = data.skus[i];
        if (sku?.image instanceof File) {
          cloned.skus[i].imageBase64 = await fileToBase64(sku.image);
        }
        for (let j = 0; j < (sku?.subproducts || []).length; j++) {
          const sub = sku.subproducts[j];
          if (sub?.image instanceof File) {
            cloned.skus[i].subproducts[j].imageBase64 = await fileToBase64(sub.image);
          }
        }
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(cloned));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  };

  const loadFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return null;

      const data = JSON.parse(saved);

      (data.skus || []).forEach((sku) => {
        if (sku.imageBase64) {
          sku.image = base64ToFile(sku.imageBase64);
          sku.imagePreview = sku.imageBase64.data;
        }
        (sku.subproducts || []).forEach((sub) => {
          if (sub.imageBase64) {
            sub.image = base64ToFile(sub.imageBase64);
            sub.imagePreview = sub.imageBase64.data;
          }
        });
      });

      return data;
    } catch (e) {
      console.warn('Failed to load from localStorage:', e);
      return null;
    }
  };

  const clearLocalStorage = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

  useEffect(() => {
    const savedData = loadFromLocalStorage();
    if (!savedData) return;

    const hasInitialFromIPO = initialFormData?.ipoCode || (initialFormData?.programName && (initialFormData?.buyerCode || initialFormData?.type));

    if (!hasInitialFromIPO) {
      setFormData(prev => ({ ...prev, ...savedData }));
      return;
    }

    const draftMatchesContext =
      savedData.programName === initialFormData.programName &&
      (initialFormData.orderType === 'Company'
        ? savedData.type === initialFormData.type
        : String(savedData.buyerCode || '') === String(initialFormData.buyerCode || ''));

    if (draftMatchesContext) {
      setFormData(prev => ({ ...prev, ...savedData }));
    }
  }, []);

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
    setStep0Saved(false); // Any edit invalidates saved state
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
    setStep0Saved(false); // Any edit invalidates saved state
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
    // Clear error for this field when user edits
    const errorKey = `${field}_${skuIndex}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const handleSkuImageChange = (skuIndex, file) => {
    setStep0Saved(false); // Any edit invalidates saved state
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
      // Clear error for image when user uploads
      const errorKey = `image_${skuIndex}`;
      if (errors[errorKey]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[errorKey];
          return newErrors;
        });
      }
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
          { workOrder: 'Packaging', wastage: '', for: '' },
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
    setStep0Saved(false); // Adding SKU invalidates saved state
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

  // Handle Add More SKU from IPC popup
  const handleAddMoreSKUFromPopup = () => {
    setShowIPCPopup(false);
    addSku();
  };

  // Subproduct handlers
  const addSubproduct = (skuIndex) => {
    setStep0Saved(false); // Adding subproduct invalidates saved state
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
    setStep0Saved(false); // Removing subproduct invalidates saved state
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
    setStep0Saved(false); // Any edit invalidates saved state
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
    // Clear error for this subproduct field when user edits
    const errorKey = `subproduct_${skuIndex}_${subproductIndex}_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
    // Also check for subproduct name field without _field suffix
    if (field === 'subproduct' && errors[`subproduct_${skuIndex}_${subproductIndex}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`subproduct_${skuIndex}_${subproductIndex}`];
        return newErrors;
      });
    }
  };

  const handleSubproductImageChange = (skuIndex, subproductIndex, file) => {
    setStep0Saved(false); // Any edit invalidates saved state
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
      // Clear error for subproduct image when user uploads
      const errorKey = `subproduct_${skuIndex}_${subproductIndex}_image`;
      if (errors[errorKey]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[errorKey];
          return newErrors;
        });
      }
    }
  };

  const removeSku = (skuIndex) => {
    setStep0Saved(false); // Removing SKU invalidates saved state
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
      material.subMaterial?.trim() ||
      material.stitchingThreadType?.trim() ||
      material.stitchingThreadFibreContent?.trim() ||
      material.stitchingThreadCountTicket?.trim() ||
      material.stitchingThreadUseType?.trim() ||
      material.stitchingThreadTex?.trim() ||
      material.stitchingThreadPly?.trim() ||
      material.stitchingThreadColour?.trim() ||
      material.stitchingThreadRef?.trim() ||
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

  // Helper to show validation errors popup
  const showValidationErrorsPopup = (errors) => {
    if (!errors || typeof errors !== 'object') return;
    const messages = [...new Set(Object.values(errors).filter(msg => msg && msg.trim()))];
    if (messages.length > 0) {
      setValidationErrorsPopup({
        open: true,
        messages
      });
    }
  };

  const validateStep0 = () => {
    const newErrors = {};

    // Buyer Code or IPO Code required (for both Next and Save/IPC)
    if (!formData.buyerCode?.trim() && !formData.ipoCode?.trim()) {
      newErrors['buyerCode'] = 'Buyer Code or IPO Code is required';
    }
    if (!formData.skus?.length) {
      newErrors['skus'] = 'At least one SKU is required';
    }

    // Validate each SKU
    (formData.skus || []).forEach((sku, skuIndex) => {
      if (!sku.sku?.trim()) {
        newErrors[`sku_${skuIndex}`] = 'SKU / Item No. is required';
      }
      if (!sku.image) {
        newErrors[`image_${skuIndex}`] = 'Image is required';
      }
      if (!sku.product?.trim()) {
        newErrors[`product_${skuIndex}`] = 'Product is required';
      }
      if (!sku.poQty) {
        newErrors[`poQty_${skuIndex}`] = 'PO Qty is required';
      }
      if (!sku.overagePercentage?.trim()) {
        newErrors[`overagePercentage_${skuIndex}`] = 'Overage % is required';
      }
      if (!sku.deliveryDueDate) {
        newErrors[`deliveryDueDate_${skuIndex}`] = 'Delivery Due Date is required';
      }

      // Validate subproducts if any
      if (sku.subproducts && sku.subproducts.length > 0) {
        sku.subproducts.forEach((subproduct, subIndex) => {
          if (!subproduct.subproduct?.trim()) {
            newErrors[`subproduct_${skuIndex}_${subIndex}`] = 'Subproduct name is required';
          }
          if (!subproduct.poQty) {
            newErrors[`subproduct_${skuIndex}_${subIndex}_poQty`] = 'Subproduct PO Qty is required';
          }
          if (!subproduct.overagePercentage?.trim()) {
            newErrors[`subproduct_${skuIndex}_${subIndex}_overagePercentage`] = 'Subproduct Overage % is required';
          }
          if (!subproduct.deliveryDueDate) {
            newErrors[`subproduct_${skuIndex}_${subIndex}_deliveryDueDate`] = 'Subproduct Delivery Due Date is required';
          }
          if (!subproduct.image) {
            newErrors[`subproduct_${skuIndex}_${subIndex}_image`] = 'Subproduct Image is required';
          }
        });
      }
    });
    
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    return { isValid, errors: newErrors };
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    // Get selected SKU's step data
    const stepData = getSelectedSkuStepData();
    if (!stepData || !stepData.products) {
      newErrors['products'] = 'Products data is required';
      setErrors(newErrors);
      return { isValid: false, errors: newErrors };
    }
    
    // Validate products and their components
    stepData.products.forEach((product, productIndex) => {
      // Validate components for each product
      product.components.forEach((component, componentIndex) => {
        if (!component.productComforter?.trim()) {
          newErrors[`product_${productIndex}_component_${componentIndex}_productComforter`] = 'Component name is required';
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
          if (!component.cuttingSize?.consumption && component.cuttingSize?.consumption !== 0) {
            newErrors[`product_${productIndex}_component_${componentIndex}_cuttingConsumption`] = 'Cutting Consumption is required';
          }
        } else {
          // For CM, validate length and width
          if (!component.cuttingSize?.length && component.cuttingSize?.length !== 0) {
            newErrors[`product_${productIndex}_component_${componentIndex}_cuttingLength`] = 'Cutting Length is required';
          }
          if (!component.cuttingSize?.width && component.cuttingSize?.width !== 0) {
            newErrors[`product_${productIndex}_component_${componentIndex}_cuttingWidth`] = 'Cutting Width is required';
          }
        }
        // Validate sew size for each component
        if (component.unit === 'KGS') {
          // For KGS, validate consumption field
          if (!component.sewSize?.consumption && component.sewSize?.consumption !== 0) {
            newErrors[`product_${productIndex}_component_${componentIndex}_sewConsumption`] = 'Sew Consumption is required';
          }
        } else {
          // For CM, validate length and width
          if (!component.sewSize?.length && component.sewSize?.length !== 0) {
            newErrors[`product_${productIndex}_component_${componentIndex}_sewLength`] = 'Sew Length is required';
          }
          if (!component.sewSize?.width && component.sewSize?.width !== 0) {
            newErrors[`product_${productIndex}_component_${componentIndex}_sewWidth`] = 'Sew Width is required';
          }
        }
      });
    });
    
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    return { isValid, errors: newErrors };
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
    setStep1Saved(false); // Any edit invalidates saved state
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
    setStep1Saved(false); // Any edit invalidates saved state
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
    setStep1Saved(false); // Any edit invalidates saved state
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
    setStep1Saved(false); // Adding component invalidates saved state
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
    const stepDataBefore = getSelectedSkuStepData();
    const componentName = stepDataBefore?.rawMaterials?.[materialIndex]?.componentName;
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
    if (componentName) {
      setStep2SavedComponents(prev => {
        const next = new Set(prev);
        next.delete(componentName);
        return next;
      });
    }
    
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
    // Adding a material invalidates saved state for that component
    if (componentName) {
      setStep2SavedComponents(prev => {
        const next = new Set(prev);
        next.delete(componentName);
        return next;
      });
    }
  };

  const handleSaveStep2 = (componentName) => {
    // Save functionality for Step2
    console.log('Saving Step2 data for component:', componentName);
    if (componentName) {
      setStep2SavedComponents(prev => {
        const updated = new Set([...prev, componentName]);
        
        // Check if all components are saved, then hide message
        setTimeout(() => {
          const stepData = getSelectedSkuStepData();
          const componentsWithMaterials = new Set();
          (stepData?.rawMaterials || []).forEach((material) => {
            if (material.componentName) {
              componentsWithMaterials.add(material.componentName);
            }
          });
          const unsavedComponents = Array.from(componentsWithMaterials).filter(
            comp => !updated.has(comp)
          );
          if (unsavedComponents.length === 0) {
            setShowSaveMessage(false);
          }
        }, 0);
        
        return updated;
      });
    }
    saveToLocalStorage(formData);
  };

  const handleSaveStep3 = () => {
    const componentName = step3SelectedComponentRef.current || '';
    if (!componentName?.trim()) {
      setStep3SaveStatus('error');
      setTimeout(() => setStep3SaveStatus('idle'), 3000);
      showValidationErrorsPopup({ artwork_select_component: 'Select a component to save' });
      return;
    }
    const result = validateArtworkComponentMaterials(componentName);
    if (!result.isValid) {
      setStep3SaveStatus('error');
      setTimeout(() => setStep3SaveStatus('idle'), 3000);
      showValidationErrorsPopup(result.errors);
      return;
    }
    setStep3Saved(true);
    setStep3SaveStatus('success');
    setShowSaveMessage(false);
    saveToLocalStorage(formData);
  };

  const handleSaveStep4 = () => {
    const result = validateStep5();
    if (!result.isValid) {
      setStep4SaveStatus('error');
      setTimeout(() => setStep4SaveStatus('idle'), 3000);
      showValidationErrorsPopup(result.errors);
      return;
    }
    setStep4Saved(true);
    setStep4SaveStatus('success');
    setShowSaveMessage(false);
    saveToLocalStorage(formData);
  };

  // Generate IPC code for SKUs and subproducts
  const handleSaveStep0 = () => {
    try {
      // Extract buyer code from ipoCode or use buyerCode directly
      let buyerCode = formData.buyerCode;
      
      // If ipoCode exists, extract buyer code from it
      // Format: CHD/PD/{buyerCode}/... or CHD/SAM/{buyerCode}/... or CHD/SELF/{type}/...
      if (formData.ipoCode && !buyerCode) {
        const parts = formData.ipoCode.split('/');
        if (parts.length >= 3) {
          // For Production/Sampling: CHD/PD/{buyerCode}/...
          // For Company: CHD/SELF/{type}/...
          buyerCode = parts[2];
        }
      }
      
      if (!buyerCode) {
        alert('Buyer Code is required to generate IPC codes');
        return;
      }
      
      const poSrNo = formData.poSrNo || 1;
      const updatedSkus = formData.skus.map((sku, skuIndex) => {
        const ipcNumber = skuIndex + 1;
        
        // Generate IPC code - if subproducts exist, add SP{quantity}
        let ipcCode;
        if (sku.subproducts && sku.subproducts.length > 0) {
          const subproductQuantity = sku.subproducts.length;
          ipcCode = `CHD/${buyerCode}/PO-${poSrNo}/IPC-${ipcNumber}/SP${subproductQuantity}`;
        } else {
          ipcCode = `CHD/${buyerCode}/PO-${poSrNo}/IPC-${ipcNumber}`;
        }
        
        // Update subproducts with the same IPC code as the main product
        const updatedSubproducts = sku.subproducts?.map((subproduct) => {
          return {
            ...subproduct,
            ipcCode: ipcCode // Same IPC code as main product
          };
        }) || [];
        
        return {
          ...sku,
          subproducts: updatedSubproducts,
          ipcCode: ipcCode // Same IPC code for product and all subproducts
        };
      });
      
      // Update formData with IPC codes
      setFormData(prev => ({
        ...prev,
        skus: updatedSkus
      }));
      
      // Save to localStorage
      try {
        const ipcCodes = {
          ipoCode: formData.ipoCode,
          poSrNo: poSrNo,
          buyerCode: buyerCode,
          skus: updatedSkus.map(sku => ({
            sku: sku.sku,
            ipcCode: sku.ipcCode,
            subproducts: sku.subproducts?.map(sp => ({
              subproduct: sp.subproduct,
              ipcCode: sp.ipcCode
            })) || []
          })),
          createdAt: new Date().toISOString()
        };
        
        const existingIPCs = JSON.parse(localStorage.getItem('ipcCodes') || '[]');
        existingIPCs.push(ipcCodes);
        localStorage.setItem('ipcCodes', JSON.stringify(existingIPCs));
        
        // Store generated IPC codes for popup display
        setGeneratedIPCCodes(updatedSkus);
        setShowIPCPopup(true);
        setStep0Saved(true); // Mark Step-0 as saved
        setShowSaveMessage(false); // Hide save message after saving
        console.log('Generated IPC codes:', ipcCodes);
        saveToLocalStorage({ ...formData, skus: updatedSkus });
      } catch (error) {
        console.error('Error saving IPC codes:', error);
        alert('IPC codes generated but failed to save');
      }
      
    } catch (error) {
      console.error('Error generating IPC codes:', error);
      alert('Error generating IPC codes');
    }
  };

  const handleSaveStep1 = () => {
    const result = validateStep1();
    if (!result.isValid) {
      showValidationErrorsPopup(result.errors);
      return;
    }
    setStep1Saved(true);
    setShowSaveMessage(false);
    saveToLocalStorage(formData);
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
          zipNumber: '', zipType: '', brand: '', teeth: '', puller: '', pullerType: '', length: '', showZippersAdvancedSpec: false, zipSliderType: '', zipFinish: '', zipLengthTolerance: '',
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
          showZippersAdvancedSpec: false,
          zipSliderType: '',
          zipFinish: '',
          zipLengthTolerance: '',
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
    const packaging = stepData?.packaging || {};
    
    // === HEADER FIELDS ===
    if (isEmpty(packaging.productSelection)) {
      newErrors['packaging_productSelection'] = 'Product is required';
    }
    if (isEmpty(packaging.type)) {
      newErrors['packaging_type'] = 'Type is required';
    }
    if (isEmpty(packaging.casepackQty)) {
      newErrors['packaging_casepackQty'] = 'Casepack Qty is required';
    }
    
    // If ASSORTED type, require the link
    if (packaging.type === 'ASSORTED (LINK IPC#)' && isEmpty(packaging.assortedSkuLink)) {
      newErrors['packaging_assortedSkuLink'] = 'IPC Link is required for ASSORTED type';
    }
    
    // === PACKAGING MATERIALS ===
    const materials = packaging.materials || [];
    if (materials.length === 0) {
      newErrors['packaging_no_materials'] = 'At least one packaging material is required';
    }
    
    // Validate each packaging material - base + type-specific fields
    materials.forEach((material, materialIndex) => {
      const errorPrefix = `packaging_material_${materialIndex}`;
      
      // === COMMON FIELDS ===
      if (isEmpty(material.components)) {
        newErrors[`${errorPrefix}_components`] = 'Component is required';
      }
      if (isEmpty(material.materialDescription)) {
        newErrors[`${errorPrefix}_materialDescription`] = 'Material Description is required';
      }
      if (isEmpty(material.netConsumptionPerPc)) {
        newErrors[`${errorPrefix}_netConsumptionPerPc`] = 'Net Consumption per Pc is required';
      }
      if (isEmpty(material.unit)) {
        newErrors[`${errorPrefix}_unit`] = 'Unit is required';
      }
      if (isEmpty(material.placement)) {
        newErrors[`${errorPrefix}_placement`] = 'Placement is required';
      }
      const workOrderVal = material.workOrders?.[0]?.workOrder;
      if (isEmpty(workOrderVal)) {
        newErrors[`${errorPrefix}_workOrder`] = 'Work Order is required';
      }
      
      // === PACKAGING MATERIAL TYPE ===
      const packagingType = material.packagingMaterialType?.toString().trim();
      if (isEmpty(packagingType)) {
        newErrors[`${errorPrefix}_packagingMaterialType`] = 'Packaging Material Type is required';
      } else {
        // Validate based on selected packaging material type
        const packagingSchema = PACKAGING_MATERIAL_SCHEMAS[packagingType];
        if (packagingSchema) {
          const packagingResult = validateMaterialAgainstSchema(material, packagingSchema, errorPrefix);
          Object.assign(newErrors, packagingResult.errors);
        }
      }
    });
    
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    return { isValid, errors: newErrors };
  };

  // Validate only artwork materials for a given component (for per-component Save)
  const validateArtworkComponentMaterials = (componentName) => {
    const newErrors = {};
    const stepData = getSelectedSkuStepData();
    const materials = stepData?.artworkMaterials || [];
    const materialsForComponent = materials.filter((m) => (m.components || '') === componentName);

    if (materialsForComponent.length === 0) {
      newErrors['artwork_component_no_materials'] = `Add at least one artwork material for "${componentName}"`;
      setErrors(newErrors);
      return { isValid: false, errors: newErrors };
    }

    materials.forEach((material, materialIndex) => {
      if ((material.components || '') !== componentName) return;

      const errorPrefix = `artworkMaterial_${materialIndex}`;
      const hasAnyData = material.components?.trim() ||
        material.materialDescription?.trim() ||
        material.netConsumption?.toString().trim() ||
        material.unit?.trim() ||
        material.placement?.trim() ||
        material.workOrder?.trim() ||
        material.artworkCategory?.trim();

      if (!hasAnyData) return;

      if (isEmpty(material.components)) {
        newErrors[`${errorPrefix}_components`] = 'Component is required';
      }
      if (isEmpty(material.materialDescription)) {
        newErrors[`${errorPrefix}_materialDescription`] = 'Material Description is required';
      }
      if (isEmpty(material.netConsumption)) {
        newErrors[`${errorPrefix}_netConsumption`] = 'Net Consumption is required';
      }
      if (isEmpty(material.unit)) {
        newErrors[`${errorPrefix}_unit`] = 'Unit is required';
      }
      if (isEmpty(material.placement)) {
        newErrors[`${errorPrefix}_placement`] = 'Placement is required';
      }
      if (isEmpty(material.workOrder)) {
        newErrors[`${errorPrefix}_workOrder`] = 'Work Order is required';
      }

      const artworkCategory = material.artworkCategory?.toString().trim();
      if (artworkCategory) {
        const artworkSchema = ARTWORK_SCHEMAS[artworkCategory];
        if (artworkSchema) {
          const artworkResult = validateMaterialAgainstSchema(material, artworkSchema, errorPrefix);
          Object.assign(newErrors, artworkResult.errors);
        }
      }
    });

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    return { isValid, errors: newErrors };
  };

  const validateStep4 = () => {
    const newErrors = {};
    const stepData = getSelectedSkuStepData();
    const materials = stepData?.artworkMaterials || [];

    // Only validate materials that have a component and have data entered (don't require material 0 or others to be filled)
    const materialsWithData = materials.filter((material) => {
      const hasAnyData = material.components?.trim() ||
        material.materialDescription?.trim() ||
        material.netConsumption?.toString().trim() ||
        material.unit?.trim() ||
        material.placement?.trim() ||
        material.workOrder?.trim() ||
        material.artworkCategory?.trim();
      return hasAnyData;
    });

    if (materialsWithData.length === 0) {
      newErrors['artwork_no_materials'] = 'At least one artwork/labelling material is required';
    }

    materials.forEach((material, materialIndex) => {
      const errorPrefix = `artworkMaterial_${materialIndex}`;
      const hasAnyData = material.components?.trim() ||
        material.materialDescription?.trim() ||
        material.netConsumption?.toString().trim() ||
        material.unit?.trim() ||
        material.placement?.trim() ||
        material.workOrder?.trim() ||
        material.artworkCategory?.trim();

      if (!hasAnyData) return;

      if (isEmpty(material.components)) {
        newErrors[`${errorPrefix}_components`] = 'Component is required';
      }
      if (isEmpty(material.materialDescription)) {
        newErrors[`${errorPrefix}_materialDescription`] = 'Material Description is required';
      }
      if (isEmpty(material.netConsumption)) {
        newErrors[`${errorPrefix}_netConsumption`] = 'Net Consumption is required';
      }
      if (isEmpty(material.unit)) {
        newErrors[`${errorPrefix}_unit`] = 'Unit is required';
      }
      if (isEmpty(material.placement)) {
        newErrors[`${errorPrefix}_placement`] = 'Placement is required';
      }
      if (isEmpty(material.workOrder)) {
        newErrors[`${errorPrefix}_workOrder`] = 'Work Order is required';
      }

      const artworkCategory = material.artworkCategory?.toString().trim();
      if (artworkCategory) {
        const artworkSchema = ARTWORK_SCHEMAS[artworkCategory];
        if (artworkSchema) {
          const artworkResult = validateMaterialAgainstSchema(material, artworkSchema, errorPrefix);
          Object.assign(newErrors, artworkResult.errors);
        }
      }
    });

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    return { isValid, errors: newErrors };
  };

  const handleArtworkMaterialChange = (materialIndex, field, value) => {
    setStep3Saved(false);
    setStep3SaveStatus('idle');
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

  const addArtworkMaterial = (componentName = '') => {
    setStep3Saved(false);
    setStep3SaveStatus('idle');
    updateSelectedSkuStepData((stepData) => {
      const currentMaterials = stepData.artworkMaterials || [];
      const newSrNo = currentMaterials.length + 1;
      return {
        ...stepData,
        artworkMaterials: [
          ...currentMaterials,
          {
            srNo: newSrNo,
            components: componentName || '',
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
          }
        ]
      };
    });
  };

  const removeArtworkMaterial = (materialIndex) => {
    setStep3Saved(false);
    setStep3SaveStatus('idle');
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
    setStep4Saved(false);
    setStep4SaveStatus('idle');
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
    setStep4Saved(false);
    setStep4SaveStatus('idle');
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
    setStep4Saved(false);
    setStep4SaveStatus('idle');
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
    setStep4Saved(false);
    setStep4SaveStatus('idle');
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
    const simpleWorkOrderKey = workOrderIndex === 0 && field === 'workOrder' ? `packaging_material_${materialIndex}_workOrder` : null;
    if (errors[errorKey] || (simpleWorkOrderKey && errors[simpleWorkOrderKey])) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        if (simpleWorkOrderKey) delete newErrors[simpleWorkOrderKey];
        return newErrors;
      });
    }
  };

  // Add Packaging Material
  const addPackagingMaterial = () => {
    setStep4Saved(false);
    setStep4SaveStatus('idle');
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
            { workOrder: 'Packaging', wastage: '', for: '' },
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
    setStep4Saved(false);
    setStep4SaveStatus('idle');
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
    const stepDataBefore = getSelectedSkuStepData();
    const componentName = stepDataBefore?.rawMaterials?.[materialIndex]?.componentName;
    updateSelectedSkuStepData((stepData) => {
      const updatedRawMaterials = [...(stepData.rawMaterials || [])];
      updatedRawMaterials.splice(materialIndex, 1);
      // Update srNo for remaining materials
      updatedRawMaterials.forEach((material, index) => {
        material.srNo = index + 1;
      });
      return { ...stepData, rawMaterials: updatedRawMaterials };
    });
    if (componentName) {
      setStep2SavedComponents(prev => {
        const next = new Set(prev);
        next.delete(componentName);
        return next;
      });
    }
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
    setStep1Saved(false); // Removing component invalidates saved state
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

  // Validate a single field in real-time
  const validateField = (fieldKey, value, materialIndex, woIndex = null, workOrder = null) => {
    // Use functional update to prevent stale state - always work with latest errors
    let isValid = false;
    setErrors(prevErrors => {
      const newErrors = { ...prevErrors };
      
      // Material fields
      if (fieldKey.includes('materialType')) {
        if (!value?.trim()) {
          newErrors[fieldKey] = 'Material Type is required';
        } else {
          delete newErrors[fieldKey]; // Clear error if valid
        }
      } else if (fieldKey.includes('materialDescription')) {
        if (!value?.trim()) {
          newErrors[fieldKey] = 'Material Description is required';
        } else {
          delete newErrors[fieldKey];
        }
      } else if (fieldKey.includes('netConsumption')) {
        if (!value?.trim()) {
          newErrors[fieldKey] = 'Net Consumption per Pc is required';
        } else {
          delete newErrors[fieldKey];
        }
      } else if (fieldKey.includes('unit')) {
        // Handle both string and non-string values
        const unitValue = value?.toString().trim();
        if (!unitValue || unitValue === '') {
          newErrors[fieldKey] = 'Unit is required';
        } else {
          delete newErrors[fieldKey];
        }
      } 
      // Work order fields
      else if (fieldKey.includes('workOrder') && fieldKey.endsWith('_workOrder')) {
        if (!value?.trim()) {
          newErrors[fieldKey] = 'Work Order is required';
        } else {
          delete newErrors[fieldKey];
        }
      } else if (fieldKey.includes('wastage') && woIndex !== null && workOrder) {
        const workOrdersWithOwnWastage = ['KNITTING', 'PRINTING', 'QUILTING', 'SEWING', 'TUFTING', 'WEAVING', 'FRINGE/TASSELS'];
        if (!workOrdersWithOwnWastage.includes(workOrder.workOrder)) {
          // Required for other work orders
          const isEmpty = value === null || value === undefined || value === '' || 
                         (typeof value === 'string' && value.trim() === '') ||
                         (typeof value === 'number' && isNaN(value));
          if (isEmpty) {
            newErrors[fieldKey] = 'Wastage is required';
          } else {
            delete newErrors[fieldKey];
          }
        } else {
          // For SEWING and similar - wastage is OPTIONAL, NEVER show error if empty
          // Only validate format if a value was actually entered
          const wastageStr = value?.toString().trim();
          if (wastageStr && wastageStr !== '') {
            const numValue = parseFloat(wastageStr);
            if (isNaN(numValue) || numValue < 0) {
              newErrors[fieldKey] = 'Wastage must be a valid positive number';
            } else {
              delete newErrors[fieldKey]; // Valid number entered
            }
          } else {
            // Empty is perfectly fine - ALWAYS clear error for optional fields
            delete newErrors[fieldKey];
          }
        }
      } else if (fieldKey.includes('machineType') && workOrder?.workOrder === 'WEAVING') {
        if (!value?.trim()) {
          newErrors[fieldKey] = 'Machine Type is required';
        } else {
          delete newErrors[fieldKey];
        }
      } else {
        // For unknown fields, clear error if value exists
        if (value && value.toString().trim()) {
          delete newErrors[fieldKey];
        }
      }
      
      isValid = !newErrors[fieldKey];
      return newErrors;
    });
    
    return isValid;
  };

  const validateStep2 = () => {
    const newErrors = {};

    const stepData = getSelectedSkuStepData();
    const materials = (stepData && stepData.rawMaterials) || [];

    const getAllComponentsForStep2 = () => {
      const comps = [];
      (stepData?.products || []).forEach((product) => {
        (product?.components || []).forEach((component) => {
          if (component?.productComforter) comps.push(component.productComforter);
        });
      });
      return [...new Set(comps)];
    };

    const isMaterialComplete = (m) => {
      const unitValue = m?.unit?.toString().trim();
      return Boolean(
        m?.materialType?.toString().trim() &&
          m?.materialDescription?.toString().trim() &&
          m?.netConsumption?.toString().trim() &&
          unitValue
      );
    };

    // Validate each material - only required fields
    materials.forEach((material, materialIndex) => {
      if (!material) return;
      const keyIndex = materialIndex;
      
      // Validate materialType
      if (!material.materialType?.toString().trim()) {
        newErrors[`rawMaterial_${keyIndex}_materialType`] = 'Material Type is required';
      }
      
      if (!material.materialDescription?.toString().trim()) {
        newErrors[`rawMaterial_${keyIndex}_materialDescription`] = 'Material Description is required';
      }
      if (!material.netConsumption?.toString().trim()) {
        newErrors[`rawMaterial_${keyIndex}_netConsumption`] = 'Net Consumption per Pc is required';
      }
      const unitValue = material.unit?.toString().trim();
      if (!unitValue || unitValue === '') {
        newErrors[`rawMaterial_${keyIndex}_unit`] = 'Unit is required';
      }
    });
    
    // Step-level requirement: every component must have at least one COMPLETE raw material.
    const allComponents = getAllComponentsForStep2();
    allComponents.forEach((componentName) => {
      const materialsForComponent = materials.filter(m => m?.componentName === componentName);
      if (materialsForComponent.length === 0) {
        // Component has no materials at all
        const safe = componentName.replace(/[^a-zA-Z0-9]+/g, '_');
        newErrors[`component_${safe}_missing`] = `Please add at least one raw material for "${componentName}"`;
      } else {
        // Component has materials, but check if at least one is complete
        const hasCompleteForComponent = materialsForComponent.some(isMaterialComplete);
        if (!hasCompleteForComponent) {
          const safe = componentName.replace(/[^a-zA-Z0-9]+/g, '_');
          newErrors[`component_${safe}_incomplete`] = `Please fill all required fields for at least one material in "${componentName}"`;
        }
      }
    });

    // CRITICAL: if no materials at all, also block
    if (materials.length === 0) {
      newErrors['no_materials'] = 'Please add at least one raw material';
    }

    setErrors(newErrors);

    const isValid = Object.keys(newErrors).length === 0;
    return { isValid, errors: newErrors };
  };

  // Validate materials for a specific component only
  const validateComponentMaterials = (componentName) => {
    const newErrors = {};

    const stepData = getSelectedSkuStepData();
    const allMaterials = (stepData && stepData.rawMaterials) || [];
    
    // Filter materials for this component only
    const materials = allMaterials.filter(m => m?.componentName === componentName);

    // Validate each material for this component - base + category-specific required fields
    materials.forEach((material) => {
      if (!material) return;
      
      // Find the actual index in the full rawMaterials array
      const materialIndex = allMaterials.findIndex(m => m === material);
      if (materialIndex === -1) {
        return;
      }
      
      const idx = materialIndex;
      const matType = material.materialType?.toString().trim();
      const errorPrefix = `rawMaterial_${idx}`;
      
      // === BASE FIELDS (required for all material types) ===
      if (!matType) {
        newErrors[`${errorPrefix}_materialType`] = 'Material Type is required';
      }
      if (isEmpty(material.materialDescription)) {
        newErrors[`${errorPrefix}_materialDescription`] = 'Material Description is required';
      }
      if (isEmpty(material.netConsumption)) {
        newErrors[`${errorPrefix}_netConsumption`] = 'Net Consumption per Pc is required';
      }
      if (isEmpty(material.unit)) {
        newErrors[`${errorPrefix}_unit`] = 'Unit is required';
      }
      
      // === FABRIC SPECIFIC FIELDS ===
      if (matType === 'Fabric') {
        const fabricResult = validateMaterialAgainstSchema(material, FABRIC_SCHEMA, errorPrefix);
        Object.assign(newErrors, fabricResult.errors);
      }
      
      // === YARN SPECIFIC FIELDS ===
      if (matType === 'Yarn') {
        const subMaterial = material.subMaterial?.toString().trim();
        if (subMaterial === 'Stitching Thread') {
          const threadResult = validateMaterialAgainstSchema(material, STITCHING_THREAD_SCHEMA, errorPrefix);
          Object.assign(newErrors, threadResult.errors);
        } else {
          const yarnResult = validateMaterialAgainstSchema(material, YARN_BASE_SCHEMA, errorPrefix);
          Object.assign(newErrors, yarnResult.errors);
        }
      }
      
      // === TRIM & ACCESSORY SPECIFIC FIELDS ===
      if (matType === 'Trim & Accessory') {
        const trimType = material.trimAccessory?.toString().trim();
        if (!trimType) {
          newErrors[`${errorPrefix}_trimAccessory`] = 'Trim/Accessory type is required';
        } else {
          // Validate based on selected trim type
          const trimSchema = TRIM_ACCESSORY_SCHEMAS[trimType];
          if (trimSchema) {
            const trimResult = validateMaterialAgainstSchema(material, trimSchema, errorPrefix);
            Object.assign(newErrors, trimResult.errors);
          }
        }
      }
      
      // === FOAM SPECIFIC FIELDS ===
      if (matType === 'Foam') {
        const foamType = material.foamTableType?.toString().trim();
        if (!foamType) {
          newErrors[`${errorPrefix}_foamTableType`] = 'Foam Table Type is required';
        } else {
          // Validate based on selected foam type
          const foamSchema = FOAM_SCHEMAS[foamType];
          if (foamSchema) {
            const foamResult = validateMaterialAgainstSchema(material, foamSchema, errorPrefix);
            Object.assign(newErrors, foamResult.errors);
          }
        }
      }
      
      // === FIBER SPECIFIC FIELDS ===
      if (matType === 'Fiber') {
        const fiberType = material.fiberTableType?.toString().trim();
        if (!fiberType) {
          newErrors[`${errorPrefix}_fiberTableType`] = 'Fiber Table Type is required';
        } else {
          // Validate based on selected fiber type
          const fiberSchema = FIBER_SCHEMAS[fiberType];
          if (fiberSchema) {
            const fiberResult = validateMaterialAgainstSchema(material, fiberSchema, errorPrefix);
            Object.assign(newErrors, fiberResult.errors);
          }
        }
      }
      
      // === WORK ORDER SPECIFIC FIELDS ===
      // Validate each selected work order's fields
      const workOrders = material.workOrders || [];
      workOrders.forEach((wo, woIdx) => {
        if (!wo || !wo.workOrder) return;
        const woType = wo.workOrder.toString().trim().toUpperCase();
        const woSchema = WORK_ORDER_SCHEMAS[woType];
        if (woSchema) {
          // Use _workOrder_ prefix to match UI error key pattern
          const woPrefix = `${errorPrefix}_workOrder_${woIdx}`;
          const woResult = validateMaterialAgainstSchema(wo, woSchema, woPrefix);
          Object.assign(newErrors, woResult.errors);
        }
      });
    });
    
    // Component-level requirement: must have at least one raw material
    if (materials.length === 0) {
      const safe = componentName.replace(/[^a-zA-Z0-9]+/g, '_');
      newErrors[`component_${safe}_missing`] = `Please add at least one raw material for "${componentName}"`;
    }

    // Set errors in state so UI can show red borders
    setErrors(prev => ({ ...prev, ...newErrors }));

    const isValid = Object.keys(newErrors).length === 0;
    
    return { isValid, errors: newErrors };
  };

  // Helper function to group validation errors by component name
  const groupErrorsByComponent = (errors) => {
    const stepData = getSelectedSkuStepData();
    const allMaterials = (stepData && stepData.rawMaterials) || [];
    const componentMap = new Map();

    Object.entries(errors).forEach(([errorKey, message]) => {
      // Check if it's a component-level error
      if (errorKey.startsWith('component_')) {
        // Extract component name from error key (e.g., "component_Shell_missing" -> "Shell")
        const match = errorKey.match(/^component_(.+?)_(missing|incomplete)$/);
        if (match) {
          const componentSafeName = match[1];
          // Try to find the actual component name by matching materials
          const componentName = allMaterials.find(m => {
            const safe = m?.componentName?.replace(/[^a-zA-Z0-9]+/g, '_');
            return safe === componentSafeName;
          })?.componentName || componentSafeName.replace(/_/g, ' ');

          if (!componentMap.has(componentName)) {
            componentMap.set(componentName, { componentName, errorCount: 0, errors: [] });
          }
          componentMap.get(componentName).errorCount++;
          componentMap.get(componentName).errors.push({ fieldKey: errorKey, message });
        }
      } else if (errorKey.startsWith('rawMaterial_')) {
        // Extract material index from error key (e.g., "rawMaterial_5_materialType" -> 5)
        const match = errorKey.match(/^rawMaterial_(\d+)_/);
        if (match) {
          const materialIndex = parseInt(match[1]);
          const material = allMaterials[materialIndex];
          if (material?.componentName) {
            const componentName = material.componentName;
            if (!componentMap.has(componentName)) {
              componentMap.set(componentName, { componentName, errorCount: 0, errors: [] });
            }
            componentMap.get(componentName).errorCount++;
            componentMap.get(componentName).errors.push({ fieldKey: errorKey, message });
          }
        }
      } else if (errorKey === 'no_materials') {
        // This is a general error, add to all components or create a special entry
        const componentName = 'All Components';
        if (!componentMap.has(componentName)) {
          componentMap.set(componentName, { componentName, errorCount: 0, errors: [] });
        }
        componentMap.get(componentName).errorCount++;
        componentMap.get(componentName).errors.push({ fieldKey: errorKey, message });
      }
    });

    return Array.from(componentMap.values());
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
    console.log('handleNext called - currentStep:', currentStep);
    
    // Check if Step-0 needs to be saved
    if (currentStep === 0) {
      if (!step0Saved) {
        setShowSaveMessage(true);
        setSaveMessage('Save first');
        return;
      }
      const result0 = validateStep0();
      if (!result0.isValid) {
        showValidationErrorsPopup(result0.errors);
        return;
      }
      setShowSaveMessage(false); // Clear message if validation passes
      // When moving from step 0 to step 1, ensure we have a valid SKU selected
      if (formData.skus && formData.skus.length > 0) {
        setSelectedSku(0);
      }
    } else if (currentStep === 1) {
      if (!step1Saved) {
        setShowSaveMessage(true);
        setSaveMessage('Save first');
        return;
      }
      const result1 = validateStep1();
      if (!result1.isValid) {
        showValidationErrorsPopup(result1.errors);
        return;
      }
      setShowSaveMessage(false);
      // Don't auto-initialize raw materials - user will select component first
    } else if (currentStep === 2) {
      // Check if Step-2 has unsaved components
      const stepData = getSelectedSkuStepData();
      const allComponents = [];
      (stepData?.products || []).forEach((product) => {
        (product.components || []).forEach((component) => {
          if (component?.productComforter) {
            allComponents.push(component.productComforter);
          }
        });
      });
      
      // Get components that have materials
      const componentsWithMaterials = new Set();
      (stepData?.rawMaterials || []).forEach((material) => {
        if (material.componentName) {
          componentsWithMaterials.add(material.componentName);
        }
      });
      
      // Check if all components with materials are saved
      const unsavedComponents = Array.from(componentsWithMaterials).filter(
        comp => !step2SavedComponents.has(comp)
      );
      
      if (unsavedComponents.length > 0) {
        setShowSaveMessage(true);
        setSaveMessage('Save first');
        return;
      }
      
      // All components saved, clear message
      setShowSaveMessage(false);
      
      // Step 2 validation happens only on Save, not on Next
    } else if (currentStep === 3) {
      if (!step3Saved) {
        setShowSaveMessage(true);
        setSaveMessage('Save first');
        return;
      }
      const result3 = validateStep4();
      if (!result3.isValid) {
        showValidationErrorsPopup(result3.errors);
        return;
      }
      setShowSaveMessage(false);
    } else if (currentStep === 4) {
      const result4 = validateStep5();
      if (!result4.isValid) {
        showValidationErrorsPopup(result4.errors);
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

  // Handle breadcrumb navigation
  const handleBreadcrumbClick = (stepIndex) => {
    console.log('Breadcrumb clicked:', stepIndex, { onNavigateToCodeCreation, onNavigateToIPO });
    if (stepIndex === -1) {
      // Departments clicked - go back to departments
      onBack();
    } else if (stepIndex === -2) {
      // Code creation clicked - navigate to code creation menu
      console.log('Calling onNavigateToCodeCreation');
      if (onNavigateToCodeCreation) {
        onNavigateToCodeCreation();
      } else {
        console.error('onNavigateToCodeCreation is not defined!');
      }
    } else if (stepIndex === -3) {
      // IPO clicked - navigate to IPO screen
      console.log('Calling onNavigateToIPO');
      if (onNavigateToIPO) {
        onNavigateToIPO();
      } else {
        console.error('onNavigateToIPO is not defined!');
      }
    } else if (stepIndex >= 0 && stepIndex <= currentStep) {
      // Only allow navigation to steps that have been visited
      setCurrentStep(stepIndex);
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
              validateStep0={validateStep0}
              handleSave={handleSaveStep0}
              handleNext={handleNext}
              showSaveMessage={showSaveMessage && currentStep === 0}
              isSaved={step0Saved}
              onValidationFail={showValidationErrorsPopup}
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
              validateStep1={validateStep1}
              handleSave={handleSaveStep1}
              handleNext={handleNext}
              showSaveMessage={showSaveMessage && currentStep === 1}
              isSaved={step1Saved}
              onValidationFail={showValidationErrorsPopup}
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
              handleSave={(componentName) => handleSaveStep2(componentName)}
              savedComponents={step2SavedComponents}
              removeRawMaterial={removeRawMaterial}
              validateField={validateField}
              validateStep2={validateStep2}
              validateComponentMaterials={validateComponentMaterials}
              onValidationFail={showValidationErrorsPopup}
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
              step3SelectedComponentRef={step3SelectedComponentRef}
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
    <>
    <style>{`
      input[type="number"]::-webkit-inner-spin-button,
      input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      input[type="number"] {
        -moz-appearance: textfield;
      }
    `}</style>
    <div
      ref={scrollContainerRef}
      className="w-full h-full overflow-y-auto rounded-xl border border-border bg-background shadow-sm"
      style={{ padding: '40px' }}
    >
      <div style={{ marginBottom: '40px' }}>
        <Button
          variant="outline"
          onClick={onBack}
          type="button"
          className="mb-6 bg-background transition-transform hover:-translate-x-0.5"
        >
          ← Back to Department
        </Button>
        
        {/* Breadcrumb Navigation */}
        <div
          className="w-full flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-muted/60 text-sm text-muted-foreground"
          style={{ padding: '12px 18px', marginTop: '4px', marginBottom: '24px' }}
        >
          <button
            type="button"
            onClick={() => handleBreadcrumbClick(-1)}
            className="rounded-lg px-3 py-1.5 font-medium text-primary transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Departments
          </button>
          <span className="px-1 text-foreground/60 text-xs sm:text-sm">›</span>
          <button
            type="button"
            onClick={() => handleBreadcrumbClick(-2)}
            className="rounded-lg px-3 py-1.5 font-medium text-primary transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Code creation
          </button>
          <span className="px-1 text-foreground/60 text-xs sm:text-sm">›</span>
          <button
            type="button"
            onClick={() => handleBreadcrumbClick(-3)}
            className="rounded-lg px-3 py-1.5 font-medium text-primary transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            IPO
          </button>

          {Array.from({ length: currentStep + 1 }, (_, i) => (
            <span
              key={`crumb-${i}`}
              className="inline-flex items-center ml-2 sm:ml-3"
            >
              <span
                className="text-foreground/60 text-xs sm:text-sm"
                style={{ marginRight: 8 }}
              >
                ›
              </span>
              <button
                type="button"
                onClick={() => handleBreadcrumbClick(i)}
                className={
                  i === currentStep
                    ? "rounded-lg bg-accent px-3 py-1.5 font-semibold text-foreground"
                    : "rounded-lg px-3 py-1.5 font-medium text-primary transition-colors hover:bg-accent hover:text-accent-foreground"
                }
              >
                {`Step ${i}`}
              </button>
            </span>
          ))}
        </div>
        
        <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-1">
          Generate Factory Code
        </h1>
        <p className="text-sm text-muted-foreground">
          Complete all steps to generate a factory code
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-10" style={{ marginBottom: '40px' }}>
        <div className="flex justify-between items-center relative" style={{ marginTop: '20px', marginBottom: '24px' }}>
          {/* Progress line behind the steps */}
          <div
            className="absolute left-0 right-0 rounded-full bg-border/70"
            style={{ top: '20px', height: '4px', zIndex: 0 }}
          />
          <div
            className="absolute left-0 rounded-full bg-primary transition-all duration-300"
            style={{
              top: '20px',
              height: '4px',
              width: `${((currentStep + 0.5) / (totalSteps + 1)) * 100}%`,
              zIndex: 1,
            }}
          />
          
          {/* Step numbers */}
          {Array.from({ length: totalSteps + 1 }, (_, i) => (
            <div key={i} className="flex flex-col items-center flex-1 relative" style={{ zIndex: 2 }}>
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-base transition-all cursor-pointer ${
                  i <= currentStep
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted text-muted-foreground'
                } ${i === currentStep ? 'outline outline-2 outline-ring/60 outline-offset-2 shadow-md' : 'hover:scale-105'}`}
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
                {i < currentStep ? (
                  <span aria-hidden="true" style={{ lineHeight: 1 }}>
                    ✓
                  </span>
                ) : (
                  i
                )}
              </div>
              <div
                className={`mt-3 text-center text-[10px] leading-tight ${
                  i <= currentStep ? 'text-primary font-semibold' : 'text-muted-foreground'
                }`}
                style={{ width: '100%', maxWidth: '120px', wordWrap: 'break-word' }}
              >
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

                    {/* Product Details - Main product: exclude SP from display */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                        {isProductSelected && (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="6" fill="#667eea" />
                        <path d="M6 8L7.5 9.5L10 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                        <span style={{ fontWeight: '600' }}>
                          {skuItem.ipcCode ? skuItem.ipcCode.replace(/\/SP\d+$/i, '') : `SKU #${index + 1}`}
                        </span>
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

                            {/* Subproduct Details - Display SP1, SP2, SP3... (IPC unchanged) */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%' }}>
                                {isSubproductSelected && (
                                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                    <circle cx="8" cy="8" r="6" fill="#667eea" />
                                    <path d="M6 8L7.5 9.5L10 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                )}
                                <span style={{ fontWeight: '600', fontSize: '12px' }}>
                                  {skuItem.ipcCode ? `${skuItem.ipcCode.replace(/\/SP\d+$/i, '')}/SP${subproductIndex + 1}` : `/SP${subproductIndex + 1}`}
                                </span>
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

      {showIPCPopup ? (
        // Buyer/Vendor-style success view (inline, not modal)
        <div className="w-full max-w-3xl mx-auto" style={{ marginTop: '24px' }}>
          <FormCard className="rounded-2xl border-border bg-muted" style={{ padding: '24px 20px' }}>
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full flex items-center justify-center text-4xl font-bold mb-5">
                ✓
              </div>

              <div className="w-full" style={{ marginTop: '8px' }}>
                <div className="text-sm font-semibold text-foreground/80 mb-3">
                  IPC Codes Generated
                </div>

                <FormCard className="rounded-xl border-border bg-card" style={{ padding: '20px 18px' }}>
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {generatedIPCCodes.map((sku, idx) => {
                      const baseIpc = sku.ipcCode?.replace(/\/SP\d+$/i, '') || sku.ipcCode;
                      return (
                        <div key={idx} style={{ marginBottom: idx === generatedIPCCodes.length - 1 ? 0 : '12px' }}>
                          <div className="text-sm font-semibold text-foreground">
                            SKU {idx + 1}: <span className="text-primary font-semibold">{baseIpc}</span>
                          </div>
                          {sku.subproducts && sku.subproducts.length > 0 && (
                            <div className="text-sm text-muted-foreground" style={{ marginLeft: '16px', marginTop: '6px' }}>
                              {sku.subproducts.map((sp, spIdx) => (
                                <div key={spIdx} style={{ marginTop: spIdx === 0 ? 0 : '4px' }}>
                                  Subproduct {spIdx + 1}: <span className="text-foreground">{baseIpc}/SP{spIdx + 1}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </FormCard>
              </div>

              <div className="flex justify-center gap-3" style={{ marginTop: '40px' }}>
                <Button onClick={handleAddMoreSKUFromPopup} type="button" variant="default">
                  Add More SKU
                </Button>
                <Button
                  onClick={() => {
                    setShowIPCPopup(false);
                    handleNext();
                  }}
                  type="button"
                  variant="outline"
                >
                  Next
                </Button>
              </div>
            </div>
          </FormCard>
        </div>
      ) : (
        <>
          {/* Step Content */}
          <div className="mb-8 mx-auto" style={{ maxWidth: '1000px' }}>
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="mx-auto" style={{ maxWidth: '1000px' }}>
            {currentStep === totalSteps ? (
              // Last step (Packaging): Save + Save first + Prev + Generate Factory Code (same template as step 3)
              <div className="flex items-center justify-between" style={{ marginTop: '32px' }}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSaveStep4}
                  className={`min-w-[90px] ${step4SaveStatus === 'error' ? 'text-red-600 border-red-500 hover:text-red-700' : step4Saved || step4SaveStatus === 'success' ? 'text-green-600 hover:text-green-700' : ''}`}
                >
                  {step4SaveStatus === 'error' ? 'Not Saved' : step4Saved || step4SaveStatus === 'success' ? 'Saved' : 'Save'}
                </Button>
                <div className="flex items-center gap-3">
                  {showSaveMessage && currentStep === totalSteps && (
                    <span className="text-red-600 text-sm font-medium">Save first</span>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                  >
                    ← Previous
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      if (!step4Saved) {
                        setShowSaveMessage(true);
                        setSaveMessage('Save first');
                        return;
                      }
                      setShowFactoryCodePopup(true);
                    }}
                  >
                    Generate Factory Code
                  </Button>
                </div>
              </div>
            ) : currentStep === 3 ? (
              // Artwork / Labelling step: Save + Add Material on left, Save first + Prev/Next on right (same template as Step1)
              <div className="flex items-center justify-between" style={{ marginTop: '32px' }}>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSaveStep3}
                    className={`min-w-[90px] ${step3SaveStatus === 'error' ? 'text-red-600 border-red-500 hover:text-red-700' : step3Saved || step3SaveStatus === 'success' ? 'text-green-600 hover:text-green-700' : ''}`}
                  >
                    {step3SaveStatus === 'error' ? 'Not Saved' : step3Saved || step3SaveStatus === 'success' ? 'Saved' : 'Save'}
                  </Button>
                </div>
                <div className="flex items-center gap-3">
                  {showSaveMessage && (currentStep === 2 || currentStep === 3) && (
                    <span className="text-red-600 text-sm font-medium">Save first</span>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                  >
                    ← Previous
                  </Button>
                  <Button
                    type="button"
                    onClick={handleNext}
                  >
                    Next →
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-end items-center gap-3" style={{ marginTop: '32px' }}>
                {showSaveMessage && (currentStep === 1 || currentStep === 2) && (
                  <span className="text-red-600 text-sm font-medium">Save first</span>
                )}
                {currentStep > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                  >
                    ← Previous
                  </Button>
                )}
                {currentStep > 0 && currentStep < totalSteps && (
                  <Button
                    type="button"
                    onClick={handleNext}
                  >
                    Next →
                  </Button>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* Generate Factory Code Popup */}
      <Dialog open={showFactoryCodePopup} onOpenChange={(open) => {
        setShowFactoryCodePopup(open);
        if (open) {
          const init = {};
          formData.skus?.forEach((sku, idx) => {
            init[`${idx}-product`] = 1;
            (sku.subproducts || []).forEach((_, spIdx) => {
              init[`${idx}-sp-${spIdx}`] = 1;
            });
          });
          setShippingGroups(init);
        }
      }}>
        <DialogContent
          showCloseButton={true}
          className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col rounded-2xl border-2 border-border shadow-2xl bg-white p-6"
          style={{ padding: '18px' }}
        >
          <DialogHeader className="pb-5 pt-2 px-2 border-b border-border">
            <DialogTitle className="text-xl font-semibold text-foreground">
              Factory Code Generation
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-6 overflow-y-auto px-6 py-6" style={{ maxHeight: 'calc(90vh - 160px)' }}>
            {/* Derived consumption loading - hardcoded */}
            <div
              className="flex items-center gap-3 px-5 py-4 rounded-xl"
              style={{ background: 'rgba(34 197 94 / 0.08)', border: '1px solid rgb(34 197 94 / 0.4)' }}
            >
              <div className="w-8 h-8 rounded-full border-2 border-green-500 border-t-transparent animate-spin" />
              <span className="text-sm font-medium text-foreground">
                Derived consumption table is loading...
              </span>
            </div>

            {/* All IPC codes */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">All IPC Codes</h4>
              <div className="flex flex-wrap gap-3">
                {formData.skus?.map((sku, idx) => {
                  const baseIpc = sku.ipcCode?.replace(/\/SP\d+$/i, '') || sku.ipcCode || '';
                  const items = [];
                  if (baseIpc) items.push({ label: `SKU ${idx + 1}`, code: baseIpc });
                  (sku.subproducts || []).forEach((sp, spIdx) => {
                    items.push({ label: `SKU ${idx + 1} SP${spIdx + 1}`, code: `${baseIpc}/SP${spIdx + 1}` });
                  });
                  return items.map((item, i) => (
                    <span
                      key={`${idx}-${i}`}
                      className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-mono font-semibold"
                      style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }}
                    >
                      {item.code}
                    </span>
                  ));
                })}
              </div>
            </div>

            {/* Shipping Group - assign products/subproducts to groups */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Shipping Group</h4>
              <p className="text-sm text-muted-foreground mb-4">Assign each product and subproduct to a shipping group. Items in the same group ship together.</p>
              <div className="space-y-4 rounded-xl border border-border p-5 bg-white">
                {formData.skus?.map((sku, idx) => {
                  const baseIpc = sku.ipcCode?.replace(/\/SP\d+$/i, '') || sku.ipcCode || '';
                  const maxGroup = Math.max(1, ...Object.values(shippingGroups));
                  return (
                    <div key={idx} className="space-y-3">
                      <div className="flex items-center gap-4 p-3 rounded-lg border border-border bg-muted/20">
                        <span className="text-sm font-medium flex-1">{sku.sku || `Product ${idx + 1}`}</span>
                        <span className="text-xs text-muted-foreground font-mono">{baseIpc}</span>
                        <select
                          value={shippingGroups[`${idx}-product`] ?? 1}
                          onChange={(e) => setShippingGroups(prev => ({ ...prev, [`${idx}-product`]: parseInt(e.target.value) }))}
                          className="rounded-md border border-border px-3 py-2 text-sm bg-white min-w-[100px]"
                        >
                          {Array.from({ length: maxGroup }, (_, i) => i + 1).map((g) => (
                            <option key={g} value={g}>Group {g}</option>
                          ))}
                          <option value={maxGroup + 1}>+ New Group</option>
                        </select>
                      </div>
                      {(sku.subproducts || []).map((sp, spIdx) => (
                        <div
                          key={spIdx}
                          className="flex items-center gap-4 p-3 pl-8 rounded-lg border border-border bg-muted/10"
                        >
                          <span className="text-sm flex-1">{sp.subproduct || `Subproduct ${spIdx + 1}`}</span>
                          <span className="text-xs text-muted-foreground font-mono">{baseIpc}/SP{spIdx + 1}</span>
                          <select
                            value={shippingGroups[`${idx}-sp-${spIdx}`] ?? 1}
                            onChange={(e) => setShippingGroups(prev => ({ ...prev, [`${idx}-sp-${spIdx}`]: parseInt(e.target.value) }))}
                            className="rounded-md border border-border px-3 py-2 text-sm bg-white min-w-[100px]"
                          >
                            {Array.from({ length: maxGroup }, (_, i) => i + 1).map((g) => (
                              <option key={g} value={g}>Group {g}</option>
                            ))}
                            <option value={maxGroup + 1}>+ New Group</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex justify-end px-6 py-5 border-t border-border bg-white">
            <Button type="button" onClick={() => setShowFactoryCodePopup(false)} variant="default">
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Validation Errors Dialog */}
      <ValidationErrorsDialog
        open={validationErrorsPopup.open}
        onOpenChange={(open) => setValidationErrorsPopup(prev => ({ ...prev, open }))}
        messages={validationErrorsPopup.messages}
      />
    </div>
    </>
  );
};

export default GenerateFactoryCode;

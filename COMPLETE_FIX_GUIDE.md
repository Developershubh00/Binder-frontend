
# PART 1 — FRONTEND CHANGES

---

## FIX 1 · `InternalPurchaseOrder.jsx` · Line ~214
**Problem:** Sends wrong `order_type` to backend — `'STOCK'`/`'SAM'` instead of `'PD'`/`'SAM'`/`'SELF'`

**File path:** `src/components/InternalPurchaseOrder/InternalPurchaseOrder.jsx`

**FIND this block (around line 213–219):**
```js
const response = await createIPO({
  order_type: initialData.orderType === 'Production' ? 'STOCK' : 'SAM',
  buyer_code_text: initialData.buyerCode || '',
  company_type: initialData.orderType === 'Company' ? initialData.type : null,
  program_name: initialData.programName.trim(),
});
```

**REPLACE WITH:**
```js
// Map frontend label → backend DB value (matches image: PD / SAM / SELF)
const ORDER_TYPE_MAP = { 'Production': 'PD', 'Sampling': 'SAM', 'Company': 'SELF' };

const response = await createIPO({
  order_type: ORDER_TYPE_MAP[initialData.orderType] || 'PD',
  buyer_code_text: initialData.orderType !== 'Company' ? (initialData.buyerCode || '') : '',
  company_type: initialData.orderType === 'Company' ? initialData.type : null,
  program_name: initialData.programName.trim(),
});
```

---

## FIX 2 · `CompanyEssentials.jsx` · Line ~57
**Problem:** Frontend sends `'ELECTRICAL'`, `'HARDWARE & CHEMICALS'`, `'AUDIT & COMPLIANCES'`, `'QC TOOLS'`, `'TRAVEL EXPENSE'` — but backend `CATEGORY_CHOICES` expects `'ELECTRICALS'`, `'HARDWARE_CHEMICALS'`, `'AUDIT_COMPLIANCE'`, `'QC_TOOLS'`, `'TRAVEL_EXPENSE'`. These cause 400 errors silently.

**File path:** `src/components/CompanyEssentials.jsx`

**FIND this block (around line 57–69):**
```js
const categories = [
  'STATIONARY',
  'PANTRY',
  'MACHINERY',
  'HOUSEKEEPING',
  'ELECTRICAL',
  'HARDWARE & CHEMICALS',
  'AUDIT & COMPLIANCES',
  'IT',
  'QC TOOLS',
  'TRAVEL EXPENSE',
  'REPAIR',
  'MAINTENANCE'
];
```

**REPLACE WITH:**
```js
const categories = [
  'STATIONARY',
  'PANTRY',
  'MACHINERY',
  'HOUSEKEEPING',
  'ELECTRICALS',
  'HARDWARE_CHEMICALS',
  'AUDIT_COMPLIANCE',
  'IT',
  'QC_TOOLS',
  'TRAVEL_EXPENSE',
  'REPAIR',
  'MAINTENANCE'
];
```

> Note: This will change the display labels slightly. If you want to keep friendly display labels but send correct API values, use a display map instead — ask me and I'll add it.

---

## FIX 3 · `services/integration.js` · After line ~1025 (after `createFactoryCode`)
**Problem:** No wizard endpoint function exists — needed to save all 6 steps to DB in one call.

**File path:** `src/services/integration.js`

**FIND:**
```js
export const createFactoryCode = async (data) => {
  const response = await apiRequest('ims/factory-codes/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return await response.json();
};
```

**ADD THIS BELOW IT (new function):**
```js
// Saves all 6 steps at once using the wizard endpoint
export const saveFactoryCodeWizard = async (wizardData) => {
  const response = await apiRequest('ims/factory-codes/wizard/', {
    method: 'POST',
    body: JSON.stringify(wizardData),
  });
  return await response.json();
};
```

---

## FIX 4 · `GenerateFactoryCode.jsx` · Top of file (line 1)
**Problem:** `saveFactoryCodeWizard` is never imported.

**File path:** `src/components/GenerateFactoryCode/GenerateFactoryCode.jsx`

**FIND the last import line (around line 35):**
```js
import { X } from 'lucide-react';
```

**ADD THIS LINE AFTER IT:**
```js
import { saveFactoryCodeWizard } from '../../services/integration';
```

---

## FIX 5 · `GenerateFactoryCode.jsx` · "Generate Factory Code" button handler (~line 5340)
**Problem:** Button only shows popup, never saves to database.

**File path:** `src/components/GenerateFactoryCode/GenerateFactoryCode.jsx`

**FIND:**
```js
onClick={() => {
  if (!step4Saved) {
    setShowSaveMessage(true);
    setSaveMessage('Save first');
    return;
  }
  setShowFactoryCodePopup(true);
}}
```

**REPLACE WITH:**
```js
onClick={async () => {
  if (!step4Saved) {
    setShowSaveMessage(true);
    setSaveMessage('Save first');
    return;
  }

  // ─── SAVE ALL STEPS TO DATABASE ───
  try {
    const wizardPayload = {
      step0: {
        sku: formData.skus?.[0]?.sku || '',
        product_name: formData.skus?.[0]?.product || '',
        notes: formData.ipoCode || '',
      },
      products: (formData.products || []).map(p => ({
        name: p.name || '',
        components: (p.components || []).map(c => ({
          name: c.name || '',
          sizeWidth: c.size?.width || '',
          sizeLength: c.size?.length || '',
          sizeHeight: c.size?.height || '',
          sizeUnit: c.size?.unit || '',
        })),
      })),
      rawMaterials: formData.rawMaterials || [],
      consumptionMaterials: formData.consumptionMaterials || [],
      artworkMaterials: formData.artworkMaterials || [],
      packaging: formData.packaging || null,
    };

    const result = await saveFactoryCodeWizard(wizardPayload);
    console.log('✅ Factory code saved to DB:', result);
  } catch (err) {
    console.error('❌ Failed to save factory code to DB:', err);
    // Don't block the user — still show popup even if DB save fails
  }

  setShowFactoryCodePopup(true);
}}
```

---

## FIX 6 · `GenerateFactoryCode.jsx` · Add Image Compression Utility
**Problem:** Images are stored as raw base64 (3–10MB each). Need to compress to max 100KB, quality not dropping more than 20%.

**File path:** `src/components/GenerateFactoryCode/GenerateFactoryCode.jsx`

**FIND (the last import, line ~35):**
```js
import { saveFactoryCodeWizard } from '../../services/integration';
```

**ADD THIS FUNCTION AFTER ALL IMPORTS (before the component `const GenerateFactoryCode = ...`):**
```js
// ─── IMAGE COMPRESSION UTILITY ───────────────────────────────────────────────
// Compresses image to maxKB. Quality never drops below (1 - maxQualityDrop).
// e.g. maxKB=100, maxQualityDrop=0.2 → min quality = 80%, target size = 100KB
const compressImage = (file, maxKB = 100, maxQualityDrop = 0.2) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        // Scale down if larger than 1200px on any side
        const MAX_DIM = 1200;
        if (width > MAX_DIM || height > MAX_DIM) {
          const ratio = Math.min(MAX_DIM / width, MAX_DIM / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);

        const minQuality = 1 - maxQualityDrop; // e.g. 0.8
        let quality = 0.95;

        const tryCompress = () => {
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          const sizeKB = (dataUrl.length * 3) / 4 / 1024;

          if (sizeKB <= maxKB || quality <= minQuality) {
            // Convert dataUrl → File
            const arr = dataUrl.split(',');
            const mime = arr[0].match(/:(.*?);/)[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) u8arr[n] = bstr.charCodeAt(n);
            const newName = file.name.replace(/\.[^.]+$/, '.jpg');
            resolve(new File([u8arr], newName, { type: mime }));
          } else {
            quality = Math.max(minQuality, +(quality - 0.05).toFixed(2));
            tryCompress();
          }
        };
        tryCompress();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};
// ─────────────────────────────────────────────────────────────────────────────
```

---

## FIX 7 · `GenerateFactoryCode.jsx` · `handleSkuImageChange` (~line 666)
**Problem:** Images stored raw without compression.

**FIND:**
```js
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
```

**REPLACE WITH:**
```js
const handleSkuImageChange = async (skuIndex, file) => {
  setStep0Saved(false);
  if (file) {
    // Compress to 100KB, quality never drops below 80%
    const compressed = await compressImage(file, 100, 0.2);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => {
        const updatedSkus = [...prev.skus];
        updatedSkus[skuIndex] = {
          ...updatedSkus[skuIndex],
          image: compressed,
          imagePreview: reader.result
        };
        return { ...prev, skus: updatedSkus };
      });
    };
    reader.readAsDataURL(compressed);
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
```

---

## FIX 8 · `GenerateFactoryCode.jsx` · `handleSubproductImageChange` (~line 945)
**Problem:** Same issue as above for subproduct images.

**FIND:**
```js
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
```

**REPLACE WITH:**
```js
const handleSubproductImageChange = async (skuIndex, subproductIndex, file) => {
  setStep0Saved(false);
  if (file) {
    // Compress to 100KB, quality never drops below 80%
    const compressed = await compressImage(file, 100, 0.2);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => {
        const updatedSkus = [...prev.skus];
        if (!updatedSkus[skuIndex].subproducts) {
          updatedSkus[skuIndex].subproducts = [];
        }
        updatedSkus[skuIndex].subproducts[subproductIndex] = {
          ...updatedSkus[skuIndex].subproducts[subproductIndex],
          image: compressed,
          imagePreview: reader.result
        };
        return { ...prev, skus: updatedSkus };
      });
    };
    reader.readAsDataURL(compressed);
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
```
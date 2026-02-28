# ============================================================================
# BINDER ERP - Frontend Integration Patch Script (Windows PowerShell)
# ============================================================================
# 
# Usage:
#   cd E:\SendAnywhere_187655\Binder-frontend
#   powershell -ExecutionPolicy Bypass -File apply_frontend_changes.ps1
#
# ============================================================================

$ErrorActionPreference = "Stop"

Write-Host "`n=== Binder ERP Frontend Patch Script ===" -ForegroundColor Green

# Verify we're in the right directory
if (-not (Test-Path "package.json") -or -not (Test-Path "src\components")) {
    Write-Host "ERROR: Run this from the Binder-frontend root directory" -ForegroundColor Red
    exit 1
}
Write-Host "Detected Binder frontend project" -ForegroundColor Green

# ============================================================================
# STEP 1: Copy integration.js to src/services/
# ============================================================================
Write-Host "`n[Step 1] Setting up integration.js in src\services\" -ForegroundColor Yellow

if (-not (Test-Path "src\services")) { New-Item -ItemType Directory -Path "src\services" -Force | Out-Null }

if (Test-Path "integration.js") {
    $content = Get-Content "integration.js" -Raw
    $content = $content -replace "http://localhost:8000/api/", "https://binder-backend-0szj.onrender.com/api/"
    Set-Content -Path "src\services\integration.js" -Value $content -NoNewline
    Write-Host "   Copied integration.js -> src\services\integration.js" -ForegroundColor Green
} elseif (Test-Path "src\services\integration.js") {
    $content = Get-Content "src\services\integration.js" -Raw
    $content = $content -replace "http://localhost:8000/api/", "https://binder-backend-0szj.onrender.com/api/"
    Set-Content -Path "src\services\integration.js" -Value $content -NoNewline
    Write-Host "   integration.js already in src\services\" -ForegroundColor Green
} else {
    Write-Host "   ERROR: integration.js not found! Place it in project root first" -ForegroundColor Red
    exit 1
}

# ============================================================================
# STEP 2: Add NEW API functions to integration.js (if not already present)
# ============================================================================
Write-Host "`n[Step 2] Adding IPO/PO/CompanyEssentials/FactoryCode API functions" -ForegroundColor Yellow

$intFile = "src\services\integration.js"
$intContent = Get-Content $intFile -Raw

if ($intContent -match "getIPOs") {
    Write-Host "   API functions already present - skipping" -ForegroundColor Green
} else {
    $newFunctions = @'

// ============================================================================
// INTERNAL PURCHASE ORDERS (IPO)
// ============================================================================

export const getIPOs = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await apiRequest(`ims/ipos/${query ? '?' + query : ''}`);
  return await response.json();
};

export const getIPO = async (ipoId) => {
  const response = await apiRequest(`ims/ipos/${ipoId}/`);
  return await response.json();
};

export const createIPO = async (ipoData) => {
  const response = await apiRequest('ims/ipos/', {
    method: 'POST',
    body: JSON.stringify(ipoData),
  });
  return await response.json();
};

export const deleteIPO = async (ipoId) => {
  const response = await apiRequest(`ims/ipos/${ipoId}/`, { method: 'DELETE' });
  if (response.status === 204) return { success: true };
  return await response.json();
};

export const getNextIPOSrNo = async (programName) => {
  const response = await apiRequest(`ims/ipos/next-sr-no/?program=${encodeURIComponent(programName)}`);
  return await response.json();
};

// ============================================================================
// PURCHASE ORDERS (PO)
// ============================================================================

export const getPurchaseOrders = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await apiRequest(`ims/purchase-orders/${query ? '?' + query : ''}`);
  return await response.json();
};

export const getPurchaseOrder = async (poId) => {
  const response = await apiRequest(`ims/purchase-orders/${poId}/`);
  return await response.json();
};

export const createPurchaseOrder = async (poData) => {
  const response = await apiRequest('ims/purchase-orders/', {
    method: 'POST',
    body: JSON.stringify(poData),
  });
  return await response.json();
};

export const deletePurchaseOrder = async (poId) => {
  const response = await apiRequest(`ims/purchase-orders/${poId}/`, { method: 'DELETE' });
  if (response.status === 204) return { success: true };
  return await response.json();
};

export const getNextPOCode = async () => {
  const response = await apiRequest('ims/purchase-orders/next-code/');
  return await response.json();
};

// ============================================================================
// COMPANY ESSENTIALS
// ============================================================================

export const getCompanyEssentials = async (category, params = {}) => {
  const query = new URLSearchParams({ ...params, ...(category ? { category } : {}) }).toString();
  const response = await apiRequest(`ims/company-essentials/${query ? '?' + query : ''}`);
  return await response.json();
};

export const getCompanyEssential = async (id) => {
  const response = await apiRequest(`ims/company-essentials/${id}/`);
  return await response.json();
};

export const createCompanyEssential = async (data) => {
  const response = await apiRequest('ims/company-essentials/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return await response.json();
};

export const bulkCreateCompanyEssentials = async (items) => {
  const response = await apiRequest('ims/company-essentials/bulk-create/', {
    method: 'POST',
    body: JSON.stringify({ items }),
  });
  return await response.json();
};

export const deleteCompanyEssential = async (id) => {
  const response = await apiRequest(`ims/company-essentials/${id}/`, { method: 'DELETE' });
  if (response.status === 204) return { success: true };
  return await response.json();
};

export const getNextEssentialsPONumber = async (category) => {
  const response = await apiRequest(`ims/company-essentials/next-po-number/?category=${encodeURIComponent(category)}`);
  return await response.json();
};

export const getEssentialCategories = async () => {
  const response = await apiRequest('ims/company-essentials/categories/');
  return await response.json();
};

// ============================================================================
// FACTORY CODES (IPC)
// ============================================================================

export const getFactoryCodes = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await apiRequest(`ims/factory-codes/${query ? '?' + query : ''}`);
  return await response.json();
};

export const getFactoryCode = async (id) => {
  const response = await apiRequest(`ims/factory-codes/${id}/`);
  return await response.json();
};

export const createFactoryCode = async (data) => {
  const response = await apiRequest('ims/factory-codes/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return await response.json();
};

export const deleteFactoryCode = async (id) => {
  const response = await apiRequest(`ims/factory-codes/${id}/`, { method: 'DELETE' });
  if (response.status === 204) return { success: true };
  return await response.json();
};
'@
    Add-Content -Path $intFile -Value $newFunctions
    Write-Host "   Added IPO/PO/CompanyEssentials/FactoryCode API functions" -ForegroundColor Green
}

# ============================================================================
# Helper function: Replace text in file
# ============================================================================
function Replace-InFile {
    param([string]$FilePath, [string]$Old, [string]$New, [string]$Label)
    if (Test-Path $FilePath) {
        $content = Get-Content $FilePath -Raw
        if ($content.Contains($Old)) {
            $content = $content.Replace($Old, $New)
            Set-Content -Path $FilePath -Value $content -NoNewline
            Write-Host "   $Label" -ForegroundColor Green
            return $true
        }
    }
    return $false
}

# ============================================================================
# STEP 3: Fix import paths for already-connected files
# ============================================================================
Write-Host "`n[Step 3] Fixing import paths" -ForegroundColor Yellow

Replace-InFile "src\components\BuyerMasterSheet.jsx" `
    "from '../../integration'" `
    "from '../services/integration'" `
    "BuyerMasterSheet.jsx - import path fixed"

Replace-InFile "src\components\VendorMasterSheet.jsx" `
    "from '../../integration'" `
    "from '../services/integration'" `
    "VendorMasterSheet.jsx - import path fixed"

# ============================================================================
# STEP 4: GenerateBuyerCode.jsx
# ============================================================================
Write-Host "`n[Step 4] Patching GenerateBuyerCode.jsx" -ForegroundColor Yellow
$f = "src\components\GenerateBuyerCode.jsx"
if (Test-Path $f) {
    $c = Get-Content $f -Raw

    # Add import
    if (-not ($c -match "services/integration")) {
        $c = $c.Replace(
            "import { FormCard } from '@/components/ui/form-layout';",
            "import { FormCard } from '@/components/ui/form-layout';`nimport { getBuyerCodes, createBuyerCode } from '../services/integration';"
        )
        Write-Host "   Added API imports" -ForegroundColor Green
    }

    # Replace load
    $oldLoad = @"
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('buyerCodes') || '[]');
    setExistingBuyerCodes(stored);
  }, [generatedCode]); // Refresh when returning from success screen
"@
    $newLoad = @"
  useEffect(() => {
    const loadBuyerCodes = async () => {
      try {
        const data = await getBuyerCodes();
        const list = data?.results || data || [];
        const arr = Array.isArray(list) ? list : [];
        setExistingBuyerCodes(arr);
        localStorage.setItem('buyerCodes', JSON.stringify(arr));
      } catch (err) {
        console.warn('API buyer codes fetch failed, using localStorage:', err);
        const stored = JSON.parse(localStorage.getItem('buyerCodes') || '[]');
        setExistingBuyerCodes(stored);
      }
    };
    loadBuyerCodes();
  }, [generatedCode]); // Refresh when returning from success screen
"@
    if ($c.Contains($oldLoad)) {
        $c = $c.Replace($oldLoad, $newLoad)
        Write-Host "   Load pattern updated to API-first" -ForegroundColor Green
    }

    # Add API save
    $oldSave = @"
      existingCodes.push(newBuyerData);
      localStorage.setItem('buyerCodes', JSON.stringify(existingCodes));
      console.log('Saved to localStorage:', newBuyerData);
      setExistingBuyerCodes(existingCodes);
"@
    $newSave = @"
      existingCodes.push(newBuyerData);
      localStorage.setItem('buyerCodes', JSON.stringify(existingCodes));
      console.log('Saved to localStorage:', newBuyerData);
      setExistingBuyerCodes(existingCodes);

      // Save to API in background
      createBuyerCode({
        buyer_name: formData.buyerName.trim(),
        contact_person: formData.contactPerson.trim(),
        end_customer: formData.retailer.trim(),
      }).catch(err => console.warn('API save buyer failed (saved locally):', err));
"@
    if ($c.Contains($oldSave) -and -not ($c -match "createBuyerCode\(")) {
        $c = $c.Replace($oldSave, $newSave)
        Write-Host "   Save pattern updated to include API call" -ForegroundColor Green
    }

    Set-Content -Path $f -Value $c -NoNewline
    Write-Host "   GenerateBuyerCode.jsx done" -ForegroundColor Green
}

# ============================================================================
# STEP 5: GenerateVendorCode.jsx
# ============================================================================
Write-Host "`n[Step 5] Patching GenerateVendorCode.jsx" -ForegroundColor Yellow
$f = "src\components\GenerateVendorCode.jsx"
if (Test-Path $f) {
    $c = Get-Content $f -Raw

    # Add import
    if (-not ($c -match "services/integration")) {
        $c = $c.Replace(
            "import { FormCard } from '@/components/ui/form-layout';",
            "import { FormCard } from '@/components/ui/form-layout';`nimport { getVendorCodes, createVendorCode } from '../services/integration';"
        )
        Write-Host "   Added API imports" -ForegroundColor Green
    }

    # Replace load
    $oldLoad = @"
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('vendorCodes') || '[]');
    setExistingVendorCodes(stored);
  }, [generatedCode]);
"@
    $newLoad = @"
  useEffect(() => {
    const loadVendorCodes = async () => {
      try {
        const data = await getVendorCodes();
        const list = data?.results || data || [];
        const arr = Array.isArray(list) ? list : [];
        setExistingVendorCodes(arr);
        localStorage.setItem('vendorCodes', JSON.stringify(arr));
      } catch (err) {
        console.warn('API vendor codes fetch failed, using localStorage:', err);
        const stored = JSON.parse(localStorage.getItem('vendorCodes') || '[]');
        setExistingVendorCodes(stored);
      }
    };
    loadVendorCodes();
  }, [generatedCode]);
"@
    if ($c.Contains($oldLoad)) {
        $c = $c.Replace($oldLoad, $newLoad)
        Write-Host "   Load pattern updated to API-first" -ForegroundColor Green
    }

    # Add API save
    $oldSave = @"
    existingCodes.push(newVendorData);
    localStorage.setItem('vendorCodes', JSON.stringify(existingCodes));
    setExistingVendorCodes(existingCodes);
"@
    $newSave = @"
    existingCodes.push(newVendorData);
    localStorage.setItem('vendorCodes', JSON.stringify(existingCodes));
    setExistingVendorCodes(existingCodes);

    // Save to API in background
    createVendorCode({
      vendor_name: formData.vendorName?.trim(),
      contact_person: formData.contactPerson?.trim(),
      vendor_address: formData.address?.trim(),
      gst_number: formData.gstNumber?.trim(),
      job_work_categories: formData.jobWorkCategories || [],
    }).catch(err => console.warn('API save vendor failed (saved locally):', err));
"@
    if ($c.Contains($oldSave) -and -not ($c -match "createVendorCode\(")) {
        $c = $c.Replace($oldSave, $newSave)
        Write-Host "   Save pattern updated to include API call" -ForegroundColor Green
    }

    Set-Content -Path $f -Value $c -NoNewline
    Write-Host "   GenerateVendorCode.jsx done" -ForegroundColor Green
}

# ============================================================================
# STEP 6: GeneratePOCode.jsx
# ============================================================================
Write-Host "`n[Step 6] Patching GeneratePOCode.jsx" -ForegroundColor Yellow
$f = "src\components\GeneratePOCode.jsx"
if (Test-Path $f) {
    $c = Get-Content $f -Raw

    # Add import
    if (-not ($c -match "services/integration")) {
        $c = $c.Replace(
            "import { useState, useEffect } from 'react';",
            "import { useState, useEffect } from 'react';`nimport { getBuyerCodes, getVendorCodes, createPurchaseOrder } from '../services/integration';"
        )
        Write-Host "   Added API imports" -ForegroundColor Green
    }

    # Replace load
    $oldLoad = @"
    // Load buyer and vendor codes from localStorage
    const buyers = JSON.parse(localStorage.getItem('buyerCodes') || '[]');
    const vendors = JSON.parse(localStorage.getItem('vendorCodes') || '[]');
    setBuyerCodes(buyers);
    setVendorCodes(vendors);
"@
    $newLoad = @"
    // Load buyer and vendor codes from API, fallback to localStorage
    const loadCodes = async () => {
      try {
        const [buyerData, vendorData] = await Promise.all([getBuyerCodes(), getVendorCodes()]);
        const b = buyerData?.results || buyerData || [];
        const v = vendorData?.results || vendorData || [];
        setBuyerCodes(Array.isArray(b) ? b : []);
        setVendorCodes(Array.isArray(v) ? v : []);
      } catch (err) {
        console.warn('API load failed, using localStorage:', err);
        const buyers = JSON.parse(localStorage.getItem('buyerCodes') || '[]');
        const vendors = JSON.parse(localStorage.getItem('vendorCodes') || '[]');
        setBuyerCodes(buyers);
        setVendorCodes(vendors);
      }
    };
    loadCodes();
"@
    if ($c.Contains($oldLoad)) {
        $c = $c.Replace($oldLoad, $newLoad)
        Write-Host "   Load pattern updated to API-first" -ForegroundColor Green
    }

    # Add API save
    $oldSave = @"
      existingPOs.push(newPOData);
      localStorage.setItem('poCodes', JSON.stringify(existingPOs));
      
      setGeneratedCode(newPOCode);
"@
    $newSave = @"
      existingPOs.push(newPOData);
      localStorage.setItem('poCodes', JSON.stringify(existingPOs));

      // Save to API in background
      createPurchaseOrder({
        order_date: formData.orderDate,
        order_time: formData.orderTime,
        factory_po: formData.factoryPo.trim(),
        buyer_code: formData.codeBuyer.trim() || null,
        vendor_code: formData.codeVendor.trim() || null,
        product_category: formData.productCategory.trim(),
        category_code: formData.categoryCode.trim(),
        po_description: formData.poDescription.trim(),
        particulars: formData.particulars.trim(),
        qty: parseFloat(formData.qty) || 0,
        unit_rate: parseFloat(formData.unitRate) || 0,
        amount: parseFloat(formData.amount) || 0,
        delivery_date: formData.deliveryDate,
        payment_terms: formData.paymentTerms.trim(),
        remarks: formData.remarks.trim(),
      }).catch(err => console.warn('API save PO failed (saved locally):', err));
      
      setGeneratedCode(newPOCode);
"@
    if ($c.Contains($oldSave) -and -not ($c -match "createPurchaseOrder\(")) {
        $c = $c.Replace($oldSave, $newSave)
        Write-Host "   Save pattern updated to include API call" -ForegroundColor Green
    }

    Set-Content -Path $f -Value $c -NoNewline
    Write-Host "   GeneratePOCode.jsx done" -ForegroundColor Green
}

# ============================================================================
# STEP 7: CompanyEssentials.jsx
# ============================================================================
Write-Host "`n[Step 7] Patching CompanyEssentials.jsx" -ForegroundColor Yellow
$f = "src\components\CompanyEssentials.jsx"
if (Test-Path $f) {
    $c = Get-Content $f -Raw

    # Add import
    if (-not ($c -match "services/integration")) {
        $c = $c.Replace(
            "import { cn } from '@/lib/utils';",
            "import { cn } from '@/lib/utils';`nimport { getCompanyEssentials, createCompanyEssential } from '../services/integration';"
        )
        Write-Host "   Added API imports" -ForegroundColor Green
    }

    # Replace load
    $oldLoad = @"
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('companyEssentials') || '[]');
    setExistingEssentials(stored);
  }, [selectedCategory, saveStatus]);
"@
    $newLoad = @"
  useEffect(() => {
    const loadEssentials = async () => {
      try {
        const data = await getCompanyEssentials(selectedCategory || undefined);
        const list = data?.results || data || [];
        setExistingEssentials(Array.isArray(list) ? list : []);
      } catch (err) {
        console.warn('API fetch essentials failed, using localStorage:', err);
        const stored = JSON.parse(localStorage.getItem('companyEssentials') || '[]');
        setExistingEssentials(stored);
      }
    };
    loadEssentials();
  }, [selectedCategory, saveStatus]);
"@
    if ($c.Contains($oldLoad)) {
        $c = $c.Replace($oldLoad, $newLoad)
        Write-Host "   Load pattern updated to API-first" -ForegroundColor Green
    }

    # Add API save
    $oldSave = @"
    const existingData = JSON.parse(localStorage.getItem('companyEssentials') || '[]');
    existingData.push(dataToSave);
    localStorage.setItem('companyEssentials', JSON.stringify(existingData));
    setExistingEssentials(existingData);
  };
"@
    $newSave = @"
    const existingData = JSON.parse(localStorage.getItem('companyEssentials') || '[]');
    existingData.push(dataToSave);
    localStorage.setItem('companyEssentials', JSON.stringify(existingData));
    setExistingEssentials(existingData);

    // Save to API in background
    createCompanyEssential({
      category: selectedCategory?.toUpperCase().replace(/[\s&\/]/g, '_'),
      entry_date: commonDate,
      department: form.data.department,
      item_description: form.data.itemDescription || form.data.item || form.data.machineType,
      machine_type: form.data.machineType,
      component_spec: form.data.componentSpec,
      qty: parseFloat(form.data.qty) || null,
      amount: parseFloat(form.data.amount) || null,
      unit: form.data.unit,
      for_field: form.data.forField,
      remarks: form.data.remarks,
    }).catch(err => console.warn('API save essential failed (saved locally):', err));
  };
"@
    if ($c.Contains($oldSave) -and -not ($c -match "createCompanyEssential\(")) {
        $c = $c.Replace($oldSave, $newSave)
        Write-Host "   Save pattern updated to include API call" -ForegroundColor Green
    }

    Set-Content -Path $f -Value $c -NoNewline
    Write-Host "   CompanyEssentials.jsx done" -ForegroundColor Green
}

# ============================================================================
# STEP 8: InternalPurchaseOrder.jsx
# ============================================================================
Write-Host "`n[Step 8] Patching InternalPurchaseOrder.jsx" -ForegroundColor Yellow
$f = "src\components\InternalPurchaseOrder\InternalPurchaseOrder.jsx"
if (Test-Path $f) {
    $c = Get-Content $f -Raw

    # Add import
    if (-not ($c -match "services/integration")) {
        $c = $c.Replace(
            "import { FormCard, FullscreenContent } from '@/components/ui/form-layout';",
            "import { FormCard, FullscreenContent } from '@/components/ui/form-layout';`nimport { getIPOs, createIPO, getBuyerCodes } from '../../services/integration';"
        )
        Write-Host "   Added API imports" -ForegroundColor Green
    }

    # Replace IPO list load
    $oldLoad = @"
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('internalPurchaseOrders') || '[]');
    setExistingIPOs(stored);
  }, [showInitialScreen]);
"@
    $newLoad = @"
  useEffect(() => {
    const loadIPOs = async () => {
      try {
        const data = await getIPOs();
        const list = data?.results || data || [];
        setExistingIPOs(Array.isArray(list) ? list : []);
        localStorage.setItem('internalPurchaseOrders', JSON.stringify(list));
      } catch (err) {
        console.warn('API fetch IPOs failed, using localStorage:', err);
        const stored = JSON.parse(localStorage.getItem('internalPurchaseOrders') || '[]');
        setExistingIPOs(stored);
      }
    };
    loadIPOs();
  }, [showInitialScreen]);
"@
    if ($c.Contains($oldLoad)) {
        $c = $c.Replace($oldLoad, $newLoad)
        Write-Host "   IPO load pattern updated" -ForegroundColor Green
    }

    # Replace buyer codes load
    $oldBuyer = @"
  // Load buyer codes from localStorage
  useEffect(() => {
    try {
      const buyerCodes = JSON.parse(localStorage.getItem('buyerCodes') || '[]');
      const codes = buyerCodes.map(buyer => buyer.code);
      setBuyerCodeOptions(codes);
    } catch (error) {
      console.error('Error loading buyer codes:', error);
      setBuyerCodeOptions([]);
    }
  }, []);
"@
    $newBuyer = @"
  // Load buyer codes from API first, localStorage fallback
  useEffect(() => {
    const loadBuyerCodes = async () => {
      try {
        const data = await getBuyerCodes();
        const list = data?.results || data || [];
        const codes = list.map(buyer => buyer.code || buyer.id);
        setBuyerCodeOptions(codes);
      } catch (err) {
        console.warn('API buyer codes failed, using localStorage:', err);
        try {
          const buyerCodes = JSON.parse(localStorage.getItem('buyerCodes') || '[]');
          const codes = buyerCodes.map(buyer => buyer.code);
          setBuyerCodeOptions(codes);
        } catch (error) {
          console.error('Error loading buyer codes:', error);
          setBuyerCodeOptions([]);
        }
      }
    };
    loadBuyerCodes();
  }, []);
"@
    if ($c.Contains($oldBuyer)) {
        $c = $c.Replace($oldBuyer, $newBuyer)
        Write-Host "   Buyer codes load pattern updated" -ForegroundColor Green
    }

    # Add API save
    $oldSave = @"
      localStorage.setItem('internalPurchaseOrders', JSON.stringify(existingIPOs));
      setExistingIPOs(existingIPOs);
    } catch (error) {
      console.error('Error saving IPO:', error);
    }
"@
    $newSave = @"
      localStorage.setItem('internalPurchaseOrders', JSON.stringify(existingIPOs));
      setExistingIPOs(existingIPOs);

      // Save to API in background
      createIPO({
        order_type: initialData.orderType?.toUpperCase(),
        buyer_code: initialData.buyerCode || null,
        program_name: initialData.programName,
        po_sr_no: poSrNo,
      }).catch(err => console.warn('API save IPO failed (saved locally):', err));
    } catch (error) {
      console.error('Error saving IPO:', error);
    }
"@
    if ($c.Contains($oldSave) -and -not ($c -match "createIPO\(")) {
        $c = $c.Replace($oldSave, $newSave)
        Write-Host "   IPO save pattern updated to include API call" -ForegroundColor Green
    }

    Set-Content -Path $f -Value $c -NoNewline
    Write-Host "   InternalPurchaseOrder.jsx done" -ForegroundColor Green
}

# ============================================================================
# STEP 9: Step0.jsx (FactoryCode buyer codes)
# ============================================================================
Write-Host "`n[Step 9] Patching GenerateFactoryCode Step0.jsx" -ForegroundColor Yellow
$f = "src\components\GenerateFactoryCode\components\steps\Step0.jsx"
if (Test-Path $f) {
    $c = Get-Content $f -Raw

    # Add import
    if (-not ($c -match "services/integration")) {
        $c = $c.Replace(
            "import { cn } from '@/lib/utils';",
            "import { cn } from '@/lib/utils';`nimport { getBuyerCodes } from '../../../../services/integration';"
        )
        Write-Host "   Added API import" -ForegroundColor Green
    }

    # Replace load
    $oldLoad = @"
  // Load buyer codes from localStorage
  useEffect(() => {
    try {
      const buyerCodes = JSON.parse(localStorage.getItem('buyerCodes') || '[]');
      const codes = buyerCodes.map(buyer => buyer.code);
      setBuyerCodeOptions(codes);
    } catch (error) {
      console.error('Error loading buyer codes:', error);
      setBuyerCodeOptions([]);
    }
  }, []);
"@
    $newLoad = @"
  // Load buyer codes from API first, localStorage fallback
  useEffect(() => {
    const loadBuyerCodes = async () => {
      try {
        const data = await getBuyerCodes();
        const list = data?.results || data || [];
        const codes = list.map(buyer => buyer.code || buyer.id);
        setBuyerCodeOptions(codes);
      } catch (err) {
        console.warn('API buyer codes failed, using localStorage:', err);
        try {
          const buyerCodes = JSON.parse(localStorage.getItem('buyerCodes') || '[]');
          const codes = buyerCodes.map(buyer => buyer.code);
          setBuyerCodeOptions(codes);
        } catch (error) {
          console.error('Error loading buyer codes:', error);
          setBuyerCodeOptions([]);
        }
      }
    };
    loadBuyerCodes();
  }, []);
"@
    if ($c.Contains($oldLoad)) {
        $c = $c.Replace($oldLoad, $newLoad)
        Write-Host "   Buyer codes load pattern updated" -ForegroundColor Green
    }

    Set-Content -Path $f -Value $c -NoNewline
    Write-Host "   Step0.jsx done" -ForegroundColor Green
}

# ============================================================================
# DONE
# ============================================================================
Write-Host "`n======================================" -ForegroundColor Green
Write-Host "ALL FRONTEND CHANGES APPLIED!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""
Write-Host "Files modified:"
Write-Host "  src\services\integration.js (API layer + new functions)"
Write-Host "  src\components\BuyerMasterSheet.jsx (import path)"
Write-Host "  src\components\VendorMasterSheet.jsx (import path)"
Write-Host "  src\components\GenerateBuyerCode.jsx (API load + save)"
Write-Host "  src\components\GenerateVendorCode.jsx (API load + save)"
Write-Host "  src\components\GeneratePOCode.jsx (API load + save)"
Write-Host "  src\components\CompanyEssentials.jsx (API load + save)"
Write-Host "  src\components\InternalPurchaseOrder\InternalPurchaseOrder.jsx (API load + save)"
Write-Host "  src\components\GenerateFactoryCode\components\steps\Step0.jsx (API load)"
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  git add -A"
Write-Host "  git commit -m 'Connect all components to backend API with localStorage fallback'"
Write-Host "  git push origin main"
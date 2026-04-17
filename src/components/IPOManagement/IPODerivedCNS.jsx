import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ConsumptionSheet from '../GenerateFactoryCode/components/ConsumptionSheet';
import { getFactoryCodeDraft } from '../../services/integration';

const STORAGE_KEY = 'factoryCodeFormData';
const storageKey = (ipoCode) => (ipoCode ? `${STORAGE_KEY}:${ipoCode}` : STORAGE_KEY);

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

const rehydrateSkuImages = (data) => {
  (data?.skus || []).forEach((sku) => {
    if (sku?.imageBase64) {
      sku.image = base64ToFile(sku.imageBase64);
      sku.imagePreview = sku.imageBase64.data;
    }
    (sku?.subproducts || []).forEach((sub) => {
      if (sub?.imageBase64) {
        sub.image = base64ToFile(sub.imageBase64);
        sub.imagePreview = sub.imageBase64.data;
      }
    });
  });
  return data;
};

const loadLocalSnapshot = (ipoCode) => {
  try {
    const raw = localStorage.getItem(storageKey(ipoCode));
    if (!raw) return null;
    return rehydrateSkuImages(JSON.parse(raw));
  } catch (e) {
    console.warn('Failed to load derived CNS snapshot:', e);
    return null;
  }
};

const IPODerivedCNS = ({ ipo, onNavigateToSpec }) => {
  const ipoCode = ipo?.ipoCode || ipo?.code || '';
  const [formData, setFormData] = useState(() => loadLocalSnapshot(ipoCode));
  const [loading, setLoading] = useState(!formData);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [showShareSuccess, setShowShareSuccess] = useState(false);
  const consumptionSheetRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    if (!ipoCode) {
      setLoading(false);
      return () => {};
    }

    // Prefer local snapshot. If missing, try the server draft and only use it
    // when it belongs to this IPO.
    const local = loadLocalSnapshot(ipoCode);
    if (local) {
      setFormData(local);
      setLoading(false);
      return () => { cancelled = true; };
    }

    setLoading(true);
    (async () => {
      try {
        const res = await getFactoryCodeDraft();
        if (cancelled) return;
        const draft = res?.payload;
        if (!draft || String(draft.ipoCode || '').trim().toLowerCase() !== ipoCode.trim().toLowerCase()) {
          setFormData(null);
        } else {
          setFormData(rehydrateSkuImages(draft));
        }
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Failed to load derived consumption sheet.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [ipoCode]);

  const mergedFormData = useMemo(() => {
    if (!formData) return null;
    return {
      ...formData,
      ipoCode: formData.ipoCode || ipoCode,
      orderType: formData.orderType || ipo?.orderType || '',
      buyerCode: formData.buyerCode || ipo?.buyerCode || '',
    };
  }, [formData, ipoCode, ipo?.orderType, ipo?.buyerCode]);

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <p style={{ color: '#6b7280' }}>Loading derived consumption sheet…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <p style={{ color: '#b91c1c' }}>{error}</p>
      </div>
    );
  }

  if (!mergedFormData) {
    return (
      <div style={{ padding: 24 }}>
        <p style={{ color: '#6b7280', maxWidth: 640 }}>
          No derived consumption sheet is available for <strong>{ipoCode}</strong> yet.
          Complete the IPO Spec and click <strong>Generate Factory Code</strong> to
          generate the sheet.
        </p>
      </div>
    );
  }

  const handleEditSection = (sectionKey, skuId) => {
    if (onNavigateToSpec) onNavigateToSpec(sectionKey, skuId);
  };

  return (
    <div className="mb-8 mx-auto min-w-0 w-full max-w-[2400px] px-4 overflow-x-auto">
      <div className="flex justify-end gap-3 mb-4 px-2 sm:px-0">
        <Button
          type="button"
          variant={editMode ? 'default' : 'outline'}
          onClick={() => setEditMode((v) => !v)}
        >
          {editMode ? 'Done Editing' : 'Edit'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            const ok = consumptionSheetRef.current?.shareToPurchase?.();
            if (ok) setShowShareSuccess(true);
          }}
        >
          Share to Purchase Department
        </Button>
      </div>
      {editMode && (
        <p className="text-sm text-muted-foreground mb-4 px-2 sm:px-0">
          Click on any section to navigate to the page where you can edit those values.
        </p>
      )}
      <ConsumptionSheet
        ref={consumptionSheetRef}
        formData={mergedFormData}
        isEditMode={editMode}
        onEditSection={handleEditSection}
      />

      <Dialog open={showShareSuccess} onOpenChange={setShowShareSuccess}>
        <DialogContent className="max-w-md" showCloseButton={true}>
          <div className="flex flex-col items-center text-center" style={{ padding: '32px' }}>
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mb-4">
              ✓
            </div>
            <DialogHeader>
              <DialogTitle className="text-lg">Shared to Purchase Department</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground" style={{ marginTop: '6px' }}>
              Consumption sheet has been shared successfully.
            </p>
            <Button
              type="button"
              className="mt-6 min-w-[140px]"
              style={{ marginTop: '16px' }}
              onClick={() => setShowShareSuccess(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IPODerivedCNS;

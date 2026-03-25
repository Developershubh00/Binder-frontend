import { useEffect, useMemo, useState } from 'react';
import BaseFormTemplate from './BaseFormTemplate';
import { formsConfig } from './formConfig';
import { FullscreenContent, FormCard } from '@/components/ui/form-layout';
import {
  getFormDisplayName,
  getOrderTypeLabel,
  isQualityYes,
  mapArtworkCategoryToFormKey,
  mapRawMaterialToFormKey,
  ORDER_TYPE_SEQUENCE,
  toCollectionArray,
} from '@/utils/uqrMappings';

const FACTORY_STORAGE_KEY = 'factoryCodeFormData';
const INTERNAL_PURCHASE_ORDERS_KEY = 'internalPurchaseOrders';
const UQR_FILLED_SECTIONS_KEY = 'uqrFilledSections';
const UQR_DRAFT_PREFIX = 'uqrDraft::';

const dropdownStyle = {
  padding: '10px 14px',
  fontSize: '14px',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  backgroundColor: '#fff',
  minWidth: '220px',
  cursor: 'pointer',
};

const infoBannerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  padding: '16px 18px',
  background: '#f8f9fa',
  borderRadius: '12px',
  border: '1px solid #e5e7eb',
};

const parseJson = (value, fallback) => {
  try {
    const parsed = JSON.parse(value);
    return parsed == null ? fallback : parsed;
  } catch {
    return fallback;
  }
};

const getSectionContextKey = ({ orderType, ipoCode, ipcCode, formKey }) =>
  `${orderType}::${ipoCode}::${ipcCode}::${formKey}`;

const parseSectionContextKey = (contextKey = '') => {
  const [orderType = '', ipoCode = '', ipcCode = '', formKey = ''] = String(contextKey).split('::');
  if (!orderType || !ipoCode || !ipcCode || !formKey) {
    return null;
  }
  return { orderType, ipoCode, ipcCode, formKey };
};

const getDraftStorageKey = (contextKey = '') => (contextKey ? `${UQR_DRAFT_PREFIX}${contextKey}` : '');
const toCodeKey = (value) => String(value || '').trim().toUpperCase();

const compareOrderType = (left, right) => {
  const leftIndex = ORDER_TYPE_SEQUENCE.indexOf(left);
  const rightIndex = ORDER_TYPE_SEQUENCE.indexOf(right);
  const normalizedLeft = leftIndex === -1 ? Number.MAX_SAFE_INTEGER : leftIndex;
  const normalizedRight = rightIndex === -1 ? Number.MAX_SAFE_INTEGER : rightIndex;
  if (normalizedLeft !== normalizedRight) {
    return normalizedLeft - normalizedRight;
  }
  return String(left || '').localeCompare(String(right || ''));
};

const formatSavedAt = (value) => {
  if (!value) return 'Saved draft';
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return 'Saved draft';
  return parsedDate.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const collectUqrFormsForStepData = (stepData = {}) => {
  const formKeys = new Set();

  toCollectionArray(stepData.rawMaterials).forEach((material) => {
    const hasMaterialQualityYes = isQualityYes(material?.qualityVerification);
    const hasWorkOrderQualityYes = toCollectionArray(material?.workOrders)
      .some((workOrder) => isQualityYes(workOrder?.qualityVerification));
    if (!hasMaterialQualityYes && !hasWorkOrderQualityYes) return;

    const formKey = mapRawMaterialToFormKey(material);
    if (formKey && formsConfig[formKey]) formKeys.add(formKey);
  });

  toCollectionArray(stepData.artworkMaterials).forEach((material) => {
    const artworkCategory = material?.artworkCategory;
    const qualityValue =
      material?.qualityVerificationByCategory?.[artworkCategory] ?? material?.qualityVerification;

    if (artworkCategory && isQualityYes(qualityValue)) {
      const formKey = mapArtworkCategoryToFormKey(artworkCategory);
      if (formKey && formsConfig[formKey]) formKeys.add(formKey);
      return;
    }

    const qualityByCategory = material?.qualityVerificationByCategory;
    if (qualityByCategory && typeof qualityByCategory === 'object') {
      Object.entries(qualityByCategory).forEach(([category, quality]) => {
        if (!isQualityYes(quality)) return;
        const formKey = mapArtworkCategoryToFormKey(category);
        if (formKey && formsConfig[formKey]) formKeys.add(formKey);
      });
    }
  });

  return Array.from(formKeys);
};

const getIpcEntriesFromFactoryDraft = (entry = {}) => {
  const ipcMap = new Map();
  const skus = toCollectionArray(entry?.skus);

  const addIpc = (ipcCode, stepData) => {
    const code = String(ipcCode || '').trim();
    if (!code) return;
    const forms = ipcMap.get(code) || new Set();
    if (stepData) {
      collectUqrFormsForStepData(stepData).forEach((formKey) => forms.add(formKey));
    }
    ipcMap.set(code, forms);
  };

  skus.forEach((sku, skuIndex) => {
    const mainIpcCode = sku?.ipcCode || `IPC-${skuIndex + 1}`;
    addIpc(mainIpcCode, sku?.stepData);

    toCollectionArray(sku?.subproducts).forEach((subproduct, spIndex) => {
      const spIpcCode =
        subproduct?.ipcCode
        || `${String(mainIpcCode).replace(/\/SP-?\d+$/i, '')}/SP-${spIndex + 1}`;
      addIpc(spIpcCode, subproduct?.stepData);
    });
  });

  return Array.from(ipcMap.entries()).map(([ipcCode, forms]) => ({
    ipcCode,
    uqrForms: Array.from(forms),
  }));
};

const sortIpcEntries = (ipcs = []) =>
  [...ipcs]
    .map((ipc) => ({
      ...ipc,
      uqrForms: [...(ipc.uqrForms || [])].sort((left, right) =>
        getFormDisplayName(left, formsConfig[left]?.title || left)
          .localeCompare(getFormDisplayName(right, formsConfig[right]?.title || right))
      ),
    }))
    .sort((left, right) => left.ipcCode.localeCompare(right.ipcCode));

const sortEntries = (entries = []) =>
  [...entries]
    .map((entry) => ({
      ...entry,
      ipcs: sortIpcEntries(entry.ipcs),
    }))
    .sort((left, right) => {
      const orderTypeComparison = compareOrderType(left.orderType, right.orderType);
      if (orderTypeComparison !== 0) return orderTypeComparison;
      return left.code.localeCompare(right.code);
    });

const loadFactorySavedEntries = () => {
  const keySet = new Set([FACTORY_STORAGE_KEY]);
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (key?.startsWith(`${FACTORY_STORAGE_KEY}:`)) {
      keySet.add(key);
    }
  }

  const entryMap = new Map();
  const mergeIpcs = (existing = [], incoming = []) => {
    const ipcMap = new Map();
    existing.forEach((ipc) => {
      ipcMap.set(ipc.ipcCode, new Set(ipc.uqrForms || []));
    });
    incoming.forEach((ipc) => {
      const forms = ipcMap.get(ipc.ipcCode) || new Set();
      (ipc.uqrForms || []).forEach((formKey) => forms.add(formKey));
      ipcMap.set(ipc.ipcCode, forms);
    });
    return Array.from(ipcMap.entries()).map(([ipcCode, forms]) => ({
      ipcCode,
      uqrForms: Array.from(forms),
    }));
  };

  Array.from(keySet).forEach((key) => {
    const raw = localStorage.getItem(key);
    const parsed = parseJson(raw, null);
    if (!parsed || typeof parsed !== 'object') return;

    const orderType = getOrderTypeLabel(parsed?.orderType || parsed?.order_type || '');
    const code = String(parsed?.ipoCode || parsed?.code || '').trim();
    if (!orderType || !code) return;

    const ipcs = getIpcEntriesFromFactoryDraft(parsed);
    if (ipcs.length === 0) return;

    const mapKey = `${orderType}::${toCodeKey(code)}`;
    const previousEntry = entryMap.get(mapKey);
    entryMap.set(
      mapKey,
      previousEntry
        ? { ...previousEntry, ipcs: mergeIpcs(previousEntry.ipcs, ipcs) }
        : { orderType, code, ipcs }
    );
  });

  const ipoSource = parseJson(localStorage.getItem(INTERNAL_PURCHASE_ORDERS_KEY), []);
  if (!Array.isArray(ipoSource)) return [];

  const combined = new Map();
  ipoSource.forEach((ipo) => {
    const orderType = getOrderTypeLabel(ipo?.orderType || ipo?.order_type || '');
    const code = String(ipo?.ipoCode || ipo?.code || '').trim();
    if (!orderType || !code) return;

    const mapKey = `${orderType}::${toCodeKey(code)}`;
    const factoryEntry = entryMap.get(mapKey);
    combined.set(mapKey, {
      orderType,
      code,
      ipcs: factoryEntry?.ipcs || [],
    });
  });

  return sortEntries(Array.from(combined.values()));
};

const loadSavedDatabaseEntries = (filledSections = {}) => {
  const entryMap = new Map();

  const ensureIpcEntry = (entry, ipcCode) => {
    const existingIpc = entry.ipcs.find((ipc) => ipc.ipcCode === ipcCode);
    if (existingIpc) return existingIpc;
    const nextIpc = { ipcCode, uqrForms: [], savedAtByForm: {} };
    entry.ipcs.push(nextIpc);
    return nextIpc;
  };

  const addSavedContext = (contextKey, savedAt = '') => {
    const context = parseSectionContextKey(contextKey);
    if (!context || !formsConfig[context.formKey]) return;

    const entryKey = `${context.orderType}::${toCodeKey(context.ipoCode)}`;
    const entry = entryMap.get(entryKey) || {
      orderType: context.orderType,
      code: context.ipoCode,
      ipcs: [],
    };

    const ipcEntry = ensureIpcEntry(entry, context.ipcCode);
    if (!ipcEntry.uqrForms.includes(context.formKey)) {
      ipcEntry.uqrForms.push(context.formKey);
    }
    if (!ipcEntry.savedAtByForm[context.formKey] || savedAt) {
      ipcEntry.savedAtByForm[context.formKey] = savedAt;
    }

    entryMap.set(entryKey, entry);
  };

  Object.entries(filledSections).forEach(([contextKey, savedAt]) => {
    addSavedContext(contextKey, typeof savedAt === 'string' ? savedAt : '');
  });

  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (!key?.startsWith(UQR_DRAFT_PREFIX)) continue;
    const contextKey = key.slice(UQR_DRAFT_PREFIX.length);
    addSavedContext(contextKey, filledSections?.[contextKey] || '');
  }

  return sortEntries(Array.from(entryMap.values()));
};

const UQRFormsPreview = ({ mode = 'forms' }) => {
  const isDatabaseMode = mode === 'database';
  const [formEntries, setFormEntries] = useState([]);
  const [databaseEntries, setDatabaseEntries] = useState([]);
  const [filledSections, setFilledSections] = useState({});
  const [selectedOrderType, setSelectedOrderType] = useState('');
  const [selectedIpoCode, setSelectedIpoCode] = useState('');
  const [selectedIpcCode, setSelectedIpcCode] = useState('');
  const [selectedFormKey, setSelectedFormKey] = useState('');

  useEffect(() => {
    const loadData = () => {
      const nextFilledSections = parseJson(localStorage.getItem(UQR_FILLED_SECTIONS_KEY), {});
      const normalizedFilledSections =
        nextFilledSections && typeof nextFilledSections === 'object' ? nextFilledSections : {};

      setFormEntries(loadFactorySavedEntries());
      setDatabaseEntries(loadSavedDatabaseEntries(normalizedFilledSections));
      setFilledSections(normalizedFilledSections);
    };

    loadData();
    window.addEventListener('storage', loadData);
    window.addEventListener('factoryCodeFormDataUpdated', loadData);
    window.addEventListener('internalPurchaseOrdersUpdated', loadData);
    window.addEventListener('uqrFilledSectionsUpdated', loadData);
    return () => {
      window.removeEventListener('storage', loadData);
      window.removeEventListener('factoryCodeFormDataUpdated', loadData);
      window.removeEventListener('internalPurchaseOrdersUpdated', loadData);
      window.removeEventListener('uqrFilledSectionsUpdated', loadData);
    };
  }, []);

  const activeEntries = isDatabaseMode ? databaseEntries : formEntries;
  const orderTypes = ORDER_TYPE_SEQUENCE;

  useEffect(() => {
    if (!orderTypes.includes(selectedOrderType)) {
      setSelectedOrderType(orderTypes[0] || '');
    }
  }, [orderTypes, selectedOrderType]);

  const ipoEntries = useMemo(
    () => activeEntries.filter((entry) => entry.orderType === selectedOrderType),
    [activeEntries, selectedOrderType]
  );

  useEffect(() => {
    if (!ipoEntries.some((entry) => entry.code === selectedIpoCode)) {
      setSelectedIpoCode(ipoEntries[0]?.code || '');
    }
  }, [ipoEntries, selectedIpoCode]);

  const selectedIpoEntry = useMemo(
    () => ipoEntries.find((entry) => entry.code === selectedIpoCode) || null,
    [ipoEntries, selectedIpoCode]
  );

  const ipcEntries = selectedIpoEntry?.ipcs || [];

  useEffect(() => {
    if (!ipcEntries.some((ipc) => ipc.ipcCode === selectedIpcCode)) {
      setSelectedIpcCode(ipcEntries[0]?.ipcCode || '');
    }
  }, [ipcEntries, selectedIpcCode]);

  const selectedIpcEntry = useMemo(
    () => ipcEntries.find((ipc) => ipc.ipcCode === selectedIpcCode) || null,
    [ipcEntries, selectedIpcCode]
  );

  const sections = useMemo(() => {
    const formKeys = selectedIpcEntry?.uqrForms || [];
    return formKeys
      .filter((formKey) => Boolean(formsConfig[formKey]))
      .map((formKey) => ({
        formKey,
        label: getFormDisplayName(formKey, formsConfig[formKey]?.title || formKey),
        savedAt: selectedIpcEntry?.savedAtByForm?.[formKey] || '',
      }))
      .sort((left, right) => left.label.localeCompare(right.label));
  }, [selectedIpcEntry]);

  useEffect(() => {
    if (!sections.some((section) => section.formKey === selectedFormKey)) {
      setSelectedFormKey(sections[0]?.formKey || '');
    }
  }, [sections, selectedFormKey]);

  const selectedContext =
    selectedOrderType && selectedIpoCode && selectedIpcCode && selectedFormKey
      ? {
          orderType: selectedOrderType,
          ipoCode: selectedIpoCode,
          ipcCode: selectedIpcCode,
          formKey: selectedFormKey,
        }
      : null;

  const selectedContextKey = selectedContext ? getSectionContextKey(selectedContext) : '';
  const selectedFormConfig = selectedFormKey ? formsConfig[selectedFormKey] : null;
  const draftStorageKey = getDraftStorageKey(selectedContextKey);
  const selectedSavedAt = selectedIpcEntry?.savedAtByForm?.[selectedFormKey] || '';

  const isSectionFilled = (formKey) => {
    if (isDatabaseMode) return true;
    if (!selectedOrderType || !selectedIpoCode || !selectedIpcCode) return false;

    const contextKey = getSectionContextKey({
      orderType: selectedOrderType,
      ipoCode: selectedIpoCode,
      ipcCode: selectedIpcCode,
      formKey,
    });
    return Boolean(filledSections[contextKey]);
  };

  const handleSectionSubmitSuccess = () => {
    if (!selectedContext) return;
    const contextKey = getSectionContextKey(selectedContext);
    const nextFilledSections = {
      ...filledSections,
      [contextKey]: new Date().toISOString(),
    };
    setFilledSections(nextFilledSections);
    localStorage.setItem(UQR_FILLED_SECTIONS_KEY, JSON.stringify(nextFilledSections));
    window.dispatchEvent(new Event('uqrFilledSectionsUpdated'));
  };

  const emptyIpoMessage = isDatabaseMode
    ? 'No saved UQR forms available for this section.'
    : 'No IPOs available for this section.';
  const emptyIpcMessage = isDatabaseMode
    ? 'No saved IPCs available for this IPO.'
    : 'No IPCs available for this IPO.';
  const emptySectionsMessage = isDatabaseMode
    ? 'No saved UQR forms found for this IPO and IPC.'
    : 'No Quality inspection required';

  return (
    <FullscreenContent style={{ overflowY: 'auto' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          padding: '24px',
        }}
      >
        <div style={infoBannerStyle}>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#111827' }}>
            {isDatabaseMode ? 'UQR Database' : 'UQR Forms'}
          </div>
          <p style={{ margin: 0, color: '#4b5563', lineHeight: 1.5 }}>
            {isDatabaseMode
              ? 'Browse all saved UQR forms using the same section, IPO, IPC, and form filters.'
              : 'Create and submit UQR forms using the existing section, IPO, IPC, and form flow.'}
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '16px',
            padding: '16px',
            background: '#f8f9fa',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontWeight: 600, color: '#111827' }}>Section</label>
            <select
              value={selectedOrderType}
              onChange={(event) => setSelectedOrderType(event.target.value)}
              style={dropdownStyle}
              aria-label="Select section type"
            >
              {orderTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontWeight: 600, color: '#111827' }}>IPO</label>
            <select
              value={selectedIpoCode}
              onChange={(event) => setSelectedIpoCode(event.target.value)}
              style={dropdownStyle}
              aria-label="Select IPO"
            >
              {ipoEntries.length === 0 ? (
                <option value="">No IPOs</option>
              ) : (
                ipoEntries.map((entry) => (
                  <option key={entry.code} value={entry.code}>
                    {entry.code}
                  </option>
                ))
              )}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontWeight: 600, color: '#111827' }}>IPC</label>
            <select
              value={selectedIpcCode}
              onChange={(event) => setSelectedIpcCode(event.target.value)}
              style={dropdownStyle}
              aria-label="Select IPC"
            >
              {ipcEntries.length === 0 ? (
                <option value="">No IPCs</option>
              ) : (
                ipcEntries.map((ipc) => (
                  <option key={ipc.ipcCode} value={ipc.ipcCode}>
                    {ipc.ipcCode}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        <FormCard style={{ padding: '20px' }}>
          <h2 style={{ margin: 0, marginBottom: '14px', fontSize: '16px', fontWeight: 700, color: '#111827' }}>
            {isDatabaseMode ? 'Saved UQR Forms' : 'Quality Inspection Sections'}
          </h2>
          {ipoEntries.length === 0 ? (
            <p style={{ margin: 0, color: '#6b7280' }}>
              {emptyIpoMessage}
            </p>
          ) : ipcEntries.length === 0 ? (
            <p style={{ margin: 0, color: '#6b7280' }}>
              {emptyIpcMessage}
            </p>
          ) : sections.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {sections.map((section) => {
                const filled = isSectionFilled(section.formKey);
                const isActive = selectedFormKey === section.formKey;
                return (
                  <button
                    key={section.formKey}
                    type="button"
                    onClick={() => setSelectedFormKey(section.formKey)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      borderRadius: '9999px',
                      border: `1px solid ${isActive ? '#111827' : '#d1d5db'}`,
                      background: isActive ? '#eef2ff' : '#ffffff',
                      cursor: 'pointer',
                      fontWeight: 600,
                      color: filled ? '#15803d' : '#1f2937',
                    }}
                  >
                    <span>{section.label}</span>
                    {filled && <span style={{ fontWeight: 700 }}>&#10003;</span>}
                  </button>
                );
              })}
            </div>
          ) : (
            <p style={{ margin: 0, color: '#6b7280' }}>
              {emptySectionsMessage}
            </p>
          )}
        </FormCard>

        {selectedFormConfig && selectedContext && (
          <FormCard style={{ padding: '20px' }}>
            {isDatabaseMode && (
              <div
                style={{
                  marginBottom: '16px',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid #dbeafe',
                  background: '#eff6ff',
                  color: '#1d4ed8',
                  fontSize: '13px',
                  fontWeight: 600,
                }}
              >
                {`Showing saved record: ${formatSavedAt(selectedSavedAt)}`}
              </div>
            )}
            <BaseFormTemplate
              key={selectedContextKey}
              formId={selectedFormKey}
              title={selectedFormConfig.title}
              sections={selectedFormConfig.sections}
              tableConfig={selectedFormConfig.tableConfig}
              draftStorageKey={draftStorageKey}
              apiContext={{
                orderType: selectedOrderType,
                ipoCode: selectedIpoCode,
                ipcCode: selectedIpcCode,
              }}
              onSubmitSuccess={isDatabaseMode ? undefined : handleSectionSubmitSuccess}
              readOnly={isDatabaseMode}
            />
          </FormCard>
        )}
      </div>
    </FullscreenContent>
  );
};

export default UQRFormsPreview;

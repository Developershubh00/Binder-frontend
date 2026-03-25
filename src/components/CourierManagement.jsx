import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FullscreenContent, FormCard, FormRow } from '@/components/ui/form-layout';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  createCourierRecord,
  getIPOs,
  listCourierRecords,
  updateCourierRecord,
} from '../services/integration';
import { getCurrentUser } from '../api/authService';
import { uploadToBlob } from '../services/blobUpload';
import { normalizeOrderType } from '../utils/orderType';
import './CourierManagement.css';

const COURIER_STORAGE_KEY = 'imsCourierRecords';
const COURIER_UPDATE_EVENT = 'courierRecordsUpdated';
const COURIER_API_SYNC_DELAY_MS = 700;

const IPO_TYPE_OPTIONS = ['Production', 'Sampling', 'Company'];

const SAMPLE_AS_OPTIONS = {
  Production: [
    { value: 'PP', label: 'PP' },
    { value: 'TOP', label: 'TOP' },
    { value: 'REVISED_PP', label: 'REVISED PP' },
    { value: 'REVISED_TOP', label: 'REVISED TOP' },
    { value: 'OTHER_TEXT', label: 'OTHERS TEXT' },
  ],
  Sampling: [
    { value: 'NEW_DEVELOPMENT', label: 'NEW DEVELOPMENT' },
    { value: 'BUYERS_RETURN', label: "BUYER'S RETURN" },
    { value: 'STOCK', label: 'STOCK' },
    { value: 'OTHER_TEXT', label: 'OTHER TEXT' },
  ],
  Company: [
    { value: 'OTHER_TEXT', label: 'OTHER TEXT' },
    { value: 'FAIR', label: 'FAIR' },
    { value: 'MARKET_WEEK', label: 'MARKET WEEK' },
    { value: 'EXHIBITION', label: 'EXHIBITION' },
  ],
};

const INITIAL_SLIP_STATE = {
  ipoType: '',
  ipoCode: '',
  sampleAs: '',
  sampleAsOtherText: '',
  boxesPackets: '',
  droppedBy: '',
  handedBy: '',
};

const STORAGE_MODE_LABELS = {
  checking: 'Checking API',
  api: 'Backend API',
  local: 'Local fallback',
};

const isBrowser = typeof window !== 'undefined';

const toLocalDateValue = (value = new Date()) => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const toStringValue = (value) => {
  if (value === null || value === undefined) return '';
  return String(value);
};

const buildRecordId = () => `courier-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const normalizeStoredCourierRecord = (item = {}) => {
  const id = String(item.id || item.clientRecordId || buildRecordId());
  const backendIdRaw = item.backendId ?? item.backend_id ?? null;
  const backendId =
    backendIdRaw === null || backendIdRaw === undefined || backendIdRaw === ''
      ? null
      : String(backendIdRaw);

  return {
    id,
    backendId,
    ipoType: normalizeOrderType(item.ipoType || item.ipo_type || item.orderType || item.order_type || ''),
    ipoCode: item.ipoCode || item.ipo_code || item.code || '',
    programName: item.programName || item.program_name || '',
    buyerCode: item.buyerCode || item.buyer_code || item.buyer_code_text || '',
    companyType: item.companyType || item.company_type || item.type || '',
    sampleAs: item.sampleAs || item.sample_as || '',
    sampleAsOtherText: item.sampleAsOtherText || item.sample_as_other_text || '',
    boxesPackets: toStringValue(item.boxesPackets ?? item.boxes_packets),
    attachImageRefUrl: item.attachImageRefUrl || item.attach_image_ref_url || '',
    attachImageRefName: item.attachImageRefName || item.attach_image_ref_name || '',
    droppedBy: item.droppedBy || item.dropped_by || '',
    handedBy: item.handedBy || item.handed_by || '',
    dispatchDate: item.dispatchDate || item.dispatch_date || '',
    courierReceipt: item.courierReceipt || item.courier_receipt || '',
    awbNumber: item.awbNumber || item.awb_number || '',
    edd: item.edd || item.expectedDeliveryDate || item.expected_delivery_date || '',
    status: item.status || '',
    handoverTo: item.handoverTo || item.handover_to || '',
    contact: toStringValue(item.contact),
    createdAt: item.createdAt || item.created_at || new Date().toISOString(),
    updatedAt: item.updatedAt || item.updated_at || item.createdAt || item.created_at || new Date().toISOString(),
    persistenceSource: backendId ? 'api' : item.persistenceSource || 'local',
  };
};

const normalizeStoredCourierRecords = (records) => {
  if (!Array.isArray(records)) return [];
  return records.map((item) => normalizeStoredCourierRecord(item));
};

const readStoredCourierRecords = () => {
  if (!isBrowser) return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(COURIER_STORAGE_KEY) || '[]');
    return normalizeStoredCourierRecords(parsed);
  } catch (error) {
    console.warn('Unable to read courier records from storage:', error);
    return [];
  }
};

const persistCourierRecords = (records) => {
  if (!isBrowser) return;
  const normalizedRecords = normalizeStoredCourierRecords(records);
  localStorage.setItem(COURIER_STORAGE_KEY, JSON.stringify(normalizedRecords));
  window.dispatchEvent(new Event(COURIER_UPDATE_EVENT));
};

const readStoredIPOs = () => {
  if (!isBrowser) return [];
  try {
    const parsed = JSON.parse(localStorage.getItem('internalPurchaseOrders') || '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => ({
      ipoCode: item.ipoCode || item.ipo_code || item.code || '',
      orderType: normalizeOrderType(item.orderType || item.order_type || ''),
      buyerCode: item.buyerCode || item.buyer_code_text || '',
      type: item.type || item.company_type || '',
      programName: item.programName || item.program_name || '',
      poSrNo: item.poSrNo || item.po_sr_no || '',
      createdAt: item.createdAt || item.created_at || '',
    }));
  } catch (error) {
    console.warn('Unable to read IPOs from storage:', error);
    return [];
  }
};

const mapFetchedIPO = (item) => ({
  ipoCode: item.ipo_code || item.ipoCode || item.code || '',
  orderType: normalizeOrderType(item.order_type || item.orderType || ''),
  buyerCode: item.buyer_code_text || item.buyerCode || '',
  type: item.company_type || item.type || '',
  programName: item.program_name || item.programName || '',
  poSrNo: item.po_sr_no || item.poSrNo || '',
  createdAt: item.created_at || item.createdAt || '',
});

const dedupeIpos = (items) =>
  Array.from(
    new Map(
      (items || [])
        .filter((item) => item?.ipoCode)
        .map((item) => [item.ipoCode, item])
    ).values()
  ).sort((a, b) => a.ipoCode.localeCompare(b.ipoCode));

const getSampleAsOptions = (ipoType) => SAMPLE_AS_OPTIONS[ipoType] || [];

const getSampleAsLabel = (record) => {
  const options = getSampleAsOptions(record.ipoType);
  const matchedOption = options.find((option) => option.value === record.sampleAs);
  if (record.sampleAs === 'OTHER_TEXT') {
    return record.sampleAsOtherText || matchedOption?.label || 'OTHER TEXT';
  }
  return matchedOption?.label || record.sampleAs || '-';
};

const extractCourierCollection = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.results)) return payload.results;
  if (Array.isArray(payload.records)) return payload.records;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.data?.results)) return payload.data.results;
  if (Array.isArray(payload.data?.records)) return payload.data.records;
  if (Array.isArray(payload.data?.items)) return payload.data.items;
  return payload.id || payload.ipo_code || payload.ipoCode ? [payload] : [];
};

const extractCourierRecord = (payload) => {
  if (!payload) return null;
  if (payload.data && !Array.isArray(payload.data)) return payload.data;
  if (payload.record && !Array.isArray(payload.record)) return payload.record;
  if (Array.isArray(payload.results) || Array.isArray(payload.records) || Array.isArray(payload.items)) {
    return null;
  }
  return payload;
};

const mapFetchedCourierRecord = (item = {}, fallbackRecord = {}) => {
  const fallback = normalizeStoredCourierRecord(fallbackRecord);
  const backendIdRaw =
    item.id ??
    item.record_id ??
    item.courier_id ??
    item.courierId ??
    item.backendId ??
    fallback.backendId;
  const backendId =
    backendIdRaw === null || backendIdRaw === undefined || backendIdRaw === ''
      ? null
      : String(backendIdRaw);
  const nextId =
    fallback.id ||
    item.client_record_id ||
    item.clientRecordId ||
    (backendId ? `courier-api-${backendId}` : buildRecordId());

  return normalizeStoredCourierRecord({
    ...fallback,
    id: nextId,
    backendId,
    ipoType: item.ipo_type || item.ipoType || item.order_type || item.orderType || fallback.ipoType,
    ipoCode: item.ipo_code || item.ipoCode || item.code || fallback.ipoCode,
    programName: item.program_name || item.programName || fallback.programName,
    buyerCode: item.buyer_code || item.buyerCode || item.buyer_code_text || fallback.buyerCode,
    companyType: item.company_type || item.companyType || item.type || fallback.companyType,
    sampleAs: item.sample_as || item.sampleAs || fallback.sampleAs,
    sampleAsOtherText: item.sample_as_other_text || item.sampleAsOtherText || fallback.sampleAsOtherText,
    boxesPackets: item.boxes_packets ?? item.boxesPackets ?? fallback.boxesPackets,
    attachImageRefUrl: item.attach_image_ref_url || item.attachImageRefUrl || fallback.attachImageRefUrl,
    attachImageRefName: item.attach_image_ref_name || item.attachImageRefName || fallback.attachImageRefName,
    droppedBy: item.dropped_by || item.droppedBy || fallback.droppedBy,
    handedBy: item.handed_by || item.handedBy || fallback.handedBy,
    dispatchDate: item.dispatch_date || item.dispatchDate || fallback.dispatchDate,
    courierReceipt: item.courier_receipt || item.courierReceipt || fallback.courierReceipt,
    awbNumber: item.awb_number || item.awbNumber || fallback.awbNumber,
    edd: item.edd || item.expected_delivery_date || item.expectedDeliveryDate || fallback.edd,
    status: item.status || fallback.status,
    handoverTo: item.handover_to || item.handoverTo || fallback.handoverTo,
    contact: item.contact ?? fallback.contact,
    createdAt: item.created_at || item.createdAt || fallback.createdAt,
    updatedAt: item.updated_at || item.updatedAt || fallback.updatedAt,
    persistenceSource: backendId ? 'api' : fallback.persistenceSource,
  });
};

const getCourierRecordKey = (record) => (record.backendId ? `backend:${record.backendId}` : `local:${record.id}`);

const mergeCourierRecords = (apiRecords, cachedRecords) => {
  const mergedRecords = new Map();

  apiRecords.forEach((record) => {
    const normalizedRecord = normalizeStoredCourierRecord(record);
    mergedRecords.set(getCourierRecordKey(normalizedRecord), normalizedRecord);
  });

  cachedRecords.forEach((record) => {
    const normalizedRecord = normalizeStoredCourierRecord(record);
    const recordKey = getCourierRecordKey(normalizedRecord);

    if (!mergedRecords.has(recordKey)) {
      mergedRecords.set(recordKey, normalizedRecord);
      return;
    }

    if (normalizedRecord.backendId) {
      const apiRecord = mergedRecords.get(recordKey);
      mergedRecords.set(
        recordKey,
        normalizeStoredCourierRecord({
          ...normalizedRecord,
          ...apiRecord,
          id: normalizedRecord.id || apiRecord.id,
          backendId: apiRecord.backendId || normalizedRecord.backendId,
          persistenceSource: 'api',
        })
      );
    }
  });

  return Array.from(mergedRecords.values());
};

const upsertCourierRecord = (records, incomingRecord) => {
  const normalizedIncoming = normalizeStoredCourierRecord(incomingRecord);
  const incomingKey = getCourierRecordKey(normalizedIncoming);
  let foundMatch = false;

  const nextRecords = records.map((record) => {
    const normalizedRecord = normalizeStoredCourierRecord(record);
    const matches =
      normalizedRecord.id === normalizedIncoming.id ||
      (normalizedRecord.backendId && normalizedRecord.backendId === normalizedIncoming.backendId) ||
      getCourierRecordKey(normalizedRecord) === incomingKey;

    if (!matches) return normalizedRecord;

    foundMatch = true;
    return normalizeStoredCourierRecord({
      ...normalizedRecord,
      ...normalizedIncoming,
      id: normalizedIncoming.id || normalizedRecord.id,
      backendId: normalizedIncoming.backendId || normalizedRecord.backendId,
    });
  });

  return foundMatch ? nextRecords : [normalizedIncoming, ...nextRecords];
};

const toCourierApiPayload = (record) => ({
  ipo_type: record.ipoType,
  ipo_code: record.ipoCode,
  program_name: record.programName || '',
  buyer_code: record.buyerCode || '',
  company_type: record.companyType || '',
  sample_as: record.sampleAs,
  sample_as_other_text: record.sampleAsOtherText || '',
  boxes_packets: record.boxesPackets || '',
  attach_image_ref_url: record.attachImageRefUrl || '',
  attach_image_ref_name: record.attachImageRefName || '',
  dropped_by: record.droppedBy || '',
  handed_by: record.handedBy || '',
  dispatch_date: record.dispatchDate || '',
  courier_receipt: record.courierReceipt || '',
  awb_number: record.awbNumber || '',
  edd: record.edd || '',
  status: record.status || '',
  handover_to: record.handoverTo || '',
  contact: record.contact || '',
});

const CourierManagement = ({ mode = 'slip' }) => {
  const isSlipMode = mode === 'slip';
  const [ipos, setIpos] = useState(() => dedupeIpos(readStoredIPOs()));
  const [records, setRecords] = useState(() => readStoredCourierRecords());
  const recordsRef = useRef(records);
  const syncTimersRef = useRef(new Map());
  const [slipForm, setSlipForm] = useState(INITIAL_SLIP_STATE);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [imageInputKey, setImageInputKey] = useState(0);
  const [masterFilterType, setMasterFilterType] = useState('');
  const [masterFilterIpo, setMasterFilterIpo] = useState('');
  const [isSavingSlip, setIsSavingSlip] = useState(false);
  const [persistenceMode, setPersistenceMode] = useState('checking');
  const [slipMessage, setSlipMessage] = useState({ type: '', text: '' });
  const [companyInfo, setCompanyInfo] = useState(null);

  useEffect(() => {
    recordsRef.current = records;
  }, [records]);

  const commitCourierRecords = (updater) => {
    setRecords((currentRecords) => {
      const nextRecords = normalizeStoredCourierRecords(
        typeof updater === 'function' ? updater(currentRecords) : updater
      );
      recordsRef.current = nextRecords;
      persistCourierRecords(nextRecords);
      return nextRecords;
    });
  };

  useEffect(() => {
    let cancelled = false;

    const syncIpos = async () => {
      try {
        const response = await getIPOs();
        const rawItems = response?.results || response?.data || response || [];
        const mapped = dedupeIpos(Array.isArray(rawItems) ? rawItems.map(mapFetchedIPO) : []);

        if (mapped.length > 0) {
          if (!cancelled) {
            setIpos(mapped);
          }
          if (isBrowser) {
            localStorage.setItem('internalPurchaseOrders', JSON.stringify(mapped));
            window.dispatchEvent(new Event('internalPurchaseOrdersUpdated'));
          }
          return;
        }
      } catch (error) {
        console.warn('Courier screen failed to refresh IPOs from API, using local cache:', error);
      }

      if (!cancelled) {
        setIpos(dedupeIpos(readStoredIPOs()));
      }
    };

    const syncIposFromStorage = () => {
      if (!cancelled) {
        setIpos(dedupeIpos(readStoredIPOs()));
      }
    };

    syncIpos();
    window.addEventListener('internalPurchaseOrdersUpdated', syncIposFromStorage);

    return () => {
      cancelled = true;
      window.removeEventListener('internalPurchaseOrdersUpdated', syncIposFromStorage);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    getCurrentUser()
      .then((res) => {
        if (cancelled) return;
        const td = res?.tenant_details || {};
        console.log('[CourierManagement] tenant_details:', JSON.stringify(td, null, 2));
        setCompanyInfo({
          name: td.company_name || td.trade_name || td.legal_name || '',
          gstin: td.gst_number || td.gstin || '',
          address: td.company_address || td.address || '',
          phone: td.company_phone || td.whatsapp_number || td.phone || td.mobile || '',
        });
      })
      .catch((err) => {
        console.warn('[CourierManagement] Failed to load user data:', err);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const syncRecordsFromStorage = () => {
      if (cancelled) return;
      const storedRecords = readStoredCourierRecords();
      recordsRef.current = storedRecords;
      setRecords(storedRecords);
    };

    const loadCourierRecords = async () => {
      const cachedRecords = readStoredCourierRecords();

      if (!cancelled) {
        recordsRef.current = cachedRecords;
        setRecords(cachedRecords);
      }

      const response = await listCourierRecords();
      if (cancelled) return;

      if (response.available) {
        const apiRecords = extractCourierCollection(response.data)
          .map((item) => mapFetchedCourierRecord(item))
          .filter((record) => record.ipoCode || record.backendId);
        const mergedRecords = mergeCourierRecords(apiRecords, cachedRecords);
        recordsRef.current = mergedRecords;
        setRecords(mergedRecords);
        persistCourierRecords(mergedRecords);
        setPersistenceMode('api');
        return;
      }

      recordsRef.current = cachedRecords;
      setRecords(cachedRecords);
      setPersistenceMode('local');
    };

    loadCourierRecords();
    window.addEventListener(COURIER_UPDATE_EVENT, syncRecordsFromStorage);

    return () => {
      cancelled = true;
      window.removeEventListener(COURIER_UPDATE_EVENT, syncRecordsFromStorage);
    };
  }, []);

  useEffect(() => {
    return () => {
      syncTimersRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
      syncTimersRef.current.clear();
    };
  }, []);

  useEffect(
    () => () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    },
    [imagePreviewUrl]
  );

  const filteredIpos = useMemo(
    () => ipos.filter((ipo) => normalizeOrderType(ipo.orderType) === slipForm.ipoType),
    [ipos, slipForm.ipoType]
  );

  const selectedIpo = useMemo(
    () => filteredIpos.find((ipo) => ipo.ipoCode === slipForm.ipoCode) || null,
    [filteredIpos, slipForm.ipoCode]
  );

  const masterFilteredIpos = useMemo(
    () => (masterFilterType ? ipos.filter((ipo) => normalizeOrderType(ipo.orderType) === masterFilterType) : []),
    [ipos, masterFilterType]
  );

  const visibleRecords = useMemo(() => {
    if (!masterFilterType || !masterFilterIpo) return [];
    return records
      .filter((record) => record.ipoType === masterFilterType && record.ipoCode === masterFilterIpo)
      .sort((left, right) => {
        const leftKey = left.dispatchDate || left.createdAt || '';
        const rightKey = right.dispatchDate || right.createdAt || '';
        return rightKey.localeCompare(leftKey);
      });
  }, [masterFilterType, masterFilterIpo, records]);

  const storageLabel = STORAGE_MODE_LABELS[persistenceMode] || STORAGE_MODE_LABELS.local;

  const resetImageSelection = () => {
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setSelectedImageFile(null);
    setImagePreviewUrl('');
    setImageInputKey((current) => current + 1);
  };

  const resetSlipForm = ({ keepSelection = false } = {}) => {
    setSlipForm((current) => ({
      ...INITIAL_SLIP_STATE,
      ipoType: keepSelection ? current.ipoType : '',
      ipoCode: keepSelection ? current.ipoCode : '',
    }));
    resetImageSelection();
  };

  const handleSlipFieldChange = (field, value) => {
    setSlipMessage({ type: '', text: '' });
    setSlipForm((current) => ({ ...current, [field]: value }));
  };

  const handleIpoTypeChange = (value) => {
    setSlipMessage({ type: '', text: '' });
    setSlipForm({
      ...INITIAL_SLIP_STATE,
      ipoType: value,
    });
    resetImageSelection();
  };

  const handleImageChange = (event) => {
    const nextFile = event.target.files?.[0];
    if (!nextFile) return;

    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }

    setSelectedImageFile(nextFile);
    setImagePreviewUrl(URL.createObjectURL(nextFile));
    setSlipMessage({ type: '', text: '' });
  };

  const handleSaveSlip = async () => {
    const requiresOtherText = slipForm.sampleAs === 'OTHER_TEXT';

    if (!slipForm.ipoType || !slipForm.ipoCode || !slipForm.sampleAs) {
      setSlipMessage({
        type: 'error',
        text: 'Select IPO Type, IPO, and Sample As before saving the courier slip.',
      });
      return;
    }

    if (requiresOtherText && !slipForm.sampleAsOtherText.trim()) {
      setSlipMessage({
        type: 'error',
        text: 'Enter the custom Sample As value for the selected OTHER TEXT option.',
      });
      return;
    }

    if (slipForm.boxesPackets && !/^\d+$/.test(slipForm.boxesPackets)) {
      setSlipMessage({
        type: 'error',
        text: 'Boxes/Packets accepts numbers only.',
      });
      return;
    }

    setIsSavingSlip(true);
    setSlipMessage({ type: '', text: '' });

    try {
      let uploadedImageUrl = '';
      if (selectedImageFile) {
        try {
          uploadedImageUrl = (await uploadToBlob(selectedImageFile, 'courier')) || '';
        } catch (error) {
          console.warn('Courier image upload failed, saving slip without hosted image URL:', error);
        }
      }

      const nextRecord = {
        id: buildRecordId(),
        ipoType: slipForm.ipoType,
        ipoCode: slipForm.ipoCode,
        programName: selectedIpo?.programName || '',
        buyerCode: selectedIpo?.buyerCode || '',
        companyType: selectedIpo?.type || '',
        sampleAs: slipForm.sampleAs,
        sampleAsOtherText: requiresOtherText ? slipForm.sampleAsOtherText.trim() : '',
        boxesPackets: slipForm.boxesPackets,
        attachImageRefUrl: uploadedImageUrl,
        attachImageRefName: selectedImageFile?.name || '',
        droppedBy: slipForm.droppedBy.trim(),
        handedBy: slipForm.handedBy.trim(),
        dispatchDate: toLocalDateValue(),
        courierReceipt: '',
        awbNumber: '',
        edd: '',
        status: '',
        handoverTo: '',
        contact: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const nextRecords = [nextRecord, ...records];
      setRecords(nextRecords);
      persistCourierRecords(nextRecords);
      resetSlipForm({ keepSelection: true });
      setSlipMessage({
        type: 'success',
        text: `Courier slip saved for ${nextRecord.ipoCode}. It is now available in Master Courier Sheet.`,
      });
    } catch (error) {
      console.error('Unable to save courier slip:', error);
      setSlipMessage({
        type: 'error',
        text: 'Courier slip could not be saved. Try again.',
      });
    } finally {
      setIsSavingSlip(false);
    }
  };

  const handleMasterFieldChange = (recordId, field, value) => {
    setRecords((current) => {
      const nextRecords = current.map((record) =>
        record.id === recordId
          ? { ...record, [field]: value, updatedAt: new Date().toISOString() }
          : record
      );

      persistCourierRecords(nextRecords);
      return nextRecords;
    });
  };

  const handleMasterFilterTypeChange = (value) => {
    setMasterFilterType(value);
    setMasterFilterIpo('');
  };

  const escapeHtml = (str) => {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  };

  const handlePrintReceipt = (record) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups for this site to print the receipt.');
      return;
    }
    const sampleLabel = escapeHtml(getSampleAsLabel(record));
    const ci = companyInfo || {};
    const companyName = escapeHtml(ci.name || 'Company Name');
    const companyGstin = escapeHtml(ci.gstin);
    const companyAddress = escapeHtml(ci.address);
    const companyPhone = escapeHtml(ci.phone);
    const html = `<!DOCTYPE html>
<html>
<head>
<title>Courier Receipt - ${escapeHtml(record.ipoCode || 'N/A')}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:Arial,Helvetica,sans-serif;padding:20px;print-color-adjust:exact;-webkit-print-color-adjust:exact}
table{width:100%;border-collapse:collapse;border:2px solid #000}
td{border:1px solid #000;padding:8px 10px;font-size:14px}
.lbl{font-weight:700;text-align:right;white-space:nowrap}
.sig-lbl{font-weight:700;text-align:center;white-space:nowrap}
.sig-val{min-width:60px}
@media print{
  body{padding:0}
  @page{size:portrait;margin:10mm 12mm}
  td{border:1px solid #000 !important}
  table{border:2px solid #000 !important}
}
</style>
</head>
<body>
<table>
<tr>
  <td colspan="6" style="padding:8px 10px">
    <div style="display:flex;justify-content:space-between;font-weight:700;font-size:13px">
      <span>${companyGstin ? 'GSTIN: ' + companyGstin : '&nbsp;'}</span>
      <span>${companyPhone ? 'MOBILE: ' + companyPhone : '&nbsp;'}</span>
    </div>
  </td>
</tr>
<tr>
  <td colspan="6" style="text-align:center;padding:8px 10px">
    <div style="font-size:24px;font-weight:700">${companyName}</div>
    ${companyAddress ? '<div style="font-size:13px;margin-top:2px">' + companyAddress + '</div>' : ''}
  </td>
</tr>
<tr><td colspan="2" class="lbl">COURIER RECEIPT NO.:</td><td colspan="4">${escapeHtml(record.courierReceipt)}</td></tr>
<tr><td colspan="2" class="lbl">IPO TYPE:</td><td colspan="4">${escapeHtml(record.ipoType)}</td></tr>
<tr><td colspan="2" class="lbl">IPO NO.:</td><td colspan="4">${escapeHtml(record.ipoCode)}</td></tr>
<tr><td colspan="2" class="lbl">COURIERTYPE:</td><td colspan="4">${sampleLabel}</td></tr>
<tr><td colspan="2" class="lbl">BOXES/PACKETS:</td><td colspan="4">${escapeHtml(record.boxesPackets)}</td></tr>
<tr>
  <td class="lbl">DROPPED BY:</td>
  <td class="sig-val">${escapeHtml(record.droppedBy)}</td>
  <td class="sig-lbl">SIGN:</td>
  <td class="sig-val"></td>
  <td class="sig-lbl">DATE:</td>
  <td class="sig-val">${escapeHtml(record.dispatchDate)}</td>
</tr>
<tr>
  <td class="lbl">HANDOVER TO:</td>
  <td class="sig-val">${escapeHtml(record.handoverTo)}</td>
  <td class="sig-lbl">SIGN:</td>
  <td class="sig-val"></td>
  <td class="sig-lbl">DATE:</td>
  <td class="sig-val"></td>
</tr>
<tr><td colspan="2" class="lbl">CONTACT:</td><td colspan="4">${escapeHtml(record.contact)}</td></tr>
<tr><td colspan="2" class="lbl">STAMP:</td><td colspan="4" style="height:50px">&nbsp;</td></tr>
</table>
<script>window.onload=function(){window.print()}</script>
</body>
</html>`;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  if (isSlipMode) {
    const sampleOptions = getSampleAsOptions(slipForm.ipoType);
    const savedSlipsForCurrentType = records.filter((record) =>
      slipForm.ipoType ? record.ipoType === slipForm.ipoType : true
    );

    return (
      <FullscreenContent className="courier-page">
        <div className="content-header">
          <h1 className="fullscreen-title">Courier Slip</h1>
          <p className="fullscreen-description">
            Create courier slips from saved IPOs. Each saved slip feeds the Master Courier Sheet automatically.
          </p>
        </div>

        <div className="courier-layout">
          <FormCard className="courier-card courier-form-card">
            <div className="courier-card-header">
              <div>
                <h2 className="courier-card-title">Courier Slip Details</h2>
                <p className="courier-card-description">
                  Select an IPO type, choose an IPO from IPO Management, and capture the courier handover details.
                </p>
              </div>
              <div className="courier-stat-pill">
                Saved Slips: <strong>{savedSlipsForCurrentType.length}</strong>
              </div>
            </div>

            <FormRow className="courier-form-grid">
              <Field label="Show IPO Type" required width="md">
                <select
                  className="courier-select"
                  value={slipForm.ipoType}
                  onChange={(event) => handleIpoTypeChange(event.target.value)}
                >
                  <option value="">Select IPO Type</option>
                  {IPO_TYPE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                label="IPO"
                required
                width="lg"
                helper={
                  slipForm.ipoType && filteredIpos.length === 0
                    ? 'No IPOs are available for this IPO Type yet.'
                    : 'Saved IPOs from IPO Management are listed here.'
                }
              >
                <select
                  className="courier-select"
                  value={slipForm.ipoCode}
                  disabled={!slipForm.ipoType || filteredIpos.length === 0}
                  onChange={(event) => handleSlipFieldChange('ipoCode', event.target.value)}
                >
                  <option value="">
                    {!slipForm.ipoType
                      ? 'Select IPO Type first'
                      : filteredIpos.length === 0
                        ? 'No IPOs available'
                        : 'Select IPO'}
                  </option>
                  {filteredIpos.map((ipo) => (
                    <option key={ipo.ipoCode} value={ipo.ipoCode}>
                      {ipo.ipoCode}
                      {ipo.programName ? ` - ${ipo.programName}` : ''}
                    </option>
                  ))}
                </select>
              </Field>

              {selectedIpo && (
                <div className="courier-meta-strip courier-field-span">
                  <span className="courier-meta-chip">IPO: {selectedIpo.ipoCode}</span>
                  {selectedIpo.programName && (
                    <span className="courier-meta-chip">Program: {selectedIpo.programName}</span>
                  )}
                  {selectedIpo.buyerCode && (
                    <span className="courier-meta-chip">Buyer Code: {selectedIpo.buyerCode}</span>
                  )}
                  {selectedIpo.type && (
                    <span className="courier-meta-chip">Company Type: {selectedIpo.type}</span>
                  )}
                </div>
              )}

              <Field label="Sample As" required width="md">
                <select
                  className="courier-select"
                  value={slipForm.sampleAs}
                  disabled={!slipForm.ipoType}
                  onChange={(event) => handleSlipFieldChange('sampleAs', event.target.value)}
                >
                  <option value="">
                    {!slipForm.ipoType ? 'Select IPO Type first' : 'Select Sample As'}
                  </option>
                  {sampleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Field>

              {slipForm.sampleAs === 'OTHER_TEXT' && (
                <Field label="Other Sample As" required width="md">
                  <Input
                    value={slipForm.sampleAsOtherText}
                    onChange={(event) => handleSlipFieldChange('sampleAsOtherText', event.target.value)}
                    placeholder="Enter custom sample type"
                  />
                </Field>
              )}

              <Field label="Boxes/Packets" width="md">
                <Input
                  inputMode="numeric"
                  value={slipForm.boxesPackets}
                  onChange={(event) =>
                    handleSlipFieldChange('boxesPackets', event.target.value.replace(/\D/g, ''))
                  }
                  placeholder="Enter quantity"
                />
              </Field>

              <Field label="Dropped By" width="md">
                <Input
                  value={slipForm.droppedBy}
                  onChange={(event) => handleSlipFieldChange('droppedBy', event.target.value)}
                  placeholder="Enter dropped by"
                />
              </Field>

              <Field label="Handed By" width="md">
                <Input
                  value={slipForm.handedBy}
                  onChange={(event) => handleSlipFieldChange('handedBy', event.target.value)}
                  placeholder="Enter handed by"
                />
              </Field>

              <Field label="Attach Image Ref" width="lg">
                <div className="courier-upload">
                  <input
                    key={imageInputKey}
                    id="courier-image-upload"
                    type="file"
                    accept="image/*"
                    className="courier-hidden-input"
                    onChange={handleImageChange}
                  />
                  <label htmlFor="courier-image-upload" className="courier-upload-trigger">
                    Upload Image Ref
                  </label>
                  {(selectedImageFile || imagePreviewUrl) && (
                    <div className="courier-upload-preview">
                      {imagePreviewUrl ? (
                        <img src={imagePreviewUrl} alt="Courier reference preview" />
                      ) : (
                        <span className="courier-upload-fallback">No preview</span>
                      )}
                    </div>
                  )}
                  {selectedImageFile && (
                    <div className="courier-upload-meta">
                      <span className="courier-upload-name">{selectedImageFile.name}</span>
                      <button type="button" className="courier-clear-button" onClick={resetImageSelection}>
                        Clear
                      </button>
                    </div>
                  )}
                </div>
              </Field>
            </FormRow>

            {slipMessage.text && (
              <div className={`courier-message ${slipMessage.type === 'error' ? 'error' : 'success'}`}>
                {slipMessage.text}
              </div>
            )}

            <div className="courier-actions">
              <button type="button" className="courier-button secondary" onClick={() => resetSlipForm()}>
                Reset
              </button>
              <button
                type="button"
                className="courier-button"
                onClick={handleSaveSlip}
                disabled={isSavingSlip}
              >
                {isSavingSlip ? 'Saving...' : 'Save Courier Slip'}
              </button>
            </div>
          </FormCard>
        </div>
      </FullscreenContent>
    );
  }

  return (
    <FullscreenContent className="courier-page">
      <div className="content-header">
        <h1 className="fullscreen-title">Master Courier Sheet</h1>
        <p className="fullscreen-description">
          Select IPO Type and IPO to view and print courier receipts.
        </p>
      </div>

      <div className="courier-layout">
        <FormCard className="courier-card courier-filter-card">
          <div className="courier-card-header">
            <div>
              <h2 className="courier-card-title">Filter</h2>
              <p className="courier-card-description">
                Select IPO Type and IPO to view the courier receipt form.
              </p>
            </div>
            <div className="courier-stat-pill">
              Records: <strong>{visibleRecords.length}</strong>
            </div>
          </div>

          <FormRow className="courier-filter-grid">
            <Field label="IPO Type" required width="md">
              <select
                className="courier-select"
                value={masterFilterType}
                onChange={(event) => handleMasterFilterTypeChange(event.target.value)}
              >
                <option value="">Select IPO Type</option>
                {IPO_TYPE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label="IPO"
              required
              width="md"
              helper={
                masterFilterType && masterFilteredIpos.length === 0
                  ? 'No IPOs available for this IPO Type.'
                  : ''
              }
            >
              <select
                className="courier-select"
                value={masterFilterIpo}
                disabled={!masterFilterType || masterFilteredIpos.length === 0}
                onChange={(event) => setMasterFilterIpo(event.target.value)}
              >
                <option value="">
                  {!masterFilterType
                    ? 'Select IPO Type first'
                    : masterFilteredIpos.length === 0
                      ? 'No IPOs available'
                      : 'Select IPO'}
                </option>
                {masterFilteredIpos.map((ipo) => (
                  <option key={ipo.ipoCode} value={ipo.ipoCode}>
                    {ipo.ipoCode}
                    {ipo.programName ? ` - ${ipo.programName}` : ''}
                  </option>
                ))}
              </select>
            </Field>
          </FormRow>
        </FormCard>

        {!masterFilterType || !masterFilterIpo ? (
          <div className="courier-card">
            <div className="courier-empty-state">
              Select both IPO Type and IPO to view courier receipts.
            </div>
          </div>
        ) : visibleRecords.length === 0 ? (
          <div className="courier-card">
            <div className="courier-empty-state">
              No courier slips found for the selected IPO Type and IPO.
            </div>
          </div>
        ) : (
          visibleRecords.map((record, index) => (
            <FormCard key={record.id} className="courier-card courier-receipt-card">
              <div className="courier-card-header">
                <h2 className="courier-card-title">
                  Courier Receipt{visibleRecords.length > 1 ? ` #${index + 1}` : ''}
                </h2>
                <button
                  type="button"
                  className="courier-button courier-print-btn"
                  onClick={() => handlePrintReceipt(record)}
                >
                  Print
                </button>
              </div>

              <FormRow className="courier-form-grid">
                <Field label="Courier Receipt No." width="md">
                  <Input
                    value={record.courierReceipt || ''}
                    onChange={(event) =>
                      handleMasterFieldChange(record.id, 'courierReceipt', event.target.value)
                    }
                    placeholder="Enter courier receipt no."
                  />
                </Field>

                <Field label="IPO Type" width="md">
                  <Input value={record.ipoType || ''} readOnly />
                </Field>

                <Field label="IPO No." width="md">
                  <Input value={record.ipoCode || ''} readOnly />
                </Field>

                <Field label="Courier Type (Sample As)" width="md">
                  <Input value={getSampleAsLabel(record)} readOnly />
                </Field>

                <Field label="Boxes / Packets" width="md">
                  <Input value={record.boxesPackets || '-'} readOnly />
                </Field>

                <Field label="Dispatch Date" width="md">
                  <Input
                    type="date"
                    value={record.dispatchDate || toLocalDateValue(record.createdAt)}
                    onChange={(event) =>
                      handleMasterFieldChange(record.id, 'dispatchDate', event.target.value)
                    }
                  />
                </Field>

                <Field label="Dropped By" width="md">
                  <Input value={record.droppedBy || '-'} readOnly />
                </Field>

                <Field label="Handover To" width="md">
                  <Input
                    value={record.handoverTo || ''}
                    onChange={(event) =>
                      handleMasterFieldChange(record.id, 'handoverTo', event.target.value)
                    }
                    placeholder="Enter handover to"
                  />
                </Field>

                <Field label="Contact" width="md">
                  <Input
                    value={record.contact || ''}
                    onChange={(event) =>
                      handleMasterFieldChange(record.id, 'contact', event.target.value)
                    }
                    placeholder="Enter contact"
                  />
                </Field>

                <Field label="AWB #" width="md">
                  <Input
                    value={record.awbNumber || ''}
                    onChange={(event) =>
                      handleMasterFieldChange(record.id, 'awbNumber', event.target.value)
                    }
                    placeholder="Enter AWB number"
                  />
                </Field>

                <Field label="EDD" width="md">
                  <Input
                    type="date"
                    value={record.edd || ''}
                    onChange={(event) => handleMasterFieldChange(record.id, 'edd', event.target.value)}
                  />
                </Field>

                <Field label="Status" width="md">
                  <Input
                    value={record.status || ''}
                    onChange={(event) =>
                      handleMasterFieldChange(record.id, 'status', event.target.value)
                    }
                    placeholder="Enter status"
                  />
                </Field>

                {record.attachImageRefUrl && (
                  <Field label="Image Ref" width="md">
                    <a
                      href={record.attachImageRefUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="courier-link"
                    >
                      {record.attachImageRefName || 'View Ref'}
                    </a>
                  </Field>
                )}
              </FormRow>
            </FormCard>
          ))
        )}
      </div>
    </FullscreenContent>
  );
};

export default CourierManagement;

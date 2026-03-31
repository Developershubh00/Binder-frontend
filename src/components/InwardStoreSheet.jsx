import { useEffect, useState } from 'react';
import {
  getIPOs,
  getInwardStoreSheetChoices,
  createInwardStoreSheet,
  generateInwardStoreSheetCodes,
} from '../services/integration';
import './InwardStoreSheet.css';

const EMPTY_ROW = {
  particulars: '',
  po_quantity: '',
  received_quantity: '',
  rate: '',
  remarks: '',
  received_form: '',
  num_packages: '',
  uqr_sent: false,
  raw_material_type: '',
  raw_material: '',
  length: '',
};

const InwardStoreSheet = ({ onBack }) => {
  // Form state
  const [receivableType, setReceivableType] = useState('');
  const [ipoType, setIpoType] = useState('');
  const [selectedIpo, setSelectedIpo] = useState('');
  const [selectedVpo, setSelectedVpo] = useState('');
  const [selectedIpc, setSelectedIpc] = useState('');

  const [goodsReceivingCondition, setGoodsReceivingCondition] = useState('');
  const [goodsConditionImage, setGoodsConditionImage] = useState(null);
  const [vehicleNumberImage, setVehicleNumberImage] = useState(null);
  const [vehiclePic, setVehiclePic] = useState(null);
  const [vendorChallanNo, setVendorChallanNo] = useState('');
  const [vendorChallanImage, setVendorChallanImage] = useState(null);
  const [vendorInvoiceNo, setVendorInvoiceNo] = useState('');
  const [vendorInvoiceImage, setVendorInvoiceImage] = useState(null);

  // Table rows
  const [rows, setRows] = useState([{ ...EMPTY_ROW }]);

  // Dropdown data
  const [ipoList, setIpoList] = useState([]);
  const [vpoList, setVpoList] = useState([]);
  const [ipcList, setIpcList] = useState([]);

  // UI state
  const [saving, setSaving] = useState(false);
  const [generatingCodes, setGeneratingCodes] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [createdSheet, setCreatedSheet] = useState(null);

  const isChallanOnly = receivableType === 'CHALLAN_ONLY';

  // Map IPO type to the order_type filter used in the API
  const ipoTypeToOrderType = { COMPANY: 'SELF', PRODUCTION: 'PD', SAMPLING: 'SAM' };

  // Load IPOs when ipoType changes
  useEffect(() => {
    if (!ipoType) { setIpoList([]); return; }
    const orderType = ipoTypeToOrderType[ipoType];
    getIPOs({ order_type: orderType })
      .then((data) => {
        const results = data?.results || data || [];
        const normalizedResults = Array.isArray(results) ? results : [];
        setIpoList(normalizedResults.filter((ipo) => ipo.order_type === orderType));
      })
      .catch(() => setIpoList([]));
  }, [ipoType]);

  // Load VPOs (purchase orders) – we load all and let user pick
  useEffect(() => {
    // Purchase orders are available at the PO endpoint
    const loadVPOs = async () => {
      try {
        const resp = await fetch(
          `${import.meta.env.VITE_API_URL || 'https://binder-backend-0szj.onrender.com/api/'}ims/purchase-orders/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
              'Content-Type': 'application/json',
            },
          }
        );
        const data = await resp.json();
        const results = data?.results || data || [];
        setVpoList(Array.isArray(results) ? results : []);
      } catch {
        setVpoList([]);
      }
    };
    loadVPOs();
  }, []);

  // Load IPCs (factory codes) when IPO is selected
  useEffect(() => {
    if (!selectedIpo) { setIpcList([]); return; }
    const loadIPCs = async () => {
      try {
        const resp = await fetch(
          `${import.meta.env.VITE_API_URL || 'https://binder-backend-0szj.onrender.com/api/'}ims/factory-codes/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
              'Content-Type': 'application/json',
            },
          }
        );
        const data = await resp.json();
        const results = data?.results || data || [];
        setIpcList(Array.isArray(results) ? results : []);
      } catch {
        setIpcList([]);
      }
    };
    loadIPCs();
  }, [selectedIpo]);

  // Row helpers
  const addRow = () => {
    setRows((prev) => [...prev, { ...EMPTY_ROW }]);
  };

  const removeRow = (idx) => {
    setRows((prev) => prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev);
  };

  const updateRow = (idx, field, value) => {
    setRows((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const computeBalance = (row) => {
    const poQ = parseFloat(row.po_quantity) || 0;
    const recQ = parseFloat(row.received_quantity) || 0;
    return (poQ - recQ).toFixed(2);
  };

  const computeAmount = (row) => {
    const recQ = parseFloat(row.received_quantity) || 0;
    const rate = parseFloat(row.rate) || 0;
    return (recQ * rate).toFixed(2);
  };

  // Save handler
  const handleSave = async () => {
    if (!receivableType || !ipoType) {
      setErrorMsg('Please select Receivable Type and IPO Type.');
      return;
    }
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const payload = {
        receivable_type: receivableType,
        ipo_type: ipoType,
        ipo: selectedIpo || null,
        vpo: selectedVpo || null,
        ipc: selectedIpc || null,
        goods_receiving_condition: goodsReceivingCondition,
        vendor_challan_no: vendorChallanNo,
        vendor_invoice_no: isChallanOnly ? '' : vendorInvoiceNo,
        items: rows.map((row, idx) => ({
          sr_no: idx + 1,
          particulars: row.particulars,
          po_quantity: parseFloat(row.po_quantity) || 0,
          received_quantity: parseFloat(row.received_quantity) || 0,
          rate: isChallanOnly ? 0 : (parseFloat(row.rate) || 0),
          remarks: row.remarks,
          received_form: row.received_form,
          num_packages: parseInt(row.num_packages) || 0,
          uqr_sent: row.uqr_sent,
          raw_material_type: row.raw_material_type,
          raw_material: row.raw_material,
          length: row.length,
        })),
      };

      const result = await createInwardStoreSheet(payload);
      if (result?.status === 'success') {
        setSuccessMsg('Inward Store Sheet saved successfully!');
        setCreatedSheet(result.data);
      } else {
        setErrorMsg(result?.message || JSON.stringify(result) || 'Failed to save.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  // Generate UIN/USN codes
  const handleGenerateCodes = async () => {
    if (!createdSheet?.id) {
      setErrorMsg('Please save the form first before generating codes.');
      return;
    }
    setGeneratingCodes(true);
    setErrorMsg('');

    try {
      const result = await generateInwardStoreSheetCodes(createdSheet.id);
      if (result?.status === 'success') {
        setCreatedSheet(result.data);
        setSuccessMsg('UIN and USN codes generated successfully!');
      } else {
        setErrorMsg(result?.message || 'Failed to generate codes.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'An error occurred while generating codes.');
    } finally {
      setGeneratingCodes(false);
    }
  };

  return (
    <div className="iss-container">
      <div className="iss-header">
        <button className="iss-back-button" onClick={onBack}>
          ← Back
        </button>
        <h1 className="iss-title">Inward Store Sheet</h1>
        <p className="iss-description">
          Record incoming inventory with receiving details and generate UIN/USN codes
        </p>
      </div>

      {successMsg && <div className="iss-success">{successMsg}</div>}
      {errorMsg && <div className="iss-error">{errorMsg}</div>}

      {/* Generated codes display */}
      {createdSheet?.uin_code && (
        <div className="iss-codes">
          <div className="iss-code-item">
            <span className="iss-code-label">UIN:</span>
            <span className="iss-code-value">{createdSheet.uin_code}</span>
          </div>
          {createdSheet.items?.map((item) => (
            item.usn_code && (
              <div className="iss-code-item" key={item.id}>
                <span className="iss-code-label">USN #{item.sr_no}:</span>
                <span className="iss-code-value">{item.usn_code}</span>
              </div>
            )
          ))}
        </div>
      )}

      <div className="iss-form">
        {/* Top dropdowns */}
        <div className="iss-form-grid">
          <div className="iss-form-group">
            <label className="iss-form-label">
              Receivable Type <span className="iss-required">*</span>
            </label>
            <select
              className="iss-form-select"
              value={receivableType}
              onChange={(e) => setReceivableType(e.target.value)}
            >
              <option value="">-- Select --</option>
              <option value="CHALLAN_ONLY">Challan Only</option>
              <option value="CHALLAN_CUM_INVOICE">Challan Cum Invoice</option>
            </select>
          </div>

          <div className="iss-form-group">
            <label className="iss-form-label">
              Select IPO Type <span className="iss-required">*</span>
            </label>
            <select
              className="iss-form-select"
              value={ipoType}
              onChange={(e) => { setIpoType(e.target.value); setSelectedIpo(''); }}
            >
              <option value="">-- Select --</option>
              <option value="COMPANY">Company</option>
              <option value="PRODUCTION">Production</option>
              <option value="SAMPLING">Sampling</option>
            </select>
          </div>

          <div className="iss-form-group">
            <label className="iss-form-label">Select IPO</label>
            <select
              className="iss-form-select"
              value={selectedIpo}
              onChange={(e) => setSelectedIpo(e.target.value)}
              disabled={!ipoType}
            >
              <option value="">-- Select IPO --</option>
              {ipoList.map((ipo) => (
                <option key={ipo.id} value={ipo.id}>
                  {ipo.ipo_code} — {ipo.program_name}
                </option>
              ))}
            </select>
          </div>

          <div className="iss-form-group">
            <label className="iss-form-label">Select VPO</label>
            <select
              className="iss-form-select"
              value={selectedVpo}
              onChange={(e) => setSelectedVpo(e.target.value)}
            >
              <option value="">-- Select VPO --</option>
              {vpoList.map((po) => (
                <option key={po.id} value={po.id}>
                  {po.po_code} {po.buyer_name ? `— ${po.buyer_name}` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="iss-form-group">
            <label className="iss-form-label">IPC (Factory Code)</label>
            <select
              className="iss-form-select"
              value={selectedIpc}
              onChange={(e) => setSelectedIpc(e.target.value)}
              disabled={!selectedIpo}
            >
              <option value="">-- Select IPC --</option>
              {ipcList.map((fc) => (
                <option key={fc.id} value={fc.id}>
                  {fc.code || fc.id}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Receiving details */}
        <h3 className="iss-section-title">Receiving Details</h3>
        <div className="iss-form-grid">
          <div className="iss-form-group full-width">
            <label className="iss-form-label">Goods Receiving Condition</label>
            <div className="iss-input-with-image">
              <textarea
                className="iss-form-textarea"
                value={goodsReceivingCondition}
                onChange={(e) => setGoodsReceivingCondition(e.target.value)}
                placeholder="Describe goods receiving condition..."
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setGoodsConditionImage(e.target.files[0])}
              />
            </div>
            {goodsConditionImage && (
              <span className="iss-file-name">{goodsConditionImage.name}</span>
            )}
          </div>

          <div className="iss-form-group">
            <label className="iss-form-label">Vehicle Number</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setVehicleNumberImage(e.target.files[0])}
            />
            {vehicleNumberImage && (
              <span className="iss-file-name">{vehicleNumberImage.name}</span>
            )}
          </div>

          <div className="iss-form-group">
            <label className="iss-form-label">Vehicle Pic</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setVehiclePic(e.target.files[0])}
            />
            {vehiclePic && (
              <span className="iss-file-name">{vehiclePic.name}</span>
            )}
          </div>

          <div className="iss-form-group">
            <label className="iss-form-label">Vendor Challan No.</label>
            <div className="iss-input-with-image">
              <input
                className="iss-form-input"
                type="text"
                value={vendorChallanNo}
                onChange={(e) => setVendorChallanNo(e.target.value)}
                placeholder="Enter challan number"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setVendorChallanImage(e.target.files[0])}
              />
            </div>
            {vendorChallanImage && (
              <span className="iss-file-name">{vendorChallanImage.name}</span>
            )}
          </div>

          {!isChallanOnly && (
            <div className="iss-form-group">
              <label className="iss-form-label">Vendor Invoice No.</label>
              <div className="iss-input-with-image">
                <input
                  className="iss-form-input"
                  type="text"
                  value={vendorInvoiceNo}
                  onChange={(e) => setVendorInvoiceNo(e.target.value)}
                  placeholder="Enter invoice number"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setVendorInvoiceImage(e.target.files[0])}
                />
              </div>
              {vendorInvoiceImage && (
                <span className="iss-file-name">{vendorInvoiceImage.name}</span>
              )}
            </div>
          )}
        </div>

        {/* Items Table */}
        <h3 className="iss-section-title">Items</h3>
        <div className="iss-table-wrapper">
          <table className="iss-table">
            {isChallanOnly ? (
              <colgroup>
                <col style={{ width: '4%' }} />   {/* Sr No */}
                <col style={{ width: '16%' }} />  {/* Particulars */}
                <col style={{ width: '10%' }} />  {/* PO Qty */}
                <col style={{ width: '10%' }} />  {/* Received Qty */}
                <col style={{ width: '8%' }} />   {/* Balance */}
                <col style={{ width: '14%' }} />  {/* Remarks */}
                <col style={{ width: '12%' }} />  {/* Received Form */}
                <col style={{ width: '8%' }} />   {/* # Package */}
                <col style={{ width: '14%' }} />  {/* UQR */}
                <col style={{ width: '4%' }} />   {/* Remove */}
              </colgroup>
            ) : (
              <colgroup>
                <col style={{ width: '3%' }} />   {/* Sr No */}
                <col style={{ width: '13%' }} />  {/* Particulars */}
                <col style={{ width: '8%' }} />   {/* PO Qty */}
                <col style={{ width: '8%' }} />   {/* Received Qty */}
                <col style={{ width: '6%' }} />   {/* Balance */}
                <col style={{ width: '8%' }} />   {/* Rate */}
                <col style={{ width: '8%' }} />   {/* Amount */}
                <col style={{ width: '12%' }} />  {/* Remarks */}
                <col style={{ width: '10%' }} />  {/* Received Form */}
                <col style={{ width: '6%' }} />   {/* # Package */}
                <col style={{ width: '14%' }} />  {/* UQR */}
                <col style={{ width: '4%' }} />   {/* Remove */}
              </colgroup>
            )}
            <thead>
              <tr>
                <th>Sr</th>
                <th>Particulars</th>
                <th>PO Qty</th>
                <th>Received Qty</th>
                <th>Bal</th>
                {!isChallanOnly && <th>Rate (₹)</th>}
                {!isChallanOnly && <th>Amount (₹)</th>}
                <th>Remarks</th>
                <th>Received Form</th>
                <th># of Package</th>
                <th>UQR</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx}>
                  <td style={{ textAlign: 'center', fontWeight: 600 }}>{idx + 1}</td>
                  <td>
                    <input
                      type="text"
                      value={row.particulars}
                      onChange={(e) => updateRow(idx, 'particulars', e.target.value)}
                      placeholder="Item name"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={row.po_quantity}
                      onChange={(e) => updateRow(idx, 'po_quantity', e.target.value)}
                      min="0"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={row.received_quantity}
                      onChange={(e) => updateRow(idx, 'received_quantity', e.target.value)}
                      min="0"
                    />
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 500 }}>
                    {computeBalance(row)}
                  </td>
                  {!isChallanOnly && (
                    <td>
                      <div className="iss-rupee">
                        <span className="iss-rupee-symbol">₹</span>
                        <input
                          type="number"
                          value={row.rate}
                          onChange={(e) => updateRow(idx, 'rate', e.target.value)}
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </td>
                  )}
                  {!isChallanOnly && (
                    <td>
                      <div className="iss-rupee">
                        <span className="iss-rupee-symbol">₹</span>
                        <span style={{ fontWeight: 500 }}>{computeAmount(row)}</span>
                      </div>
                    </td>
                  )}
                  <td>
                    <input
                      type="text"
                      value={row.remarks}
                      onChange={(e) => updateRow(idx, 'remarks', e.target.value)}
                      placeholder="Remarks"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.received_form}
                      onChange={(e) => updateRow(idx, 'received_form', e.target.value)}
                      placeholder="Form"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={row.num_packages}
                      onChange={(e) => updateRow(idx, 'num_packages', e.target.value)}
                      min="0"
                    />
                  </td>
                  <td>
                    <div className="iss-uqr-cell" title="SENT TO QUALITY VERIFICATION">
                      <input
                        type="checkbox"
                        checked={row.uqr_sent}
                        onChange={(e) => updateRow(idx, 'uqr_sent', e.target.checked)}
                      />
                      <span className="iss-uqr-text">SENT TO QUALITY VERIFICATION</span>
                    </div>
                  </td>
                  <td>
                    <button
                      className="iss-remove-row"
                      onClick={() => removeRow(idx)}
                      title="Remove row"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button className="iss-add-row-btn" onClick={addRow}>
          + Add Row
        </button>

        {/* Action buttons */}
        <div className="iss-actions">
          <button
            className="iss-btn iss-btn-secondary"
            onClick={handleGenerateCodes}
            disabled={generatingCodes || !createdSheet}
          >
            {generatingCodes ? 'Generating...' : 'Generate UIN and USN Codes'}
          </button>
          <button
            className="iss-btn iss-btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InwardStoreSheet;

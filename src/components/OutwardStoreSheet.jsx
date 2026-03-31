import { useEffect, useState } from 'react';
import {
  createOutwardStoreSheet,
  getCompanyEssentials,
  getIPOs,
  getOutwardStoreSheetChoices,
} from '../services/integration';
import './InwardStoreSheet.css';

const createId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const createEmptyUsnLink = () => ({
  id: createId(),
  link_usn: '',
  usn_quantity: '',
});

const createEmptyRow = () => ({
  id: createId(),
  particulars: '',
  dispatch_quantity: '',
  unit: 'CM',
  usn_links: [createEmptyUsnLink()],
  remark: '',
  dispatch_form: '',
  num_packages: '',
  uqr_sent: false,
});

const IPO_TYPE_TO_ORDER_TYPE = {
  PRODUCTION: 'PD',
  SAMPLING: 'SAM',
  COMPANY: 'SELF',
};

const toNumber = (value) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatQuantity = (value) => {
  const numeric = Number.isFinite(value) ? value : toNumber(value);
  return numeric.toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
};

const getCarryCode = (index) => {
  let current = index + 1;
  let letters = '';

  while (current > 0) {
    const remainder = (current - 1) % 26;
    letters = `${String.fromCharCode(65 + remainder)}${letters}`;
    current = Math.floor((current - 1) / 26);
  }

  return `-${letters}`;
};

const normalizeCarryCode = (value) => String(value || '').toUpperCase().replace(/\s+/g, '');

const getUsnQuantitySum = (row) => row.usn_links.reduce((sum, link) => sum + toNumber(link.usn_quantity), 0);

const getBalance = (row) => toNumber(row.dispatch_quantity) - getUsnQuantitySum(row);

const ensureNegativeBalanceLinkRow = (row) => {
  if (getBalance(row) < 0 && row.usn_links.length === 1) {
    return {
      ...row,
      usn_links: [...row.usn_links, createEmptyUsnLink()],
    };
  }
  return row;
};

const OutwardStoreSheet = ({ onBack }) => {
  const [dispatchType, setDispatchType] = useState('');
  const [unitNumber, setUnitNumber] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedVendor, setSelectedVendor] = useState('');
  const [dispatchIssuedToAddress, setDispatchIssuedToAddress] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [ipoType, setIpoType] = useState('');
  const [selectedIpo, setSelectedIpo] = useState('');
  const [selectedCompanyEssential, setSelectedCompanyEssential] = useState('');
  const [dispatchedGoodsConditionImage, setDispatchedGoodsConditionImage] = useState(null);
  const [vehicleNo, setVehicleNo] = useState('');
  const [vehicleNoImage, setVehicleNoImage] = useState(null);
  const [companyChallanNumber, setCompanyChallanNumber] = useState('');
  const [companyChallanImage, setCompanyChallanImage] = useState(null);
  const [rows, setRows] = useState([createEmptyRow()]);

  const [choices, setChoices] = useState({
    dispatch_types: [],
    ipo_types: [],
    departments: [],
    vendors: [],
    item_units: ['CM'],
  });
  const [ipoOptions, setIpoOptions] = useState([]);
  const [companyEssentialOptions, setCompanyEssentialOptions] = useState([]);
  const [loadingChoices, setLoadingChoices] = useState(true);
  const [loadingIpoOptions, setLoadingIpoOptions] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadChoices = async () => {
      setLoadingChoices(true);
      try {
        const data = await getOutwardStoreSheetChoices();
        if (!isMounted) return;
        setChoices({
          dispatch_types: data?.dispatch_types || [],
          ipo_types: data?.ipo_types || [],
          departments: data?.departments || [],
          vendors: data?.vendors || [],
          item_units: data?.item_units || ['CM'],
        });
      } catch (error) {
        if (!isMounted) return;
        setChoices({
          dispatch_types: [],
          ipo_types: [],
          departments: [],
          vendors: [],
          item_units: ['CM'],
        });
      } finally {
        if (isMounted) setLoadingChoices(false);
      }
    };

    loadChoices();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadIpoOptions = async () => {
      if (!ipoType) {
        setIpoOptions([]);
        setCompanyEssentialOptions([]);
        return;
      }

      setLoadingIpoOptions(true);
      try {
        if (ipoType === 'COMPANY_ESSENTIALS') {
          const data = await getCompanyEssentials('', {});
          if (!isMounted) return;
          const results = data?.results || data || [];
          setCompanyEssentialOptions(Array.isArray(results) ? results : []);
          setIpoOptions([]);
        } else {
          const data = await getIPOs({ order_type: IPO_TYPE_TO_ORDER_TYPE[ipoType] });
          if (!isMounted) return;
          const results = data?.results || data || [];
          const normalizedResults = Array.isArray(results) ? results : [];
          setIpoOptions(
            normalizedResults.filter((option) => option.order_type === IPO_TYPE_TO_ORDER_TYPE[ipoType])
          );
          setCompanyEssentialOptions([]);
        }
      } catch (error) {
        if (!isMounted) return;
        setIpoOptions([]);
        setCompanyEssentialOptions([]);
      } finally {
        if (isMounted) setLoadingIpoOptions(false);
      }
    };

    loadIpoOptions();

    return () => {
      isMounted = false;
    };
  }, [ipoType]);

  const activeDepartment = choices.departments.find((department) => department.id === selectedDepartment);
  const sectionOptions = activeDepartment?.sections || [];

  const getCarryReferences = (excludeRowId = null) => {
    const references = {};

    rows.forEach((row, index) => {
      if (row.id === excludeRowId) return;
      const balance = getBalance(row);
      if (balance > 0) {
        references[getCarryCode(index)] = balance;
      }
    });

    return references;
  };

  const updateRow = (rowId, updater) => {
    setRows((prev) => prev.map((row) => {
      if (row.id !== rowId) return row;
      return ensureNegativeBalanceLinkRow(updater(row));
    }));
  };

  const handleRowChange = (rowId, field, value) => {
    updateRow(rowId, (row) => ({ ...row, [field]: value }));
  };

  const handleUsnLinkChange = (rowId, linkId, field, value) => {
    const carryReferences = getCarryReferences(rowId);

    updateRow(rowId, (row) => {
      const nextLinks = row.usn_links.map((link) => {
        if (link.id !== linkId) return link;

        const nextLink = { ...link, [field]: value };
        if (field === 'link_usn') {
          const carryQuantity = carryReferences[normalizeCarryCode(value)];
          if (typeof carryQuantity === 'number' && carryQuantity > 0) {
            nextLink.usn_quantity = formatQuantity(carryQuantity);
          }
        }
        return nextLink;
      });

      return { ...row, usn_links: nextLinks };
    });
  };

  const addUsnLinkRow = (rowId) => {
    updateRow(rowId, (row) => ({
      ...row,
      usn_links: [...row.usn_links, createEmptyUsnLink()],
    }));
  };

  const removeUsnLinkRow = (rowId, linkId) => {
    updateRow(rowId, (row) => ({
      ...row,
      usn_links: row.usn_links.length > 1 ? row.usn_links.filter((link) => link.id !== linkId) : row.usn_links,
    }));
  };

  const addMainRow = () => {
    setRows((prev) => [...prev, createEmptyRow()]);
  };

  const removeMainRow = (rowId) => {
    setRows((prev) => prev.length > 1 ? prev.filter((row) => row.id !== rowId) : prev);
  };

  const handleDispatchTypeChange = (value) => {
    setDispatchType(value);
    setErrorMsg('');

    if (value === 'INTERNAL_CHALLAN') {
      setSelectedVendor('');
    }

    if (value === 'EXTERNAL_CHALLAN') {
      setUnitNumber('');
      setSelectedDepartment('');
      setSelectedSection('');
    }
  };

  const handleVendorChange = (vendorId) => {
    setSelectedVendor(vendorId);
    const vendor = choices.vendors.find((item) => item.id === vendorId);
    if (vendor) {
      setDispatchIssuedToAddress(vendor.address || '');
      setContactPerson(vendor.contact_person || '');
      setContactNumber(vendor.contact_number || '');
    } else {
      setDispatchIssuedToAddress('');
      setContactPerson('');
      setContactNumber('');
    }
  };

  const handleDepartmentChange = (departmentId) => {
    setSelectedDepartment(departmentId);
    const nextDepartment = choices.departments.find((department) => department.id === departmentId);
    if (!nextDepartment?.sections?.some((section) => section.id === selectedSection)) {
      setSelectedSection('');
    }
  };

  const handleIpoTypeChange = (value) => {
    setIpoType(value);
    setSelectedIpo('');
    setSelectedCompanyEssential('');
  };

  const validateBeforeSave = (normalizedRows) => {
    if (!dispatchType) return 'Please select Dispatch Type.';
    if (dispatchType === 'INTERNAL_CHALLAN' && (!unitNumber.trim() || !selectedDepartment || !selectedSection)) {
      return 'Please complete Unit #, Department, and Section for internal challan.';
    }
    if (dispatchType === 'EXTERNAL_CHALLAN' && !selectedVendor) {
      return 'Please select a Vendor Code for external challan.';
    }
    if (!ipoType) return 'Please select IPO Type.';
    if (ipoType === 'COMPANY_ESSENTIALS' && !selectedCompanyEssential) {
      return 'Please select a Company Essential.';
    }
    if (ipoType !== 'COMPANY_ESSENTIALS' && !selectedIpo) {
      return 'Please select an IPO.';
    }
    if (normalizedRows.length === 0) return 'Please add at least one outward row.';

    const incompleteRow = normalizedRows.find((row) => !row.particulars.trim() || !toNumber(row.dispatch_quantity));
    if (incompleteRow) {
      return 'Each row needs Particulars and Dispatch Quantity.';
    }

    return '';
  };

  const handleSave = async () => {
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    const normalizedRows = rows
      .map((row) => ({
        ...row,
        usn_links: row.usn_links.filter((link) => link.link_usn.trim() || toNumber(link.usn_quantity) > 0),
      }))
      .filter((row) => (
        row.particulars.trim()
        || String(row.dispatch_quantity).trim()
        || row.usn_links.length > 0
        || row.remark.trim()
      ));

    const validationError = validateBeforeSave(normalizedRows);
    if (validationError) {
      setSaving(false);
      setErrorMsg(validationError);
      return;
    }

    try {
      const payload = new FormData();
      payload.append('dispatch_type', dispatchType);
      payload.append('dispatch_issued_to_address', dispatchIssuedToAddress);
      payload.append('contact_person', contactPerson);
      payload.append('contact_number', contactNumber);
      payload.append('ipo_type', ipoType);
      payload.append('vehicle_no', vehicleNo);
      payload.append('company_challan_number', companyChallanNumber);

      if (dispatchType === 'INTERNAL_CHALLAN') {
        payload.append('unit_number', unitNumber);
        payload.append('department', selectedDepartment);
        payload.append('section', selectedSection);
      }

      if (dispatchType === 'EXTERNAL_CHALLAN') {
        payload.append('vendor_code', selectedVendor);
      }

      if (ipoType === 'COMPANY_ESSENTIALS') {
        payload.append('company_essential', selectedCompanyEssential);
      } else {
        payload.append('ipo', selectedIpo);
      }

      if (dispatchedGoodsConditionImage) {
        payload.append('dispatched_goods_condition_image', dispatchedGoodsConditionImage);
      }
      if (vehicleNoImage) {
        payload.append('vehicle_no_image', vehicleNoImage);
      }
      if (companyChallanImage) {
        payload.append('company_challan_image', companyChallanImage);
      }

      payload.append('items', JSON.stringify(
        normalizedRows.map((row) => ({
          particulars: row.particulars,
          dispatch_quantity: toNumber(row.dispatch_quantity),
          unit: row.unit || 'CM',
          remark: row.remark,
          dispatch_form: row.dispatch_form,
          num_packages: Number.parseInt(row.num_packages, 10) || 0,
          uqr_sent: row.uqr_sent,
          usn_links: row.usn_links.map((link) => ({
            link_usn: link.link_usn,
            usn_quantity: toNumber(link.usn_quantity),
          })),
        }))
      ));

      const result = await createOutwardStoreSheet(payload);
      if (result?.status === 'success') {
        setSuccessMsg('Outward Store Sheet saved successfully.');
      } else {
        setErrorMsg(result?.message || JSON.stringify(result) || 'Failed to save outward store sheet.');
      }
    } catch (error) {
      setErrorMsg(error.message || 'An error occurred while saving outward store sheet.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="iss-container">
      <div className="iss-header">
        <button className="iss-back-button" onClick={onBack}>
          ← Back
        </button>
        <h1 className="iss-title">Outward Store Sheet</h1>
        <p className="iss-description">
          Record dispatch challans, outward movements, and linked USN quantities
        </p>
      </div>

      {successMsg && <div className="iss-success">{successMsg}</div>}
      {errorMsg && <div className="iss-error">{errorMsg}</div>}

      <div className="iss-form">
        <div className="iss-form-grid">
          <div className="iss-form-group">
            <label className="iss-form-label">
              Dispatch Type <span className="iss-required">*</span>
            </label>
            <select
              className="iss-form-select"
              value={dispatchType}
              onChange={(event) => handleDispatchTypeChange(event.target.value)}
              disabled={loadingChoices}
            >
              <option value="">-- Select --</option>
              {choices.dispatch_types.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="iss-form-group">
            <label className="iss-form-label">
              IPO Type <span className="iss-required">*</span>
            </label>
            <select
              className="iss-form-select"
              value={ipoType}
              onChange={(event) => handleIpoTypeChange(event.target.value)}
              disabled={loadingChoices}
            >
              <option value="">-- Select --</option>
              {choices.ipo_types.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="iss-form-group full-width">
          <label className="iss-form-label">
            Dispatch / Issued To <span className="iss-required">*</span>
          </label>

          {dispatchType === 'INTERNAL_CHALLAN' && (
            <div className="oss-inline-grid">
              <input
                className="iss-form-input"
                type="text"
                value={unitNumber}
                onChange={(event) => setUnitNumber(event.target.value)}
                placeholder="Unit #"
              />
              <select
                className="iss-form-select"
                value={selectedDepartment}
                onChange={(event) => handleDepartmentChange(event.target.value)}
              >
                <option value="">-- Department --</option>
                {choices.departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </select>
              <select
                className="iss-form-select"
                value={selectedSection}
                onChange={(event) => setSelectedSection(event.target.value)}
                disabled={!selectedDepartment}
              >
                <option value="">-- Section --</option>
                {sectionOptions.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {dispatchType === 'EXTERNAL_CHALLAN' && (
            <select
              className="iss-form-select"
              value={selectedVendor}
              onChange={(event) => handleVendorChange(event.target.value)}
            >
              <option value="">-- Vendor Code --</option>
              {choices.vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.code} - {vendor.vendor_name}
                </option>
              ))}
            </select>
          )}

          {!dispatchType && (
            <div className="oss-muted-note">
              Select a dispatch type to choose internal unit details or an external vendor code.
            </div>
          )}
        </div>

        <div className="iss-form-grid">
          <div className="iss-form-group">
            <label className="iss-form-label">Dispatch / Issued To Address</label>
            <textarea
              className="iss-form-textarea"
              value={dispatchIssuedToAddress}
              onChange={(event) => setDispatchIssuedToAddress(event.target.value)}
              placeholder="Enter address"
            />
          </div>

          <div className="iss-form-group">
            <label className="iss-form-label">Contact Person</label>
            <input
              className="iss-form-input"
              type="text"
              value={contactPerson}
              onChange={(event) => setContactPerson(event.target.value)}
              placeholder="Enter contact person"
            />
          </div>

          <div className="iss-form-group">
            <label className="iss-form-label">Contact Number</label>
            <input
              className="iss-form-input"
              type="tel"
              inputMode="numeric"
              value={contactNumber}
              onChange={(event) => setContactNumber(event.target.value.replace(/[^\d]/g, ''))}
              placeholder="Enter contact number"
            />
          </div>

          <div className="iss-form-group">
            <label className="iss-form-label">
              {ipoType === 'COMPANY_ESSENTIALS' ? 'Company Essential' : 'IPO'} <span className="iss-required">*</span>
            </label>
            {ipoType === 'COMPANY_ESSENTIALS' ? (
              <select
                className="iss-form-select"
                value={selectedCompanyEssential}
                onChange={(event) => setSelectedCompanyEssential(event.target.value)}
                disabled={!ipoType || loadingIpoOptions}
              >
                <option value="">-- Select Company Essential --</option>
                {companyEssentialOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.code} {option.item ? `- ${option.item}` : ''}
                  </option>
                ))}
              </select>
            ) : (
              <select
                className="iss-form-select"
                value={selectedIpo}
                onChange={(event) => setSelectedIpo(event.target.value)}
                disabled={!ipoType || loadingIpoOptions}
              >
                <option value="">-- Select IPO --</option>
                {ipoOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.ipo_code} - {option.program_name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        <h3 className="iss-section-title">Dispatch Details</h3>
        <div className="iss-form-grid">
          <div className="iss-form-group">
            <label className="iss-form-label">Dispatched Goods Condition</label>
            <div className="iss-file-upload">
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setDispatchedGoodsConditionImage(event.target.files?.[0] || null)}
              />
            </div>
            {dispatchedGoodsConditionImage && (
              <span className="iss-file-name">{dispatchedGoodsConditionImage.name}</span>
            )}
          </div>

          <div className="iss-form-group">
            <label className="iss-form-label">Vehicle No.</label>
            <div className="iss-input-with-image">
              <input
                className="iss-form-input"
                type="text"
                value={vehicleNo}
                onChange={(event) => setVehicleNo(event.target.value)}
                placeholder="Enter vehicle number"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setVehicleNoImage(event.target.files?.[0] || null)}
              />
            </div>
            {vehicleNoImage && (
              <span className="iss-file-name">{vehicleNoImage.name}</span>
            )}
          </div>

          <div className="iss-form-group">
            <label className="iss-form-label">Company Challan Number</label>
            <div className="iss-input-with-image">
              <input
                className="iss-form-input"
                type="text"
                value={companyChallanNumber}
                onChange={(event) => setCompanyChallanNumber(event.target.value)}
                placeholder="Enter company challan number"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setCompanyChallanImage(event.target.files?.[0] || null)}
              />
            </div>
            {companyChallanImage && (
              <span className="iss-file-name">{companyChallanImage.name}</span>
            )}
          </div>
        </div>

        <h3 className="iss-section-title">Items</h3>
        <div className="iss-table-wrapper">
          <table className="iss-table">
            <colgroup>
              <col style={{ width: '4%' }} />
              <col style={{ width: '14%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '8%' }} />
              <col style={{ width: '17%' }} />
              <col style={{ width: '17%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '8%' }} />
              <col style={{ width: '14%' }} />
              <col style={{ width: '4%' }} />
            </colgroup>
            <thead>
              <tr>
                <th>Sr</th>
                <th>Particulars</th>
                <th>Dispatch Qty</th>
                <th>Unit</th>
                <th>Link USN</th>
                <th>USN Quantity</th>
                <th>Remark</th>
                <th>Dispatch Form</th>
                <th># of Package</th>
                <th>UQR</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => {
                const usnQuantitySum = getUsnQuantitySum(row);
                const balance = getBalance(row);
                const carryCode = getCarryCode(rowIndex);
                const showCarryForward = balance > 0;

                return (
                  <tr key={row.id}>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>{rowIndex + 1}</td>
                    <td>
                      <input
                        type="text"
                        value={row.particulars}
                        onChange={(event) => handleRowChange(row.id, 'particulars', event.target.value)}
                        placeholder="Particulars"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={row.dispatch_quantity}
                        onChange={(event) => handleRowChange(row.id, 'dispatch_quantity', event.target.value)}
                        placeholder="0"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.unit}
                        onChange={(event) => handleRowChange(row.id, 'unit', event.target.value.toUpperCase())}
                        placeholder={choices.item_units[0] || 'CM'}
                      />
                    </td>
                    <td>
                      <div className="oss-cell-stack">
                        {row.usn_links.map((link, linkIndex) => (
                          <div key={link.id} className="oss-link-row">
                            <input
                              type="text"
                              value={link.link_usn}
                              onChange={(event) => handleUsnLinkChange(row.id, link.id, 'link_usn', event.target.value)}
                              placeholder={linkIndex === 0 ? 'Link USN' : 'Extra Link USN'}
                            />
                            {row.usn_links.length > 1 && (
                              <button
                                type="button"
                                className="iss-remove-row oss-inline-remove"
                                onClick={() => removeUsnLinkRow(row.id, link.id)}
                                title="Remove USN link"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        ))}
                        {(balance < 0 || row.usn_links.length > 1) && (
                          <button
                            type="button"
                            className="oss-mini-btn"
                            onClick={() => addUsnLinkRow(row.id)}
                          >
                            + Add USN Row
                          </button>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="oss-cell-stack">
                        {row.usn_links.map((link, linkIndex) => (
                          <input
                            key={link.id}
                            type="number"
                            min="0"
                            step="0.01"
                            value={link.usn_quantity}
                            onChange={(event) => handleUsnLinkChange(row.id, link.id, 'usn_quantity', event.target.value)}
                            placeholder={linkIndex === 0 ? 'USN Qty' : 'Extra Qty'}
                          />
                        ))}
                        <div className="oss-summary">
                          <span>Sum: {formatQuantity(usnQuantitySum)}</span>
                          <span>Balance: {formatQuantity(balance)}</span>
                          {showCarryForward && (
                            <span className="oss-carry-forward">{carryCode} {formatQuantity(balance)}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.remark}
                        onChange={(event) => handleRowChange(row.id, 'remark', event.target.value)}
                        placeholder="Remark"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.dispatch_form}
                        onChange={(event) => handleRowChange(row.id, 'dispatch_form', event.target.value)}
                        placeholder="Dispatch Form"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        value={row.num_packages}
                        onChange={(event) => handleRowChange(row.id, 'num_packages', event.target.value)}
                        placeholder="0"
                      />
                    </td>
                    <td>
                      <div className="iss-uqr-cell" title="Sent to verification">
                        <input
                          type="checkbox"
                          checked={row.uqr_sent}
                          onChange={(event) => handleRowChange(row.id, 'uqr_sent', event.target.checked)}
                        />
                        <span className="iss-uqr-text">SENT TO VERIFICATION</span>
                      </div>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="iss-remove-row"
                        onClick={() => removeMainRow(row.id)}
                        title="Remove row"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <button type="button" className="iss-add-row-btn" onClick={addMainRow}>
          + Add Row
        </button>

        <div className="iss-actions">
          <button
            type="button"
            className="iss-btn iss-btn-primary"
            onClick={handleSave}
            disabled={saving || loadingChoices}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OutwardStoreSheet;

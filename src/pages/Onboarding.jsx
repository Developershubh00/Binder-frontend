import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as authService from '../api/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormCard } from '@/components/ui/form-layout';
import './Onboarding.css';

const BUSINESS_CATEGORIES = ['Manufacturer', 'Exporter', 'Job Worker', 'Trader'];
const FY_MONTHS = [{ value: 4, label: 'April' }, { value: 1, label: 'January' }];

export default function Onboarding() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState(null);
  const [step, setStep] = useState(1);
  const [step2, setStep2] = useState({ legal_name: '', trade_name: '', business_categories: [], gst_number: '', pan_number: '', iec_code: '', msme_number: '', factory_license: '', registered_address: { line1: '', line2: '', city: '', state: '', pin_code: '', country: 'India' } });
  const [units, setUnits] = useState([]);
  const [step4, setStep4] = useState({ challan_format: '', invoice_format: '', po_format: '', fy_start_month: 4, serial_start: 1, phone_on_docs: [], email_on_docs: '', website_on_docs: '', signatory_name: '', challan_footer: '', invoice_footer: '' });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.tenant_details && user?.tenant_details === null) {
      setLoading(false);
      return;
    }
    authService.getOnboarding()
      .then((res) => {
        setData(res);
        setStep(res?.onboarding_step || 1);
        if (res?.company) setStep2((prev) => ({ ...prev, ...res.company, registered_address: { ...prev.registered_address, ...res.company?.registered_address } }));
        if (res?.units?.length) setUnits(res.units);
        if (res?.document_config) setStep4((prev) => ({ ...prev, ...res.document_config }));
      })
      .catch(() => setError('Failed to load onboarding'))
      .finally(() => setLoading(false));
  }, [user]);

  const handleStep2Save = async () => {
    setSaving(true);
    setError(null);
    try {
      await authService.updateOnboarding(2, {
        legal_name: step2.legal_name,
        trade_name: step2.trade_name,
        business_categories: step2.business_categories,
        gst_number: step2.gst_number,
        pan_number: step2.pan_number,
        iec_code: step2.iec_code,
        msme_number: step2.msme_number,
        factory_license: step2.factory_license,
        registered_address: step2.registered_address,
      });
      setStep(3);
    } catch (e) {
      setError(e?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleStep3Save = async () => {
    setSaving(true);
    setError(null);
    try {
      await authService.updateOnboarding(3, { units });
      setStep(4);
    } catch (e) {
      setError(e?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleStep4Save = async () => {
    setSaving(true);
    setError(null);
    try {
      await authService.updateOnboarding(4, {
        challan_format: step4.challan_format,
        invoice_format: step4.invoice_format,
        po_format: step4.po_format,
        fy_start_month: step4.fy_start_month,
        serial_start: step4.serial_start,
        phone_on_docs: Array.isArray(step4.phone_on_docs) ? step4.phone_on_docs : [step4.phone_on_docs].filter(Boolean),
        email_on_docs: step4.email_on_docs,
        website_on_docs: step4.website_on_docs,
        signatory_name: step4.signatory_name,
        challan_footer: step4.challan_footer,
        invoice_footer: step4.invoice_footer,
      });
      await refreshUser();
      navigate('/dashboard');
    } catch (e) {
      setError(e?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const addUnit = () => setUnits((prev) => [...prev, { unit_name: '', unit_code: '', address: {}, city: '', state: '', pin_code: '', contact_person: '', contact_phone: '', contact_email: '', sheds: [{ shed_name: '', shed_code: '', primary_process: '' }] }]);
  const updateUnit = (idx, field, value) => setUnits((prev) => prev.map((u, i) => (i === idx ? { ...u, [field]: value } : u)));
  const addShed = (unitIdx) => setUnits((prev) => prev.map((u, i) => (i === unitIdx ? { ...u, sheds: [...(u.sheds || []), { shed_name: '', shed_code: '', primary_process: '' }] } : u)));

  if (loading) return <div className="onboarding-page"><div className="onboarding-loading">Loading...</div></div>;
  if (data?.onboarding_completed) {
    refreshUser().then(() => navigate('/dashboard'));
    return null;
  }
  if (data?.tenant == null && !user?.tenant_details) {
    return (
      <div className="onboarding-page">
        <div className="onboarding-header"><h1 className="onboarding-title">Company setup</h1></div>
        <FormCard className="onboarding-card">
          <p className="onboarding-muted">You are not assigned to a company. Contact your administrator.</p>
          <Button variant="outline" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </FormCard>
      </div>
    );
  }

  return (
    <div className="onboarding-page">
      <div className="onboarding-header">
        <h1 className="onboarding-title">Company setup</h1>
        <p className="onboarding-subtitle">Step {step} of 4 · Binder ERP onboarding</p>
      </div>
      {error && <div className="onboarding-error">{error}</div>}

      {step === 1 && (
        <FormCard className="onboarding-card">
          <h2>Step 1 · Password &amp; profile</h2>
          <p className="onboarding-desc">Your account is ready. Set your password in Profile if needed, then continue to company details.</p>
          <p className="onboarding-muted">Owner: {data?.tenant?.owner_name || user?.name} · Email: {data?.tenant?.company_email || user?.email}</p>
          <Button onClick={() => setStep(2)}>Continue to Step 2</Button>
        </FormCard>
      )}

      {step === 2 && (
        <FormCard className="onboarding-card">
          <h2>Step 2 · Company identity &amp; legal</h2>
          <div className="onboarding-form">
            <label>Company legal name *</label>
            <Input value={step2.legal_name} onChange={(e) => setStep2((p) => ({ ...p, legal_name: e.target.value }))} placeholder="Legal name" />
            <label>Trade / brand name</label>
            <Input value={step2.trade_name} onChange={(e) => setStep2((p) => ({ ...p, trade_name: e.target.value }))} placeholder="Trade name" />
            <label>GST number *</label>
            <Input value={step2.gst_number} onChange={(e) => setStep2((p) => ({ ...p, gst_number: e.target.value }))} placeholder="GST number" />
            <label>PAN, IEC, MSME, Factory license</label>
            <Input value={step2.pan_number} onChange={(e) => setStep2((p) => ({ ...p, pan_number: e.target.value }))} placeholder="PAN" />
            <Input value={step2.iec_code} onChange={(e) => setStep2((p) => ({ ...p, iec_code: e.target.value }))} placeholder="IEC code" />
            <Input value={step2.msme_number} onChange={(e) => setStep2((p) => ({ ...p, msme_number: e.target.value }))} placeholder="MSME / Udyam" />
            <Input value={step2.factory_license} onChange={(e) => setStep2((p) => ({ ...p, factory_license: e.target.value }))} placeholder="Factory license" />
            <label>Registered address</label>
            <Input value={step2.registered_address?.line1} onChange={(e) => setStep2((p) => ({ ...p, registered_address: { ...p.registered_address, line1: e.target.value } }))} placeholder="Address line 1" />
            <Input value={step2.registered_address?.city} onChange={(e) => setStep2((p) => ({ ...p, registered_address: { ...p.registered_address, city: e.target.value } }))} placeholder="City" />
            <Input value={step2.registered_address?.state} onChange={(e) => setStep2((p) => ({ ...p, registered_address: { ...p.registered_address, state: e.target.value } }))} placeholder="State" />
            <Input value={step2.registered_address?.pin_code} onChange={(e) => setStep2((p) => ({ ...p, registered_address: { ...p.registered_address, pin_code: e.target.value } }))} placeholder="PIN code" />
            <div className="onboarding-actions">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={handleStep2Save} disabled={saving}>{saving ? 'Saving...' : 'Save & continue'}</Button>
            </div>
          </div>
        </FormCard>
      )}

      {step === 3 && (
        <FormCard className="onboarding-card">
          <h2>Step 3 · Factory units &amp; sheds</h2>
          <p className="onboarding-desc">Add at least one unit. You can add sheds per unit.</p>
          {units.length === 0 && <Button variant="outline" onClick={addUnit}>Add unit</Button>}
          {units.map((u, idx) => (
            <div key={idx} className="onboarding-unit">
              <h3>Unit {idx + 1}</h3>
              <Input value={u.unit_name} onChange={(e) => updateUnit(idx, 'unit_name', e.target.value)} placeholder="Unit name" />
              <Input value={u.contact_person} onChange={(e) => updateUnit(idx, 'contact_person', e.target.value)} placeholder="Contact person" />
              <Input value={u.contact_phone} onChange={(e) => updateUnit(idx, 'contact_phone', e.target.value)} placeholder="Contact phone" />
              <Input value={u.city} onChange={(e) => updateUnit(idx, 'city', e.target.value)} placeholder="City" />
              <Button variant="outline" size="sm" onClick={() => addShed(idx)}>Add shed</Button>
              {(u.sheds || []).map((s, si) => (
                <div key={si} className="onboarding-shed"><Input value={s.shed_name} onChange={(e) => setUnits((prev) => prev.map((un, i) => (i === idx ? { ...un, sheds: un.sheds.map((sh, j) => (j === si ? { ...sh, shed_name: e.target.value } : sh)) } : un)))} placeholder="Shed name" /></div>
              ))}
            </div>
          ))}
          {units.length > 0 && <Button variant="outline" onClick={addUnit} className="onboarding-add-unit">Add another unit</Button>}
          <div className="onboarding-actions">
            <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
            <Button onClick={handleStep3Save} disabled={saving}>{saving ? 'Saving...' : 'Save & continue'}</Button>
          </div>
        </FormCard>
      )}

      {step === 4 && (
        <FormCard className="onboarding-card">
          <h2>Step 4 · Document configuration</h2>
          <div className="onboarding-form">
            <label>Challan / Invoice / PO format</label>
            <Input value={step4.challan_format} onChange={(e) => setStep4((p) => ({ ...p, challan_format: e.target.value }))} placeholder="Challan format" />
            <Input value={step4.invoice_format} onChange={(e) => setStep4((p) => ({ ...p, invoice_format: e.target.value }))} placeholder="Invoice format" />
            <Input value={step4.po_format} onChange={(e) => setStep4((p) => ({ ...p, po_format: e.target.value }))} placeholder="PO format" />
            <label>Financial year start</label>
            <select value={step4.fy_start_month} onChange={(e) => setStep4((p) => ({ ...p, fy_start_month: Number(e.target.value) }))}>
              {FY_MONTHS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
            <label>Starting serial number</label>
            <Input type="number" value={step4.serial_start} onChange={(e) => setStep4((p) => ({ ...p, serial_start: Number(e.target.value) || 1 }))} />
            <label>Contact on documents</label>
            <Input value={step4.email_on_docs} onChange={(e) => setStep4((p) => ({ ...p, email_on_docs: e.target.value }))} placeholder="Email on docs" />
            <Input value={step4.website_on_docs} onChange={(e) => setStep4((p) => ({ ...p, website_on_docs: e.target.value }))} placeholder="Website" />
            <Input value={step4.signatory_name} onChange={(e) => setStep4((p) => ({ ...p, signatory_name: e.target.value }))} placeholder="Authorized signatory" />
            <textarea value={step4.challan_footer} onChange={(e) => setStep4((p) => ({ ...p, challan_footer: e.target.value }))} placeholder="Challan footer" rows={2} />
            <textarea value={step4.invoice_footer} onChange={(e) => setStep4((p) => ({ ...p, invoice_footer: e.target.value }))} placeholder="Invoice footer" rows={2} />
            <div className="onboarding-actions">
              <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
              <Button onClick={handleStep4Save} disabled={saving}>{saving ? 'Saving...' : 'Complete setup'}</Button>
            </div>
          </div>
        </FormCard>
      )}
    </div>
  );
}

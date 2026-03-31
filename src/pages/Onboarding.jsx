import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as authService from '../api/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormCard } from '@/components/ui/form-layout';
import './Onboarding.css';

const BUSINESS_CATEGORIES = ['Manufacturer', 'Exporter', 'Job Worker', 'Trader'];

export default function Onboarding() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState(null);
  const [step, setStep] = useState(1);
  const [step2, setStep2] = useState({ legal_name: '', trade_name: '', business_categories: [], gst_number: '', pan_number: '', iec_code: '', msme_number: '', factory_license: '', registered_address: { line1: '', line2: '', city: '', state: '', pin_code: '', country: 'India' } });
  const [units, setUnits] = useState([]);
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
        if (res?.company) {
          const company = { ...res.company };
          // Auto-fill from registration data if onboarding fields are empty
          if (!company.legal_name && res?.tenant?.company_name) company.legal_name = res.tenant.company_name;
          if (!company.registered_address?.line1 && res?.tenant?.company_address) {
            company.registered_address = { ...company.registered_address, line1: res.tenant.company_address };
          }
          setStep2((prev) => ({ ...prev, ...company, registered_address: { ...prev.registered_address, ...company?.registered_address } }));
        }
        if (res?.units?.length) setUnits(res.units);
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
        <p className="onboarding-subtitle">Step {step} of 3 · Binder ERP onboarding</p>
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
            <Button onClick={handleStep3Save} disabled={saving}>{saving ? 'Saving...' : 'Complete setup'}</Button>
          </div>
        </FormCard>
      )}


    </div>
  );
}

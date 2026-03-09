import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPublicEssentialByToken, markPublicEssentialTaken } from '../services/integration';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormCard } from '@/components/ui/form-layout';

const PAYMENT_OPTIONS = [
  { value: 'cash', label: 'Cash' },
  { value: 'upi', label: 'UPI' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
];

export default function EssentialsViewPage() {
  const { token } = useParams();
  const [essential, setEssential] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [personName, setPersonName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (!token) {
      setError('Missing link');
      setLoading(false);
      return;
    }
    getPublicEssentialByToken(token)
      .then((data) => {
        setEssential(data);
        setError(null);
      })
      .catch((err) => {
        setError(err?.message || 'Invalid or expired link');
        setEssential(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleMarkTaken = async (e) => {
    e.preventDefault();
    if (!personName.trim()) {
      setSubmitError('Please enter your name');
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      await markPublicEssentialTaken(token, {
        taken_by_name: personName.trim(),
        person_name: personName.trim(),
        payment_method: paymentMethod || undefined,
      });
      const updated = await getPublicEssentialByToken(token);
      setEssential(updated);
    } catch (err) {
      setSubmitError(err?.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error || !essential) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-foreground mb-2">Link invalid or expired</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  const taken = !!essential.taken_at;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-semibold text-foreground mb-2">Company Essential Request</h1>
        <p className="text-muted-foreground text-sm mb-6">
          Use this page to confirm the project is taken and how payment will be made.
        </p>

        <FormCard className="rounded-xl border border-border bg-card p-6 mb-6">
          <dl className="grid gap-2 text-sm">
            {essential.code && (
              <>
                <dt className="font-medium text-muted-foreground">Code</dt>
                <dd className="font-mono font-semibold">{essential.code}</dd>
              </>
            )}
            {essential.category && (
              <>
                <dt className="font-medium text-muted-foreground">Category</dt>
                <dd>{essential.category}</dd>
              </>
            )}
            {essential.entry_date && (
              <>
                <dt className="font-medium text-muted-foreground">Date</dt>
                <dd>{essential.entry_date}</dd>
              </>
            )}
            {essential.item_description && (
              <>
                <dt className="font-medium text-muted-foreground">Item / Description</dt>
                <dd>{essential.item_description}</dd>
              </>
            )}
            {essential.department && (
              <>
                <dt className="font-medium text-muted-foreground">Department</dt>
                <dd>{essential.department}</dd>
              </>
            )}
            {essential.quantity != null && (
              <>
                <dt className="font-medium text-muted-foreground">Quantity</dt>
                <dd>{essential.quantity}</dd>
              </>
            )}
            {essential.amount != null && (
              <>
                <dt className="font-medium text-muted-foreground">Amount</dt>
                <dd>{essential.amount}</dd>
              </>
            )}
            {essential.unit && (
              <>
                <dt className="font-medium text-muted-foreground">Unit</dt>
                <dd>{essential.unit}</dd>
              </>
            )}
            {essential.remarks && (
              <>
                <dt className="font-medium text-muted-foreground">Remarks</dt>
                <dd>{essential.remarks}</dd>
              </>
            )}
          </dl>
        </FormCard>

        {taken ? (
          <FormCard className="rounded-xl border border-green-500/50 bg-green-500/5 p-6">
            <h2 className="font-semibold text-foreground mb-2">Already taken</h2>
            <p className="text-sm text-muted-foreground">
              Taken by <span className="font-medium text-foreground">{essential.taken_by_name || '—'}</span>
              {essential.taken_at && (
                <> on {new Date(essential.taken_at).toLocaleString()}</>
              )}
              {essential.payment_method && (
                <> · Payment: {PAYMENT_OPTIONS.find((o) => o.value === essential.payment_method)?.label || essential.payment_method}</>
              )}
            </p>
          </FormCard>
        ) : (
          <FormCard className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-semibold text-foreground mb-4">Mark as taken</h2>
            <form onSubmit={handleMarkTaken} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Your name</label>
                <Input
                  type="text"
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Payment method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">Select (optional)</option>
                  {PAYMENT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              {submitError && <p className="text-sm text-destructive">{submitError}</p>}
              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? 'Submitting...' : 'Mark as taken'}
              </Button>
            </form>
          </FormCard>
        )}
      </div>
    </div>
  );
}

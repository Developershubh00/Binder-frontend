import { Button } from '@/components/ui/button';

const CompanyEssentialsMasterSheet = ({ onBack }) => {
  return (
    <div className="fullscreen-content">
      <div className="content-header">
        <Button
          variant="outline"
          onClick={onBack}
          type="button"
          className="mb-6 bg-white"
        >
          ← Back
        </Button>
        <h1 className="fullscreen-title">Master Company Essentials Sheet</h1>
        <p className="fullscreen-description">
          View and manage all company essentials master records.
        </p>
      </div>

      <div
        style={{
          marginTop: '40px',
          padding: '60px 24px',
          textAlign: 'center',
          background: 'var(--card)',
          border: '1px dashed var(--border)',
          borderRadius: '12px',
          color: 'var(--muted-foreground)',
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: 'var(--foreground)' }}>
          No master sheet data yet
        </h2>
        <p style={{ fontSize: 14, lineHeight: 1.5 }}>
          Once company essentials codes are saved, they will appear here as a searchable master sheet.
        </p>
      </div>
    </div>
  );
};

export default CompanyEssentialsMasterSheet;

// TEMP visual harness (not part of the app) — mounts the three components changed in
// Change 21 with mock data mirroring the BOM & WO screenshot so the derived flow
// identities can be seen live. Delete flowharness.html + this file when done.
import { createRoot } from 'react-dom/client';
import './index.css';
import WorkOrdersSection from './components/GenerateFactoryCode/components/workOrders/WorkOrdersSection';
import SpecSection from './components/GenerateFactoryCode/components/cutting/SpecSection';
import ProcessSection from './components/GenerateFactoryCode/components/cutting/ProcessSection';

// Minimal work-order shape (only the fields these views read).
const wo = (workOrder, extra = {}) => ({
  workOrder,
  receivedUnit: '', processUnit: '', dispatchUnit: '',
  cutLength: '', cutWidth: '', cutUnit: '', cutWastage: '',
  sewLength: '', sewWidth: '', sewUnit: '', sewWastage: '',
  finishingProcess: '', finishingTypes: [], finishingGroups: [],
  isRequired: '', wastage: '', remarks: '', machineType: '', approval: [],
  testingRequirements: [], qualityVerification: '',
  ...extra,
});

// The screenshot's flow: DYEING → CUTTING(prior) → QUILTING → CUTTING(post) → SEWING.
const workOrders = [
  wo('DYEING', { wastage: '5', dyeingType: 'JIGGER DYEING' }),
  wo('CUTTING', { remarks: 'Cutting Prior Quilting', cutLength: '60', cutWidth: '40', cutUnit: 'PCS' }),
  wo('QUILTING', { quiltingType: 'SINGLE NEEDLE' }),
  wo('CUTTING', { remarks: 'Cutting Post Quilting', cutLength: '58', cutWidth: '38', cutUnit: 'PCS' }),
  wo('SEWING', { remarks: 'SS' }),
];

const formData = {
  products: [{ components: [{ productComforter: 'Front Interlining', placement: 'TOP PLACEMENT' }] }],
  rawMaterials: [{
    componentName: 'Front Interlining',
    materialDescription: 'Sheeting/100%Cotton/115GSM',
    workOrders,
  }],
  processAssignments: { cutting: { clubs: [] }, sewing: { clubs: [] } },
};

const noop = () => {};
const errors = {};

const Panel = ({ title, subtitle, children }) => (
  <section style={{ marginBottom: 40 }}>
    <h2 style={{ fontSize: 15, fontWeight: 800, letterSpacing: 0.4, textTransform: 'uppercase', color: '#0f172a', marginBottom: 2 }}>{title}</h2>
    <p style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>{subtitle}</p>
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 16 }}>{children}</div>
  </section>
);

function Harness() {
  const view = new URLSearchParams(window.location.search).get('view') || 'all';
  const show = (k) => view === 'all' || view === k || (view === 'lower' && (k === 'spec' || k === 'club'));
  return (
    <div style={{ maxWidth: 1040, margin: '0 auto', padding: '28px 20px 80px' }}>
      <h1 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>Change 21 · Work-order flow identity — live render</h1>
      <p style={{ fontSize: 13, color: '#475569', marginBottom: 28 }}>
        Same flow as the BOM &amp; WO screenshot: DYEING → CUTTING (prior) → QUILTING → CUTTING (post) → SEWING.
      </p>

      {show('bom') && (
      <Panel title="1 · BOM & WO — flow strip + identity badges" subtitle="Full work-order list with the derived flow chain and per-header identity.">
        <WorkOrdersSection
          material={formData.rawMaterials[0]}
          materialIndex={0}
          actualIndex={0}
          errors={errors}
          handleWorkOrderChange={noop}
          addWorkOrder={noop}
          removeWorkOrder={noop}
        />
      </Panel>
      )}

      {show('spec') && (
      <Panel title="2 · Cut & Sew → Cutting spec — two distinct blocks" subtitle="Both cuttings rendered separately with their true flow step, occurrence and BOM remark, each with its own size.">
        <SpecSection
          formData={formData}
          errors={errors}
          woType="CUTTING"
          prefix="cut"
          sizeLabel="CUT SIZE"
          handleWorkOrderChange={noop}
          removeWorkOrder={noop}
        />
      </Panel>
      )}

      {show('club') && (
      <Panel title="3 · Cut & Sew → Cutting process (clubbing)" subtitle="Component row now lists its cutting work-order identities for the clubbing view.">
        <ProcessSection
          formData={formData}
          woType="CUTTING"
          prefix="cut"
          kind="cutting"
          clubs={[]}
          clubComponents={noop}
          unclubClub={noop}
        />
      </Panel>
      )}
    </div>
  );
}

createRoot(document.getElementById('root')).render(<Harness />);

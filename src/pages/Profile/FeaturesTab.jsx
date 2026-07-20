import * as authService from '../../api/authService';

// "Features" nav section (master-admin only): per-tenant feature-override toggles.
export default function FeaturesTab({ featureOverrides, setFeatureOverrides, tenant }) {
  return (
    <div className="profile-content" key="features">
      <section className="profile-section">
        <h2 className="profile-section-heading">Features</h2>
        <p className="profile-section-desc">Manage feature overrides for this tenant.</p>
        {featureOverrides.length === 0 && (
          <p className="profile-muted">No feature overrides configured.</p>
        )}
        {featureOverrides.map((item) => (
          <div
            key={item.id}
            style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}
          >
            <div>
              <strong>{item.feature_name || item.feature_key}</strong>
              <div style={{ fontSize: 12, color: '#666' }}>{item.feature_key}</div>
            </div>
            <input
              type="checkbox"
              checked={Boolean(item.enabled)}
              onChange={async (e) => {
                const enabled = e.target.checked;
                const next = featureOverrides.map((f) =>
                  f.id === item.id ? { ...f, enabled } : f,
                );
                setFeatureOverrides(next);
                try {
                  await authService.updateTenantFeatureOverrides(tenant, [
                    { feature: item.feature, enabled },
                  ]);
                } catch {
                  setFeatureOverrides(featureOverrides);
                }
              }}
            />
          </div>
        ))}
      </section>
    </div>
  );
}

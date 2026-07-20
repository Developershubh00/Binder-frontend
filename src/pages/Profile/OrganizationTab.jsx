// "Organization" nav section: company summary stats + details.
export default function OrganizationTab({ orgSummary }) {
  return (
    <div className="profile-content" key="org">
      <section className="profile-section">
        <h2 className="profile-section-heading">Organization</h2>

        {orgSummary ? (
          <>
            <div className="profile-stat-row">
              <div className="profile-stat-card">
                <span className="profile-stat-val">
                  {orgSummary.member_count ?? 0}
                  {orgSummary.max_users != null ? `/${orgSummary.max_users}` : ''}
                </span>
                <span className="profile-stat-lbl">Members / Slots</span>
              </div>
              <div className="profile-stat-card">
                <span className="profile-stat-val profile-stat-val--sm">
                  {orgSummary.tenant_id || '—'}
                </span>
                <span className="profile-stat-lbl">Tenant ID</span>
              </div>
            </div>

            <div className="profile-form-grid profile-form-grid--mt">
              <div className="profile-field">
                <label className="profile-label">Company name</label>
                <div className="profile-input-static">{orgSummary.company_name || '—'}</div>
              </div>
              <div className="profile-field">
                <label className="profile-label">Owner</label>
                <div className="profile-input-static">{orgSummary.owner_name || '—'}</div>
              </div>
            </div>
          </>
        ) : (
          <div className="profile-empty">
            <span className="profile-empty-icon">🏢</span>
            <p>You are not assigned to an organization.</p>
          </div>
        )}
      </section>
    </div>
  );
}

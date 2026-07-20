// Loading placeholder shown while the profile/org/members data loads.
export default function ProfileSkeleton() {
  return (
    <div className="profile-root">
      {/* ── Skeleton Sidebar ─────────────────────────── */}
      <aside className="profile-sidebar">
        <div className="profile-sidebar-bg" />
        <div className="profile-sidebar-top">
          <div className="profile-avatar-wrap">
            <div className="sk-circle sk-avatar-lg" />
          </div>
          <div className="sk-line sk-line--name" />
          <div className="sk-line sk-line--role" />
        </div>
        <nav className="profile-nav">
          <div className="sk-nav-item" />
          <div className="sk-nav-item sk-nav-item--sm" />
          <div className="sk-nav-item sk-nav-item--sm" />
        </nav>
      </aside>

      {/* ── Skeleton Main ────────────────────────────── */}
      <main className="profile-main">
        {/* Section heading */}
        <div className="sk-line sk-heading" />

        {/* 2-col form grid */}
        <div className="sk-grid">
          <div className="sk-field"><div className="sk-line sk-label" /><div className="sk-box" /></div>
          <div className="sk-field"><div className="sk-line sk-label" /><div className="sk-box" /></div>
          <div className="sk-field"><div className="sk-line sk-label" /><div className="sk-box" /></div>
          <div className="sk-field"><div className="sk-line sk-label" /><div className="sk-box" /></div>
        </div>

        <div className="sk-divider" />

        {/* Second section */}
        <div className="sk-line sk-heading sk-heading--sm" />
        <div className="sk-grid">
          <div className="sk-field"><div className="sk-line sk-label" /><div className="sk-box" /></div>
          <div className="sk-field"><div className="sk-line sk-label" /><div className="sk-box" /></div>
        </div>
        <div className="sk-btn" />
      </main>
    </div>
  );
}

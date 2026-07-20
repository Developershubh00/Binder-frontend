import { Link } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';
import { getInitials } from './helpers';

// Left rail: avatar, name/role, and the nav that switches the active section.
export default function ProfileSidebar({
  navItems,
  activeNav,
  setActiveNav,
  displayName,
  email,
  role,
}) {
  return (
    <aside className="profile-sidebar">
      {/* Decorative bg shape */}
      <div className="profile-sidebar-bg" />

      {/* Avatar */}
      <div className="profile-sidebar-top">
        <div className="profile-avatar-wrap">
          <div className="profile-avatar-circle">{getInitials(displayName, email)}</div>
        </div>
        <p className="profile-sidebar-name">{displayName}</p>
        <p className="profile-sidebar-role">{role}</p>
      </div>

      {/* Nav */}
      <nav className="profile-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`profile-nav-item${activeNav === item.id ? ' profile-nav-item--active' : ''}`}
            onClick={() => setActiveNav(item.id)}
          >
            {item.label}
          </button>
        ))}
        <div className="profile-nav-divider" />
        <Link to="/dashboard" className="profile-nav-back">
          <LayoutDashboard size={16} /> Back to Dashboard
        </Link>
      </nav>
    </aside>
  );
}

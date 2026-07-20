import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as authService from '../../api/authService';
import ActivityLogs from '../../components/ActivityLogs.jsx';
import '../Profile.css';

import { getDisplayName } from './helpers';
import ProfileSidebar from './ProfileSidebar';
import ProfileSkeleton from './ProfileSkeleton';
import AccountTab from './AccountTab';
import OrganizationTab from './OrganizationTab';
import EmployeesTab from './EmployeesTab';
import FeaturesTab from './FeaturesTab';
import RolesPermissionsTab from './RolesPermissionsTab';

export default function Profile() {
  const { user } = useAuth();
  const [orgSummary, setOrgSummary]           = useState(null);
  const [members, setMembers]                 = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState(null);
  const [activeNav, setActiveNav]             = useState('account');
  const [featureOverrides, setFeatureOverrides] = useState([]);

  const isMasterAdmin =
    user?.highest_role === 'master_admin' ||
    user?.role         === 'master_admin' ||
    user?.is_primary_master;

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const promises = [authService.getOrgSummary()];
        if (isMasterAdmin) {
          promises.push(authService.getMembers());
          if (user?.tenant) {
            promises.push(authService.getTenantFeatureOverrides(user.tenant));
          }
        }
        const results = await Promise.all(promises);
        setOrgSummary(results[0]);
        if (isMasterAdmin) {
          setMembers(Array.isArray(results[1]) ? results[1] : []);
          if (user?.tenant) {
            setFeatureOverrides(Array.isArray(results[2]) ? results[2] : []);
          }
        }
      } catch (e) {
        setError(e?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    })();
  }, [isMasterAdmin]);

  const displayName = getDisplayName(user);

  const refreshMembers = async () => {
    const list = await authService.getMembers();
    setMembers(Array.isArray(list) ? list : []);
  };

  const navItems = [
    { id: 'account',  label: 'Account'      },
    { id: 'org',      label: 'Organization' },
    ...(isMasterAdmin ? [{ id: 'employees', label: 'Employees' }] : []),
    ...(isMasterAdmin ? [{ id: 'features', label: 'Features' }] : []),
    ...(isMasterAdmin ? [{ id: 'roles-permissions', label: 'Roles & Permissions' }] : []),
    ...(isMasterAdmin ? [{ id: 'activity-logs', label: 'Activity Logs' }] : []),
  ];

  if (loading) return <ProfileSkeleton />;

  return (
    <div className="profile-root">

      {/* ══════════════════════ SIDEBAR ══════════════════════════ */}
      <ProfileSidebar
        navItems={navItems}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        displayName={displayName}
        email={user?.email}
        role={user?.highest_role || user?.role || 'member'}
      />

      {/* ══════════════════════ MAIN CONTENT ═════════════════════ */}
      <main className="profile-main">

        {error && <div className="profile-error">⚠ {error}</div>}

        {/* Onboarding pending banner */}
        {user?.tenant_details?.onboarding_completed === false && (
          <div className="profile-banner">
            <div>
              <span className="profile-banner-badge">Action required</span>
              <p className="profile-banner-text">
                Complete the 4-step onboarding to set up your company profile.
              </p>
            </div>
            <Link to="/onboarding" className="profile-banner-btn">Set up →</Link>
          </div>
        )}

        {activeNav === 'account' && (
          <AccountTab displayName={displayName} user={user} />
        )}

        {activeNav === 'org' && (
          <OrganizationTab orgSummary={orgSummary} />
        )}

        {activeNav === 'employees' && isMasterAdmin && (
          <EmployeesTab
            members={members}
            setMembers={setMembers}
            refreshMembers={refreshMembers}
            orgSummary={orgSummary}
          />
        )}

        {activeNav === 'features' && isMasterAdmin && (
          <FeaturesTab
            featureOverrides={featureOverrides}
            setFeatureOverrides={setFeatureOverrides}
            tenant={user?.tenant}
          />
        )}

        {activeNav === 'roles-permissions' && isMasterAdmin && (
          <RolesPermissionsTab members={members} />
        )}

        {activeNav === 'activity-logs' && isMasterAdmin && (
          <div className="profile-content" key="activity-logs">
            <ActivityLogs />
          </div>
        )}
      </main>
    </div>
  );
}

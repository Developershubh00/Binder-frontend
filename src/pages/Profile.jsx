import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as authService from '../api/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormCard } from '@/components/ui/form-layout';
import './Profile.css';

export default function Profile() {
  const { user } = useAuth();
  const [orgSummary, setOrgSummary] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inviteForm, setInviteForm] = useState({
    email: '', memberName: '', tempPassword: '',
    firstName: '', lastName: '', designation: '',
  });
  const [inviteSending, setInviteSending] = useState(false);
  const [inviteMessage, setInviteMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('invite');
  const [selectedMember, setSelectedMember] = useState(null);

  const isMasterAdmin =
    user?.highest_role === 'master_admin' ||
    user?.role === 'master_admin' ||
    user?.is_primary_master;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const summary = await authService.getOrgSummary();
        setOrgSummary(summary);
        if (isMasterAdmin) {
          const list = await authService.getMembers();
          setMembers(Array.isArray(list) ? list : []);
        }
      } catch (e) {
        setError(e?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isMasterAdmin]);

  const displayName =
    user?.name ||
    [user?.first_name, user?.last_name].filter(Boolean).join(' ') ||
    user?.email ||
    'User';

  const getInitials = (name, email) => {
    if (name) return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    if (email) return email[0].toUpperCase();
    return '?';
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          <span className="profile-loading-spinner" />
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="profile-header">
        <Link to="/dashboard" className="profile-back">← Back to Dashboard</Link>
        <h1 className="profile-title">Profile</h1>
      </div>

      {error && <div className="profile-error">⚠ {error}</div>}

      {/* ── Onboarding Pending Banner ───────────────────────────── */}
      {user?.tenant_details && user.tenant_details.onboarding_completed === false && (
        <div className="profile-card profile-pending-card">
          <div className="profile-pending-badge">Action required</div>
          <h2 className="profile-section-title">Company setup pending</h2>
          <p className="profile-muted">
            Complete the 4-step onboarding to set up your company profile, units, and document config.
          </p>
          <Link to="/onboarding" className="profile-pending-link">
            Go to onboarding →
          </Link>
        </div>
      )}

      {/* ── Your Details ───────────────────────────────────────── */}
      <FormCard className="profile-card">
        <div className="profile-user-hero">
          <div className="profile-avatar-lg">
            {getInitials(displayName, user?.email)}
          </div>
          <div className="profile-user-meta">
            <p className="profile-user-name">{displayName}</p>
            <p className="profile-user-email">{user?.email}</p>
            <span className="profile-role-badge">
              {user?.highest_role || user?.role || 'member'}
            </span>
          </div>
        </div>

        <div className="profile-divider" />

        <h2 className="profile-section-title">Your details</h2>
        <dl className="profile-dl">
          <dt>Full name</dt>
          <dd>{displayName}</dd>
          <dt>Email</dt>
          <dd>{user?.email || '—'}</dd>
          <dt>Role</dt>
          <dd>{user?.highest_role || user?.role || '—'}</dd>
          {user?.designation && (
            <>
              <dt>Designation</dt>
              <dd>{user.designation}</dd>
            </>
          )}
        </dl>
      </FormCard>

      {/* ── Organization ───────────────────────────────────────── */}
      <FormCard className="profile-card">
        <h2 className="profile-section-title">Organization</h2>
        {orgSummary ? (
          <>
            <div className="profile-org-grid">
              <div className="profile-org-stat">
                <span className="profile-org-stat-value">
                  {orgSummary.member_count ?? 0}
                  {orgSummary.max_users != null ? `/${orgSummary.max_users}` : ''}
                </span>
                <span className="profile-org-stat-label">Members</span>
              </div>
              <div className="profile-org-stat">
                <span className="profile-org-stat-value">{orgSummary.tenant_id || '—'}</span>
                <span className="profile-org-stat-label">Tenant ID</span>
              </div>
            </div>
            <dl className="profile-dl" style={{ marginTop: 16 }}>
              <dt>Company</dt>
              <dd>{orgSummary.company_name || '—'}</dd>
              <dt>Owner</dt>
              <dd>{orgSummary.owner_name || '—'}</dd>
            </dl>
          </>
        ) : (
          <p className="profile-muted">You are not assigned to an organization.</p>
        )}
      </FormCard>

      {/* ── Employee Management ─────────────────────────────────── */}
      {isMasterAdmin && (
        <FormCard className="profile-card profile-members">
          <h2 className="profile-section-title">Employee management</h2>

          {/* Tab Bar */}
          <div className="profile-tab-bar">
            {[
              { id: 'invite',       label: 'Create & Invite', icon: '＋' },
              { id: 'list',         label: 'Members',         icon: '👥' },
              { id: 'roles',        label: 'Roles',           icon: '🔑' },
              { id: 'restrictions', label: 'Restrictions',    icon: '🔒' },
            ].map(tab => (
              <button
                key={tab.id}
                className={`profile-tab-btn${activeTab === tab.id ? ' active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="profile-tab-icon">{tab.icon}</span>
                <span className="profile-tab-label">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* ── TAB 1: Create & Invite ──────────────────────────── */}
          {activeTab === 'invite' && (
            <div className="profile-tab-content">
              <h3 className="profile-tab-title">Create new user &amp; send invite</h3>
              <p className="profile-section-desc">
                Create a new user account and automatically send them an invite email with login credentials.
              </p>
              <div className="profile-invite-form">
                <div className="profile-form-row">
                  <div className="profile-form-group">
                    <label className="profile-form-label">Email address *</label>
                    <Input
                      placeholder="user@company.com"
                      value={inviteForm.email}
                      onChange={(e) => setInviteForm(p => ({ ...p, email: e.target.value }))}
                    />
                  </div>
                  <div className="profile-form-group">
                    <label className="profile-form-label">Full name *</label>
                    <Input
                      placeholder="Jane Smith"
                      value={inviteForm.memberName}
                      onChange={(e) => setInviteForm(p => ({ ...p, memberName: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="profile-form-row">
                  <div className="profile-form-group">
                    <label className="profile-form-label">First name</label>
                    <Input
                      placeholder="Jane"
                      value={inviteForm.firstName}
                      onChange={(e) => setInviteForm(p => ({ ...p, firstName: e.target.value }))}
                    />
                  </div>
                  <div className="profile-form-group">
                    <label className="profile-form-label">Last name</label>
                    <Input
                      placeholder="Smith"
                      value={inviteForm.lastName}
                      onChange={(e) => setInviteForm(p => ({ ...p, lastName: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="profile-form-row">
                  <div className="profile-form-group">
                    <label className="profile-form-label">Designation</label>
                    <Input
                      placeholder="e.g. Production Manager"
                      value={inviteForm.designation}
                      onChange={(e) => setInviteForm(p => ({ ...p, designation: e.target.value }))}
                    />
                  </div>
                  <div className="profile-form-group">
                    <label className="profile-form-label">Temporary password *</label>
                    <Input
                      type="password"
                      placeholder="Min. 8 characters"
                      value={inviteForm.tempPassword}
                      onChange={(e) => setInviteForm(p => ({ ...p, tempPassword: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="profile-invite-action">
                  <Button
                    disabled={inviteSending || !inviteForm.email || !inviteForm.memberName || !inviteForm.tempPassword}
                    onClick={async () => {
                      setInviteMessage(null);
                      setInviteSending(true);
                      try {
                        await authService.createUserAndSendInvite({
                          email: inviteForm.email,
                          memberName: inviteForm.memberName,
                          firstName: inviteForm.firstName,
                          lastName: inviteForm.lastName,
                          designation: inviteForm.designation,
                          tempPassword: inviteForm.tempPassword,
                          companyName: orgSummary?.company_name,
                        });
                        setInviteMessage({ type: 'success', text: 'User created and invite email sent!' });
                        setInviteForm({ email: '', memberName: '', tempPassword: '', firstName: '', lastName: '', designation: '' });
                        const list = await authService.getMembers();
                        setMembers(Array.isArray(list) ? list : []);
                      } catch (e) {
                        setInviteMessage({ type: 'error', text: e?.message || 'Failed to create user' });
                      } finally {
                        setInviteSending(false);
                      }
                    }}
                  >
                    {inviteSending ? 'Creating & Sending...' : 'Create User & Send Invite'}
                  </Button>
                </div>
                {inviteMessage && (
                  <div className={`profile-invite-msg profile-invite-msg--${inviteMessage.type}`}>
                    {inviteMessage.type === 'success' ? '✓' : '⚠'} {inviteMessage.text}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── TAB 2: Members List ─────────────────────────────── */}
          {activeTab === 'list' && (
            <div className="profile-tab-content">
              <div className="profile-members-header">
                <div>
                  <h3 className="profile-tab-title">Team members</h3>
                  <p className="profile-section-desc">
                    {members.length} member{members.length !== 1 ? 's' : ''} in your organisation
                  </p>
                </div>
              </div>
              {members.length === 0 ? (
                <div className="profile-empty-state">
                  <span className="profile-empty-icon">👥</span>
                  <p>No members yet.</p>
                  <p className="profile-muted">Use "Create &amp; Invite" to add someone.</p>
                </div>
              ) : (
                <ul className="profile-members-ul">
                  {members.map((m) => (
                    <li key={m.id} className="profile-member-item">
                      <div className="profile-member-avatar">
                        {getInitials(m.full_name || m.name, m.email)}
                      </div>
                      <div className="profile-member-info">
                        <strong>{m.full_name || m.name || m.email}</strong>
                        <span className="profile-member-email">{m.email}</span>
                        <div className="profile-member-tags">
                          <span className="profile-member-role">{m.highest_role || m.role}</span>
                          {m.roles?.length > 0 && (
                            <span className="profile-member-depts">
                              {m.roles.map(r => r.department
                                ? `${r.role} (${r.department})`
                                : r.role).join(', ')}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        className="profile-member-manage-btn"
                        onClick={() => { setSelectedMember(m); setActiveTab('roles'); }}
                      >
                        Manage
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* ── TAB 3: Roles ────────────────────────────────────── */}
          {activeTab === 'roles' && (
            <div className="profile-tab-content">
              <h3 className="profile-tab-title">Roles &amp; permissions</h3>
              {selectedMember ? (
                <div className="profile-role-panel">
                  <div className="profile-role-panel-header">
                    <div className="profile-member-avatar">
                      {getInitials(selectedMember.full_name || selectedMember.name, selectedMember.email)}
                    </div>
                    <div>
                      <p className="profile-role-panel-name">
                        {selectedMember.full_name || selectedMember.name || selectedMember.email}
                      </p>
                      <p className="profile-role-panel-email">{selectedMember.email}</p>
                    </div>
                  </div>
                  <div className="profile-info-box">
                    <p className="profile-info-box-text">
                      📝 Role management is handled via <strong>Django Admin</strong>.<br />
                      Navigate to <code>Django Admin → Users → {selectedMember.email}</code> to assign or modify roles.
                    </p>
                  </div>
                  <button
                    className="profile-back-btn"
                    onClick={() => { setSelectedMember(null); setActiveTab('list'); }}
                  >
                    ← Back to members
                  </button>
                </div>
              ) : (
                <div className="profile-empty-state">
                  <span className="profile-empty-icon">🔑</span>
                  <p>No member selected.</p>
                  <p className="profile-muted">
                    Go to "Members" and click <strong>Manage</strong> on any member.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ── TAB 4: Restrictions ─────────────────────────────── */}
          {activeTab === 'restrictions' && (
            <div className="profile-tab-content">
              <h3 className="profile-tab-title">Department restrictions</h3>
              <p className="profile-section-desc">
                Control which departments each user can access. Managers are restricted to their assigned department only.
              </p>
              <div className="profile-info-box">
                <p className="profile-info-box-text">
                  🔒 Access controls are managed via <strong>Django Admin</strong>.<br />
                  Visit <code>Django Admin → User Roles</code> to configure department access per user.
                </p>
              </div>
              <div className="profile-restriction-examples">
                <p className="profile-restriction-examples-title">Example restrictions</p>
                <ul className="profile-restriction-list">
                  {[
                    { role: 'Raw Fabrics Manager', access: 'Raw Fabrics dept only' },
                    { role: 'Production Manager',  access: 'Production dept only' },
                    { role: 'Master Admin',         access: 'All departments' },
                  ].map(item => (
                    <li key={item.role} className="profile-restriction-item">
                      <span className="profile-restriction-role">{item.role}</span>
                      <span className="profile-restriction-arrow">→</span>
                      <span className="profile-restriction-access">{item.access}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </FormCard>
      )}
    </div>
  );
}
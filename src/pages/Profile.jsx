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
  const [inviteForm, setInviteForm] = useState({ email: '', memberName: '', tempPassword: '', firstName: '', lastName: '', designation: '' });
  const [inviteSending, setInviteSending] = useState(false);
  const [inviteMessage, setInviteMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('invite');
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberRoles, setMemberRoles] = useState([]);

  const isMasterAdmin = user?.highest_role === 'master_admin' || user?.role === 'master_admin' || user?.is_primary_master;

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

  const displayName = user?.name || [user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.email || 'User';

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <Link to="/dashboard" className="profile-back">← Back to Dashboard</Link>
        <h1 className="profile-title">Profile</h1>
      </div>

      {error && <div className="profile-error">{error}</div>}

      {user?.tenant_details && user.tenant_details.onboarding_completed === false && (
        <FormCard className="profile-card" style={{ borderColor: 'var(--primary)', background: 'var(--primary)/5' }}>
          <h2 className="profile-section-title">Company setup pending</h2>
          <p className="profile-muted">Complete the 4-step onboarding to set up your company profile, units, and document config.</p>
          <Link to="/onboarding" className="profile-back" style={{ display: 'inline-block', marginTop: 8 }}>Go to onboarding →</Link>
        </FormCard>
      )}

      <FormCard className="profile-card">
        <h2 className="profile-section-title">Your details</h2>
        <dl className="profile-dl">
          <dt>Name</dt>
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

      <FormCard className="profile-card">
        <h2 className="profile-section-title">Organization</h2>
        {orgSummary ? (
          <dl className="profile-dl">
            <dt>Company</dt>
            <dd>{orgSummary.company_name || '—'}</dd>
            <dt>Tenant ID</dt>
            <dd>{orgSummary.tenant_id || '—'}</dd>
            <dt>Owner</dt>
            <dd>{orgSummary.owner_name || '—'}</dd>
            <dt>Members in this software</dt>
            <dd>{orgSummary.member_count ?? 0}{orgSummary.max_users != null ? ` / ${orgSummary.max_users} slots` : ''}</dd>
          </dl>
        ) : (
          <p className="profile-muted">You are not assigned to an organization.</p>
        )}
      </FormCard>

      {isMasterAdmin && (
        <FormCard className="profile-card profile-members">
          <h2 className="profile-section-title">Employee management</h2>
          
          {/* Tab Navigation */}
          <div className="profile-tabs" style={{ display: 'flex', borderBottom: '1px solid #e5e5e5', marginBottom: '20px' }}>
            <button 
              onClick={() => setActiveTab('invite')}
              style={{
                padding: '10px 15px',
                border: 'none',
                background: activeTab === 'invite' ? '#007bff' : 'transparent',
                color: activeTab === 'invite' ? 'white' : '#666',
                cursor: 'pointer',
                borderBottom: activeTab === 'invite' ? '3px solid #0056b3' : 'none',
              }}
            >
              Create & Invite
            </button>
            <button 
              onClick={() => setActiveTab('list')}
              style={{
                padding: '10px 15px',
                border: 'none',
                background: activeTab === 'list' ? '#007bff' : 'transparent',
                color: activeTab === 'list' ? 'white' : '#666',
                cursor: 'pointer',
                borderBottom: activeTab === 'list' ? '3px solid #0056b3' : 'none',
              }}
            >
              Manage Members
            </button>
            <button 
              onClick={() => setActiveTab('roles')}
              style={{
                padding: '10px 15px',
                border: 'none',
                background: activeTab === 'roles' ? '#007bff' : 'transparent',
                color: activeTab === 'roles' ? 'white' : '#666',
                cursor: 'pointer',
                borderBottom: activeTab === 'roles' ? '3px solid #0056b3' : 'none',
              }}
            >
              Roles & Permissions
            </button>
            <button 
              onClick={() => setActiveTab('restrictions')}
              style={{
                padding: '10px 15px',
                border: 'none',
                background: activeTab === 'restrictions' ? '#007bff' : 'transparent',
                color: activeTab === 'restrictions' ? 'white' : '#666',
                cursor: 'pointer',
                borderBottom: activeTab === 'restrictions' ? '3px solid #0056b3' : 'none',
              }}
            >
              Restrictions
            </button>
          </div>

          {/* TAB 1: Create & Invite */}
          {activeTab === 'invite' && (
            <div className="profile-invite-section">
              <h3 className="profile-section-title">Create new user & send invite</h3>
              <p className="profile-section-desc">Create a new user account and automatically send them an invite email with login credentials.</p>
              <div className="profile-invite-form">
                <Input placeholder="Email address" value={inviteForm.email} onChange={(e) => setInviteForm((p) => ({ ...p, email: e.target.value }))} />
                <Input placeholder="Full name" value={inviteForm.memberName} onChange={(e) => setInviteForm((p) => ({ ...p, memberName: e.target.value }))} />
                <Input placeholder="First name (optional)" value={inviteForm.firstName} onChange={(e) => setInviteForm((p) => ({ ...p, firstName: e.target.value }))} />
                <Input placeholder="Last name (optional)" value={inviteForm.lastName} onChange={(e) => setInviteForm((p) => ({ ...p, lastName: e.target.value }))} />
                <Input placeholder="Designation (optional)" value={inviteForm.designation} onChange={(e) => setInviteForm((p) => ({ ...p, designation: e.target.value }))} />
                <Input type="password" placeholder="Temporary password" value={inviteForm.tempPassword} onChange={(e) => setInviteForm((p) => ({ ...p, tempPassword: e.target.value }))} />
                <Button
                  disabled={inviteSending || !inviteForm.email || !inviteForm.memberName || !inviteForm.tempPassword}
                  onClick={async () => {
                    setInviteMessage(null);
                    setInviteSending(true);
                    try {
                      const response = await authService.createUserAndSendInvite({
                        email: inviteForm.email,
                        memberName: inviteForm.memberName,
                        firstName: inviteForm.firstName,
                        lastName: inviteForm.lastName,
                        designation: inviteForm.designation,
                        tempPassword: inviteForm.tempPassword,
                        companyName: orgSummary?.company_name,
                      });
                      setInviteMessage('✓ User created and invite email sent!');
                      setInviteForm({ email: '', memberName: '', tempPassword: '', firstName: '', lastName: '', designation: '' });
                      // Refresh members list
                      const list = await authService.getMembers();
                      setMembers(Array.isArray(list) ? list : []);
                    } catch (e) {
                      setInviteMessage(e?.message || 'Failed to create user');
                    } finally {
                      setInviteSending(false);
                    }
                  }}
                >
                  {inviteSending ? 'Creating & Sending...' : 'Create User & Send Invite'}
                </Button>
              </div>
              {inviteMessage && <p style={{ marginTop: '10px', color: inviteMessage.startsWith('✓') ? 'green' : 'red' }}>{inviteMessage}</p>}
            </div>
          )}

          {/* TAB 2: Manage Members */}
          {activeTab === 'list' && (
            <div>
              <p className="profile-section-desc">View and manage all team members</p>
              <div className="profile-members-list">
                {members.length === 0 ? (
                  <p className="profile-muted">No members yet. Create one using the "Create & Invite" tab.</p>
                ) : (
                  <ul className="profile-members-ul">
                    {members.map((m) => (
                      <li key={m.id} className="profile-member-item">
                        <div>
                          <strong>{m.full_name || m.name || m.email}</strong>
                          <span className="profile-member-email">{m.email}</span>
                          <span className="profile-member-role">{m.highest_role || m.role}</span>
                          {m.roles?.length > 0 && (
                            <span className="profile-member-depts">
                              {m.roles.map((r) => r.department ? `${r.role} (${r.department})` : r.role).join(', ')}
                            </span>
                          )}
                        </div>
                        <Button onClick={() => setSelectedMember(m)} style={{ fontSize: '12px', padding: '5px 10px' }}>Manage</Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Roles & Permissions */}
          {activeTab === 'roles' && (
            <div>
              <p className="profile-section-desc">Select a member to manage their roles and permissions</p>
              {selectedMember ? (
                <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '4px' }}>
                  <h4>{selectedMember.name}</h4>
                  <p style={{ fontSize: '12px', color: '#666' }}>{selectedMember.email}</p>
                  <p style={{ marginTop: '10px', fontSize: '13px', color: '#888' }}>
                    📝 Role management currently available via Django Admin.<br/>
                    Go to Django Admin → Users → {selectedMember.email} to assign/modify roles and permissions.
                  </p>
                  <Button onClick={() => setSelectedMember(null)} style={{ fontSize: '12px', marginTop: '10px' }}>Back</Button>
                </div>
              ) : (
                <p className="profile-muted">Select a member from the "Manage Members" tab first</p>
              )}
            </div>
          )}

          {/* TAB 4: Restrictions */}
          {activeTab === 'restrictions' && (
            <div>
              <p className="profile-section-desc">Restrict user access to specific departments</p>
              <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '4px' }}>
                <p style={{ fontSize: '13px', color: '#888' }}>
                  🔒 Department restrictions and access controls are managed via Django Admin.<br/>
                  Visit Django Admin → User Roles to configure which departments each user can access.<br/><br/>
                  <strong>Examples:</strong>
                  <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
                    <li>Raw Fabrics Manager - Access only Raw Fabrics department</li>
                    <li>Production Manager - Access only Production department</li>
                    <li>Master Admin - Access all departments</li>
                  </ul>
                </p>
              </div>
            </div>
          )}
        </FormCard>
      )}
    </div>
  );
}

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
  const [inviteForm, setInviteForm] = useState({ toEmail: '', memberName: '', tempPassword: '' });
  const [inviteSending, setInviteSending] = useState(false);
  const [inviteMessage, setInviteMessage] = useState(null);

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
          <p className="profile-section-desc">
            Create, delete, and assign roles and departments. Restrict managers to their department (e.g. Raw Fabrics manager cannot access other departments).
          </p>
          <div className="profile-members-list">
            {members.length === 0 ? (
              <p className="profile-muted">No members yet. Use the backend admin or API to create users.</p>
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
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="profile-invite-section">
            <h3 className="profile-section-title">Send invite email</h3>
            <p className="profile-section-desc">Invite is sent via Google Apps Script with login link and temporary password. Create the user in Django admin or via API first, then send invite.</p>
            <div className="profile-invite-form">
              <Input placeholder="Member email" value={inviteForm.toEmail} onChange={(e) => setInviteForm((p) => ({ ...p, toEmail: e.target.value }))} />
              <Input placeholder="Member name" value={inviteForm.memberName} onChange={(e) => setInviteForm((p) => ({ ...p, memberName: e.target.value }))} />
              <Input type="password" placeholder="Temporary password" value={inviteForm.tempPassword} onChange={(e) => setInviteForm((p) => ({ ...p, tempPassword: e.target.value }))} />
              <Button
                disabled={inviteSending || !inviteForm.toEmail || !inviteForm.memberName || !inviteForm.tempPassword}
                onClick={async () => {
                  setInviteMessage(null);
                  setInviteSending(true);
                  try {
                    await authService.sendInviteEmail({
                      toEmail: inviteForm.toEmail,
                      memberName: inviteForm.memberName,
                      tempPassword: inviteForm.tempPassword,
                      companyName: orgSummary?.company_name,
                    });
                    setInviteMessage('Invite email sent.');
                    setInviteForm({ toEmail: '', memberName: '', tempPassword: '' });
                  } catch (e) {
                    setInviteMessage(e?.message || 'Failed to send invite');
                  } finally {
                    setInviteSending(false);
                  }
                }}
              >
                {inviteSending ? 'Sending...' : 'Send invite email'}
              </Button>
            </div>
            {inviteMessage && <p className={inviteMessage.startsWith('Invite') ? 'profile-invite-success' : 'profile-invite-error'}>{inviteMessage}</p>}
          </div>
          <p className="profile-muted profile-note">
            To create users and assign roles/departments/restrictions, use the Django admin or the Members API.
          </p>
        </FormCard>
      )}
    </div>
  );
}

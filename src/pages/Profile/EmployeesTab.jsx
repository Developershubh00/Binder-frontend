import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  UserPlus, Pencil, Trash2, Mail, BadgeCheck, ShieldAlert, Clock, CalendarDays,
  UserX, RotateCcw,
} from 'lucide-react';
import { getInitials } from './helpers';
import * as authService from '../../api/authService';
import { useAuth } from '../../context/AuthContext';
import ConfirmDialog from '../../components/Tasks/ConfirmDialog';
import AddUserView from './employees/AddUserView';

const roleLabel = (r) => (r ? r.replace(/_/g, ' ') : '—');

const fmtDate = (s) => {
  if (!s) return '—';
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
};

// "Employees" nav section (master-admin only): the single place to see, add, edit and
// remove users. Editing a user is where their permissions and buyer scope are set.
//
// Permissions are assigned directly per user — there are no roles or templates, so
// two people sharing a designation share nothing. Changes take effect on the
// member's next request; see auth_service/permissions/ for the enforcement side.
//
// Removal is two distinct things, deliberately kept apart:
//   Deactivate  — deny sign-in, keep the row. Reversible, history stays attributable,
//                 but the member still owns their email and username.
//   Delete      — erase the row. The only action that frees the email for re-use.
// Collapsing the two is what made a "deleted" user reappear on refresh and then
// block their own re-creation with "user with email … already exists".
export default function EmployeesTab({ members, setMembers, refreshMembers, orgSummary }) {
  const { user: currentUser } = useAuth();
  const [view, setView] = useState('list'); // 'list' | 'form'
  const [formMode, setFormMode] = useState('add'); // 'add' | 'edit'
  const [editingMember, setEditingMember] = useState(null);
  const [confirm, setConfirm] = useState(null); // { member, mode: 'deactivate' | 'delete' }
  // The set-password link for the member just created, shown until dismissed.
  const [invite, setInvite] = useState(null);

  const openAdd = () => { setFormMode('add'); setEditingMember(null); setView('form'); };
  const openEdit = (m) => { setFormMode('edit'); setEditingMember(m); setView('form'); };

  const isMasterAdmin = (m) => m.highest_role === 'master_admin' || m.role === 'master_admin';
  const activeMasters = members.filter((m) => isMasterAdmin(m) && m.is_active).length;
  const activeCount = members.filter((m) => m.is_active).length;
  const inactiveCount = members.length - activeCount;

  // The tenant owner may act on anyone, including other master admins — the only
  // hard stops are removing yourself and stranding the tenant with no master admin
  // who can sign in.
  const blockedReason = (m) => {
    if (m.id === currentUser?.id) return 'You cannot remove your own account';
    if (isMasterAdmin(m) && m.is_active && activeMasters <= 1) {
      return 'Last active master admin — promote someone else first';
    }
    return null;
  };

  const handleConfirm = async () => {
    if (!confirm) return;
    const { member: m, mode } = confirm;
    const label = m.full_name || m.name || m.email;
    setConfirm(null);
    try {
      if (mode === 'delete') {
        await authService.deleteMember(m.id, { hard: true });
        setMembers((list) => list.filter((x) => x.id !== m.id));
        toast.success(`${label} deleted — ${m.email} is free to reuse`);
        return;
      }
      await authService.deleteMember(m.id);
      // Deactivation keeps the row, so re-read the list instead of dropping the
      // card. Hiding a member the backend still returns is exactly what made the
      // tab disagree with the database.
      if (refreshMembers) await refreshMembers();
      else setMembers((list) => list.map((x) => (x.id === m.id ? { ...x, is_active: false } : x)));
      toast.success(`${label} deactivated — they can no longer sign in`);
    } catch (e) {
      toast.error(e?.message || `Could not update ${label}`);
      if (refreshMembers) await refreshMembers();
    }
  };

  const handleRestore = async (m) => {
    const label = m.full_name || m.name || m.email;
    try {
      await authService.reactivateMember(m.id);
      if (refreshMembers) await refreshMembers();
      else setMembers((list) => list.map((x) => (x.id === m.id ? { ...x, is_active: true } : x)));
      toast.success(`${label} restored`);
    } catch (e) {
      toast.error(e?.message || `Could not restore ${label}`);
    }
  };

  const handleSubmit = async (payload) => {
    const { mode, member, credentials, buyerScope, grants } = payload;

    if (mode === 'add') {
      try {
        // One call: creates the member, assigns their grid, and emails them a
        // set-password link. No password is sent — they choose their own.
        const res = await authService.createUserAndSendInvite({
          email: credentials.email,
          memberName: credentials.memberName,
          firstName: credentials.firstName,
          lastName: credentials.lastName,
          designation: credentials.designation,
          companyName: orgSummary?.company_name,
          buyerScope,
          grants,
        });

        const created = res?.data;
        // Always hand the admin the link, never only on failure. Delivery can
        // report success while the mail itself is useless — the Apps Script
        // fallback renders a fixed template that drops most of what it is sent —
        // and an admin who cannot see the link has no way to unblock the member.
        setInvite({
          email: created?.user?.email || credentials.email,
          username: created?.user?.username,
          url: created?.set_password_url,
          sent: created?.email_sent !== false,
          channel: created?.email_channel,
        });

        if (created?.email_sent === false) {
          toast.error(`${created.user?.email}: invite email failed — send them the link below`,
            { duration: 8000 });
        } else {
          toast.success(
            `User created${created?.user?.username ? ` · ${created.user.username}` : ''}`,
          );
        }

        if (refreshMembers) await refreshMembers();
        setView('list');
      } catch (e) {
        toast.error(e?.message || 'Failed to create user');
        throw e; // let the form clear its saving state
      }
      return;
    }

    // Edit — profile fields and permissions are separate endpoints. Permissions
    // go first: if they fail, the member's access is unchanged and the admin sees
    // a clear error, rather than a half-applied save where the name moved but the
    // access did not.
    try {
      await authService.setMemberPermissions(member.id, { buyerScope, grants });
      const updated = await authService.updateMember(member.id, {
        first_name: credentials.firstName,
        last_name: credentials.lastName,
        name: credentials.memberName,
        designation: credentials.designation,
      });

      setMembers((list) =>
        list.map((x) => (x.id === member.id ? { ...x, ...updated } : x)),
      );
      toast.success('User updated — new access applies on their next request');
      setView('list');
    } catch (e) {
      toast.error(e?.message || 'Failed to update user');
      throw e;
    }
  };

  // ── Add / Edit form takes over the whole tab body ──────────────
  if (view === 'form') {
    return (
      <div className="profile-content" key="employees">
        <section className="profile-section">
          <AddUserView
            mode={formMode}
            member={editingMember}
            companyName={orgSummary?.company_name}
            onCancel={() => setView('list')}
            onSubmit={handleSubmit}
          />
        </section>
      </div>
    );
  }

  return (
    <div className="profile-content" key="employees">
      <section className="profile-section">
        {/* Set-password link for the member just created. Shown whether or not
            the email reported success, because mail delivery is the one step
            here that cannot be verified from the server. */}
        {invite?.url && (
          <div
            className="mb-4 rounded-lg border p-4"
            style={{
              borderColor: invite.sent ? '#e5e7eb' : '#f94d00',
              background: invite.sent ? '#f9fafb' : '#fff7ed',
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div style={{ minWidth: 0 }}>
                <p className="text-sm font-semibold" style={{ margin: 0 }}>
                  {invite.sent
                    ? `Invite sent to ${invite.email}`
                    : `Email failed — send this link to ${invite.email} yourself`}
                </p>
                <p className="text-xs" style={{ color: '#6b7280', margin: '4px 0 0' }}>
                  {invite.username && <>Username <strong>{invite.username}</strong> · </>}
                  Link is single-use and expires in 48 hours.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setInvite(null)}
                className="text-xs"
                style={{ color: '#6b7280', flexShrink: 0 }}
              >
                Dismiss
              </button>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <input
                readOnly
                value={invite.url}
                onFocus={(e) => e.target.select()}
                className="flex-1 rounded-md border px-3 py-2 text-xs"
                style={{ borderColor: '#e5e7eb', background: '#fff', minWidth: 0 }}
              />
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(invite.url);
                  toast.success('Link copied');
                }}
                className="rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
              >
                Copy
              </button>
            </div>
          </div>
        )}

        {/* Heading + add */}
        <div className="mb-1 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="profile-section-heading" style={{ margin: 0 }}>Employee Management</h2>
            <p className="profile-section-desc" style={{ margin: '4px 0 0' }}>
              {activeCount} active
              {inactiveCount > 0 && ` · ${inactiveCount} deactivated (still holding their email)`}
              {' · '}manage access, roles and buyer scope per user.
            </p>
          </div>
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <UserPlus className="h-4 w-4" /> Add user
          </button>
        </div>

        {members.length === 0 ? (
          <div className="profile-empty" style={{ marginTop: 24 }}>
            <span className="profile-empty-icon">👥</span>
            <p>No members yet. Click <strong>Add user</strong> to create &amp; invite someone.</p>
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-2">
            {members.map((m) => {
              const name = m.full_name || m.name || m.email;
              const isMaster = isMasterAdmin(m);
              const blocked = blockedReason(m);
              return (
                <div
                  key={m.id}
                  className="group flex flex-col rounded-lg border border-[#e2e3e8] bg-card p-4 transition-colors hover:border-[#c9cad2]"
                >
                  {/* Top: identity + actions */}
                  <div className="flex items-start gap-3">
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-primary-foreground"
                      style={{ background: isMaster ? '#f94d00' : '#8a8f9a' }}
                    >
                      {getInitials(name, m.email)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-[15px] font-bold text-foreground">{name}</span>
                        {m.is_primary_master && (
                          <span className="shrink-0 rounded-full border border-primary/40 bg-primary/10 px-2 py-px text-[10px] font-semibold uppercase tracking-wide text-primary">
                            Owner
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
                        <Mail className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{m.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#e2e3e8] bg-card text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                        title="Edit user · roles & permissions"
                        onClick={() => openEdit(m)}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      {m.is_active ? (
                        <button
                          type="button"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#e2e3e8] bg-card text-muted-foreground transition-colors hover:border-[#a8842b] hover:text-[#a8842b] disabled:cursor-not-allowed disabled:opacity-40"
                          title={blocked || 'Deactivate — deny sign-in, keep their history'}
                          disabled={!!blocked}
                          onClick={() => setConfirm({ member: m, mode: 'deactivate' })}
                        >
                          <UserX className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#e2e3e8] bg-card text-muted-foreground transition-colors hover:border-[#3b8a5e] hover:text-[#3b8a5e]"
                          title="Restore — let them sign in again"
                          onClick={() => handleRestore(m)}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </button>
                      )}

                      <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#e2e3e8] bg-card text-muted-foreground transition-colors hover:border-destructive hover:text-destructive disabled:cursor-not-allowed disabled:opacity-40"
                        title={blocked || 'Delete permanently — erases the user and frees their email'}
                        disabled={!!blocked}
                        onClick={() => setConfirm({ member: m, mode: 'delete' })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Role / designation chips */}
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <span
                      className="rounded-md px-2 py-0.5 text-[11px] font-semibold capitalize"
                      style={
                        isMaster
                          ? { background: '#fdece4', color: '#f94d00' }
                          : { background: '#eef0f3', color: '#5b616e' }
                      }
                    >
                      {roleLabel(m.highest_role || m.role)}
                    </span>
                    {m.custom_role_name && (
                      <span className="rounded-md bg-[#eef0f3] px-2 py-0.5 text-[11px] font-medium text-[#5b616e]">
                        {m.custom_role_name}
                      </span>
                    )}
                    {m.designation && (
                      <span className="rounded-md bg-[#eef0f3] px-2 py-0.5 text-[11px] font-medium capitalize text-[#5b616e]">
                        {m.designation}
                      </span>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="my-3 h-px bg-[#eef0f3]" />

                  {/* Meta grid */}
                  <div className="grid grid-cols-2 gap-y-2 text-[12px]">
                    <div className="flex items-center gap-1.5">
                      {m.email_verified ? (
                        <BadgeCheck className="h-3.5 w-3.5 shrink-0" style={{ color: '#3b8a5e' }} />
                      ) : (
                        <ShieldAlert className="h-3.5 w-3.5 shrink-0" style={{ color: '#a8842b' }} />
                      )}
                      <span className="text-muted-foreground">
                        {m.email_verified ? 'Verified' : 'Unverified'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ background: m.is_active ? '#3b8a5e' : '#c24e3d' }}
                      />
                      <span className="text-muted-foreground">
                        {m.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      <span className="text-muted-foreground">Last login {fmtDate(m.last_login)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      <span className="text-muted-foreground">Joined {fmtDate(m.date_joined || m.created_at)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <ConfirmDialog
        open={!!confirm}
        title={confirm?.mode === 'delete' ? 'Delete user permanently?' : 'Deactivate user?'}
        message={(() => {
          if (!confirm) return '';
          const m = confirm.member;
          const label = m.full_name || m.name || m.email;
          if (confirm.mode === 'delete') {
            return `${label} will be erased along with their permission grants. `
              + `${m.email} becomes free to use for a new user. `
              + `Records they created stay, but are no longer attributed to them. This cannot be undone.`;
          }
          return `${label} can no longer sign in, but stays in this list as Inactive and `
            + `keeps ${m.email}. You can restore them at any time. To free the email for a `
            + `new user, delete them permanently instead.`;
        })()}
        confirmLabel={confirm?.mode === 'delete' ? 'Delete permanently' : 'Deactivate'}
        tone="danger"
        onConfirm={handleConfirm}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}

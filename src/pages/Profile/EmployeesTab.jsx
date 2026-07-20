import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  UserPlus, Pencil, Trash2, Mail, BadgeCheck, ShieldAlert, Clock, CalendarDays,
} from 'lucide-react';
import { getInitials } from './helpers';
import * as authService from '../../api/authService';
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
// delete users. Editing a user is where their roles / permissions / buyer scope are set.
// User creation hits the real endpoint; buyer-scope + permissions are UI-only for now.
export default function EmployeesTab({ members, setMembers, refreshMembers, orgSummary }) {
  const [view, setView] = useState('list'); // 'list' | 'form'
  const [formMode, setFormMode] = useState('add'); // 'add' | 'edit'
  const [editingMember, setEditingMember] = useState(null);
  const [confirmMember, setConfirmMember] = useState(null);

  const openAdd = () => { setFormMode('add'); setEditingMember(null); setView('form'); };
  const openEdit = (m) => { setFormMode('edit'); setEditingMember(m); setView('form'); };

  const handleDelete = () => {
    const m = confirmMember;
    if (!m) return;
    // UI-only until a delete-user endpoint exists.
    setMembers((list) => list.filter((x) => x.id !== m.id));
    setConfirmMember(null);
    toast.success(`${m.full_name || m.name || m.email} removed`);
  };

  const handleSubmit = async (payload) => {
    const { mode, member, credentials, buyerScope, access } = payload;
    console.log('[Profile] Save user — access + buyer scope (UI-only, wire later):', {
      mode, email: credentials.email, buyerScope, access: access.summary,
    });

    if (mode === 'add') {
      try {
        await authService.createUserAndSendInvite({
          email: credentials.email,
          memberName: credentials.memberName,
          firstName: credentials.firstName,
          lastName: credentials.lastName,
          designation: credentials.designation,
          tempPassword: credentials.tempPassword,
          companyName: orgSummary?.company_name,
        });
        toast.success('User created and invite sent');
        if (refreshMembers) await refreshMembers();
        setView('list');
      } catch (e) {
        toast.error(e?.message || 'Failed to create user');
        throw e; // let the form clear its saving state
      }
      return;
    }

    // Edit — no update-user endpoint yet, so apply optimistically in the UI.
    setMembers((list) =>
      list.map((x) =>
        x.id === member?.id
          ? {
              ...x,
              first_name: credentials.firstName,
              last_name: credentials.lastName,
              email: credentials.email,
              designation: credentials.designation,
              full_name: credentials.memberName || x.full_name,
              name: credentials.memberName || x.name,
            }
          : x,
      ),
    );
    toast.success('User updated');
    setView('list');
  };

  // ── Add / Edit form takes over the whole tab body ──────────────
  if (view === 'form') {
    return (
      <div className="profile-content" key="employees">
        <section className="profile-section">
          <AddUserView
            mode={formMode}
            member={editingMember}
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
        {/* Heading + add */}
        <div className="mb-1 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="profile-section-heading" style={{ margin: 0 }}>Employee Management</h2>
            <p className="profile-section-desc" style={{ margin: '4px 0 0' }}>
              {members.length} member{members.length === 1 ? '' : 's'} · manage access, roles and buyer scope per user.
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
              const isMaster = m.highest_role === 'master_admin' || m.role === 'master_admin';
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
                      <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#e2e3e8] bg-card text-muted-foreground transition-colors hover:border-destructive hover:text-destructive disabled:cursor-not-allowed disabled:opacity-40"
                        title={m.is_primary_master ? 'Primary master admin cannot be removed' : 'Remove user'}
                        disabled={m.is_primary_master}
                        onClick={() => setConfirmMember(m)}
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
        open={!!confirmMember}
        title="Remove user?"
        message={
          confirmMember
            ? `${confirmMember.full_name || confirmMember.name || confirmMember.email} will be removed from the members list. This is a UI-only change until a delete endpoint is available.`
            : ''
        }
        confirmLabel="Remove"
        tone="danger"
        onConfirm={handleDelete}
        onCancel={() => setConfirmMember(null)}
      />
    </div>
  );
}

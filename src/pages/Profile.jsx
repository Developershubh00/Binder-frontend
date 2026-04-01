// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import * as authService from '../api/authService';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { FormCard } from '@/components/ui/form-layout';
// import './Profile.css';

// export default function Profile() {
//   const { user } = useAuth();
//   const [orgSummary, setOrgSummary] = useState(null);
//   const [members, setMembers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [inviteForm, setInviteForm] = useState({ email: '', memberName: '', tempPassword: '', firstName: '', lastName: '', designation: '' });
//   const [inviteSending, setInviteSending] = useState(false);
//   const [inviteMessage, setInviteMessage] = useState(null);
//   const [activeTab, setActiveTab] = useState('invite');
//   const [selectedMember, setSelectedMember] = useState(null);
//   const [memberRoles, setMemberRoles] = useState([]);

//   const isMasterAdmin = user?.highest_role === 'master_admin' || user?.role === 'master_admin' || user?.is_primary_master;

//   useEffect(() => {
//     const load = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const summary = await authService.getOrgSummary();
//         setOrgSummary(summary);
//         if (isMasterAdmin) {
//           const list = await authService.getMembers();
//           setMembers(Array.isArray(list) ? list : []);
//         }
//       } catch (e) {
//         setError(e?.message || 'Failed to load profile');
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, [isMasterAdmin]);

//   const displayName = user?.name || [user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.email || 'User';

//   if (loading) {
//     return (
//       <div className="profile-page">
//         <div className="profile-loading">Loading...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="profile-page">
//       <div className="profile-header">
//         <Link to="/dashboard" className="profile-back">← Back to Dashboard</Link>
//         <h1 className="profile-title">Profile</h1>
//       </div>

//       {error && <div className="profile-error">{error}</div>}

//       {user?.tenant_details && user.tenant_details.onboarding_completed === false && (
//         <FormCard className="profile-card" style={{ borderColor: 'var(--primary)', background: 'var(--primary)/5' }}>
//           <h2 className="profile-section-title">Company setup pending</h2>
//           <p className="profile-muted">Complete the 4-step onboarding to set up your company profile, units, and document config.</p>
//           <Link to="/onboarding" className="profile-back" style={{ display: 'inline-block', marginTop: 8 }}>Go to onboarding →</Link>
//         </FormCard>
//       )}

//       <FormCard className="profile-card">
//         <h2 className="profile-section-title">Your details</h2>
//         <dl className="profile-dl">
//           <dt>Name</dt>
//           <dd>{displayName}</dd>
//           <dt>Email</dt>
//           <dd>{user?.email || '—'}</dd>
//           <dt>Role</dt>
//           <dd>{user?.highest_role || user?.role || '—'}</dd>
//           {user?.designation && (
//             <>
//               <dt>Designation</dt>
//               <dd>{user.designation}</dd>
//             </>
//           )}
//         </dl>
//       </FormCard>

//       <FormCard className="profile-card">
//         <h2 className="profile-section-title">Organization</h2>
//         {orgSummary ? (
//           <dl className="profile-dl">
//             <dt>Company</dt>
//             <dd>{orgSummary.company_name || '—'}</dd>
//             <dt>Tenant ID</dt>
//             <dd>{orgSummary.tenant_id || '—'}</dd>
//             <dt>Owner</dt>
//             <dd>{orgSummary.owner_name || '—'}</dd>
//             <dt>Members in this software</dt>
//             <dd>{orgSummary.member_count ?? 0}{orgSummary.max_users != null ? ` / ${orgSummary.max_users} slots` : ''}</dd>
//           </dl>
//         ) : (
//           <p className="profile-muted">You are not assigned to an organization.</p>
//         )}
//       </FormCard>

//       {isMasterAdmin && (
//         <FormCard className="profile-card profile-members">
//           <h2 className="profile-section-title">Employee management</h2>
          
//           {/* Tab Navigation */}
//           <div className="profile-tabs" style={{ display: 'flex', borderBottom: '1px solid #e5e5e5', marginBottom: '20px' }}>
//             <button 
//               onClick={() => setActiveTab('invite')}
//               style={{
//                 padding: '10px 15px',
//                 border: 'none',
//                 background: activeTab === 'invite' ? '#007bff' : 'transparent',
//                 color: activeTab === 'invite' ? 'white' : '#666',
//                 cursor: 'pointer',
//                 borderBottom: activeTab === 'invite' ? '3px solid #0056b3' : 'none',
//               }}
//             >
//               Create & Invite
//             </button>
//             <button 
//               onClick={() => setActiveTab('list')}
//               style={{
//                 padding: '10px 15px',
//                 border: 'none',
//                 background: activeTab === 'list' ? '#007bff' : 'transparent',
//                 color: activeTab === 'list' ? 'white' : '#666',
//                 cursor: 'pointer',
//                 borderBottom: activeTab === 'list' ? '3px solid #0056b3' : 'none',
//               }}
//             >
//               Manage Members
//             </button>
//             <button 
//               onClick={() => setActiveTab('roles')}
//               style={{
//                 padding: '10px 15px',
//                 border: 'none',
//                 background: activeTab === 'roles' ? '#007bff' : 'transparent',
//                 color: activeTab === 'roles' ? 'white' : '#666',
//                 cursor: 'pointer',
//                 borderBottom: activeTab === 'roles' ? '3px solid #0056b3' : 'none',
//               }}
//             >
//               Roles & Permissions
//             </button>
//             <button 
//               onClick={() => setActiveTab('restrictions')}
//               style={{
//                 padding: '10px 15px',
//                 border: 'none',
//                 background: activeTab === 'restrictions' ? '#007bff' : 'transparent',
//                 color: activeTab === 'restrictions' ? 'white' : '#666',
//                 cursor: 'pointer',
//                 borderBottom: activeTab === 'restrictions' ? '3px solid #0056b3' : 'none',
//               }}
//             >
//               Restrictions
//             </button>
//           </div>

//           {/* TAB 1: Create & Invite */}
//           {activeTab === 'invite' && (
//             <div className="profile-invite-section">
//               <h3 className="profile-section-title">Create new user & send invite</h3>
//               <p className="profile-section-desc">Create a new user account and automatically send them an invite email with login credentials.</p>
//               <div className="profile-invite-form">
//                 <Input placeholder="Email address" value={inviteForm.email} onChange={(e) => setInviteForm((p) => ({ ...p, email: e.target.value }))} />
//                 <Input placeholder="Full name" value={inviteForm.memberName} onChange={(e) => setInviteForm((p) => ({ ...p, memberName: e.target.value }))} />
//                 <Input placeholder="First name (optional)" value={inviteForm.firstName} onChange={(e) => setInviteForm((p) => ({ ...p, firstName: e.target.value }))} />
//                 <Input placeholder="Last name (optional)" value={inviteForm.lastName} onChange={(e) => setInviteForm((p) => ({ ...p, lastName: e.target.value }))} />
//                 <Input placeholder="Designation (optional)" value={inviteForm.designation} onChange={(e) => setInviteForm((p) => ({ ...p, designation: e.target.value }))} />
//                 <Input type="password" placeholder="Temporary password" value={inviteForm.tempPassword} onChange={(e) => setInviteForm((p) => ({ ...p, tempPassword: e.target.value }))} />
//                 <Button
//                   disabled={inviteSending || !inviteForm.email || !inviteForm.memberName || !inviteForm.tempPassword}
//                   onClick={async () => {
//                     setInviteMessage(null);
//                     setInviteSending(true);
//                     try {
//                       const response = await authService.createUserAndSendInvite({
//                         email: inviteForm.email,
//                         memberName: inviteForm.memberName,
//                         firstName: inviteForm.firstName,
//                         lastName: inviteForm.lastName,
//                         designation: inviteForm.designation,
//                         tempPassword: inviteForm.tempPassword,
//                         companyName: orgSummary?.company_name,
//                       });
//                       setInviteMessage('✓ User created and invite email sent!');
//                       setInviteForm({ email: '', memberName: '', tempPassword: '', firstName: '', lastName: '', designation: '' });
//                       // Refresh members list
//                       const list = await authService.getMembers();
//                       setMembers(Array.isArray(list) ? list : []);
//                     } catch (e) {
//                       setInviteMessage(e?.message || 'Failed to create user');
//                     } finally {
//                       setInviteSending(false);
//                     }
//                   }}
//                 >
//                   {inviteSending ? 'Creating & Sending...' : 'Create User & Send Invite'}
//                 </Button>
//               </div>
//               {inviteMessage && <p style={{ marginTop: '10px', color: inviteMessage.startsWith('✓') ? 'green' : 'red' }}>{inviteMessage}</p>}
//             </div>
//           )}

//           {/* TAB 2: Manage Members */}
//           {activeTab === 'list' && (
//             <div>
//               <p className="profile-section-desc">View and manage all team members</p>
//               <div className="profile-members-list">
//                 {members.length === 0 ? (
//                   <p className="profile-muted">No members yet. Create one using the "Create & Invite" tab.</p>
//                 ) : (
//                   <ul className="profile-members-ul">
//                     {members.map((m) => (
//                       <li key={m.id} className="profile-member-item">
//                         <div>
//                           <strong>{m.full_name || m.name || m.email}</strong>
//                           <span className="profile-member-email">{m.email}</span>
//                           <span className="profile-member-role">{m.highest_role || m.role}</span>
//                           {m.roles?.length > 0 && (
//                             <span className="profile-member-depts">
//                               {m.roles.map((r) => r.department ? `${r.role} (${r.department})` : r.role).join(', ')}
//                             </span>
//                           )}
//                         </div>
//                         <Button onClick={() => setSelectedMember(m)} style={{ fontSize: '12px', padding: '5px 10px' }}>Manage</Button>
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* TAB 3: Roles & Permissions */}
//           {activeTab === 'roles' && (
//             <div>
//               <p className="profile-section-desc">Select a member to manage their roles and permissions</p>
//               {selectedMember ? (
//                 <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '4px' }}>
//                   <h4>{selectedMember.name}</h4>
//                   <p style={{ fontSize: '12px', color: '#666' }}>{selectedMember.email}</p>
//                   <p style={{ marginTop: '10px', fontSize: '13px', color: '#888' }}>
//                     📝 Role management currently available via Django Admin.<br/>
//                     Go to Django Admin → Users → {selectedMember.email} to assign/modify roles and permissions.
//                   </p>
//                   <Button onClick={() => setSelectedMember(null)} style={{ fontSize: '12px', marginTop: '10px' }}>Back</Button>
//                 </div>
//               ) : (
//                 <p className="profile-muted">Select a member from the "Manage Members" tab first</p>
//               )}
//             </div>
//           )}

//           {/* TAB 4: Restrictions */}
//           {activeTab === 'restrictions' && (
//             <div>
//               <p className="profile-section-desc">Restrict user access to specific departments</p>
//               <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '4px' }}>
//                 <p style={{ fontSize: '13px', color: '#888' }}>
//                   🔒 Department restrictions and access controls are managed via Django Admin.<br/>
//                   Visit Django Admin → User Roles to configure which departments each user can access.<br/><br/>
//                   <strong>Examples:</strong>
//                   <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
//                     <li>Raw Fabrics Manager - Access only Raw Fabrics department</li>
//                     <li>Production Manager - Access only Production department</li>
//                     <li>Master Admin - Access all departments</li>
//                   </ul>
//                 </p>
//               </div>
//             </div>
//           )}
//         </FormCard>
//       )}
//     </div>
//   );
// }
// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import * as authService from '../api/authService';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import './Profile.css';

// export default function Profile() {
//   const { user } = useAuth();
//   const [orgSummary, setOrgSummary]       = useState(null);
//   const [members, setMembers]             = useState([]);
//   const [loading, setLoading]             = useState(true);
//   const [error, setError]                 = useState(null);
//   const [activeNav, setActiveNav]         = useState('account');
//   const [activeTab, setActiveTab]         = useState('invite');
//   const [selectedMember, setSelectedMember] = useState(null);
//   const [inviteForm, setInviteForm]       = useState({
//     email: '', memberName: '', tempPassword: '',
//     firstName: '', lastName: '', designation: '',
//   });
//   const [inviteSending, setInviteSending] = useState(false);
//   const [inviteMessage, setInviteMessage] = useState(null);

//   const isMasterAdmin =
//     user?.highest_role === 'master_admin' ||
//     user?.role         === 'master_admin' ||
//     user?.is_primary_master;

//   useEffect(() => {
//     (async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const summary = await authService.getOrgSummary();
//         setOrgSummary(summary);
//         if (isMasterAdmin) {
//           const list = await authService.getMembers();
//           setMembers(Array.isArray(list) ? list : []);
//         }
//       } catch (e) {
//         setError(e?.message || 'Failed to load profile');
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [isMasterAdmin]);

//   const displayName =
//     user?.name ||
//     [user?.first_name, user?.last_name].filter(Boolean).join(' ') ||
//     user?.email || 'User';

//   const initials = (name, email) => {
//     if (name)  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
//     if (email) return email[0].toUpperCase();
//     return '?';
//   };

//   const navItems = [
//     { id: 'account',  label: 'Account'      },
//     { id: 'org',      label: 'Organization' },
//     ...(isMasterAdmin ? [{ id: 'employees', label: 'Employees' }] : []),
//   ];

//   if (loading) return (
//     <div className="profile-loading-screen">
//       <span className="profile-spinner" /> Loading…
//     </div>
//   );

//   return (
//     <div className="profile-root">

//       {/* ══════════════════════ SIDEBAR ══════════════════════════ */}
//       <aside className="profile-sidebar">
//         {/* Decorative bg shape */}
//         <div className="profile-sidebar-bg" />

//         {/* Avatar */}
//         <div className="profile-sidebar-top">
//           <div className="profile-avatar-wrap">
//             <div className="profile-avatar-circle">
//               {initials(displayName, user?.email)}
//             </div>
//           </div>
//           <p className="profile-sidebar-name">{displayName}</p>
//           <p className="profile-sidebar-role">
//             {user?.highest_role || user?.role || 'member'}
//           </p>
//         </div>

//         {/* Nav */}
//         <nav className="profile-nav">
//           {navItems.map(item => (
//             <button
//               key={item.id}
//               className={`profile-nav-item${activeNav === item.id ? ' profile-nav-item--active' : ''}`}
//               onClick={() => setActiveNav(item.id)}
//             >
//               {item.label}
//             </button>
//           ))}
//           <div className="profile-nav-divider" />
//           <Link to="/dashboard" className="profile-nav-back">← Dashboard</Link>
//         </nav>
//       </aside>

//       {/* ══════════════════════ MAIN CONTENT ═════════════════════ */}
//       <main className="profile-main">

//         {error && <div className="profile-error">⚠ {error}</div>}

//         {/* Onboarding pending banner */}
//         {user?.tenant_details?.onboarding_completed === false && (
//           <div className="profile-banner">
//             <div>
//               <span className="profile-banner-badge">Action required</span>
//               <p className="profile-banner-text">
//                 Complete the 4-step onboarding to set up your company profile.
//               </p>
//             </div>
//             <Link to="/onboarding" className="profile-banner-btn">Set up →</Link>
//           </div>
//         )}

//         {/* ── ACCOUNT ──────────────────────────────────────────── */}
//         {activeNav === 'account' && (
//           <div className="profile-content" key="account">
//             {/* Account section */}
//             <section className="profile-section">
//               <h2 className="profile-section-heading">Account</h2>
//               <div className="profile-form-grid">
//                 <div className="profile-field">
//                   <label className="profile-label">Name</label>
//                   <div className="profile-input-static">{displayName}</div>
//                 </div>
//                 <div className="profile-field">
//                   <label className="profile-label">Email</label>
//                   <div className="profile-input-static">{user?.email || '—'}</div>
//                 </div>
//                 <div className="profile-field">
//                   <label className="profile-label">Role</label>
//                   <div className="profile-input-static">{user?.highest_role || user?.role || '—'}</div>
//                 </div>
//                 {user?.designation && (
//                   <div className="profile-field">
//                     <label className="profile-label">Designation</label>
//                     <div className="profile-input-static">{user.designation}</div>
//                   </div>
//                 )}
//               </div>
//             </section>

//             <div className="profile-divider" />

//             {/* Change Password section */}
//             <section className="profile-section">
//               <h2 className="profile-section-heading">Your Password</h2>
//               <p className="profile-section-desc">To change your password, contact your administrator or use the forgot password flow on the login screen.</p>
//               <div className="profile-form-grid">
//                 <div className="profile-field">
//                   <label className="profile-label">New Password</label>
//                   <input type="password" className="profile-input" placeholder="••••••••••" disabled />
//                 </div>
//                 <div className="profile-field">
//                   <label className="profile-label">Repeat New Password</label>
//                   <input type="password" className="profile-input" placeholder="••••••••••" disabled />
//                 </div>
//               </div>
//               <Button disabled className="profile-btn profile-btn--disabled">
//                 Update Password
//               </Button>
//             </section>
//           </div>
//         )}

//         {/* ── ORGANIZATION ─────────────────────────────────────── */}
//         {activeNav === 'org' && (
//           <div className="profile-content" key="org">
//             <section className="profile-section">
//               <h2 className="profile-section-heading">Organization</h2>

//               {orgSummary ? (
//                 <>
//                   <div className="profile-stat-row">
//                     <div className="profile-stat-card">
//                       <span className="profile-stat-val">
//                         {orgSummary.member_count ?? 0}
//                         {orgSummary.max_users != null ? `/${orgSummary.max_users}` : ''}
//                       </span>
//                       <span className="profile-stat-lbl">Members / Slots</span>
//                     </div>
//                     <div className="profile-stat-card">
//                       <span className="profile-stat-val profile-stat-val--sm">
//                         {orgSummary.tenant_id || '—'}
//                       </span>
//                       <span className="profile-stat-lbl">Tenant ID</span>
//                     </div>
//                   </div>

//                   <div className="profile-form-grid profile-form-grid--mt">
//                     <div className="profile-field">
//                       <label className="profile-label">Company name</label>
//                       <div className="profile-input-static">{orgSummary.company_name || '—'}</div>
//                     </div>
//                     <div className="profile-field">
//                       <label className="profile-label">Owner</label>
//                       <div className="profile-input-static">{orgSummary.owner_name || '—'}</div>
//                     </div>
//                   </div>
//                 </>
//               ) : (
//                 <div className="profile-empty">
//                   <span className="profile-empty-icon">🏢</span>
//                   <p>You are not assigned to an organization.</p>
//                 </div>
//               )}
//             </section>
//           </div>
//         )}

//         {/* ── EMPLOYEES ────────────────────────────────────────── */}
//         {activeNav === 'employees' && isMasterAdmin && (
//           <div className="profile-content" key="employees">
//             <section className="profile-section">
//               <h2 className="profile-section-heading">Employee Management</h2>

//               {/* Sub-tabs */}
//               <div className="profile-tabs">
//                 {[
//                   { id: 'invite',       label: 'Create & Invite' },
//                   { id: 'list',         label: 'Members'         },
//                   { id: 'roles',        label: 'Roles'           },
//                   { id: 'restrictions', label: 'Restrictions'    },
//                 ].map(t => (
//                   <button
//                     key={t.id}
//                     className={`profile-tab${activeTab === t.id ? ' profile-tab--active' : ''}`}
//                     onClick={() => setActiveTab(t.id)}
//                   >
//                     {t.label}
//                   </button>
//                 ))}
//               </div>

//               {/* ── Create & Invite ─────────────────────────────── */}
//               {activeTab === 'invite' && (
//                 <div className="profile-tab-body">
//                   <h3 className="profile-tab-title">Create new user &amp; send invite</h3>
//                   <p className="profile-section-desc">
//                     Create a user account and send them login credentials via email.
//                   </p>
//                   <div className="profile-form-grid">
//                     <div className="profile-field">
//                       <label className="profile-label">Email address *</label>
//                       <input className="profile-input" placeholder="user@company.com"
//                         value={inviteForm.email}
//                         onChange={e => setInviteForm(p => ({ ...p, email: e.target.value }))} />
//                     </div>
//                     <div className="profile-field">
//                       <label className="profile-label">Full name *</label>
//                       <input className="profile-input" placeholder="Jane Smith"
//                         value={inviteForm.memberName}
//                         onChange={e => setInviteForm(p => ({ ...p, memberName: e.target.value }))} />
//                     </div>
//                     <div className="profile-field">
//                       <label className="profile-label">First name</label>
//                       <input className="profile-input" placeholder="Jane"
//                         value={inviteForm.firstName}
//                         onChange={e => setInviteForm(p => ({ ...p, firstName: e.target.value }))} />
//                     </div>
//                     <div className="profile-field">
//                       <label className="profile-label">Last name</label>
//                       <input className="profile-input" placeholder="Smith"
//                         value={inviteForm.lastName}
//                         onChange={e => setInviteForm(p => ({ ...p, lastName: e.target.value }))} />
//                     </div>
//                     <div className="profile-field">
//                       <label className="profile-label">Designation</label>
//                       <input className="profile-input" placeholder="e.g. Production Manager"
//                         value={inviteForm.designation}
//                         onChange={e => setInviteForm(p => ({ ...p, designation: e.target.value }))} />
//                     </div>
//                     <div className="profile-field">
//                       <label className="profile-label">Temporary password *</label>
//                       <input type="password" className="profile-input" placeholder="Min. 8 characters"
//                         value={inviteForm.tempPassword}
//                         onChange={e => setInviteForm(p => ({ ...p, tempPassword: e.target.value }))} />
//                     </div>
//                   </div>

//                   <Button
//                     className="profile-btn"
//                     disabled={inviteSending || !inviteForm.email || !inviteForm.memberName || !inviteForm.tempPassword}
//                     onClick={async () => {
//                       setInviteMessage(null);
//                       setInviteSending(true);
//                       try {
//                         await authService.createUserAndSendInvite({
//                           email: inviteForm.email, memberName: inviteForm.memberName,
//                           firstName: inviteForm.firstName, lastName: inviteForm.lastName,
//                           designation: inviteForm.designation, tempPassword: inviteForm.tempPassword,
//                           companyName: orgSummary?.company_name,
//                         });
//                         setInviteMessage({ ok: true, text: 'User created and invite sent!' });
//                         setInviteForm({ email:'', memberName:'', tempPassword:'', firstName:'', lastName:'', designation:'' });
//                         const list = await authService.getMembers();
//                         setMembers(Array.isArray(list) ? list : []);
//                       } catch (e) {
//                         setInviteMessage({ ok: false, text: e?.message || 'Failed to create user' });
//                       } finally {
//                         setInviteSending(false);
//                       }
//                     }}
//                   >
//                     {inviteSending ? 'Creating & Sending…' : 'Create User & Send Invite'}
//                   </Button>

//                   {inviteMessage && (
//                     <div className={`profile-msg${inviteMessage.ok ? ' profile-msg--ok' : ' profile-msg--err'}`}>
//                       {inviteMessage.ok ? '✓' : '⚠'} {inviteMessage.text}
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* ── Members List ────────────────────────────────── */}
//               {activeTab === 'list' && (
//                 <div className="profile-tab-body">
//                   <h3 className="profile-tab-title">
//                     Team members
//                     <span className="profile-count">{members.length}</span>
//                   </h3>
//                   {members.length === 0 ? (
//                     <div className="profile-empty">
//                       <span className="profile-empty-icon">👥</span>
//                       <p>No members yet. Use <strong>Create &amp; Invite</strong> to add someone.</p>
//                     </div>
//                   ) : (
//                     <ul className="profile-member-list">
//                       {members.map(m => (
//                         <li key={m.id} className="profile-member">
//                           <div className="profile-member-av">{initials(m.full_name || m.name, m.email)}</div>
//                           <div className="profile-member-info">
//                             <strong>{m.full_name || m.name || m.email}</strong>
//                             <span className="profile-member-email">{m.email}</span>
//                             <div className="profile-member-tags">
//                               <span className="profile-chip">{m.highest_role || m.role}</span>
//                               {m.roles?.length > 0 && (
//                                 <span className="profile-chip profile-chip--muted">
//                                   {m.roles.map(r => r.department ? `${r.role} (${r.department})` : r.role).join(', ')}
//                                 </span>
//                               )}
//                             </div>
//                           </div>
//                           <button className="profile-manage-btn"
//                             onClick={() => { setSelectedMember(m); setActiveTab('roles'); }}>
//                             Manage
//                           </button>
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </div>
//               )}

//               {/* ── Roles ───────────────────────────────────────── */}
//               {activeTab === 'roles' && (
//                 <div className="profile-tab-body">
//                   <h3 className="profile-tab-title">Roles &amp; permissions</h3>
//                   {selectedMember ? (
//                     <>
//                       <div className="profile-member profile-member--panel">
//                         <div className="profile-member-av">
//                           {initials(selectedMember.full_name || selectedMember.name, selectedMember.email)}
//                         </div>
//                         <div className="profile-member-info">
//                           <strong>{selectedMember.full_name || selectedMember.name || selectedMember.email}</strong>
//                           <span className="profile-member-email">{selectedMember.email}</span>
//                         </div>
//                       </div>
//                       <div className="profile-info-box">
//                         <p>📝 Role management is handled via <strong>Django Admin</strong>.<br />
//                         Go to <code>Django Admin → Users → {selectedMember.email}</code> to assign or modify roles.</p>
//                       </div>
//                       <button className="profile-ghost-btn"
//                         onClick={() => { setSelectedMember(null); setActiveTab('list'); }}>
//                         ← Back to members
//                       </button>
//                     </>
//                   ) : (
//                     <div className="profile-empty">
//                       <span className="profile-empty-icon">🔑</span>
//                       <p>Select a member from <strong>Members</strong> tab and click <strong>Manage</strong>.</p>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* ── Restrictions ────────────────────────────────── */}
//               {activeTab === 'restrictions' && (
//                 <div className="profile-tab-body">
//                   <h3 className="profile-tab-title">Department restrictions</h3>
//                   <p className="profile-section-desc">Control which departments each user can access.</p>
//                   <div className="profile-info-box">
//                     <p>🔒 Managed via <strong>Django Admin → User Roles</strong>.</p>
//                   </div>
//                   <p className="profile-label" style={{marginTop:20,marginBottom:10}}>Example restrictions</p>
//                   <ul className="profile-restriction-list">
//                     {[
//                       ['Raw Fabrics Manager', 'Raw Fabrics dept only'],
//                       ['Production Manager',  'Production dept only' ],
//                       ['Master Admin',        'All departments'      ],
//                     ].map(([role, access]) => (
//                       <li key={role} className="profile-restriction-item">
//                         <span className="profile-restriction-role">{role}</span>
//                         <span className="profile-restriction-arrow">→</span>
//                         <span className="profile-restriction-access">{access}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </section>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as authService from '../api/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import './Profile.css';

export default function Profile() {
  const { user } = useAuth();
  const [orgSummary, setOrgSummary]       = useState(null);
  const [members, setMembers]             = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [activeNav, setActiveNav]         = useState('account');
  const [activeTab, setActiveTab]         = useState('list');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [inviteForm, setInviteForm]       = useState({
    email: '', memberName: '', tempPassword: '',
    firstName: '', lastName: '', designation: '',
  });
  const [inviteSending, setInviteSending] = useState(false);
  const [inviteMessage, setInviteMessage] = useState(null);
  const [featureOverrides, setFeatureOverrides] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [memberPermissionDraft, setMemberPermissionDraft] = useState({ role: '', module: '', permission_level: 'view' });

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
            promises.push(authService.getTenantActivityLogs());
          }
        }
        const results = await Promise.all(promises);
        setOrgSummary(results[0]);
        if (isMasterAdmin) {
          setMembers(Array.isArray(results[1]) ? results[1] : []);
          if (user?.tenant) {
            setFeatureOverrides(Array.isArray(results[2]) ? results[2] : []);
            setActivityLogs(Array.isArray(results[3]) ? results[3] : []);
          }
        }
      } catch (e) {
        setError(e?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    })();
  }, [isMasterAdmin]);

  const displayName =
    user?.name ||
    [user?.first_name, user?.last_name].filter(Boolean).join(' ') ||
    user?.email || 'User';

  const initials = (name, email) => {
    if (name)  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    if (email) return email[0].toUpperCase();
    return '?';
  };

  const navItems = [
    { id: 'account',  label: 'Account'      },
    { id: 'org',      label: 'Organization' },
    ...(isMasterAdmin ? [{ id: 'employees', label: 'Employees' }] : []),
    ...(isMasterAdmin ? [{ id: 'features', label: 'Features' }] : []),
    ...(isMasterAdmin ? [{ id: 'roles-permissions', label: 'Roles & Permissions' }] : []),
    ...(isMasterAdmin ? [{ id: 'activity-logs', label: 'Activity Logs' }] : []),
  ];

  const exportActivityLogsCsv = () => {
    if (!activityLogs.length) return;
    const headers = ['timestamp', 'user_email', 'action', 'entity_type', 'entity_id', 'summary', 'ip_address'];
    const rows = activityLogs.map((log) => ([
      log.timestamp || '',
      log.user_email || '',
      log.action || '',
      log.entity_type || '',
      log.entity_id || '',
      (log.summary || '').replaceAll('"', '""'),
      log.ip_address || '',
    ]));
    const csv = [headers.join(','), ...rows.map((r) => r.map((v) => `"${v}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tenant_activity_logs.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return (
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

  return (
    <div className="profile-root">

      {/* ══════════════════════ SIDEBAR ══════════════════════════ */}
      <aside className="profile-sidebar">
        {/* Decorative bg shape */}
        <div className="profile-sidebar-bg" />

        {/* Avatar */}
        <div className="profile-sidebar-top">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar-circle">
              {initials(displayName, user?.email)}
            </div>
          </div>
          <p className="profile-sidebar-name">{displayName}</p>
          <p className="profile-sidebar-role">
            {user?.highest_role || user?.role || 'member'}
          </p>
        </div>

        {/* Nav */}
        <nav className="profile-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`profile-nav-item${activeNav === item.id ? ' profile-nav-item--active' : ''}`}
              onClick={() => setActiveNav(item.id)}
            >
              {item.label}
            </button>
          ))}
          <div className="profile-nav-divider" />
          <Link to="/dashboard" className="profile-nav-back">← Dashboard</Link>
        </nav>
      </aside>

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

        {/* ── ACCOUNT ──────────────────────────────────────────── */}
        {activeNav === 'account' && (
          <div className="profile-content" key="account">
            {/* Account section */}
            <section className="profile-section">
              <h2 className="profile-section-heading">Account</h2>
              <div className="profile-form-grid">
                <div className="profile-field">
                  <label className="profile-label">Name</label>
                  <div className="profile-input-static">{displayName}</div>
                </div>
                <div className="profile-field">
                  <label className="profile-label">Email</label>
                  <div className="profile-input-static">{user?.email || '—'}</div>
                </div>
                <div className="profile-field">
                  <label className="profile-label">Role</label>
                  <div className="profile-input-static">{user?.highest_role || user?.role || '—'}</div>
                </div>
                {user?.designation && (
                  <div className="profile-field">
                    <label className="profile-label">Designation</label>
                    <div className="profile-input-static">{user.designation}</div>
                  </div>
                )}
              </div>
            </section>

            <div className="profile-divider" />

            {/* Change Password section */}
            <section className="profile-section">
              <h2 className="profile-section-heading">Your Password</h2>
              <p className="profile-section-desc">To change your password, contact your administrator or use the forgot password flow on the login screen.</p>
              <div className="profile-form-grid">
                <div className="profile-field">
                  <label className="profile-label">New Password</label>
                  <input type="password" className="profile-input" placeholder="••••••••••" disabled />
                </div>
                <div className="profile-field">
                  <label className="profile-label">Repeat New Password</label>
                  <input type="password" className="profile-input" placeholder="••••••••••" disabled />
                </div>
              </div>
              <Button disabled className="profile-btn profile-btn--disabled">
                Update Password
              </Button>
            </section>
          </div>
        )}

        {/* ── ORGANIZATION ─────────────────────────────────────── */}
        {activeNav === 'org' && (
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
        )}

        {/* ── EMPLOYEES ────────────────────────────────────────── */}
        {activeNav === 'employees' && isMasterAdmin && (
          <div className="profile-content" key="employees">
            <section className="profile-section">
              <h2 className="profile-section-heading">Employee Management</h2>

              {/* Sub-tabs */}
              <div className="profile-tabs">
                {[
                  { id: 'list',         label: 'Members'         },
                  { id: 'roles',        label: 'Roles'           },
                  { id: 'restrictions', label: 'Restrictions'    },
                ].map(t => (
                  <button
                    key={t.id}
                    className={`profile-tab${activeTab === t.id ? ' profile-tab--active' : ''}`}
                    onClick={() => setActiveTab(t.id)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* ── Members List ────────────────────────────────── */}
              {activeTab === 'list' && (
                <div className="profile-tab-body">
                  <h3 className="profile-tab-title">
                    Team members
                    <span className="profile-count">{members.length}</span>
                    <button
                      className="profile-add-btn"
                      title="Create & Invite"
                      onClick={() => { setShowInviteModal(true); setInviteForm({ email:'', memberName:'', tempPassword:'', firstName:'', lastName:'', designation:'' }); setInviteMessage(null); }}
                    >+</button>
                  </h3>
                  {members.length === 0 ? (
                    <div className="profile-empty">
                      <span className="profile-empty-icon">👥</span>
                      <p>No members yet. Click <strong>+</strong> to create &amp; invite someone.</p>
                    </div>
                  ) : (
                    <ul className="profile-member-list">
                      {members.map(m => (
                        <li key={m.id} className="profile-member">
                          <div className="profile-member-av">{initials(m.full_name || m.name, m.email)}</div>
                          <div className="profile-member-info">
                            <strong>{m.full_name || m.name || m.email}</strong>
                            <span className="profile-member-email">{m.email}</span>
                            <div className="profile-member-tags">
                              <span className="profile-chip">{m.highest_role || m.role}</span>
                              {m.roles?.length > 0 && (
                                <span className="profile-chip profile-chip--muted">
                                  {m.roles.map(r => r.department ? `${r.role} (${r.department})` : r.role).join(', ')}
                                </span>
                              )}
                            </div>
                          </div>
                          <button className="profile-manage-btn"
                            onClick={() => { setSelectedMember(m); setActiveTab('roles'); }}>
                            Manage
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                </div>
              )}

              {/* ── Roles ───────────────────────────────────────── */}
              {activeTab === 'roles' && (
                <div className="profile-tab-body">
                  <h3 className="profile-tab-title">Roles &amp; permissions</h3>
                  {selectedMember ? (
                    <>
                      <div className="profile-member profile-member--panel">
                        <div className="profile-member-av">
                          {initials(selectedMember.full_name || selectedMember.name, selectedMember.email)}
                        </div>
                        <div className="profile-member-info">
                          <strong>{selectedMember.full_name || selectedMember.name || selectedMember.email}</strong>
                          <span className="profile-member-email">{selectedMember.email}</span>
                        </div>
                      </div>
                      <div className="profile-info-box">
                        <p>📝 Role management is handled via <strong>Django Admin</strong>.<br />
                        Go to <code>Django Admin → Users → {selectedMember.email}</code> to assign or modify roles.</p>
                      </div>
                      <button className="profile-ghost-btn"
                        onClick={() => { setSelectedMember(null); setActiveTab('list'); }}>
                        ← Back to members
                      </button>
                    </>
                  ) : (
                    <div className="profile-empty">
                      <span className="profile-empty-icon">🔑</span>
                      <p>Select a member from <strong>Members</strong> tab and click <strong>Manage</strong>.</p>
                    </div>
                  )}
                </div>
              )}

              {/* ── Restrictions ────────────────────────────────── */}
              {activeTab === 'restrictions' && (
                <div className="profile-tab-body">
                  <h3 className="profile-tab-title">Department restrictions</h3>
                  <p className="profile-section-desc">Control which departments each user can access.</p>
                  <div className="profile-info-box">
                    <p>🔒 Managed via <strong>Django Admin → User Roles</strong>.</p>
                  </div>
                  <p className="profile-label" style={{marginTop:20,marginBottom:10}}>Example restrictions</p>
                  <ul className="profile-restriction-list">
                    {[
                      ['Raw Fabrics Manager', 'Raw Fabrics dept only'],
                      ['Production Manager',  'Production dept only' ],
                      ['Master Admin',        'All departments'      ],
                    ].map(([role, access]) => (
                      <li key={role} className="profile-restriction-item">
                        <span className="profile-restriction-role">{role}</span>
                        <span className="profile-restriction-arrow">→</span>
                        <span className="profile-restriction-access">{access}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          </div>
        )}

        {activeNav === 'features' && isMasterAdmin && (
          <div className="profile-content" key="features">
            <section className="profile-section">
              <h2 className="profile-section-heading">Features</h2>
              <p className="profile-section-desc">Manage feature overrides for this tenant.</p>
              {featureOverrides.length === 0 && <p className="profile-muted">No feature overrides configured.</p>}
              {featureOverrides.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div>
                    <strong>{item.feature_name || item.feature_key}</strong>
                    <div style={{ fontSize: 12, color: '#666' }}>{item.feature_key}</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={Boolean(item.enabled)}
                    onChange={async (e) => {
                      const enabled = e.target.checked;
                      const next = featureOverrides.map((f) => f.id === item.id ? { ...f, enabled } : f);
                      setFeatureOverrides(next);
                      try {
                        await authService.updateTenantFeatureOverrides(user.tenant, [{ feature: item.feature, enabled }]);
                      } catch {
                        setFeatureOverrides(featureOverrides);
                      }
                    }}
                  />
                </div>
              ))}
            </section>
          </div>
        )}

        {activeNav === 'roles-permissions' && isMasterAdmin && (
          <div className="profile-content" key="roles-permissions">
            <section className="profile-section">
              <h2 className="profile-section-heading">Roles & Permissions</h2>
              <p className="profile-section-desc">Assign role and module-level permission to tenant members.</p>
              {members.map((m) => (
                <div key={m.id} style={{ border: '1px solid #ececec', borderRadius: 8, padding: 12, marginBottom: 10 }}>
                  <div style={{ marginBottom: 8 }}><strong>{m.full_name || m.name || m.email}</strong> - {m.email}</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <Input placeholder="Role (e.g. manager)" value={memberPermissionDraft.role} onChange={(e) => setMemberPermissionDraft((p) => ({ ...p, role: e.target.value }))} />
                    <Input placeholder="Module (e.g. user_management)" value={memberPermissionDraft.module} onChange={(e) => setMemberPermissionDraft((p) => ({ ...p, module: e.target.value }))} />
                    <Input placeholder="Permission (view/edit/full...)" value={memberPermissionDraft.permission_level} onChange={(e) => setMemberPermissionDraft((p) => ({ ...p, permission_level: e.target.value }))} />
                    <Button onClick={async () => {
                      await authService.updateMemberRolePermissions(m.id, {
                        role: memberPermissionDraft.role,
                        module_permissions: [{ module: memberPermissionDraft.module, permission_level: memberPermissionDraft.permission_level }],
                      });
                    }}>
                      Save
                    </Button>
                  </div>
                </div>
              ))}
            </section>
          </div>
        )}

        {activeNav === 'activity-logs' && isMasterAdmin && (
          <div className="profile-content" key="activity-logs">
            <section className="profile-section">
              <h2 className="profile-section-heading">Activity Logs</h2>
              <div style={{ marginBottom: 12 }}>
                <Button onClick={exportActivityLogsCsv}>Export CSV</Button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Time', 'User', 'Action', 'Module', 'Summary', 'IP'].map((h) => <th key={h} style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 8 }}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {activityLogs.map((log) => (
                      <tr key={log.id}>
                        <td style={{ padding: 8, borderBottom: '1px solid #f5f5f5' }}>{log.timestamp}</td>
                        <td style={{ padding: 8, borderBottom: '1px solid #f5f5f5' }}>{log.user_email || '-'}</td>
                        <td style={{ padding: 8, borderBottom: '1px solid #f5f5f5' }}>{log.action}</td>
                        <td style={{ padding: 8, borderBottom: '1px solid #f5f5f5' }}>{log.entity_type}</td>
                        <td style={{ padding: 8, borderBottom: '1px solid #f5f5f5' }}>{log.summary}</td>
                        <td style={{ padding: 8, borderBottom: '1px solid #f5f5f5' }}>{log.ip_address || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* ── Invite Modal (portal-level, outside main/sidebar) ── */}
      {showInviteModal && (
        <div className="profile-modal-backdrop" onClick={() => setShowInviteModal(false)}>
          <div className="profile-modal" onClick={e => e.stopPropagation()}>
            <div className="profile-modal-header">
              <h3 className="profile-modal-title">Create New User & Send Invite</h3>
              <button className="profile-modal-close" onClick={() => setShowInviteModal(false)}>✕</button>
            </div>
            <p className="profile-section-desc" style={{ marginBottom: 16 }}>
              Create a user account and send them login credentials via email.
            </p>
            <div className="profile-form-grid">
              <div className="profile-field">
                <label className="profile-label">Email address *</label>
                <input className="profile-input" placeholder="user@company.com"
                  value={inviteForm.email}
                  onChange={e => setInviteForm(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div className="profile-field">
                <label className="profile-label">Full name *</label>
                <input className="profile-input" placeholder="Jane Smith"
                  value={inviteForm.memberName}
                  onChange={e => setInviteForm(p => ({ ...p, memberName: e.target.value }))} />
              </div>
              <div className="profile-field">
                <label className="profile-label">First name</label>
                <input className="profile-input" placeholder="Jane"
                  value={inviteForm.firstName}
                  onChange={e => setInviteForm(p => ({ ...p, firstName: e.target.value }))} />
              </div>
              <div className="profile-field">
                <label className="profile-label">Last name</label>
                <input className="profile-input" placeholder="Smith"
                  value={inviteForm.lastName}
                  onChange={e => setInviteForm(p => ({ ...p, lastName: e.target.value }))} />
              </div>
              <div className="profile-field">
                <label className="profile-label">Designation</label>
                <input className="profile-input" placeholder="e.g. Production Manager"
                  value={inviteForm.designation}
                  onChange={e => setInviteForm(p => ({ ...p, designation: e.target.value }))} />
              </div>
              <div className="profile-field">
                <label className="profile-label">Temporary password *</label>
                <input type="password" className="profile-input" placeholder="Min. 8 characters"
                  value={inviteForm.tempPassword}
                  onChange={e => setInviteForm(p => ({ ...p, tempPassword: e.target.value }))} />
              </div>
            </div>

            <div className="profile-modal-actions">
              <Button
                className="profile-btn"
                disabled={inviteSending || !inviteForm.email || !inviteForm.memberName || !inviteForm.tempPassword}
                onClick={async () => {
                  setInviteMessage(null);
                  setInviteSending(true);
                  try {
                    await authService.createUserAndSendInvite({
                      email: inviteForm.email, memberName: inviteForm.memberName,
                      firstName: inviteForm.firstName, lastName: inviteForm.lastName,
                      designation: inviteForm.designation, tempPassword: inviteForm.tempPassword,
                      companyName: orgSummary?.company_name,
                    });
                    setInviteMessage({ ok: true, text: 'User created and invite sent!' });
                    setInviteForm({ email:'', memberName:'', tempPassword:'', firstName:'', lastName:'', designation:'' });
                    const list = await authService.getMembers();
                    setMembers(Array.isArray(list) ? list : []);
                    setTimeout(() => setShowInviteModal(false), 1200);
                  } catch (e) {
                    setInviteMessage({ ok: false, text: e?.message || 'Failed to create user' });
                  } finally {
                    setInviteSending(false);
                  }
                }}
              >
                {inviteSending ? 'Creating & Sending...' : 'Create User & Send Invite'}
              </Button>
              <button className="profile-ghost-btn" onClick={() => setShowInviteModal(false)}>Cancel</button>
            </div>

            {inviteMessage && (
              <div className={`profile-msg${inviteMessage.ok ? ' profile-msg--ok' : ' profile-msg--err'}`}>
                {inviteMessage.ok ? '✓' : '⚠'} {inviteMessage.text}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
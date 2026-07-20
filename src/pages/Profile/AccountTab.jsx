import { Mail, ShieldCheck, Briefcase, BadgeCheck, Phone, CalendarDays, Lock } from 'lucide-react';
import { getInitials } from './helpers';

const CARD = 'rounded-lg border border-[#e2e3e8] bg-card';

const fmtDate = (s) => {
  if (!s) return null;
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
};

// One label/value detail row. `icon` is a rendered node (e.g. <Mail .../>).
const Detail = ({ icon, label, value }) => (
  <div className="rounded-md border border-[#e2e3e8] bg-[#fafbfc] px-3.5 py-2.5">
    <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
      {icon} {label}
    </div>
    <div className="truncate text-sm font-medium text-foreground">{value || '—'}</div>
  </div>
);

// "Account" nav section: identity hero, account details, and a (disabled) password form.
export default function AccountTab({ displayName, user }) {
  const role = user?.highest_role || user?.role || '—';
  const joined = fmtDate(user?.date_joined || user?.created_at);

  return (
    <div className="profile-content" key="account">
      {/* ── Identity hero ─────────────────────────────── */}
      <div className={`${CARD} mb-4 flex flex-col gap-4 p-5 sm:flex-row sm:items-center`}>
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
          {getInitials(displayName, user?.email)}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-xl font-bold text-foreground">{displayName}</h2>
          <div className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Mail className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{user?.email || '—'}</span>
          </div>
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <span className="rounded-md bg-[#fdece4] px-2 py-0.5 text-[11px] font-semibold capitalize text-primary">
              {String(role).replace(/_/g, ' ')}
            </span>
            {user?.designation && (
              <span className="rounded-md bg-[#eef0f3] px-2 py-0.5 text-[11px] font-medium capitalize text-[#5b616e]">
                {user.designation}
              </span>
            )}
            {user?.email_verified && (
              <span className="inline-flex items-center gap-1 rounded-md bg-[#eaf4ee] px-2 py-0.5 text-[11px] font-semibold text-[#3b8a5e]">
                <BadgeCheck className="h-3 w-3" /> Verified
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Account details ───────────────────────────── */}
      <section className={`${CARD} mb-4 p-5`}>
        <h3 className="mb-4 text-base font-bold text-foreground">Account details</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Detail icon={<Mail className="h-3.5 w-3.5" />} label="Email" value={user?.email} />
          <Detail
            icon={<ShieldCheck className="h-3.5 w-3.5" />}
            label="Role"
            value={String(role).replace(/_/g, ' ')}
          />
          {user?.designation && (
            <Detail icon={<Briefcase className="h-3.5 w-3.5" />} label="Designation" value={user.designation} />
          )}
          {user?.phone && (
            <Detail icon={<Phone className="h-3.5 w-3.5" />} label="Phone" value={user.phone} />
          )}
          {joined && (
            <Detail icon={<CalendarDays className="h-3.5 w-3.5" />} label="Member since" value={joined} />
          )}
        </div>
      </section>

      {/* ── Password ──────────────────────────────────── */}
      <section className={`${CARD} p-5`}>
        <div className="mb-1 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#f3f4f6] text-muted-foreground">
            <Lock className="h-4 w-4" />
          </span>
          <h3 className="text-base font-bold text-foreground">Password</h3>
        </div>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          To change your password, contact your administrator or use the forgot-password flow on the
          login screen.
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              New Password
            </span>
            <input
              type="password"
              disabled
              placeholder="••••••••••"
              className="w-full cursor-not-allowed rounded-md border border-[#e2e3e8] bg-muted px-3 py-2 text-sm text-foreground/60"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Repeat New Password
            </span>
            <input
              type="password"
              disabled
              placeholder="••••••••••"
              className="w-full cursor-not-allowed rounded-md border border-[#e2e3e8] bg-muted px-3 py-2 text-sm text-foreground/60"
            />
          </label>
        </div>
        <button
          type="button"
          disabled
          className="mt-4 cursor-not-allowed rounded-md bg-primary/40 px-4 py-2.5 text-sm font-semibold text-white"
        >
          Update Password
        </button>
      </section>
    </div>
  );
}

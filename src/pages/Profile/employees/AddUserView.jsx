import { useEffect, useMemo, useState } from 'react';
import Select from 'react-select';
import { ArrowLeft, ChevronRight, Check, ShieldCheck, RotateCcw } from 'lucide-react';
import { getBuyerCodes } from '../../../services/integration';
import {
  LEVELS,
  MODULES,
  permKey,
  buildAccessPayload,
} from './permissionConfig';

// Pull the buyer array out of whatever shape the API returns (mirrors BuyerMasterSheet).
const extractBuyers = (payload) => {
  const list =
    (Array.isArray(payload) && payload) ||
    payload?.results ||
    payload?.data ||
    payload?.data?.results ||
    [];
  return list.map((b) => ({
    code: b.code || b.id || '',
    name: b.buyer_name || b.buyerName || '',
  }));
};

// Flat-theme building blocks (match StockSheet / Profile revamp).
const CARD = 'rounded-lg border border-[#e2e3e8] bg-card';
const LABEL = 'mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground';
const CTRL =
  'w-full rounded-md border border-[#e2e3e8] bg-white px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15';
const STEP_KICKER = 'mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground';

function TextField({ label, type = 'text', value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className={LABEL}>{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={CTRL}
      />
    </label>
  );
}

// react-select styling for the access-level dropdown — strictly orange + grey.
// The closed control reflects the selected level's colour (grey shades → orange);
// menu options use grey hover and soft-orange selected. Menu is portalled so the
// scrolling permission matrix never clips it.
const levelSelectStyles = (lvl) => ({
  control: (base, state) => ({
    ...base,
    minHeight: 34,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: state.isFocused ? '#f94d00' : lvl.v > 0 ? lvl.color : '#e2e3e8',
    backgroundColor: lvl.v > 0 ? lvl.bg : '#ffffff',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(249,77,0,0.15)' : 'none',
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 600,
    transition: 'border-color 0.15s, box-shadow 0.15s',
    '&:hover': { borderColor: lvl.v > 0 ? lvl.color : '#c9cad2' },
  }),
  valueContainer: (base) => ({ ...base, padding: '0 8px' }),
  singleValue: (base) => ({ ...base, color: lvl.v > 0 ? lvl.color : '#9ca3af', fontWeight: 600 }),
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: (base) => ({
    ...base,
    padding: 4,
    color: lvl.v > 0 ? lvl.color : '#9ca3af',
    '&:hover': { color: lvl.v > 0 ? lvl.color : '#6b7280' },
  }),
  menu: (base) => ({
    ...base,
    borderRadius: 8,
    border: '1px solid #e2e3e8',
    boxShadow: '0 8px 24px rgba(17,24,39,0.1)',
    overflow: 'hidden',
  }),
  menuList: (base) => ({ ...base, padding: 4 }),
  menuPortal: (base) => ({ ...base, zIndex: 10001 }),
  option: (base, state) => ({
    ...base,
    borderRadius: 6,
    padding: '7px 10px',
    fontSize: 12.5,
    fontWeight: 600,
    cursor: 'pointer',
    color: state.isSelected ? '#f94d00' : '#374151',
    backgroundColor: state.isSelected
      ? '#fdece4'
      : state.isFocused
        ? '#f3f4f6'
        : 'transparent',
    ':active': { backgroundColor: '#f3f4f6' },
  }),
});

function LevelSelect({ value, max, onChange }) {
  const lvl = LEVELS[value];
  const options = LEVELS.filter((l) => l.v <= max).map((l) => ({ value: l.v, label: l.opt }));
  return (
    <Select
      value={{ value, label: lvl.opt }}
      onChange={(opt) => onChange(opt ? opt.value : 0)}
      options={options}
      isSearchable={false}
      menuPlacement="auto"
      menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
      menuPosition="fixed"
      styles={levelSelectStyles(lvl)}
    />
  );
}

// One permission cell: cumulative access select + optional approve toggle.
function PermCell({ value, max, onChange, approve, apOn, onAp }) {
  return (
    <div className="flex flex-col gap-1.5">
      <LevelSelect value={value} max={max} onChange={onChange} />
      {approve && (
        <button
          type="button"
          disabled={value === 0}
          onClick={onAp}
          className="flex items-center justify-center gap-1 rounded-md border px-2 py-1 text-[10px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40"
          style={{
            background: apOn ? '#fdece4' : 'transparent',
            borderColor: apOn ? '#f94d00' : '#e2e3e8',
            color: apOn ? '#f94d00' : '#9ca3af',
          }}
        >
          {apOn && <Check className="h-3 w-3" />}
          Approve
        </button>
      )}
    </div>
  );
}

export default function AddUserView({ mode = 'add', member, onCancel, onSubmit }) {
  const isEdit = mode === 'edit';

  // Baseline the form resets to: the fetched member values when editing, all
  // empty when creating. Permissions + buyer scope aren't fetched (UI-only), so
  // their baseline is empty in both modes.
  const initialUser = useMemo(
    () => ({
      first: member?.first_name || '',
      last: member?.last_name || '',
      email: member?.email || '',
      pass: '',
      desig: member?.designation || '',
    }),
    [member],
  );

  const [user, setUser] = useState(initialUser);
  const [lv, setLv] = useState({});
  const [ap, setAp] = useState({});
  const [allBuyers, setAllBuyers] = useState(true);
  const [buyerSel, setBuyerSel] = useState([]); // selected buyer codes
  const [buyers, setBuyers] = useState([]);
  const [buyersLoading, setBuyersLoading] = useState(true);
  const [open, setOpen] = useState({ code: true, ipom: false, pur: false, ims: false });
  const [saving, setSaving] = useState(false);

  // Fetch the tenant's buyers the same way BuyerMasterSheet does.
  useEffect(() => {
    let alive = true;
    setBuyersLoading(true);
    getBuyerCodes({ page: 1, page_size: 200, ordering: 'code' })
      .then((res) => { if (alive) setBuyers(extractBuyers(res)); })
      .catch(() => { if (alive) setBuyers([]); })
      .finally(() => { if (alive) setBuyersLoading(false); });
    return () => { alive = false; };
  }, []);

  const getLv = (m, r, c) => lv[permKey(m, r, c)] || 0;
  const getAp = (m, r, c) => !!ap[permKey(m, r, c)];

  const setLevel = (m, r, c, v) => {
    const k = permKey(m, r, c);
    setLv((p) => ({ ...p, [k]: v }));
    if (v === 0) setAp((p) => ({ ...p, [k]: false }));
  };
  const toggleAp = (m, r, c) => {
    const k = permKey(m, r, c);
    setAp((p) => ({ ...p, [k]: !p[k] }));
  };

  const quickSet = (mod, level) => {
    const cols = mod.cols || ['all'];
    setLv((p) => {
      const n = { ...p };
      mod.rows.forEach((row) =>
        cols.forEach((col) => {
          n[permKey(mod.id, row.id, col)] =
            level === 'none' ? 0 : level === 'read' ? Math.min(1, row.max) : row.max;
        }),
      );
      return n;
    });
    if (level === 'none') {
      setAp((p) => {
        const n = { ...p };
        mod.rows.forEach((row) =>
          cols.forEach((col) => {
            n[permKey(mod.id, row.id, col)] = false;
          }),
        );
        return n;
      });
    }
  };

  const toggleBuyer = (b) =>
    setBuyerSel((s) => (s.includes(b) ? s.filter((x) => x !== b) : [...s, b]));

  // Reset the form to its baseline: fetched values when editing, empty when creating.
  const handleReset = () => {
    setUser(initialUser);
    setLv({});
    setAp({});
    setAllBuyers(true);
    setBuyerSel([]);
  };

  const summary = useMemo(() => buildAccessPayload(lv, ap), [lv, ap]);

  const buyerWarn = !allBuyers && buyerSel.length === 0;
  const fullName = `${user.first} ${user.last}`.trim();
  const valid = user.first.trim() && user.email.trim() && (isEdit || user.pass.trim());

  const handleSave = async () => {
    if (!valid || saving) return;
    const payload = {
      mode,
      member,
      credentials: {
        firstName: user.first.trim(),
        lastName: user.last.trim(),
        email: user.email.trim(),
        designation: user.desig.trim(),
        tempPassword: user.pass,
        memberName: fullName,
      },
      buyerScope: { all: allBuyers, selected: allBuyers ? [] : buyerSel },
      access: { lv, ap, summary },
    };
    setSaving(true);
    try {
      await onSubmit(payload);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-tab-body">
      {/* Back */}
      <button
        type="button"
        onClick={onCancel}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to members
      </button>

      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
        Master Panel
      </div>
      <h3 className="mb-1 text-xl font-bold text-foreground">
        {isEdit ? 'Edit User' : 'Add User'}
      </h3>
      <p className="mb-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Credentials, then buyer scope, then permissions — assigned by walking the product&apos;s
        own navigation, module by module, IPO type by IPO type, screen by screen.
      </p>

      <div className="flex flex-wrap items-start gap-4">
        {/* ── LEFT: form ─────────────────────────────────────── */}
        <div className="min-w-0 flex-1" style={{ flexBasis: 600 }}>
          {/* 1 · User details */}
          <div className={`${CARD} mb-3 p-4`}>
            <div className={STEP_KICKER}>1 · User details</div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <TextField label="First name" value={user.first}
                onChange={(v) => setUser((u) => ({ ...u, first: v }))} placeholder="Priya" />
              <TextField label="Last name" value={user.last}
                onChange={(v) => setUser((u) => ({ ...u, last: v }))} placeholder="Sharma" />
              <TextField label="Email / username" value={user.email}
                onChange={(v) => setUser((u) => ({ ...u, email: v }))} placeholder="priya@company.com" />
              <TextField
                label={isEdit ? 'Password (leave blank to keep)' : 'Password'}
                type="password" value={user.pass}
                onChange={(v) => setUser((u) => ({ ...u, pass: v }))} placeholder="••••••••" />
              <div className="sm:col-span-2">
                <TextField label="Designation (free text — company's own wording)" value={user.desig}
                  onChange={(v) => setUser((u) => ({ ...u, desig: v }))} placeholder="Operations Manager" />
              </div>
            </div>
          </div>

          {/* 2 · Buyer scope */}
          <div className={`${CARD} mb-3 p-4`} style={buyerWarn ? { borderColor: '#f94d00' } : undefined}>
            <div className={STEP_KICKER}>2 · Buyer scope</div>
            <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
              Which buyer accounts this user works on. Applies across every module — IPOs, purchase
              and inventory records linked to other buyers stay hidden.
            </p>
            <div className="flex gap-2">
              {[['all', 'All buyers'], ['sel', 'Selected buyers only']].map(([m, lbl]) => {
                const on = m === 'all' ? allBuyers : !allBuyers;
                return (
                  <button key={m} type="button" onClick={() => setAllBuyers(m === 'all')}
                    className="rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors"
                    style={{
                      background: on ? '#fdece4' : 'transparent',
                      borderColor: on ? '#f94d00' : '#e2e3e8',
                      color: on ? '#f94d00' : '#9ca3af',
                    }}>
                    {lbl}
                  </button>
                );
              })}
            </div>
            {!allBuyers && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {buyersLoading ? (
                  <span className="text-[11px] text-muted-foreground">Loading buyers…</span>
                ) : buyers.length === 0 ? (
                  <span className="text-[11px] text-muted-foreground">No buyers found for this tenant.</span>
                ) : (
                  buyers.map((b) => {
                    const on = buyerSel.includes(b.code);
                    return (
                      <button key={b.code} type="button" onClick={() => toggleBuyer(b.code)}
                        className="rounded-full border px-3 py-1 text-[11px] font-semibold transition-colors"
                        style={{
                          background: on ? '#fdece4' : '#ffffff',
                          borderColor: on ? '#f94d00' : '#e2e3e8',
                          color: on ? '#f94d00' : '#6b7280',
                        }}>
                        {on ? '✓ ' : ''}{b.code}{b.name ? ` · ${b.name}` : ''}
                      </button>
                    );
                  })
                )}
                {buyerWarn && !buyersLoading && buyers.length > 0 && (
                  <span className="self-center text-[11px] font-medium" style={{ color: '#f94d00' }}>
                    ⚠ no buyers selected — user will see no buyer-linked records
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Always-on note */}
          <div className="mb-3 flex flex-wrap items-baseline gap-2 rounded-lg border border-dashed border-[#c9cad2] bg-[#f7f8fa] px-3.5 py-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Always on for every user
            </span>
            <span className="text-sm text-foreground/70">
              Home · Tasks (self-scoped — each user sees only their own)
            </span>
          </div>

          {/* 3 · Permissions */}
          <div className={`${STEP_KICKER} ml-0.5`}>3 · Permissions &amp; scopes — follow the navigation</div>

          {/* Legend */}
          <div className={`${CARD} mb-3 bg-[#f7f8fa] px-3.5 py-2.5 text-[13px] leading-relaxed text-foreground/70`}>
            Ladder is cumulative:{' '}
            <span className="font-semibold" style={{ color: LEVELS[1].color }}>Read</span> ‹{' '}
            <span className="font-semibold" style={{ color: LEVELS[2].color }}>Read+Write</span> ‹{' '}
            <span className="font-semibold" style={{ color: LEVELS[3].color }}>Read+Write+Edit</span>.{' '}
            <span className="font-semibold" style={{ color: '#f94d00' }}>Approve</span> is separate — a
            user can hold read + approve without write. When a record is sent for approval, only users
            holding Approve on that screen can be chosen as the approver.
          </div>

          {/* Module cards */}
          {MODULES.map((mod) => {
            const cols = mod.cols || ['all'];
            const totalCells = mod.rows.length * cols.length;
            const granted = mod.rows.reduce(
              (s, row) => s + cols.filter((c) => getLv(mod.id, row.id, c) > 0).length, 0);
            const isOpen = open[mod.id];
            const gridCols = mod.cols
              ? `minmax(160px,1.4fr) repeat(${cols.length}, minmax(100px,1fr))`
              : 'minmax(180px,1.5fr) minmax(150px,220px)';
            return (
              <div key={mod.id} className={`${CARD} mb-2.5 overflow-hidden`}>
                {/* Header */}
                <div
                  onClick={() => setOpen((o) => ({ ...o, [mod.id]: !o[mod.id] }))}
                  className="flex cursor-pointer flex-wrap items-center gap-3 px-4 py-3"
                  style={{ background: isOpen ? '#f7f8fa' : 'transparent' }}
                >
                  <ChevronRight
                    className="h-4 w-4 shrink-0 text-muted-foreground transition-transform"
                    style={{ transform: isOpen ? 'rotate(90deg)' : 'none' }}
                  />
                  <div className="min-w-[160px] flex-1">
                    <div className="text-[15px] font-bold text-foreground">{mod.name}</div>
                    <div className="text-[11px] text-muted-foreground">{mod.desc}</div>
                  </div>
                  <span
                    className="rounded border px-2 py-0.5 text-[10px] font-semibold"
                    style={{
                      background: granted > 0 ? '#fdece4' : '#f7f8fa',
                      borderColor: granted > 0 ? '#f94d0066' : '#e2e3e8',
                      color: granted > 0 ? '#f94d00' : '#9ca3af',
                    }}
                  >
                    {granted} / {totalCells} granted
                  </span>
                  <span className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                    {[['none', 'None'], ['read', 'All read'], ['full', 'Full']].map(([m, lbl]) => (
                      <button key={m} type="button"
                        onClick={() => { setOpen((o) => ({ ...o, [mod.id]: true })); quickSet(mod, m); }}
                        className="rounded border border-[#e2e3e8] bg-white px-2 py-1 text-[10px] font-medium text-muted-foreground transition-colors hover:border-[#c9cad2]">
                        {lbl}
                      </button>
                    ))}
                  </span>
                </div>

                {/* Body */}
                {isOpen && (
                  <div className="px-4 pb-3.5 pt-1">
                    <div className="overflow-x-auto">
                      <div style={{ minWidth: mod.cols ? 190 + cols.length * 112 : 0 }}>
                        {mod.cols && (
                          <div className="grid gap-2 border-b border-[#e2e3e8] pb-2 pt-2.5"
                            style={{ gridTemplateColumns: gridCols }}>
                            <div />
                            {cols.map((c) => (
                              <div key={c} className="text-center text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                                {c}
                              </div>
                            ))}
                          </div>
                        )}
                        {mod.rows.map((row) => (
                          <div key={row.id} className="grid items-start gap-2 border-b border-[#e2e3e8]/60 py-2.5"
                            style={{ gridTemplateColumns: gridCols }}>
                            <div>
                              <div className="text-[13px] font-semibold text-foreground">{row.name}</div>
                              <div className="mt-0.5 text-[10px] text-muted-foreground">{row.sub}</div>
                              {row.cap && (
                                <div className="mt-0.5 text-[10px]" style={{ color: '#6b7280' }}>{row.cap}</div>
                              )}
                            </div>
                            {cols.map((col) => (
                              <PermCell key={col}
                                value={getLv(mod.id, row.id, col)} max={row.max}
                                onChange={(v) => setLevel(mod.id, row.id, col, v)}
                                approve={row.approve} apOn={getAp(mod.id, row.id, col)}
                                onAp={() => toggleAp(mod.id, row.id, col)} />
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                    {mod.note && <div className="mt-2 text-[10px] text-muted-foreground">{mod.note}</div>}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── RIGHT: live summary ────────────────────────────── */}
        <div className="flex-1 sm:sticky sm:top-4" style={{ flexBasis: 300, maxWidth: 400 }}>
          <div className={`${CARD} p-4`}>
            <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
              Effective access · live
            </div>
            <div className="text-base font-bold text-foreground">{fullName || 'New user'}</div>
            <div className="mb-2 text-[13px] text-muted-foreground">{user.desig || 'designation —'}</div>

            <div className="mb-3 inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-semibold"
              style={{
                background: '#fdece4',
                borderColor: '#f94d0055',
                color: '#f94d00',
              }}>
              {allBuyers ? 'All buyers' : buyerWarn ? '⚠ 0 buyers selected' : `${buyerSel.length} of ${buyers.length} buyers`}
            </div>
            {!allBuyers && buyerSel.length > 0 && (
              <div className="-mt-1.5 mb-2.5 text-[11px] leading-relaxed text-muted-foreground">
                {buyerSel
                  .map((code) => {
                    const b = buyers.find((x) => x.code === code);
                    return b?.name || code;
                  })
                  .join(' · ')}
              </div>
            )}

            <div className="mb-3 h-px bg-[#e2e3e8]" />

            {summary.modules.length === 0 ? (
              <div className="text-[13px] leading-relaxed text-muted-foreground">
                No access granted yet — this user can log in but sees only Home and their own Tasks.
              </div>
            ) : (
              summary.modules.map((mod) => (
                <div key={mod.module} className="mb-3">
                  <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-foreground">
                    {mod.name}
                  </div>
                  {mod.grants.map((g, i) => (
                    <div key={`${g.row}-${g.ipoType || 'all'}-${i}`} className="flex items-center gap-2 py-0.5">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: LEVELS[g.level].color }} />
                      <span className="flex-1 text-[13px] text-foreground/70">
                        {g.name}{g.ipoType ? ` · ${g.ipoType}` : ''}
                      </span>
                      {g.approver && (
                        <span className="rounded-full border px-1.5 py-px text-[9px] font-bold"
                          style={{ background: '#fdece4', borderColor: '#f94d0044', color: '#f94d00' }}>
                          APPROVER
                        </span>
                      )}
                      <span className="text-[11px] font-semibold" style={{ color: LEVELS[g.level].color }}>
                        {LEVELS[g.level].short}
                      </span>
                    </div>
                  ))}
                </div>
              ))
            )}

            <div className="my-3 h-px bg-[#e2e3e8]" />
            <div className="mb-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5" />
              {summary.cells} screens granted · approver on {summary.approvals}
            </div>

            <button type="button" onClick={handleSave} disabled={!valid || saving}
              className="w-full cursor-pointer rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
              {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create user'}
            </button>
            <button type="button" onClick={handleReset} disabled={saving}
              className="mt-2 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-md border border-[#e2e3e8] bg-white px-4 py-2 text-sm font-semibold text-[#6b7280] transition-colors hover:border-[#c9cad2] hover:bg-[#f3f4f6] disabled:cursor-not-allowed disabled:opacity-50">
              <RotateCcw className="h-3.5 w-3.5" />
              {isEdit ? 'Reset changes' : 'Reset form'}
            </button>
            {!valid && (
              <div className="mt-2 text-center text-[11px] text-muted-foreground">
                {isEdit ? 'first name + email needed' : 'first name + email + password needed'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

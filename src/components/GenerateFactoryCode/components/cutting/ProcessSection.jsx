import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { enumerateProcessRows } from '../../utils/processRows';

// Cut/Sew · Section-2 (process) — clubbing UX mirrored from IPO Master CNS.
// The unit here is ONE work order (a component's CUTTING #1, CUTTING #2, …) — each
// listed on its own row with its own size — NOT the whole component. Rows default to
// SINGLE (isolation, processed separately). Tick >=2 and the orange CLUB button
// slides up → groups them into "Club N" (processed together). Tick a club and the
// ISOLATE button slides up → separates it back. "Active" = that work order's cut/sew
// size is filled. onForward via modeAction / gated finalAction (Sewing's "forward to
// pack").
const SLIDE = 'transform 380ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 200ms ease 180ms';
const CLUB_TINTS = ['#f97316', '#0ea5e9', '#22c55e', '#a855f7', '#ef4444', '#eab308'];

const ProcessSection = ({ formData, woType, prefix, kind, clubs = [], clubComponents, unclubClub, modeAction, finalAction, saveBtn = null }) => {
  const [selected, setSelected] = useState({});        // row key -> bool
  const [selectedClubs, setSelectedClubs] = useState({}); // club id -> bool
  const [notice, setNotice] = useState('');
  const [sizeMismatch, setSizeMismatch] = useState(null); // { keys, rows } when club is blocked on size

  const components = formData?.products?.[0]?.components || [];
  const rawMaterials = formData?.rawMaterials || [];

  // The cut/sew SIZE of a single work order (row), as an "L × W unit" string; '' when
  // not filled yet. A club is processed together on one layout, so members must share
  // the same size — an unfilled size is unknown and never conflicts.
  const sizeOf = (wo) => {
    const L = wo?.[`${prefix}Length`];
    const W = wo?.[`${prefix}Width`];
    const U = wo?.[`${prefix}Unit`];
    return L && W ? `${L} × ${W}${U ? ` ${U}` : ''}` : '';
  };
  const isRowActive = (wo) => Boolean(wo?.[`${prefix}Length`] && wo?.[`${prefix}Width`]);

  // Every work order of this type, ordered by the component list (so the table reads
  // Front Panel · CUTTING #1, Front Panel · CUTTING #2, Fiber Padding · CUTTING, …).
  const allRows = enumerateProcessRows(rawMaterials, woType);
  const rowsByName = allRows.reduce((acc, r) => { (acc[r.name] = acc[r.name] || []).push(r); return acc; }, {});
  const woRows = components
    .filter((c) => c.productComforter)
    .flatMap((c) => (rowsByName[c.productComforter] || []).map((r) => ({ ...r, placement: c.placement || '—' })));
  const rowByKey = Object.fromEntries(woRows.map((r) => [r.key, r]));

  const clubOf = (key) => clubs.findIndex((c) => c.components.includes(key));
  const singles = woRows.filter((r) => clubOf(r.key) === -1);

  const selectedCount = Object.values(selected).filter(Boolean).length;
  const selectedClubCount = Object.values(selectedClubs).filter(Boolean).length;
  const showClub = selectedCount >= 2;
  const showUnclub = selectedClubCount >= 1;

  // Commit a club of the given row keys and confirm it.
  const performClub = (keys) => {
    clubComponents(kind, keys);
    setSelected({});
    setSizeMismatch(null);
    setNotice(`${keys.join(' and ')} clubbed — this ${kind} club will reflect in the Inward / Outward Store sheets.`);
  };
  // Size is a clubbing criterion: rows can be clubbed only when their cut/sew sizes
  // match (processed together on one layout). If two or more selected rows carry
  // different sizes, block and surface both sizes — the user can still "Club anyway".
  // Rows without a size yet don't conflict (nothing to compare).
  const doClub = () => {
    const chosen = singles.filter((r) => selected[r.key]);
    if (chosen.length < 2) return;
    const keys = chosen.map((r) => r.key);
    const distinctSizes = [...new Set(chosen.map((r) => sizeOf(r.wo)).filter(Boolean))];
    if (distinctSizes.length > 1) {
      setSizeMismatch({ keys, rows: chosen.map((r) => ({ key: r.key, name: r.name, typeCode: r.typeCode, size: sizeOf(r.wo) || 'Not set' })) });
      return;
    }
    performClub(keys);
  };
  const doUnclub = () => {
    const ids = Object.entries(selectedClubs).filter(([, v]) => v).map(([id]) => id);
    if (!ids.length) return;
    const separated = clubs.filter((c) => ids.includes(c.id)).flatMap((c) => c.components);
    ids.forEach((id) => unclubClub(kind, id));
    setSelectedClubs({});
    setNotice(`${separated.join(' and ')} separated — each is processed on its own again (isolation).`);
  };
  // Run the mode action; show its popup if any. `onContinue` (if provided) fires
  // from the popup's Continue button (e.g. cutting → open the sewing section).
  const runModeAction = () => {
    modeAction?.onClick?.();
    if (modeAction?.notice) setNotice(modeAction.notice);
    else modeAction?.onContinue?.();
  };
  const allAssigned = woRows.length > 0; // every work order is either single or clubbed → always assigned

  const rowCls = 'grid grid-cols-[36px_1.4fr_1fr_auto] items-center border-t border-border';

  return (
    <div>
      <div style={{ position: 'relative' }}>
        {/* Slide-up CLUB / ISOLATE buttons (same animation as IPO Master CNS) */}
        <button
          type="button"
          onClick={doClub}
          tabIndex={showClub ? 0 : -1}
          style={{
            position: 'absolute', top: 0, right: 16, background: '#f97316', color: '#fff', border: 'none',
            borderRadius: '10px 10px 0 0', padding: '7px 18px', fontSize: 12, fontWeight: 700, letterSpacing: 1,
            boxShadow: showClub ? '0 -4px 10px rgba(249,115,22,0.25)' : 'none', cursor: 'pointer', zIndex: 0,
            transform: showClub ? 'translateY(-100%)' : 'translateY(0)', transition: SLIDE,
            pointerEvents: showClub ? 'auto' : 'none',
          }}
        >
          CLUB ({selectedCount})
        </button>
        <button
          type="button"
          onClick={doUnclub}
          tabIndex={showUnclub ? 0 : -1}
          style={{
            position: 'absolute', top: 0, right: 16, background: '#475569', color: '#fff', border: 'none',
            borderRadius: '10px 10px 0 0', padding: '7px 18px', fontSize: 12, fontWeight: 700, letterSpacing: 1,
            boxShadow: showUnclub ? '0 -4px 10px rgba(71,85,105,0.3)' : 'none', cursor: 'pointer', zIndex: 0,
            transform: showUnclub ? 'translateY(-100%)' : 'translateY(0)', transition: SLIDE,
            pointerEvents: showUnclub ? 'auto' : 'none',
          }}
        >
          ISOLATE ({selectedClubCount})
        </button>

        <div className="rounded-xl border border-border bg-card overflow-x-auto" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ minWidth: '460px' }}>
            <div className={`${rowCls.replace('border-t','')} bg-muted text-xs font-semibold text-foreground/70`}>
              <div className="px-2 py-2" />
              <div className="px-2 py-2">COMPONENT / PLACEMENT</div>
              <div className="px-2 py-2">MODE</div>
              <div className="px-2 py-2 text-right">STATUS</div>
            </div>

            {/* Clubbed = work orders processed together. Tick it and ISOLATE to
                separate back into single rows. */}
            {clubs.map((club, ci) => {
              const tint = CLUB_TINTS[ci % CLUB_TINTS.length];
              const active = club.components.every((k) => isRowActive(rowByKey[k]?.wo));
              const clubSize = sizeOf(rowByKey[club.components[0]]?.wo);
              return (
                <label key={club.id} className={`${rowCls} cursor-pointer`} style={{ borderLeft: `3px solid ${tint}`, background: `${tint}12` }}>
                  <span className="px-2 py-2">
                    <input type="checkbox" checked={!!selectedClubs[club.id]} onChange={() => setSelectedClubs((p) => ({ ...p, [club.id]: !p[club.id] }))} />
                  </span>
                  <span className="px-2 py-2 text-sm min-w-0">
                    <span className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold truncate">{club.components.join('  +  ')}</span>
                      <span className="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide" style={{ background: tint, color: '#fff' }}>Merged</span>
                    </span>
                    {clubSize && <span className="block text-[11px] text-muted-foreground truncate">Size {clubSize}</span>}
                  </span>
                  <span className="px-2 py-2 text-xs font-medium" style={{ color: tint }}>{club.label} · together</span>
                  <span className={`px-2 py-2 text-xs text-right ${active ? 'text-green-600 font-medium' : 'text-muted-foreground'}`}>{active ? 'Active' : 'Inactive'}</span>
                </label>
              );
            })}

            {/* Single (isolation) rows — one per work order of this type */}
            {singles.map((r) => {
              const size = sizeOf(r.wo);
              return (
                <label key={r.key} className={`${rowCls} cursor-pointer`}>
                  <span className="px-2 py-2">
                    <input type="checkbox" checked={!!selected[r.key]} onChange={() => setSelected((p) => ({ ...p, [r.key]: !p[r.key] }))} />
                  </span>
                  <span className="px-2 py-2 text-sm min-w-0">
                    <span className="truncate block">{r.name} <span className="text-muted-foreground">· {r.placement}</span></span>
                    <span className="block text-[11px] text-muted-foreground truncate">{r.typeCode}{size ? ` · ${size}` : ''}</span>
                  </span>
                  <span className="px-2 py-2 text-xs text-muted-foreground">Single (isolation)</span>
                  <span className={`px-2 py-2 text-xs text-right ${isRowActive(r.wo) ? 'text-green-600 font-medium' : 'text-muted-foreground'}`}>{isRowActive(r.wo) ? 'Active' : 'Inactive'}</span>
                </label>
              );
            })}

            {woRows.length === 0 && <div className="px-3 py-3 text-sm text-muted-foreground">Add components with {woType} work orders first.</div>}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-end gap-3" style={{ marginTop: '16px' }}>
        {saveBtn}
        {kind === 'sewing' && formData?.sewAssemblyMoved && (
          <span className="mr-auto rounded-full bg-green-100 text-green-700 text-xs font-medium" style={{ padding: '4px 12px' }}>
            ✓ In IPC assembly line
          </span>
        )}
        {modeAction && (
          <Button type="button" variant={finalAction ? 'outline' : 'default'} onClick={runModeAction}>{modeAction.label}</Button>
        )}
        {finalAction && (
          <Button type="button" disabled={finalAction.requireAllAssigned && !allAssigned} onClick={finalAction.onClick}>{finalAction.label} →</Button>
        )}
      </div>

      {/* Size mismatch — clubbing blocked because the selected work orders are not the
          same cut/sew size. Show both sizes; the user may still "Club anyway". */}
      {sizeMismatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => setSizeMismatch(null)}>
          <div className="rounded-xl border border-border bg-card shadow-lg" style={{ padding: '20px 24px', maxWidth: '460px' }} onClick={(e) => e.stopPropagation()}>
            <p className="text-sm font-semibold text-foreground" style={{ marginBottom: '10px' }}>
              These sizes do not match — clubbing is not processed.
            </p>
            <div className="rounded-lg border border-border bg-muted/40 text-xs" style={{ padding: '10px 12px', marginBottom: '16px' }}>
              {sizeMismatch.rows.map((r) => (
                <div key={r.key} className="flex items-center justify-between gap-3" style={{ marginBottom: '4px' }}>
                  <span className="font-semibold text-foreground truncate">{r.name} <span className="font-normal text-muted-foreground">· {r.typeCode}</span></span>
                  <span className="text-muted-foreground whitespace-nowrap">{r.size}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground" style={{ marginBottom: '16px' }}>
              Work orders are usually clubbed only when their {kind === 'sewing' ? 'sew' : 'cut'} sizes are the same, because a club is processed together. You can still club them anyway.
            </p>
            <div className="flex justify-end gap-2">
              <Button type="button" size="sm" variant="outline" onClick={() => setSizeMismatch(null)}>Cancel</Button>
              <Button type="button" size="sm" onClick={() => performClub(sizeMismatch.keys)}>Club anyway</Button>
            </div>
          </div>
        </div>
      )}

      {notice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => setNotice('')}>
          <div className="rounded-xl border border-border bg-card shadow-lg" style={{ padding: '20px 24px', maxWidth: '420px' }} onClick={(e) => e.stopPropagation()}>
            <p className="text-sm text-foreground" style={{ marginBottom: '12px' }}>{notice}</p>
            {/* On a forward/assembly popup, show the club/single breakdown being sent. */}
            {modeAction?.notice && notice === modeAction.notice && (
              <div className="rounded-lg border border-border bg-muted/40 text-xs" style={{ padding: '10px 12px', marginBottom: '16px' }}>
                {clubs.map((c) => (
                  <div key={c.id} className="text-foreground" style={{ marginBottom: '4px' }}>
                    <span className="font-semibold">{c.label}:</span> {c.components.join('  +  ')} <span className="text-muted-foreground">(merged)</span>
                  </div>
                ))}
                {singles.map((r) => (
                  <div key={r.key} className="text-muted-foreground" style={{ marginBottom: '2px' }}>{r.name} · {r.typeCode} <span>(single)</span></div>
                ))}
                {clubs.length === 0 && singles.length === 0 && <div className="text-muted-foreground">No work orders.</div>}
              </div>
            )}
            <div className="flex justify-end">
              {/* Only the mode-action popup carries onContinue (e.g. → sewing). The
                  club/separate popups just need OK. */}
              {modeAction?.onContinue && notice === modeAction?.notice ? (
                <Button type="button" size="sm" onClick={() => { setNotice(''); modeAction.onContinue(); }}>Continue →</Button>
              ) : (
                <Button type="button" size="sm" onClick={() => setNotice('')}>OK</Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessSection;

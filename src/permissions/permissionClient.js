// ── Reading the current user's permissions on the frontend ───────────────────
//
// The backend stamps a `user_permissions` cookie (base64url JSON) on every
// response where the member's permission_version has moved. So when the master
// panel grants Azeem edit access, his very next request carries the new cookie
// and the UI updates — no logout, no refresh.
//
// THIS IS FOR RENDERING ONLY. The cookie is readable, which means it is also
// editable — a member can open devtools and set any level they like. The server
// re-derives permissions from the database on every request and enforces there,
// so tampering changes which buttons appear and nothing else. Never treat a
// `can()` result as a security boundary; treat it as "should I draw this".
//
// Authoritative copy: GET /api/auth/me/permissions/.

export const PERMISSION_COOKIE = 'user_permissions';

// Cumulative ladder, mirroring auth_service/permissions/catalogue.py.
export const LEVEL = { NONE: 0, READ: 1, WRITE: 2, EDIT: 3 };

const LEVEL_FOR_ACTION = { read: LEVEL.READ, create: LEVEL.WRITE, update: LEVEL.EDIT };

const ALL_BUYERS = '*';
const SHARED_KEY = '='; // the collapsed entry when every buyer shares one grid

// ── cookie plumbing ──────────────────────────────────────────────────────────
function readCookie(name) {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}=([^;]*)`),
  );
  return match ? match[1] : null;
}

function decode(value) {
  if (!value) return null;
  try {
    const b64 = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
    return JSON.parse(decodeURIComponent(escape(atob(padded))));
  } catch {
    return null;
  }
}

/** Raw decoded cookie payload, or null when absent / unreadable. */
export function readPermissionCookie() {
  return decode(readCookie(PERMISSION_COOKIE));
}

/** The version stamped in the cookie — cheap way to detect a change. */
export function permissionVersion() {
  return readPermissionCookie()?.v ?? null;
}

// ── the permission set ───────────────────────────────────────────────────────

/**
 * Wraps a decoded payload with the query methods the UI uses.
 *
 * Build with `fromCookie()` or `fromPayload()` — both return the same shape, so
 * a component does not care whether the data arrived by cookie or by fetch.
 */
export class Permissions {
  constructor(payload) {
    this.raw = payload || null;
    this.version = payload?.v ?? null;
    this.isMaster = Boolean(payload?.master);
    this.oversize = Boolean(payload?.oversize);
    this.allBuyers = Boolean(payload?.buyers?.all ?? false);
    this.buyerCodes = (payload?.buyers?.codes || []).map((c) => String(c).toUpperCase());

    // The backend collapses identical per-buyer grids into a single '=' entry
    // listing the buyers that share it. Expand it back so lookups are uniform.
    const grants = payload?.grants || {};
    if (grants[SHARED_KEY] && Array.isArray(payload?.shared)) {
      this.grants = {};
      payload.shared.forEach((buyer) => {
        this.grants[String(buyer).toUpperCase()] = grants[SHARED_KEY];
      });
    } else {
      this.grants = grants;
    }
  }

  /** True when we hold no usable data — the caller should fetch /me/permissions/. */
  get isEmpty() {
    return !this.raw || this.oversize;
  }

  cellKey(module, screen, ipoType) {
    return `${module}.${screen}.${String(ipoType || 'all').toLowerCase()}`;
  }

  /**
   * Is this buyer inside the member's scope?
   *
   * A blank / null code means buyer-less data (Company Essentials, vendor codes,
   * company IPOs) — never hidden by buyer scope, its screen grant alone decides.
   */
  buyerAllowed(buyerCode) {
    if (this.isMaster || this.allBuyers) return true;
    if (!buyerCode) return true;
    return this.buyerCodes.includes(String(buyerCode).toUpperCase());
  }

  /** Effective 0–3 for one cell. Pass no buyer to ask about buyer-less data. */
  level(module, screen, ipoType = 'all', buyerCode = null) {
    if (this.isMaster) return LEVEL.EDIT;
    const key = this.cellKey(module, screen, ipoType);

    if (!buyerCode) {
      return Object.values(this.grants).reduce(
        (best, cells) => Math.max(best, cells?.[key]?.lv || 0),
        0,
      );
    }
    if (!this.buyerAllowed(buyerCode)) return LEVEL.NONE;

    const upper = String(buyerCode).toUpperCase();
    return Math.max(
      this.grants[ALL_BUYERS]?.[key]?.lv || 0,
      this.grants[upper]?.[key]?.lv || 0,
    );
  }

  /** `can('ipom', 'spec', 'update', 'production', 'WALMART')` */
  can(module, screen, action, ipoType = 'all', buyerCode = null) {
    if (this.isMaster) return true;
    if (action === 'approve') return this.canApprove(module, screen, ipoType, buyerCode);
    if (action === 'delete') return false; // master admin only, never granted
    const required = LEVEL_FOR_ACTION[action];
    if (!required) return false;
    return this.level(module, screen, ipoType, buyerCode) >= required;
  }

  /** Approve is independent of level — Read + Approve is a valid grant. */
  canApprove(module, screen, ipoType = 'all', buyerCode = null) {
    if (this.isMaster) return true;
    const key = this.cellKey(module, screen, ipoType);

    if (!buyerCode) {
      return Object.values(this.grants).some((cells) => cells?.[key]?.ap);
    }
    if (!this.buyerAllowed(buyerCode)) return false;

    const upper = String(buyerCode).toUpperCase();
    return Boolean(this.grants[ALL_BUYERS]?.[key]?.ap || this.grants[upper]?.[key]?.ap);
  }

  /** Dotted-string form: `has('ipom.spec.production.update')`. */
  has(dotted, buyerCode = null) {
    const parts = String(dotted).split('.');
    if (parts.length !== 4) return false;
    const [module, screen, ipoType, action] = parts;
    return this.can(module, screen, action, ipoType, buyerCode);
  }

  /** Any access at all to a module — for showing or hiding a nav section. */
  canSeeModule(moduleId) {
    if (this.isMaster) return true;
    const prefix = `${moduleId}.`;
    return Object.values(this.grants).some((cells) =>
      Object.keys(cells || {}).some((key) => key.startsWith(prefix) && cells[key].lv > 0),
    );
  }

  /** Any access at all to a screen, across every IPO type and buyer. */
  canSeeScreen(moduleId, screenId) {
    if (this.isMaster) return true;
    const prefix = `${moduleId}.${screenId}.`;
    return Object.values(this.grants).some((cells) =>
      Object.keys(cells || {}).some((key) => key.startsWith(prefix) && cells[key].lv > 0),
    );
  }

  /** Buyer codes the member may see, or null meaning no restriction. */
  visibleBuyers() {
    if (this.isMaster || this.allBuyers) return null;
    return [...this.buyerCodes];
  }

  /** Every dotted permission string held, sorted — handy for debugging. */
  flat() {
    const out = new Set();
    Object.values(this.grants).forEach((cells) => {
      Object.entries(cells || {}).forEach(([key, { lv, ap }]) => {
        if (lv >= LEVEL.READ) out.add(`${key}.read`);
        if (lv >= LEVEL.WRITE) out.add(`${key}.create`);
        if (lv >= LEVEL.EDIT) out.add(`${key}.update`);
        if (ap) out.add(`${key}.approve`);
      });
    });
    return [...out].sort();
  }
}

/** Build from the cookie the backend stamped. */
export function fromCookie() {
  return new Permissions(readPermissionCookie());
}

/** Build from a GET /api/auth/me/permissions/ response body. */
export function fromPayload(payload) {
  return new Permissions(payload);
}

/** An empty set — denies everything. Used before the first load resolves. */
export const NO_PERMISSIONS = new Permissions(null);
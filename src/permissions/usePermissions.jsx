// ── React binding for the current user's permissions ─────────────────────────
//
// Wrap the app once:
//
//     <PermissionProvider>
//       <App />
//     </PermissionProvider>
//
// Then anywhere:
//
//     const { can, canSeeModule, isMaster } = usePermissions();
//     {can('ipom', 'spec', 'update', orderType, buyerCode) && <EditButton />}
//
// The cookie is re-read on navigation and on tab focus, so a grant made by the
// master admin lights up the UI on the member's next interaction without a
// reload. Rendering only — the API enforces independently.

import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import {
  getMyPermissions,
  SESSION_AUTHENTICATED_EVENT,
  SESSION_EXPIRED_EVENT,
} from '../api/authService';
import {
  NO_PERMISSIONS, fromCookie, fromPayload, permissionVersion,
} from './permissionClient';

const PermissionContext = createContext({
  perms: NO_PERMISSIONS,
  loading: true,
  refresh: async () => {},
});

export function PermissionProvider({ children }) {
  const [perms, setPerms] = useState(() => fromCookie());
  const [loading, setLoading] = useState(true);
  const versionRef = useRef(perms.version);

  /** Pull the authoritative copy from the API. */
  const refresh = useCallback(async () => {
    try {
      const payload = await getMyPermissions();
      const next = fromPayload(payload);
      versionRef.current = next.version;
      setPerms(next);
      return next;
    } catch {
      // Offline or logged out — keep whatever we had rather than blanking the UI
      // mid-session. Every action still goes through the API, which will refuse
      // anything that is genuinely not allowed.
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Adopt the cookie when its version has moved.
   *
   * This is the path that makes a permission change appear without a reload: the
   * member's next API call gets a re-stamped cookie, and the next focus or
   * navigation picks it up.
   */
  const syncFromCookie = useCallback(() => {
    const cookieVersion = permissionVersion();
    if (cookieVersion == null || cookieVersion === versionRef.current) return;
    const next = fromCookie();
    // The cookie is a version-only stub when the grid is too large to fit —
    // fall back to the API rather than rendering with nothing.
    if (next.isEmpty) {
      refresh();
      return;
    }
    versionRef.current = next.version;
    setPerms(next);
  }, [refresh]);

  useEffect(() => {
    // First load: trust the API, not the cookie, so a stale cookie from a
    // previous session can never grant a phantom button on the first paint.
    refresh();
  }, [refresh]);

  // A login that happens while the app is already mounted (no page reload) fires
  // SESSION_AUTHENTICATED_EVENT — re-fetch so the freshly signed-in user has their
  // permissions right away instead of being stuck with NO_PERMISSIONS until a
  // reload. On session-expiry, drop back to nothing so a logged-out UI never keeps
  // the previous user's grants.
  useEffect(() => {
    const onAuthenticated = () => refresh();
    const onExpired = () => {
      versionRef.current = NO_PERMISSIONS.version;
      setPerms(NO_PERMISSIONS);
    };
    window.addEventListener(SESSION_AUTHENTICATED_EVENT, onAuthenticated);
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired);
    return () => {
      window.removeEventListener(SESSION_AUTHENTICATED_EVENT, onAuthenticated);
      window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired);
    };
  }, [refresh]);

  useEffect(() => {
    const onFocus = () => syncFromCookie();
    const onVisible = () => {
      if (document.visibilityState === 'visible') syncFromCookie();
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisible);
    // Cheap safety net for a long-lived tab that never loses focus.
    const timer = setInterval(syncFromCookie, 30000);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisible);
      clearInterval(timer);
    };
  }, [syncFromCookie]);

  const value = useMemo(
    () => ({ perms, loading, refresh, syncFromCookie }),
    [perms, loading, refresh, syncFromCookie],
  );

  return (
    <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>
  );
}

/**
 * The permission API for components.
 *
 * Returns the query methods bound to the current set, plus `perms` itself for
 * anything more involved.
 */
export function usePermissions() {
  const ctx = useContext(PermissionContext);
  const { perms } = ctx;

  return useMemo(
    () => ({
      ...ctx,
      isMaster: perms.isMaster,
      loading: ctx.loading,
      can: (m, s, a, ipo, buyer) => perms.can(m, s, a, ipo, buyer),
      canApprove: (m, s, ipo, buyer) => perms.canApprove(m, s, ipo, buyer),
      level: (m, s, ipo, buyer) => perms.level(m, s, ipo, buyer),
      has: (dotted, buyer) => perms.has(dotted, buyer),
      canSeeModule: (moduleId) => perms.canSeeModule(moduleId),
      canSeeScreen: (moduleId, screenId) => perms.canSeeScreen(moduleId, screenId),
      buyerAllowed: (code) => perms.buyerAllowed(code),
      visibleBuyers: () => perms.visibleBuyers(),
    }),
    [ctx, perms],
  );
}

/**
 * Render children only when the grant is held.
 *
 *     <IfAllowed module="ipom" screen="spec" action="update" ipoType={orderType}>
 *       <EditButton />
 *     </IfAllowed>
 */
export function IfAllowed({
  module, screen, action = 'read', ipoType = 'all', buyer = null,
  fallback = null, children,
}) {
  const { can } = usePermissions();
  return can(module, screen, action, ipoType, buyer) ? children : fallback;
}

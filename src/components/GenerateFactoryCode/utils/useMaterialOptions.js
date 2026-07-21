import { createContext, createElement, useCallback, useContext, useEffect, useState } from 'react';
import { getMaterialOptions, saveMaterialOption } from '../../../services/integration';

/**
 * Tenant-scoped custom dropdown options for raw-material specs.
 *
 * The built-in option lists are static frontend data. When a user types a value
 * that isn't in those lists (e.g. a new Fabric Name), we persist it to the tenant
 * via the material-options API so it reappears for everyone and can later be
 * matched against stock.
 *
 * This used to be a plain hook called inside Step2 — but Step2 unmounts every
 * time the wizard switches steps (steps render via `switch (currentStep)`), which
 * threw away the freshly-typed values until a full reload. It now lives in a
 * CONTEXT PROVIDER mounted once at the wizard root, so the cache survives step
 * navigation and every row/step/section shares one source of truth. A value
 * typed on one row is instantly visible on the next.
 *
 * Exposed API (unchanged, so call-sites don't move):
 *   getCustomOptions(materialType, fieldKey, parentKey?) -> string[]
 *   addCustomOption(materialType, fieldKey, parentKey, value) -> Promise<void>
 *   mergeOptions(builtIn, materialType, fieldKey, parentKey?) -> string[]  (deduped)
 */
const keyOf = (materialType, fieldKey, parentKey = '') =>
  `${materialType}|${fieldKey}|${parentKey || ''}`;

// Inert default so a stray `useMaterialOptions()` outside the provider never
// crashes — it just behaves like there are no custom options yet.
const INERT = {
  getCustomOptions: () => [],
  mergeOptions: (builtIn = []) => builtIn,
  addCustomOption: async () => {},
};

const MaterialOptionsContext = createContext(INERT);

// The actual state + API wiring. Kept as a hook so the provider stays tiny.
const useMaterialOptionsStore = () => {
  const [optionsMap, setOptionsMap] = useState({}); // key -> string[]

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getMaterialOptions();
        const list = res?.results || res?.data || (Array.isArray(res) ? res : []);
        const map = {};
        (Array.isArray(list) ? list : []).forEach((o) => {
          if (!o || !o.value) return;
          const k = keyOf(o.material_type, o.field_key, o.parent_key);
          (map[k] = map[k] || []).push(o.value);
        });
        if (!cancelled) setOptionsMap(map);
      } catch (e) {
        // Non-fatal: custom options simply won't appear until the API is reachable.
        if (import.meta.env.DEV) console.warn('Failed to load material options:', e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const getCustomOptions = useCallback(
    (materialType, fieldKey, parentKey = '') =>
      optionsMap[keyOf(materialType, fieldKey, parentKey)] || [],
    [optionsMap],
  );

  // Merge built-in options with tenant custom options, case-insensitively deduped.
  const mergeOptions = useCallback(
    (builtIn = [], materialType, fieldKey, parentKey = '') => {
      const custom = optionsMap[keyOf(materialType, fieldKey, parentKey)] || [];
      if (custom.length === 0) return builtIn;
      const seen = new Set((builtIn || []).map((o) => String(o).toLowerCase()));
      const extra = custom.filter((o) => !seen.has(String(o).toLowerCase()));
      return [...(builtIn || []), ...extra];
    },
    [optionsMap],
  );

  const addCustomOption = useCallback(async (materialType, fieldKey, parentKey, value) => {
    const v = (value || '').trim();
    if (!v || !materialType || !fieldKey) return;
    const k = keyOf(materialType, fieldKey, parentKey);
    // Optimistic local update so the value is selectable immediately, everywhere.
    setOptionsMap((prev) => {
      const existing = prev[k] || [];
      if (existing.some((x) => x.toLowerCase() === v.toLowerCase())) return prev;
      return { ...prev, [k]: [...existing, v] };
    });
    // Awaited so callers (e.g. the TenantDropdown spinner) can show real progress.
    try {
      await saveMaterialOption({ materialType, fieldKey, parentKey: parentKey || '', value: v });
    } catch (e) {
      if (import.meta.env.DEV) console.warn('Failed to save material option:', e);
      throw e; // let the caller decide how to surface a failed tenant save
    }
  }, []);

  return { getCustomOptions, mergeOptions, addCustomOption };
};

// Mount once near the wizard root: <MaterialOptionsProvider>…</MaterialOptionsProvider>
export const MaterialOptionsProvider = ({ children }) => {
  const store = useMaterialOptionsStore();
  return createElement(MaterialOptionsContext.Provider, { value: store }, children);
};

// Consumed by Step2 and the raw-material spec components exactly as before.
export const useMaterialOptions = () => useContext(MaterialOptionsContext);

export default useMaterialOptions;
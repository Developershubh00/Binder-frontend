import { useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * TenantDropdown — one dropdown to rule them all.
 *
 * A react-select combobox that keeps the "pick from the list OR type your own"
 * behaviour of the old bespoke SearchableDropdown, themed to match the app.
 * When the user types a value that isn't in the list, react-select shows an
 * `Add "…"` row; choosing it (Enter or click) commits the value AND, if an
 * `onCustomValue` handler is supplied, persists it tenant-wide via that handler
 * while a small inline spinner shows (the Purchase-master-sheet save UX). Once
 * saved, the value is a normal option for everyone in the tenant.
 *
 * Contract is a superset of the old SearchableDropdown so call-sites swap 1:1:
 *   value            string (the raw selected value; '' when cleared)
 *   onChange         (value: string) => void
 *   options          string[]  (built-in list already merged with tenant custom values)
 *   onCustomValue    (value: string) => Promise|void   persist a newly typed value (optional)
 *   creatable        allow typing new values (default true)
 *   disabled / error / className  same meaning as before ('border-red-*' => error)
 *
 * Behaviour note vs the old dropdown: a typed value is committed on Enter or by
 * clicking the `Add "…"` row — NOT silently on blur. That's deliberate: these
 * lists are shared across the whole organisation, so we don't want a stray blur
 * to publish half-typed junk to every teammate.
 */

const MIN_SPINNER_MS = 650; // keep a fast save visible instead of flashing
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const toOption = (v) => ({ value: String(v), label: String(v) });

const LoadingIndicator = () => (
  <Loader2 className="mr-1 h-4 w-4 animate-spin text-muted-foreground" aria-label="Saving" />
);

const themedClassNames = (isError) => ({
  control: ({ isFocused, isDisabled }) =>
    cn(
      'min-h-[44px] w-full rounded-md border px-2 text-sm shadow-xs transition-colors',
      isDisabled
        ? 'cursor-not-allowed bg-muted opacity-60 border-input'
        : isFocused
          ? 'cursor-text border-ring ring-[3px] ring-ring/50 bg-white'
          : 'cursor-pointer border-input hover:border-ring/60 bg-white',
      isError && 'border-destructive',
    ),
  valueContainer: () => 'gap-1 px-2 py-1',
  placeholder: () => 'text-muted-foreground/70',
  singleValue: () => 'text-foreground',
  input: () => 'text-foreground',
  indicatorsContainer: () => 'gap-1',
  dropdownIndicator: () => 'px-1 text-muted-foreground transition-colors hover:text-foreground',
  clearIndicator: () => 'px-1 text-muted-foreground transition-colors hover:text-foreground',
  indicatorSeparator: () => 'hidden',
  menu: () =>
    'mt-1 overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md',
  menuList: () => 'max-h-60 p-1',
  option: ({ isFocused, isSelected }) =>
    cn(
      'cursor-pointer rounded-sm px-3 py-2 text-sm transition-colors',
      isSelected
        ? 'bg-primary text-primary-foreground'
        : isFocused
          ? 'bg-accent text-accent-foreground'
          : 'text-foreground',
    ),
  noOptionsMessage: () => 'px-3 py-2 text-sm text-muted-foreground',
});

const TenantDropdown = ({
  value,
  onChange,
  options = [],
  placeholder = 'Select or type…',
  disabled = false,
  error = false,
  className = '',
  creatable = true,
  strictMode = false, // legacy SearchableDropdown prop: true => pick-only (no typing new values)
  onCustomValue,
  isClearable = false,
  menuPortal = true, // portal the menu to <body> so it isn't clipped by overflow containers
  inputId,
}) => {
  const [saving, setSaving] = useState(false);
  const allowCreate = creatable && !strictMode;

  const opts = (options || []).map(toOption);
  const hasValue = value != null && value !== '';
  const selected = hasValue
    ? opts.find((o) => o.value === String(value)) || toOption(value)
    : null;
  // Make sure a free-typed value that isn't in the list still displays.
  const mergedOpts =
    hasValue && !opts.some((o) => o.value === String(value)) ? [selected, ...opts] : opts;

  const isError = error || /border-(red|destructive)/.test(className || '');

  const handleCreate = async (raw) => {
    const v = (raw || '').trim();
    if (!v) return;
    // Case-insensitive: if it already exists, just select the canonical spelling.
    const existing = (options || []).find((o) => String(o).toLowerCase() === v.toLowerCase());
    if (existing) {
      onChange(String(existing));
      return;
    }
    onChange(v); // select immediately so the field is filled even if the save lags
    if (!onCustomValue) return; // free-text field with no tenant memory — nothing to persist
    setSaving(true);
    const startedAt = Date.now();
    try {
      await onCustomValue(v);
    } catch {
      // The persist layer logs/surfaces its own errors; the value stays selected locally.
    } finally {
      const elapsed = Date.now() - startedAt;
      if (elapsed < MIN_SPINNER_MS) await sleep(MIN_SPINNER_MS - elapsed);
      setSaving(false);
    }
  };

  const Cmp = allowCreate ? CreatableSelect : Select;

  return (
    <Cmp
      inputId={inputId}
      unstyled
      isDisabled={disabled || saving}
      isClearable={isClearable}
      isSearchable
      isLoading={saving}
      placeholder={placeholder}
      options={mergedOpts}
      value={selected}
      onChange={(opt) => onChange(opt ? opt.value : '')}
      onCreateOption={allowCreate ? handleCreate : undefined}
      formatCreateLabel={(input) => `Add "${input}"`}
      createOptionPosition="first"
      menuPlacement="auto"
      menuPortalTarget={menuPortal && typeof document !== 'undefined' ? document.body : null}
      menuPosition={menuPortal ? 'fixed' : 'absolute'}
      styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
      components={{ LoadingIndicator }}
      classNames={themedClassNames(isError)}
    />
  );
};

export default TenantDropdown;
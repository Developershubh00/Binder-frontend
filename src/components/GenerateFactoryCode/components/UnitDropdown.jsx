import { cn } from '@/lib/utils';

const UNIT_OPTIONS = ['CM', 'KGS', 'PCS'];

/**
 * Reusable unit dropdown for packaging forms.
 * - Placeholder text when nothing is selected
 * - Options: CM, KGS, PCS
 */
export default function UnitDropdown({
  value,
  onChange,
  className,
  style,
  placeholder = 'Select Unit',
  ...rest
}) {
  const isEmpty = (value ?? '') === '';

  return (
    <select
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        'text-sm bg-transparent focus:outline-none flex-grow',
        isEmpty ? 'text-gray-400' : 'text-gray-900',
        className
      )}
      style={{ padding: '0 10px', height: '100%', ...style }}
      {...rest}
    >
      <option value="" className="text-gray-400">{placeholder}</option>
      {UNIT_OPTIONS.map((opt) => (
        <option key={opt} value={opt} className="text-gray-900">{opt}</option>
      ))}
    </select>
  );
}

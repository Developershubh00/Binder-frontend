import { cn } from '@/lib/utils';

const UNIT_OPTIONS = ['CM', 'KGS', 'PCS'];

/**
 * Reusable unit dropdown for packaging forms.
 * - Placeholder "Unit" (dimmed, disabled) when nothing selected — stays dimmed even when focused
 * - Options: CM, KGS, PCS (normal text)
 */
export default function UnitDropdown({ value, onChange, className, style, ...rest }) {
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
      <option value="" disabled className="text-gray-400">Unit</option>
      {UNIT_OPTIONS.map((opt) => (
        <option key={opt} value={opt} className="text-gray-900">{opt}</option>
      ))}
    </select>
  );
}

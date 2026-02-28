import { Field } from '@/components/ui/field';
import { cn } from '@/lib/utils';

const QualityVerificationToggle = ({
  value,
  onChange,
  label = 'Quality Verification',
  width = 'sm',
  className
}) => {
  const normalized = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value || 'No';
  const isYes = normalized === 'Yes';
  const isNo = normalized === 'No';

  return (
    <Field label={label} width={width} className={className}>
      <div className="inline-flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-1">
        <button
          type="button"
          className={cn(
            'rounded-md px-3 py-2 text-sm font-semibold transition-colors',
            isYes ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-accent'
          )}
          aria-pressed={isYes}
          onClick={() => onChange('Yes')}
        >
          Yes
        </button>
        <button
          type="button"
          className={cn(
            'rounded-md px-3 py-2 text-sm font-semibold transition-colors',
            isNo ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-accent'
          )}
          aria-pressed={isNo}
          onClick={() => onChange('No')}
        >
          No
        </button>
      </div>
    </Field>
  );
};

export default QualityVerificationToggle;

import { useId } from 'react';
import { Field } from '@/components/ui/field';
import { cn } from '@/lib/utils';

const QualityVerificationToggle = ({
  value,
  onChange,
  label = 'Do you want the goods to be quality inspected ?',
  width = 'sm',
  className
}) => {
  const normalized = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : (value === 'Yes' || value === 'No' ? value : '');
  const isYes = normalized === 'Yes';
  const isNo = normalized === 'No';
  const groupName = `quality-verification-${useId()}`;

  const options = [
    { label: 'Yes', value: 'Yes', selected: isYes },
    { label: 'No', value: 'No', selected: isNo }
  ];

  return (
    <Field label={label} width={width} className={cn('w-fit', '[&>label]:whitespace-nowrap', className)}>
      <div
        className="flex items-center gap-4"
        role="radiogroup"
        aria-label={label}
      >
        {options.map((option) => (
          <label
            key={option.value}
            className="group relative flex cursor-pointer items-center gap-2 text-sm font-medium text-muted-foreground transition-colors"
          >
            <span
              className={cn(
                'flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border transition-all duration-200',
                option.selected ? 'border-primary bg-primary' : 'border-muted-foreground/40 bg-transparent'
              )}
            >
              {option.selected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
            </span>
            <span
              className={cn(
                'transition-colors duration-200',
                option.selected ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {option.label}
            </span>
            <input
              type="radio"
              name={groupName}
              value={option.value}
              className="absolute inset-0 size-full cursor-pointer opacity-0"
              checked={option.selected}
              onChange={() => onChange(option.value)}
              tabIndex={0}
            />
          </label>
        ))}
      </div>
    </Field>
  );
};

export default QualityVerificationToggle;

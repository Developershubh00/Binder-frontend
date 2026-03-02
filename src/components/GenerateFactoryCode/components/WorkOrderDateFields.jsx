import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

const todayDate = new Date().toISOString().split('T')[0];
const clampPastDate = (value) => {
  if (!value) return value;
  return value < todayDate ? todayDate : value;
};

const WorkOrderDateFields = ({
  startDate,
  dateOfCompletion,
  onChange,
  errorStartDate,
  errorDateOfCompletion,
  className = ''
}) => (
  <div className={className} style={{ display: 'flex', flexWrap: 'wrap', gap: '24px 32px', marginTop: '16px' }}>
    <Field
      label="START DATE"
      required
      width="sm"
      error={errorStartDate}
      style={{ minWidth: '160px' }}
    >
      <Input
        type="date"
        value={startDate || ''}
        onChange={(e) => onChange('startDate', clampPastDate(e.target.value))}
        min={todayDate}
        aria-invalid={Boolean(errorStartDate)}
        className={errorStartDate ? 'border-destructive' : ''}
      />
    </Field>
    <Field
      label="DATE OF COMPLETION"
      required
      width="sm"
      error={errorDateOfCompletion}
      style={{ minWidth: '160px' }}
    >
      <Input
        type="date"
        value={dateOfCompletion || ''}
        onChange={(e) => onChange('dateOfCompletion', clampPastDate(e.target.value))}
        min={todayDate}
        aria-invalid={Boolean(errorDateOfCompletion)}
        className={errorDateOfCompletion ? 'border-destructive' : ''}
      />
    </Field>
  </div>
);

export default WorkOrderDateFields;

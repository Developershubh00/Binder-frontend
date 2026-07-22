import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import ThemedSelect from '../IMS/StockSheet/ThemedSelect';
import {
  getUQRFormDraft,
  saveUQRFormDraft,
  getContextualUQRFormDraft,
  saveContextualUQRFormDraft,
} from '../../services/integration';

// Shared Tailwind class strings — flat/clean theme matching the StockSheet revamp.
const LABEL =
  'mb-2 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground';
const CTRL =
  'w-full rounded-md border border-[#e2e3e8] bg-card px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-70';
const TCTRL =
  'w-full rounded-md border border-[#e2e3e8] bg-card px-2.5 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-70';
const SECTION_TITLE =
  'mb-3 text-[11px] font-semibold uppercase tracking-wider text-foreground/60';
const TH =
  'border-b border-r border-[#e2e3e8] bg-muted px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-foreground whitespace-nowrap';
const TD = 'border-b border-r border-[#e2e3e8] px-2 py-1.5 align-middle';
const PRIMARY_BTN =
  'inline-flex cursor-pointer items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50';
const OUTLINE_BTN =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-[#e2e3e8] bg-card px-4 py-2 text-sm font-semibold text-foreground/70 transition-colors hover:bg-muted';
const NO_SPIN =
  '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none';

const toOptions = (values) => (values || []).map((v) => ({ value: v, label: v }));

const pad2 = (value) => String(value).padStart(2, '0');

const todayDateValue = () => {
  const now = new Date();
  return `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;
};

const nowTimeValue = () => {
  const now = new Date();
  return `${pad2(now.getHours())}:${pad2(now.getMinutes())}`;
};

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const getUserDisplayName = (user) => {
  if (!user) return '';
  const firstLast = [user.first_name, user.last_name]
    .filter(Boolean)
    .join(' ')
    .trim();
  return firstLast || user.full_name || user.name || user.email || '';
};

// Prefill DATE/TIME (now) and the "checked/approved/inspected by" fields (name from the
// logged-in `user` in localStorage) for whichever of these fields the form actually has.
// The user's id is kept alongside the name so it's saved in the draft payload.
const buildPrefill = (sections, readOnly) => {
  if (readOnly) return {};
  const fieldNames = new Set();
  sections?.forEach((section) =>
    section?.fields?.forEach((field) => fieldNames.add(field.name)),
  );

  const user = getStoredUser();
  const name = getUserDisplayName(user);
  const userId = user?.id || '';

  const prefill = {};
  if (fieldNames.has('date')) prefill.date = todayDateValue();
  if (fieldNames.has('time')) prefill.time = nowTimeValue();
  ['qualityCheckedBy', 'approvedBy', 'inspectedBy'].forEach((fieldName) => {
    if (fieldNames.has(fieldName)) prefill[fieldName] = name;
  });
  if (fieldNames.has('qualityCheckedBy')) prefill.qualityCheckedById = userId;
  if (fieldNames.has('approvedBy')) prefill.approvedById = userId;
  if (fieldNames.has('inspectedBy')) prefill.inspectedById = userId;
  return prefill;
};

const BaseFormTemplate = ({
  formId,
  title,
  sections,
  tableConfig,
  draftStorageKey = '',
  onSubmitSuccess,
  apiContext = null,
  readOnly = false,
  // Auto-fill values from the picked IPO/IPC: header fields (e.g. UIN, PO NO,
  // FACTORY PO CODE) and the first table row (e.g. USN). A saved draft still wins.
  prefillValues = null,
  tablePrefill = null,
}) => {
  const getInitialState = () => {
    const state = {};
    sections?.forEach((section) => {
      section?.fields?.forEach((field) => {
        state[field.name] = field.type === 'checkbox' ? false : '';
      });
    });
    return state;
  };

  const getEmptyRow = () => {
    if (!tableConfig?.columns?.length) return {};
    const row = {};
    tableConfig.columns.forEach((column) => {
      row[column.name] = '';
    });
    return row;
  };

  const [formData, setFormData] = useState(getInitialState());
  const [tableRows, setTableRows] = useState(() => (tableConfig ? [getEmptyRow()] : []));
  const [submitMessage, setSubmitMessage] = useState('');

  const applyPersistedPayload = (payload, initialFormState, initialTableRows) => {
    if (!payload || typeof payload !== 'object') return false;

    const directDraft = payload.formData || Array.isArray(payload.tableRows) ? payload : null;
    const nestedDraft =
      payload.payload && typeof payload.payload === 'object'
        ? payload.payload
        : payload.data?.payload && typeof payload.data.payload === 'object'
          ? payload.data.payload
          : payload.data && (payload.data.formData || Array.isArray(payload.data.tableRows))
            ? payload.data
            : null;

    const draft = directDraft || nestedDraft;
    if (!draft) return false;

    const nextFormData =
      draft.formData && typeof draft.formData === 'object'
        ? { ...initialFormState, ...draft.formData }
        : initialFormState;
    const nextTableRows =
      Array.isArray(draft.tableRows) && draft.tableRows.length > 0
        ? draft.tableRows
        : initialTableRows;

    setFormData(nextFormData);
    setTableRows(nextTableRows);
    return true;
  };

  useEffect(() => {
    // Start from a prefilled state (today's date/time + current user for the
    // checked/approved-by fields, plus IPO/IPC context values); a loaded draft
    // merges on top and wins.
    const initialFormState = {
      ...getInitialState(),
      ...buildPrefill(sections, readOnly),
      ...(readOnly ? {} : prefillValues || {}),
    };
    // tablePrefill may be a single row object (fills the first row) or an array
    // of row objects (one prefilled table row each — e.g. one row per IPC
    // material that needs this UQR form). Empty cells fall back to getEmptyRow().
    const buildPrefilledRows = () => {
      if (!tableConfig) return [];
      if (readOnly) return [getEmptyRow()];
      if (Array.isArray(tablePrefill) && tablePrefill.length > 0) {
        return tablePrefill.map((row) => ({ ...getEmptyRow(), ...(row || {}) }));
      }
      return [{ ...getEmptyRow(), ...(tablePrefill || {}) }];
    };
    const initialTableRows = buildPrefilledRows();
    let cancelled = false;

    setFormData(initialFormState);
    setTableRows(initialTableRows);
    setSubmitMessage('');

    const loadFromLocal = () => {
      if (!draftStorageKey) return false;
      try {
        const storedPayload = JSON.parse(localStorage.getItem(draftStorageKey) || 'null');
        return applyPersistedPayload(storedPayload, initialFormState, initialTableRows);
      } catch {
        return false;
      }
    };

    const loadFromApi = async () => {
      if (!formId) return false;
      try {
        const response = apiContext?.orderType && apiContext?.ipoCode && apiContext?.ipcCode
          ? await getContextualUQRFormDraft({
              orderType: apiContext.orderType,
              ipoCode: apiContext.ipoCode,
              ipcCode: apiContext.ipcCode,
              formId,
            })
          : await getUQRFormDraft(formId);

        if (cancelled) return false;
        return applyPersistedPayload(response, initialFormState, initialTableRows);
      } catch {
        return false;
      }
    };

    (async () => {
      const loadedFromApi = await loadFromApi();
      if (!loadedFromApi) {
        loadFromLocal();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    formId,
    draftStorageKey,
    sections,
    tableConfig,
    readOnly,
    prefillValues,
    tablePrefill,
    apiContext?.orderType,
    apiContext?.ipoCode,
    apiContext?.ipcCode,
  ]);

  const handleRemoveRow = (rowIndex) => {
    if (readOnly) return;
    setTableRows((previous) => {
      if (previous.length <= 1) return previous;
      const updatedRows = previous.filter((_, index) => index !== rowIndex);
      return updatedRows.length > 0 ? updatedRows : [getEmptyRow()];
    });
  };

  const handleAddRow = () => {
    if (readOnly) return;
    setTableRows((previous) => {
      if (!tableConfig || previous.length >= 50) return previous;
      return [...previous, getEmptyRow()];
    });
  };

  const setFieldValue = (name, value) => {
    if (readOnly) return;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const setTableCellValue = (rowIndex, name, value) => {
    if (readOnly) return;
    setTableRows((previous) => {
      const next = [...previous];
      next[rowIndex] = { ...next[rowIndex], [name]: value };
      return next;
    });
  };

  const renderField = (field) => (
    <div key={field.name}>
      <label className={LABEL}>
        {field.label} {field.required && <span className="text-primary">*</span>}
      </label>
      {field.type === 'select' ? (
        <ThemedSelect
          value={formData[field.name] || ''}
          onChange={(value) => setFieldValue(field.name, value)}
          options={toOptions(field.options)}
          placeholder="Select"
          isDisabled={readOnly}
          isSearchable={false}
        />
      ) : field.type === 'checkbox' ? (
        <input
          type="checkbox"
          checked={!!formData[field.name]}
          onChange={(event) => setFieldValue(field.name, event.target.checked)}
          disabled={readOnly}
          className="h-4.5 w-4.5 cursor-pointer accent-[#f94d00]"
        />
      ) : (
        <input
          type={field.type || 'text'}
          value={formData[field.name] || ''}
          onChange={(event) => setFieldValue(field.name, event.target.value)}
          className={`${CTRL} ${field.type === 'number' ? NO_SPIN : ''}`}
          readOnly={readOnly}
          disabled={readOnly}
        />
      )}
    </div>
  );

  const handleSubmit = async () => {
    if (readOnly) return;

    const payload = { formData, tableRows };
    let remoteSaved = false;
    let localSaved = false;

    if (formId && apiContext?.orderType && apiContext?.ipoCode && apiContext?.ipcCode) {
      try {
        await saveContextualUQRFormDraft({
          orderType: apiContext.orderType,
          ipoCode: apiContext.ipoCode,
          ipcCode: apiContext.ipcCode,
          formId,
          payload,
        });
        remoteSaved = true;
      } catch (error) {
        console.warn('Contextual UQR draft API save failed', error);
      }
    } else if (formId && !draftStorageKey) {
      try {
        await saveUQRFormDraft(formId, payload);
        remoteSaved = true;
      } catch (error) {
        console.warn('UQR draft API save failed', error);
      }
    }

    if (draftStorageKey) {
      try {
        localStorage.setItem(draftStorageKey, JSON.stringify(payload));
        localSaved = true;
      } catch (error) {
        console.warn('Local UQR draft save failed', error);
      }
    }

    const saved = remoteSaved || localSaved;
    if (saved) {
      setSubmitMessage(remoteSaved ? 'Form submitted successfully.' : 'Form saved locally. API sync pending.');
      onSubmitSuccess?.({ formId, payload, draftStorageKey });
      return;
    }

    setSubmitMessage('Unable to submit form. Please try again.');
  };

  return (
    <form className="space-y-6">
      {/* Title band */}
      <div className="rounded-md bg-primary px-5 py-3.5">
        <h2 className="text-base font-bold uppercase tracking-wide text-primary-foreground">
          {title}
        </h2>
      </div>

      {/* Sections */}
      {sections?.map((section, index) => (
        <section key={index}>
          <h3 className={SECTION_TITLE}>{section.title}</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {section?.fields?.map(renderField)}
          </div>
        </section>
      ))}

      {/* Table */}
      {tableConfig && (
        <section>
          <h3 className={SECTION_TITLE}>{tableConfig.title}</h3>
          {/* pb gives an expanded in-cell dropdown room to render inside the
              horizontal-scroll wrapper (which would otherwise clip the menu). */}
          <div className="overflow-x-auto rounded-lg border border-[#e2e3e8] pb-52">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  {tableConfig.columns.map((column) => (
                    <th
                      key={column.name}
                      className={TH}
                      style={{ minWidth: column.type === 'select' ? 170 : 130 }}
                    >
                      {column.label}
                    </th>
                  ))}
                  {!readOnly && (
                    <th className={TH} style={{ width: 48, minWidth: 48 }} aria-label="Actions" />
                  )}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {tableConfig.columns.map((column) => (
                      <td
                        key={column.name}
                        className={TD}
                        style={{ minWidth: column.type === 'select' ? 170 : 130 }}
                      >
                        {column.type === 'select' ? (
                          <ThemedSelect
                            value={row[column.name] || ''}
                            onChange={(value) =>
                              setTableCellValue(rowIndex, column.name, value)
                            }
                            options={toOptions(column.options)}
                            placeholder="Select"
                            isDisabled={readOnly}
                            isSearchable={false}
                          />
                        ) : (
                          <input
                            type={column.type || 'text'}
                            value={row[column.name] || ''}
                            onChange={(event) =>
                              setTableCellValue(rowIndex, column.name, event.target.value)
                            }
                            className={`${TCTRL} ${column.type === 'number' ? NO_SPIN : ''}`}
                            readOnly={readOnly}
                            disabled={readOnly}
                          />
                        )}
                      </td>
                    ))}
                    {!readOnly && (
                      <td className={`${TD} text-center`} style={{ width: 48, minWidth: 48 }}>
                        {tableRows.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveRow(rowIndex)}
                            title="Remove this entry"
                            className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!readOnly && (
            <div className="mt-3">
              <button type="button" className={OUTLINE_BTN} onClick={handleAddRow}>
                + Add Row
              </button>
            </div>
          )}
        </section>
      )}

      {/* Actions */}
      {(!readOnly || submitMessage) && (
        <div className="flex items-center justify-end gap-3 pt-1">
          {submitMessage && (
            <div
              className={`mr-auto text-sm font-semibold ${
                submitMessage.startsWith('Unable')
                  ? 'text-destructive'
                  : 'text-green-600'
              }`}
            >
              {submitMessage}
            </div>
          )}
          {!readOnly && (
            <button type="button" className={PRIMARY_BTN} onClick={handleSubmit}>
              Submit
            </button>
          )}
        </div>
      )}
    </form>
  );
};

export default BaseFormTemplate;

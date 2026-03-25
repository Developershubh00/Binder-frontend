import { useEffect, useState } from 'react';
import {
  getUQRFormDraft,
  saveUQRFormDraft,
  getContextualUQRFormDraft,
  saveContextualUQRFormDraft,
} from '../../services/integration';

const BaseFormTemplate = ({
  formId,
  title,
  sections,
  tableConfig,
  draftStorageKey = '',
  onSubmitSuccess,
  apiContext = null,
  readOnly = false,
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
    const initialFormState = getInitialState();
    const initialTableRows = tableConfig ? [getEmptyRow()] : [];
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
    apiContext?.orderType,
    apiContext?.ipoCode,
    apiContext?.ipcCode,
  ]);

  const handleChange = (event) => {
    if (readOnly) return;
    const { name, value, type, checked } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleTableChange = (rowIndex, event) => {
    if (readOnly) return;
    const { name, value } = event.target;
    const updatedRows = [...tableRows];
    updatedRows[rowIndex][name] = value;
    setTableRows(updatedRows);
  };

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

  const styles = {
    header: {
      fontSize: '24px',
      fontWeight: '700',
      marginBottom: '24px',
      color: 'var(--primary-foreground)',
      background: 'var(--primary)',
      padding: '16px 20px',
      borderRadius: 'var(--radius)',
      boxShadow: 'var(--shadow-sm)',
    },
    section: {
      marginBottom: '20px',
      padding: '20px',
      background: 'var(--card)',
      borderRadius: 'var(--radius)',
      border: '1px solid var(--border)',
    },
    sectionTitle: {
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '16px',
      color: '#000000',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '16px',
    },
    label: {
      display: 'block',
      fontWeight: '500',
      color: '#000000',
      fontSize: '13px',
      marginBottom: '6px',
    },
    input: {
      width: '100%',
      padding: '10px 12px',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      fontSize: '14px',
      background: 'var(--input)',
      color: 'var(--foreground)',
      outline: 'none',
    },
    cardGrid: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      marginTop: '10px',
    },
    cardRow: {
      position: 'relative',
      background: 'var(--background)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '16px',
      boxShadow: 'var(--shadow-xs)',
    },
    cardGridInner: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '12px',
    },
    cardFieldWrapper: {
      display: 'flex',
      flexDirection: 'column',
    },
    cardLabel: {
      fontSize: '11px',
      fontWeight: '600',
      color: '#000000',
      marginBottom: '4px',
      textTransform: 'uppercase',
    },
    cardInput: {
      width: '100%',
      padding: '8px 10px',
      border: '1px solid var(--border)',
      borderRadius: '4px',
      fontSize: '14px',
      background: 'var(--input)',
      color: 'var(--foreground)',
    },
    deleteBtn: {
      position: 'absolute',
      top: '8px',
      right: '8px',
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      border: '1px solid var(--border)',
      background: 'var(--background)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      color: 'var(--muted-foreground)',
      zIndex: 10,
    },
    actions: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'flex-end',
      marginTop: '24px',
    },
    btnPrimary: {
      padding: '10px 24px',
      border: 'none',
      borderRadius: 'var(--radius)',
      background: 'var(--primary)',
      color: 'var(--primary-foreground)',
      cursor: 'pointer',
      fontWeight: '600',
    },
    btnSecondary: {
      padding: '8px 14px',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      background: 'var(--background)',
      color: 'var(--foreground)',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '12px',
    },
  };

  const renderField = (field) => (
    <div key={field.name}>
      <label style={styles.label}>
        {field.label} {field.required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      {field.type === 'select' ? (
        <select
          name={field.name}
          value={formData[field.name] || ''}
          onChange={handleChange}
          style={styles.input}
          disabled={readOnly}
        >
          <option value="">Select</option>
          {field.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={field.type || 'text'}
          name={field.name}
          value={formData[field.name] || ''}
          onChange={handleChange}
          style={styles.input}
          readOnly={readOnly}
          disabled={readOnly}
          onFocus={(event) => {
            event.target.style.borderColor = 'var(--primary)';
          }}
          onBlur={(event) => {
            event.target.style.borderColor = 'var(--border)';
          }}
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
    <form>
      <h2 style={styles.header}>{title}</h2>

      {sections?.map((section, index) => (
        <div key={index} style={styles.section}>
          <h3 style={styles.sectionTitle}>{section.title}</h3>
          <div style={styles.grid}>{section?.fields?.map(renderField)}</div>
        </div>
      ))}

      {tableConfig && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>{tableConfig.title}</h3>
          <div style={styles.cardGrid}>
            {tableRows.map((row, rowIndex) => (
              <div key={rowIndex} style={styles.cardRow}>
                {!readOnly && tableRows.length > 1 && (
                  <button
                    type="button"
                    style={styles.deleteBtn}
                    onClick={() => handleRemoveRow(rowIndex)}
                    title="Remove this entry"
                  >
                    x
                  </button>
                )}

                <div style={styles.cardGridInner}>
                  {tableConfig.columns.map((column) => (
                    <div key={column.name} style={styles.cardFieldWrapper}>
                      <label style={styles.cardLabel}>{column.label}</label>
                      {column.type === 'select' ? (
                        <select
                          name={column.name}
                          value={row[column.name] || ''}
                          onChange={(event) => handleTableChange(rowIndex, event)}
                          style={styles.cardInput}
                          disabled={readOnly}
                        >
                          <option value="">Select</option>
                          {column.options?.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={column.type || 'text'}
                          name={column.name}
                          value={row[column.name] || ''}
                          onChange={(event) => handleTableChange(rowIndex, event)}
                          style={styles.cardInput}
                          readOnly={readOnly}
                          disabled={readOnly}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {!readOnly && (
            <div style={{ marginTop: '12px' }}>
              <button
                type="button"
                style={styles.btnSecondary}
                onClick={handleAddRow}
              >
                + Add Row
              </button>
            </div>
          )}
        </div>
      )}

      {(!readOnly || submitMessage) && (
        <div style={styles.actions}>
          {submitMessage && (
            <div
              style={{
                marginRight: 'auto',
                fontSize: '13px',
                fontWeight: 600,
                color: submitMessage.startsWith('Unable') ? '#b91c1c' : '#15803d',
              }}
            >
              {submitMessage}
            </div>
          )}
          {!readOnly && (
            <button
              type="button"
              style={styles.btnPrimary}
              onClick={handleSubmit}
            >
              Submit
            </button>
          )}
        </div>
      )}
    </form>
  );
};

export default BaseFormTemplate;

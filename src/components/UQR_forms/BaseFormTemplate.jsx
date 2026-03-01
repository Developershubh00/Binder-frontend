import React, { useState, useEffect } from 'react';

const BaseFormTemplate = ({ title, sections, tableConfig }) => {
  
  // --- 1. State Management ---
  const getInitialState = () => {
    const state = {};
    sections?.forEach(section => {
      section?.fields?.forEach(field => {
        state[field.name] = field.type === 'checkbox' ? false : '';
      });
    });
    return state;
  };

  const [formData, setFormData] = useState(getInitialState());

  // Table State
  const getEmptyRow = () => {
    if (!tableConfig?.columns?.length) return {};
    const row = {};
    tableConfig.columns.forEach(col => row[col.name] = '');
    return row;
  };

  const [tableRows, setTableRows] = useState(() => 
    tableConfig ? [getEmptyRow()] : []
  );

  // --- 2. Handlers ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTableChange = (rowIndex, e) => {
    const { name, value } = e.target;
    const updatedRows = [...tableRows];
    updatedRows[rowIndex][name] = value;
    setTableRows(updatedRows);
  };

  // Remove Row Handler
  const handleRemoveRow = (rowIndex) => {
    const updatedRows = tableRows.filter((_, index) => index !== rowIndex);
    setTableRows(updatedRows);
  };

  // Auto-add row logic
  useEffect(() => {
    if (!tableConfig || tableRows.length === 0) return;
    const lastRow = tableRows[tableRows.length - 1];
    const hasValue = Object.values(lastRow).some(val => 
      String(val ?? '').trim() !== ''
    );
    if (hasValue && tableRows.length < 50) {
      setTableRows(prev => [...prev, getEmptyRow()]);
    }
  }, [tableRows, tableConfig]);

  // --- 3. Styles ---
  const styles = {
    header: {
      fontSize: '24px', fontWeight: '700', marginBottom: '24px',
      color: 'var(--primary-foreground)', background: 'var(--primary)',
      padding: '16px 20px', borderRadius: 'var(--radius)',
      boxShadow: 'var(--shadow-sm)'
    },
    section: {
      marginBottom: '20px', padding: '20px',
      background: 'var(--card)', borderRadius: 'var(--radius)',
      border: '1px solid var(--border)'
    },
    sectionTitle: {
      fontSize: '14px', fontWeight: '600', marginBottom: '16px',
      color: '#000000', // Pure Black
      textTransform: 'uppercase', letterSpacing: '0.5px'
    },
    grid: {
      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px'
    },
    label: {
      display: 'block', fontWeight: '500', color: '#000000', // Pure Black
      fontSize: '13px', marginBottom: '6px'
    },
    input: {
      width: '100%', padding: '10px 12px', border: '1px solid var(--border)',
      borderRadius: 'var(--radius)', fontSize: '14px',
      background: 'var(--input)', color: 'var(--foreground)', outline: 'none'
    },
    // Card Styles
    cardGrid: {
      display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '10px'
    },
    cardRow: {
      position: 'relative', // For delete button positioning
      background: 'var(--background)', 
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '16px',
      boxShadow: 'var(--shadow-xs)'
    },
    cardGridInner: {
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
      gap: '12px' 
    },
    cardFieldWrapper: {
      display: 'flex', flexDirection: 'column'
    },
    cardLabel: {
      fontSize: '11px', fontWeight: '600', color: '#000000', // Pure Black
      marginBottom: '4px', textTransform: 'uppercase'
    },
    cardInput: {
      width: '100%', padding: '8px 10px', border: '1px solid var(--border)',
      borderRadius: '4px', fontSize: '14px',
      background: 'var(--input)', color: 'var(--foreground)'
    },
    // Delete Button Style
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
      zIndex: 10
    },
    actions: {
      display: 'flex', gap: '12px', justifyContent: 'flex-end',
      marginTop: '24px'
    },
    btnPrimary: {
      padding: '10px 24px', border: 'none', borderRadius: 'var(--radius)',
      background: 'var(--primary)', color: 'var(--primary-foreground)',
      cursor: 'pointer', fontWeight: '600'
    }
  };

  // --- 4. Render Helper ---
  const renderField = (field) => (
    <div key={field.name}>
      <label style={styles.label}>
        {field.label} {field.required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      {field.type === 'select' ? (
        <select name={field.name} value={formData[field.name] || ''} onChange={handleChange} style={styles.input}>
          <option value="">Select</option>
          {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : (
        <input
          type={field.type || 'text'} name={field.name} value={formData[field.name] || ''}
          onChange={handleChange} style={styles.input}
          onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
        />
      )}
    </div>
  );

  return (
    <form>
      <h2 style={styles.header}>{title}</h2>

      {/* Regular Sections */}
      {sections?.map((section, idx) => (
        <div key={idx} style={styles.section}>
          <h3 style={styles.sectionTitle}>{section.title}</h3>
          <div style={styles.grid}>{section?.fields?.map(renderField)}</div>
        </div>
      ))}

      {/* Table Section (Cards) */}
      {tableConfig && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>{tableConfig.title}</h3>
          <div style={styles.cardGrid}>
            {tableRows.map((row, rowIndex) => {
              // Check if this is the last row (empty row for adding new)
              const isLastRow = rowIndex === tableRows.length - 1;
              
              return (
                <div key={rowIndex} style={styles.cardRow}>
                  {/* Delete Button - Only show if NOT the last row */}
                  {!isLastRow && (
                    <button 
                      type="button" 
                      style={styles.deleteBtn}
                      onClick={() => handleRemoveRow(rowIndex)}
                      title="Remove this entry"
                    >
                      ✕
                    </button>
                  )}
                  
                  <div style={styles.cardGridInner}>
                    {tableConfig.columns.map(col => (
                      <div key={col.name} style={styles.cardFieldWrapper}>
                        <label style={styles.cardLabel}>{col.label}</label>
                        <input
                          type={col.type || 'text'}
                          name={col.name}
                          value={row[col.name] || ''}
                          onChange={(e) => handleTableChange(rowIndex, e)}
                          style={styles.cardInput}
                          // Placeholders removed as requested
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={styles.actions}>
        <button type="button" style={styles.btnPrimary} onClick={() => console.log('Form:', formData, 'Table:', tableRows)}>
          Submit
        </button>
      </div>
    </form>
  );
};

export default BaseFormTemplate;
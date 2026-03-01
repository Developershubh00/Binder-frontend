import React, { useState } from 'react';

const BaseFormTemplate = ({ title, sections }) => {
  
  // 1. Auto-create state from configuration
  const getInitialState = () => {
    const state = {};
    sections?.forEach(section => {
      section.fields.forEach(field => {
        state[field.name] = field.type === 'checkbox' ? false : '';
      });
    });
    return state;
  };

  const [formData, setFormData] = useState(getInitialState());

  // 2. Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // 3. Styles (inline for simplicity, you can move to CSS)
  const styles = {
    header: {
      fontSize: '18px', fontWeight: '600', marginBottom: '24px',
      color: '#1f2937', paddingBottom: '12px', borderBottom: '2px solid #3b82f6'
    },
    section: {
      marginBottom: '24px', padding: '20px', background: '#f9fafb',
      borderRadius: '8px', border: '1px solid #e5e7eb'
    },
    sectionTitle: {
      fontSize: '13px', fontWeight: '600', marginBottom: '16px',
      color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.5px'
    },
    grid: {
      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px'
    },
    label: {
      display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151', fontSize: '13px'
    },
    input: {
      width: '100%', padding: '10px 12px', border: '1px solid #d1d5db',
      borderRadius: '6px', fontSize: '14px', background: '#fff'
    },
    textarea: {
      width: '100%', padding: '10px 12px', border: '1px solid #d1d5db',
      borderRadius: '6px', fontSize: '14px', background: '#fff', minHeight: '80px', resize: 'vertical'
    },
    actions: {
      display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px'
    },
    btnPrimary: {
      padding: '10px 24px', border: 'none', borderRadius: '6px',
      background: '#3b82f6', color: '#fff', cursor: 'pointer', fontWeight: '500'
    },
    btnSecondary: {
      padding: '10px 24px', border: '1px solid #d1d5db', borderRadius: '6px',
      background: '#fff', cursor: 'pointer'
    }
  };

  // 4. Render each field based on type
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
        >
          <option value="">Select</option>
          {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : field.type === 'textarea' ? (
        <textarea
          name={field.name}
          value={formData[field.name] || ''}
          onChange={handleChange}
          placeholder={field.placeholder}
          style={styles.textarea}
        />
      ) : (
        <input
          type={field.type || 'text'}
          name={field.name}
          value={formData[field.name] || ''}
          onChange={handleChange}
          placeholder={field.placeholder}
          style={styles.input}
        />
      )}
    </div>
  );

  // 5. Render the form
  return (
    <form>
      <h2 style={styles.header}>{title}</h2>
      
      {sections?.map((section, idx) => (
        <div key={idx} style={styles.section}>
          <h3 style={styles.sectionTitle}>{section.title}</h3>
          <div style={styles.grid}>
            {section.fields.map(renderField)}
          </div>
        </div>
      ))}
      
      <div style={styles.actions}>
        <button type="button" style={styles.btnSecondary}>Clear</button>
        <button type="button" style={styles.btnPrimary}>Submit</button>
      </div>
    </form>
  );
};

export default BaseFormTemplate;
import React, { useMemo, useEffect, useState } from 'react';

const TasksContent = () => {
  const [selectedType, setSelectedType] = useState('Production');
  const [selectedIpo, setSelectedIpo] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('Department 1');
  const [selectedUser, setSelectedUser] = useState('User 1');
  const [task, setTask] = useState('');
  const [subTask, setSubTask] = useState('');
  const [remarks, setRemarks] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('');
  const [existingIPOs, setExistingIPOs] = useState([]);

  const todayDate = useMemo(() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  useEffect(() => {
    const loadIPOs = () => {
      try {
        const stored = JSON.parse(localStorage.getItem('internalPurchaseOrders') || '[]');
        setExistingIPOs(Array.isArray(stored) ? stored : []);
      } catch (error) {
        console.error('Error loading IPOs:', error);
        setExistingIPOs([]);
      }
    };

    loadIPOs();
    const handleStorage = (event) => {
      if (event.key === 'internalPurchaseOrders') {
        loadIPOs();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const ipoOptions = useMemo(() => {
    const normalizedType = (selectedType || '').toLowerCase();
    return existingIPOs
      .filter((ipo) => (ipo.orderType || '').toLowerCase() === normalizedType && (ipo.ipoCode || ipo.code))
      .map((ipo) => ipo.ipoCode || ipo.code)
      .filter(Boolean);
  }, [existingIPOs, selectedType]);

  useEffect(() => {
    setSelectedIpo('');
  }, [selectedType]);

  const handleDueDateChange = (event) => {
    const value = event.target.value;
    if (value && value < todayDate) {
      setDueDate('');
      return;
    }
    setDueDate(value);
  };

  return (
    <div className="dashboard-content">
      <h1 className="dashboard-title">Tasks</h1>
      <p className="dashboard-subtitle">Assign and track work across departments.</p>
      <div className="tasks-grid">
        <div className="tasks-card">
          <div className="tasks-card-title">Assign Tasks</div>
          <div className="tasks-field">
            <label className="tasks-label">Select PO Type</label>
            <select className="tasks-input" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
              <option value="Production">Production</option>
              <option value="Sampling">Sampling</option>
              <option value="Company">Company</option>
            </select>
          </div>
          <div className="tasks-field">
            <label className="tasks-label">Select IPO</label>
            <select
              className="tasks-input"
              value={selectedIpo}
              onChange={(e) => setSelectedIpo(e.target.value)}
              disabled={ipoOptions.length === 0}
            >
              <option value="" disabled>
                {ipoOptions.length === 0 ? 'No IPOs available' : 'Select IPO'}
              </option>
              {ipoOptions.map((ipo) => (
                <option key={ipo} value={ipo}>
                  {ipo}
                </option>
              ))}
            </select>
          </div>
          <div className="tasks-field">
            <label className="tasks-label">Select Department</label>
            <select
              className="tasks-input"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="Department 1">Department 1</option>
              <option value="Department 2">Department 2</option>
              <option value="Department 3">Department 3</option>
            </select>
          </div>
          <div className="tasks-field">
            <label className="tasks-label">User</label>
            <select className="tasks-input" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
              <option value="User 1">User 1</option>
              <option value="User 2">User 2</option>
              <option value="User 3">User 3</option>
            </select>
          </div>
        </div>
        <div className="tasks-card">
          <div className="tasks-card-title">Define Task</div>
          <div className="tasks-field">
            <label className="tasks-label">Define Task</label>
            <input
              className="tasks-input"
              placeholder="Write the task..."
              value={task}
              onChange={(e) => setTask(e.target.value)}
            />
          </div>
          <div className="tasks-field">
            <label className="tasks-label">Add Sub Task</label>
            <input
              className="tasks-input"
              placeholder="Optional sub task"
              value={subTask}
              onChange={(e) => setSubTask(e.target.value)}
            />
          </div>
          <div className="tasks-field">
            <label className="tasks-label">Remarks</label>
            <textarea
              className="tasks-input tasks-textarea"
              placeholder="Context, notes, or constraints"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>
          <div className="tasks-field">
            <label className="tasks-label">Due Date</label>
            <input
              className="tasks-input"
              type="date"
              min={todayDate}
              value={dueDate}
              onChange={handleDueDateChange}
            />
          </div>
          <div className="tasks-field">
            <label className="tasks-label">Priority</label>
            <div className="tasks-priority">
              {['Low', 'Medium', 'High', 'Urgent'].map((level) => (
                <button
                  key={level}
                  type="button"
                  className={`tasks-chip${priority === level ? ' active' : ''}${level === 'Urgent' ? ' urgent' : ''}`}
                  onClick={() => setPriority(level)}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
          <button type="button" className="tasks-assign">Assign</button>
        </div>
      </div>
    </div>
  );
};

export default TasksContent;

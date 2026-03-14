import React, { useMemo, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { FullscreenContent } from '@/components/ui/form-layout';
import { SearchableCombobox } from '@/components/ui/searchable-combobox';
import { TestingRequirementsInput } from '@/components/ui/testing-requirements-input';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { createTask } from '../services/integration';
import { uploadToBlob } from '../services/blobUpload';
import { normalizeOrderType } from '../utils/orderType';

const TasksContent = ({ initialView = 'assign' }) => {
  const [activeView, setActiveView] = useState(initialView);
  const [selectedType, setSelectedType] = useState('Production');
  const [selectedIpo, setSelectedIpo] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [task, setTask] = useState('');
  const [subTask, setSubTask] = useState('');
  const [remarks, setRemarks] = useState('');
  const [taskImage, setTaskImage] = useState(null);
  const [taskImagePreview, setTaskImagePreview] = useState('');
  const [taskImageInputKey, setTaskImageInputKey] = useState(0);
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('');
  const [existingIPOs, setExistingIPOs] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [rejectingTasks, setRejectingTasks] = useState({});
  const [rejectionNotes, setRejectionNotes] = useState({});
  const [newAssignees, setNewAssignees] = useState({});
  const [addUserForms, setAddUserForms] = useState({});
  const [showAddUserForm, setShowAddUserForm] = useState({});
  const [showAssignedDialog, setShowAssignedDialog] = useState(false);
  const [showUserAssignedDialog, setShowUserAssignedDialog] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

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
        const normalized = Array.isArray(stored)
          ? stored.map((ipo) => ({ ...ipo, orderType: normalizeOrderType(ipo.orderType || ipo.order_type) }))
          : [];
        setExistingIPOs(normalized);
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
    const handleIpoUpdate = () => loadIPOs();
    window.addEventListener('storage', handleStorage);
    window.addEventListener('internalPurchaseOrdersUpdated', handleIpoUpdate);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('internalPurchaseOrdersUpdated', handleIpoUpdate);
    };
  }, []);

  useEffect(() => {
    setActiveView(initialView || 'assign');
  }, [initialView]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('assignedTasks') || '[]');
      setAssignedTasks(Array.isArray(stored) ? stored : []);
    } catch (error) {
      console.error('Error loading assigned tasks:', error);
      setAssignedTasks([]);
    }
  }, []);

  const persistAssignedTasks = (nextTasks) => {
    setAssignedTasks(nextTasks);
    try {
      localStorage.setItem('assignedTasks', JSON.stringify(nextTasks));
    } catch (error) {
      console.error('Error saving assigned tasks:', error);
    }
  };

  const resetTaskForm = () => {
    setTask('');
    setSubTask('');
    setRemarks('');
    setTaskImage(null);
    setTaskImagePreview('');
    setTaskImageInputKey((prev) => prev + 1);
    setDueDate('');
    setPriority('');
    setSelectedUsers([]);
  };

  const updateTask = (taskId, updater) => {
    persistAssignedTasks(
      assignedTasks.map((taskItem) => (taskItem.id === taskId ? updater(taskItem) : taskItem))
    );
  };

  const handleAcceptTask = (taskId) => {
    setRejectingTasks((prev) => ({ ...prev, [taskId]: false }));
    updateTask(taskId, (taskItem) => {
      setAddUserForms((prev) => ({
        ...prev,
        [taskId]: {
          user: '',
          department: taskItem.department || '',
          ipo: taskItem.ipo || '',
          task: taskItem.task || '',
          remarks: taskItem.remarks || '',
          dueDate: taskItem.dueDate || todayDate,
          priority: taskItem.priority || 'Low'
        }
      }));
      return { ...taskItem, status: 'accepted' };
    });
  };

  const handleRejectTask = (taskId) => {
    setRejectingTasks((prev) => ({ ...prev, [taskId]: true }));
  };

  const handleSendRejection = (taskId) => {
    const note = (rejectionNotes[taskId] || '').trim();
    updateTask(taskId, (taskItem) => ({
      ...taskItem,
      status: 'rejected',
      rejectedRemark: note
    }));
    setRejectingTasks((prev) => ({ ...prev, [taskId]: false }));
  };

  const handleAddAssignee = (taskId) => {
    const form = addUserForms[taskId] || {};
    const newAssignee = (form.user || '').trim();
    if (!newAssignee) return;
    updateTask(taskId, (taskItem) => ({
      ...taskItem,
      assignees: [...(taskItem.assignees || []), newAssignee],
      status: 'accepted'
    }));
    setAddUserForms((prev) => {
      const next = { ...prev };
      delete next[taskId];
      return next;
    });
    setNewAssignees((prev) => ({ ...prev, [taskId]: '' }));
    setShowAddUserForm((prev) => ({ ...prev, [taskId]: false }));
    setShowUserAssignedDialog(true);
  };

  const handleOpenAddUserForm = (taskItem) => {
    const draft = (newAssignees[taskItem.id] || '').trim();
    if (!draft) return;
    setAddUserForms((prev) => ({
      ...prev,
      [taskItem.id]: {
        user: draft,
        department: '',
        ipo: '',
        task: '',
        remarks: '',
        dueDate: '',
        priority: ''
      }
    }));
    setShowAddUserForm((prev) => ({ ...prev, [taskItem.id]: true }));
  };

  const userOptions = [];

  const handleTaskImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setTaskImage(null);
      setTaskImagePreview('');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setTaskImage(null);
      setTaskImagePreview('');
      setTaskImageInputKey((prev) => prev + 1);
      return;
    }

    setTaskImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setTaskImagePreview(typeof reader.result === 'string' ? reader.result : '');
    };
    reader.readAsDataURL(file);
  };

  const handleClearTaskImage = () => {
    setTaskImage(null);
    setTaskImagePreview('');
    setTaskImageInputKey((prev) => prev + 1);
  };

  const handleAssignTask = async () => {
    if (isAssigning) return;
    setIsAssigning(true);
    try {
      const primaryAssignee = selectedUsers.length > 0 ? selectedUsers[0] : 'Unassigned';
      let uploadedTaskImageUrl = '';

      if (taskImage) {
        try {
          uploadedTaskImageUrl = (await uploadToBlob(taskImage, 'tasks')) || '';
        } catch (error) {
          console.error('Error uploading task image:', error);
        }
      }

      const taskPayload = {
        po_type: selectedType || '',
        ipo_code: selectedIpo || '',
        department: selectedDepartment || '',
        task: task.trim() || 'Task',
        sub_task: subTask.trim(),
        remarks: remarks.trim(),
        due_date: dueDate || todayDate,
        priority: priority || 'Low',
        status: 'pending',
        assigned_to: primaryAssignee,
        assignees: selectedUsers,
        image_url: uploadedTaskImageUrl || '',
        image_name: taskImage?.name || ''
      };

      let serverTask = null;
      try {
        const response = await createTask(taskPayload);
        serverTask = response?.data ?? response;
      } catch (error) {
        console.warn('Task API save failed, keeping local copy only:', error);
      }

      const persistedTaskId = serverTask?.id ?? serverTask?.task_id ?? Date.now();
      const normalizedTaskId = String(persistedTaskId).startsWith('task-')
        ? String(persistedTaskId)
        : `task-${persistedTaskId}`;
      const newTask = {
        id: normalizedTaskId,
        dbId: serverTask?.id ?? serverTask?.task_id ?? null,
        user: primaryAssignee,
        department: selectedDepartment,
        ipo: selectedIpo || '',
        task: task.trim() || 'Task',
        subTask: subTask.trim(),
        remarks: remarks.trim(),
        dueDate: dueDate || todayDate,
        priority: priority || 'Low',
        imageUrl: uploadedTaskImageUrl || serverTask?.image_url || serverTask?.image || '',
        imageName: taskImage?.name || serverTask?.image_name || '',
        status: 'pending',
        assignees: selectedUsers
      };

      const nextTasks = [newTask, ...assignedTasks];
      persistAssignedTasks(nextTasks);
      resetTaskForm();
      setShowAssignedDialog(true);
    } catch (error) {
      console.error('Error assigning task:', error);
    } finally {
      setIsAssigning(false);
    }
  };

  const ipoOptions = useMemo(() => {
    const normalizedType = normalizeOrderType(selectedType);
    return existingIPOs
      .filter((ipo) => normalizeOrderType(ipo.orderType || ipo.order_type) === normalizedType && (ipo.ipoCode || ipo.code))
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
    <FullscreenContent style={{ overflowY: 'auto' }}>
      <div className="dashboard-content">
      <h1 className="dashboard-title">Tasks</h1>
      <p className="dashboard-subtitle">Assign and track work across departments.</p>
      <div className="tasks-tabs">
        <button
          type="button"
          className={`tasks-tab${activeView === 'assigned' ? ' active' : ''}`}
          onClick={() => setActiveView('assigned')}
        >
          Tasks Assigned To You
        </button>
        <button
          type="button"
          className={`tasks-tab${activeView === 'assign' ? ' active' : ''}`}
          onClick={() => setActiveView('assign')}
        >
          Assign Tasks
        </button>
      </div>

      {activeView === 'assign' && (
        <div className="tasks-grid">
          <div className="tasks-card">
            <div className="tasks-card-title">Assign Tasks</div>
            <Field label="Select PO Type" width="md">
              <SearchableCombobox
                value={selectedType}
                onChange={setSelectedType}
                options={['Company', 'Production', 'Sampling']}
                placeholder="Select PO type"
                strictMode
                className="h-10"
                style={{ paddingLeft: '1rem', paddingRight: '2.25rem' }}
              />
            </Field>
            <Field label="Select IPO" width="md">
              <SearchableCombobox
                value={selectedIpo}
                onChange={setSelectedIpo}
                options={ipoOptions}
                placeholder={ipoOptions.length === 0 ? 'No IPOs available' : 'Select IPO'}
                strictMode={ipoOptions.length > 0}
                disabled={ipoOptions.length === 0}
                className="h-10"
                style={{ paddingLeft: '1rem', paddingRight: '2.25rem' }}
              />
            </Field>
            <Field label="Select Department" width="md">
              <SearchableCombobox
                value={selectedDepartment}
                onChange={setSelectedDepartment}
                options={['Department 1', 'Department 2', 'Department 3']}
                placeholder="Select department"
                strictMode={false}
                className="h-10"
                style={{ paddingLeft: '1rem', paddingRight: '2.25rem' }}
              />
            </Field>
            <Field label="Users" width="md">
              <TestingRequirementsInput
                value={selectedUsers}
                onChange={setSelectedUsers}
                options={userOptions}
                placeholder="Type user name and press Enter"
              />
            </Field>
          </div>
          <div className="tasks-card">
            <div className="tasks-card-title">Define Task</div>
            <Field label="Define Task" width="lg">
              <Input
                placeholder="Write the task..."
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />
            </Field>
            <Field label="Add Sub Task" width="lg">
              <Input
                placeholder="Optional sub task"
                value={subTask}
                onChange={(e) => setSubTask(e.target.value)}
              />
            </Field>
            <Field label="Remarks" width="lg">
              <textarea
                className="tasks-textarea"
                placeholder="Context, notes, or constraints"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </Field>
            <Field label="Image Upload" width="md">
              <div className="tasks-image-upload">
                <input
                  key={taskImageInputKey}
                  id="task-image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleTaskImageChange}
                />
                <label htmlFor="task-image-upload" className="tasks-image-upload-trigger">
                  {taskImage ? 'Change Image' : 'Upload Image'}
                </label>
                {taskImage && (
                  <button
                    type="button"
                    className="tasks-image-clear"
                    onClick={handleClearTaskImage}
                  >
                    Remove
                  </button>
                )}
                {taskImage && (
                  <span className="tasks-image-name" title={taskImage.name}>
                    {taskImage.name}
                  </span>
                )}
                {taskImagePreview && (
                  <div className="tasks-image-preview">
                    <img src={taskImagePreview} alt="Task upload preview" />
                  </div>
                )}
              </div>
            </Field>
            <Field label="Due Date" width="md">
              <Input
                type="date"
                min={todayDate}
                value={dueDate}
                onChange={handleDueDateChange}
              />
            </Field>
            <Field label="Priority" width="lg">
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
            </Field>
            <Button
              type="button"
              size="sm"
              variant="default"
              style={{ paddingLeft: '0.75rem', paddingRight: '0.75rem', width: 'fit-content' }}
              onClick={handleAssignTask}
              disabled={isAssigning}
            >
              {isAssigning ? 'Assigning...' : 'Assign'}
            </Button>
          </div>
        </div>
      )}

      {activeView === 'assigned' && (
        <div className="tasks-card tasks-card-full">
          <div className="tasks-card-title">Tasks Assigned To You</div>
          <div className="tasks-assigned-list">
            {assignedTasks.length === 0 && (
              <div className="tasks-empty">No tasks assigned yet.</div>
            )}
            {assignedTasks.map((taskItem) => {
              const chain = taskItem.assignees || [];
              const progress = 0;
              return (
                <div key={taskItem.id} className="tasks-assigned-card">
                  <div className="tasks-assigned-layout">
                    <div className="tasks-assigned-left">
                      <div className="tasks-right-row">
                        <span className="tasks-assigned-label">User</span>
                        <span className="tasks-assigned-value">{taskItem.user}</span>
                      </div>
                      <div className="tasks-right-row">
                        <span className="tasks-assigned-label">User Department</span>
                        <span className="tasks-assigned-value">{taskItem.department}</span>
                      </div>
                      <div className="tasks-right-row">
                        <span className="tasks-assigned-label">IPO</span>
                        <span className="tasks-assigned-value">{taskItem.ipo || '-'}</span>
                      </div>
                      <div className="tasks-right-row">
                        <span className="tasks-assigned-label">Define Task</span>
                        <span className="tasks-assigned-value">{taskItem.task}</span>
                      </div>
                      <div className="tasks-right-row">
                        <span className="tasks-assigned-label">Remarks</span>
                        <span className="tasks-assigned-value">{taskItem.remarks || '-'}</span>
                      </div>
                      <div className="tasks-right-row">
                        <span className="tasks-assigned-label">Image</span>
                        <span className="tasks-assigned-value">
                          {taskItem.imageUrl ? (
                            <a
                              href={taskItem.imageUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="tasks-image-link"
                            >
                              View Image
                            </a>
                          ) : (
                            taskItem.imageName || '-'
                          )}
                        </span>
                      </div>
                      <div className="tasks-right-row">
                        <span className="tasks-assigned-label">Due Date</span>
                        <span className="tasks-assigned-value">{taskItem.dueDate}</span>
                      </div>
                      <div className="tasks-right-row">
                        <span className="tasks-assigned-label">Priority</span>
                        <span
                          className={`tasks-priority-pill ${taskItem.priority?.toLowerCase() || 'low'}`}
                          style={{ width: 'fit-content' }}
                        >
                          {taskItem.priority}
                        </span>
                      </div>
                      <div className="tasks-right-row">
                        <div className="tasks-actions">
                          {taskItem.status === 'pending' && (
                            <>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                style={{ paddingLeft: '0.75rem', paddingRight: '0.75rem', width: 'fit-content' }}
                                className="tasks-action accept"
                                onClick={() => handleAcceptTask(taskItem.id)}
                              >
                                Accept
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                style={{ paddingLeft: '0.75rem', paddingRight: '0.75rem', width: 'fit-content' }}
                                className="tasks-action reject"
                                onClick={() => handleRejectTask(taskItem.id)}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          {taskItem.status === 'accepted' && (
                            <span className="tasks-status accepted">Accepted</span>
                          )}
                          {taskItem.status === 'rejected' && (
                            <span className="tasks-status rejected">Rejected</span>
                          )}
                        </div>
                      </div>
                      {rejectingTasks[taskItem.id] && taskItem.status !== 'accepted' && (
                        <div className="tasks-reject">
                          <div className="tasks-reject-label">Remark</div>
                          <textarea
                            className="tasks-textarea"
                            placeholder="Add remark before sending"
                            value={rejectionNotes[taskItem.id] || ''}
                            onChange={(e) => setRejectionNotes((prev) => ({ ...prev, [taskItem.id]: e.target.value }))}
                            style={{ maxWidth: '360px' }}
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="default"
                            style={{ paddingLeft: '0.75rem', paddingRight: '0.75rem', width: 'fit-content' }}
                            onClick={() => handleSendRejection(taskItem.id)}
                          >
                            Send
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="tasks-assigned-right">
                      <div className="tasks-assigned-chain">
                        <div className="tasks-chain-label">Chain of custody</div>
                        <div className="tasks-chain-value">
                          {chain.length > 0 ? chain.join(' → ') : 'No linked users'}
                        </div>
                      </div>
                      {taskItem.status === 'accepted' && (
                        <div className="tasks-progress">
                          <div className="tasks-progress-header">
                            <span>In Progress</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="tasks-progress-bar">
                            <div className="tasks-progress-fill" style={{ width: `${progress}%` }} />
                          </div>
                          {!showAddUserForm[taskItem.id] && (
                            <div className="tasks-add-user">
                              <Input
                                placeholder="Type user name"
                                value={newAssignees[taskItem.id] || ''}
                                onChange={(e) => setNewAssignees((prev) => ({ ...prev, [taskItem.id]: e.target.value }))}
                              />
                              <Button
                                type="button"
                                size="sm"
                                variant="default"
                                style={{ paddingLeft: '0.75rem', paddingRight: '0.75rem', width: 'fit-content' }}
                                onClick={() => handleOpenAddUserForm(taskItem)}
                              >
                                Add User
                              </Button>
                            </div>
                          )}
                          {showAddUserForm[taskItem.id] && (
                            <div className="tasks-add-user-form">
                              <Field label="User" width="md">
                                <Input
                                  placeholder="Type user name"
                                  value={addUserForms[taskItem.id]?.user || ''}
                                  onChange={(e) => setAddUserForms((prev) => ({
                                    ...prev,
                                    [taskItem.id]: { ...(prev[taskItem.id] || {}), user: e.target.value }
                                  }))}
                                />
                              </Field>
                              <Field label="User Department" width="md">
                                <SearchableCombobox
                                  value={addUserForms[taskItem.id]?.department || ''}
                                  onChange={(value) => setAddUserForms((prev) => ({
                                    ...prev,
                                    [taskItem.id]: { ...(prev[taskItem.id] || {}), department: value }
                                  }))}
                                  options={['Department 1', 'Department 2', 'Department 3']}
                                  placeholder="Select department"
                                  strictMode={false}
                                  className="h-10"
                                  style={{ paddingLeft: '1rem', paddingRight: '2.25rem' }}
                                />
                              </Field>
                              <Field label="IPO" width="md">
                                <SearchableCombobox
                                  value={addUserForms[taskItem.id]?.ipo || ''}
                                  onChange={(value) => setAddUserForms((prev) => ({
                                    ...prev,
                                    [taskItem.id]: { ...(prev[taskItem.id] || {}), ipo: value }
                                  }))}
                                  options={ipoOptions}
                                  placeholder="Select IPO"
                                  strictMode={false}
                                  className="h-10"
                                  style={{ paddingLeft: '1rem', paddingRight: '2.25rem' }}
                                />
                              </Field>
                              <Field label="Define Task" width="lg">
                                <Input
                                  placeholder="Define task"
                                  value={addUserForms[taskItem.id]?.task || ''}
                                  onChange={(e) => setAddUserForms((prev) => ({
                                    ...prev,
                                    [taskItem.id]: { ...(prev[taskItem.id] || {}), task: e.target.value }
                                  }))}
                                />
                              </Field>
                              <Field label="Remarks" width="lg">
                                <textarea
                                  className="tasks-textarea"
                                  placeholder="Remarks"
                                  value={addUserForms[taskItem.id]?.remarks || ''}
                                  onChange={(e) => setAddUserForms((prev) => ({
                                    ...prev,
                                    [taskItem.id]: { ...(prev[taskItem.id] || {}), remarks: e.target.value }
                                  }))}
                                />
                              </Field>
                              <Field label="Due Date" width="md">
                                <Input
                                  type="date"
                                  min={todayDate}
                                  value={addUserForms[taskItem.id]?.dueDate || ''}
                                  onChange={(e) => setAddUserForms((prev) => ({
                                    ...prev,
                                    [taskItem.id]: { ...(prev[taskItem.id] || {}), dueDate: e.target.value }
                                  }))}
                                />
                              </Field>
                              <Field label="Priority" width="lg">
                                <div className="tasks-priority">
                                  {['Low', 'Medium', 'High', 'Urgent'].map((level) => (
                                    <button
                                      key={level}
                                      type="button"
                                      className={`tasks-chip${(addUserForms[taskItem.id]?.priority || 'Low') === level ? ' active' : ''}${level === 'Urgent' ? ' urgent' : ''}`}
                                      onClick={() => setAddUserForms((prev) => ({
                                        ...prev,
                                        [taskItem.id]: { ...(prev[taskItem.id] || {}), priority: level }
                                      }))}
                                    >
                                      {level}
                                    </button>
                                  ))}
                                </div>
                              </Field>
                              <Button
                                type="button"
                                size="sm"
                                variant="default"
                                style={{ paddingLeft: '0.75rem', paddingRight: '0.75rem', width: 'fit-content' }}
                                onClick={() => handleAddAssignee(taskItem.id)}
                              >
                                Assign
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                      {taskItem.status === 'rejected' && taskItem.rejectedRemark && (
                        <div className="tasks-reject-note">Remark sent: {taskItem.rejectedRemark}</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <Dialog
        open={showAssignedDialog}
        onOpenChange={(open) => {
          setShowAssignedDialog(open);
          if (!open) {
            resetTaskForm();
            setIsAssigning(false);
          }
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="max-w-xs"
          style={{
            padding: '16px',
            borderRadius: '12px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <DialogTitle style={{ fontSize: '16px' }}>Task Assigned</DialogTitle>
          <Button
            type="button"
            size="sm"
            variant="default"
            style={{ paddingLeft: '0.75rem', paddingRight: '0.75rem', width: 'fit-content' }}
            onClick={() => setShowAssignedDialog(false)}
          >
            OK
          </Button>
        </DialogContent>
      </Dialog>
      <Dialog open={showUserAssignedDialog} onOpenChange={setShowUserAssignedDialog}>
        <DialogContent
          showCloseButton={false}
          className="max-w-xs"
          style={{
            padding: '16px',
            borderRadius: '12px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <DialogTitle style={{ fontSize: '16px' }}>User Assigned</DialogTitle>
          <Button
            type="button"
            size="sm"
            variant="default"
            style={{ paddingLeft: '0.75rem', paddingRight: '0.75rem', width: 'fit-content' }}
            onClick={() => setShowUserAssignedDialog(false)}
          >
            OK
          </Button>
        </DialogContent>
      </Dialog>
    </div>
    </FullscreenContent>
  );
};

export default TasksContent;

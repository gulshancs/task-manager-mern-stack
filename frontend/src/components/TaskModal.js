import React, { useState, useEffect } from 'react';

const EMPTY = { title: '', description: '', priority: 'medium', dueDate: '', completed: false };

const TaskModal = ({ isOpen, onClose, onSubmit, task, loading }) => {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const isEdit = !!task;

  useEffect(() => {
    if (isOpen) {
      if (task) {
        setForm({
          title: task.title || '',
          description: task.description || '',
          priority: task.priority || 'medium',
          dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
          completed: task.completed || false,
        });
      } else {
        setForm(EMPTY);
      }
      setErrors({});
    }
  }, [isOpen, task]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    else if (form.title.length > 200) e.title = 'Title too long (max 200 chars)';
    if (form.description.length > 1000) e.description = 'Description too long (max 1000 chars)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((err) => ({ ...err, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const data = {
      title: form.title.trim(),
      description: form.description.trim(),
      priority: form.priority,
      dueDate: form.dueDate || null,
      completed: form.completed,
    };
    onSubmit(data);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{isEdit ? 'Edit Task' : 'New Task'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input
              name="title"
              className={`form-input ${errors.title ? 'error' : ''}`}
              placeholder="What needs to be done?"
              value={form.title}
              onChange={handleChange}
              autoFocus
              maxLength={200}
            />
            {errors.title && <p className="form-input-error">{errors.title}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className={`form-input ${errors.description ? 'error' : ''}`}
              placeholder="Add details (optional)..."
              value={form.description}
              onChange={handleChange}
              rows={3}
              maxLength={1000}
            />
            {errors.description && <p className="form-input-error">{errors.description}</p>}
          </div>

          <div className="row">
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select name="priority" className="form-input" value={form.priority} onChange={handleChange}>
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input
                name="dueDate"
                type="date"
                className="form-input"
                value={form.dueDate}
                onChange={handleChange}
                min={new Date().toISOString().slice(0, 10)}
              />
            </div>
          </div>

          {isEdit && (
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input
                id="completed-toggle"
                name="completed"
                type="checkbox"
                checked={form.completed}
                onChange={handleChange}
                style={{ width: 16, height: 16, accentColor: 'var(--accent)', cursor: 'pointer' }}
              />
              <label htmlFor="completed-toggle" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>
                Mark as completed
              </label>
            </div>
          )}

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ width: 'auto' }} disabled={loading}>
              {loading ? <span className="spinner" /> : null}
              {isEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;

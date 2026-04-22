import React from 'react';
import { format, isToday, isTomorrow, isPast, parseISO } from 'date-fns';

const priorityDot = { high: '🔴', medium: '🟡', low: '🟢' };

const formatDue = (dateStr) => {
  if (!dateStr) return null;
  const date = parseISO(dateStr);
  if (isToday(date)) return { label: 'Today', cls: 'today' };
  if (isTomorrow(date)) return { label: 'Tomorrow', cls: '' };
  if (isPast(date)) return { label: format(date, 'MMM d'), cls: 'overdue' };
  return { label: format(date, 'MMM d'), cls: '' };
};

const TaskCard = ({ task, onToggle, onEdit, onDelete, index }) => {
  const due = task.dueDate ? formatDue(task.dueDate) : null;
  const isOverdue = task.isOverdue || (due?.cls === 'overdue' && !task.completed);

  return (
    <div
      className={`task-card ${task.priority} ${task.completed ? 'completed-card' : ''} ${isOverdue ? 'overdue-card' : ''}`}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* Checkbox */}
      <button
        className={`task-checkbox ${task.completed ? 'checked' : ''}`}
        onClick={() => onToggle(task._id)}
        title={task.completed ? 'Mark as pending' : 'Mark as complete'}
        aria-label="Toggle completion"
      >
        {task.completed && (
          <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
            <path d="M1 4L4.5 7.5L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      {/* Body */}
      <div className="task-body">
        <div className="task-title-row">
          <span className={`task-title ${task.completed ? 'done' : ''}`}>{task.title}</span>
        </div>
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
        <div className="task-meta">
          <span className={`priority-badge ${task.priority}`}>
            {priorityDot[task.priority]} {task.priority}
          </span>
          {due && (
            <span className={`due-badge ${due.cls}`}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {due.label}
              {isOverdue && !task.completed && ' · Overdue'}
            </span>
          )}
          {task.completed && task.completedAt && (
            <span className="due-badge">
              ✓ Done {format(parseISO(task.completedAt), 'MMM d')}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="task-actions">
        <button
          className="task-action-btn"
          onClick={() => onEdit(task)}
          title="Edit task"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button
          className="task-action-btn delete"
          onClick={() => onDelete(task._id)}
          title="Delete task"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6M14 11v6"/>
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TaskCard;

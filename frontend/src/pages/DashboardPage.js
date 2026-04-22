import React, { useState, useEffect, useRef } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../context/AuthContext';
import StatsGrid from '../components/StatsGrid';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import ConfirmDialog from '../components/ConfirmDialog';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const { user } = useAuth();
  const {
    tasks, stats, loading, statsLoading, filters,
    fetchStats, addTask, editTask, toggle, remove, removeCompleted, updateFilters,
  } = useTasks();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null); // task id or 'completed'
  const [confirmLoading, setConfirmLoading] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    fetchStats();
  }, []); // eslint-disable-line

  // Debounced search
  const searchTimer = useRef(null);
  const handleSearch = (e) => {
    const val = e.target.value;
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      updateFilters({ search: val });
    }, 350);
  };

  const openCreate = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleModalSubmit = async (data) => {
    setModalLoading(true);
    try {
      if (editingTask) {
        await editTask(editingTask._id, data);
      } else {
        await addTask(data);
      }
      setModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setConfirmLoading(true);
    try {
      if (confirmDelete === 'completed') {
        await removeCompleted();
      } else {
        await remove(confirmDelete);
      }
      setConfirmDelete(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setConfirmLoading(false);
    }
  };

  const greetingHour = new Date().getHours();
  const greeting =
    greetingHour < 12 ? 'Good morning' : greetingHour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name?.split(' ')[0] || 'there';

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <>
      <div className="main-content">
        {/* Page header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">{greeting}, {firstName} 👋</h1>
            <p className="page-subtitle">
              {stats
                ? stats.total === 0
                  ? 'No tasks yet — create your first one!'
                  : `${stats.pending} task${stats.pending !== 1 ? 's' : ''} pending · ${stats.completed} completed`
                : 'Loading your workspace...'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {completedCount > 0 && (
              <button
                className="btn btn-secondary"
                onClick={() => setConfirmDelete('completed')}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                </svg>
                Clear completed ({completedCount})
              </button>
            )}
            <button className="btn btn-primary" onClick={openCreate} style={{ width: 'auto' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              New Task
            </button>
          </div>
        </div>

        {/* Stats */}
        <StatsGrid stats={stats} loading={statsLoading} />

        {/* Progress bar */}
        {stats && stats.total > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Overall Progress</span>
              <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{stats.completionRate}%</span>
            </div>
            <div className="progress-bar-wrap">
              <div className="progress-bar" style={{ width: `${stats.completionRate}%` }} />
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="toolbar">
          <div className="search-input-wrap">
            <span className="search-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </span>
            <input
              ref={searchRef}
              className="search-input"
              placeholder="Search tasks..."
              defaultValue={filters.search}
              onChange={handleSearch}
            />
          </div>

          <div className="filter-tabs">
            {['all', 'pending', 'completed'].map((s) => (
              <button
                key={s}
                className={`filter-tab ${filters.status === s ? 'active' : ''}`}
                onClick={() => updateFilters({ status: s })}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          <select
            className="toolbar-select"
            value={filters.priority}
            onChange={(e) => updateFilters({ priority: e.target.value })}
          >
            <option value="">All Priorities</option>
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>

          <select
            className="toolbar-select"
            value={`${filters.sortBy}:${filters.order}`}
            onChange={(e) => {
              const [sortBy, order] = e.target.value.split(':');
              updateFilters({ sortBy, order });
            }}
          >
            <option value="createdAt:desc">Newest First</option>
            <option value="createdAt:asc">Oldest First</option>
            <option value="priority:desc">Priority (High→Low)</option>
            <option value="priority:asc">Priority (Low→High)</option>
            <option value="dueDate:asc">Due Date (Nearest)</option>
            <option value="dueDate:desc">Due Date (Farthest)</option>
          </select>
        </div>

        {/* Task list */}
        <div>
          <div className="tasks-header">
            <span className="tasks-title">
              Tasks
              <span className="tasks-count">{tasks.length}</span>
            </span>
          </div>

          {loading ? (
            <div className="page-loader">
              <span className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
            </div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                {filters.search || filters.status !== 'all' || filters.priority ? '🔍' : '📋'}
              </div>
              <div className="empty-state-title">
                {filters.search || filters.status !== 'all' || filters.priority
                  ? 'No tasks match your filters'
                  : 'No tasks yet'}
              </div>
              <p className="empty-state-text">
                {filters.search || filters.status !== 'all' || filters.priority
                  ? 'Try adjusting your search or filters'
                  : 'Create your first task to get started!'}
              </p>
              {!filters.search && filters.status === 'all' && !filters.priority && (
                <button className="btn btn-primary" onClick={openCreate} style={{ marginTop: 16, width: 'auto' }}>
                  + New Task
                </button>
              )}
            </div>
          ) : (
            <div className="task-list">
              {tasks.map((task, i) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  index={i}
                  onToggle={toggle}
                  onEdit={openEdit}
                  onDelete={(id) => setConfirmDelete(id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Task create/edit modal */}
      <TaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        task={editingTask}
        loading={modalLoading}
      />

      {/* Delete confirm dialog */}
      <ConfirmDialog
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDeleteConfirm}
        loading={confirmLoading}
        title={confirmDelete === 'completed' ? 'Clear Completed Tasks' : 'Delete Task'}
        message={
          confirmDelete === 'completed'
            ? `This will permanently delete all ${completedCount} completed task${completedCount !== 1 ? 's' : ''}. This action cannot be undone.`
            : 'Are you sure you want to delete this task? This action cannot be undone.'
        }
        confirmLabel={confirmDelete === 'completed' ? 'Clear All' : 'Delete'}
      />
    </>
  );
};

export default DashboardPage;

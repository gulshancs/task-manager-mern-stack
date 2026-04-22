import { useState, useCallback, useEffect } from 'react';
import {
  getTasks, createTask, updateTask, toggleTask,
  deleteTask, deleteCompletedTasks, getTaskStats,
} from '../utils/api';
import toast from 'react-hot-toast';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: '',
    search: '',
    sortBy: 'createdAt',
    order: 'desc',
  });

  const fetchTasks = useCallback(async (overrideFilters = null) => {
    setLoading(true);
    try {
      const params = overrideFilters || filters;
      const cleanParams = {};
      if (params.status && params.status !== 'all') cleanParams.status = params.status;
      if (params.priority) cleanParams.priority = params.priority;
      if (params.search) cleanParams.search = params.search;
      if (params.sortBy) cleanParams.sortBy = params.sortBy;
      if (params.order) cleanParams.order = params.order;
      const res = await getTasks(cleanParams);
      setTasks(res.data.tasks);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await getTaskStats();
      setStats(res.data.stats);
    } catch (err) {
      // silently fail for stats
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const addTask = useCallback(async (data) => {
    const res = await createTask(data);
    setTasks((prev) => [res.data.task, ...prev]);
    await fetchStats();
    toast.success('Task created!');
    return res.data.task;
  }, [fetchStats]);

  const editTask = useCallback(async (id, data) => {
    const res = await updateTask(id, data);
    setTasks((prev) => prev.map((t) => (t._id === id ? res.data.task : t)));
    await fetchStats();
    toast.success('Task updated!');
    return res.data.task;
  }, [fetchStats]);

  const toggle = useCallback(async (id) => {
    const res = await toggleTask(id);
    setTasks((prev) => prev.map((t) => (t._id === id ? res.data.task : t)));
    await fetchStats();
    toast.success(res.data.message);
  }, [fetchStats]);

  const remove = useCallback(async (id) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t._id !== id));
    await fetchStats();
    toast.success('Task deleted');
  }, [fetchStats]);

  const removeCompleted = useCallback(async () => {
    const res = await deleteCompletedTasks();
    setTasks((prev) => prev.filter((t) => !t.completed));
    await fetchStats();
    toast.success(res.data.message);
  }, [fetchStats]);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => {
      const updated = { ...prev, ...newFilters };
      return updated;
    });
  }, []);

  // Refetch when filters change
  useEffect(() => {
    fetchTasks();
  }, [filters]); // eslint-disable-line

  return {
    tasks, stats, loading, statsLoading, filters,
    fetchTasks, fetchStats, addTask, editTask,
    toggle, remove, removeCompleted, updateFilters,
  };
};

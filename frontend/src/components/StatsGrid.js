import React from 'react';

const StatCard = ({ label, value, type, sub, delay = 0 }) => (
  <div className={`stat-card ${type}`} style={{ animationDelay: `${delay}ms` }}>
    <div className="stat-label">{label}</div>
    <div className="stat-value">{value ?? '—'}</div>
    {sub && <div className="stat-sub">{sub}</div>}
  </div>
);

const StatsGrid = ({ stats, loading }) => {
  if (loading && !stats) {
    return (
      <div className="stats-grid">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="stat-card" style={{ opacity: 0.4, minHeight: 100 }} />
        ))}
      </div>
    );
  }

  const completionRate = stats?.completionRate ?? 0;

  return (
    <div className="stats-grid">
      <StatCard
        type="total"
        label="Total Tasks"
        value={stats?.total ?? 0}
        sub={`${completionRate}% completion rate`}
        delay={0}
      />
      <StatCard
        type="completed"
        label="Completed"
        value={stats?.completed ?? 0}
        sub="Tasks finished"
        delay={60}
      />
      <StatCard
        type="pending"
        label="Pending"
        value={stats?.pending ?? 0}
        sub="In progress"
        delay={120}
      />
      <StatCard
        type="overdue"
        label="Overdue"
        value={stats?.overdue ?? 0}
        sub="Need attention"
        delay={180}
      />
    </div>
  );
};

export default StatsGrid;

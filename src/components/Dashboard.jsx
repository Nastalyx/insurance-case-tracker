import React from 'react';
import { isFollowUpOverdue } from '../utils/dateUtils.js';

/**
 * Dashboard Component
 * Displays 4 summary cards calculated dynamically from the actual case records.
 *
 * Beginners note: We compute these values on every render using array methods
 * (.filter and .length) rather than storing duplicate counts in state. This ensures
 * the dashboard is always 100% in sync with the current cases list.
 */
function Dashboard({ cases }) {
  // 1. Total Cases
  const totalCount = cases.length;

  // 2. Open Cases (All active cases that are not yet Resolved)
  const openCount = cases.filter((c) => c.status !== 'Resolved').length;

  // 3. Overdue Follow-ups (Follow-up date is before today, excluding Resolved cases)
  const overdueCount = cases.filter((c) => isFollowUpOverdue(c.followUpDate, c.status)).length;

  // 4. Resolved Cases
  const resolvedCount = cases.filter((c) => c.status === 'Resolved').length;

  return (
    <section className="dashboard-grid" aria-label="Key Performance Metrics">
      {/* Total Cases Card */}
      <div className="stat-card">
        <div className="stat-card-header">
          <span className="stat-label">Total Cases</span>
          <span className="stat-badge stat-badge-blue">All</span>
        </div>
        <div className="stat-value">{totalCount}</div>
        <p className="stat-hint">Active and resolved client files</p>
      </div>

      {/* Open Cases Card */}
      <div className="stat-card">
        <div className="stat-card-header">
          <span className="stat-label">Open Cases</span>
          <span className="stat-badge stat-badge-amber">Action Needed</span>
        </div>
        <div className="stat-value">{openCount}</div>
        <p className="stat-hint">Cases currently in progress or awaiting reply</p>
      </div>

      {/* Overdue Follow-ups Card */}
      <div className={`stat-card ${overdueCount > 0 ? 'stat-card-alert' : ''}`}>
        <div className="stat-card-header">
          <span className="stat-label">Overdue Follow-ups</span>
          <span className={`stat-badge ${overdueCount > 0 ? 'stat-badge-red' : 'stat-badge-green'}`}>
            {overdueCount > 0 ? 'Requires Attention' : 'On Track'}
          </span>
        </div>
        <div className="stat-value stat-value-alert">{overdueCount}</div>
        <p className="stat-hint">Follow-up date has passed (unresolved)</p>
      </div>

      {/* Resolved Cases Card */}
      <div className="stat-card">
        <div className="stat-card-header">
          <span className="stat-label">Resolved Cases</span>
          <span className="stat-badge stat-badge-green">Closed</span>
        </div>
        <div className="stat-value">{resolvedCount}</div>
        <p className="stat-hint">Successfully finalized cases</p>
      </div>
    </section>
  );
}

export default Dashboard;

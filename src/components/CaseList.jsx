import React, { useState } from 'react';
import { isFollowUpOverdue, formatDisplayDate } from '../utils/dateUtils.js';

/**
 * CaseList Component
 * Renders the tabular list of cases with clear visual priority and status indicators.
 * Includes visual highlighting for overdue follow-up dates (excluding resolved cases).
 */
function CaseList({ cases, onEdit, onDelete, onViewDetails }) {
  // Local state to track which row's notes are expanded for quick inline reading
  const [expandedCaseId, setExpandedCaseId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedCaseId((prev) => (prev === id ? null : id));
  };

  // Helper for priority badge styling
  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'High':
        return 'badge-priority-high';
      case 'Medium':
        return 'badge-priority-medium';
      case 'Low':
        return 'badge-priority-low';
      default:
        return 'badge-neutral';
    }
  };

  // Helper for status badge styling
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Open':
        return 'badge-status-open';
      case 'In Progress':
        return 'badge-status-inprogress';
      case 'Awaiting Client':
        return 'badge-status-awaiting-client';
      case 'Awaiting Carrier':
        return 'badge-status-awaiting-carrier';
      case 'Resolved':
        return 'badge-status-resolved';
      default:
        return 'badge-neutral';
    }
  };

  if (cases.length === 0) {
    return (
      <div className="empty-state-card">
        <div className="empty-icon-circle">
          <svg
            viewBox="0 0 24 24"
            width="28"
            height="28"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
        </div>
        <h3 className="empty-title">No cases found</h3>
        <p className="empty-description">
          No cases match your active search or filter criteria. Try adjusting your filters or add a new case.
        </p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="cases-table" aria-label="Insurance Cases">
        <thead>
          <tr>
            <th scope="col">Client</th>
            <th scope="col">Case ID</th>
            <th scope="col">Type</th>
            <th scope="col" className="col-description">Description</th>
            <th scope="col">Priority</th>
            <th scope="col">Status</th>
            <th scope="col">Follow-up Date</th>
            <th scope="col" className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((c) => {
            const overdue = isFollowUpOverdue(c.followUpDate, c.status);
            const isExpanded = expandedCaseId === c.id;

            return (
              <React.Fragment key={c.id}>
                <tr className={`case-row ${overdue ? 'row-overdue' : ''} ${c.status === 'Resolved' ? 'row-resolved' : ''}`}>
                  {/* Client Name */}
                  <td className="cell-client">
                    <span className="client-name">{c.clientName}</span>
                  </td>

                  {/* Case ID */}
                  <td className="cell-id">
                    <span className="case-id-badge">{c.id}</span>
                  </td>

                  {/* Case Type */}
                  <td className="cell-type">
                    <span className="case-type-tag">{c.caseType}</span>
                  </td>

                  {/* Description */}
                  <td className="cell-description">
                    <div className="description-text" title={c.description}>
                      {c.description}
                    </div>
                    {c.notes && (
                      <button
                        type="button"
                        className="inline-notes-toggle"
                        onClick={() => toggleExpand(c.id)}
                        aria-expanded={isExpanded}
                      >
                        {isExpanded ? 'Hide Notes' : 'View Notes'}
                      </button>
                    )}
                  </td>

                  {/* Priority */}
                  <td className="cell-priority">
                    <span className={`badge ${getPriorityBadgeClass(c.priority)}`}>
                      {c.priority}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="cell-status">
                    <span className={`badge ${getStatusBadgeClass(c.status)}`}>
                      {c.status}
                    </span>
                  </td>

                  {/* Follow-up Date */}
                  <td className="cell-date">
                    {overdue ? (
                      <div className="overdue-date-wrapper" title="Follow-up date has passed and case is unresolved">
                        <span className="overdue-indicator">⚠️ Overdue</span>
                        <span className="overdue-date-text">{formatDisplayDate(c.followUpDate)}</span>
                      </div>
                    ) : (
                      <span className="standard-date-text">
                        {formatDisplayDate(c.followUpDate)}
                      </span>
                    )}
                  </td>

                  {/* Actions (Edit / Delete) */}
                  <td className="cell-actions text-right">
                    <div className="action-buttons-group">
                      <button
                        type="button"
                        className="btn-action btn-action-edit"
                        onClick={() => onEdit(c)}
                        title={`Edit ${c.id}`}
                        aria-label={`Edit case ${c.id}`}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn-action btn-action-delete"
                        onClick={() => onDelete(c)}
                        title={`Delete ${c.id}`}
                        aria-label={`Delete case ${c.id}`}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Expandable Notes Drawer Row */}
                {isExpanded && c.notes && (
                  <tr className="case-expanded-row">
                    <td colSpan="8">
                      <div className="expanded-notes-panel">
                        <div className="notes-heading">
                          <strong>Notes & Activity Log</strong>
                          <span className="notes-date-meta">
                            Created: {formatDisplayDate(c.dateCreated)}
                          </span>
                        </div>
                        <p className="notes-content">{c.notes}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default CaseList;

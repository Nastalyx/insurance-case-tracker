import React from 'react';
import { STATUSES, PRIORITIES } from '../constants.js';

/**
 * CaseFilters Component
 * Provides search and filter controls that work seamlessly together.
 *
 * Beginner note: Keeping form inputs "controlled" (where value comes from React state
 * and updates via onChange) ensures that React always has a single source of truth.
 */
function CaseFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  onResetFilters,
  onOpenAddModal,
  filteredCount,
  totalCount,
}) {
  const hasActiveFilters = Boolean(searchTerm || statusFilter || priorityFilter);

  return (
    <div className="filters-card">
      <div className="filters-top-bar">
        {/* Search Input */}
        <div className="search-group">
          <svg
            className="search-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search by client name or description..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search cases"
          />
          {searchTerm && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => onSearchChange('')}
              title="Clear search"
              aria-label="Clear search input"
            >
              ×
            </button>
          )}
        </div>

        {/* Action Button: Add New Case */}
        <button
          type="button"
          className="btn btn-primary"
          onClick={onOpenAddModal}
          id="add-new-case-btn"
        >
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add New Case
        </button>
      </div>

      {/* Filter Controls Row */}
      <div className="filters-controls-row">
        <div className="filter-select-group">
          <label htmlFor="status-filter" className="filter-label">
            Status
          </label>
          <select
            id="status-filter"
            className="filter-select"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
          >
            <option value="">All Statuses</option>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-select-group">
          <label htmlFor="priority-filter" className="filter-label">
            Priority
          </label>
          <select
            id="priority-filter"
            className="filter-select"
            value={priorityFilter}
            onChange={(e) => onPriorityFilterChange(e.target.value)}
          >
            <option value="">All Priorities</option>
            {PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>

        {/* Active Results Summary & Reset */}
        <div className="filter-meta">
          <span className="results-badge">
            Showing <strong>{filteredCount}</strong> of {totalCount} cases
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              className="btn btn-subtle"
              onClick={onResetFilters}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CaseFilters;

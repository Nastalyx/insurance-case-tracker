import React, { useState, useEffect } from 'react';
import { CASE_TYPES, PRIORITIES, STATUSES } from '../constants.js';
import { getTodayString } from '../utils/dateUtils.js';

/**
 * CaseFormModal Component
 * Handles both creating a new case and editing an existing one.
 *
 * Beginner note: This is a reusable modal form. When initialData is provided,
 * we populate the form fields for "Edit mode". When initialData is null,
 * we use clean defaults for "Add mode".
 */
function CaseFormModal({ isOpen, onClose, onSave, initialData }) {
  // Local state for each form field
  const [formData, setFormData] = useState({
    clientName: '',
    caseType: 'Life Insurance',
    priority: 'Medium',
    status: 'Open',
    followUpDate: '',
    description: '',
    notes: '',
  });

  // Validation error messages
  const [errors, setErrors] = useState({});

  // Populate or reset form whenever initialData or isOpen changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        clientName: initialData.clientName || '',
        caseType: initialData.caseType || CASE_TYPES[0],
        priority: initialData.priority || 'Medium',
        status: initialData.status || 'Open',
        followUpDate: initialData.followUpDate || '',
        description: initialData.description || '',
        notes: initialData.notes || '',
      });
    } else {
      // Default clean values for a brand new case
      setFormData({
        clientName: '',
        caseType: CASE_TYPES[0],
        priority: 'Medium',
        status: 'Open',
        followUpDate: '',
        description: '',
        notes: '',
      });
    }
    // Clear any previous error messages
    setErrors({});
  }, [initialData, isOpen]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isEditing = Boolean(initialData);

  // Field change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field as soon as user types
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  // Form validation logic
  const validate = () => {
    const newErrors = {};

    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Client name is required.';
    }

    if (!formData.caseType) {
      newErrors.caseType = 'Case type is required.';
    } else if (!CASE_TYPES.includes(formData.caseType)) {
      newErrors.caseType = 'Please select a valid case type.';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Case description is required.';
    }

    if (!formData.priority || !PRIORITIES.includes(formData.priority)) {
      newErrors.priority = 'Please select a valid priority.';
    }

    if (!formData.status || !STATUSES.includes(formData.status)) {
      newErrors.status = 'Please select a valid status.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Pass validated form values back to parent
    onSave({
      ...formData,
      clientName: formData.clientName.trim(),
      description: formData.description.trim(),
      notes: formData.notes.trim(),
    });
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation() /* Prevent clicking inside modal from closing it */}
      >
        <div className="modal-header">
          <div>
            <h2 id="modal-title" className="modal-title">
              {isEditing ? `Edit Case: ${initialData.id}` : 'Create New Case'}
            </h2>
            <p className="modal-subtitle">
              {isEditing
                ? 'Update client details, requirements and status.'
                : 'Enter client details and follow-up timeline.'}
            </p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            {/* Client Name */}
            <div className="form-group">
              <label htmlFor="clientName" className="form-label">
                Client Name <span className="required-star">*</span>
              </label>
              <input
                id="clientName"
                name="clientName"
                type="text"
                className={`form-input ${errors.clientName ? 'input-error' : ''}`}
                placeholder="e.g. Arthur Pendelton"
                value={formData.clientName}
                onChange={handleChange}
                autoFocus
              />
              {errors.clientName && (
                <span className="field-error-message">{errors.clientName}</span>
              )}
            </div>

            {/* Case Type & Priority in 2-column layout */}
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="caseType" className="form-label">
                  Case Type <span className="required-star">*</span>
                </label>
                <select
                  id="caseType"
                  name="caseType"
                  className={`form-select ${errors.caseType ? 'input-error' : ''}`}
                  value={formData.caseType}
                  onChange={handleChange}
                >
                  {CASE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.caseType && (
                  <span className="field-error-message">{errors.caseType}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="priority" className="form-label">
                  Priority <span className="required-star">*</span>
                </label>
                <select
                  id="priority"
                  name="priority"
                  className={`form-select ${errors.priority ? 'input-error' : ''}`}
                  value={formData.priority}
                  onChange={handleChange}
                >
                  {PRIORITIES.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
                {errors.priority && (
                  <span className="field-error-message">{errors.priority}</span>
                )}
              </div>
            </div>

            {/* Status & Follow-up Date */}
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="status" className="form-label">
                  Status <span className="required-star">*</span>
                </label>
                <select
                  id="status"
                  name="status"
                  className={`form-select ${errors.status ? 'input-error' : ''}`}
                  value={formData.status}
                  onChange={handleChange}
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                {errors.status && (
                  <span className="field-error-message">{errors.status}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="followUpDate" className="form-label">
                  Follow-up Date
                </label>
                <input
                  id="followUpDate"
                  name="followUpDate"
                  type="date"
                  className="form-input"
                  value={formData.followUpDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Short Description */}
            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description <span className="required-star">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows="2"
                className={`form-textarea ${errors.description ? 'input-error' : ''}`}
                placeholder="Brief summary of the issue or outstanding requirement..."
                value={formData.description}
                onChange={handleChange}
              />
              {errors.description && (
                <span className="field-error-message">{errors.description}</span>
              )}
            </div>

            {/* Notes */}
            <div className="form-group">
              <label htmlFor="notes" className="form-label">
                Notes & Activity Log
              </label>
              <textarea
                id="notes"
                name="notes"
                rows="3"
                className="form-textarea"
                placeholder="Detailed notes, phone call logs, underwriter correspondence..."
                value={formData.notes}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Save Changes' : 'Create Case'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CaseFormModal;

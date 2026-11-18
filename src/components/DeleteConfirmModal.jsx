import React, { useEffect } from 'react';

/**
 * DeleteConfirmModal Component
 * Prevents accidental deletion by requiring explicit user confirmation.
 */
function DeleteConfirmModal({ isOpen, onClose, onConfirm, caseItem }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !caseItem) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <div
        className="modal-card modal-card-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header modal-header-danger">
          <div className="danger-icon-wrapper">
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </div>
          <div>
            <h2 id="delete-modal-title" className="modal-title">
              Delete Case Record
            </h2>
            <p className="modal-subtitle">This action cannot be undone.</p>
          </div>
        </div>

        <div className="modal-body">
          <p className="delete-warning-text">
            Are you sure you want to delete case <strong>{caseItem.id}</strong> for{' '}
            <strong>{caseItem.clientName}</strong>?
          </p>
          <div className="delete-case-summary">
            <div>
              <span className="summary-label">Type:</span> {caseItem.caseType}
            </div>
            <div>
              <span className="summary-label">Description:</span>{' '}
              {caseItem.description}
            </div>
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
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
          >
            Yes, Delete Case
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;

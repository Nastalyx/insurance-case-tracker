import React, { useState, useEffect, useMemo } from 'react';
import Dashboard from './components/Dashboard';
import CaseFilters from './components/CaseFilters';
import CaseList from './components/CaseList';
import CaseFormModal from './components/CaseFormModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import { STORAGE_KEY } from './constants.js';
import { getInitialCases } from './data/initialCases.js';
import { getTodayString } from './utils/dateUtils.js';

/**
 * Main Application Component
 * Demonstrates clean React architecture for beginners:
 * - Centralized state management
 * - localStorage persistence with error handling
 * - Controlled modal workflows
 * - Derived state for filters and dashboard calculations
 */
function App() {
  // -------------------------------------------------------------
  // 1. STATE INITIALIZATION (with localStorage safety)
  // -------------------------------------------------------------
  const [cases, setCases] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ensure parsed item is actually an array
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Failed to read cases from localStorage, falling back to sample data:', err);
    }
    // First visit or empty storage: load sample cases
    return getInitialCases();
  });

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  // Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCase, setEditingCase] = useState(null); // null = Add mode, object = Edit mode
  const [deletingCase, setDeletingCase] = useState(null); // null = closed, object = confirming delete

  // Flash toast message state for user feedback
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // -------------------------------------------------------------
  // 2. DATA PERSISTENCE (Syncing with localStorage)
  // -------------------------------------------------------------
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
    } catch (err) {
      console.error('Failed to save cases to localStorage:', err);
    }
  }, [cases]);

  // -------------------------------------------------------------
  // 3. CASE ID GENERATOR HELPER
  // -------------------------------------------------------------
  // Generates next case ID (e.g. CASE-1007) based on existing IDs
  const generateNextCaseId = () => {
    const existingNumbers = cases
      .map((c) => {
        const match = c.id && c.id.match(/CASE-(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter((n) => !isNaN(n));

    const highest = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 1000;
    return `CASE-${highest + 1}`;
  };

  // -------------------------------------------------------------
  // 4. CRUD HANDLERS
  // -------------------------------------------------------------

  // Open modal for creating a new case
  const handleOpenAddModal = () => {
    setEditingCase(null);
    setIsFormModalOpen(true);
  };

  // Open modal for editing an existing case
  const handleOpenEditModal = (caseToEdit) => {
    setEditingCase(caseToEdit);
    setIsFormModalOpen(true);
  };

  // Save case (handles both Add and Edit)
  const handleSaveCase = (formData) => {
    if (editingCase) {
      // EDIT MODE: Update existing case by ID without duplicating
      setCases((prevCases) =>
        prevCases.map((c) =>
          c.id === editingCase.id
            ? {
                ...c,
                ...formData,
                // Preserve original ID and creation date
                id: editingCase.id,
                dateCreated: editingCase.dateCreated || getTodayString(),
              }
            : c
        )
      );
      showToast(`Case ${editingCase.id} successfully updated.`);
    } else {
      // ADD MODE: Create a brand new case
      const newCase = {
        ...formData,
        id: generateNextCaseId(),
        dateCreated: getTodayString(),
      };
      setCases((prevCases) => [newCase, ...prevCases]);
      showToast(`New case ${newCase.id} created successfully.`);
    }

    setIsFormModalOpen(false);
    setEditingCase(null);
  };

  // Open confirmation modal for deleting a case
  const handleOpenDeleteModal = (caseToDelete) => {
    setDeletingCase(caseToDelete);
  };

  // Confirm delete handler
  const handleConfirmDelete = () => {
    if (!deletingCase) return;

    setCases((prevCases) => prevCases.filter((c) => c.id !== deletingCase.id));
    showToast(`Case ${deletingCase.id} has been deleted.`);
    setDeletingCase(null);
  };

  // Reset search and dropdown filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setPriorityFilter('');
  };

  // Optional convenience: reset data back to sample cases
  const handleResetToSampleData = () => {
    if (window.confirm('Restore initial sample cases? Any customized cases will be replaced.')) {
      const sample = getInitialCases();
      setCases(sample);
      handleResetFilters();
      showToast('Sample cases restored.');
    }
  };

  // -------------------------------------------------------------
  // 5. FILTERING LOGIC (Search + Status + Priority together)
  // -------------------------------------------------------------
  const filteredCases = useMemo(() => {
    return cases.filter((item) => {
      // Search matching either client name or case description
      const normalizedSearch = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !normalizedSearch ||
        (item.clientName && item.clientName.toLowerCase().includes(normalizedSearch)) ||
        (item.description && item.description.toLowerCase().includes(normalizedSearch));

      // Status filter
      const matchesStatus = !statusFilter || item.status === statusFilter;

      // Priority filter
      const matchesPriority = !priorityFilter || item.priority === priorityFilter;

      // All active criteria must be satisfied
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [cases, searchTerm, statusFilter, priorityFilter]);

  return (
    <div className="app-layout">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification" role="status" aria-live="polite">
          <span className="toast-icon">✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Header */}
      <header className="app-header">
        <div className="container header-container">
          <div className="brand-group">
            <div className="brand-icon">
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <div>
              <h1 className="brand-title">Insurance Case Tracker</h1>
              <p className="brand-subtitle">Operations & Client Follow-up Management</p>
            </div>
          </div>

          <div className="header-actions">
            <button
              type="button"
              className="btn btn-secondary-subtle"
              onClick={handleResetToSampleData}
              title="Reload fictional sample cases"
            >
              Reset Sample Cases
            </button>
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="container main-content">
        {/* 1. Dashboard Summary Cards */}
        <Dashboard cases={cases} />

        {/* 2. Filter & Action Toolbar */}
        <CaseFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={setPriorityFilter}
          onResetFilters={handleResetFilters}
          onOpenAddModal={handleOpenAddModal}
          filteredCount={filteredCases.length}
          totalCount={cases.length}
        />

        {/* 3. Tabular Case List */}
        <section className="case-list-section" aria-label="Cases Table">
          <CaseList
            cases={filteredCases}
            onEdit={handleOpenEditModal}
            onDelete={handleOpenDeleteModal}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="container footer-content">
          <p>Insurance Case Tracker &bull; Personal Operations Workspace</p>
          <p className="footer-storage-note">
            Data is persisted securely in your local browser storage.
          </p>
        </div>
      </footer>

      {/* Add / Edit Case Modal */}
      <CaseFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveCase}
        initialData={editingCase}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingCase)}
        onClose={() => setDeletingCase(null)}
        onConfirm={handleConfirmDelete}
        caseItem={deletingCase}
      />
    </div>
  );
}

export default App;

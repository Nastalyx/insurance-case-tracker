/**
 * Utility functions for handling dates and overdue checks.
 */

// Format a Date object to YYYY-MM-DD string (safe for local timezone)
export function toISODateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Get today's date formatted as YYYY-MM-DD
export function getTodayString() {
  return toISODateString(new Date());
}

/**
 * Checks if a follow-up date is in the past.
 * Rule: Resolved cases are NEVER marked as overdue.
 */
export function isFollowUpOverdue(followUpDate, status) {
  if (!followUpDate) return false;
  if (status === 'Resolved') return false;

  const today = getTodayString();
  // String comparison works directly for YYYY-MM-DD format
  return followUpDate < today;
}

/**
 * Formats a YYYY-MM-DD string to a readable format (e.g. "Nov 15, 2026")
 */
export function formatDisplayDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    if (!year || !month || !day) return dateStr;
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Helper to generate relative sample dates for initial mock data
 * daysOffset: negative for past, positive for future
 */
export function getRelativeDateString(daysOffset) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return toISODateString(d);
}

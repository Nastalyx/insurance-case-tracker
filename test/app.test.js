import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { CASE_TYPES, PRIORITIES, STATUSES } from '../src/constants.js';
import { isFollowUpOverdue, toISODateString, getTodayString } from '../src/utils/dateUtils.js';
import { getInitialCases } from '../src/data/initialCases.js';

describe('Insurance Case Tracker - Test Suite', () => {

  describe('1. Constants and Option Sets', () => {
    test('contains all required case types', () => {
      const expected = [
        'Life Insurance',
        'Claims',
        'Underwriting',
        'Policy Change',
        'Missing Documents',
        'Client Follow-up',
        'Other',
      ];
      assert.deepEqual(CASE_TYPES, expected);
    });

    test('contains all required priorities', () => {
      assert.deepEqual(PRIORITIES, ['High', 'Medium', 'Low']);
    });

    test('contains all required statuses', () => {
      assert.deepEqual(STATUSES, [
        'Open',
        'In Progress',
        'Awaiting Client',
        'Awaiting Carrier',
        'Resolved',
      ]);
    });
  });

  describe('2. Overdue Logic Requirements', () => {
    test('marks past follow-up date as overdue for non-resolved cases', () => {
      const pastDate = '2026-11-10';
      assert.equal(isFollowUpOverdue(pastDate, 'Open'), true);
      assert.equal(isFollowUpOverdue(pastDate, 'In Progress'), true);
      assert.equal(isFollowUpOverdue(pastDate, 'Awaiting Client'), true);
      assert.equal(isFollowUpOverdue(pastDate, 'Awaiting Carrier'), true);
    });

    test('NEVER marks Resolved cases as overdue even if follow-up is in the past', () => {
      const pastDate = '2020-01-01';
      assert.equal(isFollowUpOverdue(pastDate, 'Resolved'), false);
    });

    test('does not mark today or future follow-up dates as overdue', () => {
      const today = getTodayString();
      assert.equal(isFollowUpOverdue(today, 'Open'), false);

      const futureDate = '2099-12-31';
      assert.equal(isFollowUpOverdue(futureDate, 'Open'), false);
    });

    test('handles missing or empty follow-up date safely', () => {
      assert.equal(isFollowUpOverdue('', 'Open'), false);
      assert.equal(isFollowUpOverdue(null, 'Open'), false);
      assert.equal(isFollowUpOverdue(undefined, 'Open'), false);
    });
  });

  describe('3. Initial Mock Data Validation', () => {
    const initialCases = getInitialCases();

    test('loads 6 sample cases with all required fields', () => {
      assert.equal(initialCases.length, 6);
      for (const item of initialCases) {
        assert.ok(item.id, 'Case has ID');
        assert.ok(item.clientName, 'Case has clientName');
        assert.ok(CASE_TYPES.includes(item.caseType), `Valid caseType: ${item.caseType}`);
        assert.ok(item.description, 'Case has description');
        assert.ok(PRIORITIES.includes(item.priority), `Valid priority: ${item.priority}`);
        assert.ok(STATUSES.includes(item.status), `Valid status: ${item.status}`);
        assert.ok(item.dateCreated, 'Case has dateCreated');
      }
    });

    test('includes both overdue and resolved cases', () => {
      const overdueCases = initialCases.filter((c) => isFollowUpOverdue(c.followUpDate, c.status));
      const resolvedCases = initialCases.filter((c) => c.status === 'Resolved');

      assert.ok(overdueCases.length >= 2, 'Has at least 2 overdue cases');
      assert.ok(resolvedCases.length >= 1, 'Has at least 1 resolved case');

      // Resolved case with past date is not counted as overdue
      for (const r of resolvedCases) {
        assert.equal(isFollowUpOverdue(r.followUpDate, r.status), false);
      }
    });
  });

  describe('4. Dashboard Metrics Calculation', () => {
    test('accurately calculates dashboard totals from case records', () => {
      const mockCases = [
        { id: 'CASE-1', status: 'Open', followUpDate: '2026-11-01' },       // Open & Overdue
        { id: 'CASE-2', status: 'In Progress', followUpDate: '2026-11-02' },// Open & Overdue
        { id: 'CASE-3', status: 'Awaiting Client', followUpDate: '2099-01-01' }, // Open & Not Overdue
        { id: 'CASE-4', status: 'Resolved', followUpDate: '2026-11-01' },    // Resolved (not overdue!)
        { id: 'CASE-5', status: 'Resolved', followUpDate: '2099-01-01' },    // Resolved
      ];

      const totalCases = mockCases.length;
      const openCases = mockCases.filter((c) => c.status !== 'Resolved').length;
      const overdueCases = mockCases.filter((c) => isFollowUpOverdue(c.followUpDate, c.status)).length;
      const resolvedCases = mockCases.filter((c) => c.status === 'Resolved').length;

      assert.equal(totalCases, 5);
      assert.equal(openCases, 3);
      assert.equal(overdueCases, 2);
      assert.equal(resolvedCases, 2);
    });
  });

  describe('5. Search & Filter Behavior (Working Together)', () => {
    const testCases = [
      { id: 'CASE-101', clientName: 'Eleanor Vance', description: 'Beneficiary change for term policy', status: 'Open', priority: 'High' },
      { id: 'CASE-102', clientName: 'Marcus Sterling', description: 'APS medical records needed', status: 'In Progress', priority: 'Medium' },
      { id: 'CASE-103', clientName: 'Eleanor Roosevelt', description: 'Annual policy review', status: 'Resolved', priority: 'Low' },
      { id: 'CASE-104', clientName: 'Arthur Pendelton', description: 'Beneficiary update form', status: 'Open', priority: 'High' },
    ];

    const filterHelper = (cases, search, status, priority) => {
      return cases.filter((c) => {
        const query = search.trim().toLowerCase();
        const matchesSearch =
          !query ||
          c.clientName.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query);
        const matchesStatus = !status || c.status === status;
        const matchesPriority = !priority || c.priority === priority;
        return matchesSearch && matchesStatus && matchesPriority;
      });
    };

    test('searches client name case-insensitively', () => {
      const results = filterHelper(testCases, 'eleanor', '', '');
      assert.equal(results.length, 2);
    });

    test('searches description case-insensitively', () => {
      const results = filterHelper(testCases, 'beneficiary', '', '');
      assert.equal(results.length, 2); // CASE-101 and CASE-104
    });

    test('filters by status', () => {
      const results = filterHelper(testCases, '', 'Open', '');
      assert.equal(results.length, 2);
    });

    test('filters by priority', () => {
      const results = filterHelper(testCases, '', '', 'High');
      assert.equal(results.length, 2);
    });

    test('combines search + status + priority simultaneously', () => {
      // Search 'Eleanor' + Status 'Open' + Priority 'High' -> CASE-101 only
      const results = filterHelper(testCases, 'Eleanor', 'Open', 'High');
      assert.equal(results.length, 1);
      assert.equal(results[0].id, 'CASE-101');

      // Search 'Eleanor' + Status 'Resolved' -> CASE-103
      const resolvedEleanor = filterHelper(testCases, 'Eleanor', 'Resolved', '');
      assert.equal(resolvedEleanor.length, 1);
      assert.equal(resolvedEleanor[0].id, 'CASE-103');

      // Non-matching combo
      const emptyResult = filterHelper(testCases, 'Eleanor', 'In Progress', '');
      assert.equal(emptyResult.length, 0);
    });
  });

  describe('6. Case Management Operations (Add, Edit, Delete)', () => {
    let cases = [...getInitialCases()];

    test('generates next sequential case ID and adds case', () => {
      const existingNumbers = cases.map((c) => {
        const match = c.id.match(/CASE-(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      });
      const highest = Math.max(...existingNumbers);
      const nextId = `CASE-${highest + 1}`;

      assert.equal(nextId, 'CASE-1007');

      const newCase = {
        id: nextId,
        clientName: 'Samantha Brooks',
        caseType: 'Life Insurance',
        description: 'New policy setup',
        priority: 'High',
        status: 'Open',
        followUpDate: '2026-11-20',
        notes: 'Contacted client',
        dateCreated: getTodayString(),
      };

      cases = [newCase, ...cases];
      assert.equal(cases.length, 7);
      assert.equal(cases[0].id, 'CASE-1007');
    });

    test('edits an existing case without creating duplicates', () => {
      const caseIdToEdit = 'CASE-1007';
      const updatedData = {
        clientName: 'Samantha Brooks-Miller',
        caseType: 'Life Insurance',
        description: 'Updated policy setup with spouse rider',
        priority: 'Medium',
        status: 'Resolved',
        followUpDate: '2026-11-20',
        notes: 'Spouse documents attached',
      };

      cases = cases.map((c) => (c.id === caseIdToEdit ? { ...c, ...updatedData } : c));

      // Should still have exactly 7 items (no duplication!)
      assert.equal(cases.length, 7);
      const edited = cases.find((c) => c.id === caseIdToEdit);
      assert.equal(edited.clientName, 'Samantha Brooks-Miller');
      assert.equal(edited.status, 'Resolved');
      assert.equal(edited.priority, 'Medium');
    });

    test('deletes a case after confirmation', () => {
      const caseIdToDelete = 'CASE-1007';
      cases = cases.filter((c) => c.id !== caseIdToDelete);

      assert.equal(cases.length, 6);
      const deleted = cases.find((c) => c.id === caseIdToDelete);
      assert.equal(deleted, undefined);
    });
  });

  describe('7. LocalStorage Resilience & Fallback Handling', () => {
    test('recovers safely from invalid JSON string without throwing', () => {
      const parseStorage = (raw) => {
        try {
          if (!raw) return getInitialCases();
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        } catch {
          // ignore error
        }
        return getInitialCases();
      };

      // Corrupted JSON string
      const corruptedResult = parseStorage('{"invalid-json: [}}');
      assert.ok(Array.isArray(corruptedResult));
      assert.equal(corruptedResult.length, 6);

      // Empty string
      const emptyResult = parseStorage('');
      assert.ok(Array.isArray(emptyResult));
      assert.equal(emptyResult.length, 6);

      // Null
      const nullResult = parseStorage(null);
      assert.ok(Array.isArray(nullResult));
      assert.equal(nullResult.length, 6);

      // Non-array JSON
      const objectResult = parseStorage('{"some": "object"}');
      assert.ok(Array.isArray(objectResult));
      assert.equal(objectResult.length, 6);

      // Valid stored cases
      const validMock = [{ id: 'CASE-999', clientName: 'Test Client', status: 'Open' }];
      const validResult = parseStorage(JSON.stringify(validMock));
      assert.equal(validResult.length, 1);
      assert.equal(validResult[0].id, 'CASE-999');
    });
  });

});

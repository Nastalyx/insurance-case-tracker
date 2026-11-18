import { getRelativeDateString } from '../utils/dateUtils.js';

/**
 * Sample initial cases loaded on the first visit.
 * Fictional client names and realistic insurance operational scenarios.
 */
export function getInitialCases() {
  return [
    {
      id: 'CASE-1001',
      clientName: 'Eleanor Vance',
      caseType: 'Life Insurance',
      description: 'Review updated beneficiary designation form for Term Life policy.',
      priority: 'High',
      status: 'Open',
      followUpDate: getRelativeDateString(-3), // 3 days ago (Overdue!)
      notes: 'Client submitted form with missing signature on page 2. Left voicemail on Monday.',
      dateCreated: getRelativeDateString(-7),
    },
    {
      id: 'CASE-1002',
      clientName: 'Marcus Sterling',
      caseType: 'Missing Documents',
      description: 'Pending attending physician statement (APS) for disability rider.',
      priority: 'Medium',
      status: 'In Progress',
      followUpDate: getRelativeDateString(-1), // 1 day ago (Overdue!)
      notes: 'Contacted Dr. Reynolds office directly. Records department promised dispatch by end of week.',
      dateCreated: getRelativeDateString(-5),
    },
    {
      id: 'CASE-1003',
      clientName: 'Sophia Chen',
      caseType: 'Underwriting',
      description: 'Medical exam schedule confirmation with mobile paramedical service.',
      priority: 'High',
      status: 'Awaiting Client',
      followUpDate: getRelativeDateString(1), // Tomorrow
      notes: 'Sent SMS reminder for blood panel fasting requirements. Appointment confirmed for Thursday 9 AM.',
      dateCreated: getRelativeDateString(-3),
    },
    {
      id: 'CASE-1004',
      clientName: 'David Miller',
      caseType: 'Policy Change',
      description: 'Request to increase deductible and adjust commercial property coverage.',
      priority: 'Low',
      status: 'Awaiting Carrier',
      followUpDate: getRelativeDateString(4), // Future
      notes: 'Endorsement request submitted to underwriters via carrier portal ticket #UW-8921.',
      dateCreated: getRelativeDateString(-2),
    },
    {
      id: 'CASE-1005',
      clientName: 'Amina Patel',
      caseType: 'Claims',
      description: 'Water damage emergency mitigation claim documentation finalized.',
      priority: 'Medium',
      status: 'Resolved',
      // Note: follow-up was in the past, but because status is "Resolved", it is NOT overdue!
      followUpDate: getRelativeDateString(-5),
      notes: 'Adjuster approved payment of $4,850. Client confirmed receipt of funds. File closed.',
      dateCreated: getRelativeDateString(-10),
    },
    {
      id: 'CASE-1006',
      clientName: 'Robert & Clara Hayes',
      caseType: 'Client Follow-up',
      description: 'Annual comprehensive policy review and umbrella coverage assessment.',
      priority: 'Low',
      status: 'Open',
      followUpDate: getRelativeDateString(7), // Next week
      notes: 'Prepared comparative premium illustration for $2M umbrella policy option.',
      dateCreated: getRelativeDateString(-1),
    },
  ];
}

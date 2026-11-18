# Insurance Case Tracker

A clean, modern, and lightweight insurance operations personal productivity tool built with **React**, **Vite**, and **vanilla CSS**.

---

## 1. What the Application Does

The **Insurance Case Tracker** helps insurance professionals track client service cases, outstanding underwriting requirements, policy updates, and follow-up deadlines without backend complexity.

### Core Capabilities:
- **Real-Time Dashboard Metrics**: Calculates total cases, active open cases, overdue follow-ups, and resolved cases dynamically from actual records.
- **Full Case Management (CRUD)**: Add new cases, edit existing cases without duplication, and delete records with a safety confirmation prompt.
- **Combined Search & Filtering**: Instant search across client names and descriptions alongside status and priority dropdown filters.
- **Smart Overdue Highlighting**: Follow-up dates that have passed are highlighted with alert indicators—while correctly excluding resolved cases.
- **Persistent Local Data**: Changes remain saved across browser reloads and reboots using browser `localStorage`, with graceful fallbacks.

---

## 2. Project Structure & Important Files

```
casetracker/
├── index.html                 # Main HTML entry point
├── package.json               # Dependencies and scripts (React 18, Vite 5)
├── vite.config.js             # Vite development server configuration
├── test/
│   └── app.test.js            # Automated unit & integration tests (Node native test runner)
└── src/
    ├── main.jsx               # React DOM root render
    ├── App.jsx                # Main application state, filtering, and CRUD workflows
    ├── constants.js           # Case types, priorities, statuses, and storage keys
    ├── styles.css             # Professional styling, theme variables, and mobile responsiveness
    ├── components/
    │   ├── Dashboard.jsx      # 4 dynamic summary metric cards
    │   ├── CaseFilters.jsx    # Search input, status & priority dropdowns, reset button
    │   ├── CaseList.jsx       # Data table, status badges, overdue indicators, expandable notes
    │   ├── CaseFormModal.jsx  # Reusable modal form for creating and editing cases
    │   └── DeleteConfirmModal.jsx # Confirmation dialog to prevent accidental deletion
    ├── data/
    │   └── initialCases.js    # Fictional sample records for first-time visitors
    └── utils/
        └── dateUtils.js       # Date formatting, comparison, and overdue verification logic
```

---

## 3. How LocalStorage Works in This Application

1. **Initialization (`src/App.jsx`)**:
   - On page load, `useState` runs a lazy initializer function.
   - It attempts to fetch `localStorage.getItem('insurance_case_tracker_data')` and parse the JSON string.
   - If the storage is empty, null, or corrupted, it catches the error and safely falls back to fictional sample cases (`getInitialCases()`).

2. **Synchronization (`useEffect`)**:
   - An `useEffect` hook monitors the `cases` state array.
   - Whenever a case is added, updated, or removed, the hook serializes the array with `JSON.stringify(cases)` and writes it to `localStorage`.

3. **Data Safety**:
   - Closing the tab, refreshing the page, or quitting the browser preserves all your case data.
   - A convenient "Reset Sample Cases" button in the header allows users to restore the initial demo data anytime.

---

## 4. How to Run the App Locally

### Prerequisites:
- Node.js (version 18 or newer)
- npm

### Steps:
```bash
# 1. Install dependencies (if not already installed)
npm install

# 2. Start the Vite development server
npm run dev

# 3. Open in your browser
# Navigate to: http://localhost:3000 (or the port shown in your terminal)

# 4. Run automated test suite
npm test

# 5. Build for production
npm run build
```

---

## 5. Limitations Before Deploying

As a personal client-side productivity tool, consider the following before production deployment:

1. **Single-Device / Single-Browser Scope**: `localStorage` is tied to one specific browser on one machine. Cases entered in Chrome on a laptop will not sync to another browser or mobile device.
2. **Storage Quota & Data Clearing**: Clearing browser cache or history can erase `localStorage`.
3. **No Multi-User Collaboration**: Since there is no centralized database or backend server, multiple team members cannot collaborate on the same case queue in real time.
4. **No Authentication / Access Controls**: The app opens directly without login or permissions. Anyone with access to the browser profile can view the cases.

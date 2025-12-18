# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Typifyy is a typing test application built with React 19, TypeScript, and Vite. Users can practice typing with two modes: timed tests or word-count tests. The app tracks WPM, accuracy, and other statistics with real-time graphs.

## Commands

```bash
npm run dev      # Start development server
npm run build    # TypeScript compile + Vite build
npm run lint     # ESLint check
npm run preview  # Preview production build
```

## Directory Structure

```
/src
  /components
    /ui/              # Reusable UI components (IconButton, InputAndIndicator, CustomToast, NavIcon, MenuItem, PersonalBestCard, DetailCard)
    TypeZone.tsx      # Core typing test component (537 lines)
    Header.tsx        # Navigation header with logo, nav icons, and account dropdown menu
    Footer.tsx        # Footer (placeholder)
    MenuBar.tsx       # Test mode/duration selector
    Stats.tsx         # Results display with Graph + Firestore persistence
    Graph.tsx         # WPM visualization with Chart.js
    TimeCounter.tsx   # Timer or word counter display
    HistoryTable.tsx  # Test results history table with pagination
    StatsOverview.tsx # User statistics overview (all-time and last 10 tests)
    PersonalBests.tsx # Personal best records by test mode
    ActivityHeatMap.tsx # GitHub-style activity heatmap
    UserDetails.tsx   # User profile header with stats (streak, tests completed, time typing)
    index.ts          # Barrel export
  /context            # React Context for state management
  /layouts            # Layout components (RootLayout)
  /pages              # Page components (Home, Login, Account)
  /types              # TypeScript type definitions
  /ui                 # Legacy UI components (Button)
  /utils              # Utility functions (errorMapping.ts)
  App.tsx             # Router configuration
  main.tsx            # React root entry (TestModeContextProvider wraps app)
  index.css           # Tailwind + custom styles + animations
  firebaseConfig.ts   # Firebase initialization
```

## Architecture

### Routing & Layout
- `src/App.tsx` - React Router configuration with `RootLayout` wrapper
- `src/layouts/RootLayout.tsx` - Grid layout with Header, Outlet, Footer
- Pages: `Home` (typing test), `Login` (auth forms), `Account` (user history)
- Header nav links: `/`, `/about`, `/settings`, `/login` (or account dropdown when logged in)

### State Management
- `src/context/TestMode.tsx` - Global context for test configuration
- Access via `useTestMode()` hook
- State: `mode` ("time" | "words"), `testTime` (default: 30s), `testWords` (default: 25)
- Provider wraps app in `main.tsx`

### Core Typing Logic (TypeZone.tsx)
- Word generation using `random-words` library
- Character-by-character validation with direct DOM manipulation
- Caret positioning via CSS classes (`.caret`, `.caret_end`)
- WPM calculations:
  - Raw WPM: `(correctChars / 5) / timeInMinutes`
  - Net WPM: `(correctChars - incorrectChars) / 5 / timeInMinutes`
- Graph data format: `[timeElapsed, rawWPM, netWPM]` collected per second
- AFK detection: 5-second inactivity timeout
- Auto-scroll: Keeps current word on line 2
- Uses refs for optimization (`correctCharRef`, `incorrectCharRef`, `wordSpanRef[]`)

### Firebase Integration
- `src/firebaseConfig.ts` - Exports `auth` and `db` (Firestore)
- Environment variables: `VITE_FIREBASE_*` (apiKey, authDomain, projectId, etc.)
- Auth methods: email/password, Google OAuth
- Error mapping: `src/utils/errorMapping.ts` - Firebase error codes to user-friendly messages

### Firestore Data Model
- **Collection: `results`** - Test results (saved in `Stats.tsx`, queried in `Account.tsx`)
  - `userId` (string) - Firebase Auth UID
  - `timestamp` (Timestamp) - When test was completed
  - `wpm` (number) - Net WPM (words per minute)
  - `raw` (number) - Raw WPM (includes incorrect characters)
  - `accuracy`, `consistency` (number) - Performance metrics
  - `correctChar`, `incorrectChar`, `missedChar`, `extraChar` (number) - Character stats
  - `correctWord` (number) - Words typed correctly
  - `mode` ("time" | "words") - Test mode
  - `testTime` (number | null) - Duration if time mode
  - `testWords` (number | null) - Word count if words mode
  - `testDuration` (number | null) - Actual time taken to complete test in seconds (used for time typing calculation)
  - `isAfk` (boolean) - AFK detection flag
- Invalid tests (AFK with 0% accuracy) are not saved
- **Query patterns**: Uses Firestore `orderBy("timestamp", "desc")` for server-side sorting (requires composite index: userId + timestamp)
- **Note**: Older records may not have `raw` field; components calculate it as fallback using character counts and time

### Styling
- Tailwind CSS v4 with custom theme in `src/index.css`
- Custom colors: `--color-dark`, `--color-dark-100`, `--color-fade`, `--color-active`, `--color-glow`
- Fonts: Roboto Mono, Space Mono, Softura-Demo (logo)
- Typing character states: `.correct`, `.incorrect`, `.extra-key`
- Animations: `blinking` (caret), `crazyCaret` (active caret)

### Types
- `src/types/index.ts` - Shared types:
  - `TestMode` - "time" | "words"
  - `StatsProps` - Stats component props (wpm, raw, accuracy, graphData, mode, isAfk, etc.)
  - `ButtonProps` - Button component props (btnIcon, btnTxt, btnClass, btnClick)
  - `TestModeContextType` - Context interface (mode, testTime, testWords + setters)
  - `PersonalBestData` - Personal best record (wpm, raw, accuracy, consistency, timestamp)
  - `PersonalBestCardProps` - PersonalBestCard component props (label, data)

### UI Components
- `src/components/ui/` - Reusable components:
  - `IconButton` - Button with optional icon + text, disabled state
  - `InputAndIndicator` - Input with validation status indicators (debounced 1000ms)
  - `CustomToast` - Styled toast notifications (success, error, warning, info)
  - `NavIcon` - Navigation link with delayed tooltip (900ms delay)
  - `MenuItem` - Dropdown menu item (renders as Link or button based on props)
  - `PersonalBestCard` - Displays personal best for a specific test mode with hover detail view
  - `DetailCard` - Simple title/value card for stats display (used in UserDetails)
- Toast notifications via `react-toastify` (position: top-right, auto-close: 5000ms)

### Header Component
- Conditional rendering based on auth state via `onAuthStateChanged`
- Logged out: Shows login NavIcon
- Logged in: Shows account button with hover dropdown menu
  - Menu items: user stats, public profile, account settings, sign out
  - Hover effect with opacity/visibility transition (200ms)

### Login/Registration
- Validation:
  - Username: min 6 chars
  - Email: regex validation
  - Password: min 8 chars, requires uppercase, number, special char
  - Verification fields must match original
- Navigation: Redirects to `/account` after successful login/signup (email, Google)

### Account Page
- `src/pages/Account.tsx` - User test history page
- Fetches user's test results from Firestore on auth state change
- Query: `where("userId", "==", uid)` + `orderBy("timestamp", "desc")`
- Loading/error states for better UX
- Displays multiple components:
  - `UserDetails` - User profile header with avatar, username, joined date, and stats
  - `PersonalBests` - Shows best WPM for each test mode (time: 15s, 30s, 60s; words: 10, 25, 50)
  - `ActivityHeatMap` - GitHub-style activity visualization (shown if user has any tests)
  - `StatsOverview` - Statistical summary (shown if user has ≥10 tests)
  - `HistoryTable` - Paginated test results (shown if user has any tests)
- Uses `useMemo` to calculate personal bests from test data
- **Personal Best Calculation**: Highest WPM for each specific mode/duration combination
- **Note**: In development, StrictMode causes duplicate saves (2 entries per test). This does NOT happen in production builds.

### HistoryTable Component
- `src/components/HistoryTable.tsx` - Paginated test results table
- **Pagination**: Shows 10 entries initially, loads 10 more on "Load More" click
- "Load More" button visibility:
  - Hidden if total data ≤ 10
  - Hidden when all data is displayed
  - Shows only when more data is available
- Displays: WPM, raw WPM, accuracy, consistency, character stats, mode, timestamp
- Alternating row colors for better readability
- Character breakdown tooltip on hover
- Crown icon placeholder (for future personal best highlighting)

### PersonalBests Component
- `src/components/PersonalBests.tsx` - Personal best records display
- Shows two grid sections: time modes (15s, 30s, 60s) and word modes (10, 25, 50)
- Uses `PersonalBestCard` for each mode
- Displays "—" for modes with no data
- Accepts `PersonalBestData | null` for each mode
- Each card shows: WPM, accuracy (quick view) and full stats on hover (WPM, raw, accuracy, consistency, date)

### StatsOverview Component
- `src/components/StatsOverview.tsx` - Statistical summary dashboard
- **Visibility**: Only renders if user has ≥10 tests
- Uses `useMemo` for performance optimization
- Displays 3-column grid with stats for: WPM, Raw, Accuracy, Consistency
- Each metric shows:
  - Highest value (with mode/duration subtitle for WPM/Raw)
  - Average (all-time)
  - Average (last 10 tests)
- **Raw WPM calculation**: Uses stored `raw` field or calculates fallback for older records
- All averages are rounded to nearest integer

### ActivityHeatMap Component
- `src/components/ActivityHeatMap.tsx` - GitHub-style activity heatmap
- Displays test activity over time in calendar grid format
- **Time Filters**: Dropdown with "last 12 months" or specific years (auto-populated from data)
- **Grid Layout**:
  - Weeks displayed horizontally (up to 53 weeks)
  - Days displayed vertically (Sun-Sat)
  - Week labels on left (Mon, Wed, Fri)
  - Month labels at bottom
- **Color Intensity**: 5 levels based on test count (0, 1-2, 3-5, 6-10, 11+ tests)
- **Tooltip**: Shows date and test count on hover
- **Total Counter**: Displays total tests for selected period
- Uses `useMemo` for performance (weeks, monthLabels, totalTests calculated once per filter change)
- Dropdown closes on outside click (useRef + useEffect)
- **Note**: All timestamps use UTC timezone

### UserDetails Component
- `src/components/UserDetails.tsx` - User profile header with stats
- Displays: avatar, username, joined date, and typing statistics
- Uses `DetailCard` component for consistent stat display
- **Calculated Stats**:
  - **Current Streak**: Consecutive days with at least one test (must start from today or yesterday)
  - **Tests Completed**: Total count of test results
  - **Time Typing**: Total time spent typing in HH:MM:SS format
- **Time Typing Calculation**:
  - Uses stored `testDuration` if available
  - Falls back to `testTime` for time mode tests
  - Estimates from WPM for words mode: `(correctChars / 5) / WPM * 60`
- **User Info**: Gets username from `displayName` or email prefix, joined date from `metadata.creationTime`

## Tech Stack

- React 19.0.0, TypeScript 5.7.2, Vite 6.3.1
- React Router 7.9.5
- Tailwind CSS 4.1.4
- Firebase 12.6.0 (auth + Firestore)
- Chart.js 4.5.1 + react-chartjs-2
- react-toastify, react-icons, random-words

## Unimplemented Features

- About page (linked but no route/component)
- Settings page (linked but no route/component)
- Account settings page `/account-settings` (linked but no route/component)
- Public profile page (menu item exists but no route/component)
- GitHub sign-in (UI ready, handler not implemented)
- Personal best highlighting in history table (crown icon placeholder exists; personal bests implemented in separate PersonalBests component)
- Graph view for individual test results (info icon placeholder exists)
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
    /ui/              # Reusable UI components (IconButton, InputAndIndicator, CustomToast, NavIcon)
    TypeZone.tsx      # Core typing test component (537 lines)
    Header.tsx        # Navigation header with logo + nav icons
    Footer.tsx        # Footer (placeholder)
    MenuBar.tsx       # Test mode/duration selector
    Stats.tsx         # Results display with Graph + Firestore persistence
    Graph.tsx         # WPM visualization with Chart.js
    TimeCounter.tsx   # Timer or word counter display
    index.ts          # Barrel export
  /context            # React Context for state management
  /layouts            # Layout components (RootLayout)
  /pages              # Page components (Home, Login)
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
- Pages: `Home` (typing test), `Login` (auth forms)
- Header nav links: `/`, `/about`, `/settings`, `/login`

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
- **Collection: `results`** - Test results (saved in `Stats.tsx`)
  - `userId` (string) - Firebase Auth UID
  - `timestamp` (Timestamp) - When test was completed
  - `wpm`, `accuracy`, `consistency` (number) - Performance metrics
  - `correctChar`, `incorrectChar`, `missedChar`, `extraChar` (number) - Character stats
  - `correctWord` (number) - Words typed correctly
  - `mode` ("time" | "words") - Test mode
  - `testTime` (number | null) - Duration if time mode
  - `testWords` (number | null) - Word count if words mode
  - `isAfk` (boolean) - AFK detection flag
- Invalid tests (AFK with 0% accuracy) are not saved

### Styling
- Tailwind CSS v4 with custom theme in `src/index.css`
- Custom colors: `--color-dark`, `--color-dark-100`, `--color-fade`, `--color-active`, `--color-glow`
- Fonts: Roboto Mono, Space Mono, Softura-Demo (logo)
- Typing character states: `.correct`, `.incorrect`, `.extra-key`
- Animations: `blinking` (caret), `crazyCaret` (active caret)

### Types
- `src/types/index.ts` - Shared types:
  - `TestMode` - "time" | "words"
  - `StatsProps` - Stats component props (wpm, accuracy, graphData, mode, isAfk, etc.)
  - `ButtonProps` - Button component props (btnIcon, btnTxt, btnClass, btnClick)
  - `TestModeContextType` - Context interface (mode, testTime, testWords + setters)

### UI Components
- `src/components/ui/` - Reusable components:
  - `IconButton` - Button with optional icon + text, disabled state
  - `InputAndIndicator` - Input with validation status indicators (debounced 1000ms)
  - `CustomToast` - Styled toast notifications (success, error, warning, info)
  - `NavIcon` - Navigation link with delayed tooltip (900ms delay)
- Toast notifications via `react-toastify` (position: top-right, auto-close: 5000ms)

### Login/Registration Validation
- Username: min 6 chars
- Email: regex validation
- Password: min 8 chars, requires uppercase, number, special char
- Verification fields must match original

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
- GitHub sign-in (UI ready, handler not implemented)
- User profile/stats history page (results saved but no UI to view history)
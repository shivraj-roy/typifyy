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
    /ui/              # Reusable UI components (IconButton, InputAndIndicator, CustomToast, NavIcon, MenuItem, PersonalBestCard, DetailCard, TextButton, LoadingBar)
    TypeZone.tsx      # Core typing test component with grid layout (650+ lines)
    Header.tsx        # Navigation header with logo, nav icons, account dropdown menu, and auth loading spinner
    Footer.tsx        # Footer with keyboard shortcuts and social links
    MenuBar.tsx       # Test mode/duration selector
    Stats.tsx         # Results display with Graph + Firestore persistence
    Graph.tsx         # WPM visualization with Chart.js
    TimeCounter.tsx   # Timer or word counter display (mini progress mode)
    TimeProgressBar.tsx # Horizontal progress bar at top of viewport (bar progress mode)
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

-  `src/App.tsx` - React Router configuration with `RootLayout` wrapper
-  `src/layouts/RootLayout.tsx` - Grid layout with Header, Outlet, Footer
   -  **Loading State**: Uses `useNavigation()` hook to detect route transitions
   -  During navigation: Header/Footer fade to 30% opacity, LoadingBar shows in outlet area
   -  After navigation: Normal rendering resumes
-  Pages: `Home` (typing test), `Login` (auth forms), `Account` (user history)
-  Header nav links: `/`, `/about`, `/settings`, `/login` (or account dropdown when logged in)

### State Management

-  `src/context/TestMode.tsx` - Global context for test configuration
   -  Access via `useTestMode()` hook
   -  State: `mode` ("time" | "words"), `testTime` (default: 30s), `testWords` (default: 25)
   -  Provider wraps app in `main.tsx`
-  `src/context/Settings.tsx` - Global context for user settings
   -  Access via `useSettings()` hook
   -  State: `minSpeedMode`, `minSpeedValue`, `minAccuracyMode`, `minAccuracyValue`, `soundVolume`, `soundMode`, `errorSoundMode`, `timeWarningMode`, `liveProgressMode`, `capsLockWarningMode`
   -  Settings modes: "off" | "custom"
   -  Sound modes: "off" | "nk cream" | "osu"
   -  Error sound modes: "off" | "blow" | "slap" | "whoosh"
   -  Time warning modes: "off" | "1" | "3" | "5" (seconds)
   -  Live progress modes: "off" | "mini" | "bar"
   -  Caps lock warning modes: "hide" | "show"
   -  Default values: min speed = 100 WPM, min accuracy = 75%, sound volume = 0.5, live progress = "mini", caps lock warning = "show"
   -  **Persistence**: All settings automatically saved to localStorage
   -  Provider wraps app in `main.tsx`

### Core Typing Logic (TypeZone.tsx)

-  **Layout Structure**: Grid layout with `grid-rows-[auto_1fr]` and `items-center` for vertical centering
   -  MenuBar at top (auto height)
   -  Content section below (1fr - takes remaining space)
   -  Content wrapped with `-mt-24` offset for positioning closer to center
   -  Restart/Next Test buttons positioned with `mt-8` spacing below content
-  Word generation using `random-words` library
-  Character-by-character validation with direct DOM manipulation
-  Caret positioning via CSS classes (`.caret`, `.caret_end`)
-  WPM calculations:
   -  Raw WPM: `(correctChars / 5) / timeInMinutes`
   -  Net WPM: `(correctChars - incorrectChars) / 5 / timeInMinutes`
-  Graph data format: `[timeElapsed, rawWPM, netWPM]` collected per second
-  AFK detection: 5-second inactivity timeout
-  Auto-scroll: Keeps current word on line 2
-  Uses refs for optimization (`correctCharRef`, `incorrectCharRef`, `wordSpanRef[]`)
-  **Word Error Underline**:
   -  `updateWordErrorClass()` helper function checks if word has errors and applies `.word-error` class
   -  Red underline appears only when space is pressed to move to next word
   -  Allows correction with backspace before committing to word
   -  Underline persists to show which words had mistakes
   -  Checks for incorrect, extra, or missed characters
-  **Space Key Behavior**:
   -  Space does NOT start the test (only actual character typing starts the timer)
   -  Space is ignored when caret is at the beginning of a word (`onCharIndex === 0`)
   -  Space only works to move to next word after typing at least one character
   -  Prevents accidental test start and word skipping at the beginning
-  **Restart Functionality**:
   -  **During test**: Restart button (redo icon) below words with `mt-8` spacing, Tab to focus + Enter to restart
   -  **After test**: Next Test button (chevron-right icon) below Stats with `mt-8` spacing, uses `nextTestBtnRef`
   -  **Header triggers**: Logo click and "start typing" NavIcon dispatch `restartTest` custom event
   -  TypeZone listens for `restartTest` event via `window.addEventListener`
   -  `restartTest` function (useCallback): clears timer, generates new words, resets all state
   -  **Focus management**: Active element is blurred when test ends so Tab focuses Next Test button on first press
-  **Sign in prompt**: Shows "Sign in to save your result" below Next Test button for non-authenticated users (`!auth.currentUser`), "Sign in" is underlined link to `/login`
-  **Button styling**: Transparent border by default, glows on Tab focus, icon glows on hover
-  **Tooltip**: Custom styled tooltip appears below button on hover/focus
-  **Test Mode Notices**: Displays active min speed/accuracy settings above typing area
   -  Shows when respective setting is enabled (custom mode)
   -  Uses `TextButton` component with icons (FaBolt for speed, FaBullseye for accuracy)
   -  Format: "min {value} wpm" and "min {value}% acc"
   -  Custom styling: text size 1em, gap 2
   -  Both notices can appear simultaneously if both settings are active
-  **Sound Integration**:
   -  **Keystroke Sounds**: Plays on every key press when `soundMode` is enabled
      -  Uses `playKeySound(keyCode, soundMode, soundVolume)` from soundPlayer utility
      -  Sound packs: "nk cream" or "osu" (keyboard click sounds)
   -  **Error Sounds**: Plays when typing errors occur (if `errorSoundMode` is enabled)
      -  Incorrect character typed
      -  Space pressed too early (at start of word)
      -  Space pressed in middle of word (before completing it)
      -  Extra characters typed beyond word length
      -  Uses `playErrorSound(errorSoundMode, soundVolume)` from soundPlayer utility
      -  Sound options: "blow", "slap", "whoosh"
   -  **Time Warning Sound**: Plays when timer reaches threshold in time mode (if `timeWarningMode` is enabled)
      -  Only works in time mode (not words mode)
      -  Plays when counter reaches 1, 3, or 5 seconds remaining
      -  Uses `playWarningSound(soundVolume)` from soundPlayer utility
      -  Plays once per test (tracked via `warningPlayedRef`)
      -  Sound: "Clock Ticking.wav"
   -  All sounds respect the `soundVolume` setting (0.0-1.0)
-  **Live Progress Display**:
   -  Controlled by `liveProgressMode` setting: "off" | "mini" | "bar"
   -  **TimeCounter** (mini mode): Traditional counter display above typing area
      -  Shows timer countdown (time mode) or word count (words mode)
      -  Only visible when `liveProgressMode === "mini"`
      -  Fades in when test starts (opacity: 0 → 100)
   -  **TimeProgressBar** (bar mode): Horizontal progress bar at top of viewport
      -  Only visible when `liveProgressMode === "bar"`
      -  Fixed positioning: `top-0 left-0 right-0` with 1px height
      -  Time mode: Width = `(counter / testTime) * 100%` (decreases from 100% to 0%)
      -  Words mode: Width = `(completedWords / testWords) * 100%` (increases from 0% to 100%)
      -  Smooth 1-second transition animation for width changes
      -  Uses active color (orange/red) for progress indicator
      -  Hidden when test hasn't started or has ended
   -  **Off mode**: Neither component renders (no progress indicator shown)
-  **Caps Lock Warning**:
   -  Controlled by `capsLockWarningMode` setting: "hide" | "show" (default: "show")
   -  **Detection**: Uses `getModifierState("CapsLock")` on keyboard events to detect Caps Lock state
   -  **Display**: Orange/red warning box with lock icon and "Caps Lock" text
   -  **Positioning**: Absolutely positioned above testModesNotice section
      -  Uses `absolute -top-16 left-1/2 -translate-x-1/2` for centered positioning
      -  Parent container has `overflow-visible` to prevent clipping
      -  Z-index: 50 to appear above other elements
   -  **Conditional Rendering**: Only shows when `capsLockOn && capsLockWarningMode === "show"`
   -  **State Management**: `capsLockOn` state tracks current Caps Lock status in real-time
   -  **No Layout Shift**: Absolute positioning ensures warning doesn't push content down when appearing

### Firebase Integration

-  `src/firebaseConfig.ts` - Exports `auth` and `db` (Firestore)
-  Environment variables: `VITE_FIREBASE_*` (apiKey, authDomain, projectId, etc.)
-  Auth methods: email/password, Google OAuth
-  Error mapping: `src/utils/errorMapping.ts` - Firebase error codes to user-friendly messages

### Firestore Data Model

-  **Collection: `results`** - Test results (saved in `Stats.tsx`, queried in `Account.tsx`)
   -  `userId` (string) - Firebase Auth UID
   -  `timestamp` (Timestamp) - When test was completed
   -  `wpm` (number) - Net WPM (words per minute)
   -  `raw` (number) - Raw WPM (includes incorrect characters)
   -  `accuracy`, `consistency` (number) - Performance metrics
   -  `correctChar`, `incorrectChar`, `missedChar`, `extraChar` (number) - Character stats
   -  `correctWord` (number) - Words typed correctly
   -  `mode` ("time" | "words") - Test mode
   -  `testTime` (number | null) - Duration if time mode
   -  `testWords` (number | null) - Word count if words mode
   -  `testDuration` (number | null) - Actual time taken to complete test in seconds (used for time typing calculation)
   -  `isAfk` (boolean) - AFK detection flag
-  Invalid tests (AFK with 0% accuracy) are not saved
-  **Test Validation**: Tests are validated against user settings before saving
   -  Min speed validation: If enabled (custom mode), tests with WPM below threshold are rejected
   -  Min accuracy validation: If enabled (custom mode), tests with accuracy below threshold are rejected
   -  Failed tests show notice toast: "Test failed - min speed" or "Test failed - min accuracy"
   -  Failed tests display reason in Stats "other" section: "failed - min speed" or "failed - min accuracy"
   -  Failed tests are NOT pushed to database (prevents pollution of test history)
   -  Validation runs for both authenticated and non-authenticated users
-  **Word Mode Auto-End**: Prevents infinite tests in word mode
   -  **Inactivity Timeout**: Auto-ends test after 30 seconds of no typing activity
   -  **Maximum Time Limit**: Auto-ends test after 5 minutes regardless of progress
   -  **Error Notification**: Shows error toast "Test failed - inactivity detected" when auto-end triggers
   -  **Stats Display**: Failed tests show "failed - bad activity" in Stats "other" section
   -  **Database**: Failed tests (testFailed=true) are NOT saved to database
   -  **Implementation**: Uses same AFK detection interval (1000ms) to check both conditions
   -  **State Management**: `testFailed` state tracks auto-end condition, passed to Stats component
   -  Only applies to word mode tests (time mode already has built-in time limit)
-  **Query patterns**: Uses Firestore `orderBy("timestamp", "desc")` for server-side sorting (requires composite index: userId + timestamp)
-  **Note**: Older records may not have `raw` field; components calculate it as fallback using character counts and time

### Styling

-  Tailwind CSS v4 with custom theme in `src/index.css`
-  Custom colors: `--color-dark`, `--color-dark-100`, `--color-fade`, `--color-active`, `--color-glow`
-  Fonts: Roboto Mono, Space Mono, Softura-Demo (logo)
-  Typing character states: `.correct`, `.incorrect`, `.extra-key`
-  Word error state: `.word-error` - Red underline (2px thickness, 4px offset) applied to words with errors when space is pressed
-  Animations: `blinking` (caret), `crazyCaret` (active caret)

### Types

-  `src/types/index.ts` - Shared types:
   -  `TestMode` - "time" | "words"
   -  `SettingMode` - "off" | "custom"
   -  `SoundMode` - "off" | "nk cream" | "osu"
   -  `ErrorSoundMode` - "off" | "blow" | "slap" | "whoosh"
   -  `TimeWarningMode` - "off" | "1" | "3" | "5"
   -  `LiveProgressMode` - "off" | "mini" | "bar"
   -  `CapsLockWarningMode` - "hide" | "show"
   -  `StatsProps` - Stats component props (wpm, raw, accuracy, graphData, mode, isAfk, etc.)
   -  `ButtonProps` - Button component props (btnIcon, btnTxt, btnClass, btnClick)
   -  `TestModeContextType` - Context interface (mode, testTime, testWords + setters)
   -  `SettingsContextType` - Context interface (minSpeedMode, minSpeedValue, minAccuracyMode, minAccuracyValue, soundVolume, soundMode, errorSoundMode, timeWarningMode, liveProgressMode, capsLockWarningMode + setters)
   -  `PersonalBestData` - Personal best record (wpm, raw, accuracy, consistency, timestamp)
   -  `PersonalBestCardProps` - PersonalBestCard component props (label, data)

### UI Components

-  `src/components/ui/` - Reusable components:
   -  `IconButton` - Button with optional icon + text, disabled state
   -  `InputAndIndicator` - Input with validation status indicators (debounced 1000ms)
      -  Visual feedback: green checkmark (valid), red X (invalid), spinning loader (checking)
      -  Error tooltip appears on left side of red X indicator (positioned with `right-full mr-1`)
      -  Supports custom validators via `validator` prop
      -  Supports `onBlur` and `onKeyDown` event handlers for commit actions
   -  `CustomToast` - Styled toast notifications (success, error, warning, info)
   -  `NavIcon` - Navigation link with delayed tooltip (900ms delay), supports optional onClick
   -  `MenuItem` - Dropdown menu item (renders as Link or button based on props)
   -  `PersonalBestCard` - Displays personal best for a specific test mode with hover detail view
   -  `DetailCard` - Simple title/value card for stats display (used in UserDetails)
   -  `TextButton` - Versatile button/link component with icon and text
      -  Renders `<a>` for external links (href prop)
      -  Renders `<Link>` for internal navigation (to prop)
      -  Renders `<button>` for click handlers (onClick prop)
      -  Consistent styling across all variants
      -  Used in Footer component
   -  `LoadingBar` - Animated progress bar with dynamic messages
      -  Horizontal progress bar that animates from 0% to 100%
      -  Dynamic messages based on progress: initial message (0-49%), "Almost there..." (50-74%), "Loading results..." (75-99%), "Done" (100%)
      -  Uses theme's active color (orange/red) for progress bar
      -  "Done" message styled with active color and bold font
      -  Smooth 300ms transitions for all changes
      -  Used in RootLayout (route transitions) and Account page (data loading)
-  Toast notifications via `react-toastify` (position: top-right, auto-close: 5000ms)

### Footer Component

-  `src/components/Footer.tsx` - Application footer with keyboard shortcuts and links
-  **Keyboard Shortcuts Section**: Shows "tab + enter - restart test" with styled `<kbd>` elements, positioned with `-mb-8`
-  **Links Section**: Two-column grid layout
   -  Left column: contact, support, and GitHub link (external link to repository)
   -  Right column: "made by shroy" credit
-  All buttons use the reusable `TextButton` component
-  GitHub link opens in new tab with security attributes (`target="_blank"`, `rel="noopener noreferrer"`)
-  Consistent hover styling (text-fade-100 → text-glow-100 transition)

### Header Component

-  Conditional rendering based on auth state via `onAuthStateChanged`
-  **Auth Loading State**:
   -  Shows spinning `FaCircleNotch` icon while Firebase Auth initializes
   -  Uses `authLoading` state to track initialization
   -  Prevents UI flicker during auth state determination
-  Logged out: Shows login NavIcon
-  Logged in: Shows account button with hover dropdown menu
   -  **Username display**: `displayName` → `email prefix` → "User" (fallback chain)
   -  Menu items: user stats, public profile, account settings, sign out
   -  Hover effect with opacity/visibility transition (200ms)
-  **Restart event**: Logo and "start typing" NavIcon dispatch `restartTest` custom event on click

### Login/Registration

-  Validation:
   -  Username: min 6 chars
   -  Email: regex validation
   -  Password: min 8 chars, requires uppercase, number, special char
   -  Verification fields must match original
-  **Username Storage**:
   -  Email registration: Username saved as `displayName` via Firebase `updateProfile`, user reloaded after update
   -  Google sign-in: `displayName` automatically set by Google to account name
-  Navigation: Redirects to `/account` after successful login/signup (email, Google)

### Account Page

-  `src/pages/Account.tsx` - User test history page
-  Fetches user's test results from Firestore on auth state change
-  Query: `where("userId", "==", uid)` + `orderBy("timestamp", "desc")`
-  **Loading State**: Shows `LoadingBar` component with "Loading account data..." message while fetching Firestore data
-  Error states for better UX
-  **Responsive Layout**: All content wrapped in container with `w-full max-w-full overflow-x-hidden` to prevent horizontal overflow
-  Displays multiple components:
   -  `UserDetails` - User profile header with avatar, username, joined date, and stats
   -  `PersonalBests` - Shows best WPM for each test mode (time: 15s, 30s, 60s; words: 10, 25, 50)
   -  `ActivityHeatMap` - GitHub-style activity visualization (shown if user has any tests)
   -  `StatsOverview` - Statistical summary (shown if user has ≥10 tests)
   -  `HistoryTable` - Paginated test results (shown if user has any tests)
-  Uses `useMemo` to calculate personal bests from test data
-  **Personal Best Calculation**: Highest WPM for each specific mode/duration combination
-  **Note**: In development, StrictMode causes duplicate saves (2 entries per test). This does NOT happen in production builds.

### HistoryTable Component

-  `src/components/HistoryTable.tsx` - Paginated test results table
-  **Pagination**: Shows 10 entries initially, loads 10 more on "Load More" click
-  "Load More" button visibility:
   -  Hidden if total data ≤ 10
   -  Hidden when all data is displayed
   -  Shows only when more data is available
-  Displays: WPM, raw WPM, accuracy, consistency, character stats, mode, timestamp
-  Alternating row colors for better readability
-  Character breakdown tooltip on hover
-  Crown icon placeholder (for future personal best highlighting)

### PersonalBests Component

-  `src/components/PersonalBests.tsx` - Personal best records display
-  Shows two grid sections: time modes (15s, 30s, 60s) and word modes (10, 25, 50)
-  Uses `PersonalBestCard` for each mode
-  Displays "—" for modes with no data
-  Accepts `PersonalBestData | null` for each mode
-  Each card shows: WPM, accuracy (quick view) and full stats on hover (WPM, raw, accuracy, consistency, date)

### StatsOverview Component

-  `src/components/StatsOverview.tsx` - Statistical summary dashboard
-  **Visibility**: Only renders if user has ≥10 tests
-  Uses `useMemo` for performance optimization
-  Displays 3-column grid with stats for: WPM, Raw, Accuracy, Consistency
-  Each metric shows:
   -  Highest value (with mode/duration subtitle for WPM/Raw)
   -  Average (all-time)
   -  Average (last 10 tests)
-  **Raw WPM calculation**: Uses stored `raw` field or calculates fallback for older records
-  All averages are rounded to nearest integer

### ActivityHeatMap Component

-  `src/components/ActivityHeatMap.tsx` - GitHub-style activity heatmap
-  Displays test activity over time in calendar grid format
-  **Responsive Design**:
   -  Wrapper constrained with `w-full max-w-full`
   -  Grid container has `overflow-x-auto` for horizontal scrolling on smaller screens
   -  Weeks grid uses `min-w-fit` for natural sizing without forced stretching
   -  Maintains readability across all viewport sizes
-  **Time Filters**: Dropdown with "last 12 months" or specific years (auto-populated from data)
-  **Grid Layout**:
   -  Weeks displayed horizontally (up to 53 weeks, ~1166px min-width)
   -  Days displayed vertically (Sun-Sat)
   -  Week labels on left (Mon, Wed, Fri)
   -  Month labels at bottom
-  **Color Intensity**: 5 levels based on test count (0, 1-2, 3-5, 6-10, 11+ tests)
-  **Tooltip**: Shows date and test count on hover
-  **Total Counter**: Displays total tests for selected period
-  Uses `useMemo` for performance (weeks, monthLabels, totalTests calculated once per filter change)
-  Dropdown closes on outside click (useRef + useEffect)
-  **Note**: All timestamps use UTC timezone

### UserDetails Component

-  `src/components/UserDetails.tsx` - User profile header with stats
-  Displays: avatar, username, joined date (with tooltip), and typing statistics
-  Uses `DetailCard` component for consistent stat display
-  **Calculated Stats**:
   -  **Current Streak**: Consecutive days with at least one test (must start from today or yesterday)
   -  **Tests Completed**: Total count of test results
   -  **Time Typing**: Total time spent typing in HH:MM:SS format
-  **Time Typing Calculation**:
   -  Uses stored `testDuration` if available
   -  Falls back to `testTime` for time mode tests
   -  Estimates from WPM for words mode: `(correctChars / 5) / WPM * 60`
-  **User Info**: Gets username from `displayName` or email prefix, joined date from `metadata.creationTime`
-  **Joined Date Tooltip**: Shows "X days ago" on hover (positioned to the right)

### TimeProgressBar Component

-  `src/components/TimeProgressBar.tsx` - Horizontal progress bar for test progress visualization
-  **Visibility**: Only renders when `liveProgressMode === "bar"` and test is active (`testStart && !testEnd`)
-  **Props**:
   -  `mode`: Test mode ("time" | "words")
   -  `counter`: Current time remaining (time mode)
   -  `testTime`: Total test duration (time mode)
   -  `completedWords`: Number of words completed (words mode)
   -  `testWords`: Total words to complete (words mode)
   -  `testStart`: Whether test has started
   -  `testEnd`: Whether test has ended
-  **Progress Calculation**:
   -  Time mode: `(counter / testTime) * 100` - starts at 100%, decreases to 0%
   -  Words mode: `(completedWords / testWords) * 100` - starts at 0%, increases to 100%
-  **Styling**:
   -  Fixed positioning at top of viewport (`fixed top-0 left-0 right-0`)
   -  Height: 1px (h-1)
   -  Background: Dark color with opacity (bg-dark-100/40)
   -  Progress bar: Active color (bg-active - orange/red)
   -  Z-index: 50 (ensures it appears above other elements)
-  **Animation**: Smooth 1-second transition for width changes (`transition-all duration-1000 ease-linear`)
-  Integrated in TypeZone component, conditionally rendered based on `liveProgressMode` setting

### Settings Page

-  `src/pages/Settings.tsx` - User settings configuration page
-  **Settings Section**: Section header with FaTools icon and "settings" label
   -  **Min Speed Setting**:
      -  Icon: FaBolt
      -  Modes: "off" | "custom" (toggle buttons)
      -  Custom input: numeric value (default: 100 WPM)
      -  Description: "Automatically fails a test if your speed falls below a threshold"
      -  Validation: Must be >= 0
   -  **Min Accuracy Setting**:
      -  Icon: FaBullseye
      -  Modes: "off" | "custom" (toggle buttons)
      -  Custom input: numeric value (default: 75%)
      -  Description: "Automatically fails a test if your accuracy falls below a threshold"
      -  Validation: Must be 0-100
   -  **Sound Volume Setting**:
      -  Icon: FaVolumeDown
      -  Custom slider: range 0.0-1.0 (default: 0.5)
      -  Description: "Change the volume of the sound effects"
      -  Display: Value shown on left, pill-shaped slider on right
      -  Slider styling: 120px wide, 20px tall, orange/red color, grab cursor
   -  **Play Sound on Click Setting**:
      -  Icon: FaVolumeUp
      -  Modes: "off" | "nk cream" | "osu" (toggle buttons)
      -  Description: "Plays a short sound when you press a key"
      -  Preview: Plays sample sound when clicking sound pack button
      -  Sound packs located in `/public/assets/sounds/clicks/`
   -  **Play Sound on Error Setting**:
      -  Icon: FaVolumeMute
      -  Modes: "off" | "blow" | "slap" | "whoosh" (toggle buttons)
      -  Description: "Plays a short sound if you press an incorrect key or press space too early"
      -  Preview: Plays sample error sound when clicking sound option button
      -  Error sounds located in `/public/assets/sounds/errors/`
   -  **Play Time Warning Setting**:
      -  Icon: FaExclamationTriangle
      -  Modes: "off" | "1 second" | "3 seconds" | "5 seconds" (toggle buttons)
      -  Description: "Play a short warning sound if you are close to the end of a timed test"
      -  Only works in time mode tests
      -  Warning sound: "Clock Ticking.wav" from `/public/assets/sounds/warning/`
   -  **Live Progress Style Setting**:
      -  Icon: FaChartPie
      -  Modes: "off" | "mini" | "bar" (toggle buttons, default: "mini")
      -  Description: "Change the style of the timer/word count during a test"
      -  "off": Hides both TimeCounter and TimeProgressBar (no progress indicator shown)
      -  "mini": Shows TimeCounter component (traditional counter display above typing area)
      -  "bar": Shows TimeProgressBar component (horizontal progress bar at top of viewport)
      -  Time mode (bar): Progress bar starts at 100% width, decreases to 0% as timer counts down
      -  Words mode (bar): Progress bar starts at 0% width, increases to 100% as words are completed
   -  **Caps Lock Warning Setting**:
      -  Icon: FaLock
      -  Modes: "hide" | "show" (toggle buttons, default: "show")
      -  Description: "Displays a warning when caps lock is on"
      -  "hide": Caps Lock warning box never appears, even when Caps Lock is on
      -  "show": Orange/red warning box appears above typing area when Caps Lock is detected
      -  Warning uses absolute positioning to prevent layout shift
      -  Updates in real-time as Caps Lock state changes
   -  **Reset Settings**:
      -  Icon: FaUndo
      -  Single button: "reset settings" (red background with custom styling)
      -  Description: "Resets settings to the default." with red warning: "You can't undo this action!"
      -  **Functionality**: Resets all settings to their default values:
         -  Min speed: mode = "off", value = 100 WPM
         -  Min accuracy: mode = "off", value = 75%
         -  Sound volume: 0.5
         -  Sound mode: "off"
         -  Error sound mode: "off"
         -  Time warning mode: "off"
         -  Live progress mode: "mini"
         -  Caps lock warning mode: "show"
      -  **Toast Notification**: Shows "Settings Reset - All settings have been reset to default values" (2-second duration)
      -  **Destructive Action**: Red button styling to indicate permanent change
      -  Uses SubSetting component with custom button className for red styling
-  **Save Behavior**:
   -  Toast notification shows "Saved" on:
      -  Button click (mode toggle, but only if changing to a different mode)
      -  Input commit (Enter key or blur) for min speed/accuracy
   -  Auto-switches to "custom" mode when typing in min speed/accuracy input fields
   -  Validation prevents saving invalid values (no toast shown if invalid)
   -  Active button clicks do not trigger save toast (prevents unnecessary notifications)
-  **Error Handling**:
   -  All settings operations wrapped in try-catch blocks
   -  Error toast shows: "Failed to save settings: request took too long to complete"
   -  localStorage operations have error logging for debugging
-  **Input Validation**:
   -  Real-time visual feedback (checkmark/X icon with tooltip)
   -  Error tooltips positioned on left side of indicator
   -  Invalid values cannot be saved (toast only shows for valid values)
-  **SubSetting Component**: Reusable component for settings sections
   -  Props: icon, title, description, buttons, showInput, inputValue, showSlider, sliderValue, sliderMin, sliderMax, sliderStep, onInputChange, onSliderChange, onInputCommit, validator
   -  **Description**: Supports ReactNode (allows JSX elements like styled text, not just plain strings)
   -  **Buttons**: Each button in buttons array supports optional `className` prop for custom styling
      -  If `className` is provided, it overrides default button styling
      -  If not provided, uses standard button styling with active/inactive states
   -  Handles mode toggle buttons, optional numeric input, and optional slider input
   -  Passes validation to InputAndIndicator for visual feedback
   -  Slider support: pill-shaped handle with dynamic styling
   -  **Grid Layout**: 2-column grid (2fr for content, 1fr for controls) with gap-4 spacing

### Sound Player Utility

-  `src/utils/soundPlayer.ts` - Audio playback utility for typing sounds
-  **Sound Types**:
   -  Keystroke sounds: Configurable sound packs with key code mappings
   -  Error sounds: Simple sound files for error feedback
   -  Warning sound: Time warning alert sound
-  **Functions**:
   -  `loadSoundConfig(mode)` - Loads sound pack configuration JSON
   -  `preloadSounds(mode)` - Preloads all sounds in a pack for better performance
   -  `playKeySound(keyCode, mode, volume)` - Plays keystroke sound based on key code
   -  `playErrorSound(mode, volume)` - Plays error sound (blow/slap/whoosh)
   -  `playWarningSound(volume)` - Plays time warning sound
-  **Sound Caching**:
   -  `audioCache` stores preloaded HTMLAudioElement instances
   -  Sounds are cloned before playing to allow simultaneous playback
   -  Volume is applied to each cloned instance
-  **Sound Pack Structure**:
   -  Each pack has a `config.json` with key code to sound file mappings
   -  Example: `{ "defines": { "65": "key-a.mp3", "66": "key-b.mp3", ... } }`
   -  Sound files stored in `/public/assets/sounds/clicks/{pack-name}/`
-  **Error Handling**:
   -  Autoplay policy errors are silently ignored (NotAllowedError)
   -  Other playback errors are logged to console
-  **Asset Locations**:
   -  Keystroke sounds: `/public/assets/sounds/clicks/` (nk cream, Osu packs)
   -  Error sounds: `/public/assets/sounds/errors/` (Blow.mp3, Slap.mp3, Whoosh.mp3)
   -  Warning sound: `/public/assets/sounds/warning/` (Clock Ticking.wav)

## Tech Stack

-  React 19.0.0, TypeScript 5.7.2, Vite 6.3.1
-  React Router 7.9.5
-  Tailwind CSS 4.1.4
-  Firebase 12.6.0 (auth + Firestore)
-  Chart.js 4.5.1 + react-chartjs-2
-  react-toastify, react-icons, random-words

## Unimplemented Features

-  About page (linked but no route/component)
-  Account settings page `/account-settings` (linked but no route/component)
-  Public profile page (menu item exists but no route/component)
-  GitHub sign-in (UI ready, handler not implemented)
-  Personal best highlighting in history table (crown icon placeholder exists; personal bests implemented in separate PersonalBests component)
-  Graph view for individual test results (info icon placeholder exists)

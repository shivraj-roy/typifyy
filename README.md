[![Typifyy Banner](./public/assets/typifyy-github-banner.png)](https://typifyy.vercel.app/)

<br />

[![React](https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Zustand](https://img.shields.io/badge/🐻_zustand-443E38?style=for-the-badge)](https://zustand-demo.pmnd.rs/)
[![Firebase](https://img.shields.io/badge/firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/tailwind_css-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Chart.js](https://img.shields.io/badge/chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)](https://www.chartjs.org/)
[![Vercel](https://img.shields.io/badge/vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

[![CI Pipeline](https://github.com/shivraj-roy/typifyy/workflows/CI%20Pipeline/badge.svg)](https://github.com/shivraj-roy/typifyy/actions)

# About

Typifyy is a minimalistic and customizable [typing test](https://typifyy.vercel.app/) application. Inspired by [Monkeytype](https://monkeytype.com), it focuses on simplicity and essential features to help you measure and improve your typing speed. The app features multiple test modes, real-time performance tracking, an account system to save your typing history, and user-configurable settings including sounds, custom thresholds, and visual feedback.

Built as a portfolio project to sharpen React 19 and TypeScript skills while creating something fun and useful, Typifyy attempts to provide a clean, focused typing experience with straightforward, real-time feedback on speed and accuracy.

# Features

- **Minimalistic design** with a clean, distraction-free interface
- **Type what you see, see what you type** - real-time character validation
- **Multiple test modes**:
  - Time-based tests (15s, 30s, 60s)
  - Word-count tests (10, 25, 50 words)
- **Real-time statistics**:
  - Live WPM (Words Per Minute) tracking
  - Accuracy percentage
  - Consistency score
  - Detailed character breakdown
- **Performance graphs** - visualize your typing speed over time with Chart.js
- **Account system**:
  - Firebase authentication (Email/Password & Google Sign-in)
  - Save typing history automatically
  - Personal best tracking for each test mode
  - Activity heatmap visualization
  - Typing statistics overview
- **Customizable settings**:
  - Min speed/accuracy thresholds
  - Keyboard click sounds (NK Cream, Osu)
  - Error sounds (Blow, Slap, Whoosh)
  - Time warning alerts
  - Live progress display options
  - Caps Lock warning
- **Smooth caret animation** - absolute positioned caret with smooth transitions
- **Keyboard shortcuts** - Tab + Enter to restart test
- **Responsive design** - optimized for desktop, mobile-friendly message
- **Self-hosted fonts** - no external CDN dependencies for better performance

# Bug Report or Feature Request

If you encounter a bug or have a feature request:
- [Create an issue](https://github.com/shivraj-roy/typifyy/issues)
- [Start a discussion](https://github.com/shivraj-roy/typifyy/discussions)

# Want to Contribute?

Contributions are welcome! Please read [CONTRIBUTING.md](./docs/CONTRIBUTING.md) to get started.

# Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **State Management**: Zustand
- **Styling**: Tailwind CSS v4
- **Backend**: Firebase (Authentication, Firestore)
- **Charts**: Chart.js with react-chartjs-2
- **Icons**: React Icons
- **Analytics**: Vercel Analytics
- **Deployment**: Vercel

# Local Development

1. Clone the repository:
```bash
git clone https://github.com/shivraj-roy/typifyy.git
cd typifyy
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Start the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

# Credits

- **Inspiration**: [Monkeytype](https://monkeytype.com) for setting the bar for typing tests
- **Word generation**: [random-words](https://www.npmjs.com/package/random-words) library
- **Fonts**: Roboto Mono, Space Mono, Satoshi (self-hosted)
- **Sound effects**: NK Cream, Osu click sounds, various error sounds
- **Icons**: React Icons library

Special thanks to the open-source community and everyone who provided feedback to make this project better.

# License

This project is open source and available under the [MIT License](LICENSE).

---

**Made with ❤️ by [Shivraj Roy](https://github.com/shivraj-roy)**

*Designed to keep you in flow*

# Contributing to Typifyy

Thank you for your interest in contributing to Typifyy! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment. Be kind, professional, and constructive in all interactions.

## Getting Started

### Prerequisites

- Node.js >= 22.0.0
- npm >= 10.0.0
- Git
- A Firebase project (for testing authentication and Firestore features)

### Setting Up Your Development Environment

1. **Fork the repository** on GitHub

2. **Clone your fork**:
```bash
git clone https://github.com/YOUR_USERNAME/typifyy.git
cd typifyy
```

3. **Add upstream remote**:
```bash
git remote add upstream https://github.com/shivraj-roy/typifyy.git
```

4. **Install dependencies**:
```bash
npm install
```

5. **Create a `.env` file** with your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

6. **Start the development server**:
```bash
npm run dev
```

## Development Workflow

### Branching Strategy

- `main` - Production-ready code
- Create feature branches from `main` with descriptive names:
  - `feature/add-dark-mode`
  - `fix/backspace-bug`
  - `docs/update-readme`

### Making Changes

1. **Create a new branch**:
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes** and commit regularly with clear messages:
```bash
git add .
git commit -m "feat: add dark mode toggle"
```

3. **Keep your branch updated** with upstream:
```bash
git fetch upstream
git rebase upstream/main
```

4. **Push your changes**:
```bash
git push origin feature/your-feature-name
```

## Coding Standards

### General Guidelines

- **Use TypeScript** - All new code should be properly typed
- **Follow existing patterns** - Match the coding style of the existing codebase
- **Keep it simple** - Avoid over-engineering; prefer simple, readable solutions
- **Self-hosted assets** - Don't add external CDN dependencies
- **Responsive design** - Ensure changes work on all screen sizes

### Code Style

- **Formatting**: Use Prettier for code formatting
  ```bash
  npm run format        # Format all files
  npm run format:check  # Check formatting
  ```

- **Linting**: Fix ESLint errors before committing
  ```bash
  npm run lint
  ```

- **Naming Conventions**:
  - Components: PascalCase (`TypeZone.tsx`, `MenuBar.tsx`)
  - Files: camelCase or PascalCase matching content
  - Variables/Functions: camelCase
  - Constants: UPPER_SNAKE_CASE
  - CSS Classes: Tailwind utilities preferred

### Component Guidelines

- Use functional components with hooks
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks
- Use `useCallback` and `useMemo` for optimization when needed
- Avoid prop drilling - use Context when appropriate

### Documentation

- Add JSDoc comments for complex functions
- Update `README.md` if adding new features or changing setup

## Pull Request Process

### Before Submitting

1. **Test your changes thoroughly**:
   - Test all affected features
   - Test on different screen sizes
   - Check browser console for errors
   - Verify Firebase integration works (if applicable)

2. **Run quality checks**:
```bash
npm run lint          # Check for linting errors
npm run build         # Ensure production build works
npm run format:check  # Verify formatting
```

3. **Update documentation** if needed

### Submitting a Pull Request

1. **Push your branch** to your fork on GitHub

2. **Open a Pull Request** against the `main` branch of the upstream repository

3. **Fill out the PR template** with:
   - Clear description of changes
   - Motivation and context
   - Screenshots/GIFs for UI changes
   - Testing steps
   - Related issue numbers (if applicable)

4. **PR Title Format**:
   - `feat: add dark mode toggle`
   - `fix: resolve backspace bug on last character`
   - `docs: update contributing guidelines`
   - `refactor: improve caret positioning logic`
   - `style: format code with prettier`

5. **Wait for review** - Maintainers will review your PR and may request changes

6. **Address feedback** - Make requested changes and push updates

7. **Merge** - Once approved, your PR will be merged

### What to Expect

- Initial response within a few days
- Constructive feedback to improve the code
- Possible requests for changes or additional testing
- Gratitude for your contribution! 🎉

## Reporting Issues

### Bug Reports

When reporting a bug, please include:

1. **Clear title** describing the issue
2. **Steps to reproduce** the bug
3. **Expected behavior** vs actual behavior
4. **Screenshots or GIFs** if applicable
5. **Environment details**:
   - Browser and version
   - Operating system
   - Screen size (for UI issues)
6. **Console errors** if any

### Feature Requests

When requesting a feature, please include:

1. **Clear title** describing the feature
2. **Problem statement** - What problem does this solve?
3. **Proposed solution** - How should it work?
4. **Alternatives considered** - What other approaches did you think about?
5. **Mockups or examples** if applicable

## Project Structure

```
/src
  /components       # React components
    /ui            # Reusable UI components
  /context         # React Context providers
  /layouts         # Layout components
  /pages           # Page components
  /types           # TypeScript type definitions
  /utils           # Utility functions
  App.tsx          # Router configuration
  main.tsx         # App entry point
  index.css        # Global styles + Tailwind
```

## Key Files to Know

- `src/components/TypeZone.tsx` - Core typing test logic
- `src/context/TestMode.tsx` - Test mode state management
- `src/context/Settings.tsx` - User settings state
- `firebaseConfig.ts` - Firebase initialization
- `firestore.rules` - Security rules for Firestore

## Need Help?

- Check existing [issues](https://github.com/shivraj-roy/typifyy/issues)
- Start a [discussion](https://github.com/shivraj-roy/typifyy/discussions)
- Review the `README.md` and this contributing guide

## License

By contributing to Typifyy, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Typifyy! Your efforts help make this project better for everyone. ❤️

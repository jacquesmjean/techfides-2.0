# Contributing to TechFides 2.0

Thank you for your interest in contributing to TechFides 2.0.

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Setup
```bash
git clone https://github.com/jacquesmjean/techfides-2.0.git
cd techfides-2.0
npm install
npm run dev
```

The site will be available at `http://localhost:3000`.

## Development Guidelines

### Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS with custom design tokens
- **i18n:** Custom React Context (EN/ES/FR)

### Code Style
- Use TypeScript strict types (avoid `any`)
- Follow the existing Tailwind class ordering conventions
- Use semantic HTML (`section`, `article`, `nav`, `main`)
- Ensure WCAG 2.1 AA accessibility compliance
- All user-facing strings should use the i18n `t()` function

### Color Palette
- **Background:** `slate-950` (#0a0f1a)
- **Text primary:** `slate-100`
- **Text secondary:** `slate-400` (minimum for contrast)
- **Accent:** `electric-500` (#0ea5e9)
- **Success:** `accent-green` (#22c55e)

### Branch Naming
- `feature/description` for new features
- `fix/description` for bug fixes
- `docs/description` for documentation

### Commit Messages
Follow conventional commits:
- `feat: add contact form page`
- `fix: correct pricing calculator edge case`
- `docs: update README with setup instructions`

## Pull Request Process

1. Fork the repository
2. Create a feature branch from `master`
3. Make your changes
4. Ensure `npm run build` passes with zero errors
5. Submit a PR using the provided template
6. Wait for review from @jacquesmjean

## Reporting Issues

- Use the **Bug Report** template for bugs
- Use the **Feature Request** template for enhancements
- For security vulnerabilities, see [SECURITY.md](SECURITY.md)

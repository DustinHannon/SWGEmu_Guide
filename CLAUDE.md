# SWGEmu Server Setup Guide

## Project Overview
Wizard-style guide website for setting up a SWGEmu (Star Wars Galaxies Emulator) server from scratch. Combines 4 separate legacy guides into a single modern interface with 23 steps across 6 phases.

**Live:** https://swgemu-guide.vercel.app
**Repo:** https://github.com/DustinHannon/SWGEmu_Guide

## Tech Stack
- **Next.js 16** (App Router, static export)
- **Tailwind CSS v4** (CSS-based config via `@theme` in globals.css)
- **TypeScript**
- **Framer Motion** (step transitions, staggered entrance animations, TOC panel)
- **lucide-react** (icons)
- **Fonts:** Orbitron (headings), Geist Sans (body), JetBrains Mono (code)

## Architecture
Single-page app, no backend. All guide content lives in `data/steps.ts` as structured TypeScript data.

### Layout: Centered Stage
Content is displayed in a centered glass card (`stage-container` / `stage-card`) that fills ~85vh. No persistent sidebar — navigation is a floating overlay panel toggled via button or Esc key.

### Key Files
- `data/steps.ts` - All 23 guide steps with typed `CommandBlock` (label, command, language)
- `components/WizardLayout.tsx` - Main orchestrator (centered stage layout, TOC toggle state, keyboard nav, Framer Motion transitions)
- `components/CodeBlock.tsx` - Terminal-style code cards, color-coded by language (bash=green, sql=purple, lua=amber, default=cyan)
- `components/TableOfContents.tsx` - Floating slide-over TOC panel with per-phase progress badges, expandable sections, backdrop blur
- `components/ProgressBar.tsx` - Two exports: `ProgressRing` (SVG circle, top-right) and `ProgressLine` (gradient bar, bottom)
- `components/StepContent.tsx` - Step renderer with staggered Framer Motion entrance animations
- `components/StepNavigation.tsx` - Prev/Next buttons in card footer
- `components/NoteBox.tsx`, `WarningBox.tsx`, `TipBox.tsx` - Callout components
- `hooks/useWizardProgress.ts` - localStorage progress tracking + `getPhaseProgress()` helper
- `app/globals.css` - Design system with stage layout, terminal cards, floating TOC, progress ring/line styles

### Design System: "Command Console"
- Sci-fi glass morphism with centered stage layout
- Purple-to-navy animated mesh gradient background
- Dot-grid HUD overlay
- Electric cyan (`#00e5ff`) primary, violet (`#a78bfa`) secondary
- Terminal cards color-coded by language: bash (`#7ee787`), sql (`#a78bfa`), lua (`#fbbf24`)
- CSS classes: `.stage-container`, `.stage-card`, `.terminal-card`, `.terminal-card-header`, `.toc-panel`, `.toc-toggle`, `.progress-ring-*`, `.progress-line`, `.glass`, `.glass-card`, `.corner-brackets`, `.lang-badge-*`, `.phase-badge-*`

### Keyboard Shortcuts
- `←→` arrow keys: navigate between steps
- `Esc`: toggle TOC panel open/close
- `Home`: jump to first step
- `End`: jump to last step

## Development
```bash
npm run dev    # Start dev server
npm run build  # Production build (static export)
```

## Deployment
Connected to Vercel via GitHub. Push to master auto-deploys.

## Content Rules
- All commands/versions must match the original guides exactly (SWGEmu is version-sensitive)
- Debian 11 Cinnamon, specific package versions, Core3 unstable branch
- Do not update to newer versions of packages or OS - they will break the build
- Source guides: swgemu-vm-guide.netlify.app, swgemu-guide.netlify.app, swgemu-db-guide.netlify.app, swgemu-update-guide.netlify.app

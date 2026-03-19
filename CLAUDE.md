# SWGEmu Server Setup Guide

## Project Overview
Wizard-style guide website for setting up a SWGEmu (Star Wars Galaxies Emulator) server from scratch. Combines 4 separate legacy guides into a single modern interface with 23 steps across 6 phases.

**Live:** https://swgemu-guide.vercel.app
**Repo:** https://github.com/DustinHannon/SWGEmu_Guide

## Tech Stack
- **Next.js 16** (App Router, static export)
- **Tailwind CSS v4** (CSS-based config via `@theme` in globals.css)
- **TypeScript**
- **Framer Motion** (step transitions)
- **lucide-react** (icons)
- **Fonts:** Orbitron (headings), Geist Sans (body), JetBrains Mono (code)

## Architecture
Single-page app, no backend. All guide content lives in `data/steps.ts` as structured TypeScript data.

### Key Files
- `data/steps.ts` - All 23 guide steps (commands, warnings, notes, tips)
- `components/WizardLayout.tsx` - Main orchestrator (state, sidebar, transitions, keyboard nav)
- `components/CodeBlock.tsx` - Terminal-styled code with clipboard copy
- `components/TableOfContents.tsx` - Left sidebar with collapsible phases
- `hooks/useWizardProgress.ts` - localStorage progress tracking
- `app/globals.css` - "Command Console" glass morphism design system

### Design System: "Command Console"
- Sci-fi glass morphism with restrained techy feel
- Purple-to-navy animated mesh gradient background
- Dot-grid HUD overlay
- Electric cyan (`#00e5ff`) primary, violet (`#a78bfa`) secondary
- CSS classes: `.glass`, `.glass-card`, `.glass-button`, `.corner-brackets`, `.scanline-overlay`, `.code-glow-border`

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

# SWGEmu Server Setup Guide

A wizard-style guide for setting up a **Star Wars Galaxies Emulator (SWGEmu)** server from scratch. Consolidates four separate legacy guides into a single modern interface with 23 steps across 6 phases.

**[Live Site](https://swgemu-guide.vercel.app)**

## What It Covers

| Phase | Topic | Steps |
|-------|-------|-------|
| 1 | Virtual Machine Setup | Download Debian 11, create VirtualBox VM, install OS |
| 2 | Server Installation | Install dependencies, clone Core3, build the server |
| 3 | Database Setup | Install MariaDB, configure databases, import schemas |
| 4 | Server Configuration | Edit config files, set IP, add game assets (.tre files) |
| 5 | Running & Managing | Start the server, create admin accounts, basic management |
| 6 | Updating & Maintenance | Pull updates, rebuild, database migrations |

## Features

- **Step-by-step wizard** with animated transitions between steps
- **Progress tracking** persisted in localStorage (pick up where you left off)
- **Floating table of contents** with per-phase progress badges
- **Terminal-style code blocks** color-coded by language (bash, SQL, Lua, INI, PowerShell)
- **One-click copy** on all commands
- **Keyboard navigation** — arrow keys, Esc (TOC), Home/End
- **Callout boxes** for warnings, notes, and tips
- **Progress indicators** — SVG ring (top-right) and gradient bar (bottom)
- **URL hash routing** — link directly to any step via `#step-id`
- **Responsive design** with sci-fi "Command Console" aesthetic

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router, static export)
- [Tailwind CSS v4](https://tailwindcss.com/) (CSS-based config)
- [TypeScript](https://www.typescriptlang.org/)
- [Framer Motion](https://www.framer.com/motion/) (animations)
- [Lucide React](https://lucide.dev/) (icons)
- Fonts: [Orbitron](https://fonts.google.com/specimen/Orbitron) (headings), [JetBrains Mono](https://www.jetbrains.com/lp/mono/) (code)

## Development

```bash
npm install
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build (static export to /out)
```

## Deployment

Auto-deploys to [Vercel](https://vercel.com) on push to `master`. The site is a fully static export — no server-side rendering or API routes.

## Project Structure

```
app/
  layout.tsx          Root layout (metadata, fonts, dark mode)
  page.tsx            Entry point — renders WizardLayout
  globals.css         Full design system (Tailwind theme, components)
components/
  WizardLayout.tsx    Main orchestrator (navigation, keyboard, transitions)
  TableOfContents.tsx Floating slide-over panel with phase progress
  StepContent.tsx     Step renderer with staggered entrance animations
  StepNavigation.tsx  Prev/Next buttons (Finish loops to start)
  CodeBlock.tsx       Terminal-style code card with copy button
  ProgressBar.tsx     ProgressRing (SVG) + ProgressLine (gradient bar)
  NoteBox.tsx         Info callout (cyan)
  WarningBox.tsx      Warning callout (amber)
  TipBox.tsx          Tip callout (green)
data/
  steps.ts            All 23 guide steps as structured TypeScript data
hooks/
  useWizardProgress.ts  localStorage progress tracking
lib/
  utils.ts            cn() utility (clsx + tailwind-merge)
```

## Source Guides

This project consolidates four original guides:
- [SWGEmu VM Guide](https://swgemu-vm-guide.netlify.app)
- [SWGEmu Server Guide](https://swgemu-guide.netlify.app)
- [SWGEmu Database Guide](https://swgemu-db-guide.netlify.app)
- [SWGEmu Update Guide](https://swgemu-update-guide.netlify.app)

## License

This project is for educational purposes. Star Wars Galaxies is a trademark of Lucasfilm/Sony Online Entertainment. SWGEmu is an open-source project — see [swgemu.com](https://www.swgemu.com).

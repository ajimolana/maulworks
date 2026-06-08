# 🤖 GEMINI.MD - Context & Guidelines for AI Assistant

Welcome, Gemini! This document provides essential context about the `maulworks` project to help you understand the codebase quickly, generate smarter responses, and save token usage during our sessions.

## 📁 Project Overview

- **Name**: maulworks (Maulana's portfolio)
- **Purpose**: An interactive personal portfolio web application.
- **Domain Focus**: Showcases projects, experiences, and research, with a strong focus on Data Science, Data Analysis, Machine Learning, Actuarial Science, and Automation (e.g., Streamlit, n8n, Python).

## 🛠️ Tech Stack

- **Framework**: Next.js 14.2 (App Router)
- **Language**: TypeScript (`.ts`, `.tsx`)
- **Styling**: Tailwind CSS, Shadcn UI (`radix-ui`, `clsx`, `tailwind-merge`)
- **3D & Graphics**: Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`), Rapier (`@react-three/rapier`)
- **Animations**: GSAP (`@gsap/react`), Motion (`motion`)
- **Fonts**: Poppins (Google Fonts via `next/font/google`)

## 📂 Architecture & Key Files

- `app/`: Uses Next.js App Router.
  - `app/data/portfolio.ts`: **CRITICAL DATA SOURCE**. Contains all the text, links, and asset paths for experiences, projects, research, and achievements. **Always check here first if you need content context before asking the user.**
  - `app/journey/`: A key section/page of the portfolio.
- `components/`: Reusable React components and Shadcn UI elements.
- `lib/`: Utility functions (e.g., Tailwind class merging).
- `public/assets/`: Static files, images, and logos referenced in `portfolio.ts`.

## 💡 Guidelines to Save Tokens & Be Smarter

1. **Avoid Redundant Reads**: If you need portfolio content (projects, history), just read `app/data/portfolio.ts`. No need to scan multiple UI components.
2. **Use Targeted Edits**: When modifying code, use precise edit tools to change only the specific lines needed instead of rewriting entire files.
3. **Next.js App Router Compliance**: Always adhere to Next.js 14 App Router conventions (e.g., Server vs. Client Components). Remember to add `"use client"` directives for anything using Three.js, GSAP, or React hooks.
4. **Styling Approach**: Stick to Tailwind CSS classes. Do not generate raw CSS unless explicitly asked or required by specific 3D/Canvas overlays. Use Shadcn UI conventions where applicable.
5. **Performance First**: This app uses heavy 3D rendering (Three.js) and animations (GSAP). Be mindful of React re-renders. Suggest `useMemo`, `useRef`, and proper dependency arrays to maintain 60FPS performance.
6. **Consistent Data Structures**: When adding new project data or components, use the existing TypeScript types (like `Project`, `DetailItem`) found in `app/data/portfolio.ts`.

---

_By reading this file, you agree to write efficient code, respect the existing architecture, and keep the portfolio looking amazing!_

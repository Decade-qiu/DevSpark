# Frontend UI Redesign Design

**Goal:** Deliver a modern, image-free UI inspired by NetNewsWire 7 with light and dark themes, applying a consistent editorial workspace feel across login and core workspace pages.

**Constraints:** No image assets. Preserve existing behaviors and accessibility labels. Keep layout web-appropriate and maintainable.

## Visual System

The interface uses a calm, tactile aesthetic built from typography, spacing, gradients, and subtle shadows. Light mode is warm and paper-like: background #F6F4F1, text #1C1C1E, with cool neutral surfaces and a muted teal accent #2A7C7A. Dark mode flips to a deep graphite base #0F1114 with soft slate text and cyan-leaning highlights. All colors are defined as CSS variables for background, surface, border, text, muted text, accent, and shadow. Themes are applied via `[data-theme]` with `prefers-color-scheme` as the default fallback. Typography pairs Newsreader (headings) with Manrope (body) for an editorial but crisp voice. Base font size is 16px with 1.6 line-height. The background uses layered CSS gradients and a subtle noise effect implemented as CSS, avoiding any external images.

## Layout

The primary workspace follows a NetNewsWire-inspired structure: a top toolbar (app name, search, theme toggle, account), and a three-column grid for sources, feed, and preview/editor. Panels are soft, glass-lite surfaces with 1px translucent borders, 12px radius, and understated shadows. Hover states change border and shadow only (no scaling) for stable layout. The login page uses a split layout: a left intro column and a right form card. All views are responsive with breakpoints at 375, 768, 1024, and 1440px. For narrow screens, the three-column grid collapses into stacked panels with a tab-style switch for read/write where applicable.

## Components and Interactions

Core primitives include `AppShell`, `Panel`, `ActionButton`, `Field`, and `Card`, reused across login, feed, drafts, and reader/editor. Buttons support primary and ghost styles, 44px touch targets, 150-220ms color transitions, and visible focus rings. Inputs include labels, helper text, and clear focus styling. Feed cards and drafts list keep metadata, title, summary, and actions in a dense but readable layout. Reader/editor is a split view with a simple toolbar for citation insertion. Empty states are short and actionable with a single CTA, no illustrations.

## Theme System

The theme toggle lives in the toolbar and persists the chosen theme in `localStorage`. The system defaults to the OS preference on first load. The theme switch updates the `data-theme` attribute on `<html>` to swap variable sets. Both themes meet contrast requirements, with borders and glass surfaces visible in light and dark modes.

## Accessibility and UX

All labels remain linked to inputs. Buttons keep textual labels for screen readers. Focus rings are visible and theme-aware. No emoji icons are used. Hover feedback is clear and does not shift layout. Touch targets meet the 44x44px minimum. `prefers-reduced-motion` is respected for transitions.

## Testing

Behavior is preserved while styles change. If new behavior is introduced (for example, theme persistence), tests must be written first using TDD. Unit tests stay in `frontend/src/__tests__/` or feature tests. E2E tests run with Playwright, visiting login and any new pages, confirming key UI elements are visible in both light and dark modes. Backend behavior is unchanged; E2E verifies the UI can load and interact with the app shell.

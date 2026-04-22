# AGENT.md

This is the primary instruction file for this repository. Read it first for every task and treat it as the default contract for all frontend work unless the user explicitly overrides part of it.

The goal is consistency, low-regression changes, and high-quality frontend execution that stays aligned with the existing codebase.

## Mission

- Preserve the current project structure, design language, and engineering patterns.
- Make changes that look native to this codebase, not imported from another style or framework.
- Favor reuse, clarity, accessibility, responsiveness, and maintainability.
- Avoid fragile code, unnecessary abstraction, and one-off styling.

## Project Baseline

- Framework: React 19 + TypeScript.
- App framework: TanStack Start + TanStack Router.
- Build tool: Vite.
- Styling: Tailwind CSS v4 with tokens and utilities defined in `src/styles.css`.
- UI primitives: `src/components/ui` using Radix patterns and shared class utilities.
- App-specific composed UI: `src/components/app`, `src/components/auth`, `src/components/settings`.
- Shared utilities and local app state: `src/lib`.
- Routes: file-based under `src/routes`.
- Generated route tree: `src/routeTree.gen.ts`.
- Import alias: `@/*` -> `src/*`.

## Non-Negotiables

- Do not break or reorganize the existing directory structure unless explicitly asked.
- Do not hand-edit generated files such as `src/routeTree.gen.ts`.
- Do not introduce a parallel component system when one already exists.
- Do not introduce a parallel styling system when the current tokenized Tailwind approach already covers the need.
- Do not add inconsistent spacing, typography, radii, border styles, or interaction patterns.
- Do not hardcode arbitrary colors if a tokenized semantic class can be used.
- Do not add new dependencies unless there is a clear technical need that the current stack cannot reasonably satisfy.
- Do not create “temporary” frontend code that is knowingly inconsistent, duplicated, or brittle.

## Repository Structure Rules

- `src/routes`
  Use for route files only. Follow existing TanStack file-based routing conventions.

- `src/components/ui`
  Use for generic reusable primitives that can serve multiple features or pages.

- `src/components/app`
  Use for workspace/product-specific composed UI.

- `src/components/auth`
  Use for authentication-specific shells and shared auth patterns.

- `src/components/settings`
  Use for settings-specific shells, layout helpers, and repeated settings UI patterns.

- `src/lib`
  Use for helpers, mock data, store/state logic, and framework-agnostic utilities.

- `src/hooks`
  Use for shared hooks only when logic is reused or clearly worth extracting.

- `src/styles.css`
  Treat as the global design token and global utility source of truth.

## Routing Standards

- Add new pages in `src/routes`.
- Keep route naming aligned with existing patterns such as `index.tsx`, `settings.profile.tsx`, and `__root.tsx`.
- Use route-level shells/layouts instead of duplicating top-level page scaffolding.
- Keep shared metadata and shell behavior consistent with current route definitions.
- If a change affects navigation, make sure both desktop and mobile navigation states still work.

## Design System Standards

- Use semantic classes driven by tokens:
  `bg-background`, `text-foreground`, `bg-surface`, `bg-surface-elevated`, `border-border`, `text-muted-foreground`, `bg-sidebar`, `text-sidebar-foreground`, `bg-primary`, `text-primary-foreground`.

- Reuse the existing visual primitives already established in the repo:
  `shadow-elegant`, `bg-grid`, `bg-hero-glow`, `ring-soft`.

- Keep the visual language restrained, premium, and product-like:
  calm surfaces, subtle borders, intentional contrast, compact-but-readable spacing, and polished motion.

- Match the current shape language:
  rounded corners are deliberate and moderate; avoid random radius changes.

- Match the current interaction language:
  clear hover states, visible focus states, and consistent pressed/disabled behavior.

- Match the current typography rhythm:
  avoid introducing random font sizes or wildly different tracking/weights when an existing pattern would fit.

## Theme Standards

- All UI must support both dark mode and light mode.
- Dark mode is visually primary in this repo, but light mode must remain correct.
- Use semantic tokens and shared utilities instead of hardcoding dark-only or light-only colors.
- Respect the existing theme flow handled by `src/components/ThemeBoot.tsx` and the theme state in `src/lib/store.ts`.
- Do not assume the root element will always remain dark forever, even if many current screens are dark-first.
- Any new component must be readable, accessible, and visually coherent in both themes.

## Global CSS Standards

- Keep global tokens, CSS variables, and global utilities centralized in `src/styles.css`.
- Add new global utilities only if they are truly cross-cutting and likely to be reused.
- Do not pollute global CSS with feature-specific styling that belongs in component markup.
- Prefer semantic utility composition in components over ad hoc global selectors.
- If a new visual pattern is reused across multiple surfaces, add it thoughtfully to `src/styles.css`.
- Keep global CSS aligned with the current token naming and layering strategy.

## Styling Standards

- Use token-based Tailwind classes first.
- Use `cn()` from `src/lib/utils.ts` when class merging or conditional class composition is needed.
- Prefer shared variants and primitives to repeated class strings.
- When a style pattern repeats, extract it into:
  1. an existing reusable component,
  2. a new reusable component,
  3. a shared variant helper,
  4. or a global utility in `src/styles.css`,
  in that order of preference based on fit.

- Avoid one-off inline styles except when technically required.
- Avoid introducing raw hex values, random opacity stacks, or inconsistent shadows/borders.
- Keep layouts stable across breakpoints and avoid overflow-prone combinations.

## Component Standards

- Reuse before building new.
- If a need is covered by `src/components/ui`, use it instead of rebuilding it locally.
- Prefer `Button` and `buttonVariants` from `src/components/ui/button.tsx` over raw button markup whenever practical.
- Prefer existing primitives such as `Input`, `Card`, `Dialog`, `Sheet`, `Tooltip`, `Separator`, and related wrappers when they match the job.
- Keep component APIs small, typed, and predictable.
- Favor composition over inheritance-style complexity.
- Keep logic close to where it is used unless it is clearly reusable.
- If a component is feature-specific, keep it close to that feature instead of prematurely globalizing it.
- Avoid monolithic components when splitting improves clarity, but do not oversplit trivial markup into needless files.

## Buttons and Shared UI Patterns

- Buttons must be visually and behaviorally consistent across the app.
- Default to the shared button component for primary, secondary, ghost, destructive, outline, and icon patterns.
- If a new button variation is needed in multiple places, extend `buttonVariants` instead of duplicating classes.
- Shared UI patterns such as cards, settings sections, auth fields, drawers, dialogs, menus, and side panels should follow the repo’s existing treatment first.
- If a page currently uses a custom local button pattern and the task expands that area, prefer converging it toward the shared system rather than duplicating the local style again.

## Forms and Input Standards

- Reuse existing input/form primitives and current auth/settings field patterns.
- Maintain consistent control heights, padding, border treatment, focus indication, and helper text.
- Keep labels, descriptions, error text, and actions aligned with current patterns.
- Use accessible labeling and do not rely on placeholder text as the only label.
- Validation states should be clear but visually consistent with the design system.

## Layout and Responsiveness Standards

- Design for desktop and mobile every time.
- Respect the existing mobile breakpoint behavior already used in the repo, including the `768px` mobile split reflected by `src/hooks/use-mobile.tsx`.
- Check for cramped layouts, clipped content, overflow, horizontal scrolling, collapsed actions, and poor tap targets.
- Reuse existing shell patterns for sidebars, drawers, top bars, content panes, and settings layouts.
- Avoid fragile absolute positioning unless the design specifically depends on it and it remains stable across breakpoints.

## Accessibility Standards

- Prefer semantic HTML first.
- Preserve keyboard access and logical tab order.
- Ensure interactive controls have visible focus states.
- Use accessible labels, titles, and descriptions for dialogs, sheets, menus, and form controls.
- Keep contrast strong enough in both themes.
- Do not hide critical information behind hover-only behavior on touch/mobile contexts.
- Preserve screen-reader intent when using Radix primitives and custom wrappers.

## State, Data, and Behavior Standards

- Follow the existing local store pattern in `src/lib/store.ts` unless the task clearly requires a different approach.
- Do not introduce a global state library without a strong, explicit reason.
- Keep derived values derived; avoid duplicating source-of-truth state.
- Prefer local component state for local UI concerns.
- Match the current mock/sample data structures in `src/lib/sample-data.ts` for prototype features.
- If persistence is needed and local storage is already the established pattern, align with that pattern unless told otherwise.

## React and TypeScript Standards

- Keep props explicitly typed.
- Keep state and effect usage intentional and minimal.
- Do not add `useMemo` or `useCallback` by default unless there is a clear reason, existing precedent in the surrounding code, or measurable benefit.
- Prefer simple readable React code over clever indirection.
- Avoid unnecessary wrappers, generic abstractions, or prop plumbing that obscure the feature.
- Keep files strict-TypeScript compatible and aligned with the repo’s current conventions.

## Performance and Maintainability Standards

- Optimize for maintainability first, then for performance where it matters.
- Avoid unnecessary rerender pressure from avoidable duplicated state or unstable patterns.
- Do not over-engineer speculative optimizations.
- Keep component trees understandable and easy to modify safely.
- Extract reusable pieces when repetition becomes real, not imaginary.
- Minimize regression risk by making the smallest coherent change that solves the task well.

## Consistency Standards

- New work must look and feel like it shipped with the rest of the app.
- Reuse existing naming patterns, file placement, prop naming, and UI structure.
- Match the same density, spacing scale, border softness, and motion style.
- When editing an existing area, follow that area’s local conventions first, then improve toward repo-wide consistency if the change naturally supports it.

## What To Check Before Adding Anything New

- Does an existing component already solve this?
- Does a similar pattern already exist in the same feature area?
- Does this belong in `src/components/ui` or should it stay local to the feature?
- Should this style live in component classes, a shared variant, or `src/styles.css`?
- Can this be done by extending an existing tokenized pattern instead of creating a new one?

## Things To Avoid

- Random new directory structures.
- Duplicated component primitives.
- Copy-pasted button/input/card classes across files when a shared primitive exists.
- Hardcoded colors that bypass the theme tokens.
- Feature-specific global CSS.
- Desktop-only implementations.
- Inaccessible dialogs, menus, or forms.
- Mixing unrelated visual styles on the same screen.
- Large refactors when a targeted change would solve the problem.
- Introducing inconsistent libraries or patterns without strong justification.

## Definition of Done

A frontend change is not done until all of the following are true:

- It preserves the current repo structure and architectural direction.
- It integrates cleanly with existing routes, components, and tokens.
- It supports both dark mode and light mode correctly.
- It works on desktop and mobile without obvious layout or usability issues.
- It uses existing reusable primitives wherever appropriate.
- It does not introduce avoidable duplication.
- It does not rely on fragile styling or brittle state logic.
- It maintains accessibility basics for interaction, labeling, and focus.
- It stays aligned with the current product look and feel.
- It keeps regression risk low.

## Preferred Operating Mode For Future Tasks

When working in this repository by default:

- read this file first
- preserve structure
- preserve design language
- preserve theme support
- reuse components
- reuse tokens
- reuse patterns
- keep code simple
- keep UI polished
- keep behavior accessible
- keep layouts responsive
- keep risk low

If a user request conflicts with these rules, follow the user’s explicit instruction while changing as little else as possible.

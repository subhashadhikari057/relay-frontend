## Frontend-only enhancements + rebrand to "Relay"

Pure UI/UX work — no backend wiring. All state stays local (useState/useReducer) so you can swap in your own API later.

### 1. Rebrand: Helix → Relay

Replace every occurrence across the codebase:

- Page `<title>` tags in all route `head()` blocks (~12 routes)
- Landing page hero, footer, auth shells (`AuthShell.tsx`)
- Workspace sidebar header, onboarding flow
- Pricing page, settings pages
- README/meta descriptions
- Logo letter "H" → "R" in `GlobalSidebar.tsx` and `AuthShell.tsx`

### 2. Functional message composer (local state)

- Wire `Composer.tsx` to actually append messages to a local `messages` array (lifted to `WorkspaceShell` or a Zustand store)
- Enter to send, Shift+Enter for newline
- Optimistic message bubble with "sending…" → "sent" transition
- Edit message (hover → pencil icon → inline edit → save/cancel)
- Delete message (with confirm)
- Emoji reactions: click 😀 button → picker → toggle reaction count
- @mention autocomplete dropdown (filter members as you type `@`)
- #channel autocomplete (filter channels as you type `#`)
- Slash commands menu (`/remind`, `/poll`, `/giphy` — UI only)

### 3. Unread state & badges

- Per-channel unread counter in sidebar (bold name + number badge)
- Mark-as-read on channel open
- Blue "New messages" divider line in message list
- Mention badge (red dot) separate from unread count
- Workspace-level unread aggregate on global sidebar

### 4. Threads, pins, saves (local persistence)

- Reply in thread actually appends to thread state
- Pin/unpin message → reflected in pinned bar + Channel Details panel
- Save/bookmark toggle → message appears in `SavedPanel`
- Message context menu (right-click) with all actions

### 5. File upload UI (no real upload)

- Drag-and-drop zone overlay on channel
- Paperclip button → file picker → preview chips in composer
- Image preview with lightbox modal
- File message bubble (icon, name, size, download button)
- Progress bar simulation

### 6. Rich content

- Markdown rendering in messages (bold, italic, code, lists, blockquotes)
- Code block with syntax highlight + copy button
- Link unfurl card (mock OG preview)
- Inline emoji shortcodes `:fire:` → 🔥

### 7. Presence & typing (simulated)

- Real typing indicator driven by composer focus + debounce
- Presence dot on every avatar (online/away/offline cycling demo)
- "Last seen" tooltip on DM headers
- Active now count in channel header

### 8. User profile hover card & modal

- Click any avatar → profile modal (bio, role, timezone, local time, contact)
- Hover any @mention → mini profile card
- "Send DM" / "View full profile" actions

### 9. Theme system (wire appearance settings)

- Light / Dark / System toggle actually switches `:root` class
- Accent color picker (mono / blue / green / purple) → updates CSS vars
- Compact / Comfortable density toggle
- Font size slider
- Persist to localStorage

### 10. Polish & missing pieces

- 404 page (`__root.tsx` notFoundComponent + custom illustration)
- Per-route error boundaries
- Loading skeletons for channel switch, search, settings
- Empty states with illustrations: no DMs, no saved, no search results, no notifications
- Toast notifications (sonner) wired to actions: "Channel created", "Invite sent", "Copied link"
- Confirm dialogs: delete channel, leave workspace, delete account
- Keyboard nav in message list (j/k to move, e to edit, t to thread)
- Focus rings + a11y pass (aria-labels on icon buttons)
- Logo + favicon update for "Relay"

### 11. Extra screens worth adding

- **Channel browser** (`/app` modal): grid of all channels with join button, member count, filter
- **People directory**: full member list with search, role filter, status
- **Workspace switcher** dropdown on global sidebar (mock 2-3 workspaces)
- **Help center** stub page (`/help`) with searchable FAQ
- **Changelog** page (`/changelog`) — Vercel-style timeline
- **Status page** (`/status`) — system health indicators

### 12. Landing page upgrades

- Animated hero (subtle gradient mesh / grid)
- Features section with screenshots/mockups
- Logo cloud ("Trusted by")
- Testimonial cards
- Comparison table (Relay vs Slack vs Discord)
- Newsletter signup (UI only)

---

### Technical approach

- Lift shared state (messages, unreads, pins, saved, theme) into a Zustand store at `src/lib/store.ts` for clean local persistence
- Add `localStorage` middleware so refresh keeps state
- Add `marked` + `highlight.js` for markdown/code rendering
- Add `emoji-picker-react` for the reaction picker
- All new modals use existing `Modal.tsx` primitive
- All new routes follow flat dot-naming (`channels.browse.tsx`, `help.tsx`, `changelog.tsx`)
- Rebrand done via global search-replace pass

### Suggested execution order

1. Rebrand pass (fast, unblocks everything)
2. Zustand store + functional composer + unread badges
3. Threads/pins/saves wiring + reactions + mentions
4. Theme system + appearance settings
5. Profile cards, presence, typing
6. File upload UI + markdown + link unfurls
7. New screens (channel browser, people, switcher)
8. Landing polish + 404 + empty states + toasts
9. Final a11y + keyboard nav pass

Reply with which sections to ship (or "all") and I'll execute in default mode.

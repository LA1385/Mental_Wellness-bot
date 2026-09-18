# Admin Dashboard — Agent Build Brief

Give this file directly to the coding agent. It's written as a sequence of phases with an
explicit **STOP — review before continuing** gate after each one, so you can check the
agent's work in small chunks instead of reviewing one giant diff at the end.

A working visual reference already exists: `admin-dashboard-prototype.html`. Match its
palette, layout, and metrics exactly unless a phase below says otherwise — it is the
approved design, not a rough sketch.

**Current status: Phases 1, 2, 3, and 5 are clear to build now. Phase 4 is on hold** —
backend is still finalizing the real data format. Before doing anything, produce a short
plan of execution covering Phases 1–3 and 5, in order, with the review-point gates intact,
for founder sign-off. Do not begin coding until that plan is reviewed and approved.

---

## Locked decisions (do not deviate without asking)

- **Stack:** Vite + React + TypeScript, Tailwind CSS, TanStack Query, Recharts, deployed on Vercel.
- **Scope:** aggregate stats only. No component, route, or API call may ever request or
  render per-session/per-student data. If a task seems to require it, stop and ask —
  don't build a workaround.
- **Palette (from the approved prototype):** background `#f6f4ef`, panel `#ffffff`,
  ink `#1c231f`, muted `#6b7570`, sage `#4f7d63` (mild), amber `#c98a2e` (moderate),
  coral `#b5473f` (severe). Reuse these as Tailwind theme colors, not one-off hex values
  scattered through components.

---

## Phase 1 — Scaffold + static UI (no real data yet)

1. `npm create vite@latest` with the react-ts template.
2. Install Tailwind, configure the palette above as theme colors (`sage`, `amber`, `coral`, etc.) in `tailwind.config.js`.
3. Build the static layout matching the prototype 1:1:
   - Header with title + "live" badge (pulsing dot is fine as a CSS animation, no real websocket yet).
   - 3 stat cards (total sessions, completion rate, % severe).
   - 7-day trend chart (Recharts `AreaChart` or `LineChart`).
   - Tier breakdown (3 horizontal bars — mild/moderate/severe).
   - Live feed panel (list of tier-only entries).
   - Footer note about zero PII.
4. Use hardcoded mock data matching the shape in Phase 2 below — don't invent a different shape now and refactor later.

**STOP — review point 1:** Confirm the static build visually matches the prototype before any data-fetching logic is added.

---

## Phase 2 — Typed data contract + mock data layer

Define this TypeScript interface — this is the actual contract between frontend and backend, so get it right before building around it:

```ts
interface DashboardStats {
  totalSessions: number;
  completionRatePct: number;
  tierCounts: { mild: number; moderate: number; severe: number };
  dailySessions: { day: string; count: number }[]; // last 7 days
  recentFeed: { tier: 'mild' | 'moderate' | 'severe'; timestamp: string }[]; // last ~8 entries, tier + time ONLY
}
```

Build a `mockDashboardStats()` function returning this shape with randomized-but-plausible values (reuse the weighting from the prototype: ~60% mild, ~28% moderate, ~12% severe). Wire the Phase 1 components to consume this function's output instead of literal hardcoded JSX values.

**STOP — review point 2:** Confirm every component reads from `DashboardStats`, nothing is still hardcoded inline.

---

## Phase 3 — Live-updating behavior with TanStack Query

Replace the raw prototype's `setInterval` approach with `useQuery` + a `refetchInterval` (e.g. every 5–10s). Point it at `mockDashboardStats()` for now, but structure the fetch function as a single swappable module (e.g. `api/getDashboardStats.ts`) so backend integration in Phase 4 is a one-file change.

Add a subtle flash/highlight animation when a stat value changes between polls (reuse the prototype's flash-on-update behavior).

**STOP — review point 3:** Confirm polling works, numbers update smoothly, no layout jank on refresh.

---

## Phase 4 — ON HOLD. Do not start this phase yet.

Backend is building the real endpoint and will supply its own response format — not yet
delivered. **Stop after Phase 3 (or Phase 5, order doesn't matter) and wait.** Do not guess
at an endpoint shape or write placeholder integration code against an assumed format —
that produces exactly the kind of silent mismatch this brief exists to avoid.

When the format arrives, this section will be replaced with the real shape and the exact
task: swap the mock function inside `api/getDashboardStats.ts` for a real `fetch()` call,
touching nothing else. If a component needs to change at that point, the Phase 2 contract
was wrong and needs fixing first — not the components.

**STOP — do not proceed past this point until told the format has arrived.**

---

## Phase 5 — Auth gate (before this is ever deployed somewhere real)

Add a simple login gate (even a single shared password behind an env var is fine for a pitch-stage build) in front of the dashboard route. This does not need to happen before the pitch demo, but must happen before any real deployment a university could stumble onto. Flag this explicitly as incomplete if skipped for time.

---

## Out of scope — do not build unless explicitly asked

- Any filter/search by date range, tier, or anything else — not needed for the pitch.
- Any user/session table view — this would violate the zero-PII, aggregate-only requirement.
- Dark mode, i18n, or other polish — not worth the time in a 13-day window.

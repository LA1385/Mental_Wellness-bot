# Task: Audit-and-guide only — do NOT write the integration code

I'm attaching `dashboard-api-reference.md` — the real API my backend engineer built. You
already built this dashboard's UI, currently wired to mock data. I'm going to wire it up to
the real API myself, by hand, as a learning exercise. Your job is to make that possible for
me to do well — not to do it for me.

## What I want from you

### Step 1 — Audit, don't fix

Go through every file that currently defines or consumes the dashboard's data shape
(the type definitions, the mock data function, every component that reads from it) and
compare it field-by-field against what `dashboard-api-reference.md` actually returns from
`GET /api/stats` and `GET /api/stats/daily`.

Produce a plain comparison — for each field currently expected by the frontend, state:
- what the real API calls it instead (if the name differs)
- whether the real API's field is structured differently (nested vs flat, count vs percent,
  string vs number, etc.)
- whether the real API provides it at all

Do this as a report, not a diff. Don't touch any file yet.

### Step 2 — Flag anything the current UI needs that the API cannot supply

This is the important one. At least one component was built assuming data that this API
does not provide (I already suspect `LiveFeed` — a feed of individual recent check-ins with
per-event timestamps — since both API endpoints only return aggregate counts, not discrete
events). Find any others. For each one, state the gap plainly and stop — don't invent a
workaround, don't synthesize fake per-event data from the aggregate endpoints to make it
"work" quietly. This is a product decision for me to make (drop the component, redesign it
around what's actually available, or go back to backend and ask for a new endpoint) — not
something to paper over in code.

### Step 3 — Give me a checklist, not a solution

Based on the audit, give me an ordered list of what I'll need to change, described at the
level of "what has to happen," not "here's the code." For example: "the type definition
needs updating to match the real response shape" is right; showing me the updated interface
is not. Where there's a genuine decision to make (e.g., use the API's precomputed
`severity_percent` or keep computing percentages client-side from the counts; how to handle
the snake_case → camelCase mismatch — a transform step, a mapping function, or something
else), name the options and the trade-off between them, but let me pick and implement it.

### How to work with me from here

- I learn by being asked questions before being told answers, and by writing the code
  myself with wrong-answer feedback rather than being handed a working version.
- When I come back with my own attempt, review it like a senior engineer would: tell me
  what's wrong, why, what edge case I missed, and what a cleaner approach would look like
  in principle — but don't rewrite my code for me unless I explicitly ask for a solution
  rather than a review.
- If I get stuck and ask "how would I even start this part," a nudge or a smaller sub-
  question to unblock my own thinking is fine. A finished function is not.

Do not edit any file in this step. Wait for me to write the changes myself and bring them
back to you for review.

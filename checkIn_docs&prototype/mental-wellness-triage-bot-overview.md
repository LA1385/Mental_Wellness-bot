# Mental Wellness Triage Bot — What We're Building

*A shared reference so both of us (Frontend + Backend) understand the same project the same way.*

---

## 1. The Problem, in One Paragraph

Most university students dealing with stress, anxiety, or depression never get help — not because help doesn't exist, but because they're too scared of being *seen* asking for it. Physical counseling offices are public, students avoid them, and by the time distress shows up it's usually as sleep problems, fatigue, or dropping grades — not a student walking into a clinic saying "I need help."

**Our fix isn't therapy. It's the missing first step: a private, anonymous way to check in on yourself and get pointed toward the right level of help.**

---

## 2. What The Bot Actually Does (Student's Journey)

**Think of it like an ER intake nurse.** A nurse doesn't treat you — they ask a few quick questions and decide: wait, see a doctor soon, or go straight to the back right now. That real-time routing decision is the entire value. **We are not building a dataset-collection tool for the admin — we're building that routing decision, live, for one student at a time.** The admin dashboard is a side effect of that, not the point (see Section 6).

1. Student opens a chat with our bot on **Telegram** (no app install, no sign-up, no name required).
2. Bot asks **16 simple multiple-choice questions** — like a quiz, not an interrogation.
3. Bot does some quick math on the answers.
4. Bot routes the student to exactly one of three outcomes:

| Tier | Triggered by | What the student sees |
|---|---|---|
| **Minimal / Mild** | Low PHQ-9 & GAD-7 totals | Self-help tips only. No human, no relay — just text, and the session ends. |
| **Moderate** | Medium totals | "Connecting you to a peer counselor" — this is the one tier with a live human relay in our demo (see Section 8). |
| **Severe** | High totals, **or** any non-zero answer on Q9 (self-harm question) — whichever comes first | Immediate, real crisis line (SURPIN), tappable to call. **Always. No filtering, no "are you sure" gate — see Section 8 for why.** |

5. Nothing is tied to the student's name, matric number, or identity. Ever.

That's the entire product. No AI magic, no diagnosis, no treatment — **just a smart, anonymous triage step that routes people to the right next action, in the moment.**

---

## 3. The 16 Questions (Where They Come From)

We're not writing our own quiz — we're using two questionnaires that are already the **global medical standard** for this exact purpose:

- **PHQ-9** — 9 questions, screens for depression
- **GAD-7** — 7 questions, screens for anxiety

Both work the same way: every question is answered on a 0–3 scale (*Not at all → Nearly every day*), we add up the answers, and the total number tells us how serious things might be.

| Total Score (PHQ-9) | What It Means |
|---|---|
| 0–4 | Minimal |
| 5–9 | Mild |
| 10–14 | Moderate |
| 15–19 | Moderately Severe |
| 20–27 | Severe |

**One important exception:** PHQ-9's 9th question asks about thoughts of self-harm. If a student answers anything other than "Not at all" on that *one* question, we treat it as an automatic severe case — **regardless of what the total score says.** This rule cannot depend on anything that might fail (like an AI call) — it has to be guaranteed, every single time.

---

## 4. What Backend Needs to Build (Python)

| Component | What it does | Why it matters |
|---|---|---|
| **Telegram webhook handler** | Receives each button tap from the student, replies with the next question | This is the "conversation" — Telegram sends us a message every time someone taps a button |
| **Conversation state machine** | Remembers which question a given (anonymous) session is currently on | Without this, the bot forgets where it left off between messages |
| **Scoring engine** | Pure functions: takes a list of 16 answers → returns PHQ-9 total, GAD-7 total, severity band | Should be simple enough to unit test with no database or network needed |
| **Escalation router** | Decides which of the 3 outcome messages to send, based on the scoring engine's result | Includes the hard-coded Q9 override rule above. All 3 messages are **pre-written and fixed** — see Section 9 for exact copy. Nothing here is AI-generated; the bot picks from a small, fixed set of templates, never generates new text. |
| **Peer counselor relay (demo only)** | When a session hits "moderate," sends a Telegram notification to a designated phone (yours, for the demo) so a human can reply through the bot in real time | This is a "Wizard of Oz" demo technique — automation-looking, human-powered. Only active during controlled demo walkthroughs, never left open to the public. See Section 8. |
| **Database (3 tables only)** | `sessions`, `responses`, `results` — see note below | No `users` table, on purpose — that's our anonymity guarantee |
| **(Optional, later) LLM tone layer** | Rewrites only the intro/small-talk text to sound warmer | Must NEVER touch scoring or the escalation decision — if it fails, the core bot still works |

**Suggested Python stack:** `python-telegram-bot` (or Flask + a raw webhook if you want more control) + SQLite for the demo (Postgres later if this goes beyond the hackathon). Keep the scoring engine as plain functions with no framework dependencies — that makes it trivially testable and reusable if we ever swap the delivery channel (e.g. WhatsApp later).

### Backend's Honest Concerns (worth discussing as a team before Day 3)

- **Telegram's free-tier rate limits** — shouldn't be an issue at hackathon-demo scale, but worth knowing the ceiling exists.
- **State machine edge cases** — what happens if a student abandons the chat mid-quiz and comes back a day later? (Suggestion: sessions older than X hours auto-expire and restart.)
- **No PII, enforced at the code level, not just policy** — it's easy to *accidentally* log a Telegram username or chat metadata somewhere. Worth a deliberate check before demo day.
- **Testing the Q9 override** — this is the one piece of logic that must never break. It should have its own explicit unit test, separate from general scoring tests.

---

## 5. What Frontend (You) Owns

1. **The bot's conversation UX** — how each question is phrased, how answer buttons are laid out. You don't need to know clinical terminology to do this well; you're designing a clean 16-question form, one screen at a time.
2. **The admin dashboard** — shows aggregate, anonymous stats only (e.g. "142 sessions this week, 12% flagged severe"). No individual student data ever appears here. This is your strongest visual piece for the live demo.
3. **The pitch deck.**

---

## 6. The Sustainability Requirement — Why This Isn't Just a Demo Toy

The hackathon is asking for something that could genuinely plug into the university's existing systems, not just a one-off prototype. Here's our honest answer to that:

- **It already has a funding mechanism, not a hypothetical one.** Nigerian universities already collect a mandatory NGN 2,000/session health insurance fee (TISHIP) from every student — and the research shows less than half of students even know this fund exists or what it's for. Our pitch is that a small slice of that *already-collected* money (not new fees) funds hosting and maintenance. We're not asking the university to find new budget — we're asking them to redirect a sliver of money they're already sitting on and underusing.
- **Zero vendor lock-in.** Telegram's Bot API is free and has no approval bottleneck (unlike WhatsApp Business API), and our scoring logic is plain Python with no proprietary dependency — the university isn't stuck paying a SaaS company forever.
- **It's designed to hand off, not replace.** We're not claiming to be a substitute for the campus counseling office — we're the anonymous front door that routes students *to* real support (peer counselors, then licensed professionals for severe cases). That makes it complementary to existing university health infrastructure, not a threat to it.
- **Aggregated data has institutional value.** The anonymized dashboard gives the university's health administrators a real-time view of student wellbeing trends — something they currently have zero visibility into — without ever exposing an individual student's identity.
- **The dashboard doubles as an advocacy tool, not just a report.** A number like "18% of screened students this term scored moderate-to-severe" becomes hard evidence a university can use to justify funding a real, ongoing mental wellness program — pairing "here's proof the need exists" with "here's the funding mechanism (TISHIP) that already exists to pay for it" is a stronger institutional pitch than either point alone.

---

## 7. What This Is NOT (Keep Us Honest)

- Not a diagnosis tool. It screens and routes — it doesn't tell anyone they "have depression."
- Not therapy or treatment.
- Not a replacement for licensed mental health professionals — severe cases always route to a human, immediately.

---

## 8. Decisions Locked In (Team Agreement)

- **Peer counselor step (moderate severity) → simulated for the demo.** The bot shows a scripted "connecting you to a peer counselor" message. No real person is behind this for the hackathon build.
- **Self-harm question (PHQ-9 Q9) → NOT simulated. This is different from the peer counselor path.** We are NOT trying to build our own live crisis-response team in 13 days — that would be irresponsible to promise and impossible to staff. Instead, we route immediately to a real, already-staffed 24-hour service:

  **[SURPIN — Suicide Research and Prevention Initiative](https://www.surpinng.com/)**
  24-hour helpline, staffed by 100+ psychiatrists, clinical psychologists, and social workers, with a national referral network across all 36 states + FCT.
  - MTN: `+234-903-440-0009`
  - 9Mobile: `+234-908-021-7555`
  - Hausa-language support: `+234-814-224-1007`
  *(Numbers pulled from SURPIN's public helpline listing — confirm they're still live closer to demo day, helpline numbers can change.)*

  **How this shows up in the bot, specifically:**
  - Any non-zero answer to Q9 → immediate message with a **tappable `tel:` link**, not just a number printed as text. One tap should start the call — no copy-paste, no friction.
  - The bot doesn't just drop the number and go quiet — it stays warm ("You're not alone — this is a real team, available right now, and confidential").
  - We are explicitly NOT simulating a live "someone is watching your chat" response, because we can't actually guarantee that in 13 days, and pretending to would be worse than being upfront that the bridge is to a real, already-existing service.
- **Session TTL: 12 hours.** A session that goes idle for 12 hours auto-expires; the student would start a fresh session if they return after that.
- **No LLM tone layer in this build — at all.** Not built, not simulated, not referenced as "live" in the demo. It can be mentioned in the pitch deck as a *future roadmap item* if useful for the "why this is sustainable long-term" narrative, but nothing in the actual bot depends on it.

---

## 9. The Exact Messages (Frontend copy + Backend implementation reference)

All three messages below are **fixed templates** — write them once, store them as constants, never generate them dynamically.

### Tier 1 — Minimal / Mild (self-help only, no human involved)
> "Thanks for checking in. Based on your answers, you're not showing signs of serious distress right now — but everyone has rough patches. Here are a few things that can help: [short list — sleep, talking to a friend, campus resources]. You can check in again anytime."

### Tier 2 — Moderate (peer counselor relay)
> "It sounds like you've been carrying a lot lately. We'd like to connect you with a peer counselor who can talk this through with you. Hang tight — someone will be with you shortly."

*(Then, during a controlled demo: your phone gets notified, you — playing the future trained-counselor role — reply manually, and it appears in the student's chat as a follow-up message.)*

### Tier 3 — Severe (real crisis line, always, no exceptions)
> "What you've shared matters, and you don't have to handle this alone. Please reach out now — this is a real team, available right now, and confidential: **[tap to call SURPIN]**"
>
> *(Tappable `tel:` link to SURPIN's number — see below. This message and the routing to it are IDENTICAL every time Q9 is triggered, regardless of who's asking or why.)*

**SURPIN — Suicide Research and Prevention Initiative**
24-hour helpline, 100+ psychiatrists/clinical psychologists/social workers, national referral network across all 36 states + FCT.
- MTN: `+234-903-440-0009`
- 9Mobile: `+234-908-021-7555`
- Hausa-language support: `+234-814-224-1007`
*(Confirm these are still live closer to demo day — helpline numbers can change.)*

### The No-Filtering Rule (important — read this before building the escalation router)

**Every session that crosses the severe threshold gets the real SURPIN message. No exceptions, no "are you sure this is real" gate, no quiet downgrade for answers that look like trolling.**

Why: a triage system's job is to be over-sensitive, not clever. The cost of a curious/joking student seeing a real phone number they can choose to ignore is basically zero. The cost of the system trying to guess who's "really" in crisis and getting it wrong even once is unacceptable. Real crisis hotlines already handle prank calls and curious testers as a normal, expected part of running a 24-hour public line — we're not creating a new problem for SURPIN by being consistent.

**The only thing we control is our own demo script (below) — never the product logic itself.**

### Demo Script for Judging Day

Keep these three moments visually and narratively separate — don't blend them:

1. **Let a judge test the bot live**, with a scripted "mild" persona you hand them (or their own honest answers). They see the self-help result appear instantly, unscripted, proving the core flow works.
2. **You walk through a moderate-tier scenario yourself** (type the scripted answers) → bot says "connecting to a peer counselor" → your phone buzzes on stage → you reply → judges watch a real message land back in the chat. This is the "wow, it's alive" moment. Explicitly narrate it as proof-of-concept: *"In a real deployment, this would be a trained, supervised counselor — we're demoing the workflow, not the staffing."*
3. **You walk through the severe-tier scenario yourself** (never let a judge free-type into this one) → bot shows the real SURPIN tappable link. You don't need to complete a live call on stage — showing the message and link appear correctly makes the point. If you want proof it works, record yourself dialing it in rehearsal and show that clip instead of calling live during the pitch.

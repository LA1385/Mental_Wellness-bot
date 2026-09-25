# Admin Dashboard API — Reference for Frontend

**Base path:** `/api`

**Auth:** every endpoint needs the header `X-Admin-Key: <ADMIN_API_KEY>` once `ADMIN_API_KEY` is set on the server. 

**Two rules that apply to every endpoint below:**

1. Every number you get back is a *count or percentage across many students* — you will never get a single student's individual answers or any way to identify one person.
2. Some fields can come back as `null`. That's not a bug — it means the group in question (e.g. a faculty, a hall) has fewer than 15 respondents, and we deliberately hide the number so a small group's stat can't accidentally be traced back to one or two real people. Render `null` as something like "not enough data yet," not as zero or an error.

---

## 1. `GET /api/stats` — Overall Summary

**What it's for:** the top-of-dashboard numbers — how many students have used the bot, and how serious things looked overall.

**Optional query param:** `?days=7` for "last 7 days only." Leave it off for all-time.

```json
{
  "window": "all time",
  "total_sessions": 300,
  "completed_sessions": 285,
  "in_progress_sessions": 10,
  "expired_sessions": 5,
  "completion_rate_percent": 95.0,
  "severity_breakdown": {
    "minimal_mild": 165,
    "moderate": 75,
    "severe": 45
  },
  "severity_percent": {
    "minimal_mild": 57.9,
    "moderate": 26.3,
    "severe": 15.8
  },
  "self_harm_override_count": 24
}
```

**Field meanings, in plain terms:**

| Field | Means |
|---|---|
| `total_sessions` | Total number of times someone opened the bot to check in |
| `completed_sessions` | How many of those actually finished all 16 questions |
| `in_progress_sessions` | Still mid-quiz right now |
| `expired_sessions` | Started, then went quiet for 12+ hours and got auto-closed |
| `completion_rate_percent` | % of everyone who started that actually finished |
| `severity_breakdown` | Raw headcounts — how many people landed in each outcome tier |
| `severity_percent` | Same thing, but as a percentage of completed sessions |
| `self_harm_override_count` | How many completed sessions were flagged severe *specifically* because of the self-harm question (Q9) — separate from being flagged severe just from a high overall score |

**Tiers explained:**
- `minimal_mild` = student is doing okay, got self-help tips only
- `moderate` = student showed some real signs of struggle, got connected to a peer counselor
- `severe` = student showed serious signs of distress (or answered "yes" to the self-harm question), got the real crisis helpline number immediately

---

## 2. `GET /api/stats/daily` — Trend Over Time

**What it's for:** the line chart showing check-ins per day.

**Optional query param:** `?days=30` (default is 30 days).

```json
[
  { "date": "2026-08-25", "total": 0, "severe": 0, "moderate": 0, "minimal_mild": 0 },
  { "date": "2026-08-26", "total": 4, "severe": 1, "moderate": 1, "minimal_mild": 2 }
]
```

**How to read it:** one entry per day, oldest first, always includes every day in the range even if nothing happened that day (so you never have to fill in gaps yourself before charting it).

---

## 3. `GET /api/stats/symptoms` — Most Common Symptoms Overall

**What it's for:** "what are students actually struggling with the most" — across everyone, no faculty/gender/hall split.

```json
[
  { "symptom": "sleep_problems", "respondents": 285, "elevated_percent": 41.4 },
  { "symptom": "appetite_change", "respondents": 285, "elevated_percent": 22.1 }
]
```

**How to read it:** `elevated_percent` = what % of everyone who answered that question said it was happening "more than half the days" or worse (not just "a little, sometimes").

**Full list of `symptom` values and what they mean in plain English:**

| `symptom` value | Plain meaning |
|---|---|
| `anhedonia` | Lost interest/pleasure in things they used to enjoy |
| `low_mood` | Feeling down, depressed, or hopeless |
| `sleep_problems` | Trouble sleeping, or sleeping too much |
| `fatigue` | Low energy / feeling constantly tired |
| `appetite_change` | Eating a lot less or a lot more than usual |
| `low_self_worth` | Feeling like a failure or letting people down |
| `concentration_problems` | Trouble focusing (schoolwork, reading, etc.) |
| `psychomotor_changes` | Moving/speaking unusually slowly, or unusually fidgety/restless |
| `self_harm_ideation` | Thoughts of self-harm — **this is the safety-critical one (Q9)** |
| `nervousness` | Feeling nervous, anxious, or on edge |
| `uncontrollable_worry` | Can't stop or control worrying |
| `excessive_worry` | Worrying too much about lots of different things |
| `trouble_relaxing` | Can't relax / unwind |
| `restlessness` | So restless it's hard to sit still |
| `irritability` | Easily annoyed or irritable |
| `fear_of_impending_doom` | Feeling afraid something bad is about to happen |

---

## 4. `GET /api/stats/demographics/<axis>` — Severity by Group

Replace `<axis>` with one of: `faculty`, `gender`, or `hall_of_residence`.

**What it's for:** "how are students in Faculty X / Hall Y / Gender Z doing overall" — one grouping at a time (we don't combine groupings, e.g. no "female Engineering students" — see note at the bottom on why).

```json
[
  {
    "group": "Computing",
    "respondents": 62,
    "severity_percent": { "minimal_mild": 60.0, "moderate": 25.0, "severe": 15.0 }
  },
  {
    "group": "Law",
    "respondents": 9,
    "severity_percent": null
  }
]
```

Here, "Law" has too few respondents (under 15) so its numbers are hidden — that's the privacy rule from the top of this doc in action.

Wrong axis name (anything other than the 3 listed) → `400 {"error": "Unsupported axis: <whatever you sent>"}`.

---

## 5. `GET /api/stats/symptoms/<axis>` — Symptoms by Group

Same 3 axis options as above (`faculty`, `gender`, `hall_of_residence`).

**What it's for:** the actual "40% of X hall report anxiety symptoms" style statement — symptom breakdown *within* one group at a time.

```json
[
  {
    "group": "Sultan Bello",
    "respondents": 34,
    "item_elevated_percent": {
      "sleep_problems": 47.1,
      "uncontrollable_worry": 38.2
    }
  },
  {
    "group": "Vet Medicine",
    "respondents": 6,
    "item_elevated_percent": null
  }
}
```
(Real responses include all 16 symptom keys per group, trimmed here for space — see the table in section 3 for what each key means.)

Same `400` error shape as section 4 for an invalid axis name.

---

## 6. `GET /api/stats/comorbidity` — Depression + Anxiety Together

**What it's for:** how often depression and anxiety show up *together*, and at what severity — useful for "students rarely have just one, they usually have both" style insights.

```json
{
  "Minimal__Minimal": 120,
  "Moderate__Moderate": 40,
  "Severe__Severe": 30,
  "Moderate__Mild": 12
}
```

**How to read a key:** `"{depression level}__{anxiety level}"`. So `"Moderate__Mild"` = 12 students had Moderate depression and Mild anxiety at the same time. Only combinations that actually happened show up as keys — don't assume every combination will be present.

---

## 7. `GET /api/stats/correlation` — Does Anxiety Track With Depression?

**What it's for:** a single number showing whether students with higher depression scores also tend to have higher anxiety scores (and vice versa).

```json
{ "pearson_r": 0.62, "n": 285 }
```

**How to read `pearson_r`:** ranges from -1 to 1.
- Close to **1** → strongly, students with more depression symptoms also tend to have more anxiety symptoms
- Close to **0** → basically no relationship
- Close to **-1** → the opposite (one goes up as the other goes down) — unlikely here, but technically possible

`n` is how many students' data went into that number — the more, the more trustworthy it is.

If there aren't at least 15 completed sessions yet, you'll get:
```json
{ "error": "insufficient data" }
```
Note this comes back as a normal `200` response, not an error status — it's an expected "not enough data yet" state early on, not something broken.

---

## 8. `GET /api/stats/quality` — Are Responses Trustworthy?

**What it's for:** sanity-checking the data itself — is anyone speed-clicking through without really answering, how many people abandon partway, etc.

```json
{
  "total_sessions": 300,
  "speed_run_count": 8,
  "speed_run_percent_of_completed": 2.8,
  "incomplete_count": 15,
  "incomplete_percent": 5.0,
  "distinct_chat_ids": 291,
  "chat_ids_with_multiple_sessions": 9
}
```

| Field | Plain meaning |
|---|---|
| `speed_run_count` / `speed_run_percent_of_completed` | Students who finished all 19 questions (3 demographic + 16 screening) in under 60 seconds — probably just clicking through without really reading |
| `incomplete_count` / `incomplete_percent` | Started but never finished (either still in progress, or auto-expired after 12 hours idle) |
| `distinct_chat_ids` | How many separate people have used the bot at all |
| `chat_ids_with_multiple_sessions` | How many of those people came back and did a second (or more) check-in |

> ⚠️ **Important for the UI copy:** `chat_ids_with_multiple_sessions` is **not** automatically a red flag. Someone checking in again weeks later — which is a good thing, it means they're using the tool as intended — looks exactly the same in this number as someone rapidly re-doing it. Don't label this "suspicious activity" in the dashboard without making that distinction clear, or it'll wrongly flag normal, healthy repeat usage.

---

## Why some breakdowns are "single-axis only"

You'll notice `faculty`, `gender`, and `hall_of_residence` are never combined with each other (no "female students in Engineering" type query). That's intentional, not a missing feature: combining two small categories together can shrink a group down to just a handful of real people, which starts to defeat the whole point of the bot being anonymous. Each one is reported on its own instead, with the 15-respondent floor as a backstop.

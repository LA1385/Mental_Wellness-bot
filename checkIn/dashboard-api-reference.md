# Admin Dashboard API Reference

Base path: `/api`

---

## `GET /api/stats?days=<int>`

Omit `days` for all-time.

```json
{
  "window": "last 7 days",
  "total_sessions": 142,
  "completed_sessions": 118,
  "in_progress_sessions": 15,
  "expired_sessions": 9,
  "completion_rate_percent": 83.1,
  "severity_breakdown": {
    "minimal_mild": 92,
    "moderate": 19,
    "severe": 7
  },
  "severity_percent": {
    "minimal_mild": 78.0,
    "moderate": 16.1,
    "severe": 5.9
  },
  "self_harm_override_count": 4
}
```

- `severity_percent` is % of **completed** sessions, not total.
- `self_harm_override_count` is a subset of `severity_breakdown.severe`.

---

## `GET /api/stats/daily?days=<int, default 30>`

Flat array, oldest first, no gaps (zero-fill days with no completions).

```json
[
  { "date": "2026-08-17", "total": 0, "severe": 0, "moderate": 0, "minimal_mild": 0 },
  { "date": "2026-08-18", "total": 5, "severe": 1, "moderate": 2, "minimal_mild": 2 }
]
```

- No wrapper object — it's a raw array.
- `total = severe + moderate + minimal_mild`.
- Length = `days + 1`.

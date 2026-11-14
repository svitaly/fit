# fit.sidorok.com

Static fitness site: training programs, measurements, diet and vitamins.
Built with [Hugo](https://gohugo.io), served via GitHub Pages at
**https://fit.sidorok.com**. Every push to `main` builds and deploys the site
(`.github/workflows/pages.yml`).

## Site map

| URL | Source | Content |
|---|---|---|
| `/` | `workouts/` | Workouts: list of training days, newest first, "✓ выполнено" badge on completed |
| `/workouts/dd-mm-yyyy/` | `workouts/dd-mm-yyyy.md` | One training day |
| `/measurements/` | `measurements/` | Body data, latest measurements, history table |
| `/diet/`, `/vitamins/` | `pages/*.md` | Placeholders, content to be added |

- The top nav (Тренировки · Диета · Замеры · Витамины) shows on every page
  **except** workout day pages.
- `chat/` is gitignored — the coach-chat export stays on the local machine only.
- Design: [Pure CSS](https://pure-css.github.io/) vendored in `assets/`, with a
  dark-theme layer and custom components in `assets/app.css`. Dark only.
- All weights in the workout programs are in **pounds**; set cells show bare
  numbers (`15/10` = reps/weight). Units are noted in each workout's Примечания.

## Workout day file (`workouts/dd-mm-yyyy.md`)

The whole program lives in the YAML header; the body is empty.

```yaml
---
title: "Спина + бицепс + пресс"
date: 2026-11-16
done: false
restMax: "150"     # session max rest, sec — fallback for the rest badge
goal: "..."        # one-liner shown under the page title
warmup:            # list of strings (**markdown** ok); NO rest instructions here
  - "Кардио 6 минут, пульс 120–130"
exercises:
  - name: "Тяга Т-грифа"
    machine: "Т-гриф"                    # machine / equipment chip, free-form RU/EN
    protection: "Налокотники"            # blue badge; omit if no protection needed
    rest: "30–60"                        # green badge, sec; falls back to restMax
    note: "Максимально сводить лопатки"  # ALL instructions/insights go here
    sets:
      - { w: "60", r: 10 }               # w = weight (string), r = reps
      - { w: "СВ", r: "макс" }           # СВ = body weight
      - { w: "70", r: 10, drop: true }   # drop-set cell
    comment: "70 — дроп-сет"             # optional coach note (e.g. drop-set explanation)
    actual: [10, 10, 10, 10, 10, 8]      # report mode: performed reps, set order
    result: "Тяжело на последних"        # report mode: note from the training report
finisher:          # optional, list of strings
  - "**Кардио 15 минут, пульс 125–135**"
notes:             # optional, list of strings — CURRENT workout info only
  - "Все веса в фунтах (ф)"
---
```

### Exercise block rendering

Number + title with badges (title left, badges right) → machine chip →
instructions (`note`) → set/rep grid → completion notes.

- **Badges**: blue `protection` (Russian: Налокотники, Пояс, Лямки…) — shown
  only when protection is required; green `rest` — **always shown**, seconds
  without the word ("150с", "30–60с"), per-exercise `rest` or session `restMax`.
- **Machine**: free-form, Russian or English (Смитт, Гравитрон, Dumbbells,
  Smith machine…) — rendered as a subdued chip.
- **`note`** holds everything instructional: technique cues, breathing, coach's
  explanations, substitutions.
- **Set/rep grid**: one cell per set, label `reps / weight`, checkbox under a
  hairline. Coach's multi-set notation ("75: 3/8") is expanded into separate
  cells. Drop-sets/rest-pause are extra cells with `drop: true` — they form a
  green group together with the last main working set and get a "↳" marker.
- **Notes section**: only current-workout information. No rest-day instructions
  (e.g. steps on rest days), no next-workout teasers.
- **No video markers** ("(видео)") in programs — they were removed and should
  not be reintroduced when converting programs from the chat.
- Warm-up, finisher and notes lists are plain — they never get checkboxes;
  only real exercise sets are interactive.

### Upcoming vs completed days

- `done: false` (upcoming): interactive page — tappable set checkboxes, a
  progress counter, and per-exercise "Заметки…" notes. The notes control is a
  single muted line that expands into a one-line auto-growing textarea on tap.
  Checkboxes and notes persist in the browser's localStorage per device and are
  cleared by the "Сбросить" button.
- `done: true` (completed, "report mode"): exactly the same look minus all
  interactive elements — each set cell shows the actual performed reps instead
  of a checkbox (numbers deviating from the plan are highlighted), and each
  `result` note is shown under its exercise. The day gets a "✓ выполнено" badge
  on the page and on the index.

### Marking a day as done (after a training report)

Edit `workouts/dd-mm-yyyy.md`:

1. set `done: true`;
2. per exercise, record deviations: `actual` — performed reps in set order
   (omit for exercises done exactly as planned); `result` — free-form note from
   the report.

Push — the day becomes a training log entry.

## Measurement entry (`measurements/dd-mm-yyyy.md`)

One file per report:

```yaml
---
title: "Замер от 16.02.2026"
date: 2026-02-16
kg: "99,0"       # weight, kg ('weight' is a reserved Hugo key — use 'kg')
waist: "101,9"   # живот, см
bicep: "40,4"    # бицепс, см
thigh: "63,4"    # бедро, см
build:
  render: false
  list: local
---
```

The measurements page (general info — height and DOB live in
`measurements/_index.md`, age is computed at render time; latest entry as stat
cards; full history table, newest first) updates automatically.

## Local preview

```sh
make serve    # live preview at http://localhost:1313
make build    # build static site into ./html
```

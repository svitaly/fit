# fit.sidorok.com

Static site with training programs, built with [Hugo](https://gohugo.io) and served
via GitHub Pages at **https://fit.sidorok.com**.

## How it works

- Each training day is a markdown file in `days/`, named `dd-mm-yyyy.md`.
  The whole program lives in the YAML header (see structure below); the body
  is empty.
- Every push to `main` triggers `.github/workflows/pages.yml`, which builds the
  site with Hugo and deploys it to GitHub Pages.
- The index page lists all days (newest first) as links; completed days get a
  "✓ выполнено" badge.
- Design: [Pure CSS](https://pure-css.github.io/) (vendored in `static/`) with a
  dark theme layer and set-cells component in `static/app.css`.
- Each set is rendered as a tappable cell (weight / reps / checkbox).
  Ticks are stored in the browser's localStorage per device — they survive
  reloads and screen lock, with a reset button on the page. Only real exercise
  sets get checkboxes; warm-up, finisher and notes don't.

## Day file structure

```yaml
---
title: "Спина + бицепс + пресс"
date: 2026-11-16
done: false
goal: "..."
warmup:              # list of strings, supports **markdown**
  - "Кардио 6 минут, пульс 120–130"
exercises:
  - name: "Тяга Т-грифа"
    note: "максимально сводить лопатки"      # optional cue
    sets:
      - { w: "60ф", r: 10 }                 # w = вес (string), r = повторы
      - { w: "СВ", r: "макс" }              # СВ = свой вес
    comment: "70ф — дроп-сет"                # optional coach note
finisher:            # optional, list of strings
  - "**Кардио 15 минут**"
notes:              # optional, list of strings
  - "Все веса в фунтах (ф)"
---
```

Fields: `goal`, `warmup`, `finisher`, `notes`, and per-exercise `note` /
`comment` are optional. Drop-sets and rest-pause sets are just extra cells
(plus a `comment` explaining them).

## Marking a day as done

After the training, edit `days/dd-mm-yyyy.md` and set `done: true` in the YAML
header (optionally also record actual results in a `comment` or `note`).
Push — the day gets the "✓ выполнено" badge on the index page.

## Local preview

```sh
make serve    # live preview at http://localhost:1313
make build    # build static site into ./html
```

## Adding a new training day

Create `days/dd-mm-yyyy.md` following the structure above, commit and push —
done.

---

## First-time setup (already done except the push)

This repo expects to be a **public** GitHub repository. The `chat/` directory
is in `.gitignore` and never gets committed.

### 1. Create the repo and push

On github.com create a new **public** repo (no README, no license), e.g. `fit`.
Then from this directory:

```sh
git remote add origin git@github.com:USERNAME/fit.git
# or: git remote add origin https://github.com/USERNAME/fit.git
git push -u origin main
```

### 2. Enable GitHub Pages (via Actions)

Repo → **Settings → Pages**:

- **Build and deployment → Source:** `GitHub Actions`
- **Custom domain:** `fit.sidorok.com` — enter and Save. If DNS isn't set up yet
  (step 3), the check may fail; just re-run it after DNS propagates.
- Once the domain check passes, enable **Enforce HTTPS**.

The `configure-pages` step in the workflow sets the custom domain automatically
on the first successful run, but the DNS record must exist first.

### 3. Point the domain from GoDaddy

Open the GoDaddy Domain Control Center: **https://dcc.godaddy.com/domains/**
(or: godaddy.com → My Products → Domains → sidorok.com → DNS → Manage DNS).

Find the DNS records table and add a record:

| Field  | Value                    |
|--------|--------------------------|
| Type   | `CNAME`                  |
| Name   | `fit`                    |
| Value  | `USERNAME.github.io.`    |
| TTL    | `1 Hour` (or default)    |

Replace `USERNAME` with the actual GitHub account name. Delete any conflicting
`A`/`CNAME` records for the `fit` host if present.
DNS propagation usually takes from a few minutes up to an hour. Verify:

```sh
dig fit.sidorok.com +short   # should return USERNAME.github.io. and its IPs
```

### 4. Verify

Push a commit (or re-run the workflow from the Actions tab), wait for the green
checkmark, then open **https://fit.sidorok.com**.

> If Pages says "domain not verified": Settings → Pages → re-validate the custom
> domain after DNS resolves. Subdomain CNAMEs to `USERNAME.github.io` normally
> don't require the domain-verification TXT flow (that's for apex domains/orgs).

## Notes

- All weights in the programs are in pounds (ф = фунты).
- `html/` is generated output and is gitignored; CI rebuilds it on every push.

# fit.sidorok.com

Static site with training programs, built with [Hugo](https://gohugo.io) and served
via GitHub Pages at **https://fit.sidorok.com**.

## How it works

- Each training day is a markdown file in `days/`, named `dd-mm-yyyy.md`,
  with a YAML header (`title`, `date`).
- Every push to `main` triggers `.github/workflows/pages.yml`, which builds the
  site with Hugo and deploys it to GitHub Pages.
- The index page lists all days (newest first) as links.

## Local preview

```sh
make serve    # live preview at http://localhost:1313
make build    # build static site into ./html
```

## Adding a new training day

Create `days/dd-mm-yyyy.md`:

```markdown
---
title: "Спина + бицепс + пресс"
date: 2026-11-16
---

...program content...
```

Commit and push — done.

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

In GoDaddy → **My Products → sidorok.com → DNS → Manage Zones** add a record:

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

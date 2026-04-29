# Change Management Rule (ISO 27001)

All code and content changes must follow a traceable workflow that an auditor
can verify: **issue → branch → PR → merge → verify**.

## Standard Workflow

Every change that modifies behavior, configuration, content, or dependencies:

1. **Issue first.** Create a GitHub issue describing the change before starting
   work. If an issue already exists, reference it.
2. **Branch.** Create a feature branch from `main` named
   `{type}/{short-description}` (e.g., `feat/engagement-model`,
   `fix/css-banner-edge-case`).
3. **Work.** Make changes on the branch. Run preflight checks before committing.
4. **PR.** Create a pull request linking to the issue with `Closes #N` or
   `Fixes #N` in the body. PR body must include a Summary and Test Plan.
5. **Merge.** Merge with `gh pr merge --admin --merge --delete-branch` (org
   policy blocks auto-merge; admin override is authorized for the repo owner).
6. **Post-merge verification.** After every merge to main:
   - Check GitHub CI: `gh run list --limit 3`
   - Check Cloudflare build logs (docs site deploys to CF Workers): verify the
     build succeeds
   - Check Dependabot:
     `gh api repos/RickCogley/hibana/dependabot/alerts --jq '[.[] | select(.state=="open")] | length'`
     — address any new alerts
7. **Release.** Releases are created periodically via
   `gh release create v<x.y.z>` with hand-written notes. **deno.land/x**
   auto-publishes from the tag via webhook (no GitHub Action involvement). JSR
   is intentionally not used — Lume's dev resists JSR because JSR doesn't
   support http imports, and hibana follows Lume's hosting choice so it can be
   pulled into Lume cleanly.

## Branching correctly

Use `git switch -c <branch>` from main, NOT
`git checkout origin/main -b <branch>` (the latter sets the upstream to
`origin/main`, which can cause `git push -u origin <branch>` to push directly to
main and bypass review).

```bash
git switch main && git pull --ff-only
git switch -c feat/whatever
# ...work...
git push -u origin HEAD
```

Pre-push sanity check on a new branch:

```bash
git branch -vv
# Current branch should NOT show [origin/main] or any [origin/something-else]
# upstream. An unset upstream (no brackets) is what you want.
```

## Writing PR and issue bodies

Always pass multi-line or markdown-rich bodies **by file**, never inline via a
heredoc:

```bash
gh pr create    --body-file <path>
gh pr edit N    --body-file <path>
gh issue create --body-file <path>
git commit      -F <path>
```

Heredocs cause backslash artifacts in rendered markdown.

## Conventional Commits

```
type(scope): description

Body explaining the change (if needed).

InfoSec: [security/quality/privacy consideration]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**InfoSec line** — required for all changes. Examples:

- `InfoSec: input validation added for user-supplied query parameters`
- `InfoSec: no security impact — content-only change`
- `InfoSec: dependency update addresses CVE-2026-XXXX`

If a change has no security implications, state that explicitly.

## Rationale

This workflow produces the evidence chain that ISO 27001 (A.8.9, A.8.25, A.8.32)
requires:

- **Change request** → GitHub issue
- **Authorization** → PR review and merge approval
- **Testing** → CI checks
- **Implementation** → Commits on feature branch
- **Verification** → Post-merge CI confirmation

An auditor can trace any production change from PR → issue → commits → CI
results.

---

_Originally synced from
[eSolia/devkit](https://github.com/eSolia/devkit)/.claude/shared-rules/change-management.md.
This repo is not a devkit sync consumer — edit locally as needed._

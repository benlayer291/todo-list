# Retro: Todo list

**Linear:** https://linear.app/rotate/project/todo-list-737f7d905efa
**Date:** 2026-06-30
**Status:** Approved

---

## Summary

| | |
|--|--|
| **Project** | https://linear.app/rotate/project/todo-list-737f7d905efa |
| **Start date** | 2026-06-30 |
| **End date** | 2026-06-30 |
| **Total issues** | 7 (ENG-352–358) — all Done |
| **Total estimate** | 17 points (3+3+3+2+2+2+2) |
| **Planning loops** | 1 (breakdown→estimate→sequence, clean — no re-loops; max 5) |
| **QA bugs raised** | 0 Critical, 0 High, 0 Medium, 0 Low |
| **PRs** | 8 (7 delivery + 1 project-QA), all merged via review |
| **Tests** | 40 (17 data + 23 UI), all green |

---

## Delivery against PRD

**Acceptance criteria met:** 8 / 8 (View ×2, Add ×2, Remove, Edit, Toggle, Persistence) — plus the project's own goal (validate the full skill chain end-to-end and surface skill bugs) achieved: the chain ran init→retro and surfaced 18 concrete skill improvements.

**Scope changes during project:** None in `scope.output.md` (scope change log empty). The product scope held exactly — the explicit out-of-scope list (due dates, priorities, multiple lists, tags, filter/sort, search, reorder) was never breached. (A planning-granularity change — splitting the combined Add/Remove and Edit/Toggle tasks into four separate interaction tasks — happened at breakdown, but did not change product scope.)

**Deviations from approach:** None material. All approach decisions held: pure immutable data module + thin DOM layer; jsdom test env (happy-dom rejected); single JSON blob under one key; stable `crypto.randomUUID()` ids (the `makeId()` fallback was never needed — the runtime had it); full re-render, no DOM diffing. Inline edit was implemented as double-click-to-edit, which the approach explicitly anticipated.

---

## What worked well

- **Pure data module first (ENG-353) paid off all the way down.** Because every operation was pure and tested in isolation, each of the four interaction tasks (add/remove/edit/toggle) collapsed to "wire one already-built op → `saveTasks` → re-render." Estimates of 2 points each were accurate; no interaction task needed debugging.
- **Gherkin scenarios mapped 1:1 to tests.** Acceptance criteria were unambiguous in delivery — every scenario became a named test, and the checklist's AC section just pointed at the test that proved it.
- **Event delegation on a persistent root** kept the full-re-render model clean across all four interactions — one listener per action type, no re-binding after re-render.
- **Documentation-first in `shaping-approach` eliminated delivery surprises.** Verifying jsdom's `localStorage`, Vite's vanilla support, and Vitest's `environment` up front meant zero spikes and zero "the tool doesn't do that" moments during build.
- **Real-browser CDP screenshots** gave genuine visual evidence for every UI task (not just jsdom), embedded in PRs via committed-asset + commit-pinned raw URL.
- **Granular commits per concern** (once adopted) made each PR reviewable as a sequence of small, green steps.

---

## What didn't work

- **Linear project lifecycle wasn't managed by any skill** — project sat on "Inactive" through delivery; status, lead, and issue assignment all had to be fixed manually mid-run. Issues were created in "Backlog" and unassigned.
- **Linear "attach to project" isn't a real MCP capability** — attachment tools are issue-scoped; project artefacts had to be Documents. The shaping skills' wording ("attach brief/scope/approach to project") is misleading.
- **Feature-README requirement is unconditional** — `delivery-build`/`delivery-checklist` expect a feature README every task, even for a setup chore (ENG-352) and an internal module (ENG-353) that legitimately have none.
- **`planning-breakdown` created Linear issues before the Gate 5 review** — rejected issues would already be in Linear. Local-first review was clearly better.
- **Default commit granularity was one squashed commit per PR** — had to be corrected to meaningful per-step commits.
- **Sync fidelity gaps** — the living QA doc wasn't auto-re-synced to Linear each task-level run, and the first checklist→Linear syncs flattened the acceptance-criteria checkboxes into prose.
- **No enforcement of PR-only changes to `main`** — the review skills nudged toward committing QA/retro docs directly to `main`.

---

## Workflow improvements

| Skill / artefact | Recommended change | Priority |
|-----------------|-------------------|---------|
| `shaping-prd` | Set project **status** (lifecycle: inactive→shaping→planned→delivery→completed) and **lead** (the human). Verify project labels exist before applying (the `test` label was silently dropped). Say "create as a project **Document**," not "attach." | High |
| `delivery-context` (+ review skills) | Advance project status to **delivery** on first delivery-context; to **completed** at retro close. | High |
| `planning-breakdown` | (1) Write task files **locally for Gate-5 review first**, sync to Linear only on approval. (2) Create issues as **"Todo"** and **assign to the human** (unless stated). (3) Include generated lockfiles in permitted lists for dep-adding tasks. (4) Favour one task per distinct user-facing action when actions are independent. | High |
| `delivery-build` / `delivery-checklist` | Make the **feature-README** requirement conditional on the task delivering user-facing behaviour; otherwise mark N/A, not a gap. | High |
| `delivery-build` / `delivery-pr` | Add explicit **commit-granularity** guidance (meaningful per-step commits, not one squash). Document the **screenshot-attach** method (commit asset → commit-pinned raw URL → embed in PR body) for UI visual evidence. | Med |
| `delivery-checklist` → Linear sync | Sync the checklist at **full fidelity** (preserve the marked AC checkboxes), not a prose summary. Name checklist files `NN-ENG-XXX-checklist.output.md` so they sort with task files. | Med |
| `review-qa` | **Re-sync the living QA doc to Linear every run.** Reinforce: QA failures become tracked Linear `[bug]` issues before being actioned — but distinguish a product defect from a QA-harness flaw (only product defects get bug issues). | Med |
| WORKFLOW.md / all skills | State explicitly: **never commit directly to `main`** — every change (code *and* review/retro docs) goes through a reviewed PR; recommend branch protection. The review skills need a "branch → commit → PR" step for their artefacts. | High |
| `delivery-pr` (note) | Recommend a merge strategy that preserves granular commits on `main` (merge-commit or rebase) if granular history is wanted; squash collapses them. | Low |
| `planning-breakdown` (sequencing note) | A chore that scaffolds `index.html` referencing a not-yet-created `src/main.js` leaves `npm run build` broken until a later task — note this, or scaffold a no-op placeholder. | Low |

*(Full detail for all 18 items is preserved in `docs/todo-list/retro-notes.md`.)*

---

## Checklist patterns

| Checklist item | Flagged in tasks | Root cause | Upstream fix |
|---------------|-----------------|-----------|-------------|
| Feature README "N/A by design" | ENG-352, ENG-353 | Checklist assumes a feature README every task; chores/internal modules have none | Make README requirement conditional on user-facing behaviour (`delivery-build`/`delivery-checklist`) |
| Lint / Format / Type-check "N/A" | every task | No linter/formatter/TS configured (vanilla JS by design) | Not a defect — the checklist could note "N/A when tooling not configured" to avoid ambiguity |

No **code** checklist item ever failed verification — every task passed its checklist on the first pre-PR run (0 checklist→build round trips used out of a max of 3 per task).

---

## Unresolved items

| Item | Decision | Reasoning | Linear issue (if carry forward) |
|------|----------|-----------|--------------------------------|
| 18 workflow/skill improvements (above + `retro-notes.md`) | **Carry forward — actioned now** | Human decision: these are improvements to the Claude workflow skills themselves; do **not** create Linear issues. Address them now, one by one, editing the relevant skill files directly. | — (no Linear issue; actioned as skill edits) |
| Open question: how a halted run is resumed if we stop to fix a skill bug mid-chain | **Deferred** | Never arose — the run completed without halting. | Condition: revisit if a future run halts mid-chain |

---

## Checkpoint status

**All unresolved items decided:** Yes — 18 improvements actioned as direct skill edits (no Linear issues, per human decision); halted-run question Deferred.
**Carry-forward Linear issues created:** N/A (improvements actioned as skill edits, not Linear issues)
**Workflow improvements logged:** Yes — 18 in `retro-notes.md`, consolidated above; to be applied to the skill files now.

---

**Approved by human (Gate 10).**
**Approved on:** 2026-06-30

---

**Synced to Linear:** Pending (project Document)

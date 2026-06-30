# QA: Todo list

**Linear:** https://linear.app/rotate/project/todo-list-737f7d905efa
**Date:** 2026-06-30
**Run type:** Task-level (after ENG-352 merged)
**Tester:** Claude Code

> Living document — updated after every task-level run. ENG-352 is a scaffold chore and owns no PRD user-story scenarios; all six story scenarios remain pending until their owning tasks merge.

---

## Scaffold sanity (ENG-352 — merged)
- [x] `npm test` passes on merged `main` — 3/3 (jsdom DOM, localStorage round-trip, cleared between tests).
- [x] App shell served by `npm run dev` with heading, add input+button, empty task list (verified pre-merge).
- [x] No PRD user-story behaviour expected yet.
**Result:** Pass

---

## Functional QA

### Story: View tasks
**Scenario:** List renders existing tasks — **Owned by task:** ENG-354 — pending
**Scenario:** Empty list — **Owned by task:** ENG-354 — pending
**Result:** Pending — not tested (ENG-354 not merged)

### Story: Add a task
**Scenario:** Adding a task — **Owned by task:** ENG-355 — pending
**Scenario:** Empty input is rejected — **Owned by task:** ENG-355 — pending
**Result:** Pending — not tested (ENG-355 not merged)

### Story: Remove a task
**Scenario:** Removing a task — **Owned by task:** ENG-356 — pending
**Result:** Pending — not tested (ENG-356 not merged)

### Story: Edit a task's text
**Scenario:** Editing task text — **Owned by task:** ENG-357 — pending
**Result:** Pending — not tested (ENG-357 not merged)

### Story: Toggle a task done / not-done
**Scenario:** Marking a not-done task as done — **Owned by task:** ENG-358 — pending
**Scenario:** Marking a done task as not-done — **Owned by task:** ENG-358 — pending
**Result:** Pending — not tested (ENG-358 not merged)

### Story: Persistence across sessions
**Scenario:** Tasks survive reload — **Owned by:** ENG-353 (storage I/O) + ENG-354+ (UI) — pending
**Result:** Pending — not tested (owning tasks not merged)

---

## Design QA
Skipped — non-UI-design project (no Figma spec; minimal functional styling only).

---

## Regression check
N/A for task-level. (First task; no prior passing scenarios to regress.)

---

## Bugs raised

| Description | Linear issue | Severity | Status |
|-------------|-------------|---------|--------|
| None | — | — | — |

---

## Overall result

**Status:** ✅ Pass
**Bugs raised:** 0 Critical, 0 High, 0 Medium, 0 Low
**Blocking next task:** No

---

**Human sign-off required before proceeding:** Task-level QA has no checkpoint; next task may begin.
**Sign-off status:** N/A (task-level)
**Approved on:** —

---

**Synced to Linear:** Pending

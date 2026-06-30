# QA: Todo list

**Linear:** https://linear.app/rotate/project/todo-list-737f7d905efa
**Date:** 2026-06-30
**Run type:** Task-level (latest run: after ENG-357 merged)
**Tester:** Claude Code

> Living document — updated after every task-level run. ENG-352 (scaffold) and ENG-353 (pure data layer) own no end-to-end PRD user-story scenario; those become testable once the UI tasks (ENG-354+) land. All six story scenarios remain pending.

---

## Scaffold sanity (ENG-352 — merged)
- [x] `npm test` passes on merged `main`.
- [x] App shell served by `npm run dev` with heading, add input+button, empty task list.
**Result:** Pass

## Data layer sanity (ENG-353 — merged)
- [x] `npm test` passes on merged `main` — 20/20 (17 tasks-module tests + 3 smoke).
- [x] Pure operations (add/remove/edit/toggle) + persistence (load/save) verified at unit level, including immutability and invalid-JSON load.
- [x] No end-to-end PRD scenario testable yet — persistence/behaviour surfaces through the UI tasks (ENG-354+).
**Result:** Pass

---

## Functional QA

### Story: View tasks
**Scenario:** List renders existing tasks — **Owned by task:** ENG-354 — merged ✅
**Scenario:** Empty list — **Owned by task:** ENG-354 — merged ✅
**Result:** Pass — verified by `renderTasks`/`mountApp` jsdom tests (text + done state + data-id; empty list renders cleanly) and a screenshot of the rendered app shell. End-to-end reload-restores-tasks confirmed on the read side (`mountApp` loads persisted tasks); write side via UI pending ENG-355+.

### Story: Add a task
**Scenario:** Adding a task — **Owned by task:** ENG-355 — merged ✅
**Scenario:** Empty input is rejected — **Owned by task:** ENG-355 — merged ✅
**Result:** Pass — verified by 5 add-interaction jsdom tests (adds not-done task, clears input, persists, rejects empty/whitespace, appends across adds) and a real-browser CDP screenshot of three tasks added through the UI.

### Story: Remove a task
**Scenario:** Removing a task — **Owned by task:** ENG-356 — merged ✅
**Result:** Pass — verified by remove-interaction jsdom tests (removes from list + localStorage; removes only the targeted task of three, leaving others and done states intact) and a real-browser CDP screenshot (added 3, removed the middle).

### Story: Edit a task's text
**Scenario:** Editing task text — **Owned by task:** ENG-357 — merged ✅
**Result:** Pass — verified by edit-interaction jsdom tests (dblclick→input; commit on blur/Enter updates in place, no duplicate, `done` preserved, persisted; empty commit unchanged; Escape cancels) and a real-browser CDP screenshot ("Buy milk" → "Buy oat milk").

### Story: Toggle a task done / not-done
**Scenario:** Marking a not-done task as done — **Owned by task:** ENG-358 — pending
**Scenario:** Marking a done task as not-done — **Owned by task:** ENG-358 — pending
**Result:** Pending — not tested (ENG-358 not merged)

### Story: Persistence across sessions
**Scenario:** Tasks survive reload — **Owned by:** ENG-353 (storage I/O) + ENG-354 (load/render) + ENG-355 (add writes) — merged ✅ for the add path
**Result:** Pass (add path) — verified end-to-end: adding a task writes to `localStorage` ("persists the added task" test) and `mountApp` restores it on reload (`mountApp` load test). Remove/edit/toggle persistence verified as those tasks land (ENG-356–358).

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

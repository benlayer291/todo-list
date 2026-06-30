# QA: Todo list

**Linear:** https://linear.app/rotate/project/todo-list-737f7d905efa
**Date:** 2026-06-30
**Run type:** Project-level (all 7 tasks merged) — final regression + E2E
**Tester:** Claude Code

> Living document. All 7 issues (ENG-352–358) merged. This is the project-level run: every PRD Gherkin scenario verified, plus a full regression (unit suite) and a real-browser end-to-end pass of all five actions with reload persistence.

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
**Scenario:** Marking a not-done task as done — **Owned by task:** ENG-358 — merged ✅
**Scenario:** Marking a done task as not-done — **Owned by task:** ENG-358 — merged ✅
**Result:** Pass — verified by toggle-interaction jsdom tests (both directions, only-targeted, persisted) and the real-browser E2E (Call Sam toggled done, survived reload).

### Story: Persistence across sessions
**Scenario:** Tasks survive reload — **Owned by:** ENG-353 (storage I/O) + ENG-354 (load/render) + ENG-355 (add writes) — merged ✅ for the add path
**Result:** Pass (add path) — verified end-to-end: adding a task writes to `localStorage` ("persists the added task" test) and `mountApp` restores it on reload (`mountApp` load test). Remove/edit/toggle persistence verified as those tasks land (ENG-356–358).

---

## Design QA
Skipped — non-UI-design project (no Figma spec; minimal functional styling only).

---

## Regression check (project-level)
Full unit suite re-run on merged `main`: **40/40 pass** (17 `tasks` + 23 `ui`). Every scenario that passed in a prior task-level run still passes — no regressions.

| Scenario | First passed in | Current result |
|----------|-----------------|----------------|
| View — renders existing / empty | ENG-354 | Pass |
| Add — adds not-done / rejects empty | ENG-355 | Pass |
| Remove — removes from list + storage | ENG-356 | Pass |
| Edit — in-place, no dup, empty-reject | ENG-357 | Pass |
| Toggle — both directions, only-targeted | ENG-358 | Pass |
| Persistence — survives reload | ENG-353/355+ | Pass |

## Project-level end-to-end (real browser, via CDP)
Exercised all five actions against the production build, then **reloaded** to confirm persistence:
1. Added "Buy milk", "Call Sam", "Book dentist".
2. Toggled "Call Sam" → done.
3. Edited "Buy milk" → "Buy oat milk" (double-click inline edit).
4. Removed "Book dentist".
5. Reloaded the page.

**After reload, rendered state:** `Buy oat milk` (not-done) · `Call Sam` (done); `Book dentist` absent — exactly as expected. All five actions + localStorage persistence confirmed end-to-end. (Screenshot in run artefacts.)

**QA-harness note:** the first E2E driver aborted mid-script (helper matched rows by `textContent`, which breaks once the edit swaps the text span for an input) — a flaw in the test driver, **not** a product defect; no Linear bug raised. Corrected driver passed cleanly.

---

## Bugs raised

| Description | Linear issue | Severity | Status |
|-------------|-------------|---------|--------|
| None | — | — | — |

---

## Overall result

**Status:** ✅ Pass (project-level)
**Scenarios tested:** 10 / 10 PRD Gherkin scenarios (6 stories) — all Pass
**Regression:** 40/40 unit tests pass on `main`; no regressions
**End-to-end:** all five actions + reload persistence verified in a real browser
**Bugs raised:** 0 Critical, 0 High, 0 Medium, 0 Low
**Blocking retro:** No

---

**Human sign-off required before proceeding (Gate 9):** Yes
**Sign-off status:** Pending
**Approved on:** —

---

**Synced to Linear:** Pending

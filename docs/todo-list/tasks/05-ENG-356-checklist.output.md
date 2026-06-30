# Delivery Checklist: ENG-356 — [feature] Remove task interaction

**Linear:** https://linear.app/rotate/issue/ENG-356
**Branch:** feature/eng-356
**Date:** 2026-06-30
**Run:** Pre-PR (round trip 1 of max 3)

> Every item must pass before the PR is raised. Return to delivery-build for any failure.

---

## Code quality
- [x] Linting — N/A (no linter)
- [x] Formatting — N/A (matches style)
- [x] Type checks — N/A (plain JS)
- [x] All tests pass — `npm test` → 32 passed (17 tasks + 15 ui)
- [x] No console errors — build succeeds; CDP app run clean

## Scope
- [x] Only permitted files modified — `src/ui.js`, `test/ui.test.js`, feature README (all permitted)
- [x] No out-of-scope changes — `src/tasks.js`, `src/main.js`, `index.html`, config untouched
- [x] Contracts satisfied — consumes `removeTask`/`saveTasks`; no new exported signatures; `.remove` control in `renderTasks`, delegated handler in `mountApp`
- [x] No new patterns — same pure-op → persist → re-render; event delegation on root

## Implementation standards
- [x] Functional and composable — handler reads id, calls pure `removeTask`, persists, re-renders
- [x] Container/presentation separation — `renderTasks` builds markup only; click wiring lives in `mountApp` (single delegated listener)
- [x] No unnecessary comments
- [x] Human readable
- [x] Established codebase patterns followed
- [x] No premature abstraction — one delegated listener, no per-button binding

## TDD
- [x] Tests written before implementation — 2 remove tests ran **red** before adding the control/handler; then green
- [x] Tests cover all acceptance criteria — removes from list + storage; removes only the targeted task (3-task case, by stable id)
- [x] Tests readable/self-documenting

## Feature documentation
- [x] Feature README updated — Remove marked implemented; data-flow + change history updated
- [x] Accurately reflects what was built
- [x] Synced to Linear project

## PR completeness
- [x] Linear issue linked — ENG-356
- [x] Context/what-built/how-to-test preparable
- [x] Acceptance criteria listed (below)
- [x] Visual evidence — CDP screenshot: 3 tasks added, middle one removed via UI, other two remain with Remove controls
- [x] Environment variables — None
- [x] Feature flags — None
- [x] Other configuration — None

## Acceptance criteria verification
**Scenario:** Removing a task
- [x] Given the list contains "Buy milk", When I remove it, Then it no longer appears — **verified by:** "removes a task from the list and from storage" test + CDP screenshot.
- [x] Removing a task removes it from the list and from `localStorage` — **verified by:** same test (asserts `loadTasks()` empty).
- [x] Removing one task leaves other tasks (and done states) intact — **verified by:** "removes only the targeted task" test (3 tasks, removes middle, asserts `['a','c']` remain).

**Result:** Pass

## UI verification
No Figma spec. Verified end-to-end in real browser via CDP (added 3, removed middle) + jsdom tests. Remove control is a keyboard-focusable `<button>`.

## Result
**Status:** ✅ Pass
**Failed items:** None
**Notes:** Real-browser remove screenshot captured. Granular commits (2). Suite 32/32.
**Action:** Proceed to delivery-pr.

---
**Synced to Linear:** Pending

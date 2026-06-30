# Delivery Checklist: ENG-358 — [feature] Toggle task done/not-done interaction

**Linear:** https://linear.app/rotate/issue/ENG-358
**Branch:** feature/eng-358
**Date:** 2026-06-30
**Run:** Pre-PR (round trip 1 of max 3)

> Every item must pass before the PR is raised. Return to delivery-build for any failure.

---

## Code quality
- [x] Linting — N/A (no linter)
- [x] Formatting — N/A (matches style)
- [x] Type checks — N/A (plain JS)
- [x] All tests pass — `npm test` → 40 passed (17 tasks + 23 ui)
- [x] No console errors — build succeeds; CDP app run clean

## Scope
- [x] Only permitted files modified — `src/ui.js`, `test/ui.test.js`, feature README
- [x] No out-of-scope changes — `src/tasks.js`, `src/main.js`, `index.html`, config untouched
- [x] Contracts satisfied — consumes `toggleTask`/`saveTasks`; no new exported signatures; `renderTasks` markup unchanged (checkbox already existed); delegated `change` handler added
- [x] No new patterns — same pure-op → persist → re-render; event delegation on root

## Implementation standards
- [x] Functional and composable — handler reads id, calls pure `toggleTask`, persists, re-renders
- [x] Container/presentation separation — `renderTasks` unchanged (renders the checkbox); wiring lives in `mountApp`
- [x] No unnecessary comments
- [x] Human readable
- [x] Established codebase patterns followed — `change` event for checkbox; delegation consistent with `.remove`/`.task-text` handlers
- [x] No premature abstraction — one delegated listener

## TDD
- [x] Tests written before implementation — 3 toggle tests ran **red** before the handler; then green
- [x] Tests cover all acceptance criteria — not-done→done, done→not-done, only-targeted-task; persistence asserted via `loadTasks`
- [x] Tests readable/self-documenting

## Feature documentation
- [x] `docs/todo-list/features/todo-list/README.md` updated — Toggle marked implemented; **status → Complete**; limitations trimmed; change history updated
- [x] Accurately reflects what was built
- [x] Synced to Linear project

## PR completeness
- [x] Linear issue linked — ENG-358
- [x] Context/what-built/how-to-test preparable
- [x] Acceptance criteria listed (below)
- [x] Visual evidence — CDP screenshot: 3 tasks, "Call Sam" toggled done (checkbox checked); also shows the complete feature
- [x] Environment variables — None
- [x] Feature flags — None
- [x] Other configuration — None

## Acceptance criteria verification
**Scenario:** Marking a not-done task as done
- [x] Given a not-done "Buy milk", When toggled, Then shown done — **verified by:** "marks a not-done task as done" test (`done` class + `loadTasks().done === true`) + CDP screenshot.

**Scenario:** Marking a done task as not-done
- [x] Given a done "Buy milk", When toggled, Then shown not-done — **verified by:** "marks a done task as not-done" test.

- [x] Toggling flips only the targeted task's done state, both directions — **verified by:** both-direction tests + "toggles only the targeted task" test (2 tasks).
- [x] The toggled state persists across reload — **verified by:** `loadTasks()` assertions post-toggle.

**Result:** Pass

## UI verification
No Figma spec. Verified end-to-end in real browser via CDP (toggled a task done) + jsdom tests (both directions, only-targeted). Toggle is a native checkbox — keyboard-operable.

## Result
**Status:** ✅ Pass
**Failed items:** None
**Notes:** Final task — all five actions complete. Real-browser toggle screenshot captured. Granular commits (2). Suite 40/40.
**Action:** Proceed to delivery-pr.

---
**Synced to Linear:** Pending

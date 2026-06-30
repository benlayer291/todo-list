# Delivery Checklist: ENG-357 — [feature] Edit task text interaction

**Linear:** https://linear.app/rotate/issue/ENG-357
**Branch:** feature/eng-357
**Date:** 2026-06-30
**Run:** Pre-PR (round trip 1 of max 3)

> Every item must pass before the PR is raised. Return to delivery-build for any failure.

---

## Code quality
- [x] Linting — N/A (no linter)
- [x] Formatting — N/A (matches style)
- [x] Type checks — N/A (plain JS)
- [x] All tests pass — `npm test` → 37 passed (17 tasks + 20 ui)
- [x] No console errors — build succeeds; CDP app run clean

## Scope
- [x] Only permitted files modified — `src/ui.js`, `test/ui.test.js`, feature README
- [x] No out-of-scope changes — `src/tasks.js`, `src/main.js`, `index.html`, config untouched
- [x] Contracts satisfied — consumes `editTask`/`saveTasks`; no new exported signatures; `renderTasks` markup unchanged (transient edit input owned by container)
- [x] No new patterns — same pure-op → persist → re-render; delegation on root

## Implementation standards
- [x] Functional and composable — commit handler reads id+value, calls pure `editTask`, persists, re-renders
- [x] Container/presentation separation — `renderTasks` unchanged (still renders `.task-text` span); the transient `.edit-input` + wiring live in `mountApp`
- [x] No unnecessary comments
- [x] Human readable
- [x] Established codebase patterns followed
- [x] No premature abstraction — simple double-commit guard; no extra layers

## TDD
- [x] Tests written before implementation — 5 edit tests ran **red** before the handler; then green
- [x] Tests cover all acceptance criteria — dblclick→input, commit on blur (in place, no duplicate, done preserved), commit on Enter, empty-commit unchanged, Escape cancels
- [x] Tests readable/self-documenting

## Feature documentation
- [x] Feature README updated — Edit marked implemented; data-flow + change history updated
- [x] Accurately reflects what was built
- [x] Synced to Linear project

## PR completeness
- [x] Linear issue linked — ENG-357
- [x] Context/what-built/how-to-test preparable
- [x] Acceptance criteria listed (below)
- [x] Visual evidence — CDP screenshot: "Buy milk" inline-edited to "Buy oat milk"
- [x] Environment variables — None
- [x] Feature flags — None
- [x] Other configuration — None

## Acceptance criteria verification
**Scenario:** Editing task text
- [x] Given a task "Buy milk", When changed to "Buy oat milk", Then shows new text and no second task — **verified by:** "commits the new text on blur, in place, without duplicating" test (asserts 1 li, new text, persisted) + CDP screenshot.
- [x] Editing updates only the targeted task's text in place — no duplicate, `done` unchanged — **verified by:** same test (seeded `done:true`, asserts `done` preserved).
- [x] Empty committed edit text leaves the task unchanged — **verified by:** "leaves the task unchanged when committed text is empty" test.
- [x] The edit persists across reload — **verified by:** `loadTasks()` assertions post-commit.

(Also: commits on Enter; Escape cancels without changing the task — extra tests.)

**Result:** Pass

## UI verification
No Figma spec. Verified end-to-end in real browser via CDP (double-click → edit → blur commit) + jsdom tests covering blur/Enter/empty/Escape. The edit input is keyboard-operable (Enter commits, Escape cancels).

## Result
**Status:** ✅ Pass
**Failed items:** None
**Notes:** Real-browser edit screenshot captured. Granular commits (2). Suite 37/37.
**Action:** Proceed to delivery-pr.

---
**Synced to Linear:** Pending

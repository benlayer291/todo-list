# Delivery Checklist: ENG-353 — [feature] Task-data module with localStorage persistence

**Linear:** https://linear.app/rotate/issue/ENG-353
**Branch:** feature/eng-353
**Date:** 2026-06-30
**Run:** Pre-PR (round trip 1 of max 3)

> Every item must pass before the PR is raised. Return to delivery-build for any failure.

---

## Code quality

- [x] Linting — N/A: no linter configured (context tooling config).
- [x] Formatting — N/A: no formatter; matches existing 2-space / single-quote / semicolon style.
- [x] Type checks — N/A: plain JavaScript ES modules.
- [x] All tests pass — `npm test` → 20 passed (17 tasks + 3 smoke).
- [x] No console errors or warnings introduced.

---

## Scope

- [x] Only permitted files modified — `git diff --name-only main..HEAD` = `src/tasks.js`, `test/tasks.test.js` (both permitted). `docs/**` changes are this workflow's own artefacts.
- [x] No out-of-scope changes — protected files (index.html, vite.config.js, src/ui.js, src/main.js, ENG-352 files) untouched.
- [x] Contracts satisfied — `STORAGE_KEY`, `loadTasks`, `saveTasks`, `addTask`, `removeTask`, `editTask`, `toggleTask` implemented exactly per context contract.
- [x] No new patterns — immutable map/filter/spread only; no abstraction introduced.

---

## Implementation standards

- [x] Functional and composable — every op is a small pure function; immutable (spread/map/filter), no input mutation (asserted in tests).
- [~] Container/presentation separation — N/A as UI; this is the pure data layer (no DOM), which is the correct side of the split.
- [x] No unnecessary comments — none present.
- [x] Human readable without explanation.
- [x] Established codebase patterns followed — ES modules, test style matches existing.
- [x] No premature abstraction — declined to extract a shared `updateTask` helper for two one-line maps (would add indirection without earning it).

---

## TDD

- [x] Tests written before implementation — verified per round: each concern's tests were added and run **red** before implementing (storage: module-missing red; add/remove: "is not a function" red; edit/toggle: "is not a function" red), then green. Three granular commits each pair tests with their implementation.
- [x] Tests cover all acceptance criteria — 17 tests across persistence, addTask, removeTask, editTask, toggleTask, including immutability and invalid-JSON load.
- [x] Tests are readable and self-documenting.

---

## Feature documentation

- [~] Feature README — N/A for this task by design. `context.output.md` permits only `src/tasks.js` + `test/tasks.test.js` and protects `docs/**`; the feature README is owned by ENG-354 (first user-facing behaviour). This is an internal data module. (Logged for retro.)
- [~] Documentation reflects build — N/A (no feature README this task).
- [~] Synced to Linear — N/A (no feature README this task).

---

## PR completeness

- [x] Linear issue linked — ENG-353.
- [x] Context / what-built / how-to-test sections preparable.
- [x] Acceptance criteria listed with status (below).
- [~] Visual evidence — skip: non-UI logic module.
- [x] Environment variables — None.
- [x] Feature flags — None (greenfield).
- [x] Other configuration — None (no config changed).

---

## Acceptance criteria verification

- [x] addTask non-empty appends `{id,text,done:false}`; empty/whitespace returns array unchanged — **verified by:** `addTask` tests (append, trim, returns-same-reference for empty/whitespace).
- [x] removeTask returns a new array without the matching id — **verified by:** `removeTask` test.
- [x] editTask replaces only matching text, no duplicate, done unchanged; empty text unchanged — **verified by:** `editTask` tests.
- [x] toggleTask flips only matching task's done — **verified by:** `toggleTask` tests (both directions + only-matching).
- [x] No operation mutates its input — **verified by:** dedicated "does not mutate" tests on add/remove/edit/toggle.
- [x] saveTasks→loadTasks round-trips tasks and done states — **verified by:** persistence round-trip test.
- [x] loadTasks returns [] when key absent or invalid JSON — **verified by:** two persistence tests.

**Result:** Pass

---

## UI verification (skip if not a UI task)
Skipped — pure logic module, no UI.

---

## Result

**Status:** ✅ Pass
**Failed items:** None
**Notes:** Feature README correctly deferred to ENG-354 (logged for retro). Granular-commit practice applied per updated guidance (3 commits).
**Action:** Proceed to delivery-pr.

---

**Synced to Linear:** Pending

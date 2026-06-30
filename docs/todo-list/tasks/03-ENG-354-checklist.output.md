# Delivery Checklist: ENG-354 — [feature] Render and view the task list

**Linear:** https://linear.app/rotate/issue/ENG-354
**Branch:** feature/eng-354
**Date:** 2026-06-30
**Run:** Pre-PR (round trip 1 of max 3)

> Every item must pass before the PR is raised. Return to delivery-build for any failure.

---

## Code quality

- [x] Linting — N/A: no linter configured.
- [x] Formatting — N/A: no formatter; matches existing 2-space/single-quote/semicolon style.
- [x] Type checks — N/A: plain JavaScript ES modules.
- [x] All tests pass — `npm test` → 25 passed (17 tasks + 8 ui).
- [x] No console errors or warnings — `npm run build` succeeds (resolves the prior ENG-352 interim caveat now that `src/main.js` exists); dev server serves the shell cleanly.

---

## Scope

- [x] Only permitted files modified — `git diff --name-only main..HEAD`: `src/ui.js` (create), `src/main.js` (create), `test/ui.test.js` (create), `docs/todo-list/features/todo-list/README.md` (create), `test/smoke.test.js` (removed — permitted modify/remove). All permitted.
- [x] No out-of-scope changes — `src/tasks.js`, `index.html`, `vite.config.js`, `test/tasks.test.js`, `test/setup.js` untouched (protected).
- [x] Contracts satisfied — `renderTasks(tasks, root)` and `mountApp(root)` implemented exactly; consumes `loadTasks` from `src/tasks.js`; renders into `#task-list`; each row carries `data-id`.
- [x] No new patterns — full re-render + container/presentation, both specified in context.

---

## Implementation standards

- [x] Functional and composable — `createTaskItem` is a small pure builder; `renderTasks` maps over it; no mutation of inputs.
- [x] Container/presentation separation — `renderTasks` is pure presentation (DOM as a function of tasks, no data loading); `mountApp` is the container (loads data, drives render). Not mixed.
- [x] No unnecessary comments — none.
- [x] Human readable without explanation.
- [x] Established codebase patterns followed — ES modules, jsdom test style, imports `loadTasks` rather than reimplementing storage.
- [x] No premature abstraction — simplest full re-render; text rendered via `textContent` (also safe against HTML injection), no templating layer.

---

## TDD

- [x] Tests written before implementation — `test/ui.test.js` authored and run **red** ("Failed to resolve import ../src/ui.js") before implementing; then green. Render layer committed first with its tests.
- [x] Tests cover all acceptance criteria — text rendering, done-state (class + checkbox), `data-id`, empty list no-throw, re-render replaces content, text-not-HTML, and `mountApp` loads+renders persisted tasks (incl. empty).
- [x] Tests are readable and self-documenting.

---

## Feature documentation

- [x] `docs/todo-list/features/todo-list/README.md` created — documents the feature, architecture, data flow, dependencies, View acceptance criteria, and known limitations.
- [x] Documentation accurately reflects what was built (view layer; add/remove/edit/toggle noted as pending).
- [x] Feature documentation synced to Linear project via Linear MCP (project document "Feature: Todo list").

---

## PR completeness

- [x] Linear issue linked — ENG-354.
- [x] Context / what-built / how-to-test preparable.
- [x] Acceptance criteria listed with status (below).
- [x] Visual evidence — dev server serves the shell with `#task-list` render root; empty-state renders cleanly (no persisted tasks in a fresh browser). Populated rendering (text + done state + data-id) verified by the `renderTasks`/`mountApp` jsdom tests. No Figma spec exists for this project (functionality-focused, minimal styling), so there is no design to screenshot-compare against.
- [x] Environment variables — None.
- [x] Feature flags — None.
- [x] Other configuration — None (no deps/config changed).

---

## Acceptance criteria verification

**Scenario:** List renders existing tasks
- [x] Given stored tasks "Buy milk" (not-done) and "Call Sam" (done) — **verified by:** `renderTasks` tests seed exactly this and assert text + done class/checkbox; `mountApp` test seeds via `saveTasks` and asserts render.
- [x] Then each shown with correct done state — **verified by:** "reflects the done state" test.

**Scenario:** Empty list
- [x] Given no stored tasks, When mounted, Then empty list, no error — **verified by:** "renders an empty list without error" + `mountApp` "renders nothing when there are no persisted tasks".

- [x] Each rendered row carries `data-id` — **verified by:** "tags each row with its task id".

**Result:** Pass

---

## UI verification
No Figma design spec for this project (scope: minimal functional styling). Verified rendered structure/behaviour via jsdom tests and dev-server serve. Markup is semantic (`<ul>`/`<li>`, checkbox + label text), keyboard-reachable controls.

---

## Result

**Status:** ✅ Pass
**Failed items:** None
**Notes:** Build now succeeds (ENG-352 interim caveat resolved). Feature README created and synced. Granular commits (3). Process fix applied this task: re-synced the living QA doc to Linear (missed after ENG-353).
**Action:** Proceed to delivery-pr.

---

**Synced to Linear:** Pending

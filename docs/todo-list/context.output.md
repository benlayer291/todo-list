# Task Context: ENG-354 — [feature] Render and view the task list

**Generated:** 2026-06-30 18:59 UTC
**Task file:** `docs/todo-list/tasks/03-ENG-354-render-and-view.output.md`
**Linear:** https://linear.app/rotate/issue/ENG-354

> This is the sole input file for delivery-build. Read this file only. Do not load any other project files unless explicitly listed in permitted files below.

---

## Task summary
Create the thin DOM/presentation layer that renders tasks from state, plus the bootstrap that loads persisted tasks on startup and paints them. This is **read + render only** — no add/remove/edit/toggle interactions yet (those are ENG-355–358). It serves the **View tasks** user story and establishes the `mountApp` seam later interaction tasks extend, and the per-row `data-id` later tasks bind to.

---

## Acceptance criteria

**Scenario:** List renders existing tasks
```gherkin
Given stored tasks "Buy milk" (not-done) and "Call Sam" (done)
When the app mounts
Then "Buy milk" is shown as not-done and "Call Sam" is shown as done
```
**Scenario:** Empty list
```gherkin
Given no stored tasks
When the app mounts
Then the task list is empty and no error occurs
```

- [ ] Every stored task renders with its text and correct done/not-done state.
- [ ] An empty task list renders cleanly with no error.
- [ ] Each rendered row carries its task id (`data-id`) for later per-row actions.

---

## Contracts
Implement exactly. Do not deviate.
```typescript
// src/ui.js
function renderTasks(tasks: Task[], root: HTMLElement): void;
//   pure render: DOM is a function of tasks. Clears root, appends one <li> per task.
//   Each <li>: shows the task text + a done/not-done indicator, carries data-id="<task.id>".
//   Empty tasks → empty list, no error.
function mountApp(root: HTMLElement): void;
//   loads tasks via loadTasks() and calls renderTasks(tasks, root).
//   Structure so ENG-355–358 can attach event handlers here later.

// Task imported from ./tasks.js: { id: string; text: string; done: boolean }
```

**Existing module to consume (already on `main`, do NOT modify) — `src/tasks.js` exports:**
`STORAGE_KEY`, `loadTasks()`, `saveTasks(tasks)`, `addTask`, `removeTask`, `editTask`, `toggleTask`. For this task only `loadTasks` is needed.

**DOM ids already in `index.html` (from ENG-352, do NOT modify):**
`#new-task-input`, `#add-task-btn`, `#task-list` (the render root).

---

## Examples
**Input:** `renderTasks([{id:'a',text:'Buy milk',done:false},{id:'b',text:'Call Sam',done:true}], ul)`
**Expected output:** `ul` contains two `<li>`s — "Buy milk" not-done, "Call Sam" shown done; each `<li>` has `data-id`.
**Input:** `renderTasks([], ul)` → **Output:** `ul` empty, no error.

---

## Permitted files
- `src/ui.js` — create
- `src/main.js` — create
- `test/ui.test.js` — create
- `docs/todo-list/features/todo-list/README.md` — create (feature documentation)
- `test/smoke.test.js` — modify/remove (the scaffold smoke test may now be removed since real tests exist)

## Protected files
- `src/tasks.js` — consumed read-only; do NOT modify (owned by ENG-353)
- `index.html`, `src/styles.css`, `vite.config.js`, `package.json`, `.gitignore`, `test/setup.js` — owned by ENG-352
- `test/tasks.test.js` — owned by ENG-353
- other `docs/**` artefacts

---

## External references
*Pre-verified.*

| System | Documentation URL | MCP |
|--------|------------------|-----|
| jsdom (test DOM) | https://github.com/jsdom/jsdom | — |
| Vitest | https://vitest.dev/guide/environment | — |

**jsdom/Vitest (verified):** tests run under the jsdom environment; `document`, element creation, and `localStorage` are all available. `test/setup.js` clears `localStorage` before each test. Build a `<ul>` (or use a jsdom-created element) as the render root in tests.

---

## Codebase conventions
No convention files found. Apply established patterns + workflow standards.

---

## Codebase patterns
Established by ENG-352/353 (on `main`):
**Naming:** lowercase files, ES modules, camelCase functions.
**File structure:** app in `src/`, tests in `test/*.test.js`.
**Test style:** Vitest `describe`/`it`/`expect`, jsdom env, `test/setup.js` clears localStorage per test.
**Data layer:** `src/tasks.js` is the pure data module — import `loadTasks` from it; never reimplement storage here.
**Component pattern (apply here):** container/presentation separation —
  - `renderTasks` is **presentation**: pure function of `(tasks, root) → DOM`, no state, no data loading.
  - `mountApp` is the **container**: loads data (`loadTasks`) and drives rendering; it is the seam where later tasks add event handlers.
**Full re-render pattern (from approach):** render by clearing the root and rebuilding from the task array — no surgical DOM diffing.

---

## Tooling config
**Linting/Formatting/TypeScript:** none configured. Match existing 2-space, single-quote, semicolon JS style.
**Test runner:** `npm test` → `vitest run`, jsdom env, `test/setup.js` clears localStorage per test.

---

## Feature flag
**Flag name:** None
**Default state:** None *(greenfield)*

---

## Figma spec
No Figma design provided for this project (scope: minimal functional styling, functionality over polish). Render semantic, accessible markup (`<li>` per task; done state conveyed via a control/indicator and a state class or attribute). No pixel spec to match.

---

## Conflict check
**Status:** Clear
**Details:** Only `todo-list` is active. ENG-354's permitted files are owned solely by this issue. `src/ui.js`/`src/main.js`/`test/ui.test.js`/feature README are created here and (for ui.js/ui.test.js/README) extended by ENG-355–358 in sequence — serialized via blockedBy, so no concurrent writer.

---

## TDD reminder
Tests before implementation. Write `test/ui.test.js` first: render a known task array into a root element and assert the `<li>` text, done-state indicator, and `data-id`; assert empty array renders an empty root with no throw; assert `mountApp` paints persisted tasks (seed via `saveTasks`/`localStorage`, then mount). Confirm red, implement, refactor.

---

## Implementation standards reminder
- Human readable — rewrite if a comment is needed to understand it
- Follow established patterns above — never introduce a new pattern
- Functional and composable — `renderTasks` pure; small helpers if needed
- Container/presentation separation — `renderTasks` presentation, `mountApp` container; never mix
- No unnecessary comments
- As simple as possible — full re-render, no premature abstraction

---

## Feature documentation (in scope this task)
Create `docs/todo-list/features/todo-list/README.md` from the feature template. Document: what the todo feature is, the five actions (note add/remove/edit/toggle land in ENG-355–358), localStorage persistence, and how to run/test. It will be updated by each later interaction task.

---

## Commit granularity (process note)
Commit in meaningful steps (e.g. (1) failing render tests, (2) `renderTasks`, (3) `mountApp` + `main.js` bootstrap, (4) feature README). Each commit message ends with the Co-Authored-By trailer. Checklist file will be named `03-ENG-354-checklist.output.md`.

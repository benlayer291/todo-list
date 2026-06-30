# Task Context: ENG-355 — [feature] Add task interaction

**Generated:** 2026-06-30 19:17 UTC
**Task file:** `docs/todo-list/tasks/04-ENG-355-add-task.output.md`
**Linear:** https://linear.app/rotate/issue/ENG-355

> This is the sole input file for delivery-build. Read this file only. Do not load any other project files unless explicitly listed in permitted files below.

---

## Task summary
Wire the add-task form to the already-built pure `addTask` operation so a user can create tasks from the UI. On submit: read the input, call `addTask(currentTasks, value)`, persist via `saveTasks`, re-render, and clear the input. Empty/whitespace input adds nothing (delegated to `addTask` — the handler does not re-validate). Builds on `mountApp` from ENG-354 and `src/tasks.js` from ENG-353. Serves the **Add a task** user story.

---

## Acceptance criteria

**Scenario:** Adding a task
```gherkin
Given the task list is empty
When I enter "Buy milk" and add it
Then "Buy milk" appears in the list in the not-done state
```
**Scenario:** Empty input is rejected
```gherkin
Given the add input is empty or whitespace
When I attempt to add
Then no task is added
```

- [ ] Adding non-empty text creates a not-done task and clears the input.
- [ ] Adding empty/whitespace adds nothing.
- [ ] The added task persists across a re-mount/reload.

---

## Contracts
Consume existing exports — introduce **no** new exported signatures.
```typescript
import { addTask, saveTasks } from './tasks.js';  // already on main (ENG-353)
// Extend mountApp(root) to wire the add form. Public signatures unchanged:
//   renderTasks(tasks, root): void   (unchanged)
//   mountApp(root): void             (now also wires the add form)
```

**Wiring behaviour (in `mountApp`):**
- Maintain the current task list in the mount scope (the pure ops return new arrays; reassign the local).
- On add-form submit: `preventDefault()`, read `#new-task-input` value, compute `next = addTask(tasks, value)`.
  - If `next !== tasks` (a task was added): `tasks = next`, `saveTasks(tasks)`, `renderTasks(tasks, root)`, clear the input.
  - If unchanged (empty/whitespace): do nothing (no task, input left as the user typed).

**Existing DOM (in `index.html`, from ENG-352 — do NOT modify):**
`#add-task-form` (a `<form>`), `#new-task-input` (text input), `#add-task-btn` (`type="submit"`), `#task-list` (render root). Using the form's `submit` event covers both the button click and Enter.

**Existing `src/ui.js` (on main, from ENG-354 — the file you modify):**
- `renderTasks(tasks, root)` — pure: clears root, one `<li data-id>` per task (checkbox reflects done, `done` class, text via `textContent`).
- `mountApp(root)` — currently: `renderTasks(loadTasks(), root)`. Extend it to hold state and wire the add form (locate the form via `document.querySelector('#add-task-form')` / `#new-task-input`). `src/main.js` (protected) already calls `mountApp(document.querySelector('#task-list'))` on `DOMContentLoaded` — do not change it.

---

## Examples
**Input:** type "Buy milk", submit → **Output:** a not-done "Buy milk" `<li>` appears; input cleared; `localStorage['todo-list.tasks']` contains it.
**Input:** type "   " (whitespace), submit → **Output:** no `<li>` added; list unchanged.

---

## Permitted files
- `src/ui.js` — modify (extend `mountApp` to wire the add form)
- `test/ui.test.js` — modify (add interaction tests; update `mountApp` test setup to include the add-form shell)
- `docs/todo-list/features/todo-list/README.md` — modify (mark Add implemented)

## Protected files
- `src/tasks.js` — consumed read-only; do NOT modify (ENG-353)
- `src/main.js` — owned by ENG-354; should NOT need changes
- `index.html`, `src/styles.css`, `vite.config.js`, `package.json`, `.gitignore`, `test/setup.js` — owned by ENG-352
- `test/tasks.test.js` — owned by ENG-353
- other `docs/**`

---

## External references

| System | Documentation URL | MCP |
|--------|------------------|-----|
| jsdom (test DOM) | https://github.com/jsdom/jsdom | — |

**jsdom (verified):** form/input elements, `submit` events, and `localStorage` all work under the jsdom test env. Tests can build the shell via `document.body.innerHTML`, dispatch a `submit` (or click the submit button / call `form.requestSubmit()`), and assert on the rendered list + `localStorage`.

---

## Codebase conventions
No convention files found. Apply established patterns + workflow standards.

---

## Codebase patterns
On `main` (ENG-352–354):
**Data layer:** `src/tasks.js` — pure ops + persistence. Import `addTask`, `saveTasks`; never reimplement them.
**UI layer:** `src/ui.js` — `renderTasks` (presentation, pure) + `mountApp` (container: state + load + render, now + event wiring). Keep this split: the handler computes new state via a pure op, persists, and re-renders (full re-render). Validation stays in `addTask`, not the handler.
**Test style:** Vitest + jsdom; `test/setup.js` clears `localStorage` per test. Existing `test/ui.test.js` builds DOM nodes directly. For the now-form-wiring `mountApp`, give tests the shell (form + `#task-list`) so `mountApp` can find the form — and clear `document.body` between tests to avoid duplicate ids.
**DOM contract:** rows carry `data-id`; done shown via checkbox + `done` class.

---

## Tooling config
**Linting/Formatting/TypeScript:** none. Match existing 2-space/single-quote/semicolon JS.
**Test runner:** `npm test` → `vitest run`, jsdom env, `test/setup.js` clears localStorage per test.

---

## Feature flag
**Flag name:** None **Default state:** None *(greenfield)*

---

## Figma spec
No Figma design. Functional behaviour only; reuse the existing shell markup.

---

## Conflict check
**Status:** Clear
**Details:** Only `todo-list` is active. ENG-355 modifies `src/ui.js`/`test/ui.test.js`/feature README — created by ENG-354, now extended by ENG-355; serialized via the blockedBy chain (ENG-356–358 follow), so no concurrent writer. `src/tasks.js` and `src/main.js` are protected here.

---

## TDD reminder
Tests before implementation. Add to `test/ui.test.js`: build the shell DOM (add form + `#task-list`), `mountApp(root)`, then dispatch the add (set input value + submit) and assert the new `<li>` appears not-done, the input is cleared, and `localStorage` contains the task; and that empty/whitespace input adds nothing. **Also update the existing `mountApp` tests** to include the add-form shell (since `mountApp` now wires it) and clear `document.body` between tests. Confirm red, implement, refactor. Keep the full suite green (no regression to `renderTasks` tests).

---

## Implementation standards reminder
- Human readable — rewrite if a comment is needed
- Follow established patterns — pure op → persist → re-render
- Functional/composable — validation lives in `addTask`, not the handler
- Container/presentation separation — `renderTasks` stays pure; wiring lives in `mountApp`
- No unnecessary comments
- As simple as possible — full re-render, no premature abstraction
- Scope: only call exported `tasks.js` ops; do not reach into internals

---

## Commit granularity (process note)
Commit in meaningful steps, e.g. (1) failing add-interaction tests + `mountApp` test-setup update, (2) implement the add wiring, (3) feature README update. Co-Authored-By trailer on each. Checklist file: `04-ENG-355-checklist.output.md`.

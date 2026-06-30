# Task Context: ENG-358 — [feature] Toggle task done/not-done interaction

**Generated:** 2026-06-30 19:48 UTC
**Task file:** `docs/todo-list/tasks/07-ENG-358-toggle-task.output.md`
**Linear:** https://linear.app/rotate/issue/ENG-358

> This is the sole input file for delivery-build. Read this file only. Do not load any other project files unless explicitly listed in permitted files below.

---

## Task summary
Make the per-row done checkbox interactive, wired to the already-built pure `toggleTask`. On changing a row's `.toggle` checkbox: read the row's `data-id`, call `toggleTask(currentTasks, id)`, persist via `saveTasks`, and re-render. This is the **last of the five actions** — completing the feature. Serves the **Toggle done/not-done** user story.

---

## Acceptance criteria

**Scenario:** Marking a not-done task as done
```gherkin
Given a not-done task "Buy milk"
When I toggle it
Then it is shown as done
```
**Scenario:** Marking a done task as not-done
```gherkin
Given a done task "Buy milk"
When I toggle it
Then it is shown as not-done
```

- [ ] Toggling flips only the targeted task's done state, both directions.
- [ ] The toggled state persists across reload.

---

## Contracts
Consume existing exports — introduce **no** new exported signatures.
```typescript
import { toggleTask, saveTasks } from './tasks.js';  // already on main (ENG-353)
// renderTasks already renders <input type="checkbox" class="toggle" checked={done}> per row.
// mountApp(root): now also handles toggle changes (public signature unchanged).
```

**Design (keep container/presentation split):**
- `renderTasks` (presentation): **unchanged** — already renders the `.toggle` checkbox reflecting `done`. No markup change needed (the checkbox exists since ENG-354).
- `mountApp` (container): wire toggling via a delegated `change` listener on the persistent `root`. On a `change` whose target matches `.toggle`: find the enclosing `<li>`, read its `data-id`, `tasks = toggleTask(tasks, id)`, `saveTasks(tasks)`, `renderTasks(tasks, root)`.

Use the `change` event (the standard checkbox event) and event delegation on `root` (one listener, survives full re-renders), consistent with the existing delegated `.remove` click and `.task-text` dblclick handlers.

**Existing `src/ui.js` (on main — the file you modify):**
- `renderTasks(tasks, root)` — builds `<li data-id class="task[ done]">` with `.toggle` checkbox (`checked` = done) + `.task-text` span + `.remove` button. No change.
- `mountApp(root)` — already loads/renders and wires add `submit`, delegated `.remove` `click`, and `.task-text` `dblclick`. Add the delegated `.toggle` `change` handling here. `src/main.js` (protected) calls `mountApp(#task-list)`.

---

## Examples
**Input:** not-done "Buy milk"; check its `.toggle` → **Output:** shown done (`done` class + checkbox checked); persisted.
**Input:** done "Buy milk"; uncheck its `.toggle` → **Output:** shown not-done; persisted.

---

## Permitted files
- `src/ui.js` — modify (delegated `.toggle` `change` handler in `mountApp`)
- `test/ui.test.js` — modify (add toggle-interaction tests)
- `docs/todo-list/features/todo-list/README.md` — modify (mark Toggle implemented; feature complete)

## Protected files
- `src/tasks.js` — read-only (ENG-353)
- `src/main.js` — owned by ENG-354
- `index.html`, `src/styles.css`, `vite.config.js`, `package.json`, `.gitignore`, `test/setup.js` — owned by ENG-352
- `test/tasks.test.js` — owned by ENG-353
- other `docs/**`

---

## External references

| System | Documentation URL | MCP |
|--------|------------------|-----|
| jsdom (test DOM) | https://github.com/jsdom/jsdom | — |

**jsdom (verified):** checkbox `.checked` is settable and `change` events can be dispatched. Tests can set `checkbox.checked = !checkbox.checked` then dispatch a bubbling `change` event (or call `.click()`, which toggles `checked` and fires `change`), and assert the rendered done state + `localStorage`.

---

## Codebase conventions
No convention files found. Apply established patterns + workflow standards.

---

## Codebase patterns
On `main` (ENG-352–357):
**Data layer:** `src/tasks.js` — import `toggleTask`, `saveTasks`; never reimplement.
**UI layer:** `renderTasks` pure presentation (markup incl. the `.toggle` checkbox); `mountApp` container (state + load + render + all event wiring). Existing delegated handlers: add `submit`, `.remove` `click`, `.task-text` `dblclick`. Add a `.toggle` `change` handler in the same style.
**State + loop:** `mountApp` holds `tasks` in scope; each action: pure op → persist → full re-render. Toggle always changes the matching task.
**Tests:** Vitest + jsdom; `makeShell()` builds the shell; `document.body` cleared between tests; seed via `saveTasks` then `mountApp`.

---

## Tooling config
**Linting/Formatting/TypeScript:** none. Match existing 2-space/single-quote/semicolon JS.
**Test runner:** `npm test` → `vitest run`, jsdom env.

---

## Feature flag
**Flag name:** None **Default state:** None *(greenfield)*

---

## Figma spec
No Figma design. Functional toggle behaviour only.

---

## Conflict check
**Status:** Clear
**Details:** Only `todo-list` active. ENG-358 is the **last** issue in the serialized chain (blockedBy ENG-357, now merged). It modifies `src/ui.js`/`test/ui.test.js`/feature README; no concurrent writer. `src/tasks.js`/`src/main.js` protected.

---

## TDD reminder
Tests before implementation. Add to `test/ui.test.js`: seed a not-done task, `mountApp`, toggle its `.toggle` checkbox (set `checked` + dispatch `change`, or `.click()`), assert it is shown done (`done` class) and persisted; then a done task → not-done; and that toggling one of several flips only the targeted task. Confirm red, implement, refactor. Keep the full suite green (no regression to view/add/remove/edit tests).

---

## Implementation standards reminder
- Human readable — rewrite if a comment is needed
- Follow established patterns — pure op → persist → re-render; delegation on root; `change` event for the checkbox
- Functional/composable — handler reads id, calls `toggleTask`, persists, re-renders
- Container/presentation separation — `renderTasks` unchanged; wiring in `mountApp`
- No unnecessary comments
- As simple as possible — one delegated `change` listener; no premature abstraction
- Scope: only call exported `tasks.js` ops

---

## Commit granularity (process note)
Commit in meaningful steps, e.g. (1) failing toggle tests, (2) implement the delegated toggle handler, (3) feature README update (feature complete). Co-Authored-By trailer on each. Checklist file: `07-ENG-358-checklist.output.md`.

## Note — feature complete after this task
This is the final action. After ENG-358 merges, all five actions (view/add/remove/edit/toggle) + persistence are delivered, so the feature README status should move to **Complete** and project-level QA / retro follow.

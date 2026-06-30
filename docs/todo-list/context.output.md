# Task Context: ENG-356 — [feature] Remove task interaction

**Generated:** 2026-06-30 19:29 UTC
**Task file:** `docs/todo-list/tasks/05-ENG-356-remove-task.output.md`
**Linear:** https://linear.app/rotate/issue/ENG-356

> This is the sole input file for delivery-build. Read this file only. Do not load any other project files unless explicitly listed in permitted files below.

---

## Task summary
Add a per-row remove control wired to the already-built pure `removeTask` operation, so a user can delete a task. On clicking a row's remove control: read the row's `data-id`, call `removeTask(currentTasks, id)`, persist via `saveTasks`, and re-render. Serves the **Remove a task** user story. Builds on `mountApp`/`renderTasks` (ENG-354/355) and `src/tasks.js` (ENG-353).

---

## Acceptance criteria

**Scenario:** Removing a task
```gherkin
Given the list contains "Buy milk"
When I remove it
Then "Buy milk" no longer appears in the list
```

- [ ] Removing a task removes it from the list and from `localStorage`.
- [ ] Removing one task leaves other tasks (and their done states) intact.

---

## Contracts
Consume existing exports — introduce **no** new exported signatures.
```typescript
import { removeTask, saveTasks } from './tasks.js';  // already on main (ENG-353)
// renderTasks(tasks, root): now also renders a remove control per <li>
// mountApp(root): now also handles remove clicks (public signatures unchanged)
```

**Design (keep container/presentation split):**
- `renderTasks` (presentation): each `<li>` gains a remove control — a `<button class="remove" type="button">` (e.g. label "Remove" or "×"). Still pure: it only builds DOM, wires no events. The `<li>` already carries `data-id`.
- `mountApp` (container): wire removal via **event delegation on the persistent `root`** (one listener, survives re-renders). On a click whose target is (or is within) a `.remove` button: find the enclosing `<li>`, read its `dataset.id`, `tasks = removeTask(tasks, id)`, `saveTasks(tasks)`, `renderTasks(tasks, root)`.

Delegation is preferred over per-button listeners because `renderTasks` fully replaces the row nodes on every render; a single delegated listener on `root` (attached once in `mountApp`) avoids re-binding.

**Existing `src/ui.js` (on main — the file you modify):**
- `renderTasks(tasks, root)` — builds `<li class="task[ done]" data-id>` with a `.toggle` checkbox + `.task-text` span. Add the `.remove` button here.
- `mountApp(root)` — loads tasks, renders, and wires the add form's `submit`. Add a delegated `click` listener on `root` for removal here. `src/main.js` (protected) calls `mountApp(#task-list)`.

---

## Examples
**Input:** list has "Buy milk" + "Call Sam"; click Remove on "Buy milk" → **Output:** only "Call Sam" remains in the list and in `localStorage`.

---

## Permitted files
- `src/ui.js` — modify (remove control in `renderTasks` + delegated remove handler in `mountApp`)
- `test/ui.test.js` — modify (add remove-interaction tests)
- `docs/todo-list/features/todo-list/README.md` — modify (mark Remove implemented)

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

**jsdom (verified):** click events bubble; a `click` listener on `root` receives events from child buttons. Tests can `querySelector` a row's `.remove` button and call `.click()` (or dispatch a bubbling click) and assert the list + `localStorage`.

---

## Codebase conventions
No convention files found. Apply established patterns + workflow standards.

---

## Codebase patterns
On `main` (ENG-352–355):
**Data layer:** `src/tasks.js` — import `removeTask`, `saveTasks`; never reimplement.
**UI layer:** `renderTasks` pure presentation (builds rows); `mountApp` container (state + load + render + event wiring). The add handler already follows: pure op → if changed: persist → re-render. Remove follows the same loop (removal always changes the list when the id exists).
**Rows:** `<li data-id>` with `.toggle` checkbox + `.task-text`. Add `.remove` button.
**Tests:** Vitest + jsdom; `test/setup.js` clears localStorage per test; `test/ui.test.js` builds the shell via `makeShell()` and clears `document.body` between tests. Reuse those helpers.

---

## Tooling config
**Linting/Formatting/TypeScript:** none. Match existing 2-space/single-quote/semicolon JS.
**Test runner:** `npm test` → `vitest run`, jsdom env.

---

## Feature flag
**Flag name:** None **Default state:** None *(greenfield)*

---

## Figma spec
No Figma design. Functional behaviour only.

---

## Conflict check
**Status:** Clear
**Details:** Only `todo-list` active. ENG-356 modifies `src/ui.js`/`test/ui.test.js`/feature README — serialized after ENG-355 via the blockedBy chain (ENG-357–358 follow). `src/tasks.js`/`src/main.js` protected.

---

## TDD reminder
Tests before implementation. Add to `test/ui.test.js`: build the shell, `mountApp`, add a task (or seed via `saveTasks` then mount), click the row's `.remove` button, assert the row is gone from the list and from `localStorage`, and that removing one of several leaves the rest (with done states) intact. Confirm red, implement, refactor. Keep the full suite green.

---

## Implementation standards reminder
- Human readable — rewrite if a comment is needed
- Follow established patterns — pure op → persist → re-render; delegation on root
- Functional/composable — handler reads id, calls `removeTask`, persists, re-renders
- Container/presentation separation — `renderTasks` stays pure (markup only); wiring in `mountApp`
- No unnecessary comments
- As simple as possible — one delegated listener, no per-button binding
- Scope: only call exported `tasks.js` ops

---

## Commit granularity (process note)
Commit in meaningful steps, e.g. (1) failing remove tests, (2) implement remove control + delegated handler, (3) feature README update. Co-Authored-By trailer on each. Checklist file: `05-ENG-356-checklist.output.md`.

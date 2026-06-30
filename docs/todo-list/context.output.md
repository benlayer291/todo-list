# Task Context: ENG-357 — [feature] Edit task text interaction

**Generated:** 2026-06-30 19:36 UTC
**Task file:** `docs/todo-list/tasks/06-ENG-357-edit-task.output.md`
**Linear:** https://linear.app/rotate/issue/ENG-357

> This is the sole input file for delivery-build. Read this file only. Do not load any other project files unless explicitly listed in permitted files below.

---

## Task summary
Let a user change a task's text inline, wired to the already-built pure `editTask`. Double-click a task's text → it becomes an editable input → on commit, call `editTask(currentTasks, id, newText)`, persist, re-render. Empty/whitespace committed text leaves the task unchanged (delegated to `editTask`); `done` is untouched; no duplicate row. Serves the **Edit a task's text** user story.

---

## Acceptance criteria

**Scenario:** Editing task text
```gherkin
Given the list contains a task "Buy milk"
When I change its text to "Buy oat milk"
Then the task shows "Buy oat milk" and no second task is created
```

- [ ] Editing updates only the targeted task's text in place — no duplicate, `done` unchanged.
- [ ] Empty committed edit text leaves the task unchanged.
- [ ] The edit persists across reload.

---

## Contracts
Consume existing exports — introduce **no** new exported signatures.
```typescript
import { editTask, saveTasks } from './tasks.js';  // already on main (ENG-353)
// renderTasks(tasks, root): unchanged (still renders the text in a .task-text span)
// mountApp(root): now also handles inline editing (public signature unchanged)
```

**Design (keep container/presentation split):**
- `renderTasks` (presentation): **unchanged** — keeps rendering the text in `<span class="task-text">`. Do not turn it into a permanent input (that would regress the View story's span/textContent contract and tests). Editing is a transient interaction the container manages.
- `mountApp` (container): wire editing via a delegated `dblclick` on the persistent `root`. On `dblclick` of a `.task-text`:
  - Read the enclosing `<li>`'s `data-id`.
  - Replace the span with an `<input class="edit-input">` pre-filled with the current text; focus it.
  - **Commit** on `blur` or Enter: `tasks = editTask(tasks, id, input.value)`, `saveTasks(tasks)`, `renderTasks(tasks, root)` (which restores spans). Guard against double-commit (Enter → `blur`).
  - **Cancel** on Escape: just re-render from current state (no edit applied). Guard so the subsequent blur does not re-commit.
  - Empty/whitespace input is handled by `editTask` (returns the list unchanged) — the handler does not re-validate.

**Existing `src/ui.js` (on main — the file you modify):**
- `renderTasks(tasks, root)` — builds `<li data-id class="task[ done]">` with `.toggle` checkbox + `.task-text` span + `.remove` button. Leave its markup as-is.
- `mountApp(root)` — already loads/renders and wires the add `submit` and a delegated `.remove` click. Add the delegated `dblclick` edit handling here. `src/main.js` (protected) calls `mountApp(#task-list)`.

---

## Examples
**Input:** double-click "Buy milk", change to "Buy oat milk", commit → **Output:** row shows "Buy oat milk"; no duplicate; `done` unchanged; persisted.
**Input:** double-click "Buy milk", clear to "", commit → **Output:** text unchanged ("Buy milk").

---

## Permitted files
- `src/ui.js` — modify (delegated `dblclick` inline-edit handling in `mountApp`)
- `test/ui.test.js` — modify (add edit-interaction tests)
- `docs/todo-list/features/todo-list/README.md` — modify (mark Edit implemented)

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

**jsdom (verified):** supports `dblclick` and `keydown` events, element `focus()`/`blur()`, and `replaceWith`. Tests can dispatch a bubbling `dblclick` on a `.task-text`, set the resulting `.edit-input` value, then commit by dispatching a `blur` event (or an Enter `keydown`), and assert the rendered text + `localStorage` + that the task count is unchanged (no duplicate).

---

## Codebase conventions
No convention files found. Apply established patterns + workflow standards.

---

## Codebase patterns
On `main` (ENG-352–356):
**Data layer:** `src/tasks.js` — import `editTask`, `saveTasks`; never reimplement.
**UI layer:** `renderTasks` pure presentation (markup only); `mountApp` container (state + load + render + all event wiring). Existing wiring: add `submit`, delegated `.remove` `click`. Edit follows the same container-owns-interaction approach; the transient `<input>` swap is created by the handler, not by `renderTasks`.
**State + loop:** `mountApp` holds `tasks` in scope; each committed action does pure-op → persist → full re-render. Validation lives in the pure op (`editTask` rejects empty), not the handler.
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
No Figma design. Functional inline-edit behaviour only.

---

## Conflict check
**Status:** Clear
**Details:** Only `todo-list` active. ENG-357 modifies `src/ui.js`/`test/ui.test.js`/feature README — serialized after ENG-356 via the blockedBy chain (ENG-358 follows). `src/tasks.js`/`src/main.js` protected.

---

## TDD reminder
Tests before implementation. Add to `test/ui.test.js`: seed a task, `mountApp`, dispatch `dblclick` on its `.task-text`, set `.edit-input` value, commit (blur or Enter), assert: the row text updated, exactly one task remains (no duplicate), `done` unchanged, and `localStorage` reflects the new text; and that an empty commit leaves the text unchanged. Confirm red, implement, refactor. Keep the full suite green (no regression to view/add/remove tests).

---

## Implementation standards reminder
- Human readable — rewrite if a comment is needed
- Follow established patterns — pure op → persist → re-render; delegation on root
- Functional/composable — commit handler reads id+value, calls `editTask`, persists, re-renders
- Container/presentation separation — `renderTasks` stays pure (span unchanged); transient edit input + wiring live in `mountApp`
- No unnecessary comments
- As simple as possible — guard double-commit simply; no premature abstraction
- Scope: only call exported `tasks.js` ops

---

## Commit granularity (process note)
Commit in meaningful steps, e.g. (1) failing edit tests, (2) implement inline-edit handler, (3) feature README update. Co-Authored-By trailer on each. Checklist file: `06-ENG-357-checklist.output.md`.

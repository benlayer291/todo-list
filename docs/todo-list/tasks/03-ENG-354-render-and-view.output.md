# ENG-354: [feature] Render and view the task list

**Type:** `feature`
**Linear:** https://linear.app/rotate/issue/ENG-354
**Project:** https://linear.app/rotate/project/todo-list-737f7d905efa
**Estimate:** 3 points — 2 new source files + first jsdom DOM tests + feature README; render + bootstrap, no unknowns.
**Position:** 3 of 7
**Blocked by:** ENG-353 (needs `loadTasks`)

---

## Context
Serves the **View tasks** user story. Creates the thin DOM/presentation layer that renders tasks from state, plus the bootstrap that loads persisted tasks on startup and paints them. No mutation interactions yet (add/remove/edit/toggle are issues 4–5) — this issue is read + render only.

## Description
Create `src/ui.js` and `src/main.js`.
- `renderTasks(tasks, root)` — pure render: clears `root` and appends one `<li>` per task showing the task text and a visual done/not-done indicator (e.g. a disabled-looking checkbox or a `done` CSS class). Each `<li>` carries its task id (e.g. `data-id`) so later issues can wire per-row actions. Empty `tasks` renders an empty list, no error.
- `mountApp(root)` — loads tasks via `loadTasks()` and calls `renderTasks`. (Event wiring for mutations is added in issues 4–5; structure `mountApp` so handlers can be added there.)
- `src/main.js` — bootstrap: import `mountApp`, call it with `#task-list` on `DOMContentLoaded`.

Write `test/ui.test.js` first (TDD), using the jsdom environment to assert rendered output.

---

## Contracts
```typescript
function renderTasks(tasks: Task[], root: HTMLElement): void; // pure: DOM is a function of tasks
function mountApp(root: HTMLElement): void;                   // load → render (+ wiring later)
// Task imported from ./tasks.js: { id: string; text: string; done: boolean }
// Each rendered <li> exposes data-id="<task.id>" and a done indicator.
```

---

## Examples
**Input:** `renderTasks([{id:'a',text:'Buy milk',done:false},{id:'b',text:'Call Sam',done:true}], ul)`
**Expected output:** `ul` contains two `<li>`s: "Buy milk" not-done, "Call Sam" shown done; each `<li>` has `data-id`.

**Input:** `renderTasks([], ul)`
**Expected output:** `ul` is empty, no error thrown.

---

## Permitted files
- `src/ui.js` — create — DOM render + mount (presentation layer)
- `src/main.js` — create — bootstrap
- `test/ui.test.js` — create — jsdom render tests
- `docs/todo-list/features/todo-list/README.md` — create — feature documentation
- `test/smoke.test.js` — modify/remove — may delete the scaffold smoke test now that real tests exist

## Protected files
- `src/tasks.js` — consumed read-only; do NOT modify (owned by issue 2)
- `index.html`, `src/styles.css`, `vite.config.js`, `package.json` — owned by ENG-352; do not modify
- `test/tasks.test.js` — owned by issue 2
- other `docs/**` artefacts

## External references
| System | Documentation URL | MCP |
|--------|------------------|-----|
| jsdom (test DOM) | https://github.com/jsdom/jsdom | — |
| Vitest | https://vitest.dev/guide/environment | — |

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
- [ ] Empty task list renders cleanly with no error.
- [ ] Each rendered row carries its task id for later per-row actions.

---

## Feature flag
**Flag name:** None **Default state:** None *(greenfield)*

---

## Feature documentation
**Create or update:** `docs/todo-list/features/todo-list/README.md`
**Action:** Create — document the todo feature: what it is, the five actions (note add/remove/edit/toggle land in issues 4–7), persistence via localStorage, and how to run/test. Update incrementally in later issues.

---

## TDD requirement
Tests before implementation. Test file: `test/ui.test.js`. Write failing jsdom render assertions, then implement `src/ui.js` + `src/main.js`.

---

## Notes
Full re-render pattern (no surgical DOM diffing) per approach.output.md. Keep `renderTasks` pure — no state ownership. `mountApp` is the seam issues 4–5 extend with event handlers.

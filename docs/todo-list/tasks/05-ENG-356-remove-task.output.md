# ENG-356: [feature] Remove task interaction

**Type:** `feature`
**Linear:** https://linear.app/rotate/issue/ENG-356
**Project:** https://linear.app/rotate/project/todo-list-737f7d905efa
**Estimate:** 2 points — modify 1 source file + tests, wires one existing op; no new contracts.
**Position:** 5 of 7
**Blocked by:** ENG-355 (extends the same `mountApp`/render in `src/ui.js`)

---

## Context
Serves the **Remove a task** user story. Adds a per-row remove control wired to the already-built pure `removeTask` operation, persisting and re-rendering on each change.

## Description
Extend `src/ui.js` so each rendered `<li>` includes a remove control; on click it reads the row's `data-id`, calls `removeTask(currentTasks, id)`, `saveTasks`, and re-renders. Extend `test/ui.test.js` first (TDD).

---

## Contracts
Consumes existing contracts — no new exported signatures:
```typescript
import { removeTask, saveTasks } from './tasks.js';
// Each <li> gains a remove control reading data-id
```

---

## Examples
**Input:** click remove on the "Buy milk" row
**Expected output:** the row disappears; localStorage no longer contains it.

---

## Permitted files
- `src/ui.js` — modify — remove control in render + click wiring
- `test/ui.test.js` — modify — remove interaction tests
- `docs/todo-list/features/todo-list/README.md` — modify — mark Remove as implemented

## Protected files
- `src/tasks.js` — consumed read-only; do NOT modify (owned by issue 2)
- `src/main.js` — owned by issue 3
- `index.html`, `src/styles.css`, config — owned by ENG-352
- `test/tasks.test.js` — owned by issue 2
- other `docs/**`

## External references
| System | Documentation URL | MCP |
|--------|------------------|-----|
| jsdom (test DOM) | https://github.com/jsdom/jsdom | — |

---

## Acceptance criteria
**Scenario:** Removing a task
```gherkin
Given the list contains "Buy milk"
When I remove it
Then it no longer appears in the list
```
- [ ] Removing a task removes it from the list and from localStorage.
- [ ] Removing one task leaves other tasks (and their done states) intact.

---

## Feature flag
**Flag name:** None **Default state:** None *(greenfield)*

---

## Feature documentation
**Create or update:** `docs/todo-list/features/todo-list/README.md`
**Action:** Update — mark Remove as implemented.

---

## TDD requirement
Tests before implementation. Test file: `test/ui.test.js` (extend). Write failing remove-interaction tests, then implement the wiring.

---

## Notes
Remove by stable `data-id`, never by index (approach.output.md — index identity rejected). Only call exported `tasks.js` ops.

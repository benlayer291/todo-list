# ENG-355: [feature] Add task interaction

**Type:** `feature`
**Linear:** https://linear.app/rotate/issue/ENG-355
**Project:** https://linear.app/rotate/project/todo-list-737f7d905efa
**Estimate:** 2 points — modify 1 source file + tests, wires one existing op; no new contracts.
**Position:** 4 of 7
**Blocked by:** ENG-354 (extends `mountApp`/render in `src/ui.js`)

---

## Context
Serves the **Add a task** user story. Wires the add form to the already-built pure `addTask` operation, persisting and re-rendering on each change. Builds on the render/view layer from issue 3 and the data module from issue 2.

## Description
Extend `src/ui.js` (`mountApp`) so that on add-button click / form submit it reads `#new-task-input`, calls `addTask(currentTasks, value)`, `saveTasks`, re-renders, and clears the input. Empty/whitespace input results in no task (delegated to `addTask`'s rejection — the handler does not re-validate). Extend `test/ui.test.js` first (TDD).

---

## Contracts
Consumes existing contracts — introduces no new exported signatures:
```typescript
import { addTask, saveTasks } from './tasks.js';
// Add control bound to #add-task-btn / #new-task-input
```

---

## Examples
**Input:** type "Buy milk", click Add
**Expected output:** a not-done "Buy milk" `<li>` appears; input cleared; persisted to localStorage.

**Input:** type "   " (whitespace), click Add
**Expected output:** no `<li>` added; list unchanged.

---

## Permitted files
- `src/ui.js` — modify — add-form event wiring in `mountApp`
- `test/ui.test.js` — modify — add interaction tests
- `docs/todo-list/features/todo-list/README.md` — modify — mark Add as implemented

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
**Scenario:** Adding a task
```gherkin
Given the task list is empty
When I enter "Buy milk" and add it
Then "Buy milk" appears in the list in the not-done state
```
**Scenario:** Empty input rejected
```gherkin
Given the add input is empty or whitespace
When I attempt to add
Then no task is added
```
- [ ] Adding non-empty text creates a not-done task and clears the input.
- [ ] Adding empty/whitespace adds nothing.
- [ ] The added task persists (survives a re-mount/reload).

---

## Feature flag
**Flag name:** None **Default state:** None *(greenfield)*

---

## Feature documentation
**Create or update:** `docs/todo-list/features/todo-list/README.md`
**Action:** Update — mark Add as implemented.

---

## TDD requirement
Tests before implementation. Test file: `test/ui.test.js` (extend). Write failing add-interaction tests, then implement the wiring.

---

## Notes
Re-render-on-change pattern (approach.output.md). Validation lives in `addTask`, not the handler. Only call exported `tasks.js` ops.

# ENG-357: [feature] Edit task text interaction

**Type:** `feature`
**Linear:** https://linear.app/rotate/issue/ENG-357
**Project:** https://linear.app/rotate/project/todo-list-737f7d905efa
**Estimate:** 2 points — modify 1 source file + tests; inline-edit interaction is slightly fiddlier but wires one existing op.
**Position:** 6 of 7
**Blocked by:** ENG-356 (extends the same `mountApp`/render in `src/ui.js`)

---

## Context
Serves the **Edit a task's text** user story. Adds a per-row edit affordance wired to the already-built pure `editTask` operation, persisting and re-rendering on commit.

## Description
Extend `src/ui.js` so a task's text can be edited (e.g. double-click the label to turn it into an input, or an explicit edit control). On commit, call `editTask(currentTasks, id, newText)`, `saveTasks`, re-render. Empty committed text leaves the task unchanged (delegated to `editTask`). No duplicate row is created; `done` is untouched. Extend `test/ui.test.js` first (TDD).

---

## Contracts
Consumes existing contracts — no new exported signatures:
```typescript
import { editTask, saveTasks } from './tasks.js';
// Each <li> gains an edit affordance reading data-id; commit yields new text
```

---

## Examples
**Input:** edit "Buy milk" → "Buy oat milk"
**Expected output:** row shows "Buy oat milk"; no duplicate row; done state unchanged; persisted.

**Input:** edit "Buy milk" → "" (empty)
**Expected output:** task text unchanged ("Buy milk").

---

## Permitted files
- `src/ui.js` — modify — edit affordance in render + commit wiring
- `test/ui.test.js` — modify — edit interaction tests
- `docs/todo-list/features/todo-list/README.md` — modify — mark Edit as implemented

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
**Scenario:** Editing task text
```gherkin
Given a task "Buy milk"
When I change its text to "Buy oat milk"
Then it shows "Buy oat milk" and no second task is created
```
- [ ] Editing updates only the targeted task's text in place — no duplicate, `done` unchanged.
- [ ] Empty committed edit text leaves the task unchanged.
- [ ] The edit persists across reload.

---

## Feature flag
**Flag name:** None **Default state:** None *(greenfield)*

---

## Feature documentation
**Create or update:** `docs/todo-list/features/todo-list/README.md`
**Action:** Update — mark Edit as implemented.

---

## TDD requirement
Tests before implementation. Test file: `test/ui.test.js` (extend). Write failing edit-interaction tests, then implement the wiring.

---

## Notes
Validation (empty-text rejection) lives in `editTask`, not the handler. Edit by stable `data-id`. Only call exported `tasks.js` ops.

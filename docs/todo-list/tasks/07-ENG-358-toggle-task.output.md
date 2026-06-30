# ENG-358: [feature] Toggle task done/not-done interaction

**Type:** `feature`
**Linear:** https://linear.app/rotate/issue/ENG-358
**Project:** https://linear.app/rotate/project/todo-list-737f7d905efa
**Estimate:** 2 points — modify 1 source file + tests, wires one existing op; no new contracts.
**Position:** 7 of 7
**Blocked by:** ENG-357 (extends the same `mountApp`/render in `src/ui.js`)

---

## Context
Serves the **Toggle done / not-done** user story — the last of the five actions. Makes the per-row done indicator interactive, wired to the already-built pure `toggleTask` operation, persisting and re-rendering on change. Completes the feature.

## Description
Extend `src/ui.js` so each `<li>` has an interactive toggle control (e.g. a checkbox) reflecting `done`; on change it reads `data-id`, calls `toggleTask(currentTasks, id)`, `saveTasks`, re-renders. Extend `test/ui.test.js` first (TDD).

---

## Contracts
Consumes existing contracts — no new exported signatures:
```typescript
import { toggleTask, saveTasks } from './tasks.js';
// Each <li> gains an interactive toggle control reflecting done, reading data-id
```

---

## Examples
**Input:** toggle the "Buy milk" (not-done) row
**Expected output:** "Buy milk" shown as done; persisted.

**Input:** toggle the "Buy milk" (done) row
**Expected output:** "Buy milk" shown as not-done; persisted.

---

## Permitted files
- `src/ui.js` — modify — interactive toggle control + change wiring
- `test/ui.test.js` — modify — toggle interaction tests
- `docs/todo-list/features/todo-list/README.md` — modify — mark Toggle implemented; feature complete

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
**Scenario:** Toggle not-done → done
```gherkin
Given a not-done task "Buy milk"
When I toggle it
Then it is shown as done
```
**Scenario:** Toggle done → not-done
```gherkin
Given a done task "Buy milk"
When I toggle it
Then it is shown as not-done
```
- [ ] Toggling flips only the targeted task's done state, both directions.
- [ ] The toggled state persists across reload.

---

## Feature flag
**Flag name:** None **Default state:** None *(greenfield)*

---

## Feature documentation
**Create or update:** `docs/todo-list/features/todo-list/README.md`
**Action:** Update — mark Toggle implemented; the feature is now complete (all five actions).

---

## TDD requirement
Tests before implementation. Test file: `test/ui.test.js` (extend). Write failing toggle-interaction tests, then implement the wiring.

---

## Notes
Same re-render-on-change pattern. Toggle by stable `data-id`. Only call exported `tasks.js` ops.

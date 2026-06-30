# ENG-353: [feature] Task-data module with localStorage persistence

**Type:** `feature`
**Linear:** https://linear.app/rotate/issue/ENG-353
**Project:** https://linear.app/rotate/project/todo-list-737f7d905efa
**Estimate:** 3 points — one contract (6 functions) + 1 external (localStorage), 2 files; logic trivial but test surface is moderate.
**Position:** 2 of 7
**Blocked by:** ENG-352 (needs the project + test setup)

---

## Context
Serves the **Add**, **Remove**, **Edit text**, **Toggle done**, and **Persistence** user stories at the logic level. This is the pure, framework-free data core — all task operations and `localStorage` I/O — with no DOM involvement, so it is fully unit-testable. The DOM layer (issue 3+) consumes this module.

## Description
Create `src/tasks.js` exporting the contract below. Every mutating operation is pure: it returns a **new** array and never mutates its input. Persistence is a single JSON blob under one namespaced key. `loadTasks` is defensive: missing or unparseable storage yields `[]`.

Write `test/tasks.test.js` first (TDD), covering every operation and edge case before implementing `src/tasks.js`.

---

## Contracts
```typescript
interface Task { id: string; text: string; done: boolean }

const STORAGE_KEY = 'todo-list.tasks';

function loadTasks(): Task[];              // [] if key absent or JSON invalid
function saveTasks(tasks: Task[]): void;   // JSON.stringify → localStorage[STORAGE_KEY]

function addTask(tasks: Task[], text: string): Task[];
//   trims text; if empty/whitespace → returns tasks UNCHANGED
//   else → [...tasks, { id: crypto.randomUUID(), text: trimmed, done: false }]
function removeTask(tasks: Task[], id: string): Task[];   // filter out matching id
function editTask(tasks: Task[], id: string, text: string): Task[];
//   trims text; if empty → task UNCHANGED; else replace matching task's text only
function toggleTask(tasks: Task[], id: string): Task[];   // negate matching task's done
```
*If `crypto.randomUUID()` is unavailable in the runtime, add a tiny private `makeId()` (e.g. counter + Date.now) behind the same contract — tests assert on `text`/`done`, not the id value.*

---

## Examples
**Input:** `addTask([], 'Buy milk')`
**Expected output:** `[{ id: <uuid>, text: 'Buy milk', done: false }]`

**Input:** `addTask(existing, '   ')`
**Expected output:** `existing` (same array, unchanged — no task added)

**Input:** `toggleTask([{id:'a',text:'x',done:false}], 'a')`
**Expected output:** `[{ id:'a', text:'x', done:true }]`

**Input:** `editTask([{id:'a',text:'x',done:false}], 'a', 'y')`
**Expected output:** `[{ id:'a', text:'y', done:false }]` (no duplicate, done untouched)

---

## Permitted files
- `src/tasks.js` — create — pure task-data module + localStorage I/O
- `test/tasks.test.js` — create — unit tests for every operation

## Protected files
- `index.html`, `src/styles.css`, `vite.config.js`, `package.json` — owned by ENG-352
- `src/ui.js`, `src/main.js`, `test/ui.test.js` — owned by later issues
- `docs/**`

---

## External references
| System | Documentation URL | MCP |
|--------|------------------|-----|
| localStorage (jsdom in tests) | https://github.com/jsdom/jsdom | — |
| crypto.randomUUID | Web Crypto API | — |

---

## Acceptance criteria
- [ ] `addTask` with non-empty text appends a `{id, text, done:false}` task; empty/whitespace returns the array unchanged.
- [ ] `removeTask` returns a new array without the matching id.
- [ ] `editTask` replaces only the matching task's text, creates no duplicate, leaves `done` unchanged; empty text leaves the task unchanged.
- [ ] `toggleTask` flips only the matching task's `done`.
- [ ] No operation mutates its input array (verified by reference/identity assertions).
- [ ] `saveTasks` then `loadTasks` round-trips tasks and their done states.
- [ ] `loadTasks` returns `[]` when the key is absent or the stored value is invalid JSON.

---

## Feature flag
**Flag name:** None **Default state:** None *(greenfield)*

---

## Feature documentation
**Create or update:** `docs/todo-list/features/todo-list/README.md`
**Action:** Defer — feature README created in issue 3 (first user-facing behaviour). This module is internal.

---

## TDD requirement
Tests before implementation. Test file: `test/tasks.test.js`. Red → green → refactor: write failing tests for each contract function and edge case, then implement `src/tasks.js` to pass.

---

## Notes
Immutable ops + stable ids per approach.output.md (index-based identity explicitly rejected). Single JSON blob under one key. Wrap `JSON.parse` in try/catch for corrupt-storage resilience.

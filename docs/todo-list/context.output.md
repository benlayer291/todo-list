# Task Context: ENG-353 — [feature] Task-data module with localStorage persistence

**Generated:** 2026-06-30 18:45 UTC
**Task file:** `docs/todo-list/tasks/02-ENG-353-task-data-module.output.md`
**Linear:** https://linear.app/rotate/issue/ENG-353

> This is the sole input file for delivery-build. Read this file only. Do not load any other project files unless explicitly listed in permitted files below.

---

## Task summary
Create the pure, framework-free data core for the todo app: `src/tasks.js`, holding all task operations (add/remove/edit/toggle) and `localStorage` I/O (load/save). Every mutating operation is pure — returns a new array, never mutates its input. No DOM. This module is consumed by the UI layer in later tasks. Build it TDD-first with `test/tasks.test.js`.

---

## Acceptance criteria

- [ ] `addTask` with non-empty text appends `{id, text, done:false}`; empty/whitespace returns the array unchanged.
- [ ] `removeTask` returns a new array without the matching id.
- [ ] `editTask` replaces only the matching task's text, creates no duplicate, leaves `done` unchanged; empty/whitespace text leaves the task unchanged.
- [ ] `toggleTask` flips only the matching task's `done`.
- [ ] No operation mutates its input array (verify by identity/reference assertions).
- [ ] `saveTasks` then `loadTasks` round-trips tasks and their done states.
- [ ] `loadTasks` returns `[]` when the key is absent or the stored value is invalid JSON.

---

## Contracts
Implement exactly. Do not deviate.
```typescript
interface Task { id: string; text: string; done: boolean }

const STORAGE_KEY = 'todo-list.tasks';

function loadTasks(): Task[];              // [] if key absent or JSON invalid
function saveTasks(tasks: Task[]): void;   // JSON.stringify → localStorage[STORAGE_KEY]

function addTask(tasks: Task[], text: string): Task[];
//   trims text; empty/whitespace → returns tasks UNCHANGED
//   else → [...tasks, { id: crypto.randomUUID(), text: trimmed, done: false }]
function removeTask(tasks: Task[], id: string): Task[];      // tasks.filter(t => t.id !== id)
function editTask(tasks: Task[], id: string, text: string): Task[];
//   trims text; empty → task UNCHANGED; else replace matching task's text only
function toggleTask(tasks: Task[], id: string): Task[];      // negate matching task's done
```
If `crypto.randomUUID()` is unavailable in the runtime, add a private `makeId()` behind the same contract — tests assert on `text`/`done`, not the id value.

---

## Examples
**Input:** `addTask([], 'Buy milk')` → **Output:** `[{ id: <uuid>, text: 'Buy milk', done: false }]`
**Input:** `addTask(existing, '   ')` → **Output:** `existing` (same array reference, unchanged)
**Input:** `toggleTask([{id:'a',text:'x',done:false}], 'a')` → **Output:** `[{ id:'a', text:'x', done:true }]`
**Input:** `editTask([{id:'a',text:'x',done:false}], 'a', 'y')` → **Output:** `[{ id:'a', text:'y', done:false }]`

---

## Permitted files
- `src/tasks.js` — create
- `test/tasks.test.js` — create

## Protected files
- `index.html`, `src/styles.css`, `vite.config.js`, `package.json`, `.gitignore`, `test/setup.js`, `test/smoke.test.js` — owned by ENG-352
- `src/ui.js`, `src/main.js`, `test/ui.test.js` — owned by ENG-354+
- `docs/**` — workflow artefacts

---

## External references
*Pre-verified during shaping-approach.*

| System | Documentation URL | MCP |
|--------|------------------|-----|
| localStorage (jsdom in tests) | https://github.com/jsdom/jsdom | — |
| crypto.randomUUID | Web Crypto API | — |

**localStorage (verified):** jsdom implements the Web Storage API natively, so `test/tasks.test.js` can call `localStorage` directly. `test/setup.js` already clears `localStorage` before each test (from ENG-352), so tests start clean.
**crypto.randomUUID (verified available in this runtime):** Node 22 / jsdom expose `crypto.randomUUID()`. Confirmed present (Node ≥16). Use it for ids; fall back to a private `makeId()` only if a runtime ever lacks it.

---

## Codebase conventions
No convention files found (`AGENTS.md`, `CLAUDE.md`, `.cursorrules`, `CONVENTIONS.md`, `CONTRIBUTING.md` absent). Apply the established patterns below + the workflow implementation standards.

---

## Codebase patterns
Established by ENG-352 (now on `main`):
**Naming:** lowercase file names; ES modules (`import`/`export`, `"type": "module"`). camelCase functions.
**File structure:** app source in `src/`, tests in `test/` named `*.test.js`. This task adds `src/tasks.js` + `test/tasks.test.js`.
**Test style:** Vitest with `describe`/`it`/`expect`, `environment: 'jsdom'`. `test/setup.js` runs `localStorage.clear()` in `beforeEach` globally — tests need not clear storage themselves.
**Component pattern:** container/presentation separation — this module is the **pure data layer** (no DOM, no side effects beyond explicit `localStorage` I/O in `loadTasks`/`saveTasks`). The mutating ops (`addTask` etc.) must be pure functions of their inputs.
**Utilities to reuse:** none yet — this module is the first reusable utility. Do not recreate storage helpers elsewhere later; consumers import from here.

---

## Tooling config
**Linting:** none configured.
**Formatting:** none configured — match existing 2-space indentation, single quotes, semicolons (as in `vite.config.js`/`test/setup.js`).
**TypeScript:** none — plain `.js` ES modules. (Contracts above are types-as-documentation, not enforced.)
**Test runner:** `npm test` → `vitest run`, jsdom env, `test/setup.js` clears localStorage per test.

---

## Feature flag
**Flag name:** None
**Default state:** None
*(Greenfield — feature-flag exemption.)*

---

## Figma spec
Not a UI task — pure logic module, no Figma reference.

---

## Conflict check
**Status:** Clear
**Details:** Only `todo-list` is active. ENG-353's permitted files (`src/tasks.js`, `test/tasks.test.js`) are new and owned solely by this issue. `src/tasks.js` is protected (read-only) for all later UI issues per the sequence.

---

## TDD reminder
Tests before implementation. Write `test/tasks.test.js` covering every contract function and edge case (including immutability and the invalid-JSON load case); confirm they fail; then implement `src/tasks.js` minimally to pass; then refactor.

---

## Implementation standards reminder
- Human readable — rewrite if a comment is needed to understand it
- Follow established patterns above — never introduce a new pattern
- Functional and composable — small, single-purpose, immutable operations
- Container/presentation separation — this is the pure data layer; no DOM
- No unnecessary comments
- As simple as possible — no premature abstraction

---

## Commit granularity (process note)
Per updated guidance: commit in meaningful steps, not one squashed commit. Suggested for this task: (1) failing tests for the data module, (2) implement storage I/O (`load`/`save`), (3) implement the pure operations (`add`/`remove`/`edit`/`toggle`). Each commit message ends with the Co-Authored-By trailer.

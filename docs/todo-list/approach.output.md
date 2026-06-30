# Technical Approach

**Project:** Todo list
**Linear:** https://linear.app/rotate/project/todo-list-737f7d905efa
**Date:** 2026-06-30
**Status:** Approved

---

## Approach per user story

All stories share one architecture: a **pure task-data module** (`src/tasks.js`) holding immutable operations + `localStorage` I/O, and a **thin DOM/presentation layer** (`src/ui.js`) that renders the list from state and wires events. `src/main.js` bootstraps: load state → render → attach handlers. Every mutating user action follows the same loop: handler → pure op returns a new array → persist to `localStorage` → full re-render from the new array. Full re-render (not surgical DOM patching) is chosen deliberately for a single-user local list of trivial size — it keeps the UI layer dumb and removes a whole class of stale-DOM bugs.

### Story: View tasks

**Approach:** On load, `loadTasks()` reads the `localStorage` key, parses JSON (empty array if missing/invalid), and `renderTasks(tasks, root)` paints each task with its text and a done indicator. Empty array renders an empty list container, no error.
**Components:** `src/tasks.js` (`loadTasks`), `src/ui.js` (`renderTasks`), `index.html` (list container), `src/main.js` (bootstrap).
**Pattern:** Pure read + pure render. `renderTasks` is a pure function of `(tasks) → DOM`; it owns no state.
**Data flow:** `localStorage` → `loadTasks()` → `tasks[]` → `renderTasks` → DOM.
**External dependencies:** Browser `localStorage` (verified).

### Story: Add a task

**Approach:** `addTask(tasks, text)` trims `text`; if empty returns the **same array unchanged** (rejection); otherwise returns a new array with a new task `{ id, text: trimmed, done: false }` appended. Handler persists and re-renders.
**Components:** `src/tasks.js` (`addTask`), `src/ui.js` (input + add handler), `index.html` (input + button).
**Pattern:** Immutable append; validation inside the pure op so it is unit-testable without the DOM.
**Data flow:** input value → `addTask` → new `tasks[]` → `saveTasks` → re-render.
**External dependencies:** `localStorage`; `crypto.randomUUID()` for ids (verified).

### Story: Remove a task

**Approach:** `removeTask(tasks, id)` returns a new array filtered to exclude the matching id.
**Components:** `src/tasks.js` (`removeTask`), `src/ui.js` (per-row remove handler).
**Pattern:** Immutable filter by stable id (not index — ids survive reordering/removal).
**Data flow:** row id → `removeTask` → new `tasks[]` → `saveTasks` → re-render.

### Story: Edit a task's text

**Approach:** `editTask(tasks, id, text)` returns a new array where the matching task has its `text` replaced with the trimmed value (`done` unchanged); empty trimmed text leaves the task's text unchanged (no destructive blank). No new task created — maps in place by id.
**Components:** `src/tasks.js` (`editTask`), `src/ui.js` (inline edit interaction).
**Pattern:** Immutable map by id; only `text` field touched.
**Data flow:** id + new text → `editTask` → new `tasks[]` → `saveTasks` → re-render.

### Story: Toggle a task done / not-done

**Approach:** `toggleTask(tasks, id)` returns a new array where the matching task's `done` is negated; all other fields and tasks untouched.
**Components:** `src/tasks.js` (`toggleTask`), `src/ui.js` (checkbox/toggle handler).
**Pattern:** Immutable map by id; only `done` field flipped.
**Data flow:** id → `toggleTask` → new `tasks[]` → `saveTasks` → re-render.

### Story: Persistence across sessions

**Approach:** `saveTasks(tasks)` writes `JSON.stringify(tasks)` to the `localStorage` key `todo-list.tasks`. `loadTasks()` reads and `JSON.parse`s it, returning `[]` if the key is absent or the value fails to parse (defensive against corrupt storage). Persistence is not a separate UI feature — every mutating op calls `saveTasks`, so reload restores via `loadTasks`.
**Components:** `src/tasks.js` (`loadTasks`, `saveTasks`).
**Pattern:** Single JSON blob under one namespaced key. Read-defensive parse.
**Data flow:** `tasks[]` ⇄ `JSON` ⇄ `localStorage['todo-list.tasks']`.
**External dependencies:** `localStorage` (verified via jsdom for tests).

| Dependency | Documentation | Confirmed capability |
|------------|---------------|---------------------|
| Browser `localStorage` | https://github.com/jsdom/jsdom (README, storageQuota) | jsdom implements the Web Storage API (`localStorage`/`sessionStorage`) out of the box, default 5,000,000 code-unit quota — so DOM tests can exercise persistence directly. |
| `crypto.randomUUID()` | Web Crypto API (available in jsdom/Node ≥16 test runtime) | Generates RFC4122 v4 ids for stable task identity. (See risk note re: test-runtime availability.) |
| Vite | https://vite.dev/guide/ | Serves & builds vanilla HTML/CSS/JS; `index.html` is the entry point; `vanilla` template exists; production build via bundler. |
| Vitest | https://vitest.dev/guide/environment , https://vitest.dev/config/ | `test.environment` supports `jsdom`/`happy-dom`; config can `mergeConfig` with Vite; `setupFiles` supported. |

---

## File landscape

**Existing files relevant to this project:**
- `docs/todo-list/*` — workflow artefacts only; not app code.
- (Greenfield — no app source exists yet.)

**Files to be created:**
- `package.json` — npm manifest, scripts (`dev`, `build`, `test`), devDeps (vite, vitest, jsdom).
- `vite.config.js` — Vite + Vitest config (`test.environment: 'jsdom'`, optional `setupFiles`).
- `index.html` — app shell: heading, add-task input + button, `<ul>`/list container.
- `src/tasks.js` — pure task-data module (the contracts below) + `localStorage` I/O.
- `src/ui.js` — DOM rendering + event wiring (thin presentation layer).
- `src/main.js` — bootstrap (load → render → attach handlers).
- `src/styles.css` — minimal functional styling.
- `test/tasks.test.js` — unit tests for the pure data module.
- `test/ui.test.js` — DOM tests for rendering/interaction (jsdom).
- `.gitignore` — ignore `node_modules`, `dist`.

**Files that must not change:**
- `docs/todo-list/brief.output.md`, `scope.output.md`, `prd.output.md` — locked discovery/shaping artefacts.

---

## Contracts

### Task shape
```typescript
// A task is a text string plus a done flag, with a stable id for identity.
interface Task {
  id: string;      // crypto.randomUUID()
  text: string;    // trimmed, non-empty
  done: boolean;   // default false
}
```

### Pure task-data module — `src/tasks.js`
```typescript
// Storage I/O
const STORAGE_KEY = 'todo-list.tasks';
function loadTasks(): Task[];              // [] if absent or unparseable
function saveTasks(tasks: Task[]): void;   // JSON.stringify → localStorage

// Immutable operations — each returns a NEW array, never mutates input
function addTask(tasks: Task[], text: string): Task[];
//   trims text; if empty/whitespace → returns tasks unchanged
//   else → [...tasks, { id, text: trimmed, done: false }]
function removeTask(tasks: Task[], id: string): Task[];
//   → tasks.filter(t => t.id !== id)
function editTask(tasks: Task[], id: string, text: string): Task[];
//   trims text; if empty → task unchanged; else replaces matching task's text only
function toggleTask(tasks: Task[], id: string): Task[];
//   → matching task's done negated; all else untouched
```

### Presentation layer — `src/ui.js`
```typescript
// Pure render: paints the list into the given root element.
function renderTasks(tasks: Task[], root: HTMLElement): void;
// Wiring: attaches handlers; each handler computes new state via a tasks.js op,
// persists via saveTasks, and re-renders. UI holds no authoritative state.
function mountApp(root: HTMLElement): void;
```

---

## External dependencies

| System | Documentation URL | MCP | Verified |
|--------|------------------|-----|---------|
| Vite (dev/build) | https://vite.dev/guide/ | — | ✅ |
| Vitest (test runner) | https://vitest.dev/guide/environment , https://vitest.dev/config/ | — | ✅ |
| jsdom (test DOM + localStorage) | https://github.com/jsdom/jsdom | — | ✅ |
| Browser `localStorage` | (Web Storage API, jsdom-backed in tests) | — | ✅ |
| `crypto.randomUUID()` | Web Crypto API | — | ⚠️ verify in test runtime (risk below) |

---

## Rejected approaches

| Approach | Reason rejected |
|----------|----------------|
| Single inline `<script>` in `index.html`, no module split | Violates WORKFLOW §9 (container/presentation separation) and makes TDD of logic impossible without the DOM. |
| Mutating task operations in place (push/splice on the array) | WORKFLOW §9 favours immutability; immutable ops are trivially unit-testable and side-effect-free. |
| Surgical/diff DOM updates per change | Premature optimization for a tiny single-user list; full re-render keeps the UI layer dumb and avoids stale-DOM bugs. |
| Index-based task identity | Indexes shift on remove/edit, causing the wrong task to be mutated; stable `id` avoids this. |
| `happy-dom` as the test environment | Vitest docs note happy-dom "lacks some API"; jsdom documents explicit `localStorage` support, the one API these tests most depend on. |
| A React/Vue/framework approach | Out of scope per PRD; vanilla is a hard constraint. |
| Per-field separate localStorage keys | A single JSON blob under one namespaced key is simpler and atomic to read/write. |

---

## Spike issues raised

None. All unknowns from the PRD's open questions were resolved through documentation research:
- **Vitest DOM environment** → resolved: `jsdom` (implements `localStorage`; happy-dom lacks some API).
- **localStorage test setup** → resolved: jsdom provides it natively; tests clear storage between cases (see risks).
- The "resuming a halted run mid-chain" question is a workflow-process concern, not a product unknown — remains parked, does not block planning.

| Unknown | Linear issue | Status |
|---------|-------------|--------|
| — | — | — |

---

## Risks remaining

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| `crypto.randomUUID()` unavailable or non-deterministic in the Vitest/jsdom runtime | Low | Med | Available in Node ≥16 and jsdom's webcrypto; if absent, add a tiny `makeId()` wrapper (Date.now + counter) behind the same contract. Tests assert on `text`/`done`, not id value, so id source is swappable. |
| `localStorage` state leaking between tests (jsdom persists within a run) | Med | Low | `localStorage.clear()` in a `beforeEach` via Vitest `setupFiles`/test setup. |
| jsdom storage quota or JSON parse of corrupt data throwing | Low | Low | `loadTasks` wraps parse in try/catch and returns `[]` on failure. |
| Scope drift (todo apps accrete features) | Med | Med | Out-of-scope list in PRD is explicit; permitted-file lists in planning enforce it. |

---

**Checkpoint status:** Approved by human (Gate 4)
**Approved on:** 2026-06-30
**Note:** All spike issues must be resolved and this document updated before approval can be given. PRD is locked on approval of this document.

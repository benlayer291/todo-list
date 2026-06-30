# Todo list

**Last updated:** 2026-06-30 — ENG-356
**Status:** In progress

---

## What it is
A single-user, client-side todo list. The user can view their tasks (each with a text label and a done/not-done state) in the browser, with tasks persisted locally so they survive a reload. The full feature offers five actions — view, add, remove, edit text, and toggle done — delivered incrementally across tasks.

As of ENG-356, **view**, **add**, and **remove** are implemented: the app loads and renders persisted tasks, the user can add a new (not-done) task via the form, and remove any task via its per-row Remove control. Edit/toggle land in ENG-357–358.

---

## Why it exists
Gives a single user a simple place to track tasks in the browser, with no accounts, backend, or sync. (The wider project also serves as a vehicle for exercising the engineering workflow end-to-end.)

**User story:** View tasks (plus Add, Remove, Edit, Toggle, Persistence — incremental)
**PRD:** `docs/todo-list/prd.output.md`
**Linear project:** https://linear.app/rotate/project/todo-list-737f7d905efa

---

## How it works
Container/presentation split with a pure data core:

**Components:**
- `src/tasks.js` — pure data module: `Task` shape, `localStorage` I/O, and immutable operations (ENG-353).
- `src/ui.js` — DOM layer: `renderTasks` (presentation) and `mountApp` (container).
- `src/main.js` — bootstrap: mounts the app on `DOMContentLoaded`.
- `index.html` — static shell: heading, add form, and `#task-list` render root (ENG-352).

**Data flow:**
On load, `mountApp` calls `loadTasks()` (reads `localStorage['todo-list.tasks']`, `[]` if absent/invalid) and `renderTasks` paints one `<li>` per task into `#task-list`. `mountApp` holds the current list in scope; a user action calls a pure operation → `saveTasks` → full re-render. As of ENG-355 the add form's `submit` is wired: `addTask(tasks, input.value)` → persist → re-render → clear input (empty/whitespace rejected by `addTask`). As of ENG-356, removal is wired via a single delegated `click` listener on the root: a `.remove` button click → read the row's `data-id` → `removeTask` → persist → re-render.

**Key functions:**
- `renderTasks(tasks, root)` in `src/ui.js` — clears the root and rebuilds one `<li>` per task (text via `textContent`, done state via a checkbox + `done` class, row tagged with `data-id`).
- `mountApp(root)` in `src/ui.js` — loads persisted tasks and renders them; the seam later tasks extend with event handlers.

---

## Dependencies

**External services:** None (no backend).

**MCPs:** None.

**Internal dependencies:**
| Module / file | Purpose |
|--------------|---------|
| `src/tasks.js` | Task data + `localStorage` persistence |

**Packages:**
| Package | Version | Purpose |
|---------|---------|---------|
| vite | ^6 | Dev server / build |
| vitest | ^2 | Test runner |
| jsdom | ^25 | DOM environment for tests |

---

## Configuration

**Environment variables:** None.

**Feature flags:** None (greenfield project).

---

## Acceptance criteria (View tasks — ENG-354)

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

---

## Known limitations
- View + add + remove as of ENG-356 — edit/toggle are not yet wired (ENG-357–358).
- The per-row checkbox reflects done state but is not yet interactive (toggle wiring lands in ENG-358).
- Single user, single browser; no accounts, sharing, or cross-device sync.
- Out of scope (PRD): due dates, priorities, multiple lists, tags, filtering/sorting, search, reordering.

---

## Related

| Resource | Link |
|---------|------|
| Linear project | https://linear.app/rotate/project/todo-list-737f7d905efa |
| Linear issues | ENG-352, ENG-353, ENG-354 (this), ENG-355–358 (pending) |
| Figma designs | N/A — minimal functional styling, no design spec |
| External docs | Vite https://vite.dev/guide/ · Vitest https://vitest.dev/guide/environment · jsdom https://github.com/jsdom/jsdom |

---

## Change history

| Date | Task | What changed |
|------|------|-------------|
| 2026-06-30 | ENG-354 | Created — view/render layer (`renderTasks`, `mountApp`, bootstrap) and feature docs |
| 2026-06-30 | ENG-355 | Add action — wired the add form (`addTask` → persist → re-render → clear input) |
| 2026-06-30 | ENG-356 | Remove action — per-row Remove control via delegated click (`removeTask` → persist → re-render) |

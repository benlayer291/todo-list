# Scope

**Project:** Todo list
**Date:** 2026-06-30
**Status:** Approved

---

## In scope

- View the current list of tasks, showing each task's text and its done / not-done state.
- Add a new task from a text string; it appears in the list in the not-done state.
- Remove an existing task from the list.
- Edit the text of an existing task.
- Toggle an existing task between done and not-done.
- Persist all tasks in browser `localStorage` so the list survives reload and browser restart.
- Minimal functional styling only — enough that the app is usable and the five actions are visible/operable.
- Vite project scaffolding (`package.json`, Vite config) and a Vitest test setup with a DOM environment, to support TDD.

## Out of scope

- Due dates — excluded; not required for the MVP vehicle, and adds scope drift.
- Priorities — excluded; same reason.
- Multiple lists — excluded; single implicit list only.
- Tags / categories — excluded; not needed to exercise the chain.
- Filtering / sorting — excluded; the list renders in a single fixed order.
- Search — excluded; list is small and single-user.
- Reordering tasks — excluded; order is insertion order, not user-controllable.
- Accounts / login / auth — excluded; single anonymous user per browser.
- Multi-user, sharing, assignment, cross-device sync — excluded; no backend.
- Backend / database / server — excluded; persistence is `localStorage` only.
- Visual / UX polish (theming, responsive design, animations, empty-state art) — excluded; focus is functionality, not polish.

## User stories

### Story: View tasks

**As a** single user
**I want** to see my list of tasks with their done state
**So that** I know what I have to do and what I've completed

**Scenario:** List renders existing tasks
```gherkin
Given I have tasks "Buy milk" (not-done) and "Call Sam" (done)
When I open the app
Then I see "Buy milk" shown as not-done
And I see "Call Sam" shown as done
```

**Scenario:** Empty list
```gherkin
Given I have no tasks
When I open the app
Then I see an empty task list and no error
```

---

### Story: Add a task

**As a** single user
**I want** to add a task by typing its text
**So that** I can capture something I need to do

**Scenario:** Adding a task
```gherkin
Given the task list is empty
When I enter "Buy milk" and add it
Then "Buy milk" appears in the list
And "Buy milk" is in the not-done state
```

**Scenario:** Empty input is rejected
```gherkin
Given the add input is empty or only whitespace
When I attempt to add the task
Then no task is added to the list
```

---

### Story: Remove a task

**As a** single user
**I want** to remove a task
**So that** my list only shows tasks I still care about

**Scenario:** Removing a task
```gherkin
Given the list contains "Buy milk"
When I remove "Buy milk"
Then "Buy milk" no longer appears in the list
```

---

### Story: Edit a task's text

**As a** single user
**I want** to change the text of an existing task
**So that** I can correct or refine what it says

**Scenario:** Editing task text
```gherkin
Given the list contains a task "Buy milk"
When I change its text to "Buy oat milk"
Then the task shows "Buy oat milk"
And no second task is created
```

---

### Story: Toggle a task done / not-done

**As a** single user
**I want** to mark a task done or not-done
**So that** I can track what I've completed

**Scenario:** Marking a not-done task as done
```gherkin
Given the list contains a not-done task "Buy milk"
When I toggle "Buy milk"
Then "Buy milk" is shown as done
```

**Scenario:** Marking a done task as not-done
```gherkin
Given the list contains a done task "Buy milk"
When I toggle "Buy milk"
Then "Buy milk" is shown as not-done
```

---

### Story: Persistence across sessions

**As a** single user
**I want** my tasks to still be there after I close and reopen the app
**So that** I don't lose my list

**Scenario:** Tasks survive reload
```gherkin
Given I have added tasks and toggled one done
When I reload the app
Then the same tasks appear with the same done states
```

---

## Acceptance criteria

- [ ] On open, every stored task renders with its text and correct done/not-done state.
- [ ] An empty task list renders cleanly with no error.
- [ ] Adding non-empty text creates a task in the not-done state and shows it in the list.
- [ ] Adding empty or whitespace-only text adds no task.
- [ ] Removing a task takes it out of the list.
- [ ] Editing a task's text updates that task in place and creates no duplicate.
- [ ] Toggling a not-done task marks it done; toggling a done task marks it not-done.
- [ ] After reload, tasks and their done states are restored from `localStorage`.

---

## Technical approach

**Components:** A single-page vanilla app — `index.html` (structure), a CSS file (minimal styling), and JavaScript split between a pure task-state/data module (add/remove/edit/toggle operations + `localStorage` read/write) and a DOM/presentation layer that renders the list and wires up events. This honours WORKFLOW §9 container/presentation separation: the data module is pure and testable; the DOM layer is thin.

**Pattern:** Functional, immutable task operations (each operation returns a new task array) following established workflow standards. TDD via Vitest — tests written first for the pure data module, then the rendering/interaction layer.

**Integrations:** None external. Browser `localStorage` is the only persistence. Vite as dev/build tool; Vitest as test runner with a DOM environment (`jsdom` or `happy-dom`) — verified that Vitest supports a configurable DOM `environment` (vitest.dev/guide/environment). Exact environment choice and `localStorage` test setup is a `shaping-approach` decision.

**Data flow:** User action → DOM event handler → pure task operation produces a new task list → list written to `localStorage` → DOM re-renders from the new list. On load, list is read from `localStorage` (empty array if none) and rendered.

---

## Non-functional requirements

**Testing:** [default applies]
**Accessibility:** Default (WCAG AA) applies, but note the brief prioritises functionality over polish — accessibility is satisfied at a basic semantic-HTML level, not audited beyond defaults.
**QA:** [default applies]
**Performance:** [no specific requirement — single user, small local list]

---

## Resolved assumptions

| Assumption | Status | Reasoning |
|------------|--------|-----------|
| Browser `localStorage` is available and sufficient for persistence | Confirmed | Single-user, small local list; `localStorage` is the standard fit and requires no backend. |
| Vite + Vitest are appropriate tooling for vanilla HTML/CSS/JS, incl. a DOM test environment | Confirmed (high-level) | Verified Vitest supports configurable DOM environments (jsdom/happy-dom) via official docs. Exact env + localStorage test config deferred to `shaping-approach`. |
| The five-action MVP is enough substance to exercise the chain | Confirmed | Yields ~5–6 stories, multiple PRs, real persistence and review surface — sufficient to validate the workflow. |

---

## Decisions made

| Decision | Reasoning |
|----------|-----------|
| Styling baseline = minimal functional only | Brief states functionality over polish; resolves the open "styling baseline" question. No theming/responsive work. |
| Toggle-done is a first-class action, separate from edit-text | Confirmed in interview; a task has done state, edit only changes text. |
| Pure data module separated from DOM layer | Enforces WORKFLOW §9 (container/presentation) and makes TDD of logic clean without DOM. |
| List order = insertion order, fixed | Reordering/sorting explicitly out of scope; keeps rendering trivial. |
| Empty/whitespace add is rejected | Avoids meaningless empty tasks; gives a concrete testable edge case. |

---

## Remaining open questions

| Question | Recommended action |
|----------|--------------------|
| Vitest DOM environment choice (jsdom vs happy-dom) and exact `localStorage` test setup | spike/investigate in `shaping-approach` (docs-verify) |
| How a halted run is resumed if we stop to fix a skill bug mid-chain | park (process concern, not product scope) |

---

## Scope change log

| Date | Change | Reason | Impact |
|------|--------|--------|--------|
| | | | |

---

**Checkpoint status:** Approved by human
**Approved on:** 2026-06-30

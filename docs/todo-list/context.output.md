# Task Context: ENG-352 — [chore] Scaffold Vite + Vitest vanilla project with app shell

**Generated:** 2026-06-30 18:25 UTC
**Task file:** `docs/todo-list/tasks/01-ENG-352-task.output.md`
**Linear:** https://linear.app/rotate/issue/ENG-352

> This is the sole input file for delivery-build. Read this file only. Do not load any other project files unless explicitly listed in permitted files below.

---

## Task summary
Scaffold a greenfield vanilla (no framework) Vite project with a Vitest test setup configured for a jsdom DOM environment, plus the static HTML app shell every later feature issue wires into. No application logic — tooling, config, and markup only. After this task: `npm install && npm run dev` serves the page, and `npm test` runs a passing smoke test in jsdom with `localStorage` available and cleared between tests.

---

## Acceptance criteria

**Scenario:** Dev server serves the shell
```gherkin
Given the project is installed
When I run `npm run dev`
Then index.html is served with an <h1> heading, an add input + button, and an empty task list
```
**Scenario:** Test runner works in jsdom
```gherkin
Given the project is installed
When I run `npm test`
Then Vitest runs in a jsdom environment and the smoke test passes
And localStorage is available in tests and cleared before each test
```

- [ ] `npm install && npm run dev` serves index.html with heading, add input+button, and empty `<ul id="task-list">`.
- [ ] `npm test` runs Vitest in jsdom and the smoke test passes.
- [ ] `localStorage` is available in tests and cleared before each test (via `test/setup.js`).
- [ ] No app logic implemented (`src/main.js` is created/owned by ENG-354, not here).

---

## Contracts
No JS contracts in this task (config + markup only). This task fixes the DOM ids the UI layer (ENG-354+) will bind to:
```html
<input id="new-task-input">
<button id="add-task-btn">
<ul id="task-list"></ul>
```

---

## Examples
**Input:** `npm install && npm test`
**Expected output:** Vitest runs under jsdom; `test/smoke.test.js` asserts a `localStorage.setItem`/`getItem` round-trip and passes; exit code 0.

---

## Permitted files
- `package.json` — create
- `vite.config.js` — create
- `.gitignore` — create
- `index.html` — create
- `src/styles.css` — create
- `test/setup.js` — create
- `test/smoke.test.js` — create

## Protected files
- `src/tasks.js`, `src/ui.js`, `src/main.js` — owned by feature issues (ENG-353/354)
- `test/tasks.test.js`, `test/ui.test.js` — owned by feature issues
- `docs/**` — workflow artefacts

---

## External references
*Pre-verified during shaping-approach (this session). Key facts inlined below.*

| System | Documentation URL | MCP |
|--------|------------------|-----|
| Vite | https://vite.dev/guide/ | — |
| Vitest | https://vitest.dev/guide/environment , https://vitest.dev/config/ | — |
| jsdom | https://github.com/jsdom/jsdom | — |

**Vite (verified):** Supports vanilla HTML/CSS/JS with no framework. `index.html` is the entry point and is treated as source — `<script type="module">` tags referencing JS are resolved automatically. `vanilla` template exists in create-vite. `npm run dev` starts the dev server (default http://localhost:5173); build bundles for production.

**Vitest (verified):** Configurable test environment via `test.environment`; supported values include `node`, `jsdom`, `happy-dom`, `edge-runtime`. Vitest config can live inside the Vite config or a separate `vitest.config.js` and be combined via `mergeConfig`. `test.setupFiles` runs setup before the test suite — use it to clear `localStorage`. Use `jsdom` here (it implements `localStorage`; happy-dom lacks some APIs).

**jsdom (verified):** Implements the Web Storage API (`localStorage`/`sessionStorage`) out of the box (documented `storageQuota`, default 5,000,000 code units). So tests can exercise `localStorage` directly under the jsdom environment.

---

## Codebase conventions
No convention files found (scanned root for `AGENTS.md`, `CLAUDE.md`, `.cursorrules`, `CONVENTIONS.md`, `CONTRIBUTING.md` — none present). Greenfield project; this task establishes the conventions. Apply the workflow's implementation standards (below) as the baseline.

---

## Codebase patterns
Greenfield — no existing app code to mirror.
**Naming:** lowercase file names; ES modules (`type: module`). DOM ids as specified above (kebab-case).
**File structure (established by this task):** app source under `src/`, tests under `test/`, `index.html` at root as Vite entry.
**Component pattern:** container/presentation separation will be enforced from ENG-353 onward (pure `tasks.js` data module vs thin `ui.js` DOM layer). Nothing to build here beyond static markup.
**Utilities to reuse:** none yet.

---

## Tooling config
**Linting:** none configured yet (not required by this task; do not add a linter unless trivial). 
**Formatting:** none configured (no `.prettierrc`).
**TypeScript:** not used — plain JavaScript (`.js`), ES modules.
**Test runner:** Vitest, `test.environment: 'jsdom'`, `test.setupFiles: ['./test/setup.js']`; `test/setup.js` clears `localStorage` in a `beforeEach`.

---

## Feature flag
**Flag name:** None
**Default state:** None
*(Greenfield project — WORKFLOW feature-flag exemption.)*

---

## Figma spec
Not a UI-design task (no Figma reference). The shell is plain functional markup; styling is minimal.

---

## Conflict check
**Status:** Clear
**Details:** Only the `todo-list` project is active under `docs/`. None of ENG-352's permitted files (`package.json`, `vite.config.js`, `.gitignore`, `index.html`, `src/styles.css`, `test/setup.js`, `test/smoke.test.js`) are owned or in progress by any other project. Greenfield working tree — no app files exist yet.

---

## TDD reminder
Tests before implementation. Red → green → refactor. For this chore, write `test/smoke.test.js` first (asserting a `localStorage` round-trip in jsdom), confirm it fails without setup, then add config until it passes. The acceptance criteria above are the test cases.

---

## Implementation standards reminder
- Human readable — rewrite if a comment is needed to understand it
- Follow established patterns above — never introduce a new pattern
- Functional and composable — small, single-purpose functions
- Container/presentation separation for UI components
- No unnecessary comments
- As simple as possible — no premature abstraction

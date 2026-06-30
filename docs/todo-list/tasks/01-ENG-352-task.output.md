# ENG-352: [chore] Scaffold Vite + Vitest vanilla project with app shell

**Type:** `chore`
**Linear:** https://linear.app/rotate/issue/ENG-352
**Project:** https://linear.app/rotate/project/todo-list-737f7d905efa
**Estimate:** 3 points — config + HTML shell + CSS + jsdom test setup across ~7 files; standard tooling, no unknowns.
**Position:** 1 of 7
**Blocked by:** —

---

## Context
Greenfield project. This chore sets up the Vite + Vitest toolchain and the static HTML shell that all later feature issues wire into. It serves no single user story directly — it is the foundation every feature issue depends on. No app logic here, just tooling and markup.

## Description
Scaffold a vanilla (no framework) Vite project with a Vitest test setup configured for a jsdom DOM environment, plus the static app shell. After this issue, `npm install` then `npm run dev` serves the page, and `npm test` runs a trivial passing test in jsdom.

- `package.json` — `type: module`; scripts `dev` (vite), `build` (vite build), `test` (vitest run); devDependencies: vite, vitest, jsdom.
- `vite.config.js` — Vite config that also configures Vitest: `test.environment: 'jsdom'`, `test.setupFiles: ['./test/setup.js']`.
- `test/setup.js` — clears `localStorage` before each test (`beforeEach(() => localStorage.clear())`).
- `.gitignore` — ignore `node_modules`, `dist`.
- `index.html` — full static structure (no logic): `<h1>` heading, an add-task area with `<input id="new-task-input">` and `<button id="add-task-btn">`, an empty `<ul id="task-list"></ul>`, links `src/styles.css`, loads `src/main.js` as `<script type="module">`.
- `src/styles.css` — minimal functional styling.

---

## Contracts
No JS contracts introduced (markup + config only). Establishes the DOM ids the UI layer will bind to:
```html
<input id="new-task-input">
<button id="add-task-btn">
<ul id="task-list"></ul>
```

---

## Examples
**Input:** `npm install && npm test`
**Expected output:** Vitest runs in jsdom; smoke test asserting `localStorage` round-trip passes; exit code 0.

---

## Permitted files
- `package.json` — create — npm manifest, scripts, devDeps
- `vite.config.js` — create — Vite + Vitest (jsdom) config
- `test/setup.js` — create — clears localStorage before each test
- `test/smoke.test.js` — create — proves jsdom + localStorage work (may be removed by a later issue)
- `.gitignore` — create — ignore node_modules, dist
- `index.html` — create — static app shell
- `src/styles.css` — create — minimal styling

## Protected files
- `src/tasks.js`, `src/ui.js`, `src/main.js` — owned by feature issues
- `test/tasks.test.js`, `test/ui.test.js` — owned by feature issues
- `docs/**` — workflow artefacts

---

## External references
| System | Documentation URL | MCP |
|--------|------------------|-----|
| Vite | https://vite.dev/guide/ | — |
| Vitest | https://vitest.dev/guide/environment , https://vitest.dev/config/ | — |
| jsdom | https://github.com/jsdom/jsdom | — |

---

## Acceptance criteria
- [ ] `npm install && npm run dev` serves index.html with heading, add input+button, and empty task list.
- [ ] `npm test` runs Vitest in jsdom and the smoke test passes.
- [ ] `localStorage` is available in tests and cleared before each test.
- [ ] No app logic is implemented (src/main.js is created/owned by issue 3).

---

## Feature flag
**Flag name:** None
**Default state:** None
*(Greenfield project — WORKFLOW feature-flag exemption.)*

---

## Feature documentation
**Create or update:** `docs/todo-list/features/todo-list/README.md`
**Action:** None for this chore (feature README is created in issue 3 once there is user-facing behaviour to document).

---

## TDD requirement
Tests before implementation. Test file: `test/smoke.test.js` — asserts `localStorage.setItem`/`getItem` round-trips in jsdom, proving the environment is correctly configured.

---

## Notes
jsdom implements `localStorage` natively (approach.output.md, verified). Keep config minimal; do not add framework plugins.

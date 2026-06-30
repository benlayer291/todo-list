# Interview Notes — Todo list

Raw discovery notes. Unstructured. Source material for discovery-brief.

## Framing (Step 0 — divergent)
- Opening request "Todo list" was vague — diverged into 3 framings:
  - A: personal productivity app
  - B: team/collaborative task tracker
  - C: learning/reference build — todo list as a vehicle to exercise something else
- Human picked **C**. The todo list is the vehicle; the real point is exercising
  this engineering workflow end-to-end.

## Problem
- Real goal is twofold:
  1. Run the full skill chain start to finish (workflow-init → review-retro) on a
     real, if simple, project to prove it runs cleanly.
  2. Shake out latent bugs in the workflow skills that only surface when actually
     exercised.
- No specific prior evidence of where skills break — this is "run it and see what
  falls over." Suspicions not pre-listed; will inspect issues as they arrive.
- The todo app is the *what* fed through the chain; the learning is the *why*.
- App needs enough real substance to generate genuine scope decisions, tasks and
  PRs, but must stay small enough to get through the whole flow.

## Goals / success
- Success = the full chain runs start to finish and produces a working todo app,
  AND skill bugs get surfaced (and looked at) along the way.
- Focus is **functionality**, not polish. Plain, unstyled-but-usable UI is fine.
- No gold-plating the app. Minimal styling acceptable.
- Anti-goal: don't let the app scope drift / grow features (todo apps tend to).

## The app — what it is
- A client-side web app. Single user. No backend, no database, no auth, no login,
  no sharing, no multi-user, no cross-device sync.
- Whoever opens the browser sees their own tasks from local storage.

### A "task"
- A task is just a string of text.
- A task has a done / not-done state. Default state is **not-done**.

### Capabilities — five actions (the whole MVP)
1. View the list of tasks
2. Add a task
3. Remove a task
4. Update a task — meaning **change the text** of the task
5. Toggle a task done / not-done (separate action from updating text)

### Persistence
- Browser storage (localStorage). Tasks survive close/refresh.
- No backend persistence.

## Users
- Single user. No accounts, no auth, no multi-user. Confirmed.

## Constraints
- Greenfield project, built in the current directory
  (/Users/benlayer/learn/workflow-skill).
- Stack: **plain HTML, CSS and JavaScript** for the app. No UI framework
  (no React/Vue).
- Tooling: bring in **Vite** as dev/build tool + **Vitest** as the test runner.
  This introduces package.json + node_modules into an otherwise build-free project.
  Accepted, because the workflow mandates TDD (delivery-build writes failing tests
  first, every time) and that needs a real test runner.
- Persistence via browser localStorage.
- Soft deadline: **want to get through this tonight.**

## Skill-bug handling (process constraint, since shaking out bugs is half the point)
- When a skill bug surfaces, pause and look at it as it arrives — don't blindly
  work around it just to keep the todo build moving.
- Stop condition: a skill bug bad enough to warrant fixing the skill is a valid
  reason to halt the flow.

## Scope edges — explicitly OUT of scope
- Due dates
- Priorities
- Multiple lists
- Tags / categories
- Filtering / sorting
- Search
- Reordering tasks
- (Everything beyond the five actions above.)

## Assumptions (taken for granted, not independently verified here)
- Browser localStorage is available and sufficient for persistence needs.
- Vite + Vitest are acceptable and appropriate tooling for a vanilla HTML/CSS/JS
  project. (Standard pairing; not docs-verified during interview — see risks.)

## Risks
- Primary risk is the workflow skills themselves breaking mid-chain — which is
  expected and is partly the point. Mitigation: inspect each issue as it arrives.
- Time pressure (tonight) could collide with stopping to fix skill bugs.
- Tooling risk: Vite/Vitest setup in a plain-HTML project could have friction
  (e.g. test environment / jsdom config for DOM + localStorage tests).

## Documentation fetched
- None. No external API/framework capabilities were asserted that required
  verification at interview time. Vite/Vitest specifics deferred to
  shaping-approach, where any capability claims must be docs-verified (WORKFLOW §7).

## Unverified technical claims flagged as risks
- Vite + Vitest as the test setup for vanilla HTML/CSS/JS was assumed, not
  docs-verified. To be confirmed against official docs in shaping-approach,
  including DOM/localStorage test environment configuration.

## Areas still unclear despite probing
- None material. The app is small and fully specified for MVP. Open technical
  detail (exact Vitest DOM environment config) is appropriately a shaping-approach
  concern, not a discovery gap.

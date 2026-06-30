# Discovery Brief

**Project:** Todo list
**Date:** 2026-06-30
**Status:** Approved

---

## Problem statement
The engineering workflow's full skill chain (`workflow-init` → `review-retro`) has not yet been validated end-to-end on a real project, and is expected to contain latent bugs that only surface when actually exercised. A small but genuine todo app is the vehicle: building it through every gate proves the chain runs cleanly and surfaces skill defects for inspection. Without doing this, the workflow ships unproven and its bugs stay hidden until they bite on a higher-stakes project.

## Goals
- Run the full skill chain start to finish on the todo app, passing every human checkpoint, and arrive at `review-retro` with a working app.
- Surface skill bugs as they occur and inspect them as they arrive (rather than silently working around them).
- Produce a working, functionally-correct todo app: all five actions work and tasks persist across reload.
- Keep the app deliberately small — functionality over polish, no feature drift.
- Get through the run tonight (soft deadline).

## Users
- **Single end user (the todo app's user).** A person managing their own task list in the browser. They need to view their tasks, add a task, remove a task, edit a task's text, and toggle a task between done and not-done, with tasks persisting across sessions. Today they have no such app. No accounts, no login, no sharing, no multi-user, no cross-device sync.
- **The workflow operator (the human running this chain).** The real beneficiary. Needs the chain to run cleanly through every gate and needs skill bugs surfaced and inspected. Today they have an unvalidated workflow with unknown defects.

## Constraints
- **App stack:** plain HTML, CSS and JavaScript. No UI framework (no React/Vue).
- **Tooling:** Vite as dev/build tool + Vitest as test runner. This introduces `package.json` and `node_modules` into an otherwise build-free project — accepted because the workflow mandates TDD (`delivery-build` writes failing tests first, every time) and that requires a real test runner.
- **Greenfield:** built in the current directory (`/Users/benlayer/learn/workflow-skill`). No existing app code to conform to.
- **Persistence:** browser `localStorage` only. No backend, no database, no server.
- **Single user, no auth.** Confirmed.
- **Focus is functionality, not polish.** Minimal/plain styling acceptable.
- **Soft deadline:** complete the run tonight.
- **Skill-bug handling (process constraint):** when a skill bug surfaces, pause and inspect it; a bug bad enough to warrant fixing the skill is a valid reason to halt the flow.

## Assumptions
- Browser `localStorage` is available and sufficient for the persistence needs.
- Vite + Vitest are appropriate, low-friction tooling for a vanilla HTML/CSS/JS project, including a DOM + `localStorage` test environment.
- The five-action MVP is enough real substance to meaningfully exercise scope, planning, delivery and review skills.

## Risks and considerations
- **Primary, expected risk:** the workflow skills themselves break mid-chain. This is partly the point; mitigation is to inspect each issue as it arrives.
- **Time pressure** (tonight) could collide with stopping to fix skill bugs — a forced trade-off between completing the run and fixing a skill.
- **Tooling risk (unverified):** Vite + Vitest setup for a plain-HTML project was assumed, not docs-verified during the interview. DOM/`localStorage` test-environment configuration (e.g. jsdom/happy-dom) could introduce friction. To be docs-verified in `shaping-approach` (WORKFLOW §7).
- **Scope-drift risk:** todo apps tend to accrete features; the explicit out-of-scope list must hold.

## Open questions

| Question | Recommended action |
|----------|--------------------|
| Exact Vitest DOM test environment for vanilla DOM + localStorage tests (jsdom vs happy-dom) | investigate (docs-verify in `shaping-approach`) |
| How a halted run is resumed if we stop to fix a skill bug mid-chain | park (handle if/when it happens) |
| Whether any minimal styling baseline is expected, or truly unstyled is acceptable | decide (in `shaping-scope`) |

---

**Checkpoint status:** Approved by human
**Approved on:** 2026-06-30
**Amendments made:** [none]

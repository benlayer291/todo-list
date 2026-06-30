# Retro Notes (running) — Todo list

Working log of skill issues, friction, and improvements found while running the
workflow end-to-end. Feeds `review-retro` at project close. Each item: what
happened → recommended skill change.

## Linear / MCP mechanics
1. **Project "attachments" don't exist in the Linear MCP** — attachment tools
   (`create_attachment`, `prepare_attachment_upload`) are **issue-scoped only**.
   `shaping-prd`/`shaping-approach` say "attach brief/scope/approach to the
   project," but the project-level mechanism is a **Document** (`save_document`
   with `project`). → Update those skills to say "create as a project Document,"
   not "attach."
2. **Non-existent project label silently dropped** — `shaping-prd` passed
   label `test`; Linear returned `labels:[]` with no error. → `shaping-prd`
   should verify the label exists (like it verifies the team) and either create
   it or flag to the human, not pass-and-hope.

## Planning phase
3. **`planning-breakdown` creates Linear issues before the Gate 5 review.** The
   review then happens on already-synced issues; rejected issues would pollute
   Linear. → Write task files locally first, review at the checkpoint, then sync
   to Linear on approval. (Done this way at the user's instruction.)
4. **Breakdown granularity guidance.** Initial breakdown combined Add+Remove and
   Edit+Toggle; user wanted each user-facing action as its own task. → Add
   guidance favouring one task per distinct user-facing action (vertical slice)
   when actions are independent.
5. **`package-lock.json` (and generated lockfiles) not on permitted lists** for a
   chore that installs deps — caused a minor scope-note. → Breakdown should
   include generated lockfiles in the permitted list for dependency-adding tasks.

## Delivery phase
6. **Feature README assumed every PR.** `delivery-build`/`delivery-checklist`
   require a feature README per task, but setup chores (ENG-352) and internal
   modules (ENG-353) legitimately have none — it's owned by the first
   user-facing task (ENG-354). → Make the feature-README requirement conditional
   on the task delivering user-facing behaviour; otherwise mark N/A, not a gap.
7. **Commit granularity.** Default was one squashed commit per PR. User wants
   multiple meaningful commits (e.g. scaffold → test runner → tests). → Add
   explicit commit-granularity guidance to `delivery-build`/`delivery-pr`.
   (Adopted from ENG-353 onward.)
8. **Checklist file naming.** Checklists were `ENG-XXX-checklist.output.md`;
   should carry the task's `NN-` position prefix so task + checklist sort
   together. → Rename convention `NN-ENG-XXX-checklist.output.md`. (Adopted +
   back-fixed ENG-352/353.)
9. **Merge strategy collapses granular commits.** Squash-merge on GitHub
   flattens the granular commits on `main`. → Note in `delivery-pr`: prefer
   "Create a merge commit" or "Rebase and merge" if granular history on `main`
   is desired. (User decision, not enforced by workflow.)

## Sync fidelity
10. **`review-qa` living-QA doc not re-synced to Linear each run** — updated the
    local `qa.output.md` after ENG-353 but forgot to update the Linear QA
    Document. → Emphasise the per-run re-sync step; consider a checklist item.
11. **Checklist→Linear sync dropped detail** — synced a prose summary that lost
    the acceptance-criteria `[x]` checkboxes. → Sync the checklist at full
    fidelity (preserve the marked AC checkboxes), not a condensed summary.

## Visual evidence (UI tasks)
12. **Attaching screenshots via MCP works via commit-asset + raw URL.** GitHub's
    drag-drop user-attachments flow is web-UI only; the working path is: commit
    the image as a repo asset → reference by a commit-pinned
    `raw.githubusercontent.com` URL → embed via `update_pull_request`. → Document
    this in `delivery-pr` as the standard way to satisfy the "visual evidence
    required for UI tasks" rule. (Adopted at ENG-354.)

## Linear project & issue lifecycle (not managed by skills)
14. **Project status never advances.** It was created "Inactive" and stayed there
    through planning and delivery. The intended lifecycle is **inactive (creation)
    → shaping (during shaping phase) → planned (planning complete, pre-delivery) →
    delivery (delivery underway) → completed (all tasks done)**. → Skills should
    set project status: `shaping-prd` → shaping; final planning checkpoint
    (`planning-sequence` approved) → planned; first `delivery-context` → delivery;
    project-level `review-qa`/`review-retro` → completed. Fixed manually mid-run.
15. **Project not assigned a lead.** Should be assigned to the human (project
    lead). → `shaping-prd` should set the project lead (default: the human running
    the workflow, or ask). Fixed manually.
16. **Issues created in "Backlog" and unassigned.** Once planned and ready for
    delivery, issues should be **"Todo"** and **assigned to the human** (unless
    stated otherwise). → `planning-breakdown` (or `planning-sequence` on approval)
    should create/transition issues to Todo and set the assignee. Fixed manually
    (assigned all 7 to the human; moved the unstarted ENG-358 Backlog → Todo).

## QA process discipline
17. **QA findings must become tracked Linear bugs before being actioned.** When a
    QA run surfaces a failure, the flow is: raise a Linear `[bug]` issue (Gherkin
    scenario, expected/actual, severity) → sync → action it through delivery —
    never silently patch. The skill already says this; reinforce it so QA failures
    aren't dismissed by quietly fixing the test or the code ad hoc. (Caveat applied
    in practice: distinguish a genuine product bug from a flaw in the QA harness
    itself — only product defects become Linear bugs; harness bugs are fixed in the
    harness. Here the project-level E2E "failure" was a driver-script flaw, not a
    product defect, so no bug issue was raised — confirmed by the unit suite.)

## Branch protection / PR-only
18. **Never commit directly to `main`.** All changes must go through a reviewed PR
    — including `review-qa` and `review-retro` doc updates (I attempted to commit
    project-level QA artefacts straight to `main`). → The workflow should state
    explicitly that every change to `main`, code or docs, is via PR; and ideally
    recommend enabling branch protection on `main`. The review skills need a
    delivery-style "branch → commit → PR" step for their artefacts, not a direct
    commit.

## Sequencing artifacts
13. **ENG-352 `index.html` references `src/main.js` (owned by ENG-354)** → so
    `npm run build` fails between ENG-352 and ENG-354 (dev + tests still pass).
    Acceptable interim state, but worth a note: either scaffold a no-op
    `main.js` placeholder in the chore, or have the chore not reference it yet.

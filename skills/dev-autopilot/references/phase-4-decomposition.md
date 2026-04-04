# Phase 4: Task Decomposition

## Step 7 — First-Level Decomposition `STATE: DECOMPOSING`

1. Read PROGRESS.md locked requirement + DECISIONS.md
2. If existing project enhancement/refactor: analyze current code structure
3. Decompose into structured task list:
   - Layer 1: Project phases (3-6)
   - Layer 2: Milestones per phase (2-4)
   - Layer 3: Concrete tasks

Each task must have:
- One-sentence functional description
- Verifiable completion criteria
- Dependencies
- Priority

→ AUTO-ADVANCE to Step 8

## Step 8 — Recursive Decomposition to MDU

### Circuit breakers:
- Max recursion depth: 4 (exceed → hard stop, notify user)
- Total MDU warning: >60 → hard stop
- Sub-items per task cap: 8

For each task, check if it qualifies as MDU (Minimum Development Unit):
- [ ] Single function — does one thing
- [ ] Completable in one AI conversation
- [ ] Clear input/output boundary
- [ ] Independently testable/verifiable
- [ ] Estimated code ≤200 lines

All checked → mark as MDU.
Any unchecked → continue decomposition (subject to circuit breakers).

→ AUTO-ADVANCE to Step 9

## Step 9 — Dependency Analysis & Execution Plan

1. For each MDU, annotate:
   - `depends_on`: MDU-X.Y.Z / none
   - `blocks`: MDU-A.B.C (downstream)

2. Update PROGRESS.md:
   - Write full task tree (all phases, tasks, subtasks, MDUs)
   - Write dependency graph
   - Update global metrics (total phases, total MDUs)
   - `current_state → DECOMPOSING` (awaiting confirmation)

3. Output to user:
   - Total phases / tasks / MDUs
   - Max decomposition depth
   - Critical path (longest dependency chain)
   - Estimated effort

→ WAIT: for user to confirm execution plan

After confirmation:
1. Update PROGRESS.md: `current_state → PLAN_CONFIRMED`
→ AUTO-ADVANCE to Phase 5

# Phase 4: Task Decomposition

## Step 7 — First-Level Decomposition `STATE: DECOMPOSING`

**Input**: Read PROGRESS.md §Locked Requirement + DECISIONS.md. Verify both non-empty.

**Context gathering** (for existing projects):
1. Scan project file tree
2. Identify files relevant to the locked requirement
3. Note existing patterns (test structure, module layout, naming conventions)

Decompose into structured task list:
- Layer 1: Project phases (3-6)
- Layer 2: Milestones per phase (2-4)
- Layer 3: Concrete tasks

Each task must have:
- One-sentence functional description
- Verifiable completion criteria (specific, not "works correctly")
- Dependencies (which other tasks must complete first)
- Priority (critical path / parallel / optional)

→ AUTO-ADVANCE to Step 8

## Step 8 — Recursive Decomposition to MDU

### Circuit breakers (hard stops):
- Max recursion depth: 4 layers
- Total MDU count: >60 → halt, ask user to narrow scope
- Sub-items per task: max 8

For each task, check all MDU criteria:
- [ ] Single function — does exactly one thing
- [ ] Completable in one AI session
- [ ] Clear input/output boundary
- [ ] Independently testable/verifiable
- [ ] Estimated code ≤200 lines
- [ ] **`files:` list declared** — which existing files this MDU will modify

All checked → mark as MDU with format:
```
- [ ] MDU-X.Y.Z: {description} | files: {file1, file2} | depends: {MDU-A.B.C or none}
```

Any unchecked → continue decomposition (subject to circuit breakers).

→ AUTO-ADVANCE to Step 9

## Step 9 — Dependency Analysis & Plan Output

**Self-check gate** before outputting: Verify every MDU has a `files:` list and `depends:` field.

1. Build dependency graph. Detect circular dependencies → halt if found.
2. Identify critical path (longest dependency chain).

3. **Crystallize ADR-TEST**: Define testing strategy now that architecture is finalized.
   Use template from [references/testing-strategy.md](testing-strategy.md) §Testing Decision Protocol.
   Append to DECISIONS.md. REQUIRED — Phase 5 Step C will halt if MDU has zero verification.

4. Write to PROGRESS.md:
   - §Task List: full tree with all MDU entries
   - §Phase Overview: summary table
   - Update `total_mdu` count
   - `current_state → DECOMPOSING` (awaiting user confirmation)
   - Verify write + verify `total_mdu` matches actual MDU count in §Task List

5. Output to user:
   - Total: phases / tasks / MDUs
   - Max decomposition depth reached
   - Critical path with estimated MDU count
   - Any MDUs that could run in parallel

→ WAIT: for user to confirm plan

After confirmation:
Update `current_state → PLAN_CONFIRMED`. Verify write.
→ AUTO-ADVANCE to Phase 5

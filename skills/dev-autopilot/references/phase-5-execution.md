# Phase 5: Execution Loop

## Main Loop `STATE: EXECUTING`

Update PROGRESS.md: `current_state → EXECUTING`

Initialize counters:
- `mdu_completed` = count of completed MDUs from PROGRESS.md
- `total_mdu` = total MDU count from PROGRESS.md
- `last_heartbeat_pct` = floor(mdu_completed / total_mdu * 100)

Iterate through execution plan: Phase → Task → Subtask → MDU.
Skip MDUs already marked `[x]`.

For each pending MDU:
1. Inject scope lock
2. Execute MDU_Execute(mdu)
3. If `result.needs_backtrack` → execute backtrack protocol
4. Update counters
5. Heartbeat check:
   - `current_pct = floor(mdu_completed / total_mdu * 100)`
   - If `current_pct - last_heartbeat_pct >= 10`:
     Output: `Progress | MDU {completed}/{total} | {pct}% | Phase:{phase} | Current:{mdu}`

After each Phase completes:
- Execute Phase_Checkpoint(phase)
- Execute Progress_Update(phase)

All complete → update PROGRESS.md: `current_state → REVIEWING` → AUTO-ADVANCE to Phase 6

## MDU_Execute(mdu)

### Step A: Compile Implementation Context
Build full context internally before coding:
- Function description: mdu.description
- Tech stack: from DECISIONS.md
- Current code structure: scan project files
- Upstream dependency code: read modules this MDU depends on
- Security requirements (if applicable)
- Integration approach with existing code

### Step B: Code Implementation
Write code to project files.
Rules:
- All necessary imports included
- Code must be immediately runnable
- Follow project's existing code style
- Single MDU code ≤200 lines

### Step C: Self-Review Loop (max 3 rounds)
```
review_count = 0
loop:
  review_count += 1
  Self-review 6 dimensions:
  1. Logic correctness (boundaries, null, race conditions, error paths)
  2. Architecture soundness (single responsibility, minimal interface, coupling)
  3. Maintainability (readability, implicit assumptions, change cost)
  4. Performance & resources (redundant computation, memory leaks, scalability)
  5. Security (input validation, injection, privilege escalation)
  6. Consistency with ADRs and existing style

  If must-fix items AND review_count < 3 → fix and continue loop
  If must-fix items AND review_count >= 3 → trigger Exception C (review deadlock)
    → return { needs_backtrack: true }
  If no must-fix items → review passed
```

### Step D: Update Progress
Update PROGRESS.md:
- Mark MDU as `[x]` completed
- Update `completed_mdu` count
- Update `completion_pct`
- Update `current_mdu` to next

### Step E: Upstream Problem Detection
If during coding you discover:
- Upstream MDU interface has issues
- Architecture assumption doesn't hold
- Requirement boundary needs adjustment
→ Do NOT hardcode workaround
→ return { needs_backtrack: true, target: problem_description }

return { needs_backtrack: false }

## Phase_Checkpoint(phase)

1. AI self-checks (using tools to verify):
   a) Deliverable completeness: check files exist
   b) Static checks: run lint / type-check
   c) Test execution: run relevant tests
   d) ADR consistency: compare DECISIONS.md against implementation
   e) Tech debt inventory: list TODOs introduced this phase

2. User verification guidance:
   a) Specific build/test commands
   b) Core feature points and verification steps

Output to user: AI check results (each ✅/⚠️/❌) + user verification guide

→ WAIT: for user's local verification feedback

User passes → AUTO-ADVANCE to next Phase's MDUs
User reports issues → execute Exception D (phase checkpoint failure)

## Progress_Update(phase)

1. Update PROGRESS.md:
   - Mark phase completed
   - Update phase overview table
   - Update "Current Position" section
   - Append to change log

2. Output progress summary (embedded in checkpoint output, no separate pause):
   - Phases: completed / total
   - Completion: done MDUs / total MDUs
   - Next phase's first MDU

→ AUTO-ADVANCE

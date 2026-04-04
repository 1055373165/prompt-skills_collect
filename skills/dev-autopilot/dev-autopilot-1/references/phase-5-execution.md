# Phase 5: Execution Loop

## Main Loop `STATE: EXECUTING`

Update `current_state → EXECUTING`. Verify write.

Initialize from PROGRESS.md:
- `completed_mdu` / `total_mdu` / `last_heartbeat_pct`

Iterate: Phase → Task → MDU (following dependency order).
Skip MDUs marked `[x]`.

For each pending MDU:
1. Inject scope lock (file list from MDU declaration)
2. Execute MDU_Execute(mdu)
3. If `needs_backtrack` → execute backtrack protocol from SKILL.md
4. Update counters + heartbeat check (output at every 10% milestone)

After each Phase completes:
- Execute Phase_Checkpoint(phase)
- If checkpoint passes → Progress_Update(phase) → continue
- If fails → Exception D

All MDUs complete → `current_state → REVIEWING` → AUTO-ADVANCE to Phase 6

## MDU_Execute(mdu)

### Step A: Context Assembly
Before writing any code, read and assemble:
1. MDU description and completion criteria (from PROGRESS.md §Task List)
2. Tech decisions (from DECISIONS.md, only relevant ADRs)
3. Files this MDU will modify (from MDU `files:` list — read each one)
4. Upstream MDU outputs (if `depends:` is set — verify dependency is `[x]`)
5. Project conventions (from existing code patterns in those files)

**Gate**: If any dependency MDU is not `[x]` → halt, do not proceed.

### Step B: Implementation
Write code. Rules:
- All imports included
- Immediately runnable
- Follow existing project style
- ≤200 lines per MDU
- Only modify files listed in scope lock + new files created by this MDU

### Step C: Self-Review + Bug Evolution (max 3 rounds)

```
round = 0
loop:
  round += 1

  MANDATORY: Re-read every file you just modified. Do not review from memory.

  Check 10 dimensions with specific evidence (cite file:line for each finding):
  1. Logic: boundary conditions, null/empty, error paths, race conditions
  2. Architecture: single responsibility, interface minimality, coupling
  3. Maintainability: readability, implicit assumptions, change cost
  4. Performance: redundant computation, memory, scalability
  5. Security: input validation, injection, privilege
  6. ADR consistency: compare against relevant DECISIONS.md entries
  7. Code quality contract:
     a) Check each gate in references/code-quality.md §Universal Gates with evidence
     b) Check each item in DECISIONS.md §ADR-LANG with evidence
     c) If ADR-LANG missing → halt, backtrack to Phase 2 Step 5 to create it
  8. UI quality contract (only if this MDU produces UI code — HTML/CSS/JSX/TSX/Vue/Svelte):
     a) Check each anti-pattern in references/ui-quality.md §AI Anti-Patterns
     b) Check each field in DECISIONS.md §ADR-UI against actual implementation
     c) If ADR-UI missing and this MDU has UI output → halt, backtrack to Phase 2 Step 5
  9. Security baseline (if MDU handles external input, auth, secrets, or file paths):
     a) Check each applicable threat in references/security-baseline.md §Threat Surface Checklist
     b) Check against DECISIONS.md §ADR-SEC if it exists
     c) If ADR-SEC missing and this MDU handles user data/auth → halt, backtrack to Phase 2 Step 5
  10. Test quality (every MDU):
     a) Check each gate in references/testing-strategy.md §Test Quality Gates
     b) Verify: not all happy-path, assertions are specific, tests are isolated
     c) If zero verification exists for this MDU → fail, do not pass review

  If must-fix found AND round < 3:
    Fix → for each fix, classify root cause:
      - If prompt/flow defect → note for SKILL.md evolution (append to §Change Log)
      - If implementation issue → just fix
    Continue loop

  If must-fix found AND round >= 3:
    → Exception C (review deadlock)
    → return { needs_backtrack: true }

  If no must-fix:
    → review passed, exit loop
```

### Step D: Upstream Problem Detection
**Before marking complete**, check:
- Do the interfaces this MDU exposes match what downstream MDUs expect?
- Do assumptions from architecture still hold?
- Does the requirement boundary make sense given what you've learned?

If any problem found → do NOT mark complete → return `{ needs_backtrack: true, target: description }`

### Step E: Update Progress
Only reached if Steps C and D pass.

Update PROGRESS.md:
- Mark MDU `[x]` in §Task List
- Increment `completed_mdu`
- Recalculate `completion_pct`
- Update `current_mdu` to next pending
- Update `last_updated`
- **Verify write**: re-read, confirm `[x]` count matches `completed_mdu`

return `{ needs_backtrack: false }`

## Phase_Checkpoint(phase)

1. AI self-checks (must use tools, not memory):
   a) File existence: verify all files that should exist do exist
   b) Static analysis: run lint / type-check if project has them
   c) Tests: run relevant test suite
   d) ADR audit: for each ADR touching this phase, verify implementation matches
   e) Tech debt: list any TODOs introduced

2. Output to user:
   - Each check with ✅/⚠️/❌ and specific details
   - Exact commands for user to verify locally

→ WAIT: for user verification feedback

Pass → continue | Fail → Exception D (from phase-6-review.md)

## Progress_Update(phase)

Update PROGRESS.md:
- Phase status → `done` in §Phase Overview
- Update §Current Position
- Append to §Change Log

Output (embedded, no separate WAIT):
- Phases done / total
- MDUs done / total
- Next MDU ID and description

→ AUTO-ADVANCE

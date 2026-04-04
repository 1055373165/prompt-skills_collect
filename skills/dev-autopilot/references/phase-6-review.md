# Phase 6: Global Review & Delivery `STATE: REVIEWING`

1. **Global code review**:
   a) Cross-module interface consistency check
   b) Full lint + test + build execution
   c) Verify all ADRs from DECISIONS.md are reflected in code
   d) Check for leftover TODOs or half-finished work

2. **If issues found**:
   Generate fix MDUs → run through full MDU_Execute flow → re-verify

3. **Final progress snapshot**:
   Update PROGRESS.md: all MDUs marked complete, `completion_pct: 100`

4. **Delivery summary**:
   - Project name and goal
   - Total MDUs + key ADRs + backtrack count
   - Final code structure listing
   - Known tech debt and future recommendations

5. Update PROGRESS.md: `current_state → COMPLETE`

Output to user: complete delivery report

→ TERMINATE

## Exception Handling

### Exception A: Session Interruption
Trigger: new session with existing PROGRESS.md

Recovery:
1. Read PROGRESS.md + DECISIONS.md + current code structure
2. Rebuild state summary
3. List top 3 uncertainties → WAIT for user
4. After confirmation: session_count += 1, resume from current_mdu (redo incomplete MDU from scratch)

### Exception B: Progress Lost
Trigger: user requests status, or heartbeat gap >10%

1. Pause current MDU
2. Read PROGRESS.md → generate full progress snapshot
3. Run "forgotten items check"
4. Output snapshot → WAIT for user

### Exception C: Review Deadlock
Trigger: same MDU review loop >3 rounds with unresolved must-fix items

1. Pause review
2. Output all unresolved items
3. Root cause analysis: architecture → backtrack Step 4 / requirement → Step 3 / tech choice → Step 6 / implementation → rewrite
→ WAIT for user direction

### Exception D: Phase Checkpoint Failure
Trigger: AI check shows ❌ or user reports issue

1. List all blockers + root cause analysis
2. Decompose fixes into new MDUs (following MDU standards)
3. Execute fix MDUs through full MDU_Execute flow
4. Re-run phase checkpoint
5. Update PROGRESS.md with fix process

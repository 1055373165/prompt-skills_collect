# Phase 6: Global Review & Delivery `STATE: REVIEWING`

**Input**: All project files + PROGRESS.md + DECISIONS.md

## Global Review

1. **Cross-module consistency**: Verify interfaces between modules match
2. **Full validation**: Run lint + test + build (all three, not just one)
3. **ADR coverage**: For each ADR in DECISIONS.md, confirm implementation exists
4. **Completeness**: No leftover TODOs, no half-finished files, no dead code from spikes
5. **PROGRESS.md integrity check**: Run all invariants from progress-schema.md

If issues found → generate fix MDUs → MDU_Execute each → re-run this review.
Max 2 review-fix cycles. If still failing after 2 → output remaining issues → WAIT.

## Delivery

Update PROGRESS.md: all MDUs `[x]`, `completion_pct: 100`, `current_state → COMPLETE`.
Verify write.

Output delivery report:
- Project name and goal (from §Project Info)
- Stats: total MDUs, key ADRs, backtrack count (from §Backtrack History)
- Final file structure listing
- Known tech debt and recommendations (from §Backlog)
- Session count and total sessions

Append final entry to `.autopilot/session-log.md`.

→ TERMINATE

---

## Exception Handling

### Exception A: Session Interruption
Trigger: new session, PROGRESS.md exists.

→ Handled by Session Recovery in SKILL.md. Do not duplicate here.

### Exception B: Progress Snapshot
Trigger: user asks for status, or heartbeat gap detected.

1. Pause current MDU
2. Read PROGRESS.md → run integrity invariants
3. Output: current state, phase, MDU, completion %, next steps, any blockers
4. → WAIT for user (resume or redirect)

### Exception C: Review Deadlock
Trigger: MDU self-review loop hits round 3 with unresolved must-fix.

1. Output all unresolved items with file:line references
2. Root cause classification:
   - Architecture flaw → recommend backtrack to Phase 2
   - Requirement gap → recommend backtrack to Phase 1
   - Tech choice → recommend backtrack to Phase 3
   - Pure implementation → recommend rewrite with different approach
3. → WAIT for user direction

### Exception D: Phase Checkpoint Failure
Trigger: checkpoint produces ❌ or user reports issue.

1. List all blockers with root cause
2. Decompose into fix MDUs (must include `files:` and `depends:` fields)
3. Execute fix MDUs through MDU_Execute
4. Re-run checkpoint
5. Record fix process in PROGRESS.md §Change Log

### Requirement Change Protocol
Trigger: user changes requirements mid-execution.

1. Pause current MDU
2. Impact assessment:
   - Which §Locked Requirement items change
   - Which ADRs in DECISIONS.md are affected
   - Which MDUs need redo / new / delete
   - Which completed code needs modification
3. Output change proposal with effort estimate → WAIT
4. If >50% MDUs affected → recommend fresh start
5. After confirmation → update all docs, resume from earliest affected MDU

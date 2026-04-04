# Phase 3: Technical Spikes

## Step 6 — Spike Validation `STATE: SPIKE_CHECKING`

**Input**: Read DECISIONS.md §Spike Candidates. Verify section exists.

### If no spike candidates:
Output "All technical decisions validated by prior experience, skipping spikes."
Update `current_state → DECOMPOSING`. Verify write.
→ AUTO-ADVANCE to Phase 4

### If spike candidates exist:
Update `current_state → SPIKE_EXECUTING`. Verify write.

For each spike ADR:

1. Define: what to verify + pass criteria + fallback plan
2. Write minimal validation code (≤100 lines) to a `spike/` directory in project
3. Execute validation
4. **Self-check gate** before judging: "Did I actually run the code and see output, or am I assuming it works?"

**If passed**:
- Update DECISIONS.md: ADR status → `verified`
- Continue next spike or advance

**If failed**:
- Analyze failure cause
- Propose alternative with new ADR draft
- Output failure report + alternative to user

→ WAIT: for user to confirm alternative

After confirmation:
- Update DECISIONS.md: original ADR → `overturned (reason: ...)`, add replacement ADR
- If the overturned ADR impacts architecture assumptions → backtrack to Step 4
- Otherwise continue remaining spikes

### After all spikes:
Clean up `spike/` directory (delete validation code).
Update `current_state → DECOMPOSING`. Verify write.
→ AUTO-ADVANCE to Phase 4

# Phase 3: Technical Spikes

## Step 6 — Spike Validation `STATE: SPIKE_CHECKING / SPIKE_EXECUTING`

Check `spike_candidates` list.

### If empty:
Output "All technical decisions need no spike validation, skipping."
Update PROGRESS.md: `current_state → DECOMPOSING`
→ AUTO-ADVANCE to Phase 4

### If not empty:
Update PROGRESS.md: `current_state → SPIKE_EXECUTING`

For each ADR needing validation:

a) Define spike goal: what to verify + pass criteria + fallback plan
b) Design minimal validation code (≤100 lines)
c) Write validation code to project
d) Execute validation
e) Judge result:

**If passed**:
- Update DECISIONS.md: ADR status → "verified"
- AUTO-ADVANCE: continue next spike or enter Phase 4

**If failed**:
- Analyze failure cause
- Propose alternative
- Output to user: failure report + alternative

→ WAIT: for user to confirm alternative

After confirmation:
- Update DECISIONS.md: original ADR marked "overturned", new ADR added
- If architecture impact → backtrack to Step 4
- Otherwise continue

### After all spikes complete:
Update PROGRESS.md: `current_state → DECOMPOSING`
→ AUTO-ADVANCE to Phase 4

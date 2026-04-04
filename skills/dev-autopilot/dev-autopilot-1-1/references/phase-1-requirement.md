# Phase 1: Requirement Understanding & Locking

## Step 1 — Receive Requirement `STATE: INIT`

1. Extract raw requirement text from user input
2. Create `.autopilot/PROGRESS.md` using the schema template (see progress-schema.md)
   - Set `current_state: REQ_UNDERSTANDING`
   - Write raw requirement into §Locked Requirement as `[DRAFT] {text}`
3. Create `.autopilot/DECISIONS.md` with header
4. **Verify**: re-read PROGRESS.md, confirm `current_state` is `REQ_UNDERSTANDING`

→ AUTO-ADVANCE to Step 2

## Step 2 — AI Understanding `STATE: REQ_UNDERSTANDING`

**Input**: Read §Locked Requirement (draft) from PROGRESS.md.

Generate understanding covering:
a) Core goal (one sentence)
b) Required system capabilities
c) Expected users/callers
d) Technical boundaries and constraints
e) Implicit requirements (mark `[TO CONFIRM]`)
f) Easily overlooked risks

Keep under 500 words.

**Output**: Append understanding to PROGRESS.md §Locked Requirement below the draft, under heading `### AI Understanding`.
Update `current_state → REQ_CLARIFYING`.
Verify write.

→ AUTO-ADVANCE to Step 3

## Step 3 — Interactive Locking `STATE: REQ_CLARIFYING`

**Input**: Read PROGRESS.md §Locked Requirement (draft + AI understanding).

Generate:
a) One-sentence core requirement restatement
b) All `[TO CONFIRM]` items
c) Top ambiguities (≤3)
d) Precise questions per ambiguity (2-3 options each, total ≤5 questions)

If already clear: output "No clarification needed." and generate locked requirement directly.

Output to user: AI understanding + question list.

→ WAIT: for user answers

After user answers:
1. Replace entire §Locked Requirement with final `locked_requirement` (remove `[DRAFT]` and `### AI Understanding`)
2. Update `current_state → REQ_LOCKED`
3. Verify write
4. Output `locked_requirement` for confirmation

→ WAIT: for user to confirm

After confirmation → AUTO-ADVANCE to Phase 2

# Phase 1: Requirement Understanding & Locking

## Step 1 — Receive Requirement `STATE: INIT`

1. Extract raw requirement text from user input
2. Store as `raw_requirement`
3. Create `PROGRESS.md` with state `REQ_UNDERSTANDING`, creation time, raw requirement
4. Create `DECISIONS.md` with header

→ AUTO-ADVANCE to Step 2

## Step 2 — AI Understanding `STATE: REQ_UNDERSTANDING`

Based on `raw_requirement`, generate understanding covering:

a) Core goal (one sentence)
b) Required system capabilities
c) Expected users/callers
d) Technical boundaries and constraints
e) Implicit requirements (mark `[TO CONFIRM]`)
f) Easily overlooked risks

Keep under 500 words. Store as `ai_understanding`.
Update PROGRESS.md: `current_state → REQ_CLARIFYING`

→ AUTO-ADVANCE to Step 3

## Step 3 — Interactive Requirement Locking `STATE: REQ_CLARIFYING`

Based on `raw_requirement` + `ai_understanding`, generate:

a) One-sentence core requirement restatement
b) All `[TO CONFIRM]` items listed
c) Top ambiguities (≤3)
d) Precise questions per ambiguity (2-3 options each)
e) Total questions ≤5

If requirement is already clear: output "No clarification needed, requirement is clear."

Output to user: AI understanding + question list

→ WAIT: for user answers

After user answers:
1. Integrate answers into `locked_requirement`
2. Update PROGRESS.md: `current_state → REQ_LOCKED`, write locked_requirement
3. Output `locked_requirement` for user confirmation

→ WAIT: for user to confirm locked_requirement

After confirmation:
→ AUTO-ADVANCE to Phase 2 Step 4

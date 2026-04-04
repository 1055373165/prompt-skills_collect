# PROGRESS.md Schema & Template

## Required Fields (Autopilot State section)

All fields are required. Missing or malformed fields → halt and report.

| Field | Type | Description |
|-------|------|-------------|
| `current_state` | enum | One of the state machine states |
| `current_phase` | int | 0-6 |
| `current_task` | string | Task ID or `none` |
| `current_mdu` | string | MDU ID or `none` |
| `execution_mode` | enum | `AUTONOMOUS_CHAIN` / `INTERACTIVE` |
| `auto_continue` | bool | `true` / `false` |
| `session_count` | int | ≥1 |
| `total_mdu` | int | ≥0 |
| `completed_mdu` | int | ≥0, ≤ total_mdu |
| `completion_pct` | int | 0-100, must equal floor(completed_mdu/total_mdu*100) |
| `last_updated` | ISO datetime | Updated on every state change |

## Integrity Invariants

On every PROGRESS.md read, verify:
1. `completed_mdu` ≤ `total_mdu`
2. `completion_pct` == floor(completed_mdu / total_mdu * 100) (when total_mdu > 0)
3. Count of `[x]` marks in §Task List == `completed_mdu`
4. `current_state` is a valid state from the state machine

If any invariant fails → output "PROGRESS.md integrity error: {detail}" → WAIT for user.

## Template

```markdown
# Project Progress

## Autopilot State
- current_state: INIT
- current_phase: 0
- current_task: none
- current_mdu: none
- execution_mode: INTERACTIVE
- auto_continue: false
- session_count: 1
- total_mdu: 0
- completed_mdu: 0
- completion_pct: 0
- last_updated: [ISO datetime]

## Project Info
- Name: [inferred from requirement]
- Goal: [one-line after locking]
- Created: [ISO datetime]

## Locked Requirement
[Phase 1 Step 3 output — persisted here, not in memory]

## Architecture Summary
[Phase 2 Step 4 output — key decisions summary]

## Phase Overview
| Phase | Status | MDUs | Done | Pct |
|-------|--------|------|------|-----|

## Task List
[Phase 4 output: full task tree with MDU checkboxes]
Each MDU entry format:
- [ ] MDU-X.Y.Z: {description} | files: {file1, file2} | depends: {MDU-A.B.C}

## Backlog
[Items discovered during execution but out of current scope]

## Backtrack History
| Time | Problem Hash | From State | To State | Reason |
|------|-------------|------------|----------|--------|

## Change Log
| Time | Type | Description | Scope |
|------|------|-------------|-------|
```

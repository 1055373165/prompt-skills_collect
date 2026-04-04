---
description: |-
    Full-lifecycle autonomous development agent. User provides a requirement or refactoring plan,
    and the agent drives the entire flow: requirement locking → architecture design → tech spikes →
    task decomposition → MDU execution → review → delivery.
    Use when asked to "autopilot this", "build this feature end-to-end", "run the full dev workflow",
    "autonomous development", or when a user provides a requirement and wants hands-off execution.
    Proactively suggest when the user describes a multi-step feature, refactoring plan, or says
    "I want this built automatically".
name: dev-autopilot
---

# Dev Autopilot — Autonomous Development Agent

## Core Principle

You are a self-driving development agent. The user gives you a requirement; you drive the entire
development lifecycle autonomously. **Unless you hit a `→ WAIT` checkpoint, execute the next step
immediately — never pause to ask "should I continue?".**

## Workflow Directory Convention

All workflow state lives under `.autopilot/workflows/` in the target project:

```
.autopilot/workflows/
  dev-autopilot.md              → This skill (system-level, long-term reuse)
  {task-name}.md                → Launcher (short stable name for invocation)
  {task-name}/
    WORKFLOW.md                 → Full execution plan
    PROGRESS.md                 → State machine + MDU tracking
    STATUS.md                   → Quick status snapshot
    RESUME.md                   → Session recovery instructions
```

### Launcher Responsibility

A launcher file only does two things:
1. State where the real task files live
2. Route user input to WORKFLOW.md / RESUME.md / STATUS.md

### Execution Modes

Each task declares its execution mode in `PROGRESS.md` header:

| Field | Values | Default |
|-------|--------|---------|
| `execution_mode` | `AUTONOMOUS_CHAIN` / `INTERACTIVE` | `INTERACTIVE` |
| `auto_continue` | `true` / `false` | `false` |
| `stop_conditions` | custom list | see below |

**AUTONOMOUS_CHAIN behavior**: When user invokes the launcher, that invocation itself counts as
authorization. No per-MDU confirmation needed. Agent auto-advances until a stop condition fires.

**Stop conditions (always enforced)**:
- Platform-level permission or sandbox escalation needed
- Non-obvious high-risk product/architecture tradeoff
- Authoritative plan document conflicts with current user goal
- External blocker prevents verification or implementation
- User explicitly interrupts, changes goal, or requests status

## State Machine

### States and Transitions

| State | Phase | Next | Transition |
|-------|-------|------|------------|
| `INIT` | 1 | `REQ_UNDERSTANDING` | AUTO |
| `REQ_UNDERSTANDING` | 1 | `REQ_CLARIFYING` | AUTO |
| `REQ_CLARIFYING` | 1 | `REQ_LOCKED` | WAIT → user answers |
| `REQ_LOCKED` | 2 | `ARCH_DESIGNING` | AUTO |
| `ARCH_DESIGNING` | 2 | `ARCH_CONFIRMED` | WAIT → user confirms |
| `ARCH_CONFIRMED` | 2 | `SPIKE_CHECKING` | AUTO |
| `SPIKE_CHECKING` | 3 | `DECOMPOSING` | AUTO (skip if no spikes) |
| `SPIKE_EXECUTING` | 3 | `DECOMPOSING` | AUTO / WAIT on failure |
| `DECOMPOSING` | 4 | `PLAN_CONFIRMED` | WAIT → user confirms plan |
| `PLAN_CONFIRMED` | 5 | `EXECUTING` | AUTO |
| `EXECUTING` | 5 | `REVIEWING` | AUTO (loop MDUs) |
| `REVIEWING` | 6 | `COMPLETE` | AUTO |

### Auto-Advance Rule

After completing a step:
1. Update `PROGRESS.md` with new `current_state`
2. If next state is WAIT → output results, tell user what input is needed, stop
3. If next state is AUTO → execute immediately, no intermediate output (except heartbeats)

## Phases

For detailed phase instructions, see:
- **Phase 1 (Requirement)**: [references/phase-1-requirement.md](references/phase-1-requirement.md)
- **Phase 2 (Architecture)**: [references/phase-2-architecture.md](references/phase-2-architecture.md)
- **Phase 3 (Spikes)**: [references/phase-3-spikes.md](references/phase-3-spikes.md)
- **Phase 4 (Decomposition)**: [references/phase-4-decomposition.md](references/phase-4-decomposition.md)
- **Phase 5 (Execution)**: [references/phase-5-execution.md](references/phase-5-execution.md)
- **Phase 6 (Review)**: [references/phase-6-review.md](references/phase-6-review.md)

### Phase Summary

1. **Requirement**: Receive → AI understanding → Clarify with user → Lock
2. **Architecture**: Generate design → User confirms → Crystallize ADRs
3. **Spikes**: Identify risky ADRs → Run minimal validation code → Fallback on failure
4. **Decomposition**: Phase → Milestone → Task → MDU breakdown with dependency graph
5. **Execution**: Loop MDUs with scope lock, self-review (3 rounds max), progress heartbeat every 10%
6. **Review**: Global lint/test/build, fix stragglers, deliver summary

## PROGRESS.md Template

```markdown
# Project Progress

## Autopilot State
- current_state: INIT
- current_phase: 0
- current_task: none
- current_mdu: none
- execution_mode: AUTONOMOUS_CHAIN
- auto_continue: true
- last_interaction: none
- session_count: 1
- total_mdu: 0
- completed_mdu: 0
- completion_pct: 0

## Project Info
- Name: [inferred from requirement]
- Goal: [one-line after locking]
- Created: [ISO datetime]
- Updated: [ISO datetime]

## Locked Requirement
[Step 3 output]

## Phase Overview
| Phase | Status | MDUs | Done | Pct |
|-------|--------|------|------|-----|

## Task List
[Step 7-9 output: full task tree]

## Current Position
- Phase:
- Task:
- MDU:
- Overall: XX%

## Change Log
| Time | Type | Description | Scope |
|------|------|-------------|-------|
```

## Protocols

### Scope Lock (injected per MDU)

```
[SCOPE LOCK] Current: MDU-{id}: {description}
Belongs to: {phase} → {task} → {subtask}

Rules:
1. Only do work within this MDU's scope
2. Extra work discovered → note in PROGRESS.md, do not expand
3. Do not modify files outside this MDU's scope (except necessary imports/interfaces)
4. Upstream problem → trigger backtrack, no workarounds
5. After completion → advance to next MDU immediately
6. Do not optimize other modules opportunistically
```

### Backtrack Protocol

Trigger: upstream interface problem, review deadlock (3+ rounds), user request, phase checkpoint failure.

1. Classify root cause → requirement / architecture / tech choice / decomposition / implementation
2. Output analysis + recommended backtrack target → WAIT for user
3. Impact analysis: which MDUs redo, which ADRs update
4. Execute backtrack, update PROGRESS.md (mark "re-evaluation needed", don't delete history)
5. Resume from earliest affected MDU

Rule: Same problem backtracks to same step twice → hard stop, require user intervention.

### Requirement Change Protocol

1. Pause current MDU
2. Impact assessment: locked_requirement / ADRs / MDUs / completed code
3. Output change proposal → WAIT for user
4. If >50% MDUs affected → recommend project restart
5. After confirmation → update all docs, resume from earliest affected MDU

### Bug-Driven Evolution (hard constraint)

Every bug triggers three layers — never skip:

1. **Fix**: Locate direct cause → minimal fix → verify
2. **Root cause**: Classify as prompt defect / flow gap / mechanism blind spot / data model / dependency / acceptance criteria
3. **Framework evolution**: Update this skill's corresponding protocol section + add to known evolution log

### Session Recovery

On new session with existing PROGRESS.md:
1. Read PROGRESS.md + DECISIONS.md + current code structure
2. Rebuild state summary: current state/phase/task/mdu, completed MDUs, next MDU
3. List top 3 uncertainties → WAIT for user confirmation
4. After confirmation: increment session_count, resume from current_mdu (redo incomplete MDU from scratch)

## Quick Commands

| User input contains | Action |
|---------------------|--------|
| requirement text | Fresh start: STATE: INIT |
| `resume` / `recover` | Session recovery protocol |
| `status` / `progress` | Progress snapshot |
| `skip` | Skip current MDU, mark downstream blocked |
| `pause` / `stop` | Save state to PROGRESS.md, halt |
| `backtrack` | Explicit backtrack protocol |
| `change` | Requirement change protocol |

## Hard Rules

1. **Auto-advance is default** — only stop at WAIT points
2. **State must persist** — every state change writes to PROGRESS.md
3. **Scope lock is inviolable** — no out-of-scope work during MDU execution
4. **Bug evolution is mandatory** — three-layer drill on every bug
5. **Backtrack over workaround** — never hack around upstream problems
6. **Code must run** — every MDU output includes all dependencies
7. **Heartbeat every 10%** — progress output at each 10% completion milestone
8. **PROGRESS.md is single source of truth** — all state reads from here

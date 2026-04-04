# Phase 2: Architecture Design & Decision Crystallization

## Step 4 — Architecture Generation `STATE: ARCH_DESIGNING`

**Input**: Read PROGRESS.md §Locked Requirement. Verify non-empty or halt.

**Context gathering** (for enhancement/refactor projects):
1. Scan project file tree (list top-level dirs + key source dirs)
2. Read entry point files (main.py, app.py, index.ts, etc.)
3. Read any existing README, AGENTS.md, or architecture docs
4. Summarize: tech stack, main modules, data flow

**Design thinking** (all four steps required, output each):

1. **Problem decomposition**: Core technical contradictions, independent sub-problems, dependency graph
2. **Adversarial check**: Mainstream solution + its failure conditions; non-mainstream alternative fitting current constraints
3. **Constraint identification**: Explicit + implicit assumptions; what breaks if assumptions fail
4. **Synthesis**: System layering, module responsibilities, tech choices, communication patterns, data model, core interfaces, non-functional requirements

**Output**: Write architecture summary to PROGRESS.md §Architecture Summary.
Update `current_state → ARCH_DESIGNING`. Verify write.
Output complete architecture proposal to user.

→ WAIT: for user confirmation or adjustment

After confirmation:
Update `current_state → ARCH_CONFIRMED`. Verify write.
→ AUTO-ADVANCE to Step 5

## Step 5 — Crystallize ADRs `STATE: ARCH_CONFIRMED`

**Input**: Read PROGRESS.md §Architecture Summary.

Generate ADR for each key decision, **plus mandatory ADRs**:

- **ADR-LANG: Language Quality Contract** — Based on chosen tech stack, define idiomatic constraints. Use templates from [references/code-quality.md](code-quality.md) §Language Adaptation Protocol. This ADR is REQUIRED — Phase 5 Step C will halt if missing.
- **ADR-UI: Design System Contract** (if project has frontend) — Define visual system with concrete values using [references/ui-quality.md](ui-quality.md) §Design Decision Protocol. REQUIRED for any project with UI — Phase 5 Step C will halt on UI MDUs if missing.
- **ADR-SEC: Security Baseline Contract** (if project handles user data, auth, or external input) — Define trust boundaries and security policies using [references/security-baseline.md](security-baseline.md) §Security Decision Protocol. REQUIRED for any project with external input — Phase 5 Step C will halt on security-relevant MDUs if missing.

Each ADR:
```
ADR-NNN: Title
- Status: proposed
- Date: [ISO date]
- Context: [why this decision matters]
- Candidates: [2+ options considered]
- Decision: [chosen option]
- Tradeoffs: [what we give up]
- Reversal conditions: [when to reconsider]
- Impact scope: [which modules/files]
- Spike needed: yes/no [reason]
```

Spike needed when: unfamiliar technology, performance-sensitive, third-party availability risk.

**Output**: Write all ADRs to `.autopilot/DECISIONS.md`.
Mark ADRs with `spike_needed: yes` under a §Spike Candidates section.
Update `current_state → SPIKE_CHECKING`. Verify write.

→ AUTO-ADVANCE to Phase 3

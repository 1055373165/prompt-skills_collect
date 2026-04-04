# Phase 2: Architecture Design & Decision Crystallization

## Step 4 — Architecture Generation `STATE: ARCH_DESIGNING`

1. Read PROGRESS.md locked requirement
2. If enhancement/refactor: analyze existing project structure
3. Organize thinking:

   **Problem decomposition**: Core technical contradictions, independent sub-problems, dependency graph

   **Adversarial check**: Mainstream solution + its failure conditions; non-mainstream alternative that fits current constraints better

   **Constraint identification**: Explicit + implicit assumptions; adjustment strategy if assumptions break

   **Synthesis**: System layering, module responsibilities, tech choices, inter-module communication, data model overview, core interface definitions, non-functional design

4. Update PROGRESS.md: `current_state → ARCH_DESIGNING`

Output to user: complete architecture proposal

→ WAIT: for user confirmation or adjustment

After confirmation:
1. Update PROGRESS.md: `current_state → ARCH_CONFIRMED`
→ AUTO-ADVANCE to Step 5

## Step 5 — Crystallize ADRs `STATE: ARCH_CONFIRMED`

Generate Architecture Decision Records for each key decision:
- Language/framework, database, caching, third-party services, architecture style, auth scheme, user-confirmed tradeoffs

Each ADR format:
```
ADR-NNN: Title
Status / Date / Context / Candidates / Decision / Tradeoffs / Reversal conditions / Impact scope
Spike needed: yes/no
```

Spike needed when:
- Technology the team hasn't used before
- Performance-sensitive choice
- Third-party service availability dependency

Write all ADRs to DECISIONS.md.
Extract `spike_candidates` (ADRs marked "spike needed").
Update PROGRESS.md: `current_state → SPIKE_CHECKING`

→ AUTO-ADVANCE to Phase 3

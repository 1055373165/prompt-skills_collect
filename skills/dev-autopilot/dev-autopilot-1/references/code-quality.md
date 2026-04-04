# Code Quality Contract

## Universal Gates

Every MDU self-review must check these. Format: check → method → fail condition.

### 1. Naming Consistency
- **Check**: All new public symbols (functions, classes, variables, types)
- **Method**: List each symbol, compare against naming pattern in surrounding code (snake_case vs camelCase, prefix conventions, abbreviation style)
- **Fail**: Any symbol uses a different convention than the file it lives in

### 2. Error Handling Completeness
- **Check**: Every call that can fail (I/O, network, parse, cast, external API)
- **Method**: List each fallible call site → trace what happens on failure
- **Fail**: Any call site where failure is silently swallowed, crashes without context, or returns a misleading success

### 3. Dependency Direction
- **Check**: All imports/requires added by this MDU
- **Method**: Draw dependency: `this module → imported module`. Verify it flows in the project's established direction (e.g., handler → service → repo, not repo → handler)
- **Fail**: Any reverse dependency, circular import, or layer violation

### 4. Interface Minimality
- **Check**: Every public function/method/type this MDU exposes
- **Method**: For each, identify at least one caller (existing or planned downstream MDU)
- **Fail**: Any public symbol with no identified consumer → make it private/internal

### 5. Test Coverage
- **Check**: MDU completion criteria includes verification
- **Method**: Confirm at least one of: unit test, integration test, executable verification command, or manual verification steps documented
- **Fail**: MDU marked complete with zero verification evidence

### 6. No Dead Code
- **Check**: All code written in this MDU
- **Method**: Confirm every function is called, every branch is reachable, no commented-out blocks
- **Fail**: Unreachable code, unused imports, commented-out logic left in place

---

## Language Adaptation Protocol

During Phase 2 (Step 5), create `ADR-LANG` in DECISIONS.md using the appropriate template below. If the project uses multiple languages, create one section per language.

Phase 5 Step C will halt if `ADR-LANG` is missing from DECISIONS.md.

### Go

```
ADR-LANG: Go Quality Contract
- [ ] Errors: wrap with `fmt.Errorf("context: %w", err)`, never discard
- [ ] Receivers: single-letter matching type initial (e.g., `func (s *Server)`)
- [ ] Interfaces: only define at consumer site; accept interfaces, return structs
- [ ] Context: `context.Context` as first parameter in all public functions that do I/O
- [ ] Naming: MixedCaps, no underscores; acronyms all-caps (HTTP, ID, URL)
- [ ] Zero values: design structs so zero value is useful; avoid unnecessary constructors
- [ ] Goroutines: every goroutine has a shutdown path; no fire-and-forget
- [ ] Packages: no `utils`/`helpers`/`common`; name by what it provides, not what it contains
```

### Python

```
ADR-LANG: Python Quality Contract
- [ ] Type hints: all public function signatures fully annotated (params + return)
- [ ] Strings: f-strings over .format() and %; raw strings for regex
- [ ] Data structures: dataclass/pydantic for structured data; no raw dict as domain object
- [ ] Async discipline: async functions never call sync-blocking I/O; use `asyncio.to_thread` if unavoidable
- [ ] Imports: absolute imports; no star imports; stdlib → third-party → local ordering
- [ ] Error handling: specific exceptions over bare `except`; never `except Exception: pass`
- [ ] Pathlib: `Path` over string concatenation for all file operations
- [ ] Comprehensions: prefer over map/filter for readability; max one level of nesting
```

### TypeScript

```
ADR-LANG: TypeScript Quality Contract
- [ ] Strict mode: `strict: true` in tsconfig; no `// @ts-ignore` without comment explaining why
- [ ] No `any`: use `unknown` + type narrowing; `any` only in third-party type gaps with `// FIXME` comment
- [ ] Union types: discriminated unions over type assertions; exhaustive switch with `never` default
- [ ] Null safety: optional chaining over nested ifs; nullish coalescing over `|| default`
- [ ] Exports: named exports only; barrel re-exports only at module boundary, never deep
- [ ] Async: `async/await` over raw `.then()` chains; error boundary at call site
- [ ] Immutability: `const` by default; `readonly` on interface fields not meant to mutate
- [ ] Components (React): props interface defined inline or co-located; no prop spreading from `any`
```

### Rust

```
ADR-LANG: Rust Quality Contract
- [ ] Ownership: public API takes owned types; internal functions borrow
- [ ] Error handling: `Result<T, E>` with `?` propagation; no `.unwrap()` outside tests
- [ ] Traits: define at consumer site; impl at definer site
- [ ] Naming: snake_case functions, CamelCase types, SCREAMING_CASE constants
- [ ] Lifetimes: elide when compiler allows; explicit only when disambiguation needed
- [ ] Clippy: zero warnings under `clippy::pedantic` (with documented `#[allow]` for intentional exceptions)
- [ ] Unsafe: only with `// SAFETY:` comment explaining the invariant being upheld
- [ ] Clone: avoid `.clone()` to silence borrow checker; restructure ownership instead
```

### Custom Language

If the project uses a language not listed above, the agent must write `ADR-LANG` from scratch covering:
1. Idiomatic naming conventions
2. Error handling patterns
3. Module/package organization rules
4. Concurrency patterns (if applicable)
5. Type system usage (if applicable)
6. At least 6 checkable items in checklist format

# Testing Strategy Contract

## Test Quality Gates

Every MDU self-review must verify testing. Format: gate → detect → fail → fix.

### 1. No Untested MDU
- **Detect**: Check if this MDU has at least one form of verification
- **Fail**: MDU marked complete with zero tests AND zero documented verification steps
- **Fix**: Write at least one test, OR document an executable verification command with expected output

### 2. No Happy-Path-Only Tests
- **Detect**: For each test, classify: happy path / edge case / error path / boundary
- **Fail**: All tests are happy-path. Zero tests for: empty input, null/undefined, boundary values, error conditions, permission denied, timeout
- **Fix**: For every happy-path test, add at least one: edge case OR error path test. Priority order: (1) what crashes the app, (2) what corrupts data, (3) what confuses the user

### 3. No Tautological Tests
- **Detect**: Read each assertion. Does it test behavior or just restate the implementation?
- **Fail**: Tests that: assert a mock returns what it was told to return, only check that a function was called (not what it produced), compare output to a hardcoded copy of the implementation logic
- **Fix**: Test observable behavior from the caller's perspective. Assert on outputs, side effects, and state changes — not on internal implementation details.

### 4. Meaningful Assertions
- **Detect**: Count assertions per test. Check specificity.
- **Fail**: Tests with zero assertions (smoke-only). Tests that assert `!= null` when they should assert specific values. Tests with only `toBeTruthy()` / `assert result`.
- **Fix**: Each test asserts the specific expected value. For collections: assert count + specific items. For objects: assert specific fields, not just existence.

### 5. Test Isolation
- **Detect**: Check if tests share state, depend on execution order, or require external services
- **Fail**: Test B fails when Test A is skipped. Tests depend on database state from other tests. Tests read/write shared files without cleanup.
- **Fix**: Each test sets up its own state and cleans up after. Use fixtures/factories for test data. Mock or containerize external dependencies.

### 6. Test Naming
- **Detect**: Read test names/descriptions
- **Fail**: Names like `test1`, `testFunction`, `it works`, `should do the thing`. Names that don't describe the scenario AND expected outcome.
- **Fix**: Format: `[unit]_[scenario]_[expected]` or `"should [expected behavior] when [scenario]"`. Reader should understand what broke without reading test body.

---

## Testing Decision Protocol (ADR-TEST)

Define during Phase 4 (decomposition), not Phase 2 — testing strategy depends on architecture decisions being finalized.

Append to DECISIONS.md. Each field must contain a concrete choice.

```
ADR-TEST: Testing Strategy

1. Test Pyramid:
   - Unit test ratio: [e.g., 70%]
   - Integration test ratio: [e.g., 20%]
   - E2E test ratio: [e.g., 10%]

2. Framework:
   - Unit: [pytest / jest / go test / etc.]
   - Integration: [same or different]
   - E2E: [playwright / cypress / none / manual]

3. Coverage Policy:
   - Minimum per MDU: [at least 1 test per public function]
   - Critical paths: [list functions/modules requiring >80% coverage]
   - Excluded: [generated code, config files, etc.]

4. Test Data:
   - Strategy: [factories / fixtures / builders / inline]
   - External services: [mock / container / test account / N/A]
   - Cleanup: [automatic / teardown / transaction rollback]

5. CI Integration:
   - Run on: [every commit / PR only / manual]
   - Blocking: [which test failures block merge]
   - Flaky test policy: [quarantine / fix immediately / skip with issue]

6. MDU Verification Default:
   - Minimum: [1 unit test per public function added]
   - When no test framework exists: [create one in first MDU / document manual steps]
```

# Security Baseline Contract

## Threat Surface Checklist

Every MDU self-review must check applicable items. Format: threat → detect → fail → fix.

### 1. Hardcoded Secrets
- **Detect**: Search all new/modified code for: API keys, tokens, passwords, connection strings, private keys, `.env` values inlined
- **Fail**: Any literal secret in source code, including "temporary" or "example" values that look real (high entropy strings, `sk-`, `ghp_`, `AKIA`)
- **Fix**: Move to environment variable. Add variable name to `.env.example` with placeholder. Never commit `.env`.

### 2. Input Validation at Boundaries
- **Detect**: Identify every entry point where external data enters: HTTP params, CLI args, file uploads, env vars, database reads used in queries, message queue payloads
- **Fail**: Any external input used without validation/sanitization before: SQL query, shell command, file path, HTML output, redirect URL, deserialization
- **Fix**: Validate type + range + format at entry point. Use parameterized queries (never string concat for SQL). Sanitize HTML output. Allowlist redirect URLs.

### 3. Authentication & Authorization
- **Detect**: For each endpoint/route/handler, trace: who can call it? What credentials are checked?
- **Fail**: Any state-changing endpoint accessible without authentication. Any endpoint missing authorization check (user A accessing user B's data). Admin routes without role check.
- **Fix**: Auth middleware on all non-public routes. Authorization check against resource owner. Principle of least privilege.

### 4. Dependency Safety
- **Detect**: List all new dependencies added by this MDU
- **Fail**: Dependency with known critical CVE. Dependency pulled from non-standard registry. Pinned to `*` or `latest`. More than 2 new dependencies for a single MDU.
- **Fix**: Pin exact versions. Check advisories (`npm audit` / `pip audit` / `cargo audit`). Justify each new dependency — prefer stdlib alternatives.

### 5. Error Information Leakage
- **Detect**: Trace all error responses sent to users/clients
- **Fail**: Stack traces, internal paths, database schema details, or dependency versions in user-facing errors. Debug mode enabled in production config.
- **Fix**: Generic error messages to users. Structured internal logging with full details. Separate error detail levels for dev vs prod.

### 6. File & Path Safety
- **Detect**: Any code that constructs file paths from user input or reads/writes files based on external data
- **Fail**: Path traversal possible (e.g., `../../../etc/passwd`). Unrestricted file upload type/size. Temp files created with predictable names.
- **Fix**: Resolve and validate against base directory. Allowlist file extensions. Use OS temp file APIs with random names.

---

## Security Decision Protocol (ADR-SEC)

If the project handles user data, authentication, or external input, this ADR is **REQUIRED** in DECISIONS.md.

Create during Phase 2 Step 5. Each field must contain a concrete decision, not "TBD".

```
ADR-SEC: Security Baseline Contract

1. Trust Boundaries:
   - External inputs: [list all entry points]
   - Trusted zones: [what code/data is considered trusted]
   - Validation strategy: [where and how input is validated]

2. Authentication:
   - Method: [JWT / session / API key / OAuth / none]
   - Token storage: [httpOnly cookie / secure header / N/A]
   - Session expiry: [duration]

3. Authorization:
   - Model: [RBAC / ABAC / ownership-based / none]
   - Enforcement point: [middleware / decorator / manual check]

4. Secrets Management:
   - Storage: [env vars / vault / cloud secrets manager]
   - Rotation: [policy or N/A]
   - .env.example: [maintained: yes/no]

5. Data Protection:
   - PII fields: [list or "none"]
   - Encryption at rest: [yes/no — method]
   - Encryption in transit: [TLS enforced: yes/no]

6. Dependency Policy:
   - Max new deps per MDU: [2]
   - Audit command: [npm audit / pip audit / cargo audit / N/A]
   - Lock file: [committed: yes/no]
```

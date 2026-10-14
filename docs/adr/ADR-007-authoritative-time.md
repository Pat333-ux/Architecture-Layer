# ADR-007 Authoritative Time

- **Status:** Accepted
- **Baseline:** BEAST 3.0 pilot
- **Related:** [ARCHITECTURE_OVERVIEW](../ARCHITECTURE_OVERVIEW.md), [SECURITY_REQUIREMENTS](../SECURITY_REQUIREMENTS.md), [TEST_MATRIX](../TEST_MATRIX.md)

## Context

Deadlines, nonce expiry, and session expiry are meaningless if clients can influence the clock.

## Decision

- The server clock is the sole authority for time-based decisions.
- Client-supplied timestamps are ignored for deadlines, expirations, and ordering.
- Audit records use server time.

## Consequences

- Client clock changes do not alter deadline results (test `governance.deadline`).
- Servers must use reliable time synchronization and monitor drift.

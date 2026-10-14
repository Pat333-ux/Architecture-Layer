# ADR-004 Emergency Authority

- **Status:** Accepted
- **Baseline:** BEAST 3.0 pilot
- **Related:** [ARCHITECTURE_OVERVIEW](../ARCHITECTURE_OVERVIEW.md), [SECURITY_REQUIREMENTS](../SECURITY_REQUIREMENTS.md), [TEST_MATRIX](../TEST_MATRIX.md)

## Context

Operations may need to act quickly on incidents, but unchecked authority would undermine governance.

## Decision

- Emergency authority is limited to recovery and operational protection actions (e.g. session revocation, suspension, restore from backup).
- It cannot change vote outcomes, snapshots, or deadlines, and cannot move funds.
- Use requires an authorized server-side role and a second approver (approval separation).
- Every use is audit logged and subject to later review.

## Consequences

- Emergency actions are visible and independently verifiable (ADR-006).
- Recovery workflows (Epic 5) are built on this boundary.

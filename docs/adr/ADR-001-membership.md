# ADR-001 Membership

- **Status:** Accepted
- **Baseline:** BEAST 3.0 pilot
- **Related:** [ARCHITECTURE_OVERVIEW](../ARCHITECTURE_OVERVIEW.md), [SECURITY_REQUIREMENTS](../SECURITY_REQUIREMENTS.md), [TEST_MATRIX](../TEST_MATRIX.md)

## Context

The pilot needs a controlled, verifiable set of participants. Open participation would make votes and audit trails meaningless.

## Decision

- Membership is onboarded through an explicit request and approval flow.
- The approver of a membership request must differ from the requester (approval separation).
- Membership status is held and validated server-side only.
- Membership is a non-financial status; it carries no token or economic rights.

## Consequences

- Every vote requires membership validation at snapshot time.
- Onboarding and status changes are audit logged (ADR-006).
- Membership changes during an active vote do not affect that vote's frozen snapshot (ADR-002).

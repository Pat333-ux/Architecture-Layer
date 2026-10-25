# ADR-002 Governance

- **Status:** Accepted
- **Baseline:** BEAST 3.0 pilot
- **Related:** [ARCHITECTURE_OVERVIEW](../ARCHITECTURE_OVERVIEW.md), [SECURITY_REQUIREMENTS](../SECURITY_REQUIREMENTS.md), [TEST_MATRIX](../TEST_MATRIX.md)

## Context

The pilot must demonstrate auditable governance without financial or token-weighted mechanics.

## Decision

- One member, one vote; no token-weighted or token-based voting.
- The eligible-voter snapshot is frozen when a proposal opens.
- Votes are accepted only before the deadline, determined by authoritative server time (ADR-007).
- Double voting is rejected; membership is validated for every vote.
- Governance has no treasury control or automated fund movement.

## Consequences

- Results are reproducible from the snapshot and audit records.
- Governance demonstrations are in pilot scope; asset execution is out of scope.
- Emergency overrides are only possible through ADR-004.

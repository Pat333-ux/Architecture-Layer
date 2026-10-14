# BEAST 3.0 Definition of Done

## Remaining Sequence

```
Repository Documents
↓
Implementation
↓
Automated Testing
↓
Pilot Validation
```

The docs package is required before implementation proceeds: ADR-001 through ADR-007, [ARCHITECTURE_OVERVIEW](ARCHITECTURE_OVERVIEW.md), [GOVERNANCE_PILOT_SPEC](GOVERNANCE_PILOT_SPEC.md), [DEFINITION_OF_DONE](DEFINITION_OF_DONE.md), [TEST_MATRIX](TEST_MATRIX.md), and [SECURITY_REQUIREMENTS](SECURITY_REQUIREMENTS.md).

## Done Means

- Work follows the epic order (Epic 0 through Epic 7) in [ARCHITECTURE_OVERVIEW](ARCHITECTURE_OVERVIEW.md).
- Every security requirement is implemented and traced to an ADR.
- Every [TEST_MATRIX](TEST_MATRIX.md) test is automated and passes.
- Audit records meet Independent Verification ([ADR-006](adr/ADR-006-audit-integrity.md)).
- Pilot validation confirms the scope in [GOVERNANCE_PILOT_SPEC](GOVERNANCE_PILOT_SPEC.md) with nothing out of scope introduced.

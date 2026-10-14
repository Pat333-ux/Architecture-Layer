# BEAST 3.0 Governance Pilot Specification

Scope boundaries follow [ARCHITECTURE_OVERVIEW](ARCHITECTURE_OVERVIEW.md) and ADR-001 through ADR-007.

## Pilot Deployment Scope

### Includes

- Identity Support
- Membership Verification
- Audit Validation
- Governance Demonstration
- Recovery Validation

### Excludes

- Token Voting
- Treasury Execution
- Token-Based Governance
- Financial Rights
- Automated Asset Control

## Epic Order

Epic 0 Security Foundations → Epic 1 Identity & Access → Epic 2 Membership → Epic 3 Audit & Integrity → Epic 4 Governance → Epic 5 Recovery & Operations → Epic 6 Pilot Deployment → Epic 7 End-to-End Acceptance

## Acceptance

Pilot acceptance requires every test in [TEST_MATRIX](TEST_MATRIX.md) to PASS, including Independent Verification of audit records ([ADR-006](adr/ADR-006-audit-integrity.md)).

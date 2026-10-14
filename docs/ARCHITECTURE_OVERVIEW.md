# BEAST 3.0 Architecture Overview

## Why does BEAST 3.0 exist?

BEAST 3.0 is a pilot governance environment for:

- identity verification
- controlled membership
- auditable governance
- operational testing

## What is approved?

| ADR | Topic |
|-----|-------|
| [ADR-001](adr/ADR-001-membership.md) | Membership |
| [ADR-002](adr/ADR-002-governance.md) | Governance |
| [ADR-003](adr/ADR-003-identity.md) | Identity |
| [ADR-004](adr/ADR-004-emergency-authority.md) | Emergency Authority |
| [ADR-005](adr/ADR-005-lucr-token.md) | LUCR |
| [ADR-006](adr/ADR-006-audit-integrity.md) | Audit Integrity |
| [ADR-007](adr/ADR-007-authoritative-time.md) | Authoritative Time |

## What is in scope?

- SIWE identity
- Membership onboarding
- Audit logging
- Governance voting
- Recovery workflows
- Governance demonstrations

## What is out of scope?

- Token-weighted governance
- Treasury control
- Token voting
- Financial rights
- Automated fund movement
- Production public deployment

## Epic Dependency Order

```
Epic 0 Security Foundations
↓
Epic 1 Identity & Access
↓
Epic 2 Membership
↓
Epic 3 Audit & Integrity
↓
Epic 4 Governance
↓
Epic 5 Recovery & Operations
↓
Epic 6 Pilot Deployment
↓
Epic 7 End-to-End Acceptance
```

## Related Documents

- [GOVERNANCE_PILOT_SPEC](GOVERNANCE_PILOT_SPEC.md)
- [SECURITY_REQUIREMENTS](SECURITY_REQUIREMENTS.md)
- [TEST_MATRIX](TEST_MATRIX.md)
- [DEFINITION_OF_DONE](DEFINITION_OF_DONE.md)

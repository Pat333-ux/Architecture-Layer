# ADR-005 LUCR Token

- **Status:** Accepted
- **Baseline:** BEAST 3.0 pilot
- **Related:** [ARCHITECTURE_OVERVIEW](../ARCHITECTURE_OVERVIEW.md), [SECURITY_REQUIREMENTS](../SECURITY_REQUIREMENTS.md), [TEST_MATRIX](../TEST_MATRIX.md)

## Context

A LUCR token is referenced by the baseline, but the pilot excludes financial rights and token-based governance.

## Decision

- LUCR carries no voting weight, treasury control, financial rights, or automated asset control in the pilot.
- Governance never depends on LUCR balances.
- Any future role for LUCR requires a new ADR superseding this one.

## Consequences

- Token voting and token-weighted governance stay out of scope.
- Pilot tests assert that LUCR holdings do not affect eligibility or results.

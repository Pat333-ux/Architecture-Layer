# ADR-006 Audit Integrity

- **Status:** Accepted
- **Baseline:** BEAST 3.0 pilot
- **Related:** [ARCHITECTURE_OVERVIEW](../ARCHITECTURE_OVERVIEW.md), [SECURITY_REQUIREMENTS](../SECURITY_REQUIREMENTS.md), [TEST_MATRIX](../TEST_MATRIX.md)

## Context

Governance is only credible if its record can be checked by someone who does not trust the operator.

## Decision

- Audit records are signed and linked in a hash chain.
- Security, membership, governance, and emergency events are all recorded.
- **Independent Verification** is the acceptance standard (see below).
- Backups of audit data are protected and verifiable.

### Independent Verification

A reviewer can:

1. Export audit records.
2. Validate signatures.
3. Verify hash chain continuity.
4. Detect missing events.
5. Detect reordered events.
6. Perform validation offline.
7. Reach the same audit conclusion without access to the live system.

## Consequences

- Tampering is detectable (test `audit.hash_verify`).
- Export format must be self-contained for offline verification.
- Epic 3 must complete before Governance (Epic 4).

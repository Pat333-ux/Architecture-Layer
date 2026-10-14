# ADR-003 Identity

- **Status:** Accepted
- **Baseline:** BEAST 3.0 pilot
- **Related:** [ARCHITECTURE_OVERVIEW](../ARCHITECTURE_OVERVIEW.md), [SECURITY_REQUIREMENTS](../SECURITY_REQUIREMENTS.md), [TEST_MATRIX](../TEST_MATRIX.md)

## Context

Participants need strong, wallet-based identity without trusting client-supplied claims.

## Decision

- Authentication uses Sign-In with Ethereum (SIWE); it is required.
- Nonces expire and cannot be replayed; authentication is rate limited; sessions expire.
- Messages with the wrong domain or wrong chain are rejected.
- Roles are assigned and enforced server-side only; client role claims are ignored.
- Wallet rebinding does not take effect until any active vote the member participates in completes.

## Consequences

- Identity changes cannot be used to alter in-flight votes (test `identity.rebind_vote_lock`).
- Identity and rebinding events are audit logged (ADR-006).

# BEAST 3.0 Security Requirements

Each requirement is traced to an ADR and verified in [TEST_MATRIX](TEST_MATRIX.md).

## Authentication (ADR-003)

- **SIWE Required** – all authentication uses Sign-In with Ethereum.
- **Nonce Expiration** – nonces expire after a short server-defined lifetime.
- **Nonce Replay Protection** – a nonce can be used once only.
- **Rate Limiting** – authentication endpoints are rate limited.
- **Session Expiration** – sessions expire and are invalidated server-side.

## Authorization (ADR-001, ADR-003)

- **Server-Side Roles Only** – roles are stored and evaluated on the server.
- **Client Role Claims Ignored** – role claims from clients have no effect.
- **Approval Separation** – requester and approver must be different identities.

## Administrative Controls (ADR-004)

- Administrative and emergency actions require an authorized server-side role.
- Emergency actions require a second approver and are audit logged.
- Administrative controls cannot alter votes, snapshots, deadlines, or move funds.

## Governance Protection (ADR-002)

- **Snapshot Freezing** – the eligible-voter snapshot is frozen when a proposal opens.
- **Vote Deadlines** – votes after the deadline are rejected.
- **Double-Vote Prevention** – one vote per member per proposal.
- **Membership Validation** – every vote is checked against membership.

## Infrastructure Protection (ADR-003, ADR-007)

- **Authoritative Server Time** – only server time governs deadlines and expirations.
- **Wrong Domain Rejection** – SIWE messages for another domain are rejected.
- **Wrong Chain Rejection** – SIWE messages for another chain are rejected.

## Audit Logging (ADR-006)

- Security, membership, governance, and emergency events are recorded.
- Records are signed and hash chained.
- Records satisfy the Independent Verification definition in [ADR-006](adr/ADR-006-audit-integrity.md).

## Backup Protection (ADR-006, ADR-004)

- Backups are access controlled, integrity verifiable, and restore-tested.
- Restores are audit logged and cannot silently remove audit records.

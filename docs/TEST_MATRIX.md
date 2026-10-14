# BEAST 3.0 Test Matrix

Every requirement traces to an ADR. Format: ADR → Requirement → Test ID → PASS criterion.

| ADR | Requirement | Test ID | PASS |
|-----|-------------|---------|------|
| ADR-001 Membership | Approval Separation | membership.approval_separation | Requester cannot approve own request |
| ADR-001 Membership | Membership Validation | membership.vote_validation | Non-members cannot vote |
| ADR-002 Governance | Snapshot Freezing | governance.snapshot_freeze | Membership changes do not alter a frozen snapshot |
| ADR-002 Governance | Double-Vote Prevention | governance.double_vote | Second vote rejected |
| ADR-002 Governance | Vote Deadlines | governance.late_vote | Vote after deadline rejected |
| ADR-003 Identity | SIWE Required | identity.siwe_required | Unauthenticated requests rejected |
| ADR-003 Identity | Nonce Expiration | identity.nonce_expiry | Expired nonce rejected |
| ADR-003 Identity | Nonce Replay Protection | identity.nonce_replay | Reused nonce rejected |
| ADR-003 Identity | Rate Limiting | identity.rate_limit | Excess attempts rejected |
| ADR-003 Identity | Session Expiration | identity.session_expiry | Expired session rejected |
| ADR-003 Identity | Server-Side Roles Only | identity.server_roles | Roles come only from server state |
| ADR-003 Identity | Client Role Claims Ignored | identity.client_claims | Client-claimed roles have no effect |
| ADR-003 Identity | Wrong Domain Rejection | identity.wrong_domain | Wrong domain rejected |
| ADR-003 Identity | Wrong Chain Rejection | identity.wrong_chain | Wrong chain rejected |
| ADR-003 Identity | Wallet Rebinding | identity.rebind_vote_lock | Rebinding does not take effect until active vote completes |
| ADR-004 Emergency Authority | Administrative Controls | emergency.second_approver | Action without second approver rejected |
| ADR-004 Emergency Authority | Scope Limits | emergency.no_vote_change | Emergency action cannot alter votes or deadlines |
| ADR-004 Emergency Authority | Recovery / Backup Protection | recovery.backup_restore | Restore succeeds, verifies, and is audit logged |
| ADR-005 LUCR | No Token Governance | lucr.no_weight | LUCR holdings do not affect eligibility or results |
| ADR-006 Audit Integrity | Hash Chain | audit.hash_verify | Tampering detected |
| ADR-006 Audit Integrity | Missing/Reordered Events | audit.sequence_verify | Missing or reordered events detected |
| ADR-006 Audit Integrity | Independent Verification | audit.offline_verify | Offline reviewer reaches same conclusion without live access |
| ADR-007 Authoritative Time | Proposal Deadlines | governance.deadline | Client clock changes do not alter deadline results |
| ADR-007 Authoritative Time | Authoritative Server Time | time.server_authority | Client timestamps ignored for expirations |

See [SECURITY_REQUIREMENTS](SECURITY_REQUIREMENTS.md) for requirement definitions.

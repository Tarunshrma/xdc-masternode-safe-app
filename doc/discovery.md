# Protocol Discovery

Before development confirm:

1. Masternode contract addresses
2. ABI availability
3. Supported functions
4. Safe smart account compatibility

## Candidate Contract Methods

Possible methods:

- registerCandidate
- claimRewards
- updateSigner
- getValidatorInfo
- getStake

## Open Questions

1. Can masternode owner be a contract account?
2. Are there signer restrictions?
3. Which method is safest for MVP write action?

## MVP Write Method

Recommended: claimRewards or updateSigner

Lowest risk transaction.
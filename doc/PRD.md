# Product Requirements Document

## Product Name
XDC Masternode Safe App

## Problem

Running an XDC masternode requires managing large stake collateral
(10M+ XDC). Institutional operators prefer multisig control.

Today operators often:
- use single EOA wallets
- leave Safe interface
- use WalletConnect or CLI tools

This introduces operational risk and poor UX.

## Solution

Build a Safe App that allows Safe multisig wallets to manage
XDC masternode operations directly inside Safe.

Users should be able to:

1. Open Safe
2. Open the XDC Masternode Safe App
3. View masternode status
4. Execute masternode transactions
5. Approve them via Safe multisig

## Target Users

Validator operators  
Institutional node operators  
DAO validator teams  
Treasury-controlled nodes

## MVP Scope

MVP must include:

- Safe context detection
- XDC chain support
- Masternode contract integration
- One read-only status view
- One write transaction flow
- Safe multisig approval flow
- Deployable as custom Safe App

## Non Goals (MVP)

Do NOT implement yet:

- validator node hosting
- node monitoring dashboards
- analytics
- reward history
- backend services
- governance voting
- Safe public listing

## Success Criteria

MVP is successful when:

- Safe app loads inside Safe interface
- Safe address detected
- XDC chain verified
- Masternode status displayed
- Safe transaction created
- Multisig approval flow works

## Reference

Safe App guide:

https://help.safe.global/en/articles/145503-how-to-build-a-safe-app-and-get-it-listed-in-safe-wallet
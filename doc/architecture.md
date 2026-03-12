# System Architecture

The system is a frontend Safe App interacting with XDC blockchain.

No backend required for MVP.

## Architecture

Safe Wallet
    │
    │ loads Safe App iframe
    │
Safe App Frontend
    │
    ├── Safe SDK
    │
    ├── XDC RPC provider
    │
    └── Masternode Contract Calls
            │
            ▼
        XDC Network

## Core Modules

safe/
Handles Safe context and transaction submission.

xdc/
RPC provider and chain utilities.

contracts/
ABI loading and transaction encoding.

ui/
React components.

## Key Design Principles

- No backend dependencies
- Keep Safe logic isolated
- Keep contract logic isolated
- Allow future contract expansion
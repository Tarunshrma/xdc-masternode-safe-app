# Cursor Development Rules

Follow these rules for every task.

## Engineering Principles

1. Implement only the current story.
2. Avoid overengineering abstractions.
3. Keep modules small.
4. Separate Safe logic from XDC logic.
5. Contract addresses must not be hardcoded in UI.
6. All blockchain interactions must be typed.

## Implementation Checklist

Every story must end with:

- Files created
- Files updated
- Implementation explanation
- Remaining work
- Assumptions

## Tech Stack

React  
TypeScript  
Safe Apps SDK  
ethers.js or viem  

## Folder conventions

lib/safe  
lib/xdc  
lib/contracts  
components  

## Security

Never expose private keys  
Never sign transactions in app  
Always route transactions through Safe
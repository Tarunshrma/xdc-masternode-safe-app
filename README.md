# XDC Masternode Safe App

A Safe App enabling XDC masternode management
from Safe multisig wallets.

## Reference

Safe app documentation:

https://help.safe.global/en/articles/145503-how-to-build-a-safe-app-and-get-it-listed-in-safe-wallet

## Safe App Listing

Safe Apps require a manifest file hosted at a public URL. See
`public/manifest.json` for local development. When preparing for listing,
update the manifest URL to your hosted app URL and follow the Safe listing
guidelines in the reference link above.

## Quickstart: Safe App Testing

Use Safe's "Add Custom App" feature to test without listing:

1. Deploy the app to a public HTTPS URL (see Deployment section).
2. Open Safe Wallet.
3. Go to Apps -> Add Custom App.
4. Paste your deployed URL and add it.

Safe's custom app flow is documented here:
https://help.safe.global/en/articles/40859-add-a-custom-safe-app

## Environment Variables

Create `.env.local` in the project root with:

VITE_STAKING_CONTRACT_ADDRESS=0x...
VITE_MASTERNODE_ADDRESS=0x...
VITE_XDC_RPC_URL=https://rpc.xinfin.network

Restart `npm run dev` after changes.

## Deployment (DigitalOcean)

You can host the app on DigitalOcean with any static hosting option:

Option A: App Platform
- Build command: `npm install && npm run build`
- Output directory: `dist`
- Set environment variables in the app settings.

Option B: Droplet + Nginx
- Build locally with `npm run build`.
- Copy the `dist` folder to your server.
- Serve `dist` as static files via Nginx.

Option C: Spaces + CDN
- Upload the `dist` folder contents to a Space.
- Enable CDN + HTTPS.
- Use the Space URL in Safe's "Add Custom App".

## Deployment (Vercel)

1. Push the repo to GitHub.
2. Create a new Vercel project from the repo.
3. Build settings:
   - Framework: Vite
   - Build command: `npm run build`
   - Output directory: `dist`
4. Add environment variables:
   - `VITE_STAKING_CONTRACT_ADDRESS`
   - `VITE_MASTERNODE_ADDRESS`
   - `VITE_XDC_RPC_URL`
5. Deploy and copy the HTTPS URL for Safe's "Add Custom App".

## Safe Wallet Basics (First Time)

1. Create or import a Safe in Safe Wallet.
2. Fund the Safe with a small amount of XDC for testing.
3. Open Apps -> Add Custom App and paste your URL.
4. Verify the "Safe Context" card shows the Safe address and chain ID.
5. Set your env vars and try a read call or transaction proposal.

## Development

Install:

npm install

Run:

npm run dev

## Project Structure

src/
  app/
  components/
  lib/
    safe/
    xdc/
    contracts/
    config/
stories/
doc/

## Development Approach

Implement stories sequentially.

Each story builds one capability.
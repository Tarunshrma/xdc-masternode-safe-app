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
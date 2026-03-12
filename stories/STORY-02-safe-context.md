# Story 02 — Safe Context Detection

## Goal

Detect Safe wallet environment.

## Tasks

Install Safe Apps SDK.

Create module:

lib/safe/context.ts

Expose:

safeAddress  
chainId  
isInsideSafe  
loading  
error  

## UI

Display Safe info card:

Safe Address  
Chain ID  

If not inside Safe:

show fallback message.

## Acceptance Criteria

App correctly detects Safe context.
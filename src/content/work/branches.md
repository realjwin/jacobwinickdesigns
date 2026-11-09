---
title: Branches — Trip Planner
dwg: JW-202
discipline: software
year: "2026"
status: in-progress
rev: A
summary: A map-first trip planner where the itinerary is a notebook of cells. Notes become pins on the map, and AI cells add places.
role: Solo — product spec, architecture, implementation
stack: [Expo, React Native, Expo Router, TypeScript, Convex, MapLibre, MapTiler, Vercel AI SDK, OpenAI]
order: 4
featured: false
---

## Problem

Trip planning ends up split between a notes app, a map, and a camera roll. I wanted one surface where the plan and the map are the same data: write "dinner at a place in a neighborhood at 8pm" and get a pin, without copying it over by hand.

## Approach

I built this outside work, starting from a written steering spec in the README that records the decisions, data model, and milestones before any code. The core idea is an itinerary that behaves like a Jupyter notebook.

- **Cells.** An itinerary is an ordered list of typed cells: `note`, `place`, `media`, `transit`, `ai`, and `day`. Each has a JSON payload, an optional cached `output`, and a `staleAt` timestamp. An AI cell shows **Run**, or **Re-run** once it is stale or has output, the way a notebook cell does.
- **Text → map.** A note cell can be scanned for places. A server action makes a forced tool call to the model to pull out concrete place mentions, and each candidate is geocoded through MapTiler. Accepting the inline chip appends a `place` cell, and the pin shows up on the map through Convex's reactive queries.
- **AI cells.** A prompt runs in a Convex action with one tool, `add_place`. The server geocodes the name and appends a sibling place cell, so the model's suggestions land on the map as real records.
- **Swappable map.** A `MapProvider` interface (camera, markers, routes, bounds, events) sits between the app and the renderer. MapLibre is the v1 implementation. A Felt provider is committed as a stub, because Felt has no native iOS SDK and a WebView map would compromise the main view.
- **Backend.** Convex handles the schema, auth, file storage, and realtime. Photos upload to Convex storage. API keys live in Convex environment variables, not the client.

## Result

A v1 scaffold. It covers email/password auth, a tab shell (Map, Explore, Media, Feed), trip creation, the itinerary editor, text → map, AI cells, and photo upload. The README lists the known gaps:

- Cells aren't grouped by day in the UI yet. The model supports it.
- Explore is static mock data, and the Felt integration is a stub.
- Apple and Google sign-in aren't wired up.
- There are no tests yet.

## Notes

- The spec describes AI output as streamed. The current action writes a start marker and then the final text in one update, so true incremental streaming is still to do.
- The repo name is *branches*. The spec's working title is different, and the product name isn't settled.
- Deferred on purpose: offline tiles, real social features, transit routing, and CRDT-style concurrent editing.

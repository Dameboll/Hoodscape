# HOODSCAPE AI HANDOFF

This document lets another coding agent continue the project without reconstructing its history from chat.

## Product direction

HOODSCAPE is a third-person browser RPG set in Saint Mercer. The fantasy is a believable neighborhood sandbox where a player can choose an ordinary, entrepreneurial, criminal, competitive, or story-driven life. The main storyline is optional. Its conspiracy eventually reveals that the city is a manipulated simulation/experiment; after the revelation, NPC dialogue and behavior are meant to change because the residents become conscious of the game.

The tone is dramatic urban mystery with grounded relationships and consequences. All conspiracy organizations are fictional. Do not present real-world groups as secretly controlling the world.

## Current state

The project is a Next/Vinext + React shell around an imperative Three.js/Rapier runtime.

- Story Chapters 1–4 are implemented with branching choices, relationship values, evidence, side quests, economic consequences, and multiple chapter endings.
- The city has residents, police, traffic, homes, shops, vehicles, jobs, street crime, heat, weapons, combat, skill progression, and deterministic save-safe transactions.
- Character creation supports identity, skin, hair, style, frame, face, head style, physique, background, and personality. Face/head/physique variants are rendered procedurally over the authored resident GLB and are persisted in the profile.
- Onboarding offers Story or Sandbox routing and explains movement, interaction, progression, crime consequences, PvP, activities, and timed decisions.
- Activities include a deterministic 10-shot basketball timing session, timed alley dice, bike races, and street races.
- Online foundation includes Sign in with ChatGPT, D1-backed player rows, cloud saves, nearby-player presence, safe/ready PvP, red combat zones, server-side hit checks, knockouts, and K/D.

## Important files

- `app/page.tsx`: initializes `Game`, displays title/HUD/menus, runs online sync, and mounts creator/tutorial/activity overlays.
- `game/render/runtime.ts`: `Game` class, GLB loading, camera, appearance application, physics loop, traffic, combat, remote-player rendering, and races.
- `game/simulation/profile.ts`: all creator option arrays and profile validation.
- `game/simulation/state.ts`: `Save`, validation, IndexedDB persistence, and additive migration.
- `game/simulation/session.ts`: player-facing transactions, jobs, story panels, and activity hooks.
- `game/simulation/story.ts`, `story-panels.ts`, `chapter-two.ts`, `chapter-three.ts`, `chapter-four.ts`, `game/ui/StoryJournal.tsx`: story state and authored dialogue.
- `app/api/world/route.ts`: authenticated cloud player save/presence endpoint.
- `app/api/pvp/route.ts`: server-authoritative PvP endpoint.
- `db/schema.ts` and `drizzle/`: D1 player schema/migration.
- `public/models/mercer-resident.glb`: resident asset with Idle, Walk, Run, Attack clips.

## Data compatibility

Save version remains `1`. Profile appearance fields `face`, `head`, and `body` are additive; older profiles are accepted and normalized to Classic/Fade/Athletic. Do not change the save version casually. If a schema must evolve, preserve migration coverage and old story/economic state.

## Local development

```bash
npm install
npx tsc --noEmit
node scripts/test-game.mjs
npm run dev
```

The local/offline slice uses IndexedDB. Hosted account/cloud/PvP behavior requires the Sites runtime's authentication and D1 binding. Never put Site tokens or Git credentials in source.

## Definition of done for a feature

1. Simulation rule exists outside the render loop where applicable.
2. UI is DOM-based and keeps the 3D playfield readable.
3. Legacy saves remain valid.
4. Deterministic tests cover the important rule and duplicate/rejection paths.
5. `npx tsc --noEmit`, `node scripts/test-game.mjs`, `npm run build`, and `git diff --check` pass.
6. The handoff describes limitations honestly; do not claim visual browser QA when WebGL is unavailable.

## Current known limitations

- Cloud browser WebGL has previously been disabled, so visual 3D QA must be done on a WebGL-capable browser.
- The online system is a foundation/alpha, not a full MMO backend: presence is near-player polling, there is no matchmaking, moderation, party system, or authoritative movement simulation yet.
- The basketball activity is currently a deterministic timing session rather than full 3D ball physics.
- Chapters 4’s ending sets up Chapter 5; Chapters 5–8 and the NPC-conscious postgame are outlined but not yet shipped.

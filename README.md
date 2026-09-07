# HOODSCAPE

HOODSCAPE is a browser-based third-person urban RPG set in Saint Mercer. It is designed as an open-world sandbox first: the conspiracy storyline is an optional path inside a living city, alongside jobs, crime, progression, races, court activities, relationships, and a shared-world multiplayer foundation.

The long-term story follows a fictional civic redevelopment experiment that gradually reveals the city is a manipulated simulation. Chapters 1–4 are playable; later chapters and the postgame awakening are documented in `docs/STORY_BIBLE.md`.

## Current playable slice

- Full 3D Saint Mercer district with Rapier movement, camera collision, traffic, varied residents, police, shops, homes, vehicles, combat, weapons, Heat, four crew territories, and five progression skills.
- Character creation with name, pronouns, skin tone, hair color, face, head style, physique, frame, street style, background, and personality. The creator keeps a full-body model preview visible beside the choices.
- Optional Story or Sandbox onboarding. Sandbox players can ignore the main plot and build a life through jobs, street work, training, races, dice, basketball timing sessions, vehicles, and relationships.
- Sign in with ChatGPT account flow, cloud-backed character saves, nearby player presence, safe/PvP toggle, server-validated PvP zones, knockouts, and online K/D tracking.
- Deterministic authored dialogue and consequences. No runtime language-model calls are required for gameplay.

## Controls

WASD move · mouse look after clicking the game · Shift sprint · E interact · J/light attack · K/heavy attack · Q/block · Space/dodge or vehicle brake · I/backpack · P/skills · M/journal · Escape/pause. Touch joystick, camera drag, and contextual controls are included.

## Run locally

```bash
npm install
npx tsc --noEmit
node scripts/test-game.mjs
npm run dev
```

Open the local Vite URL printed by the dev server. The browser game itself works locally with IndexedDB saves. Account-backed cloud saves and shared players require the hosted Sites environment with Sign in with ChatGPT and the D1 binding declared in `.openai/hosting.json`; they are not replaced with fake local multiplayer.

For a production-style local build:

```bash
npm run build
npm run start
```

`npm run build` emits the Cloudflare-compatible Worker output used by Sites. Do not commit `node_modules`, `dist`, `.wrangler`, `.sites-runtime`, or local environment files.

## Where to work

| Area | Responsibility |
| --- | --- |
| `game/simulation/` | Serializable saves, progression, story rules, jobs, activities, profiles, and validation |
| `game/render/` | Three.js scene, GLB loading, camera, physics bridge, actors, vehicles, traffic, combat visuals |
| `game/ui/` | Character creator, tutorial, activities, journal, and other DOM overlays |
| `app/page.tsx` | React shell, HUD, account gate, online sync, menus, and input routing |
| `app/api/` | Server-authoritative world presence, cloud saves, and PvP verification |
| `db/` + `drizzle/` | D1 schema and migrations |
| `public/models/` | Authored resident GLB asset |
| `tests/` | Deterministic gameplay and asset checks |

## AI handoff rules

Read `AGENTS.md` before making changes. Preserve existing gameplay and save compatibility. Make focused edits, run `npx tsc --noEmit` and `node scripts/test-game.mjs`, then run `npm run build` before handing off a meaningful change. Do not replace the Three.js runtime with a mock, add runtime LLM dependencies, or reset saves to make a feature easier.

The complete continuity notes, story plan, implementation checkpoint, and current limitations are in `docs/AI_HANDOFF.md`, `docs/STORY_BIBLE.md`, and `docs/BUILD_STATUS.md`.

## Asset and hosting notes

The resident GLB is authored by `scripts/create-character.mjs`; rerun it only when changing the model. It contains Idle, Walk, Run, and Attack clips and no external textures. The city uses shared materials and merged geometry. Three.js and Rapier retain their upstream licenses through the dependency tree.

Hosted Sites identity and D1 declarations live in `.openai/hosting.json`. Never place credentials, bearer tokens, or private auth values in this repository.

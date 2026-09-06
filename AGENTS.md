# HOODSCAPE AI CONTRIBUTOR GUIDE

You are continuing an existing playable game, not scaffolding a replacement.

## Before editing

1. Read `README.md`, `docs/AI_HANDOFF.md`, `docs/BUILD_STATUS.md`, and the relevant files for the feature.
2. Preserve the existing simulation/render/UI boundaries.
3. Check `git status` and keep unrelated user work intact.

## Architecture contract

- `game/simulation/` is the source of truth for serializable rules, saves, progression, story, activities, and validation.
- `game/render/` is the Three.js/Rapier adapter. It renders simulation state and owns camera, actors, vehicles, traffic, physics, and audiovisual feedback.
- `game/ui/` and `app/` own DOM overlays and menus. Do not put text-heavy UI into WebGL.
- `app/api/` is server code. Cloud saves, nearby presence, and PvP damage must remain server-authoritative.
- `db/schema.ts` and `drizzle/` are the D1 contract. Generate and inspect migrations when the schema changes.

## Non-negotiable preservation rules

- Do not reset or invalidate existing version-1 saves.
- Add fields additively and normalize legacy data in `migrateSave`.
- Do not replace the authored GLB, city, or runtime with a placeholder/demo.
- Do not add runtime language-model calls to determine game outcomes; authored deterministic rules keep multiplayer fair and testable.
- PvP must require server verification, both players' eligibility, a valid combat zone, distance checks, cooldowns, and current equipment.
- Keep the open-world sandbox usable even when the story is skipped.
- Avoid real-world political/religious claims in the fictional conspiracy. The Assembly and operators are invented game entities.

## Validation checklist

```bash
npx tsc --noEmit
node scripts/test-game.mjs
npm run build
git diff --check
```

Add deterministic tests for new rules. If a browser has WebGL disabled, do not weaken the renderer to satisfy that browser; record the limitation in `docs/BUILD_STATUS.md` and validate through code/build tests.

## Good next areas

- Expand authored Chapters 4–8 and the conscious-NPC postgame using the story bible.
- Add more city districts and authored side-quest arcs without breaking old coordinates or saves.
- Replace procedural preview details with additional optimized GLB variants when real assets are available.
- Improve basketball from the deterministic timing overlay into a richer court interaction while keeping the rules testable.
- Harden multiplayer presence lifecycle, reconnect behavior, moderation, and persistence before calling it a full production MMO.

## Handoff style

Explain what changed, which files own it, tests run, known limitations, and the next safe slice. Keep commits focused and avoid broad rewrites.

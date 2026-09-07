# HOODSCAPE Coordinated Build Plan

Working method: coordinated sections. One section at a time. After every major pass,
Dame opens the hosted game, reviews, verifies, and approves before the next pass starts.

## Non-negotiable preservation rules (AGENTS.md)

- Version-1 saves never reset or invalidate. Additive migration only (`migrateSave`).
- Observation: simulation rules stay in `game/simulation/`, rendering in `game/render/`,
  DOM/UI in `game/ui/` + `app/`. Server-authoritative APIs stay in `app/api/`.
- No runtime language-model calls for game outcomes. Authored deterministic rules only.
- PvP stays server-verified: eligibility, combat zone, distance, cooldowns, equipment.
- Sandbox stays playable when the story is skipped.
- Never replace the authored GLB/city/runtime with a placeholder.

## Verification gate (after EVERY major pass)

```bash
npx tsc --noEmit        # zero errors
node scripts/test-game.mjs  # all tests pass
npm run build           # vinext build passes
git diff --check        # clean
```

New deterministic rules get new tests in `tests/game.test.ts` and are listed in
`docs/BUILD_STATUS.md` with honest limitations (WebGL visuals still need a WebGL-capable
browser; this environment cannot claim visual browser QA).

Each pass ends: commit on a feature branch, merge to master, push.
Then Dame reviews on the hosted site before I continue.

## Sections (coordinated order)

- S1 Story: Chapters 4-5, authored, deterministic, testable
- S2 Story: Chapters 6-8, same rules
- S3 Postgame: conscious-NPC awakening after the story
- S4 World: new city districts + authored side-quest arcs, old coordinates/saves intact
- S5 Gameplay: richer basketball court interaction, rules stay testable
- S6 Online: multiplayer hardening (presence lifecycle, reconnect, moderation,
  persistence) before it can be called a production MMO

## Open question

How do changes reach https://hoodscape.dameboll.chatgpt.site/ ?
A. The GitHub repo is connected to the Sites app: push to master redeploys automatically.
B. Manual deploy step needed (CLI or dashboard) after each push.
This determines whether "push" is the final step of every pass or if a deploy follows it.

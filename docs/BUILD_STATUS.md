# HOODSCAPE build checkpoint

Implemented early single-player slice: Three.js renderer, authored GLB resident with Idle/Walk/Run/Attack clips, Rapier character movement, camera wall avoidance, merged urban neighborhood geometry, 12 named residents and 2 officers, five skills with levels 1–99, inventory, cash/bank, shops, six delivery Plays, one multi-objective Move, sparring, salvage, witness-based Heat and pursuit, two bicycles and two sedans, owned/stolen vehicle handling, garage storage, home rest/storage, browser persistence and backup, export/import, contextual desktop and touch controls, procedural audio.

The game currently has 11 item definitions. Expanded item/NPC counts, more vehicle classes, deep schedules/relationships, improved bespoke art, broader audio assets, richer combat animation, and more story content remain follow-on work. This is an early build, not the full master directive completed.

Architecture: `game/simulation` owns serializable state and transactions. `game/render` owns the Three.js adapter and fixed-timestep gameplay bridge. `game/input.ts` unifies desktop/touch actions. `app/page.tsx` provides the DOM interface. Data definitions stay in `game/simulation/data.ts`.

Validation: 10 automated checks cover level curves, inventory capacity, transaction safety, exactly-once delivery rewards, eligibility gates, bank consequences, save recovery, import validation, GLB animations, district physics traversal, vehicle gates/exits and spar rewards. Run `node scripts/test-game.mjs`. Type-check using `npx tsc --noEmit`.

Browser QA limitation: the supervised cloud Chrome reports WebGL disabled (`GL_RENDERER = Disabled`). The app's graphics-error screen rendered correctly; no live 3D visual inspection, physical mobile device playtest, mouse-lock playtest, or actual FPS claim is made. Complete these tests on a WebGL-capable browser next. Do not replace the renderer or weaken the game to accommodate the test browser.

Preserve working systems and saved progress. Extend and test; do not replace with a simpler prototype. Original instructions are retained in BUILD_DIRECTIVE.md. Site identity is `.openai/hosting.json`.

## Chapter 1 update

Eight playable main-story Moves, three one-time optional favors, Bishop as a persistent rival, six relationship records with trust/respect/resentment/memories, a durable evidence notebook and decision log, a physical relay-reset puzzle, three chapter-resolution routes, conditional shop prices, repair discount, and a repayable debt that changes Bishop's nearby behavior. The full eight-chapter outline and four ending designs are in STORY_BIBLE.md. Later chapters and universal postgame awakening are outlined, not shipped.

Old version-1 saves remain supported through an additive story migration; cash, XP, completed Plays/spars, inventory, property and vehicles are preserved. Import follows the same migration. One-time choices commit before payout and are guarded against duplicate actions. Four new checks cover routes, economic/debt effects, optional favors, and legacy migration/story persistence (14 total). The district has 100 scene objects after adding the utility sign (previously 99); the object budget accounts for this deliberate addition. Browser WebGL remains unavailable for visual testing; this pass does not restart that failed test environment.

## Chapter 2 update

Six new Moves continue at stage 8 after Chapter 1: missing shipment, Bishop negotiation, cargo recovery, food distribution, dispatch recording, tenant meeting. One optional recorder-repair favor. Prior evidence/trust/Dre support permit a quiet release; otherwise a clearly signposted monitored-seal action adds Heat. Endings change relationships, debt, pricing and repair costs. Physical market crates disappear during the shortage and return when recovered. Stages 0–14 remain compatible with old saves; no reset required.

The Towers now includes a freight loading bay, tenant noticeboard, bus shelter, courtyard benches, planters, storefront goods, alley dumpsters and HVAC. Existing material batching retained; district budget is 115 scene objects. The player and character creator retain the stable procedural resident and named pivots. A normalized 26.7k-triangle male rig with Idle/Walk/Run/Attack is integrated for selected male residents and police. Six optimized vehicle models and three weapon models are integrated with per-asset procedural fallbacks. The uploaded female model remains quarantined because it contains no armature or animations.

Six focused checks pass: Chapter 2 routes/duplicate payouts, access gates/economic effects, recorder reward guards, GLB compatibility, city collision traversal, and old-save migration. Type-check/build required before publication. Browser visual QA remains unavailable due to disabled cloud WebGL; do not claim the new look or performance visually verified.

## Chapter 3 update

Five new Moves continue at stage 14: the public hearing, Nia’s threatened storefront, Vale’s appointment, duplicate citizen records, and the hidden permit price. The final decision can save the business, preserve incriminating records, or expose manufactured attendance; each route changes cash, Heat, evidence, and relationships. Three optional favors add an independent storefront, a Ruiz-backed paper copy, and a tenant communication line. A new Director Vale resident is visible at the hearing. Stages 0–19 remain compatible with old saves; no reset required.

## Chapter 4 update

Five new Moves continue at stage 19: June’s disappearing-neighbor report, the evidence pass (June’s photograph, Ruiz’s recorder, or Vale’s personnel account), the apartment/records/catalog investigation, how the neighborhood holds the memory, and the closing decision (protect Theo unlisted, publish his name, or probe the Initiative through Vale’s account). Evidence routes are gated by earlier optional favors: June’s envelope (Chapter 1), Ruiz’s repaired recorder (Chapter 2), and Vale access from Chapter 3 liaison choices. Without favors, routes still complete with testimony-grade evidence and signposted thinner outcomes. New durable evidence: missing_person, envelope_scan, theo_recording, resident_file. Three optional favors: posters for the tenant sheet, Jay’s night-shift witness account, and June’s memory walk. Final broadcast sets up Chapter 5. Story stage cap raised 19→24 in validStory; stages 0–24 remain compatible with old saves; no reset required. Four new deterministic checks (33 total): all routes once, evidence gating/fallback, Vale-access gate plus heat on publish, and exactly-once favors.

## District visual + crew update

The resident GLB is now a full adult rig with a clear shoulder line, separate upper/lower limbs, hands, face, hair, sneakers, and the same Idle/Walk/Run/Attack clips required by the renderer. Deterministic per-resident skin, clothing, body scale, hair, headwear, face-accessory, and bag variation prevents the street population from reading as a single clone. Vehicle rendering now uses authored sedan, coupe, hatchback, van, BMX, road-bike, and mountain-bike families rather than primitive placeholders.

District 09 gained six secondary street sections, six named buildings, service-yard props, benches, signs, lights, an authored Mercer Market frontage, and four visible crew contact areas. Four fictional, mixed-member neighborhood crews can offer the player a lasting affiliation; joining is persisted without resetting old saves. Selling at a home territory earns a deterministic bonus; selling in another crew’s territory raises Heat, reduces standing, and prompts crew members to pursue the player. The expanded world map renders each territory, its contact, and the player’s current crew status. Any non-rival resident can now be approached for a short contextual conversation. The compact minimap now uses the same streets and block language as the world map; vehicle handling has deterministic steering, braking, and controlled lateral drift.

This is a first systemic pass, not a claim that a complete gang/party/MMO system exists. Crew parties, co-op bonuses, territory ownership wars, richer civilian routines, and authoritative multiplayer remain future work. The automated suite now has 37 passing deterministic checks, including GLB rig compatibility, vehicle handling, and crew territory/save behavior. Browser visual QA remains limited by the cloud environment’s disabled WebGL.

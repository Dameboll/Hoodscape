# Visual overhaul — implementation checkpoint

## Frozen source

User-approved scope: gritty authored realism, desktop plus mobile, existing playable footprint, grounded arcade driving. Preserve all systems, save version 1, progression, missions, multiplayer authority, and interaction coordinates. No feature work or deployment before final acceptance.

The GitHub planning baseline is `d79bcf6de60113a6638cb9d85e6fc2a3a9d3d870`. Sites version 18 points to `877657d0506952e2bdffc05acfeab5a2ffe8acf1`. Compared both complete source trees: only trailing newlines in two files and executable permissions on three shell scripts differ. The isolated checkout starts from the Sites source and retains local tag `visual-freeze-2026-09-07`. The old standalone extraction was not modified.

## Baseline evidence

- All 35 gameplay checks pass before art changes.
- Original title and market render visibly in Codex's WebGL-capable in-app browser at 1294×912 on the user's Windows host.
- Fixed market camera: position (-1,3.2,37), target (-14,4,24); player (-10,25).
- Original market sample: approximately 57–60 median FPS, p95 34.4ms, 1,526 draw submissions, 419,724 triangles. Draw counts include shadow passes.
- Mobile-sized 390×844 low-quality sample: 30 FPS, p95 50ms, 213 draws, 120,236 triangles. This is desktop viewport emulation, NOT physical-phone performance evidence. UI work had begun during this sample, so it is a renderer baseline only.
- Performance measurements are local development samples and include compositor/scheduling effects. Production and physical-device validation remain required.

## First production-standard milestone

Implemented in this checkpoint: Mercer Market facade and street detail; neutral daylight; title/HUD/creator/pause presentation; self-hosted fonts; deterministic grounded-arcade vehicle handling with braking, steering response, reverse limits, grip, lateral slip, and visual body roll.

The Blender player and sedan package is staged for correction, but is not referenced by the production runtime yet because its first import failed live scale/origin compatibility checks.

The user explicitly required an in-game visual approval milestone before multiplying these assets across the city. Do not interpret the first street as completion of the full overhaul.

Local `?artReview=1` in a development build provides repeatable shots and visible render measurements. It does not load or write saves and does not connect to online APIs. Production does not enable this review mode. Existing sign-in/server authorization remain intact.

## Remaining after milestone acceptance

Remaining: full world dressing; complete UI state inventory; corrected Blender integration for all character and vehicle variants including bicycles/traffic; deeper collision/contact handling; geometry/texture/download budgets; mobile device QA; final regression and release candidate. No claim of completion until these pass.

## Agent and cost policy

Use scoped gpt-5.6-luna workers. At most two independent workers after ownership contracts are explicit. Stronger review only at milestones or after two focused failures. Preserve concise handoffs and reuse test evidence; no paid generation or new subscriptions.

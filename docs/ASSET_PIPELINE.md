# HOODSCAPE 3D asset pipeline

## Shipping rules

- Runtime format is binary glTF (`.glb`), Y-up, meters, centered on X/Z with feet or wheels at Y=0.
- Characters must provide `Idle`, `Walk`, `Run`, and `Attack`; use one armature and one shared skeleton convention.
- Vehicles face along local +Z and retain wheel node names or `hsWheel` metadata.
- Materials use stable semantic names: `skin`, `jacket`, `pants`, `shoe`, `vehicle_body`, `vehicle_glass`, `vehicle_rubber`, `weapon_metal`, and `weapon_wood`.
- Every runtime loader has a procedural fallback. An asset failure must never block startup or mutate a save.
- Target budgets: characters under 35k triangles, vehicles under 30k, held weapons under 12k, textures at 1024px or below unless a reviewed hero asset requires more.

## Intake

Place candidate source files in `asset_inbox/` locally. Do not import source FBX files from game code. Record author, source URL, license, intended role, and any required attribution before promoting an asset.

The checked-in Node converters are deterministic and require no network access:

```bash
node tools/assets/convert-fbx.mjs male source.fbx work/male.glb
node tools/assets/convert-fbx.mjs carter source.fbx work/carter.glb
node tools/assets/convert-fbx.mjs generic-sedan source.fbx work/sedan.glb
node tools/assets/optimize-glb-images.mjs source.glb work/optimized.glb 512
node scripts/validate-assets.mjs
```

Supported FBX converter kinds are `male`, `carter`, `shvan`, `generic-sedan`, `generic-suv`, `generic-pickup`, `generic-coupe`, `ak`, and `pistol`.

## Blender workflow

Blender is the authoritative cleanup path for future topology, rigging, weight painting, and LOD work. Configure MPFB manually in Blender Preferences when MakeHuman-derived generation is needed; never require MPFB in the browser runtime.

```bash
blender --background --python tools/blender/prepare_asset.py -- asset_inbox/source.fbx work/output.glb --kind character
blender --background --python tools/blender/prepare_asset.py -- asset_inbox/source.fbx work/output.glb --kind vehicle --target 4.8
```

Review the printed `HOODSCAPE_ASSET_REPORT`, inspect deformation in Blender, then run the repository validator. This cloud build environment does not contain Blender, so the current pass used the offline Three.js converters and structural GLB validation; final weight-paint or authored retargeting work still belongs in Blender.

## Runtime integration

`game/render/production-assets.ts` owns loading, cloning, material instances, and fallbacks. Add paths there once an asset is approved. Keep simulation identifiers and physics footprints independent from visual model names.

Before promotion:

1. Verify the license and attribution.
2. Inspect orientation, scale, pivot, silhouette, and animation deformation.
3. Run `node scripts/validate-assets.mjs`.
4. Run `npx tsc --noEmit`, `node scripts/test-game.mjs`, `npm run build`, and `git diff --check`.
5. Test character creator, walking, combat, entering/exiting cars, traffic collisions, and mobile quality mode in a WebGL-capable browser.


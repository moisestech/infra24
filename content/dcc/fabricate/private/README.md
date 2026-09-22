# Private proposal media

Drop approved client proposal images here, never in `public/`.

```
content/dcc/fabricate/private/<proposal-slug>/<filename>
```

Expected Heather filenames:

- `H_RENDER_001_hero_translucent_prototype.png`
- `H_RENDER_002_multiview_translucent_prototype.png`
- `H_RENDER_003_supported_production_state.png`
- `H_DIAG_001_translucency_spectrum.png`
- `H_DIAG_002_fabrication_workflow.png`
- `H_DIAG_003_finishing_checkpoint.png`
- `H_SRC_003_slicer_preview.png`

Served only through `/api/dcc/fabricate/media/...` after the shared proposal password cookie.

Never place CAD / source files (`.pm7m`, `.stl`, `.3mf`, `.obj`, `.zip`) in this folder. Those stay off the website.

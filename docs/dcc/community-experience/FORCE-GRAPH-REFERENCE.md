# Force-graph implementation reference

Reference repository: https://github.com/vasturiano/3d-force-graph (MIT; Vasco Asturiano).
Starting example: https://vasturiano.github.io/3d-force-graph/example/basic/

Reviewed the repository structure, 32-example catalog, package/license, public type declarations, rendering lifecycle and selected examples. Useful patterns:

| Example | DCC use |
|---|---|
| basic | Force-directed nodes and links |
| async-load | Load a server JSON projection |
| dynamic | Update graphData without rebuilding the site |
| click-to-focus | Inspect a selected profile |
| responsive | Resize to the available container |
| highlight | Distinguish permitted interest edges |
| pause-resume | Bound rendering work and respect reduced motion |
| fix-dragged-nodes | Hold a manually repositioned node |

The basic example uses random tree links. DCC does not copy those as social relationships: its edges connect profiles to declared interests. Anonymous illustrative dots are unlinked. Hover labels use DOM textContent, because the library also accepts HTML labels. An accessible profile list and no-WebGL fallback remain available.

The dependency is pinned to `3d-force-graph` 1.79.0 with its `three-render-objects` dependency pinned to 1.40.0. This pair supports the existing Three.js 0.170 application. The newest graph renderer depended on a newer Three.js Timer export and did not compile with the existing application's Three.js; the scoped pin avoids changing other existing 3D experiences.

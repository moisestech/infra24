# DCC client → projects → 3D files (Cloudinary + private storage)

**Updated:** 2026-11-16  
**Status:** DRAFT in PR #37; not released, not a customer-ready portal.

## Decision and source-of-truth boundaries

**Client identities, commercial jobs, and statuses:** Airtable; account-level auth/authorization: Clerk; source evidence + approval records: owner-restricted Google Drive; code and rendering: infra24; model originals and unapproved production STL/OBJ/3MF: authenticated, private object storage (current proposed server-side Supabase bucket `dcc-client-models`); approved **public** GLB (3D browser preview), posters, photos and videos: Cloudinary.

Cloudinary is not the canonical source for unapproved designs. Moving an asset into a folder named `private` does not make it private. Even if the *app page* requires login, a Cloudinary `raw/upload` URL is public if known. If a customer wants a confidential live interactive GLB, implement tested signed Cloudinary authenticated delivery with short-lived server authorization, or use a private same-origin object proxy. Do not use the public GLB publication configuration for that use case.

**Don't put client CAD, source images or confidential docs into GitHub** (the `infra24` repository is public). Do not publish Carol's octopus reference or generated clay concept without separate image/publication approval. An unreviewed Meshy model is not production-ready geometry.

## Current Cloudinary account

- Cloud name observed in Cloudinary asset delivery URLs: `dck5rzi4h`.
- Plan: Free; 2026-11-16 usage snapshot: 8.31 / 25 credits, ~33.24%; raw upload size limit reported: 10,485,760 bytes (10 MiB). Check plan limits and actual asset format acceptance before uploading GLB/STL.
- Existing Cloudinary library prefix: `dccmiami`. This new structure lives beneath it; unrelated libraries (e.g., Nala) are left untouched.
- New empty folders created, no 3D models uploaded:
  - `dccmiami/client-projects/carol-haggiag/octopus/3d-previews`
  - `dccmiami/client-projects/carol-haggiag/octopus/approved-media`
  - `dccmiami/client-projects/carol-haggiag/chicken-foot/3d-previews`
  - `dccmiami/client-projects/carol-haggiag/chicken-foot/approved-media`

For future users repeat `dccmiami/client-projects/{client-slug}/{project-slug}/{3d-previews|approved-media}` only after a legitimate client/project record is verified. Separate project slugs imply separate quotes, scopes, and permission decisions. Slugs are identifiers, not access control.

## App routes in PR #37

- `/fabricate/workspace` — new staff-only client→project index. A Clerk ID must be in `DCC_FABRICATE_STAFF_CLERK_USER_IDS`; no password fallback, no env fallback, and a public `/fabricate` prefix does NOT grant this route.
- `/fabricate/proposals/carol-haggiag` — Carol dashboard. Clerk ID must match her record in `DCC_CLIENT_CLERK_ACCESS_JSON` or be a DCC staff allowlist ID.
- `/fabricate/proposals/carol-haggiag/octopus` and `/chicken-foot` — separately authorized project pages. Original FDM viewer continues requesting `/api/dcc/fabricate/models/carol/{project}` from the server, not a public client-CAD URL.
- `components/dcc/fabrication/proposal/CloudinaryGlbViewer.tsx` — interactive GLB visual preview using existing R3F/drei dependencies. Only rendered if a human explicitly configures an **approved-public** Cloudinary GLB URL for a known client and project.
- `lib/dcc/fabrication/assets/cloudinary-models.ts` — server-side config validator. Only HTTPS `res.cloudinary.com/dck5rzi4h/raw/upload/` addresses with an allowed project folder prefix and `.glb` extension are accepted. Does not generate an asset URL; none exist yet.
- The 3D viewer handles *visualization*, not printability, provenance, scale certification, approval, or payment.

## Required environment configuration (server only)

```dotenv
# Your actual signed-in staff user id(s); comma-separated.
DCC_FABRICATE_STAFF_CLERK_USER_IDS=user_REPLACE_WITH_REAL_STAFF_ID

# User-to-client mapping; require explicit client onboarding to Clerk.
DCC_CLIENT_CLERK_ACCESS_JSON={"carol-haggiag":["user_REPLACE_WITH_CAROL_ID"]}

# Set ONLY after a client authorizes *public delivery* of that GLB.
# This URL MUST be the real secure_url from a completed Cloudinary upload;
# never make one up, and do not use a signed URL here.
DCC_APPROVED_PUBLIC_GLB_JSON={}
```

Provision these via deployment environment settings, not a committed `.env` file. Until IDs are configured, protected pages are deliberately inaccessible to all users; do not weaken access to unblock testing. Verify non-owner, unlisted, and unrelated-client access is denied on **both HTML pages and model API** before release.

`DCC_APPROVED_PUBLIC_GLB_JSON` keys follow `client-slug/project-slug`. Its values must be real Cloudinary **public, approved** GLB download URLs. `CloudinaryGlbViewer` receives the verified URL after the page checks client/staff identity. **The model URL itself remains public; identity protection of the page does not provide confidentiality of that GLB**.

## Asset ingest and app handoff SOP

1. Verify artist owns/has rights to upload and use the specific geometry. Record separate permission for external AI model processing, operator access, client-only delivery, and public publication. Keep approvals in restricted Drive.
2. Store source Meshy/Blender files, raw STL/OBJ/3MF and candidate GLB in private model storage; keep versioned source, millimeters, hash, bounds, author, approval and QA status. The planned bucket is `dcc-client-models` with `public=false`.
3. For internal/client-only viewing, deliver the approved STL through a server route that checks the user's Clerk id maps to that client; the existing route for Carol already has this draft guard. A different client must NOT gain access by changing a path.
4. Only for **separately approved PUBLIC media**, optimize a copy to `.glb`, check format and 10 MiB raw limit, and upload with Cloudinary `resource_type=raw`, `type=upload`, `asset_folder=dccmiami/client-projects/{client}/{project}/3d-previews` and a matching `public_id_prefix` (or `use_asset_folder_as_public_id_prefix=true`). Otherwise the delivery URL might not contain the folder prefix expected by validation. Use versioned filenames (e.g. `v01-preview.glb`) without overwriting approved releases.
5. Inspect the returned `secure_url`, public delivery behavior and cross-origin GLB playback. Confirm the asset is deliberately publicly shareable. Then manually map the actual URL in the server-only `DCC_APPROVED_PUBLIC_GLB_JSON` registry. Do not imply approval from being uploaded.
6. Validate a rotation/zoom test on desktop and mobile, and a separate private STL preview where present. Check denied access for unrelated identities. Do not confuse a screen preview with a print approval.
7. Update Airtable canonical state and Google Drive case file with the Cloudinary `asset_id` and version after successful QA. DCC media folder metadata can be stored there rather than in a public Git source file. Publish only after explicit review.

## Current Carol records and boundaries

- Carol client Drive folder: https://drive.google.com/drive/folders/1sjuvFoOReJQDxxZXMw_nEKg8YlUij8n-
- Octopus case document: https://docs.google.com/document/d/1V9ZqxRxfVNqIpFqqMZ0QZo-9DBr687OkOTCxkbOSuWY/edit
- Chicken-foot case document: https://docs.google.com/document/d/1WGhBg_DV37l1qOsRiMOeL9-0Do0wVOYKzhRDRLjAksw/edit
- Airtable People record: `recek13q4yPDLwFY5`; commercial Jobs & Quotes `recSejBYq324jEpoq` belongs to the **chicken-foot** scoping project only. New octopus job record failed due to base record limit, do not count twice.
- Octopus has no generated approved STL/GLB; chicken-foot real source STL not yet verified; no models were uploaded to Cloudinary or private object storage by this update.
- No vendor approved quote, paid job, 3D production proof or photo publication consent has been created.

## Release checks

- [ ] Insert actual Clerk staff and (later) Carol IDs via secure deployment settings; verify auth from a real session.
- [ ] Unit and integration QA for the authorization map and page/API; anonymous/unlisted/wrong-client access fails closed.
- [ ] Verify private bucket and the existing Carol STL proxy on a real, *permission-approved* model only.
- [ ] Upload and test a non-client dummy GLB with public rights before using a client model. Do not use Carol's assets as a test fixture.
- [ ] Confirm three.js GLB asset URL loads in desktop/mobile browser and CORS/content type work.
- [ ] Confirm automatic test/typecheck/build and production preview permissions.
- [ ] Keep PR #37 DRAFT and do not merge or share customer URLs before these checks.

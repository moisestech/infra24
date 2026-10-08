# Cloudinary upload status

Target root:

`dccmiami/workshops/from-print-to-finished-object/`

## Completed

The folder hierarchy exists in Cloudinary:

- 00-core
- 01-see
- 02-decide
- 03-remove
- 04-add
- 05-reveal
- 06-correct
- 07-translate
- 08-resolve
- 09-tools-materials
- 10-case-studies
- 90-drafts-archive/exploration
- 90-drafts-archive/reference
- 90-drafts-archive/rejected

The 39 generated source images have been audited and assigned canonical target names and folders in `image-manifest.json`.

A local web-ready package has also been prepared with renamed WEBP copies following this hierarchy.

## Uploaded

Nine canonical images were uploaded from the local gitignored package at `assets/dcc-from-print-to-finished-object-assets-renamed/`. Returned URLs are in `image-manifest.json` and `lib/dcc/education/3d-curriculum/assets.ts`.

The source WEBPs stay on disk and out of git. Reference, exploration, and rejected files in that package were not uploaded.

## Still local only

The rest of the 39-image set remains `uploadStatus: pending`. Do not invent URLs for those.

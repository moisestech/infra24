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

## Pending

The Cloudinary connector in the current ChatGPT run does not resolve the model's local `/mnt/data` or `sandbox:` paths as upload sources. Direct upload attempts were rejected as unsupported source URLs.

Therefore:
- Cloudinary folders are ready;
- canonical public IDs are reserved by the manifest;
- image uploads/secure URLs are still pending;
- `lib/dcc/education/3d-curriculum/assets.ts` should not invent CDN URLs.

When the files are uploaded from a context Cloudinary can access (for example Cursor/local code using the existing Cloudinary credentials or an accepted remote source), preserve the manifest's:
- asset folder;
- public ID;
- canonical filename;
- status.

After upload, write the returned Cloudinary URLs/versions back into the manifest and then into the typed 3D School asset registry.

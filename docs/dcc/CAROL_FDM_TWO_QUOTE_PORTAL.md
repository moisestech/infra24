# Carol Haggiag — two FDM planning quotes and private STL previews

**Implementation:** Draft [PR #37](https://github.com/moisestech/infra24/pull/37), not approved or deployed.
**Client catalog:** `lib/dcc/fabrication/proposals/carol-client.ts`

## Client experience

- Hub: `/fabricate/proposals/carol-haggiag`
- Octopus study: `/fabricate/proposals/carol-haggiag/octopus`
- Chicken-foot study: `/fabricate/proposals/carol-haggiag/chicken-foot`

Both are tied to one client id (`carol-haggiag`) and have separate **planning** quote references. **Neither is a formal quote, payment request or confirmed job.** Both are **FDM / opaque neon PLA**, not resin. First pass consists of one octopus and one chicken-foot **form test** only, not a finished wearable pair. Earlier resin estimate ($225) does not apply to these.

**Preferred color:** high-visibility lime green (`#B4F000` digital display approximation), not an approved manufacturer shade. Confirm actual spool brand, fluorescence/brightness, stock, and operator/printer compatibility before quoting or buying.

## Reader states

Each quote page includes a reusable client-side STL viewer (`FdmStlViewer`). It:
1. Requests only the known same-origin proxy endpoint `/api/dcc/fabricate/models/carol/{project}`.
2. Displays a clear **3D preview coming soon** state when the STL is not yet available.
3. When present, parses STL, recenters it, scales to display, applies the *illustrative* lime green, and supports rotation/zoom. It labels STL bounds as **STL units** until units are verified.
4. Does not represent 3D visualization as a printability test, physical prototype or approved jewelry material.

## Private STL storage handoff, once files are supplied

**Do not upload client STL models to this public GitHub repository, to `/public`, or to a public Cloudinary URL.**

1. Provision Supabase Storage bucket `dcc-client-models` with **public=false** and deny anonymous reads.
2. Ensure server-only `SUPABASE_SERVICE_ROLE_KEY` is configured in the deployment, along with the existing `NEXT_PUBLIC_SUPABASE_URL`. **Never prefix the service-role key with NEXT_PUBLIC.**
3. Privately upload exactly:
   - `clients/carol-haggiag/octopus/v01.stl`
   - `clients/carol-haggiag/chicken-foot/v01.stl`
4. The authenticated read-only route streams approved model files from the private bucket with `Cache-Control: private, no-store`. Unknown routes, absent files and oversize files fail closed. **No customer-facing upload endpoint** exists.
5. Verify file size is 1–20 MB and that it is a valid printable-mesh candidate (components, watertightness, normals, scale, wall thickness and support constraints). Record measured dimensions and file hash privately. STL format does not encode measurement units.
6. Test both authorized and unauthorized access before allowing any client handoff.

### Access-control release gate — IMPORTANT

The current DCC proposal unlock password is **shared across proposal routes**, not user-bound. The dashboard's common `clientId` is an internal data grouping, **not yet a login account**. It is insufficient isolation for delivering confidential client STL files to real customers. Before deploying or sending Carol the page links, add a **client-scoped identity/authorization check** (e.g. Clerk user id mapped server-side to `carol-haggiag`, or a purpose-built per-client authenticated token system) and enforce it on **the page and the STL proxy**. Do not rely on hidden links or generic password as sufficient isolation. Production secret env setup and preview privacy review are also pending.

### Commercial checklist

- [ ] Confirm quantity and size for each project with Carol.
- [ ] Receive/verify actual octopus STL; never claim generic octopus geometry proof is Carol's design.
- [ ] Receive/verify exact chicken-foot STL; measure original brass and distinguish prototype from finished pair.
- [ ] Send identical **approved** private model/spec packets to Bakehouse Augusto and Moonlighter Augusto. Supplier replies and equipment are **not yet confirmed**.
- [ ] Itemize both operator quotes separately (setup, grams, print time, supports, failure, finish, delivery); do not disclose another operator's bid.
- [ ] Select capacity and produce two independent **fixed** DCC prices (model work, fabrication, QA, margin), optionally consolidated as one invoice only after both are accepted.
- [ ] Obtain payment/approval and client model-sharing authorization before production. Different Moonlighter workshop entitlements must not be charged twice.
- [ ] Update `quoteStatus`, `priceUsd` and the actual job/payment records **only after signed evidence**, not during preparation.
- [ ] Finish client-scoped authorization, preview and CI checks, then deploy for private client review.

## Legacy route change

The former `/fabricate/proposals/carol-haggiag` was a detailed **resin-oriented** proposal and remains preserved in Git history and existing `CAROL_PROPOSAL` data. The route now becomes a two-study **FDM hub**. This is intentional: the former $225 resin quote is no longer a current customer-facing offer. If needed, prepare a separate explicitly historical version; do not silently reintroduce the resin price as an FDM estimate.

## Current release status

All pages and the STL proxy are code changes only in a draft pull request; **no STL has been uploaded, no private bucket verified, no client account provisioned, no fixed price approved, and no deployment completed**.

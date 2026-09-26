# DCC Fabrication OS — Airtable schema

Proposal only. Do not create tables or fields until this spec is reviewed and the read-only checklist at the bottom has been run.

Base: **INFRA24 CRM / DCC OS** `appWoYBRdklcz2RJH` ([`lib/dcc/os-config.ts`](../../lib/dcc/os-config.ts)).

Architecture and money rules: [`FABRICATION-OS.md`](./FABRICATION-OS.md).

Sensitivity: **Public** (sanitized DTO), **Client**, **Fabricator**, **Staff**, **Finance** (Admin, and Operations where the permission matrix allows).

## Reuse

Leave these tables in place. Extend only where this doc says so.

| Table | Id | Role |
|---|---|---|
| People | `tbltHiqscY80ybsGE` | CRM person. Extend. |
| Institutions | `tblu9cIAsNSg5Khhp` | Partner / client org. Link target. |
| Opportunities | `tblFdv4oI3FUXWtBl` | CRM. No fabrication fields. |
| Interactions | `tbl4PSVbNU2G6kLVl` | CRM history on the person page. |
| Campaigns | `tblNdjser5MtVbZ4U` | CRM. No fabrication fields. |
| Jobs | `tblrkDpVTX2eX8QBl` | Becomes the Fabrication Job. Extend. |
| Machines | `tblVtaUYHwgf1rRR8` | Physical assets. Extend with a location link. |
| Services | `tblP0tlOOVQE2gQBG` | Commercial catalog. Jobs keep linking here. |
| Change Log | `tblrztSgiyzpXSq6y` | Audit for explicit writes. Keep `appendChangeLog`. |
| Bookings | `tbljHuPYt3ArDuUpl` | Machine time holds. Not classes and not runs. |
| Credits | `tblm9gWEKM1WcfeKU` | Unrelated. Leave. |
| MBOs | `tbl0wHfhogs7Zqz7r` | Unrelated. Leave. |

## Not a source of truth

| Table | Id | Why it stays out of the new graph |
|---|---|---|
| Transactions | `tbljoW6jK9ZgVuWYg` | CEO scorecard read model (Amount, Type, Date, Job, Notes). Not a Payment Reference and not a payout ledger. Do not delete. Do not backfill into Payment References as if they were reconciled. |
| Programming | `tblY3pg6ksCWgsp9F` | Oolite / Memory Agent workshops. DCC sessions get a new table. |

Git `FabricationJob` / `Operator` in `lib/dcc/fabrication/` stay proposal documents. `hourlyRateInternal` is never a public column. Supabase `courses`, `course_enrollments`, and `workshop_registrations` stay tenant SaaS.

Curriculum slugs, stored on Courses and nowhere else as copy:

- `from-file-to-physical-object`
- `blender-for-artists`
- `plasticity-for-artists`
- `rhino-for-artists`
- `fix-my-3d-file`
- `grasshopper-computational-objects`
- `parametric-cad-functional-objects`

## People — extend

Primary field stays **Full Name**.

Add only:

| Field | Type | Sensitivity | Notes |
|---|---|---|---|
| DCC Roles | Multiple select | Staff | Current tags, not history. Options below. |
| Clerk User ID | Single line text | Staff | Empty unless set from a signed-in Clerk session. |
| Neighborhood | Single line text | Public when a fabricator profile is approved | City already exists. Do not add a second city field. |

**DCC Roles:** Client, Student, Fabricator, Instructor, Estimator, Operator, Collaborator, Institutional Contact.

Do not add Paid, earnings, ratings, or a public phone. **Public Profile Consent** already exists (`Public Listing OK`, `Ask Before Publishing`, `Do Not Publish`) and is CRM consent, not fabricator approval.

**Notes** stay Staff. Public DTOs omit them.

## Jobs — extend

This table is the Fabrication Job. Primary field stays **Job Name**.

Keep, unchanged in this phase:

| Field | Type | Notes |
|---|---|---|
| Customer | Link → People | Treat as the client link. Do not add a second Client field unless the checklist shows Customer is not a People link. |
| Tier | Single select | Associate, Public, Commercial. |
| Service | Link → Services | |
| Machine | Link → Machines | Intended equipment only. The queue reads Runs. |
| Due Date | Date | Internal deadline. |
| Notes | Long text | Legacy intake notes. New internal copy goes to Internal Notes. |
| Quote Amount | Currency | Client revenue cache until quote lines are backfilled. |
| Material Cost | Currency | Legacy. Read-only after Job Cost Lines exist. |
| Labor Cost | Currency | Legacy. Read-only after Job Cost Lines exist. |
| Machine Reserve | Currency | Legacy. Read-only after Job Cost Lines exist. |
| Stage | Single select | Legacy. `createInquiryJob()` keeps writing `Inquiry`. Stop treating it as the operating lifecycle. |

**Stage** options today, from [`lib/dcc/os-field-map.ts`](../../lib/dcc/os-field-map.ts): Inquiry, Quoted, Approved, In Production, Post-Processing, Delivered, Paid, Declined.

### Operating Stage

New single select. Code reads this once a row has been mapped. Options, in order:

1. New Inquiry
2. Scoped
3. Quoted
4. Accepted
5. Payment Pending
6. Production Authorized
7. Open for Fabrication
8. Assigned / Claimed
9. In Production
10. Review / QC
11. Ready
12. Delivered
13. Documented
14. Closed

Exceptions: Declined, Cancelled, On Hold.

### Legacy Stage map

Applied by `mapLegacyJobStage()`. This is not a second lifecycle.

| Legacy Stage | Operating Stage | Money |
|---|---|---|
| Inquiry | New Inquiry | |
| Quoted | Quoted | |
| Approved | Accepted | Acceptance is not payment. |
| In Production | In Production | |
| Post-Processing | Review / QC | Machine post-process lives on Run status. |
| Delivered | Delivered | |
| Paid | Leave Operating Stage unset from this word | Create a Payment Reference from production evidence. Never copy Paid onto Operating Stage. |
| Declined | Declined | |

Git `FabricationJobStatus` map (`mapGitJobStatus()`):

| Git status | Operating Stage |
|---|---|
| INQUIRY | New Inquiry |
| FILE_RECEIVED, TECHNICAL_REVIEW, MATERIAL_CONFIRMATION, PROTOTYPE_SCOPING, SCOPED | Scoped |
| QUOTED | Quoted |
| ACCEPTED_PAID | Accepted, plus a Payment Reference |
| OPEN_FOR_FABRICATION | Open for Fabrication |
| CLAIMED | Assigned / Claimed |
| PRODUCTION | In Production |
| POST_PROCESS, QA | Review / QC |
| READY_FOR_DELIVERY | Ready |
| DELIVERED | Delivered |
| DOCUMENTED | Documented |

### New Job fields

| Field | Type | Sensitivity | Notes |
|---|---|---|---|
| Job Code | Single line text | Staff | Human id. Not the Airtable record id. |
| Institution | Link → Institutions | Staff | Optional. |
| Estimator | Link → People | Staff | |
| Project Title | Single line text | Client | |
| Scope | Long text | Client | |
| Internal Notes | Long text | Staff | Never on a client or public DTO. |
| Client Notes | Long text | Client | |
| Quantity | Number | Client | |
| Requested Deadline | Date | Client | Due Date remains internal. |
| Material Summary | Single line text | Client | |
| Process Summary | Single line text | Client | |
| Payment State | Single select | Finance | Display cache. Options below. Written by the payment sync, not by a form checkbox. |
| Documentation Permission | Checkbox | Staff | Default off. |
| Portfolio Permission | Checkbox | Staff | Default off. |
| Git Proposal Slug | Single line text | Staff | Links a git proposal. Does not import it. |
| QB Customer ID | Single line text | Finance | Copy. Payment Reference is the operational row. |
| QB Estimate ID | Single line text | Finance | Copy. |
| QB Invoice ID | Single line text | Finance | Copy. |
| File Received | Checkbox | Staff | Scoped checklist. Not its own stage. |
| Technical Review | Checkbox | Staff | Scoped checklist. |
| Material Confirmation | Checkbox | Staff | Scoped checklist. |
| Prototype Scoping | Checkbox | Staff | Scoped checklist. |
| Held Stage | Single select | Staff | Same options as Operating Stage, excluding On Hold. Set when the job enters On Hold. |

**Payment State:** Not Required, Pending, Invoiced, Partially Paid, Paid, Failed, Refunded, Waived, Needs Reconciliation.

## Machines — extend

Keep Name, Type, Status, Build Volume, Materials, What It Can Make, Notes.

Status stays: Operational, Service Soon, Maintenance, Offline, Planned / Not Acquired.

| Field | Type | Sensitivity | Notes |
|---|---|---|---|
| Physical Location | Link → Locations | Staff | Kind must be Machine Site. |
| Owner | Link → People | Staff | Empty when DCC owns the machine and no person is the owner record. |
| Owner Kind | Single select | Staff | DCC-owned, Partner-owned, Fabricator-owned, Other. |
| Manufacturer | Single line text | Staff | |
| Model | Single line text | Staff | |
| Process | Single line text | Public | Process name only. |
| Active | Checkbox | Staff | |

Owner, site, and operator stay three different facts. The operator is on the Run.

## New tables

Create these in `appWoYBRdklcz2RJH` only after review. Names below are the Airtable table names.

### Locations

Primary: **Location Name**.

| Field | Type | Sensitivity | Options / notes |
|---|---|---|---|
| Location Kind | Single select | Staff | Area, Machine Site, Class Venue |
| Public Label | Single line text | Public | What a public page may show. |
| Address | Long text | Staff | Exact address only for Machine Site and Class Venue. |
| Neighborhood | Single line text | Public | |
| City | Single line text | Public | |
| Visibility | Single select | Staff | Internal, Fabricator, Public Label Only |
| Notes | Long text | Staff | |

Person geography uses People.City and People.Neighborhood, or a Fabricator Profile → Area link. A class session links a Class Venue. A machine links a Machine Site. Do not put one generic location field on People.

### Courses

Primary: **Course Slug** (the git id).

| Field | Type | Sensitivity | Options / notes |
|---|---|---|---|
| Title | Single line text | Public | |
| Git Path | Single line text | Staff | Pointer. Not a copy of the syllabus. |
| Status | Single select | Public | Pilot, Coming, In Development, Retired |
| Summary | Single line text | Public | One line. No chapter bodies. |

### Class Sessions

Primary: **Session Name**, formula `{Course} & " " & DATETIME_FORMAT({Start}, "YYYY-MM-DD")`.

| Field | Type | Sensitivity | Options / notes |
|---|---|---|---|
| Course | Link → Courses | Public | |
| Start | Date time | Public | |
| End | Date time | Public | |
| Timezone | Single line text | Public | Default `America/New_York`. |
| Instructors | Link → People | Public | Names only on public DTOs. |
| Venue | Link → Locations | Public | Kind Class Venue. Public DTO uses Public Label. |
| Partner Institution | Link → Institutions | Staff | |
| Capacity | Number | Staff | Public DTO may show seats remaining later. Not in Phase 1 UI. |
| Visibility | Single select | Staff | Public, Private, Institutional, Internal |
| Registration Status | Single select | Public | Draft, Open, Closed, Cancelled |
| Price | Currency | Public | |
| Payment Policy | Single select | Staff | Prepaid Checkout, Invoice, Free, Waived, Custom |
| Prerequisite Courses | Link → Courses | Public | |
| Equipment Notes | Long text | Staff | |
| Machines | Link → Machines | Staff | Equipment for the session, not a print queue. |
| Session Kind | Single select | Staff | Public Class, Private Class, Partner Workshop, Institutional, Operator Onboarding, Certification, Internal Training |
| Notes | Long text | Staff | |

One model. Visibility and Session Kind distinguish public, private, partner, institutional, and internal training.

### Enrollments

Primary: **Enrollment Name**, formula of Person and Session.

| Field | Type | Sensitivity | Options / notes |
|---|---|---|---|
| Person | Link → People | Staff | |
| Class Session | Link → Class Sessions | Staff | |
| Registered At | Date time | Staff | |
| Status | Single select | Staff | Interested, Registered, Payment Pending, Confirmed, Attended, Completed, No Show, Cancelled, Refunded |
| Amount Expected | Currency | Finance | |
| Amount Paid | Currency | Finance | Cache. Payment Reference is the row. |
| Scholarship | Checkbox | Finance | |
| Waiver | Checkbox | Finance | |
| Source | Single line text | Staff | |
| Attendance | Single select | Staff | Absent, Partial, Present |
| Completion | Checkbox | Staff | Does not write a competency. |
| Verified By | Link → People | Staff | Instructor confirmation of attendance, not a competency grant. |
| Notes | Long text | Staff | |
| Payment References | Link → Payment References | Finance | |

### Competency Definitions

Primary: **Competency Name**.

| Field | Type | Sensitivity | Options / notes |
|---|---|---|---|
| Kind | Single select | Public | Skill, Process, Machine |
| Course | Link → Courses | Public | Optional. |
| Machine | Link → Machines | Staff | Optional. Required when Kind is Machine. |
| Description | Long text | Public | Short. |
| Active | Checkbox | Staff | |

### Person Competencies

Primary: formula of Person and Competency.

| Field | Type | Sensitivity | Options / notes |
|---|---|---|---|
| Person | Link → People | Staff | |
| Competency | Link → Competency Definitions | Public when the profile is approved and level is Verified or Active Fabricator | |
| Level | Single select | Public for Verified and Active Fabricator on an approved profile | Learner, Assisted, Verified, Active Fabricator |
| Status | Single select | Staff | Active, Inactive, Needs Reverification |
| Source Session | Link → Class Sessions | Staff | Optional. |
| Evidence | Long text | Staff | Attachment allowed. Never public. |
| Verified By | Link → People | Staff | Required at Verified and Active Fabricator. |
| Verified At | Date | Staff | Required at Verified and Active Fabricator. |
| Review Due | Date | Staff | |
| Notes | Long text | Staff | |

Public profiles list competency names at Verified or Active Fabricator with Status Active. Learner and Assisted stay off the public page.

### Fabricator Profiles

Primary: **Public Name**. One person, one profile.

| Field | Type | Sensitivity | Options / notes |
|---|---|---|---|
| Person | Link → People | Staff | |
| Slug | Single line text | Public | URL key. |
| Portrait URL | URL | Public | Cloudinary or equivalent. |
| Short Bio | Long text | Public | |
| Area | Link → Locations | Public | Kind Area. Public DTO uses Public Label or Neighborhood. |
| Processes | Multiple select or long text | Public | |
| Software | Multiple select or long text | Public | |
| Availability | Single select | Public | Available, Limited, Unavailable, Hidden. Hidden is omitted from the public DTO. |
| Profile Status | Single select | Staff | Draft, Opted In, Approved, Unpublished |
| Opted In At | Date | Staff | |
| Approved By | Link → People | Staff | |
| Approved At | Date | Staff | |

Public pages require Profile Status Approved and People.Public Profile Consent other than Do Not Publish. The DTO omits email, phone, payout, CRM notes, and Clerk User ID.

### Portfolio Items

Primary: **Title**.

| Field | Type | Sensitivity | Options / notes |
|---|---|---|---|
| Person | Link → People | Public when Visibility is Public | |
| Job | Link → Jobs | Staff | Optional. |
| Runs | Link → Fabrication Runs | Staff | Optional. |
| Images | Long text or URL list | Public when Visibility is Public | Public copies are Cloudinary URLs. |
| Process | Single line text | Public | |
| Material | Single line text | Public | |
| Machine | Link → Machines | Public | Name only. |
| Description | Long text | Public | |
| Collaborators | Link → People | Public | Names only. |
| Completed On | Date | Public | |
| Visibility | Single select | Staff | Private, Client Approved, Public |
| Rights Note | Long text | Staff | |
| Client Approved | Checkbox | Staff | |
| Featured | Checkbox | Public | |

A completed job may create a Private candidate. Visibility becomes Public only when Portfolio Permission is on and Client Approved is checked. Client work does not auto-publish.

### Fabrication Runs

Primary: **Run Name**, formula of job code and run number.

This table is the production queue. Board, machine, calendar, fabricator, and job views query it. They do not get their own tables.

| Field | Type | Sensitivity | Options / notes |
|---|---|---|---|
| Job | Link → Jobs | Staff | |
| Run Number | Number | Staff | |
| Machine | Link → Machines | Staff | The exact machine. |
| Machine Location | Lookup from Machine → Physical Location | Staff | |
| Operator | Link → People | Staff | |
| Booking | Link → Bookings | Staff | Optional hold. Phase 1 does not detect conflicts. |
| File Version | Single line text | Staff | |
| Material | Single line text | Client when the job DTO includes approved progress | |
| Color | Single line text | Staff | |
| Quantity | Number | Staff | |
| Settings Ref | Single line text | Staff | |
| Estimated Minutes | Number | Staff | |
| Started At | Date time | Staff | |
| Expected Completion | Date time | Staff | |
| Completed At | Date time | Staff | |
| Status | Single select | Staff | Ready, Assigned, Queued, Printing, Cooling / Curing, Post Processing, QC, Complete, Paused, Failed, Cancelled, Reprint Required |
| Failure Reason | Long text | Staff | |
| Reprint Of | Link → Fabrication Runs | Staff | Self link. A reprint is a new row. |
| Material Used | Single line text | Finance | |
| Labor Minutes | Number | Finance | |
| QC State | Single select | Staff | Pending, Passed, Failed |
| Photos | Attachment | Staff | Operational. Public portfolio uses URLs on Portfolio Items after approval. |
| Notes | Long text | Staff | |
| Output Note | Long text | Staff | |

### Job Quote Lines

Primary: **Label**. Client-facing packaging. This is what a QuickBooks preview shows.

| Field | Type | Sensitivity | Options / notes |
|---|---|---|---|
| Job | Link → Jobs | Client | |
| Label | Single line text | Client | |
| Description | Long text | Client | |
| Category | Single select | Client | preflight, fabrication, postprocess, qa, handoff, other |
| Quantity | Number | Client | |
| Unit Amount | Currency | Client | |
| Amount | Currency | Client | |
| Sort | Number | Client | |

These rows are not internal costs.

### Job Cost Lines

Primary: **Label**. Finance only.

| Field | Type | Sensitivity | Options / notes |
|---|---|---|---|
| Job | Link → Jobs | Finance | |
| Label | Single line text | Finance | |
| Category | Single select | Finance | Materials, Consumables, Machine Allocation, Fabrication Labor, Finishing, Shipping, External Vendor, Fabricator Compensation, Other |
| Quantity | Number | Finance | |
| Unit Amount | Currency | Finance | |
| Amount | Currency | Finance | |
| Notes | Long text | Finance | |

Client revenue stays on the quote and on Payment References. It is not a cost category.

### Payment References

Primary: **Payment Ref**, formula of Provider and Document Number.

Operational cache. Not an accounting ledger. No card or bank numbers.

| Field | Type | Sensitivity | Options / notes |
|---|---|---|---|
| Person | Link → People | Finance | |
| Enrollment | Link → Enrollments | Finance | Optional. |
| Job | Link → Jobs | Finance | Optional. |
| Provider | Single select | Finance | QuickBooks, Stripe, Cash, Zelle, Venmo, Partner Paid, Waived, Manual, Other |
| Provider External ID | Single line text | Finance | |
| QB Customer ID | Single line text | Finance | |
| QB Estimate ID | Single line text | Finance | |
| QB Invoice ID | Single line text | Finance | |
| QB Sales Receipt ID | Single line text | Finance | Used for prepaid public workshops. |
| Document Number | Single line text | Finance | |
| Expected Amount | Currency | Finance | |
| Paid Amount | Currency | Finance | |
| Balance | Currency | Finance | |
| Currency | Single line text | Finance | `USD` |
| Payment State | Single select | Finance | Same options as Jobs.Payment State |
| Paid At | Date | Finance | |
| Refund Amount | Currency | Finance | |
| Reconciliation | Single select | Finance | Unlinked, Synced, Needs Reconciliation, Sync Error |
| Last Synced At | Date time | Finance | |
| Sync Error | Long text | Finance | |
| Notes | Long text | Finance | |

When any QB id is present, amounts change only through the QuickBooks adapter.

Public workshop path: checkout → Payment Reference with the provider id → explicit sales-receipt sync. Private / institutional path: invoice id on this row. Do not store both a sales receipt id and an invoice id on the same reference.

### Payouts

Primary: **Payout Name**.

Visible to Finance and to the fabricator the row belongs to.

| Field | Type | Sensitivity | Options / notes |
|---|---|---|---|
| Person | Link → People | Finance / own Fabricator | |
| Job | Link → Jobs | Finance | |
| Runs | Link → Fabrication Runs | Finance | |
| Model | Single select | Finance | Flat Task, Hourly Labor, Fixed Project, Revenue Share |
| Rate | Currency or number | Finance | Fraction only when Model is Revenue Share. |
| Hours or Quantity | Number | Finance | |
| Expected Amount | Currency | Finance | |
| Approved Amount | Currency | Finance | |
| Approved By | Link → People | Finance | |
| State | Single select | Finance / own Fabricator | Not Applicable, Estimated, Awaiting Approval, Approved, Payable, Paid, On Hold |
| QB Vendor ID | Single line text | Finance | |
| QB Bill ID | Single line text | Finance | |
| Paid At | Date | Finance | |
| Notes | Long text | Finance | |

Default Model for a new payout is **Flat Task**. Revenue share is calculated only when Model is Revenue Share.

## Read-only checklist before any Meta API create

1. List Jobs fields. Confirm **Customer** is a linked record to People. If it is, alias it in code and do not add Client.
2. List distinct Jobs.**Stage** values and counts. Map with `mapLegacyJobStage()`. Rows in Paid get a Payment Reference note, not an Operating Stage of Paid.
3. List People field names. Confirm **DCC Roles**, **Clerk User ID**, and **Neighborhood** are absent or already match this spec.
4. Confirm Programming has no DCC class rows that would be orphaned by the new Class Sessions table.
5. Leave Transactions, Credits, MBOs, and Bookings in place.
6. Record the diff in the progress log before the first create. This document is not that create.

# Airtable-backed community graph

## Member journey

A visitor explores `/network/community`, selects interests, opens a profile and follows its public links. `?profile=public-slug` opens a selected profile directly; the detail panel provides a copy-link action. A separate optional form requests a public profile, stages it privately, and acknowledges receipt only after a confirmed provider write. Reviewers verify identity and permission before publishing it. Passport remains an optional local journey preview.

## Server configuration

Set dedicated server-only variables for this feature. Never use a `NEXT_PUBLIC_` prefix or expose the provider token in the browser.

```dotenv
AIRTABLE_DCC_ATLAS_API_KEY=
AIRTABLE_DCC_ATLAS_BASE_ID=
AIRTABLE_DCC_ATLAS_PEOPLE_TABLE=
AIRTABLE_DCC_ATLAS_INTAKE_TABLE=
DCC_ATLAS_INTAKE_ENABLED=false
```

Scope the token to the approved People table and private intake table. Keep writes disabled until provider capacity, fields, review ownership, a contact/removal route and deployment abuse controls are ready. IDs and actual credentials belong in private configuration, not this repository. Do not point the new adapter at an unrelated general-purpose CRM.

## Read contract

`GET /api/marketing/community-atlas` reads selected fields on the server and returns an explicit public projection. Every eligible row requires:

- `Atlas Publication State` = `Approved`.
- `Atlas Public Consent`, `Atlas Identity Verified` and `Public Profile?` all true.
- A valid unique `Profile Slug`, approved `Display Name` and `Short Bio`.
- At least one valid approved link in `Atlas Public Links`.

`Public Skills` supplies selected practice tags; `Atlas Interests` supplies the six stable discovery IDs. `Atlas Public Links` is a JSON array, for example `[{"label":"Portfolio","url":"https://example.org"}]`. Only reviewed HTTPS links with no embedded credentials pass. Email, phone, notes, internal record IDs and withheld candidates are never returned. Duplicate slugs are held out until corrected.

The client refreshes once per minute while visible, on returning to the page, and on manual refresh. Responses use `Cache-Control: no-store`; a configured provider error clears previously displayed profiles rather than retaining a potentially withdrawn listing. Switching a row to Hidden/Withdrawn or removing any approval flag hides it on the next successful refresh. An unconfigured adapter returns explicitly labeled editorial preview data, not a live roster. The client does not estimate anonymous member count from profile counts.

## Intake contract

`POST /api/dcc/atlas/intake` requires same-origin JSON, bounded content, a retry UUID, a private email, display name, summary, practice, selected interests, 1–5 HTTPS links and affirmative public-profile consent at the displayed disclosure version. It records the exact disclosure, submitted time and Pending state in private `Atlas Intake Submissions`. It never changes People approval flags or publishes automatically.

Expected staging fields: Submission, Submission Key, Display Name, Verification Email, Summary, Practice, Interests, Links JSON, Public Profile Consent, Disclosure Version, Consent Text, Submitted At and Review State. Matched Person and Review Notes support manual identity reconciliation. The form does not enroll a Passport account or subscribe anyone to updates.

A UUID lookup makes sequential retries idempotent; concurrent duplicate requests are not protected by a provider unique constraint. Review must reconcile duplicates before publication. Per-instance request throttling and a honeypot provide limited abuse resistance; production edge protection or a distributed limiter is a launch requirement. Failed, unavailable or capacity-rejected writes return an error and preserve the form. Never claim a successful enrollment after such an error.

## Review and maintenance

1. Confirm identity and match the canonical member before copying any proposed fields to People.
2. Review which content and links the member actually authorized. Set a unique public slug.
3. Keep publication Pending/Hidden while changing public fields. Record the source submission and review in the private workflow.
4. Set explicit consent and verified identity only after evidence is confirmed. Enable Public Profile and Approved state only after content review.
5. Check the public response and profile link. Do not equate a public profile with verified operator capacity or professional availability.
6. For changes or withdrawal, hide first, then review the request. Public visibility refreshes within the stated minute window; a self-service verified edit portal is still future work.

No real member submission is created by tests. A public request form is not a secure member-only directory or an autonomous publishing system.

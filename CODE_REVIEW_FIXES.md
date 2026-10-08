# Code review and fixes — 2026-10-08

Reviewed application routes, middleware/authentication, service and validation layers, Prisma schema and seed, shared components/utilities, and project build configuration.

## Fixed

- Login redirect loop: separate the authenticated dashboard layout from `/admin/login` without changing public URLs.
- Public lead/booking submission and project reads were blocked by middleware. Allow only their public methods; protect dotted private paths, clients, and admin-only APIs.
- Remove the incompatible/unneeded Auth.js Prisma adapter from NextAuth v4 credentials/JWT authentication.
- Assign submitted leads to the authenticated creator or the earliest active administrator; preserve contact message/service fields and omit absent optional values.
- Correct portfolio response parsing and filters to match the current Prisma project types; implement published project detail pages.
- Keep private CRM columns out of public project API responses and homepage client props. Public submissions return acknowledgments rather than internal records.
- Validate booking and quotation updates, strip extra fields, calculate quotation totals using decimal arithmetic, generate quotation numbers, and return safe 400/404/409 errors.
- Generate type aliases from Prisma, fix invalid booking activity types/status filters and booking date display.
- Bound pagination and ignore unsupported enum filters before querying Prisma.
- Make lead conversion atomic, including client creation, conversion metadata, and audit log; use one shared implementation.
- Fix room-area double counting/order-dependent pricing and empty-room NaN; reject invalid areas and reconcile payment installments.
- Remove fabricated revenue from the dashboard, correct the total-project label, and fix dashboard navigation highlighting.
- Mark database/request-dependent routes dynamic so builds do not query the live database; set metadataBase and escape `<` in reusable JSON-LD rendering.
- Add Jest configuration and 10 regression tests.

## Validation

- `npm test -- --runInBand`: 10 tests passed.
- `npm run type-check`: passed.
- `npm run build`: passed (final build repeated after adding the project detail page).
- `git diff --check`: passed.

No production database or credentials were provided. Actual database writes, authentication with a real user, transaction rollback/concurrency, and production deployment have not been integration-tested. Public lead capture requires at least one ACTIVE ADMIN in the database. No schema migration is required by this patch.

## Existing incomplete features / follow-up

These are unfinished product scope, not implemented features verified by this patch:

- Admin create/edit/detail screens (except the existing client detail), CSV export endpoints, settings/media/testimonials/blog administration, and public about/privacy/terms pages have links but no implementations.
- Blog, email delivery, follow-up tasks, persistent scoring and several automation methods are placeholders/TODOs.
- Public branding describes interior design while the database/seed project types describe a web agency; filters now follow the actual schema. A domain/schema migration needs a product decision.
- Rate limiting is per-process memory and needs a shared production store and a trusted proxy IP policy. JWT roles/status can become stale until the session is renewed.
- Seed accounts use documented demonstration passwords; do not use those accounts unchanged in production.
- This review did not include a dependency vulnerability audit, penetration test or real-browser visual/device audit. The old/backup page files remain in the repository.

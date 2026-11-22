# Architecture

## Status and scope

The repository has an Expo / React Native app with Home, Track, History, and
Prepare tabs, plus a Spring Boot API for the first check-in persistence slice.
Track submits entries and History loads the signed-in user's records. Firebase
Authentication provides mobile email/password sign-in; the backend verifies
Firebase ID tokens and scopes check-in queries to the verified UID. Deployment
and broader data-protection decisions still need to be made.

## Planned technology stack

- **Mobile:** React Native, Expo, and TypeScript.
- **Backend:** Java and Spring Boot, organized as a modular monolith.
- **Database:** PostgreSQL.
- **Backend tests:** JUnit.

Keep the initial system understandable for a solo developer. Do not add
microservices, infrastructure, frameworks, or dependencies without a clear
need and an explicit explanation.

## System overview

The mobile app presents the user experience and communicates with the backend.
The Spring Boot backend owns application rules, authorization, and access to
stored data. PostgreSQL persists the records required by the MVP.

```text
React Native / Expo mobile app
              |
       Backend API boundary
              |
 Java / Spring Boot modular monolith
              |
         PostgreSQL
```

The first API uses REST endpoints described below. The deployment model
remains to be decided.

Firebase Authentication is selected for mobile email/password sign-in. The
backend verifies Firebase ID tokens with the Firebase Admin SDK and derives
ownership from the verified UID. Client-provided owner IDs are never trusted.

## First vertical slice: check-in

The first persistence feature is a check-in create/list flow:

- `POST /api/v1/check-ins` validates `recordedDate`, `painLevel` (integer
  0–10), `dailyImpact` (`NOT_AT_ALL`, `A_LITTLE`, or `A_LOT`), selected
  `symptoms`, and optional `notes`. The owner UID comes only from the verified
  Firebase token.
- `GET /api/v1/check-ins` returns entries scoped to the verified Firebase UID.
- PostgreSQL stores the entry and its selected symptom codes using a Flyway
  migration. Cycle fields are deferred. The exact additional choices behind
  Figma's “More” symptom control remain to be defined.
- The mobile Track screen submits the form and History displays the
  authenticated user's returned entries when the local API is configured.

Backend tests reject missing and invalid tokens, check request validation and
owner derivation, and verify repository results are scoped to one Firebase UID.
The mobile app sends the current user's Firebase ID token as a bearer token.

The initial tab shell uses React Native components and local screen-selection
state rather than adding a navigation library. This keeps the first increment
small; replace it with a navigation solution when nested flows, deep links, or
navigation state make that worthwhile.

The mobile code is separated by responsibility: `App.tsx` observes auth state,
`src/auth/` owns sign-in flows, `src/navigation/` owns tab selection,
`src/screens/` contains tab screens, and shared UI and palette live in
`src/components/` and `src/theme/`.

## Backend module boundaries

These are logical areas within one backend application, not separate services:

- **Health tracking:** Create and retrieve symptom entries and optional cycle
  information.
- **Appointment preparation:** Manage user-authored questions and concerns;
  provide summaries derived from the user's selected history.
- **Educational resources:** Provide reviewed educational content and its
  sources.
- **Identity and access:** Verify Firebase ID tokens and authorize access to
  the authenticated user's own records using the verified Firebase UID.

The dashboard should compose recent activity from existing feature data
rather than introduce a separate service or duplicate health records.

## Main interaction flows

### Record and review symptoms

1. The user enters symptoms, pain level, daily impact, notes, and any optional
   cycle information in the mobile app.
2. The app sends the entry through the backend API boundary.
3. The backend authenticates and authorizes the request, validates it, and
   persists the entry in PostgreSQL.
4. The mobile app requests the user's history and displays the returned
   records.

### Prepare for an appointment

1. The user records questions and concerns.
2. The app requests a summary for a user-selected history range.
3. The backend derives a factual summary from the user's records; it does not
   diagnose or infer clinical conclusions.
4. The user reviews and controls any use of the summary.

### Read educational resources

The mobile app requests educational resources from the backend. Each resource
needs a source and a review process; content ownership and update procedures
remain open decisions.

## Cross-cutting requirements

- Authorize every private-record operation on the backend and scope queries to
  the authenticated user.
- Validate input at the backend boundary; client-side checks improve usability
  but are not an authorization or validation substitute.
- Avoid logging health information, notes, credentials, or access tokens.
- Use fictional health records in development and tests.
- Plan secure authentication, account deletion, and data protection before
  real health data is stored.
- Test domain rules, authorization boundaries, and persistence behavior with
  focused JUnit tests.
- Preserve accessible, low-effort mobile flows and the supplied Figma design
  direction.

## Open decisions

- Authentication, account recovery, and user onboarding.
- Whether the app needs offline entry and later synchronization.
- API style and versioning needs.
- Hosting, backups, encryption details, and operational responsibilities.
- Data retention and account/data deletion behavior.
- Launch regions and applicable privacy or regulatory obligations.
- Educational-content sources, reviewers, and update cadence.

# Architecture

## Status and scope

This document describes the planned MVP architecture, not implemented code.
The repository currently contains documentation only. The technology stack
below is the project plan; detailed API contracts, deployment, and data
protection decisions still need to be made.

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

The API protocol and contract, authentication mechanism, and deployment model
remain to be decided.

## Backend module boundaries

These are logical areas within one backend application, not separate services:

- **Health tracking:** Create and retrieve symptom entries and optional cycle
  information.
- **Appointment preparation:** Manage user-authored questions and concerns;
  provide summaries derived from the user's selected history.
- **Educational resources:** Provide reviewed educational content and its
  sources.
- **Identity and access:** Authenticate users and authorize access to their
  own records. The specific authentication design is unresolved.

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

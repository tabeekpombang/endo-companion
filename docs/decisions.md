# Decision Log

This file records project decisions that affect product scope or architecture.
New decisions should include context, the selected direction, and
consequences. The entries below capture the project brief; open questions are
kept separate so they are not treated as settled design choices.

## D-001: Build a mobile companion for endometriosis support

- **Status:** Accepted
- **Context:** The product is intended for people with diagnosed or suspected
  endometriosis.
- **Decision:** Focus on symptom documentation, understanding personal health
  history, appointment preparation, and supportive educational resources.
- **Consequences:** Welcome users regardless of diagnosis status. The app
  supports, but does not diagnose or replace professional care.

## D-002: Limit the initial release to the defined MVP

- **Status:** Accepted
- **Context:** The long-term vision includes community and further insights,
  but the first release needs a focused scope.
- **Decision:** MVP features are the home dashboard, symptom tracker, health
  history, appointment preparation, and educational resources. Community,
  profiles/moderation, and additional insights are future features.
- **Consequences:** Do not implement future features unless explicitly
  requested.

## D-003: Use the planned mobile and backend stack

- **Status:** Accepted
- **Context:** The project brief specifies the initial technologies.
- **Decision:** Use React Native, Expo, and TypeScript for mobile; Java and
  Spring Boot for the backend; PostgreSQL for persistence; and JUnit for
  backend tests.
- **Consequences:** Keep dependencies and infrastructure minimal. Revisit
  choices only when a concrete requirement warrants it.

## D-004: Start with a modular monolith

- **Status:** Accepted
- **Context:** This is a solo-developer project and the initial backend should
  stay understandable and maintainable.
- **Decision:** Organize the Spring Boot backend as one modular monolith, not
  microservices.
- **Consequences:** Keep domain boundaries clear inside the application and
  avoid introducing distributed-system complexity without a demonstrated need.

## D-005: Treat health data and medical safety as core requirements

- **Status:** Accepted
- **Context:** The app stores sensitive health information and serves people
  navigating a medical condition.
- **Decision:** Minimize data collection, enforce authorization on the
  backend, avoid logging sensitive information, use fictional development
  data, and plan secure authentication and account deletion. Do not include
  an AI medical chatbot or diagnostic prediction in the MVP.
- **Consequences:** Do not claim HIPAA compliance without a proper assessment.
  The product must clearly state that it does not replace professional care.

## D-006: Use Figma as the visual reference

- **Status:** Accepted
- **Context:** Initial screen designs exist in Figma.
- **Decision:** Reuse the supplied designs where possible and avoid unnecessary
  redesigns. The visual direction is calming, welcoming, and accessible.
- **Consequences:** The designs still need to be accessible to the
  implementation workflow before screen-level decisions are made.

## Open decisions

- Authentication, account recovery, and onboarding approach.
- Offline use, synchronization, and the API contract.
- Exact symptom taxonomy, pain scale, daily-impact options, and cycle fields.
- Educational content sources, review responsibility, and update cadence.
- Deployment, backups, retention, encryption, and account-deletion behavior.
- Target launch regions and applicable privacy or regulatory requirements.

## Decision record template

### D-NNN: Short decision title

- **Status:** Proposed, Accepted, Superseded, or Rejected
- **Context:** What prompted the decision?
- **Decision:** What direction was selected?
- **Consequences:** What trade-offs, constraints, or follow-up work result?

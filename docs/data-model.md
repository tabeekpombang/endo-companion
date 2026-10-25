# Data Model

## Status

This is a conceptual model for the MVP, not a finalized PostgreSQL schema.
It captures the records implied by product requirements while leaving
unresolved field formats, constraints, and retention behavior for later design.
All private health records must be associated with an owner and protected by
backend authorization.

## Candidate records

### User

Represents an account holder, if the chosen authentication approach requires a
user record.

| Field | Meaning |
|---|---|
| `id` | Stable internal identifier |
| `created_at` | Account creation time |

Only add profile details that a required feature needs.

### Symptom entry

A user's record of symptoms and impact for a date or period.

| Field | Meaning |
|---|---|
| `id` | Stable entry identifier |
| `user_id` | Owner reference |
| `recorded_at` | Date or time the entry describes |
| `pain_level` | User-reported pain value, using a scale to be decided |
| `daily_impact` | User-reported impact on daily activities |
| `notes` | Optional free-text note |
| `created_at` | When the entry was created |
| `updated_at` | When the entry was last changed |

An entry may have one or more symptom details:

| Field | Meaning |
|---|---|
| `id` | Stable symptom-detail identifier |
| `entry_id` | Parent entry |
| `name` | Symptom selected or entered by the user |
| `severity` | Optional user-reported severity |

The symptom list and severity scales need to be defined with the product and
validated for accessibility and clarity.

### Cycle information

Optional menstrual-cycle information associated with an entry or date range.
The exact fields and relationship to symptom entries remain open. Do not
require this information to use the tracker.

### Appointment preparation item

A user-authored question or concern for an upcoming medical appointment.

| Field | Meaning |
|---|---|
| `id` | Stable item identifier |
| `user_id` | Owner reference |
| `kind` | Question or concern |
| `text` | User-authored content |
| `created_at` | When the item was created |
| `completed_at` | Optional marker that the item was discussed |

### Educational resource

Content made available to users by the app.

| Field | Meaning |
|---|---|
| `id` | Stable resource identifier |
| `title` | Display title |
| `content` | Educational text or a reference to it |
| `source` | Attribution or source reference |
| `reviewed_at` | Date the content was last reviewed |

Content authorship, sourcing, and review workflow must be decided before
publishing resources.

## Derived information

Health-history views, dashboard activity, and appointment symptom summaries
should be derived from the user's entries and selected date range. Do not
persist an inferred diagnosis or a pattern as a medical conclusion.

## Relationships

- One user owns many symptom entries.
- One symptom entry may have many symptom details.
- Optional cycle information is associated with the user's chosen entry or
  date range; the exact relationship is undecided.
- One user owns many appointment preparation items.
- Educational resources are app content, not private user health records.

## Data rules

- A symptom entry is a user's observation, not a clinician-verified fact.
- All private records must be associated with an owner and checked against the
  authenticated user on the backend.
- Notes and symptom information are sensitive; do not include them in logs.
- Collect only data needed for MVP features; cycle information and notes stay
  optional.
- Define deletion behavior, retention, and backup handling before real user
  data is stored.
- Use fictional values in development and tests.

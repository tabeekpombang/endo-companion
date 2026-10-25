# Product Requirements

## Overview

Endo Companion is a mobile app for people with suspected or diagnosed
endometriosis. It helps users document symptoms, understand their health
history, prepare for medical appointments, and feel supported throughout their
journey.

The long-term vision is a companion for personal health tracking, appointment
preparation, educational resources, and eventually community support. This
document defines the initial MVP; future features are not included unless
explicitly approved.

## Problem

People may have difficulty keeping track of changing symptoms and explaining
their experiences during medical appointments. Endo Companion gives users a
welcoming place to record their own observations, review their history, prepare
questions, and find accessible, evidence-informed information.

The app supports users; it does not diagnose endometriosis, recommend
treatment, or replace professional medical care.

## Target users

- People diagnosed with endometriosis.
- People who suspect they may have endometriosis but have not received a
  diagnosis.
- People who want to document symptoms and communicate their experiences to
  healthcare professionals.

The experience should welcome users regardless of diagnosis status.

## MVP features

1. **Home dashboard:** Show a simple overview of recent symptoms and activity,
   with shortcuts to important features.
2. **Symptom tracker:** Record pain levels, symptoms, daily impact, notes, and
   optional menstrual-cycle information.
3. **Health history:** Review previous entries and identify patterns over
   time. Insights should describe recorded data, not make medical conclusions.
4. **Appointment preparation:** Organize questions and concerns, and review
   symptom summaries to prepare for appointments.
5. **Educational resources:** Present accessible, evidence-informed
   information about endometriosis.

## Future features (not MVP scope)

- Community support and discussion.
- User profiles and community moderation.
- Additional symptom-pattern insights.

Do not implement these without an explicit scope decision.

## Design direction

Figma designs are the visual reference. Reuse them where available and avoid
redesigning screens unnecessarily. The intended aesthetic is calming,
welcoming, and polished, with blush pink, warm ivory, muted mauve, and dark
plum; clean typography; rounded cards; intuitive navigation; and generous
spacing.

The app must remain accessible and easy to use on difficult pain days. The
actual Figma references still need to be made available to the implementation
workflow.

## Safety, privacy, and accessibility requirements

- Do not provide diagnosis, treatment recommendations, medical triage, an AI
  medical chatbot, or diagnostic predictions in the MVP.
- Make clear that information is educational and the app does not replace
  professional medical care.
- Collect only data needed for the app's features and use fictional data in
  development and testing.
- Enforce access to private health records on the backend, not only in the
  mobile interface.
- Avoid logging sensitive health information. Plan for secure authentication,
  account deletion, and appropriate data protection before storing real user
  data.
- Design core flows for accessibility and use that remains practical during
  pain or fatigue.
- Do not claim HIPAA compliance without a proper assessment.

## Success measures

Validate the MVP with intended users. Initial measures include whether users
can record and find symptom entries, prepare questions for an appointment, and
understand the limits of educational information and summaries. Numeric
targets have not yet been set.

## Out of scope

Unless explicitly approved, the MVP excludes community features, clinician
accounts, social sharing, third-party health integrations, and automated
medical advice or predictions.

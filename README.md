# endo-companion

## Mobile app

The initial React Native / Expo app shell includes Home, Track, History, and
Prepare tabs. Community is left out of the MVP navigation because it is a
future feature. Track and History use the first check-in API slice.

### Run locally

Install a current Node.js LTS release, then from the repository root run:

```sh
npm install
npm start
```

Use the Expo Go app to scan the development QR code, or press `i`/`a` in the
Expo terminal to launch an available iOS or Android simulator. Run
`npm run typecheck` to check the TypeScript source.

The app uses React Native's built-in components for the first tab shell, so it
does not add a separate navigation dependency yet. Tab selection is local
presentation state and is not persisted.

### Mobile source layout

- `App.tsx` observes Firebase auth state and selects the signed-in or signed-out
  app experience.
- `src/auth/` contains the sign-in/sign-up/reset-password UI and auth error
  messages.
- `src/navigation/` contains the tab shell and active-tab state.
- `src/screens/` contains one module per MVP tab.
- `src/components/` contains UI shared across screens.
- `src/theme/` contains shared design colors.
- `src/firebase.ts` initializes Firebase and persistent client auth.

## Firebase development setup

The Firebase client initialization is in `src/firebase.ts` and uses AsyncStorage
to persist authentication state on the device. Before importing that module
into the app, register a Web app in the Firebase project, then copy
`.env.example` to `.env` and fill in the Firebase Web app's `apiKey`, `authDomain`,
`projectId`, and `appId` values. Restart Expo after changing environment
variables.

These `EXPO_PUBLIC_` values are included in the mobile app bundle and are not
secrets. Never put Firebase service-account credentials in the app or `.env`.
The app provides email/password sign-up, sign-in, password reset, and sign-out
using Firebase Authentication. For now, the sign-in screen is shown each time
the app process launches, even when Firebase restores a previous session.
Face ID or other biometric unlock is not implemented.

## Backend API

The Spring Boot API is in `backend/`. It provides authenticated
`POST /api/v1/check-ins` and `GET /api/v1/check-ins` endpoints backed by
PostgreSQL. Every request must carry a Firebase ID token; the backend verifies
it and derives the record owner from the token's UID. The Track screen submits
check-ins and History loads the signed-in user's entries. Use fictional records
only during development.

### Run the backend locally

Requirements: Java 21 and a running local PostgreSQL server. Create the local
database once if you have not already:

```sh
createdb endocompanion_dev
```

In Firebase Console, create a service-account key for local development and
store the downloaded JSON outside this repository. Do not commit it, send it
to anyone, or put it in the mobile app. In the same Terminal session, set:

```sh
export FIREBASE_PROJECT_ID="your-firebase-project-id"
export GOOGLE_APPLICATION_CREDENTIALS="$HOME/.config/endo-companion/firebase-admin.json"
```

Change the credentials path to wherever you safely saved the JSON. Then start
the API from the repository root:

```sh
cd backend
./mvnw spring-boot:run
```

The first startup applies the versioned schema migration to
`endocompanion_dev`. The default database connection uses the current macOS
username and no password, matching a typical local Postgres.app setup. Set
`DATABASE_URL`, `DB_USERNAME`, or `DB_PASSWORD` if your local PostgreSQL setup
differs. Run backend tests with:

```sh
./mvnw test
```

Use fictional health data only while developing locally. Before storing real
health data, review the backend's authorization and data-protection behavior
and deploy it in an appropriately secured environment.

### Connect Expo Go to the local API

Set `EXPO_PUBLIC_API_BASE_URL` in the root `.env` to the Mac running Spring
Boot. For Expo Go on a physical phone, use the Mac's local network IP address
(on many Macs, `ipconfig getifaddr en0` shows it); for an iOS simulator,
`http://localhost:8080` usually works. Keep the phone and Mac on the same
network, then restart Expo after changing `.env`. Local HTTP is for fictional
development data only; do not send real health information over it.

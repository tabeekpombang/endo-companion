# endo-companion

## Mobile app

The initial React Native / Expo app shell includes Home, Track, History, and
Prepare tabs. Community is left out of the MVP navigation because it is a
future feature. The screens are currently presentational placeholders; no
backend or health-data storage is connected.

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
using Firebase Authentication. Use a test account only. Health records are not
stored, and no backend token verification or per-user data authorization has
been implemented. For now, the sign-in screen is shown each time the app
process launches, even when Firebase restores a previous session. Face ID or
other biometric unlock is not implemented.

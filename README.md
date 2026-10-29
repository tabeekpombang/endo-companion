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

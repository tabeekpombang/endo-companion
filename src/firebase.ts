import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getReactNativePersistence,
  initializeAuth,
} from "@firebase/auth";

const requiredConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

for (const [key, value] of Object.entries(requiredConfig)) {
  if (!value) {
    throw new Error(
      `Missing Firebase configuration: ${key}. ` +
        "Copy .env.example to .env and fill in the Firebase Web app values.",
    );
  }
}

const firebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(requiredConfig);

export const auth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(AsyncStorage),
});

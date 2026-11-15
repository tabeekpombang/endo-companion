export type AuthMode = "sign-in" | "sign-up" | "reset-password";

export function authErrorMessage(error: unknown, mode: AuthMode): string {
  const code =
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
      ? error.code
      : undefined;

  if (code === "auth/invalid-email") {
    return "Enter a valid email address.";
  }
  if (code === "auth/email-already-in-use") {
    return "This email may already have an account. Try signing in or resetting the password.";
  }
  if (code === "auth/operation-not-allowed") {
    return "Email/password sign-in is disabled in Firebase. Enable it under Authentication → Sign-in method.";
  }
  if (code === "auth/invalid-api-key" || code === "auth/app-not-authorized") {
    return "Firebase rejected this app configuration. Check the Firebase Web app values in your local .env file.";
  }
  if (code === "auth/too-many-requests") {
    return "Too many attempts. Please wait a moment and try again.";
  }
  if (code === "auth/network-request-failed") {
    return "Could not connect. Check your internet connection and try again.";
  }
  if (mode === "sign-up" && code === "auth/weak-password") {
    return "Choose a stronger password with at least 6 characters.";
  }
  if (mode === "reset-password") {
    return `We couldn't send a reset email. Check your address and Firebase setup, then try again.${code ? ` (code: ${code})` : ""}`;
  }
  if (mode === "sign-up") {
    return `We couldn't create your account. Check your Firebase setup and try again.${code ? ` (code: ${code})` : ""}`;
  }
  return `We couldn't sign you in. Check your email and password, then try again.${code ? ` (code: ${code})` : ""}`;
}

import { auth } from "../firebase";

export type DailyImpact = "NOT_AT_ALL" | "A_LITTLE" | "A_LOT";

export type Symptom =
  | "PELVIC_PAIN"
  | "BLOATING"
  | "FATIGUE"
  | "BACK_PAIN"
  | "NAUSEA";

export type CheckIn = {
  id: string;
  recordedDate: string;
  painLevel: number;
  dailyImpact: DailyImpact;
  symptoms: Symptom[];
  notes: string | null;
  createdAt: string;
};

export type CreateCheckIn = Omit<CheckIn, "id" | "createdAt">;

const endpoint = "/api/v1/check-ins";

function getApiBaseUrl() {
  const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    throw new Error(
      "The backend address is not configured. Add EXPO_PUBLIC_API_BASE_URL to .env and restart Expo.",
    );
  }
  return baseUrl.replace(/\/+$/, "");
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Your session has ended. Please sign in again.");
  }

  const token = await user.getIdToken();
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
    },
  });

  if (response.status === 401) {
    throw new Error("Your sign-in could not be verified. Please sign out and back in.");
  }
  if (!response.ok) {
    throw new Error(`The request could not be completed (HTTP ${response.status}).`);
  }
  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function createCheckIn(checkIn: CreateCheckIn) {
  return request<CheckIn>(endpoint, {
    method: "POST",
    body: JSON.stringify(checkIn),
  });
}

export function getCheckIns() {
  return request<CheckIn[]>(endpoint);
}

export function updateCheckIn(id: string, checkIn: CreateCheckIn) {
  return request<CheckIn>(`${endpoint}/${id}`, {
    method: "PUT",
    body: JSON.stringify(checkIn),
  });
}

export function deleteCheckIn(id: string) {
  return request<void>(`${endpoint}/${id}`, {
    method: "DELETE",
  });
}

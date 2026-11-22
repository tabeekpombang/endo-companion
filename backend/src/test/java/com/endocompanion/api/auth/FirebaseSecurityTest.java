package com.endocompanion.api.auth;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.endocompanion.api.checkin.CheckInController;
import com.endocompanion.api.checkin.CheckInResponse;
import com.endocompanion.api.checkin.CheckInService;
import com.endocompanion.api.checkin.DailyImpact;
import com.endocompanion.api.checkin.Symptom;
import com.google.firebase.ErrorCode;
import com.google.firebase.auth.AuthErrorCode;
import com.google.firebase.auth.FirebaseAuthException;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(CheckInController.class)
@Import(SecurityConfiguration.class)
class FirebaseSecurityTest {
    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private FirebaseTokenVerifier tokenVerifier;

    @MockitoBean
    private CheckInService checkInService;

    @Test
    void rejectsRequestsWithoutBearerToken() throws Exception {
        mockMvc.perform(get("/api/v1/check-ins"))
                .andExpect(status().isUnauthorized());

        verify(tokenVerifier, never()).verify(any());
        verify(checkInService, never()).list(any());
    }

    @Test
    void rejectsInvalidFirebaseToken() throws Exception {
        when(tokenVerifier.verify("invalid-token")).thenThrow(new FirebaseAuthException(
                ErrorCode.UNAUTHENTICATED,
                "Invalid token",
                null,
                null,
                AuthErrorCode.INVALID_ID_TOKEN));

        mockMvc.perform(get("/api/v1/check-ins")
                        .header("Authorization", "Bearer invalid-token"))
                .andExpect(status().isUnauthorized());

        verify(checkInService, never()).list(any());
    }

    @Test
    void scopesListRequestToVerifiedFirebaseUid() throws Exception {
        when(tokenVerifier.verify("valid-token")).thenReturn("verified-user");
        when(checkInService.list("verified-user")).thenReturn(List.of(response()));

        mockMvc.perform(get("/api/v1/check-ins")
                        .header("Authorization", "Bearer valid-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].painLevel").value(4));

        verify(checkInService).list("verified-user");
    }

    @Test
    void derivesCreateOwnerFromVerifiedTokenAndValidatesInput() throws Exception {
        when(tokenVerifier.verify("valid-token")).thenReturn("verified-user");
        when(checkInService.create(eq("verified-user"), any())).thenReturn(response());

        mockMvc.perform(post("/api/v1/check-ins")
                        .header("Authorization", "Bearer valid-token")
                        .contentType("application/json")
                        .content("""
                                {
                                  "recordedDate": "2026-11-15",
                                  "painLevel": 4,
                                  "dailyImpact": "A_LITTLE",
                                  "symptoms": ["PELVIC_PAIN"],
                                  "notes": null,
                                  "firebaseUid": "attacker-controlled-owner"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.painLevel").value(4));

        verify(checkInService).create(eq("verified-user"), any());
    }

    @Test
    void rejectsOutOfRangePainLevel() throws Exception {
        when(tokenVerifier.verify("valid-token")).thenReturn("verified-user");

        mockMvc.perform(post("/api/v1/check-ins")
                        .header("Authorization", "Bearer valid-token")
                        .contentType("application/json")
                        .content("""
                                {
                                  "recordedDate": "2026-11-15",
                                  "painLevel": 11,
                                  "dailyImpact": "A_LITTLE",
                                  "symptoms": []
                                }
                                """))
                .andExpect(status().isBadRequest());

        verify(checkInService, never()).create(any(), any());
    }

    @Test
    void ownerCanUpdateCheckIn() throws Exception {
        when(tokenVerifier.verify("valid-token")).thenReturn("verified-user");
        UUID id = UUID.fromString("65fa3103-01d0-4807-a7b1-b7d9d74192ae");
        when(checkInService.update(eq(id), eq("verified-user"), any())).thenReturn(response());

        mockMvc.perform(put("/api/v1/check-ins/{id}", id)
                        .header("Authorization", "Bearer valid-token")
                        .contentType("application/json")
                        .content("""
                                {
                                  "recordedDate": "2026-11-15",
                                  "painLevel": 4,
                                  "dailyImpact": "A_LITTLE",
                                  "symptoms": ["PELVIC_PAIN"],
                                  "notes": "Updated"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.painLevel").value(4));

        verify(checkInService).update(eq(id), eq("verified-user"), any());
    }

    @Test
    void ownerCanDeleteCheckIn() throws Exception {
        when(tokenVerifier.verify("valid-token")).thenReturn("verified-user");
        UUID id = UUID.fromString("65fa3103-01d0-4807-a7b1-b7d9d74192ae");

        mockMvc.perform(delete("/api/v1/check-ins/{id}", id)
                        .header("Authorization", "Bearer valid-token"))
                .andExpect(status().isNoContent());

        verify(checkInService).delete(id, "verified-user");
    }

    private CheckInResponse response() {
        return new CheckInResponse(
                UUID.fromString("65fa3103-01d0-4807-a7b1-b7d9d74192ae"),
                LocalDate.parse("2026-11-15"),
                4,
                DailyImpact.A_LITTLE,
                List.of(Symptom.PELVIC_PAIN),
                null,
                Instant.parse("2026-11-15T12:00:00Z"));
    }
}

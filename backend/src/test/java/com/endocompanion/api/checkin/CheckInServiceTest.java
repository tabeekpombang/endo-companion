package com.endocompanion.api.checkin;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

class CheckInServiceTest {
    private final CheckInRepository repository = mock(CheckInRepository.class);
    private final CheckInService service = new CheckInService(repository);

    @Test
    void anotherUserCannotUpdateOrDeleteOwnedCheckIn() {
        UUID id = UUID.randomUUID();
        CheckIn ownedByOtherUser = new CheckIn(
                "other-user",
                LocalDate.parse("2026-11-15"),
                4,
                DailyImpact.A_LITTLE,
                Set.of(Symptom.PELVIC_PAIN),
                null);
        when(repository.findById(id)).thenReturn(Optional.of(ownedByOtherUser));

        CreateCheckInRequest request = new CreateCheckInRequest(
                LocalDate.parse("2026-11-16"),
                6,
                DailyImpact.A_LOT,
                Set.of(Symptom.FATIGUE),
                null);

        assertThatThrownBy(() -> service.update(id, "current-user", request))
                .isInstanceOf(ResponseStatusException.class);
        assertThatThrownBy(() -> service.delete(id, "current-user"))
                .isInstanceOf(ResponseStatusException.class);

        verify(repository, never()).saveAndFlush(org.mockito.ArgumentMatchers.any());
        verify(repository, never()).delete(org.mockito.ArgumentMatchers.any(CheckIn.class));
    }
}

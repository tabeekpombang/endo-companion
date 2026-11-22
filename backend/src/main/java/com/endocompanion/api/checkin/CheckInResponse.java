package com.endocompanion.api.checkin;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record CheckInResponse(
        UUID id,
        LocalDate recordedDate,
        int painLevel,
        DailyImpact dailyImpact,
        List<Symptom> symptoms,
        String notes,
        Instant createdAt) {
    static CheckInResponse from(CheckIn checkIn) {
        List<Symptom> symptoms = checkIn.getSymptoms().stream()
                .sorted()
                .toList();
        return new CheckInResponse(
                checkIn.getId(),
                checkIn.getRecordedDate(),
                checkIn.getPainLevel(),
                checkIn.getDailyImpact(),
                symptoms,
                checkIn.getNotes(),
                checkIn.getCreatedAt());
    }
}

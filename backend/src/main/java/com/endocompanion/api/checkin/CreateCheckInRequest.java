package com.endocompanion.api.checkin;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.Set;

public record CreateCheckInRequest(
        @NotNull LocalDate recordedDate,
        @NotNull @Min(0) @Max(10) Integer painLevel,
        @NotNull DailyImpact dailyImpact,
        @NotNull Set<@NotNull Symptom> symptoms,
        @Size(max = 2000) String notes) {}

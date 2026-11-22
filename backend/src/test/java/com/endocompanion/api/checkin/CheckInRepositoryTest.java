package com.endocompanion.api.checkin;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;
import java.util.Set;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

@DataJpaTest(properties = {
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.flyway.enabled=false"
})
class CheckInRepositoryTest {
    @Autowired
    private CheckInRepository checkInRepository;

    @Test
    void listsOnlyRecordsOwnedByRequestedFirebaseUid() {
        checkInRepository.saveAndFlush(checkIn("user-one", 3));
        checkInRepository.saveAndFlush(checkIn("user-two", 8));

        assertThat(checkInRepository.findAllByFirebaseUidOrderByRecordedDateDescCreatedAtDesc("user-one"))
                .extracting(CheckIn::getFirebaseUid, CheckIn::getPainLevel)
                .containsExactly(org.assertj.core.groups.Tuple.tuple("user-one", 3));
    }

    @Test
    void deletedOwnerRecordIsAbsent() {
        CheckIn checkIn = checkInRepository.saveAndFlush(checkIn("user-one", 3));

        checkInRepository.delete(checkIn);
        checkInRepository.flush();

        assertThat(checkInRepository.findById(checkIn.getId())).isEmpty();
    }

    private CheckIn checkIn(String firebaseUid, int painLevel) {
        return new CheckIn(
                firebaseUid,
                LocalDate.parse("2026-11-15"),
                painLevel,
                DailyImpact.NOT_AT_ALL,
                Set.of(Symptom.FATIGUE),
                null);
    }
}

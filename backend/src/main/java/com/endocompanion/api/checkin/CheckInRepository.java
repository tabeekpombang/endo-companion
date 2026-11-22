package com.endocompanion.api.checkin;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CheckInRepository extends JpaRepository<CheckIn, UUID> {
    List<CheckIn> findAllByFirebaseUidOrderByRecordedDateDescCreatedAtDesc(String firebaseUid);
}

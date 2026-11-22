package com.endocompanion.api.checkin;

import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CheckInService {
    private final CheckInRepository checkInRepository;

    public CheckInService(CheckInRepository checkInRepository) {
        this.checkInRepository = checkInRepository;
    }

    @Transactional
    public CheckInResponse create(String firebaseUid, CreateCheckInRequest request) {
        CheckIn checkIn = new CheckIn(
                firebaseUid,
                request.recordedDate(),
                request.painLevel(),
                request.dailyImpact(),
                request.symptoms(),
                request.notes());
        return CheckInResponse.from(checkInRepository.saveAndFlush(checkIn));
    }

    @Transactional(readOnly = true)
    public List<CheckInResponse> list(String firebaseUid) {
        return checkInRepository.findAllByFirebaseUidOrderByRecordedDateDescCreatedAtDesc(firebaseUid)
                .stream()
                .map(CheckInResponse::from)
                .toList();
    }

    @Transactional
    public CheckInResponse update(
            UUID id,
            String firebaseUid,
            CreateCheckInRequest request) {
        CheckIn checkIn = ownedCheckIn(id, firebaseUid);
        checkIn.update(
                request.recordedDate(),
                request.painLevel(),
                request.dailyImpact(),
                request.symptoms(),
                request.notes());
        return CheckInResponse.from(checkInRepository.saveAndFlush(checkIn));
    }

    @Transactional
    public void delete(UUID id, String firebaseUid) {
        CheckIn checkIn = ownedCheckIn(id, firebaseUid);
        checkInRepository.delete(checkIn);
    }

    private CheckIn ownedCheckIn(UUID id, String firebaseUid) {
        return checkInRepository.findById(id)
                .filter(checkIn -> checkIn.getFirebaseUid().equals(firebaseUid))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Check-in not found"));
    }
}

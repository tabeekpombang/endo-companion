package com.endocompanion.api.checkin;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import java.time.Instant;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "check_ins")
public class CheckIn {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "firebase_uid", nullable = false, length = 128)
    private String firebaseUid;

    @Column(name = "recorded_date", nullable = false)
    private LocalDate recordedDate;

    @Column(name = "pain_level", nullable = false)
    private int painLevel;

    @Enumerated(EnumType.STRING)
    @Column(name = "daily_impact", nullable = false, length = 20)
    private DailyImpact dailyImpact;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "check_in_symptoms", joinColumns = @JoinColumn(name = "check_in_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "symptom_code", nullable = false, length = 40)
    private Set<Symptom> symptoms = new HashSet<>();

    @Column(name = "notes", length = 2000)
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected CheckIn() {}

    public CheckIn(
            String firebaseUid,
            LocalDate recordedDate,
            int painLevel,
            DailyImpact dailyImpact,
            Set<Symptom> symptoms,
            String notes) {
        this.firebaseUid = firebaseUid;
        this.recordedDate = recordedDate;
        this.painLevel = painLevel;
        this.dailyImpact = dailyImpact;
        this.symptoms = new HashSet<>(symptoms);
        this.notes = notes;
    }

    public UUID getId() {
        return id;
    }

    public String getFirebaseUid() {
        return firebaseUid;
    }

    public LocalDate getRecordedDate() {
        return recordedDate;
    }

    public int getPainLevel() {
        return painLevel;
    }

    public DailyImpact getDailyImpact() {
        return dailyImpact;
    }

    public Set<Symptom> getSymptoms() {
        return Set.copyOf(symptoms);
    }

    public String getNotes() {
        return notes;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void update(
            LocalDate recordedDate,
            int painLevel,
            DailyImpact dailyImpact,
            Set<Symptom> symptoms,
            String notes) {
        this.recordedDate = recordedDate;
        this.painLevel = painLevel;
        this.dailyImpact = dailyImpact;
        this.symptoms.clear();
        this.symptoms.addAll(symptoms);
        this.notes = notes;
    }
}

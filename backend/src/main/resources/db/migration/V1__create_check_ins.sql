CREATE TABLE check_ins (
    id UUID PRIMARY KEY,
    firebase_uid VARCHAR(128) NOT NULL,
    recorded_date DATE NOT NULL,
    pain_level INTEGER NOT NULL CHECK (pain_level BETWEEN 0 AND 10),
    daily_impact VARCHAR(20) NOT NULL CHECK (daily_impact IN ('NOT_AT_ALL', 'A_LITTLE', 'A_LOT')),
    notes VARCHAR(2000),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX check_ins_owner_date_idx
    ON check_ins (firebase_uid, recorded_date DESC, created_at DESC);

CREATE TABLE check_in_symptoms (
    check_in_id UUID NOT NULL REFERENCES check_ins (id) ON DELETE CASCADE,
    symptom_code VARCHAR(40) NOT NULL CHECK (
        symptom_code IN ('PELVIC_PAIN', 'BLOATING', 'FATIGUE', 'BACK_PAIN', 'NAUSEA')
    ),
    PRIMARY KEY (check_in_id, symptom_code)
);

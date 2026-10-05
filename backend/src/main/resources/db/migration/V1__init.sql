CREATE TABLE communications (
    id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    text         TEXT         NOT NULL,
    source       VARCHAR(30)  NOT NULL,
    created_at   TIMESTAMP    NOT NULL DEFAULT NOW(),
    analyzed_at  TIMESTAMP
);

CREATE TABLE emotion_analyses (
    id                  UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    communication_id    UUID         NOT NULL REFERENCES communications(id) ON DELETE CASCADE,
    primary_emotion     VARCHAR(20)  NOT NULL,
    sentiment_score     FLOAT        NOT NULL,
    emotion_scores_json TEXT,
    topics_json         TEXT,
    summary             TEXT
);

CREATE INDEX idx_communications_source     ON communications(source);
CREATE INDEX idx_communications_created_at ON communications(created_at);
CREATE INDEX idx_analyses_primary_emotion  ON emotion_analyses(primary_emotion);
CREATE INDEX idx_analyses_communication_id ON emotion_analyses(communication_id);

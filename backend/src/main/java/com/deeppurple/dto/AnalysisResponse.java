package com.deeppurple.dto;

import com.deeppurple.model.Emotion;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Data
public class AnalysisResponse {
    private UUID id;
    private String text;
    private String source;
    private LocalDateTime createdAt;
    private LocalDateTime analyzedAt;
    private Emotion primaryEmotion;
    private Float sentimentScore;
    private Map<String, Float> emotionScores;
    private List<String> topics;
    private String summary;
}

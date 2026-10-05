package com.deeppurple.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "emotion_analyses")
@Getter
@Setter
@NoArgsConstructor
public class EmotionAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "communication_id", nullable = false)
    private Communication communication;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Emotion primaryEmotion;

    @Column(nullable = false)
    private Float sentimentScore;

    @Column(columnDefinition = "TEXT")
    private String emotionScoresJson;

    @Column(columnDefinition = "TEXT")
    private String topicsJson;

    @Column(columnDefinition = "TEXT")
    private String summary;
}

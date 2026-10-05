package com.deeppurple.repository;

import com.deeppurple.model.EmotionAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface EmotionAnalysisRepository extends JpaRepository<EmotionAnalysis, UUID> {

    @Query(value = """
            SELECT a.primary_emotion, CAST(DATE(c.created_at) AS VARCHAR), COUNT(*)
            FROM emotion_analyses a
            JOIN communications c ON c.id = a.communication_id
            WHERE c.created_at >= :from AND c.created_at <= :to
            GROUP BY a.primary_emotion, DATE(c.created_at)
            ORDER BY DATE(c.created_at)
            """, nativeQuery = true)
    List<Object[]> countByEmotionAndDate(
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to
    );

    @Query("SELECT a.primaryEmotion, COUNT(a) FROM EmotionAnalysis a GROUP BY a.primaryEmotion")
    List<Object[]> countByEmotion();
}

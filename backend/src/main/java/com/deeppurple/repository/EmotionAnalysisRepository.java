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
            WHERE c.user_id = :userId
              AND c.created_at >= :from AND c.created_at <= :to
            GROUP BY a.primary_emotion, DATE(c.created_at)
            ORDER BY DATE(c.created_at)
            """, nativeQuery = true)
    List<Object[]> countByEmotionAndDate(
            @Param("userId") UUID userId,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to
    );

    @Query(value = """
            SELECT a.primary_emotion, COUNT(*)
            FROM emotion_analyses a
            JOIN communications c ON c.id = a.communication_id
            WHERE c.user_id = :userId
            GROUP BY a.primary_emotion
            """, nativeQuery = true)
    List<Object[]> countByEmotion(@Param("userId") UUID userId);
}

package com.deeppurple.repository;

import com.deeppurple.model.Communication;
import com.deeppurple.model.CommunicationSource;
import com.deeppurple.model.Emotion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.UUID;

public interface CommunicationRepository extends JpaRepository<Communication, UUID> {

    @Query("""
            SELECT c FROM Communication c
            LEFT JOIN c.analysis a
            WHERE (:source IS NULL OR c.source = :source)
              AND (:emotion IS NULL OR a.primaryEmotion = :emotion)
              AND (:from IS NULL OR c.createdAt >= :from)
              AND (:to IS NULL OR c.createdAt <= :to)
            ORDER BY c.createdAt DESC
            """)
    Page<Communication> findWithFilters(
            @Param("source") CommunicationSource source,
            @Param("emotion") Emotion emotion,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to,
            Pageable pageable
    );
}

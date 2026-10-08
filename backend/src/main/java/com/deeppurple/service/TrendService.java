package com.deeppurple.service;

import com.deeppurple.dto.TrendDTO;
import com.deeppurple.repository.EmotionAnalysisRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class TrendService {

    private final EmotionAnalysisRepository emotionAnalysisRepository;

    @Transactional(readOnly = true)
    public List<TrendDTO> getTrends(UUID userId, LocalDateTime from, LocalDateTime to) {
        List<Object[]> rows = emotionAnalysisRepository.countByEmotionAndDate(userId, from, to);
        Map<String, Map<String, Long>> byDate = new TreeMap<>();
        for (Object[] row : rows) {
            String emotion = row[0].toString();
            String date = row[1].toString();
            long count = ((Number) row[2]).longValue();
            byDate.computeIfAbsent(date, k -> new LinkedHashMap<>()).put(emotion, count);
        }
        List<TrendDTO> trends = new ArrayList<>();
        byDate.forEach((date, counts) -> trends.add(new TrendDTO(date, counts)));
        return trends;
    }

    @Transactional(readOnly = true)
    public Map<String, Long> getSummary(UUID userId) {
        Map<String, Long> summary = new LinkedHashMap<>();
        emotionAnalysisRepository.countByEmotion(userId)
                .forEach(row -> summary.put(row[0].toString(), ((Number) row[1]).longValue()));
        return summary;
    }

    @Transactional(readOnly = true)
    public double getAvgSentiment(UUID userId) {
        Double avg = emotionAnalysisRepository.avgSentimentScore(userId);
        return avg != null ? avg : 0.0;
    }

    @Transactional(readOnly = true)
    public Map<String, Map<String, Long>> getTopicEmotions(UUID userId) {
        List<Object[]> rows = emotionAnalysisRepository.countByTopicAndEmotion(userId);
        Map<String, Map<String, Long>> result = new LinkedHashMap<>();
        for (Object[] row : rows) {
            String topic = row[0].toString();
            String emotion = row[1].toString();
            long count = ((Number) row[2]).longValue();
            result.computeIfAbsent(topic, k -> new LinkedHashMap<>()).put(emotion, count);
        }
        return result;
    }
}

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
    public List<TrendDTO> getTrends(LocalDateTime from, LocalDateTime to) {
        List<Object[]> rows = emotionAnalysisRepository.countByEmotionAndDate(from, to);
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
    public Map<String, Long> getSummary() {
        Map<String, Long> summary = new LinkedHashMap<>();
        emotionAnalysisRepository.countByEmotion()
                .forEach(row -> summary.put(row[0].toString(), ((Number) row[1]).longValue()));
        return summary;
    }
}

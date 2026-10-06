package com.deeppurple.service;

import com.deeppurple.dto.AnalysisResponse;
import com.deeppurple.dto.CommunicationRequest;
import com.deeppurple.model.Communication;
import com.deeppurple.model.CommunicationSource;
import com.deeppurple.model.Emotion;
import com.deeppurple.model.EmotionAnalysis;
import com.deeppurple.repository.CommunicationRepository;
import com.deeppurple.repository.EmotionAnalysisRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CommunicationService {

    private final CommunicationRepository communicationRepository;
    private final EmotionAnalysisRepository emotionAnalysisRepository;
    private final GeminiService geminiService;
    private final ObjectMapper objectMapper;

    @Transactional
    public AnalysisResponse submit(CommunicationRequest request, String userId) {
        Map<String, Object> result = geminiService.analyzeText(request.getText(), request.getSource().name());

        // Guest users: return analysis without persisting
        if (userId == null) {
            return toGuestResponse(result, request.getSource().name());
        }

        Communication comm = new Communication();
        comm.setText(request.getText());
        comm.setSource(request.getSource());
        comm.setUserId(UUID.fromString(userId));
        comm = communicationRepository.save(comm);

        EmotionAnalysis analysis = new EmotionAnalysis();
        analysis.setCommunication(comm);
        analysis.setPrimaryEmotion(Emotion.valueOf((String) result.get("primaryEmotion")));
        analysis.setSentimentScore(((Number) result.get("sentimentScore")).floatValue());
        analysis.setSummary((String) result.get("summary"));

        try {
            analysis.setEmotionScoresJson(objectMapper.writeValueAsString(result.get("emotionScores")));
            analysis.setTopicsJson(objectMapper.writeValueAsString(result.get("topics")));
        } catch (Exception e) {
            throw new RuntimeException("Failed to serialise analysis scores", e);
        }

        emotionAnalysisRepository.save(analysis);

        comm.setAnalyzedAt(LocalDateTime.now());
        communicationRepository.save(comm);

        return toResponse(comm, analysis);
    }

    @Transactional(readOnly = true)
    public Page<AnalysisResponse> list(
            String userId,
            CommunicationSource source, Emotion emotion,
            LocalDateTime from, LocalDateTime to,
            Pageable pageable) {
        return communicationRepository
                .findByUserIdWithFilters(UUID.fromString(userId), source, emotion, from, to, pageable)
                .map(c -> toResponse(c, c.getAnalysis()));
    }

    @Transactional(readOnly = true)
    public AnalysisResponse getById(UUID id, String userId) {
        Communication comm = communicationRepository
                .findByIdAndUserId(id, UUID.fromString(userId))
                .orElseThrow(() -> new RuntimeException("Communication not found: " + id));
        return toResponse(comm, comm.getAnalysis());
    }

    private AnalysisResponse toGuestResponse(Map<String, Object> result, String source) {
        AnalysisResponse r = new AnalysisResponse();
        r.setSource(source);
        r.setPrimaryEmotion(Emotion.valueOf((String) result.get("primaryEmotion")));
        r.setSentimentScore(((Number) result.get("sentimentScore")).floatValue());
        r.setSummary((String) result.get("summary"));
        try {
            r.setEmotionScores(objectMapper.convertValue(result.get("emotionScores"), new TypeReference<>() {}));
            r.setTopics(objectMapper.convertValue(result.get("topics"), new TypeReference<>() {}));
        } catch (Exception ignored) {}
        return r;
    }

    private AnalysisResponse toResponse(Communication comm, EmotionAnalysis analysis) {
        AnalysisResponse r = new AnalysisResponse();
        r.setId(comm.getId());
        r.setText(comm.getText());
        r.setSource(comm.getSource().name());
        r.setCreatedAt(comm.getCreatedAt());
        r.setAnalyzedAt(comm.getAnalyzedAt());

        if (analysis != null) {
            r.setPrimaryEmotion(analysis.getPrimaryEmotion());
            r.setSentimentScore(analysis.getSentimentScore());
            r.setSummary(analysis.getSummary());
            try {
                r.setEmotionScores(objectMapper.readValue(
                        analysis.getEmotionScoresJson(), new TypeReference<>() {}));
                r.setTopics(objectMapper.readValue(
                        analysis.getTopicsJson(), new TypeReference<>() {}));
            } catch (Exception ignored) {}
        }
        return r;
    }
}

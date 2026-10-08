package com.deeppurple.service;

import com.deeppurple.dto.AnalysisResponse;
import com.deeppurple.dto.CommunicationRequest;
import com.deeppurple.model.Communication;
import com.deeppurple.model.CommunicationSource;
import com.deeppurple.model.Emotion;
import com.deeppurple.model.EmotionAnalysis;
import com.deeppurple.model.Priority;
import com.deeppurple.repository.CommunicationRepository;
import com.deeppurple.repository.EmotionAnalysisRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.data.domain.PageRequest;
import java.time.LocalDateTime;
import java.util.ArrayList;
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
    public List<AnalysisResponse> getAlerts(String userId) {
        return communicationRepository
                .findAlerts(UUID.fromString(userId), -0.35f, PageRequest.of(0, 20))
                .stream()
                .map(c -> toResponse(c, c.getAnalysis()))
                .toList();
    }

    public List<AnalysisResponse> submitBulk(List<CommunicationRequest> requests, String userId) {
        if (requests.size() > 100) {
            throw new IllegalArgumentException("Maximum 100 items per bulk request");
        }
        List<AnalysisResponse> results = new ArrayList<>();
        for (CommunicationRequest req : requests) {
            try {
                results.add(submit(req, userId));
            } catch (Exception ignored) {
                // skip failed items — caller sees fewer results than sent
            }
        }
        return results;
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
        float sentiment = ((Number) result.get("sentimentScore")).floatValue();
        r.setSentimentScore(sentiment);
        r.setSummary((String) result.get("summary"));
        try {
            Map<String, Float> scores = objectMapper.convertValue(result.get("emotionScores"), new TypeReference<>() {});
            r.setEmotionScores(scores);
            r.setTopics(objectMapper.convertValue(result.get("topics"), new TypeReference<>() {}));
            r.setPriority(computePriority(sentiment, scores));
            r.setAlert(sentiment < -0.35f);
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
                Map<String, Float> scores = objectMapper.readValue(
                        analysis.getEmotionScoresJson(), new TypeReference<>() {});
                r.setEmotionScores(scores);
                r.setTopics(objectMapper.readValue(analysis.getTopicsJson(), new TypeReference<>() {}));
                r.setPriority(computePriority(analysis.getSentimentScore(), scores));
                r.setAlert(analysis.getSentimentScore() < -0.35f);
            } catch (Exception ignored) {}
        }
        return r;
    }

    private Priority computePriority(float sentimentScore, Map<String, Float> scores) {
        float anger = scores.getOrDefault("anger", 0f);
        float fear = scores.getOrDefault("fear", 0f);
        float disgust = scores.getOrDefault("disgust", 0f);
        float maxNeg = Math.max(anger, Math.max(fear, disgust));
        if (maxNeg > 0.8f || sentimentScore < -0.7f) return Priority.CRITICAL;
        if (maxNeg > 0.6f || sentimentScore < -0.4f) return Priority.HIGH;
        if (maxNeg > 0.4f || sentimentScore < -0.2f) return Priority.MEDIUM;
        return Priority.LOW;
    }
}

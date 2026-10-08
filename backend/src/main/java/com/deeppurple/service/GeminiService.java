package com.deeppurple.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class GeminiService {

    private final ObjectMapper objectMapper;

    @Value("${gemini.api-key}")
    private String apiKey;

    @Value("${gemini.model:gemini-2.0-flash}")
    private String model;

    private static final String GEMINI_BASE =
            "https://generativelanguage.googleapis.com/v1beta/models/";

    @SuppressWarnings("unchecked")
    public Map<String, Object> analyzeText(String text, String source) {
        String sourceLabel = source.toLowerCase().replace("_", " ");
        String prompt =
                "Analyze the following " + sourceLabel + " text for emotions and sentiment.\n" +
                "Return ONLY a JSON object with these exact fields:\n" +
                "- primaryEmotion: one of JOY, ANGER, FEAR, SADNESS, SURPRISE, DISGUST, TRUST\n" +
                "- sentimentScore: float from -1.0 (very negative) to 1.0 (very positive)\n" +
                "- emotionScores: object with keys joy, anger, fear, sadness, surprise, disgust, trust " +
                "where each value is a float 0-1 and all values sum to 1.0\n" +
                "- topics: array of up to 5 short topic strings relevant to the text\n" +
                "- summary: one sentence summarizing the emotional content\n\n" +
                "Text:\n" + text;

        Map<String, Object> body = Map.of(
                "contents", List.of(Map.of(
                        "parts", List.of(Map.of("text", prompt))
                )),
                "generationConfig", Map.of(
                        "responseMimeType", "application/json",
                        "temperature", 0.2
                )
        );

        String url = GEMINI_BASE + model + ":generateContent?key=" + apiKey;
        int maxAttempts = 5;
        for (int attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                RestClient client = RestClient.create();
                String response = client.post()
                        .uri(url)
                        .header("Content-Type", "application/json")
                        .body(objectMapper.writeValueAsString(body))
                        .retrieve()
                        .body(String.class);

                Map<String, Object> parsed = objectMapper.readValue(response, Map.class);
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) parsed.get("candidates");
                Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                String json = (String) parts.get(0).get("text");
                return objectMapper.readValue(json, Map.class);
            } catch (RestClientResponseException e) {
                boolean isRetryable = e.getStatusCode().value() == 503 || e.getStatusCode().value() == 429;
                log.error("Gemini HTTP {} for model={} attempt={}: {}", e.getStatusCode(), model, attempt, e.getResponseBodyAsString());
                if (!isRetryable || attempt == maxAttempts) {
                    throw new RuntimeException("Gemini API error: " + e.getStatusCode(), e);
                }
                long backoffMs = 5000L * (1L << (attempt - 1)); // 5s, 10s, 20s, 40s
                log.warn("Gemini 503/429 attempt={}, retrying in {}ms", attempt, backoffMs);
                try { Thread.sleep(backoffMs); } catch (InterruptedException ie) { Thread.currentThread().interrupt(); }
            } catch (Exception e) {
                log.error("Gemini analysis failed for model={} source={} attempt={}", model, source, attempt, e);
                if (attempt == maxAttempts) throw new RuntimeException("Emotion analysis failed", e);
                try { Thread.sleep(5000L); } catch (InterruptedException ie) { Thread.currentThread().interrupt(); }
            }
        }
        throw new RuntimeException("Gemini analysis failed after " + maxAttempts + " attempts");
    }
}

package com.deeppurple.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class GeminiService {

    private final ObjectMapper objectMapper;

    @Value("${gemini.api-key}")
    private String apiKey;

    private static final String GEMINI_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent";

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

        try {
            RestClient client = RestClient.create();
            String response = client.post()
                    .uri(GEMINI_URL + "?key=" + apiKey)
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
        } catch (Exception e) {
            log.error("Gemini analysis failed for source={}", source, e);
            throw new RuntimeException("Emotion analysis failed", e);
        }
    }
}

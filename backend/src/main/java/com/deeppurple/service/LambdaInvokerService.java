package com.deeppurple.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.SdkBytes;
import software.amazon.awssdk.services.lambda.LambdaClient;
import software.amazon.awssdk.services.lambda.model.InvokeRequest;
import software.amazon.awssdk.services.lambda.model.InvokeResponse;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class LambdaInvokerService {

    private final LambdaClient lambdaClient;
    private final ObjectMapper objectMapper;

    @Value("${aws.lambda.function-arn}")
    private String functionArn;

    @SuppressWarnings("unchecked")
    public Map<String, Object> analyzeText(String text, String source) {
        try {
            String payload = objectMapper.writeValueAsString(Map.of("text", text, "source", source));
            InvokeRequest request = InvokeRequest.builder()
                    .functionName(functionArn)
                    .payload(SdkBytes.fromUtf8String(payload))
                    .build();
            InvokeResponse response = lambdaClient.invoke(request);
            return objectMapper.readValue(response.payload().asUtf8String(), Map.class);
        } catch (Exception e) {
            log.error("Lambda invocation failed for source={}", source, e);
            throw new RuntimeException("Emotion analysis failed", e);
        }
    }
}

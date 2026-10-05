package com.deeppurple.service;

import com.deeppurple.dto.AnalysisResponse;
import com.deeppurple.dto.CommunicationRequest;
import com.deeppurple.model.Communication;
import com.deeppurple.model.CommunicationSource;
import com.deeppurple.model.Emotion;
import com.deeppurple.model.EmotionAnalysis;
import com.deeppurple.repository.CommunicationRepository;
import com.deeppurple.repository.EmotionAnalysisRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CommunicationServiceTest {

    @Mock
    private CommunicationRepository communicationRepository;

    @Mock
    private EmotionAnalysisRepository emotionAnalysisRepository;

    @Mock
    private LambdaInvokerService lambdaInvokerService;

    @Spy
    private ObjectMapper objectMapper = new ObjectMapper();

    @InjectMocks
    private CommunicationService communicationService;

    @BeforeEach
    void setUp() {
        when(communicationRepository.save(any(Communication.class)))
                .thenAnswer(inv -> inv.getArgument(0));
        when(emotionAnalysisRepository.save(any(EmotionAnalysis.class)))
                .thenAnswer(inv -> inv.getArgument(0));
    }

    @Test
    void submit_invokesLambdaAndReturnsAnalysis() {
        when(lambdaInvokerService.analyzeText(any(), any())).thenReturn(Map.of(
                "primaryEmotion", "ANGER",
                "sentimentScore", -0.72,
                "emotionScores", Map.of("joy", 0.05, "anger", 0.72, "fear", 0.08,
                        "sadness", 0.05, "surprise", 0.04, "disgust", 0.04, "trust", 0.02),
                "topics", List.of("billing", "refund"),
                "summary", "Customer is angry about a billing issue."
        ));

        CommunicationRequest request = new CommunicationRequest();
        request.setText("I am furious about my bill, this is completely unacceptable!");
        request.setSource(CommunicationSource.SUPPORT_TICKET);

        AnalysisResponse response = communicationService.submit(request);

        assertThat(response.getPrimaryEmotion()).isEqualTo(Emotion.ANGER);
        assertThat(response.getSentimentScore()).isEqualTo(-0.72f);
        assertThat(response.getTopics()).contains("billing");
        verify(lambdaInvokerService).analyzeText(request.getText(), "SUPPORT_TICKET");
        verify(communicationRepository, times(2)).save(any());
    }
}

package com.deeppurple.controller;

import com.deeppurple.dto.AnalysisResponse;
import com.deeppurple.dto.CommunicationRequest;
import com.deeppurple.model.CommunicationSource;
import com.deeppurple.model.Emotion;
import com.deeppurple.service.CommunicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/communications")
@RequiredArgsConstructor
@CrossOrigin(origins = "${app.cors.allowed-origins:*}")
public class CommunicationController {

    private final CommunicationService communicationService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AnalysisResponse submit(
            @Valid @RequestBody CommunicationRequest request,
            @AuthenticationPrincipal String userId) {
        return communicationService.submit(request, userId);
    }

    @GetMapping
    public Page<AnalysisResponse> list(
            @AuthenticationPrincipal String userId,
            @RequestParam(required = false) CommunicationSource source,
            @RequestParam(required = false) Emotion emotion,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return communicationService.list(
                userId, source, emotion, from, to,
                PageRequest.of(page, size, Sort.by("createdAt").descending()));
    }

    @GetMapping("/{id}")
    public AnalysisResponse getById(
            @PathVariable UUID id,
            @AuthenticationPrincipal String userId) {
        return communicationService.getById(id, userId);
    }
}

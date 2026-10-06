package com.deeppurple.controller;

import com.deeppurple.dto.TrendDTO;
import com.deeppurple.service.TrendService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@CrossOrigin(origins = "${app.cors.allowed-origins:*}")
public class AnalyticsController {

    private final TrendService trendService;

    @GetMapping("/trends")
    public List<TrendDTO> trends(
            @AuthenticationPrincipal String userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to) {
        LocalDateTime start = from != null ? from : LocalDateTime.now().minusDays(30);
        LocalDateTime end = to != null ? to : LocalDateTime.now();
        return trendService.getTrends(UUID.fromString(userId), start, end);
    }

    @GetMapping("/summary")
    public Map<String, Long> summary(@AuthenticationPrincipal String userId) {
        return trendService.getSummary(UUID.fromString(userId));
    }
}

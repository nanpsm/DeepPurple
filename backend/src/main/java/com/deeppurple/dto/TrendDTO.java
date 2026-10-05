package com.deeppurple.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Map;

@Data
@AllArgsConstructor
public class TrendDTO {
    private String date;
    private Map<String, Long> emotionCounts;
}

package com.deeppurple.dto;

import com.deeppurple.model.CommunicationSource;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CommunicationRequest {

    @NotBlank
    @Size(min = 10, max = 10000, message = "Text must be between 10 and 10,000 characters")
    private String text;

    @NotNull(message = "Source is required")
    private CommunicationSource source;
}

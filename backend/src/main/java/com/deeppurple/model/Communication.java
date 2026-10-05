package com.deeppurple.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "communications")
@Getter
@Setter
@NoArgsConstructor
public class Communication {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String text;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CommunicationSource source;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime analyzedAt;

    @OneToOne(mappedBy = "communication", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private EmotionAnalysis analysis;
}

package com.spa.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "system_logs")
@Data
public class SystemLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String usuarioInfo;
    
    private LocalDateTime fechaHora;
    
    private String ipAddress;
    
    private String userAgent;
    
    private String accion;

    @PrePersist
    public void prePersist() {
        this.fechaHora = LocalDateTime.now();
    }
}

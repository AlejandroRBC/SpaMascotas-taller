package com.spa.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

// Lo que le devolvemos al frontend después de login o registro
@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String email;
    private String mensaje;
    private String rol;
    private boolean requiereCambioContrasenia;
}
package com.spa.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

// Lo que le devolvemos al frontend después de login o registro
@Data
@AllArgsConstructor
public class AuthResponse {
    private String token; // el JWT
    private String email; // el email del usuario
    private String mensaje; // ej: "Login exitoso"
    private String rol; // el rol principal del usuario
}
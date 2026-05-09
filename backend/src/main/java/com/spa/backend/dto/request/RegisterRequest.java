package com.spa.backend.dto.request;

import lombok.Data;

// Lo que el frontend nos manda cuando se registra
@Data
public class RegisterRequest {
    private String email;
    private String contrasenia;
    private String rol; // "ADMIN" o "CLIENTE"
    private String codigo; // Para verificación de ADMIN
}
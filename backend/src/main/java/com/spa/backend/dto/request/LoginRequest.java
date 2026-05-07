package com.spa.backend.dto.request;

import lombok.Data;

// Lo que el frontend nos manda cuando hace login
@Data
public class LoginRequest {
    private String email;
    private String contrasenia;
}
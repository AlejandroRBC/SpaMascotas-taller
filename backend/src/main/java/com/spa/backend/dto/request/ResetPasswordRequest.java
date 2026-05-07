package com.spa.backend.dto.request;

import lombok.Data;

@Data
public class ResetPasswordRequest {
    private String email;
    private String codigo;
    private String nuevaContrasenia;
}

package com.spa.backend.dto.request;

import lombok.Data;

@Data
public class CambiarContraseniaInicialRequest {
    private String email;
    private String nuevaContrasenia;
}

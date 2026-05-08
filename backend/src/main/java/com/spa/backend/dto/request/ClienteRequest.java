package com.spa.backend.dto.request;

import lombok.Data;

@Data
public class ClienteRequest {
    private Long id;
    private String ci;
    private String nombre;
    private String telefono;
    private boolean activo;
    private String email;
}

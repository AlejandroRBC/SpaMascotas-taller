package com.spa.backend.dto.request;

import lombok.Data;

@Data
public class EmpleadoRequest {
    private Long id;
    private String nombre;
    private String puesto;
    private boolean activo;
    private String email; // Para vincular/crear usuario
}

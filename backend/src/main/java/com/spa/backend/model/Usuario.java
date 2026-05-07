package com.spa.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

// Esta clase representa la tabla "usuarios" en la base de datos
@Entity
@Table(name = "usuarios")
@Data
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "usuarios_id_seq")
    @SequenceGenerator(name = "usuarios_id_seq", sequenceName = "usuarios_id_seq", allocationSize = 1)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    // En la BD la columna se llama password_hash
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "email_verificado")
    private Boolean emailVerificado = false;

    private String estado = "activo";

    @Column(name = "creado_el")
    private LocalDateTime creadoEl;

    // --- Campos para 2FA y Recuperación ---
    @Column(name = "codigo_recuperacion")
    private String codigoRecuperacion;

    @Column(name = "codigo_recuperacion_expiracion")
    private LocalDateTime codigoRecuperacionExpiracion;

    @Column(name = "dos_factor_secret")
    private String dosFactorSecret;

    @Column(name = "dos_factor_habilitado")
    private boolean dosFactorHabilitado = false;

    // --- Relación con Roles ---
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "usuario_roles",
        joinColumns = @JoinColumn(name = "usuario_id"),
        inverseJoinColumns = @JoinColumn(name = "rol_id")
    )
    private java.util.Set<Rol> roles = new java.util.HashSet<>();

    // Se ejecuta automáticamente antes de guardar en la BD
    @PrePersist
    public void antesDeGuardar() {
        this.creadoEl = LocalDateTime.now();
    }
}
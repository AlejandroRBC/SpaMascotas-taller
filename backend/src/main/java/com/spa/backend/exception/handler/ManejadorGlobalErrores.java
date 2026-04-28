package com.spa.backend.exception.handler;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

// Captura excepciones de toda la app y devuelve respuestas JSON claras
@RestControllerAdvice
public class ManejadorGlobalErrores {

    // Cuando el email o la contrasenia son incorrectos
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, String>> credencialesInvalidas(BadCredentialsException ex) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Email o contrasenia incorrectos"));
    }

    // Para cualquier otro error de la app (como "email ya registrado")
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> errorGeneral(RuntimeException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", ex.getMessage()));
    }
}
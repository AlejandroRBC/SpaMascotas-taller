package com.spa.backend.config.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

// Esta clase se encarga de todo lo relacionado con el token JWT
@Component
public class JwtUtil {

    @Value("${jwt.secreto}")
    private String secreto;

    @Value("${jwt.expiracion.ms}")
    private long expiracionMs;

    // Crea un token nuevo para el usuario
    public String generarToken(String email) {
        SecretKey clave = Keys.hmacShaKeyFor(secreto.getBytes());

        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiracionMs))
                .signWith(clave)
                .compact();
    }

    // Extrae el email guardado dentro del token
    public String obtenerEmail(String token) {
        SecretKey clave = Keys.hmacShaKeyFor(secreto.getBytes());

        return Jwts.parser()
                .verifyWith(clave)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    // Devuelve true si el token es válido, false si está vencido o es inválido
    public boolean esTokenValido(String token) {
        try {
            obtenerEmail(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }
}
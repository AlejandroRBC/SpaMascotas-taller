package com.spa.backend.controller.auth;

import com.spa.backend.dto.request.LoginRequest;
import com.spa.backend.dto.request.RegisterRequest;
import com.spa.backend.dto.request.ResetPasswordRequest;
import com.spa.backend.dto.response.AuthResponse;
import com.spa.backend.service.interfaces.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    // POST /api/auth/registro
    @PostMapping("/registro")
    public ResponseEntity<AuthResponse> registrar(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.registrar(request));
    }

    // POST /api/auth/recuperar?email=xxx@xxx.com
    @PostMapping("/recuperar")
    public ResponseEntity<String> recuperar(@RequestParam String email) {
        return ResponseEntity.ok(authService.recuperarContrasenia(email));
    }

    // POST /api/auth/restablecer
    @PostMapping("/restablecer")
    public ResponseEntity<String> restablecer(@RequestBody ResetPasswordRequest request) {
        return ResponseEntity.ok(authService.restablecerContrasenia(request));
    }

    // POST /api/auth/enviar-codigo-registro?email=xxx@xxx.com
    @PostMapping("/enviar-codigo-registro")
    public ResponseEntity<String> enviarCodigoRegistro(@RequestParam String email) {
        return ResponseEntity.ok(authService.enviarCodigoRegistro(email));
    }
}
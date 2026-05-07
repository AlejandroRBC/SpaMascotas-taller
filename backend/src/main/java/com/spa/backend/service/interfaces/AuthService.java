package com.spa.backend.service.interfaces;

import com.spa.backend.dto.request.LoginRequest;
import com.spa.backend.dto.request.RegisterRequest;
import com.spa.backend.dto.request.ResetPasswordRequest;
import com.spa.backend.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse login(LoginRequest request);
    AuthResponse registrar(RegisterRequest request);
    String recuperarContrasenia(String email);
    String restablecerContrasenia(ResetPasswordRequest request);
}
package com.spa.backend.service.impl;

import com.spa.backend.config.security.JwtUtil;
import com.spa.backend.dto.request.LoginRequest;
import com.spa.backend.dto.request.RegisterRequest;
import com.spa.backend.dto.response.AuthResponse;
import com.spa.backend.model.Usuario;
import com.spa.backend.repository.UsuarioRepository;
import com.spa.backend.service.interfaces.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder codificadorContrasenia;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authManager;

    @Override
    public AuthResponse login(LoginRequest request) {
        // Spring Security verifica automáticamente email y contrasenia
        // Si algo falla lanza BadCredentialsException (el handler la captura)
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getContrasenia()));

        // Si llegamos aquí, las credenciales son correctas — generamos el token
        String token = jwtUtil.generarToken(request.getEmail());
        return new AuthResponse(token, request.getEmail(), "Login exitoso");
    }

    @Override
    public AuthResponse registrar(RegisterRequest request) {
        // Verificamos que el email no esté ya en uso
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Ese email ya está registrado");
        }

        // Creamos y guardamos el nuevo usuario
        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setEmail(request.getEmail());
        nuevoUsuario.setPasswordHash(codificadorContrasenia.encode(request.getContrasenia()));
        nuevoUsuario.setEstado("activo");
        nuevoUsuario.setEmailVerificado(false);
        usuarioRepository.save(nuevoUsuario);

        // Lo logueamos automáticamente tras registrarse
        String token = jwtUtil.generarToken(request.getEmail());
        return new AuthResponse(token, request.getEmail(), "Registro exitoso");
    }

    @Override
    public String recuperarContrasenia(String email) {
        // En un proyecto real aquí se enviaría un correo con un link
        // Para el proyecto universitario, simplemente confirmamos
        if (!usuarioRepository.existsByEmail(email)) {
            // No revelamos si el email existe o no (buena práctica de seguridad)
            return "Si el email está registrado, recibirás instrucciones";
        }
        return "Se enviaron instrucciones de recuperacion al correo: " + email;
    }
}
package com.spa.backend.service.impl;

import com.spa.backend.config.security.JwtUtil;
import com.spa.backend.dto.request.LoginRequest;
import com.spa.backend.dto.request.RegisterRequest;
import com.spa.backend.dto.response.AuthResponse;
import com.spa.backend.model.Usuario;
import com.spa.backend.model.Rol;
import com.spa.backend.repository.UsuarioRepository;
import com.spa.backend.repository.RolRepository;
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
    private final RolRepository rolRepository;
    private final PasswordEncoder codificadorContrasenia;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authManager;
    private final com.spa.backend.service.interfaces.EmailService emailService;

    @Override
    public AuthResponse login(LoginRequest request) {
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getContrasenia()));

        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String token = jwtUtil.generarToken(request.getEmail());
        String rol = usuario.getRoles().stream()
                .map(Rol::getNombre)
                .findFirst()
                .orElse("CLIENTE");

        return new AuthResponse(token, request.getEmail(), "Login exitoso", rol);
    }

    @Override
    public AuthResponse registrar(RegisterRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Ese email ya está registrado");
        }

        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setEmail(request.getEmail());
        nuevoUsuario.setPasswordHash(codificadorContrasenia.encode(request.getContrasenia()));
        nuevoUsuario.setEstado("activo");
        nuevoUsuario.setEmailVerificado(false);

        // Asignar rol por defecto CLIENTE
        Rol rolCliente = rolRepository.findByNombre("CLIENTE")
                .orElseGet(() -> rolRepository.save(new Rol(null, "CLIENTE")));
        nuevoUsuario.getRoles().add(rolCliente);

        usuarioRepository.save(nuevoUsuario);

        String token = jwtUtil.generarToken(request.getEmail());
        return new AuthResponse(token, request.getEmail(), "Registro exitoso", "CLIENTE");
    }

    @Override
    public String recuperarContrasenia(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email).orElse(null);
        
        if (usuario == null) {
            return "Si el email está registrado, recibirás instrucciones";
        }

        // Generar código de 6 dígitos
        String codigo = String.valueOf((int) (Math.random() * 900000) + 100000);
        usuario.setCodigoRecuperacion(codigo);
        usuario.setCodigoRecuperacionExpiracion(java.time.LocalDateTime.now().plusMinutes(15));
        usuarioRepository.save(usuario);

        // Enviar correo
        String cuerpo = "Hola,\n\nTu código de recuperación para Spa Mascotas es: " + codigo + 
                        "\n\nEste código expirará en 15 minutos.";
        emailService.enviarEmail(email, "Código de Recuperación - Spa Mascotas", cuerpo);

        return "Se envió un código de recuperación al correo: " + email;
    }
}
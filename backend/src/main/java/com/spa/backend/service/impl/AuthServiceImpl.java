package com.spa.backend.service.impl;

import com.spa.backend.config.security.JwtUtil;
import com.spa.backend.dto.request.LoginRequest;
import com.spa.backend.dto.request.RegisterRequest;
import com.spa.backend.dto.request.ResetPasswordRequest;
import com.spa.backend.dto.response.AuthResponse;
import com.spa.backend.model.Usuario;
import com.spa.backend.model.Rol;
import com.spa.backend.repository.UsuarioRepository;
import com.spa.backend.repository.RolRepository;
import com.spa.backend.service.interfaces.AuthService;
import com.spa.backend.service.interfaces.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import jakarta.servlet.http.HttpServletRequest;
import com.spa.backend.service.interfaces.SystemLogService;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder codificadorContrasenia;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authManager;
    private final EmailService emailService;
    private final SystemLogService systemLogService;

    // Mapa temporal para códigos de registro (Email -> Código)
    private static final java.util.Map<String, String> codigosPendientesRegistro = new java.util.concurrent.ConcurrentHashMap<>();

    private HttpServletRequest getCurrentRequest() {
        ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        return attrs != null ? attrs.getRequest() : null;
    }

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

        systemLogService.logEvent(usuario.getId() + " - " + rol, "Intento de inicio de sesión exitoso", getCurrentRequest());

        return new AuthResponse(token, request.getEmail(), "Login exitoso", rol);
    }

    @Override
    public AuthResponse registrar(RegisterRequest request) {
        // Si es ADMIN, verificar el código
        if ("ADMIN".equalsIgnoreCase(request.getRol())) {
            String codigoGuardado = codigosPendientesRegistro.get(request.getEmail());
            if (codigoGuardado == null || !codigoGuardado.equals(request.getCodigo())) {
                throw new RuntimeException("Código de verificación de administrador inválido");
            }
            // Consumir el código una vez usado
            codigosPendientesRegistro.remove(request.getEmail());
        }

        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Ese email ya está registrado");
        }

        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setEmail(request.getEmail());
        nuevoUsuario.setPasswordHash(codificadorContrasenia.encode(request.getContrasenia()));
        nuevoUsuario.setEstado("activo");
        nuevoUsuario.setEmailVerificado(false);

        // Determinar rol (ADMIN o CLIENTE)
        String nombreRol = (request.getRol() != null && !request.getRol().isEmpty()) 
                ? request.getRol().toUpperCase() 
                : "CLIENTE";
        
        // Solo permitir ADMIN o CLIENTE desde el registro público
        if (!nombreRol.equals("ADMIN") && !nombreRol.equals("CLIENTE")) {
            nombreRol = "CLIENTE";
        }

        final String finalRol = nombreRol;
        Rol rol = rolRepository.findByNombre(finalRol)
                .orElseGet(() -> rolRepository.save(new Rol(null, finalRol)));
        nuevoUsuario.getRoles().add(rol);

        usuarioRepository.save(nuevoUsuario);

        String token = jwtUtil.generarToken(request.getEmail());
        
        systemLogService.logEvent(nuevoUsuario.getId() + " - " + finalRol, "Registro de usuario", getCurrentRequest());
        
        return new AuthResponse(token, request.getEmail(), "Registro exitoso", finalRol);
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
        usuario.setCodigoRecuperacionExpiracion(LocalDateTime.now().plusMinutes(15));
        usuarioRepository.save(usuario);

        // Enviar correo
        String cuerpo = "Este codigo de confirmacion es enviado a " + email + "\n\n" +
                        "Hola,\n\nTu código de recuperación para Spa Mascotas es: " + codigo + 
                        "\n\nEste código expirará en 15 minutos.";

        /* 
         * =========================================================================
         * ATENCION: ENTORNO DE PRUEBAS
         * Para usar el correo real del usuario en producción, se debe cambiar la
         * siguiente línea para que use la variable 'email' en lugar del correo
         * hardcodeado 'abernasc@fcpn.edu.bo'.
         * =========================================================================
         */
        try {
            emailService.enviarEmail("abernasc@fcpn.edu.bo", "Código de Recuperación - Spa Mascotas", cuerpo);
        } catch (Exception e) {
            System.err.println("Advertencia: No se pudo enviar el correo en entorno local. " + e.getMessage());
        }

        return "Se envió un código de recuperación al correo: " + email;
    }

    @Override
    public String restablecerContrasenia(ResetPasswordRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (usuario.getCodigoRecuperacion() == null || !usuario.getCodigoRecuperacion().equals(request.getCodigo())) {
            throw new RuntimeException("Código de recuperación inválido");
        }

        if (usuario.getCodigoRecuperacionExpiracion().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("El código ha expirado");
        }

        // Actualizar contraseña
        usuario.setPasswordHash(codificadorContrasenia.encode(request.getNuevaContrasenia()));
        usuario.setCodigoRecuperacion(null);
        usuario.setCodigoRecuperacionExpiracion(null);
        usuarioRepository.save(usuario);

        String rol = usuario.getRoles().stream().map(Rol::getNombre).findFirst().orElse("CLIENTE");
        systemLogService.logEvent(usuario.getId() + " - " + rol, "Cambio de clave", getCurrentRequest());

        return "Contraseña actualizada exitosamente";
    }

    @Override
    public String enviarCodigoRegistro(String email) {
        // Generar código de 6 dígitos
        String codigo = String.valueOf((int) (Math.random() * 900000) + 100000);
        codigosPendientesRegistro.put(email, codigo);

        // Enviar correo
        String cuerpo = "Este codigo de confirmacion es enviado a " + email + "\n\n" +
                        "Hola,\n\nTu código de verificación para crear tu cuenta de ADMINISTRADOR es: " + codigo + 
                        "\n\nPor favor, ingrésalo en el formulario de registro.";

        /* 
         * =========================================================================
         * ATENCION: ENTORNO DE PRUEBAS
         * Para usar el correo real del usuario en producción, se debe cambiar la
         * siguiente línea para que use la variable 'email' en lugar del correo
         * hardcodeado 'abernasc@fcpn.edu.bo'.
         * =========================================================================
         */
        try {
            emailService.enviarEmail("abernasc@fcpn.edu.bo", "Código de Verificación Registro Admin - Spa Mascotas", cuerpo);
        } catch (Exception e) {
            System.err.println("Advertencia: No se pudo enviar el correo de registro en entorno local. " + e.getMessage());
        }

        return "Se envió un código de verificación al correo: " + email;
    }
}
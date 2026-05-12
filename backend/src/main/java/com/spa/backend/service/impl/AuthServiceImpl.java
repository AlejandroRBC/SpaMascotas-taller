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
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import jakarta.servlet.http.HttpServletRequest;
import com.spa.backend.service.interfaces.SystemLogService;
import java.time.Duration;
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

    private static final java.util.Map<String, String> codigosPendientesRegistro =
            new java.util.concurrent.ConcurrentHashMap<>();

    private static final int MAX_INTENTOS = 5;
    private static final int MINUTOS_BLOQUEO = 15;

    private HttpServletRequest getCurrentRequest() {
        ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        return attrs != null ? attrs.getRequest() : null;
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail()).orElse(null);

        // Verificar bloqueo activo
        if (usuario != null
                && usuario.getBloqueadoHasta() != null
                && usuario.getBloqueadoHasta().isAfter(LocalDateTime.now())) {
            long minutos = Duration.between(LocalDateTime.now(), usuario.getBloqueadoHasta()).toMinutes() + 1;
            throw new RuntimeException("Cuenta bloqueada. Intente de nuevo en " + minutos + " minuto(s).");
        }

        // Verificar si la cuenta está activa
        if (usuario != null && "inactivo".equalsIgnoreCase(usuario.getEstado())) {
            throw new RuntimeException("Tu cuenta está desactivada. Contacta al administrador.");
        }

        // Intentar autenticación
        try {
            authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getContrasenia()));
        } catch (BadCredentialsException e) {
            if (usuario != null) {
                int intentos = usuario.getIntentosFallidos() + 1;
                usuario.setIntentosFallidos(intentos);
                
                // Log de cada intento fallido
                systemLogService.logEvent(
                        String.valueOf(usuario.getId()),
                        "Intento fallido de inicio de sesión. Intento #" + intentos,
                        getCurrentRequest());

                if (intentos >= MAX_INTENTOS) {
                    usuario.setBloqueadoHasta(LocalDateTime.now().plusMinutes(MINUTOS_BLOQUEO));
                    usuarioRepository.save(usuario);
                    systemLogService.logEvent(
                            String.valueOf(usuario.getId()),
                            "CUENTA BLOQUEADA por " + MINUTOS_BLOQUEO + " min tras " + MAX_INTENTOS + " intentos fallidos",
                            getCurrentRequest());
                    throw new RuntimeException("Cuenta bloqueada por " + MINUTOS_BLOQUEO
                            + " minutos tras demasiados intentos fallidos.");
                }
                usuarioRepository.save(usuario);
                int restantes = MAX_INTENTOS - intentos;
                throw new RuntimeException("Credenciales incorrectas. Te quedan " + restantes + " intento(s).");
            }
            throw new RuntimeException("Credenciales incorrectas.");
        }

        // Login exitoso: limpiar contador de intentos
        usuario.setIntentosFallidos(0);
        usuario.setBloqueadoHasta(null);
        usuarioRepository.save(usuario);

        String token = jwtUtil.generarToken(request.getEmail());
        String rol = usuario.getRoles().stream()
                .map(Rol::getNombre)
                .findFirst()
                .orElse("CLIENTE");

        boolean requiereCambio = Boolean.TRUE.equals(usuario.getRequiereCambioContrasenia());

        systemLogService.logEvent(usuario.getId() + " - " + rol, "Inicio de sesión exitoso", getCurrentRequest());

        return new AuthResponse(token, request.getEmail(), "Login exitoso", rol, requiereCambio);
    }

    @Override
    public AuthResponse registrar(RegisterRequest request) {
        if ("ADMIN".equalsIgnoreCase(request.getRol())) {
            String codigoGuardado = codigosPendientesRegistro.get(request.getEmail());
            if (codigoGuardado == null || !codigoGuardado.equals(request.getCodigo())) {
                throw new RuntimeException("Código de verificación de administrador inválido");
            }
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

        String nombreRol = (request.getRol() != null && !request.getRol().isEmpty())
                ? request.getRol().toUpperCase()
                : "CLIENTE";

        if (!nombreRol.equals("ADMIN") && !nombreRol.equals("CLIENTE") && 
            !nombreRol.equals("RECEPCIONISTA") && !nombreRol.equals("GROOMER")) {
            nombreRol = "CLIENTE";
        }

        final String finalRol = nombreRol;
        Rol rol = rolRepository.findByNombre(finalRol)
                .orElseGet(() -> rolRepository.save(new Rol(null, finalRol)));
        nuevoUsuario.getRoles().add(rol);

        usuarioRepository.save(nuevoUsuario);

        String token = jwtUtil.generarToken(request.getEmail());

        systemLogService.logEvent(nuevoUsuario.getId() + " - " + finalRol, "Registro de usuario", getCurrentRequest());

        return new AuthResponse(token, request.getEmail(), "Registro exitoso", finalRol, false);
    }

    @Override
    public String recuperarContrasenia(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email).orElse(null);

        if (usuario == null) {
            return "Si el email está registrado, recibirás instrucciones";
        }

        String codigo = String.valueOf((int) (Math.random() * 900000) + 100000);
        usuario.setCodigoRecuperacion(codigo);
        usuario.setCodigoRecuperacionExpiracion(LocalDateTime.now().plusMinutes(15));
        usuarioRepository.save(usuario);

        String cuerpo = "Este codigo de confirmacion es enviado a " + email + "\n\n" +
                "Hola,\n\nTu código de recuperación para Spa Mascotas es: " + codigo +
                "\n\nEste código expirará en 15 minutos.";

        try {
            emailService.enviarEmail("abernasc@fcpn.edu.bo", "Código de Recuperación - Spa Mascotas", cuerpo);
        } catch (Exception e) {
            System.err.println("Advertencia: No se pudo enviar el correo. " + e.getMessage());
        }

        return "Se envió un código de recuperación al correo: " + email;
    }

    @Override
    public String restablecerContrasenia(ResetPasswordRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (usuario.getCodigoRecuperacion() == null
                || !usuario.getCodigoRecuperacion().equals(request.getCodigo())) {
            throw new RuntimeException("Código de recuperación inválido");
        }

        if (usuario.getCodigoRecuperacionExpiracion().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("El código ha expirado");
        }

        usuario.setPasswordHash(codificadorContrasenia.encode(request.getNuevaContrasenia()));
        usuario.setCodigoRecuperacion(null);
        usuario.setCodigoRecuperacionExpiracion(null);
        // Desbloquear cuenta si estaba bloqueada
        usuario.setIntentosFallidos(0);
        usuario.setBloqueadoHasta(null);
        usuarioRepository.save(usuario);

        String rol = usuario.getRoles().stream().map(Rol::getNombre).findFirst().orElse("CLIENTE");
        systemLogService.logEvent(usuario.getId() + " - " + rol, "Cambio de clave por recuperación", getCurrentRequest());

        return "Contraseña actualizada exitosamente";
    }

    @Override
    public String enviarCodigoRegistro(String email) {
        String codigo = String.valueOf((int) (Math.random() * 900000) + 100000);
        codigosPendientesRegistro.put(email, codigo);

        String cuerpo = "Este codigo de confirmacion es enviado a " + email + "\n\n" +
                "Hola,\n\nTu código de verificación para crear tu cuenta de ADMINISTRADOR es: " + codigo +
                "\n\nPor favor, ingrésalo en el formulario de registro.";

        try {
            emailService.enviarEmail("abernasc@fcpn.edu.bo",
                    "Código de Verificación Registro Admin - Spa Mascotas", cuerpo);
        } catch (Exception e) {
            System.err.println("Advertencia: No se pudo enviar el correo de registro. " + e.getMessage());
        }

        return "Se envió un código de verificación al correo: " + email;
    }

    @Override
    public String cambiarContraseniaInicial(String email, String nuevaContrasenia) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!Boolean.TRUE.equals(usuario.getRequiereCambioContrasenia())) {
            throw new RuntimeException("Este usuario no tiene pendiente un cambio de contraseña inicial");
        }

        usuario.setPasswordHash(codificadorContrasenia.encode(nuevaContrasenia));
        usuario.setRequiereCambioContrasenia(false);
        usuarioRepository.save(usuario);

        String rol = usuario.getRoles().stream().map(Rol::getNombre).findFirst().orElse("EMPLEADO");
        systemLogService.logEvent(usuario.getId() + " - " + rol, "Cambio de contraseña inicial completado", getCurrentRequest());

        return "Contraseña actualizada exitosamente";
    }
}

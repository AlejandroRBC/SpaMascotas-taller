package com.spa.backend.service.impl;

import com.spa.backend.dto.request.EmpleadoRequest;
import com.spa.backend.model.Empleado;
import com.spa.backend.model.Rol;
import com.spa.backend.model.Usuario;
import com.spa.backend.repository.EmpleadoRepository;
import com.spa.backend.repository.RolRepository;
import com.spa.backend.repository.UsuarioRepository;
import com.spa.backend.service.interfaces.EmpleadoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import jakarta.servlet.http.HttpServletRequest;
import com.spa.backend.service.interfaces.EmailService;
import com.spa.backend.service.interfaces.SystemLogService;
import java.util.List;

import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class EmpleadoServiceImpl implements EmpleadoService {

    private final EmpleadoRepository empleadoRepository;
    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final SystemLogService systemLogService;

    private HttpServletRequest getCurrentRequest() {
        ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        return attrs != null ? attrs.getRequest() : null;
    }

    @Override
    public List<Empleado> listarTodos() {
        List<Empleado> lista = empleadoRepository.findByActivoTrue();
        log.info("Se encontraron {} empleados activos en la base de datos", lista.size());
        return lista;
    }

    @Override
    public Empleado guardar(EmpleadoRequest request) {
        Empleado empleado;
        if (request.getId() != null) {
            empleado = empleadoRepository.findById(request.getId())
                    .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));
        } else {
            empleado = new Empleado();
        }

        empleado.setNombre(request.getNombre());
        empleado.setActivo(request.isActivo());

        // Manejo del Usuario asociado
        if (request.getEmail() != null && !request.getEmail().isEmpty()) {
            Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                    .orElseGet(() -> {
                        String tokenAcceso = java.util.UUID.randomUUID().toString()
                                .replace("-", "").substring(0, 12).toUpperCase();
                        Usuario nuevoUsuario = new Usuario();
                        nuevoUsuario.setEmail(request.getEmail());
                        nuevoUsuario.setPasswordHash(passwordEncoder.encode(tokenAcceso));
                        nuevoUsuario.setRequiereCambioContrasenia(true);
                        nuevoUsuario.setEstado("activo");
                        Usuario guardado = usuarioRepository.save(nuevoUsuario);

                        try {
                            String cuerpo = "Este correo es enviado al empleado: " + request.getEmail() + "\n\n" +
                                    "Hola " + request.getNombre() + ",\n\n" +
                                    "Tu cuenta en Spa Mascotas ha sido creada.\n\n" +
                                    "Credenciales de acceso:\n" +
                                    "  Email: " + request.getEmail() + "\n" +
                                    "  Contraseña temporal: " + tokenAcceso + "\n\n" +
                                    "Al iniciar sesión deberás cambiar tu contraseña obligatoriamente.\n\n" +
                                    "Equipo Spa Mascotas";
                            emailService.enviarEmail("abernasc@fcpn.edu.bo",
                                    "Bienvenido a Spa Mascotas - Credenciales de acceso", cuerpo);
                        } catch (Exception e) {
                            log.warn("No se pudo enviar el correo al empleado {}: {}", request.getEmail(), e.getMessage());
                        }

                        return guardado;
                    });
                    
            if (request.getRol() != null && !request.getRol().isEmpty()) {
                String nombreRol = request.getRol().toUpperCase();
                Rol rolEmpleado = rolRepository.findByNombre(nombreRol)
                        .orElseGet(() -> rolRepository.save(new Rol(null, nombreRol)));
                
                usuario.getRoles().clear();
                usuario.getRoles().add(rolEmpleado);
                usuarioRepository.save(usuario);
            }
            empleado.setUsuario(usuario);
        }

        Empleado savedEmpleado = empleadoRepository.save(empleado);
        
        String accion = request.getId() != null ? "Edición de empleado" : "Creación de empleado";
        systemLogService.logEvent(null, accion + ": " + savedEmpleado.getNombre(), getCurrentRequest());
        
        return savedEmpleado;
    }

    @Override
    public Empleado obtenerPorId(Long id) {
        return empleadoRepository.findById(id).orElse(null);
    }

    @Override
    public void eliminar(Long id) {
        Empleado empleado = empleadoRepository.findById(id).orElse(null);
        if (empleado != null) {
            empleado.setActivo(false);
            
            // Si tiene un usuario asociado, también lo desactivamos
            if (empleado.getUsuario() != null) {
                Usuario user = empleado.getUsuario();
                user.setEstado("inactivo");
                usuarioRepository.save(user);
            }
            
            empleadoRepository.save(empleado);
            systemLogService.logEvent(null, "Eliminación lógica de empleado: " + empleado.getNombre() + " (Email: " + (empleado.getUsuario() != null ? empleado.getUsuario().getEmail() : "N/A") + ")", getCurrentRequest());
        }
    }
}

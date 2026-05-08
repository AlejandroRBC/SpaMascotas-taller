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
    private final SystemLogService systemLogService;

    private HttpServletRequest getCurrentRequest() {
        ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        return attrs != null ? attrs.getRequest() : null;
    }

    @Override
    public List<Empleado> listarTodos() {
        List<Empleado> lista = empleadoRepository.findAll();
        log.info("Se encontraron {} empleados en la base de datos", lista.size());
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
                        Usuario nuevoUsuario = new Usuario();
                        nuevoUsuario.setEmail(request.getEmail());
                        // Contraseña por defecto para empleados nuevos: "Empleado123!"
                        nuevoUsuario.setPasswordHash(passwordEncoder.encode("Empleado123!"));
                        nuevoUsuario.setEstado("activo");
                        return usuarioRepository.save(nuevoUsuario);
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
            empleadoRepository.deleteById(id);
            systemLogService.logEvent(null, "Eliminación de empleado: " + empleado.getNombre(), getCurrentRequest());
        }
    }
}

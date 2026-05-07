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
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmpleadoServiceImpl implements EmpleadoService {

    private final EmpleadoRepository empleadoRepository;
    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;

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
        empleado.setPuesto(request.getPuesto());
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
                        
                        Rol rolEmpleado = rolRepository.findByNombre("EMPLEADO")
                                .orElseGet(() -> rolRepository.save(new Rol(null, "EMPLEADO")));
                        nuevoUsuario.getRoles().add(rolEmpleado);
                        
                        return usuarioRepository.save(nuevoUsuario);
                    });
            empleado.setUsuario(usuario);
        }

        return empleadoRepository.save(empleado);
    }

    @Override
    public Empleado obtenerPorId(Long id) {
        return empleadoRepository.findById(id).orElse(null);
    }

    @Override
    public void eliminar(Long id) {
        empleadoRepository.deleteById(id);
    }
}

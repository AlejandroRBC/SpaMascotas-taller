package com.spa.backend.service.impl;

import com.spa.backend.dto.request.ClienteRequest;
import com.spa.backend.model.Cliente;
import com.spa.backend.model.Rol;
import com.spa.backend.model.Usuario;
import com.spa.backend.repository.ClienteRepository;
import com.spa.backend.repository.RolRepository;
import com.spa.backend.repository.UsuarioRepository;
import com.spa.backend.service.interfaces.ClienteService;
import lombok.RequiredArgsConstructor;
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
@Transactional
public class ClienteServiceImpl implements ClienteService {

    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;
    private final SystemLogService systemLogService;

    private HttpServletRequest getCurrentRequest() {
        ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        return attrs != null ? attrs.getRequest() : null;
    }

    @Override
    public List<Cliente> listar(boolean incluirInactivos) {
        if (incluirInactivos) {
            return clienteRepository.findAll();
        }
        return clienteRepository.findByActivoTrue();
    }

    @Override
    public Cliente guardar(ClienteRequest request) {
        Cliente cliente;
        if (request.getId() != null) {
            cliente = clienteRepository.findById(request.getId())
                    .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        } else {
            cliente = new Cliente();
        }

        cliente.setCi(request.getCi());
        cliente.setNombre(request.getNombre());
        cliente.setTelefono(request.getTelefono());
        cliente.setActivo(request.isActivo());

        if (request.getEmail() != null && !request.getEmail().isEmpty()) {
            Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                    .orElseGet(() -> {
                        Usuario nuevoUsuario = new Usuario();
                        nuevoUsuario.setEmail(request.getEmail());
                        nuevoUsuario.setPasswordHash(passwordEncoder.encode("Cliente123!"));
                        nuevoUsuario.setEstado("activo");
                        
                        Rol rolCliente = rolRepository.findByNombre("CLIENTE")
                                .orElseGet(() -> rolRepository.save(new Rol(null, "CLIENTE")));
                        nuevoUsuario.getRoles().add(rolCliente);
                        
                        return usuarioRepository.save(nuevoUsuario);
                    });
            cliente.setUsuario(usuario);
        }

        Cliente savedCliente = clienteRepository.save(cliente);
        String accion = request.getId() != null ? "Edición de cliente" : "Creación de cliente";
        systemLogService.logEvent(null, accion + ": " + savedCliente.getNombre(), getCurrentRequest());

        return savedCliente;
    }

    @Override
    public Cliente obtenerPorId(Long id) {
        return clienteRepository.findById(id).orElse(null);
    }

    @Override
    public void eliminar(Long id) {
        Cliente cliente = clienteRepository.findById(id).orElse(null);
        if (cliente != null) {
            cliente.setActivo(false);
            
            // Si tiene un usuario asociado, también lo desactivamos
            if (cliente.getUsuario() != null) {
                Usuario user = cliente.getUsuario();
                user.setEstado("inactivo");
                usuarioRepository.save(user);
            }
            
            clienteRepository.save(cliente);
            systemLogService.logEvent(null, "Eliminación lógica de cliente: " + cliente.getNombre() + " (Email: " + (cliente.getUsuario() != null ? cliente.getUsuario().getEmail() : "N/A") + ")", getCurrentRequest());
        }
    }

    @Override
    public void reactivar(Long id) {
        Cliente cliente = clienteRepository.findById(id).orElse(null);
        if (cliente != null) {
            cliente.setActivo(true);
            if (cliente.getUsuario() != null) {
                cliente.getUsuario().setEstado("activo");
                usuarioRepository.save(cliente.getUsuario());
            }
            clienteRepository.save(cliente);
            systemLogService.logEvent(null, "Reactivación de cliente: " + cliente.getNombre(), getCurrentRequest());
        }
    }
}

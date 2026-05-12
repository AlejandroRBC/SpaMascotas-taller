package com.spa.backend.service.interfaces;

import com.spa.backend.dto.request.ClienteRequest;
import com.spa.backend.model.Cliente;
import java.util.List;

public interface ClienteService {
    List<Cliente> listar(boolean incluirInactivos);
    Cliente guardar(ClienteRequest request);
    Cliente obtenerPorId(Long id);
    void eliminar(Long id);
    void reactivar(Long id);
}

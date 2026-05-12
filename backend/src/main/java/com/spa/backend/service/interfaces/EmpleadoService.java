package com.spa.backend.service.interfaces;

import com.spa.backend.dto.request.EmpleadoRequest;
import com.spa.backend.model.Empleado;
import java.util.List;

public interface EmpleadoService {
    List<Empleado> listar(boolean incluirInactivos);
    Empleado guardar(EmpleadoRequest request);
    Empleado obtenerPorId(Long id);
    void eliminar(Long id);
    void reactivar(Long id);
    void resetearContrasenia(Long id);
}

package com.spa.backend.service.interfaces;

import com.spa.backend.model.Empleado;
import java.util.List;

public interface EmpleadoService {
    List<Empleado> listarTodos();
    Empleado guardar(Empleado empleado);
    Empleado obtenerPorId(Long id);
    void eliminar(Long id);
}

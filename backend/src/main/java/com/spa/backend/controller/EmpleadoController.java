package com.spa.backend.controller;

import com.spa.backend.dto.request.EmpleadoRequest;
import com.spa.backend.model.Empleado;
import com.spa.backend.service.interfaces.EmpleadoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/empleados")
@RequiredArgsConstructor
public class EmpleadoController {

    private final EmpleadoService empleadoService;

    @GetMapping
    public ResponseEntity<List<Empleado>> listar(@RequestParam(defaultValue = "false") boolean incluirInactivos) {
        return ResponseEntity.ok(empleadoService.listar(incluirInactivos));
    }

    @PostMapping
    public ResponseEntity<Empleado> guardar(@RequestBody EmpleadoRequest request) {
        return ResponseEntity.ok(empleadoService.guardar(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Empleado> obtener(@PathVariable Long id) {
        Empleado empleado = empleadoService.obtenerPorId(id);
        return empleado != null ? ResponseEntity.ok(empleado) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        empleadoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/reactivar")
    public ResponseEntity<Void> reactivar(@PathVariable Long id) {
        empleadoService.reactivar(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/reset-password")
    public ResponseEntity<Void> resetPassword(@PathVariable Long id) {
        empleadoService.resetearContrasenia(id);
        return ResponseEntity.ok().build();
    }
}

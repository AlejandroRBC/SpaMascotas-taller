package com.spa.backend.controller;

import com.spa.backend.dto.request.ClienteRequest;
import com.spa.backend.model.Cliente;
import com.spa.backend.service.interfaces.ClienteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
@RequiredArgsConstructor
public class ClienteController {

    private final ClienteService clienteService;

    @GetMapping
    public ResponseEntity<List<Cliente>> listar(@RequestParam(defaultValue = "false") boolean incluirInactivos) {
        return ResponseEntity.ok(clienteService.listar(incluirInactivos));
    }

    @PostMapping
    public ResponseEntity<Cliente> guardar(@RequestBody ClienteRequest request) {
        return ResponseEntity.ok(clienteService.guardar(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        clienteService.eliminar(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/reactivar")
    public ResponseEntity<Void> reactivar(@PathVariable Long id) {
        clienteService.reactivar(id);
        return ResponseEntity.ok().build();
    }
}

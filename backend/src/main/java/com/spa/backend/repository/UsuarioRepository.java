package com.spa.backend.repository;

import com.spa.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

// JpaRepository nos da gratis: save, findById, findAll, delete, etc.
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Busca un usuario por su email
    Optional<Usuario> findByEmail(String email);

    // Verifica si ya existe un usuario con ese email
    boolean existsByEmail(String email);
}
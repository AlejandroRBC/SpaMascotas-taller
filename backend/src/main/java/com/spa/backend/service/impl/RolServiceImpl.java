package com.spa.backend.service.impl;

import com.spa.backend.model.Rol;
import com.spa.backend.repository.RolRepository;
import com.spa.backend.service.interfaces.RolService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RolServiceImpl implements RolService {
    private final RolRepository rolRepository;

    @Override
    public List<Rol> listarRoles() {
        return rolRepository.findAll();
    }
}

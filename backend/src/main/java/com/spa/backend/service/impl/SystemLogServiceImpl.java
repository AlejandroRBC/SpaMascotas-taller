package com.spa.backend.service.impl;

import com.spa.backend.model.SystemLog;
import com.spa.backend.repository.SystemLogRepository;
import com.spa.backend.service.interfaces.SystemLogService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SystemLogServiceImpl implements SystemLogService {

    private final SystemLogRepository systemLogRepository;

    @Override
    public void logEvent(String usuarioInfo, String accion, HttpServletRequest request) {
        SystemLog log = new SystemLog();
        
        if (usuarioInfo == null || usuarioInfo.isEmpty()) {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
                usuarioInfo = auth.getName() + " - " + auth.getAuthorities().toString();
            } else {
                usuarioInfo = "Desconocido";
            }
        }
        
        log.setUsuarioInfo(usuarioInfo);
        log.setAccion(accion);
        
        if (request != null) {
            String ipAddress = request.getHeader("X-Forwarded-For");
            if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
                ipAddress = request.getRemoteAddr();
            }
            log.setIpAddress(ipAddress);
            log.setUserAgent(request.getHeader("User-Agent"));
        } else {
            log.setIpAddress("Desconocida");
            log.setUserAgent("Desconocido");
        }
        
        systemLogRepository.save(log);
    }

    @Override
    public List<SystemLog> getAllLogs() {
        return systemLogRepository.findAll(org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "fechaHora"));
    }
}

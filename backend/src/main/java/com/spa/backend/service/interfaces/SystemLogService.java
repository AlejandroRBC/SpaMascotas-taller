package com.spa.backend.service.interfaces;

import com.spa.backend.model.SystemLog;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

public interface SystemLogService {
    void logEvent(String usuarioInfo, String accion, HttpServletRequest request);
    List<SystemLog> getAllLogs();
}

package com.spa.backend.controller;

import com.spa.backend.model.SystemLog;
import com.spa.backend.service.interfaces.SystemLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/logs")
@RequiredArgsConstructor
public class SystemLogController {

    private final SystemLogService systemLogService;

    @GetMapping
    public ResponseEntity<List<SystemLog>> getLogs() {
        return ResponseEntity.ok(systemLogService.getAllLogs());
    }
}

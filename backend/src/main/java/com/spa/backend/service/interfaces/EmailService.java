package com.spa.backend.service.interfaces;

public interface EmailService {
    void enviarEmail(String destinatario, String asunto, String cuerpo);
}

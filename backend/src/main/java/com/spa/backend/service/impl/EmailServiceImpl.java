package com.spa.backend.service.impl;

import com.spa.backend.service.interfaces.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Override
    public void enviarEmail(String destinatario, String asunto, String cuerpo) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("Spa Mascotas <no-reply@spamascotas.com>");
        message.setTo(destinatario);
        message.setSubject(asunto);
        message.setText(cuerpo);
        mailSender.send(message);
    }
}

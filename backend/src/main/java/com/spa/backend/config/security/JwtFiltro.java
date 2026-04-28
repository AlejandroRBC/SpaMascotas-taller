package com.spa.backend.config.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

// Este filtro revisa cada petición HTTP para ver si trae un token JWT válido
@Component
@RequiredArgsConstructor
public class JwtFiltro extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UsuarioDetailsService usuarioDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        // Buscamos el header "Authorization: Bearer <token>"
        String headerAuth = request.getHeader("Authorization");

        if (headerAuth != null && headerAuth.startsWith("Bearer ")) {
            String token = headerAuth.substring(7); // quitamos "Bearer "

            if (jwtUtil.esTokenValido(token)) {
                String email = jwtUtil.obtenerEmail(token);
                UserDetails userDetails = usuarioDetailsService.loadUserByUsername(email);

                // Le avisamos a Spring Security que este usuario ya está autenticado
                UsernamePasswordAuthenticationToken autenticacion = new UsernamePasswordAuthenticationToken(userDetails,
                        null, userDetails.getAuthorities());
                autenticacion.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(autenticacion);
            }
        }

        // Dejamos pasar la petición al siguiente paso
        filterChain.doFilter(request, response);
    }
}
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/usuario.model';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);

    // URL base del backend
    private apiUrl = 'http://localhost:8080/api/auth';

    // Clave del token en localStorage
    private TOKEN_KEY = 'spa_token';
    private ROL_KEY = 'spa_rol';

    // Guarda el token y el rol en localStorage
    guardarSesion(token: string, rol: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
        localStorage.setItem(this.ROL_KEY, rol);
    }

    // Obtiene el rol guardado
    obtenerRol(): string | null {
        return localStorage.getItem(this.ROL_KEY);
    }

    // Llama al backend para iniciar sesión
    login(datos: LoginRequest) {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, datos);
    }

    // Llama al backend para crear cuenta
    registro(datos: RegisterRequest) {
        return this.http.post<AuthResponse>(`${this.apiUrl}/registro`, datos);
    }

    // Llama al backend para recuperar contraseña
    recuperarContrasenia(email: string) {
        return this.http.post<string>(
            `${this.apiUrl}/recuperar?email=${email}`,
            {},
            { responseType: 'text' as 'json' }
        );
    }

    // Llama al backend para enviar código de verificación de registro (para ADMIN)
    enviarCodigoRegistro(email: string) {
        return this.http.post<string>(
            `${this.apiUrl}/enviar-codigo-registro?email=${email}`,
            {},
            { responseType: 'text' as 'json' }
        );
    }

    // Llama al backend para restablecer contraseña con el código
    restablecerContrasenia(datos: { email: string; codigo: string; nuevaContrasenia: string }) {
        return this.http.post<string>(
            `${this.apiUrl}/restablecer`,
            datos,
            { responseType: 'text' as 'json' }
        );
    }

    // Guarda el token en localStorage
    guardarToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    // Obtiene el token guardado
    obtenerToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    // Verifica si hay sesión activa
    estaAutenticado(): boolean {
        return !!this.obtenerToken();
    }

    // Cierra sesión: borra el token y redirige al login
    cerrarSesion(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.ROL_KEY);
        this.router.navigate(['/auth/login']);
    }
}

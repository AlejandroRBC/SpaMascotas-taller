import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthResponse, LoginRequest, RegisterRequest } from '../../shared/models/usuario.model';

@Injectable({
  providedIn: 'root', // disponible en toda la app
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // URL base del backend
  private apiUrl = 'http://localhost:8080/api/auth';

  // Nombre de la llave donde guardamos el token en localStorage
  private TOKEN_KEY = 'spa_token';

  // Llama al backend para iniciar sesión
  login(datos: LoginRequest) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, datos);
  }

  // Llama al backend para crear una cuenta nueva
  registro(datos: RegisterRequest) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/registro`, datos);
  }

  // Llama al backend para recuperar contraseña
  recuperarContrasenia(email: string) {
    return this.http.post<string>(
      `${this.apiUrl}/recuperar?email=${email}`,
      {},
      { responseType: 'text' as 'json' },
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

  // Verifica si hay sesión activa (hay token guardado)
  estaAutenticado(): boolean {
    return !!this.obtenerToken();
  }

  // Cierra sesión: borra el token y redirige al login
  cerrarSesion(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/login']);
  }
}

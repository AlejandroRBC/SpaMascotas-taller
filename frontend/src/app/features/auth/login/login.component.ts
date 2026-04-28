import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Campos del formulario
  email = '';
  contrasenia = '';

  // Estado de la pantalla
  cargando = signal(false);
  errorMensaje = signal('');

  // Se ejecuta cuando el usuario hace clic en "Entrar"
  onLogin() {
    if (!this.email || !this.contrasenia) {
      this.errorMensaje.set('Por favor completa todos los campos');
      return;
    }

    this.cargando.set(true);
    this.errorMensaje.set('');

    this.authService.login({ email: this.email, contrasenia: this.contrasenia }).subscribe({
      next: (respuesta) => {
        this.authService.guardarToken(respuesta.token);
        this.router.navigate(['/dashboard']); // ajusta a tu ruta principal
        //this.router.navigate(['/login']); // temporal, solo para confirmar que funciona
      },
      error: (err) => {
        this.errorMensaje.set(err.error?.error || 'Error al iniciar sesión');
        this.cargando.set(false);
      },
    });
  }
}

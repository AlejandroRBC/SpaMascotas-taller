import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-registro',
  imports: [FormsModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
})
export class RegistroComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  contrasenia = '';
  confirmarContrasenia = '';

  cargando = signal(false);
  errorMensaje = signal('');

  onRegistrar() {
    if (!this.email || !this.contrasenia || !this.confirmarContrasenia) {
      this.errorMensaje.set('Todos los campos son obligatorios');
      return;
    }

    if (this.contrasenia !== this.confirmarContrasenia) {
      this.errorMensaje.set('Las contraseñas no coinciden');
      return;
    }

    if (this.contrasenia.length < 6) {
      this.errorMensaje.set('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    this.cargando.set(true);
    this.errorMensaje.set('');

    this.authService.registro({ email: this.email, contrasenia: this.contrasenia }).subscribe({
      next: (respuesta) => {
        this.authService.guardarToken(respuesta.token);
        this.router.navigate(['/dashboard']); // ajusta a tu ruta principal
      },
      error: (err) => {
        this.errorMensaje.set(err.error?.error || 'Error al registrarse');
        this.cargando.set(false);
      },
    });
  }
}

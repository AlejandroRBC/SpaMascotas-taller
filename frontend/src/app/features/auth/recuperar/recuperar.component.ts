import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-recuperar',
  imports: [FormsModule, RouterLink],
  templateUrl: './recuperar.component.html',
  styleUrl: './recuperar.component.css',
})
export class RecuperarComponent {
  private authService = inject(AuthService);

  email = '';

  cargando = signal(false);
  errorMensaje = signal('');
  exitoMensaje = signal('');

  onRecuperar() {
    if (!this.email) {
      this.errorMensaje.set('Ingresa tu correo electrónico');
      return;
    }

    this.cargando.set(true);
    this.errorMensaje.set('');
    this.exitoMensaje.set('');

    this.authService.recuperarContrasenia(this.email).subscribe({
      next: (respuesta) => {
        this.exitoMensaje.set(respuesta);
        this.cargando.set(false);
      },
      error: () => {
        this.errorMensaje.set('Ocurrió un error, intenta de nuevo');
        this.cargando.set(false);
      },
    });
  }
}

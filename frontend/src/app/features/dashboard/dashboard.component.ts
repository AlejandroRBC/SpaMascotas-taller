import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  template: `
    <div style="padding: 40px; font-family: var(--fuente-principal)">
      <h1 style="color: var(--color-texto-fuerte)">🐾 Bienvenido al Spa</h1>
      <p>Login exitoso. Aquí irá el panel principal.</p>
      <button class="btn-primario" style="width:auto; margin-top:20px" (click)="cerrarSesion()">
        Cerrar sesión
      </button>
    </div>
  `,
})
export class DashboardComponent {
  private authService = inject(AuthService);

  cerrarSesion() {
    this.authService.cerrarSesion();
  }
}

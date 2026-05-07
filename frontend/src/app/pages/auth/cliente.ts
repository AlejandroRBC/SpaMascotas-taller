import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { AuthService } from '@/app/core/services/auth.service';

@Component({
    selector: 'app-cliente',
    standalone: true,
    imports: [ButtonModule, CommonModule],
    template: `
        <div class="flex flex-col items-center justify-center min-h-screen bg-surface-50 dark:bg-surface-950 p-6">
            <div class="w-full max-w-md bg-surface-0 dark:bg-surface-900 shadow-lg rounded-2xl p-8 text-center border border-surface-200 dark:border-surface-800">
                <div class="mb-6">
                    <span class="text-5xl">👤</span>
                    <h1 class="text-3xl font-bold mt-4 text-surface-900 dark:text-surface-0">Panel de Cliente</h1>
                    <p class="text-surface-600 dark:text-surface-400 mt-2">Gestiona tus datos y mascotas</p>
                </div>

                <div class="flex flex-col gap-4">
                    <p-button label="Cambiar Contraseña" icon="pi pi-key" styleClass="w-full p-button-outlined" />
                    <p-button label="Validar Email" icon="pi pi-envelope" styleClass="w-full p-button-outlined" />
                    <p-button label="Cerrar Sesión" icon="pi pi-sign-out" severity="danger" styleClass="w-full mt-4" (onClick)="logout()" />
                </div>
            </div>
        </div>
    `
})
export class Cliente {
    private authService = inject(AuthService);

    logout() {
        this.authService.cerrarSesion();
    }
}

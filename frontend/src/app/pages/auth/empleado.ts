import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { AuthService } from '@/app/core/services/auth.service';

@Component({
    selector: 'app-empleado',
    standalone: true,
    imports: [ButtonModule, CommonModule],
    template: `
        <div class="spa-auth-wrapper items-center justify-center p-6">
            <div class="spa-login-card animate-fade-in text-center p-8">
                <div class="spa-icon-badge mx-auto mb-6">
                    <i class="pi pi-id-card"></i>
                </div>
                
                <h1 class="spa-login-header h2 mb-2">Panel de Empleado</h1>
                <p class="text-gray-500 mb-8">Bienvenido al sistema de Spa Mascotas</p>

                <div class="flex flex-col gap-4">
                    <p-button label="Cambiar Contraseña" icon="pi pi-key" styleClass="spa-btn-outline w-full" />
                    <p-button label="Validar Email" icon="pi pi-envelope" styleClass="spa-btn-outline w-full" />
                    <p-button label="Cerrar Sesión" icon="pi pi-sign-out" styleClass="spa-btn-danger w-full mt-4" (onClick)="logout()" />
                </div>
            </div>
        </div>
    `,
    styles: [`
        .spa-auth-wrapper {
            display: flex;
            min-height: 100vh;
            background: #f8fafc;
            font-family: var(--spa-fuente);
        }
        .spa-login-card {
            width: 100%;
            max-width: 400px;
            background: white;
            border-radius: 24px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.05);
            padding: 3rem 2rem;
        }
        .spa-icon-badge {
            width: 70px;
            height: 70px;
            background: var(--spa-capa1);
            color: var(--spa-primario);
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
        }
        .h2 {
            font-size: 1.75rem;
            font-weight: 800;
            color: var(--spa-texto);
            letter-spacing: -0.02em;
        }
        :host ::ng-deep .spa-btn-outline {
            width: 100%;
            background: transparent !important;
            border: 2px solid #e2e8f0 !important;
            color: var(--spa-texto) !important;
            border-radius: 12px !important;
            font-weight: 700 !important;
            transition: all 0.2s !important;
        }
        :host ::ng-deep .spa-btn-outline:hover {
            border-color: var(--spa-primario) !important;
            color: var(--spa-primario) !important;
            background: rgba(32, 178, 170, 0.05) !important;
        }
        :host ::ng-deep .spa-btn-danger {
            width: 100%;
            background: #fef2f2 !important;
            border: 2px solid #fee2e2 !important;
            color: #dc2626 !important;
            border-radius: 12px !important;
            font-weight: 700 !important;
            transition: all 0.2s !important;
        }
        :host ::ng-deep .spa-btn-danger:hover {
            background: #fee2e2 !important;
            border-color: #fecaca !important;
        }
        .animate-fade-in { animation: fadeIn 0.6s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    `]
})
export class Empleado {
    private authService = inject(AuthService);

    logout() {
        this.authService.cerrarSesion();
    }
}

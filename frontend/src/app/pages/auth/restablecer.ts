import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { CommonModule } from '@angular/common';
import { AuthService } from '@/app/core/services/auth.service';

@Component({
    selector: 'app-restablecer',
    standalone: true,
    imports: [ButtonModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, CommonModule],
    template: `
        <div class="spa-auth-wrapper">
            <!-- PANEL IZQUIERDO -->
            <div class="spa-auth-left">
                <div class="spa-auth-brand animate-fade-in">
                    <i class="pi pi-heart-fill spa-logo-icon"></i>
                    <h1 class="spa-brand-title">Spa Mascotas</h1>
                </div>
                <div class="spa-auth-hero animate-slide-up">
                    <h2 class="spa-hero-title">Nueva<br />Contraseña</h2>
                    <p class="spa-hero-subtitle">Ingresa el código que recibiste en tu email y tu nueva contraseña para recuperar el acceso.</p>
                </div>
                
                <ul class="spa-features">
                    <li class="animate-slide-up" style="animation-delay: 0.1s">
                        <span class="spa-feature-icon">
                            <i class="pi pi-key"></i>
                        </span>
                        <span>Código de verificación único</span>
                    </li>
                    <li class="animate-slide-up" style="animation-delay: 0.2s">
                        <span class="spa-feature-icon">
                            <i class="pi pi-shield"></i>
                        </span>
                        <span>Seguridad de nivel bancario</span>
                    </li>
                </ul>
            </div>

            <!-- PANEL DERECHO -->
            <div class="spa-auth-right">
                <div class="spa-login-card animate-fade-in">
                    <div class="spa-login-header">
                        <div class="spa-icon-badge">
                            <i class="pi pi-refresh"></i>
                        </div>
                        <h2>Restablecer</h2>
                        <p>Completa los datos para continuar</p>
                    </div>

                    @if (errorMensaje()) {
                        <div class="spa-alert spa-alert-error animate-shake">
                            <i class="pi pi-exclamation-circle"></i> {{ errorMensaje() }}
                        </div>
                    }
                    @if (exitoMensaje()) {
                        <div class="spa-alert spa-alert-success animate-bounce-in">
                            <i class="pi pi-check-circle"></i> {{ exitoMensaje() }}
                        </div>
                    }

                    <div class="spa-field">
                        <label>Código de 6 dígitos</label>
                        <span class="p-input-icon-left w-full">
                            <i class="pi pi-ticket"></i>
                            <input pInputText [(ngModel)]="codigo" placeholder="Ej: 123456" class="spa-input" />
                        </span>
                    </div>

                    <div class="spa-field">
                        <label>Nueva Contraseña</label>
                        <p-password [(ngModel)]="nuevaContrasenia" [toggleMask]="true" [feedback]="true" 
                                    placeholder="Mínimo 6 caracteres" styleClass="spa-password-input" 
                                    inputStyleClass="spa-input-pass" [style]="{'width':'100%'}"/>
                    </div>

                    <p-button label="ACTUALIZAR CONTRASEÑA" styleClass="spa-btn-primary" [disabled]="cargando()" (onClick)="onRestablecer()">
                        <ng-template pTemplate="icon">
                            <i class="pi pi-check mr-2" *ngIf="!cargando()"></i>
                            <i class="pi pi-spin pi-spinner mr-2" *ngIf="cargando()"></i>
                        </ng-template>
                    </p-button>

                    <div class="spa-login-links">
                        <a routerLink="/auth/login" class="spa-link">
                            <i class="pi pi-arrow-left mr-2"></i>
                            Volver al inicio de sesión
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .spa-auth-wrapper {
            display: flex;
            min-height: 100vh;
            font-family: var(--spa-fuente);
            background: #f8fafc;
        }
        .spa-auth-left {
            flex: 1;
            background: linear-gradient(135deg, var(--spa-primario) 0%, #1a9e97 60%, #0d6f6a 100%);
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 3rem 4rem;
            color: #fff;
            position: relative;
            overflow: hidden;
        }
        .spa-auth-left::before {
            content: '';
            position: absolute;
            top: -10%;
            right: -10%;
            width: 400px;
            height: 400px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 70%);
        }
        .spa-auth-brand {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 4rem;
        }
        .spa-logo-icon {
            font-size: 2.5rem;
            color: var(--spa-acento);
            filter: drop-shadow(0 0 8px rgba(253, 224, 71, 0.4));
        }
        .spa-brand-title {
            font-size: 1.75rem;
            font-weight: 800;
            color: #fff;
            letter-spacing: -0.02em;
            margin: 0;
        }
        .spa-hero-title {
            font-size: 3rem;
            font-weight: 800;
            line-height: 1.1;
            margin-bottom: 1.5rem;
            color: #fff;
        }
        .spa-hero-subtitle {
            font-size: 1.1rem;
            line-height: 1.6;
            color: rgba(255,255,255,0.9);
            margin-bottom: 3rem;
            max-width: 450px;
        }
        .spa-features {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }
        .spa-features li {
            display: flex;
            align-items: center;
            gap: 1rem;
            font-size: 1rem;
            font-weight: 500;
        }
        .spa-feature-icon {
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 12px;
            background: rgba(255,255,255,0.15);
            backdrop-filter: blur(4px);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            flex-shrink: 0;
            border: 1px solid rgba(255,255,255,0.2);
        }
        .spa-auth-right {
            width: 550px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--spa-superficie);
            padding: 2rem;
            box-shadow: -10px 0 30px rgba(0,0,0,0.03);
        }
        .spa-login-card {
            width: 100%;
            max-width: 400px;
        }
        .spa-icon-badge {
            width: 60px;
            height: 60px;
            background: var(--spa-capa1);
            color: var(--spa-primario);
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
        }
        .spa-login-header h2 {
            font-size: 2rem;
            font-weight: 800;
            color: var(--spa-texto);
            margin-bottom: 0.5rem;
            letter-spacing: -0.02em;
        }
        .spa-login-header p {
            font-size: 1rem;
            color: #64748b;
            margin-bottom: 2rem;
        }
        .spa-alert {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 1rem;
            border-radius: 12px;
            font-size: 0.95rem;
            font-weight: 600;
            margin-bottom: 1.5rem;
        }
        .spa-alert-error { background: #fef2f2; color: #dc2626; border: 1px solid #fee2e2; }
        .spa-alert-success { background: #f0fdf4; color: #16a34a; border: 1px solid #dcfce7; }
        .spa-field {
            margin-bottom: 1.5rem;
        }
        .spa-field label {
            display: block;
            font-size: 0.85rem;
            font-weight: 700;
            color: var(--spa-texto);
            margin-bottom: 0.5rem;
            text-transform: uppercase;
            letter-spacing: 0.025em;
        }
        :host ::ng-deep .spa-input {
            width: 100% !important;
            padding: 0.8rem 1rem 0.8rem 2.5rem !important;
            border: 2px solid #e2e8f0 !important;
            border-radius: 12px !important;
            font-size: 1rem !important;
            transition: all 0.2s !important;
        }
        :host ::ng-deep .spa-input:focus {
            border-color: var(--spa-primario) !important;
            box-shadow: 0 0 0 4px rgba(32, 178, 170, 0.1) !important;
        }
        
        :host ::ng-deep .spa-password-input { width: 100%; }
        :host ::ng-deep .spa-input-pass {
            width: 100% !important;
            padding: 0.8rem 1rem !important;
            border: 2px solid #e2e8f0 !important;
            border-radius: 12px !important;
        }

        :host ::ng-deep .spa-btn-primary {
            width: 100%;
            height: 3.5rem;
            background: var(--spa-primario) !important;
            border: none !important;
            border-radius: 12px !important;
            font-weight: 700 !important;
            font-size: 1rem !important;
            letter-spacing: 0.025em;
            transition: all 0.3s !important;
            box-shadow: 0 4px 12px rgba(32, 178, 170, 0.2) !important;
        }
        :host ::ng-deep .spa-btn-primary:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(32, 178, 170, 0.3) !important;
        }
        .spa-login-links {
            margin-top: 2rem;
            text-align: center;
        }
        .spa-link {
            display: inline-flex;
            align-items: center;
            color: #64748b;
            font-weight: 600;
            text-decoration: none;
            font-size: 0.95rem;
            transition: color 0.2s;
        }
        .spa-link:hover { color: var(--spa-primario); }

        /* Animations */
        .animate-fade-in { animation: fadeIn 0.6s ease-out; }
        .animate-slide-up { animation: slideUp 0.6s ease-out both; }
        .animate-bounce-in { animation: bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
        .animate-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounceIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
        @keyframes shake {
            10%, 90% { transform: translate3d(-1px, 0, 0); }
            20%, 80% { transform: translate3d(2px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
            40%, 60% { transform: translate3d(4px, 0, 0); }
        }

        @media (max-width: 992px) {
            .spa-auth-wrapper { flex-direction: column; }
            .spa-auth-left { padding: 3rem 2rem; min-height: auto; }
            .spa-auth-right { width: 100%; padding: 3rem 2rem; }
            .spa-hero-title { font-size: 2.2rem; }
        }
    `]
})
export class Restablecer {
    private authService = inject(AuthService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    email = '';
    codigo = '';
    nuevaContrasenia = '';

    cargando = signal(false);
    errorMensaje = signal('');
    exitoMensaje = signal('');

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.email = params['email'] || '';
        });
    }

    onRestablecer() {
        if (!this.codigo || !this.nuevaContrasenia) {
            this.errorMensaje.set('Completa todos los campos');
            return;
        }

        this.cargando.set(true);
        this.errorMensaje.set('');

        this.authService.restablecerContrasenia({
            email: this.email,
            codigo: this.codigo,
            nuevaContrasenia: this.nuevaContrasenia
        }).subscribe({
            next: (res) => {
                this.exitoMensaje.set('Contraseña actualizada. Redirigiendo...');
                setTimeout(() => this.router.navigate(['/auth/login']), 3000);
            },
            error: (err) => {
                this.errorMensaje.set(err.error || 'Error al restablecer contraseña');
                this.cargando.set(false);
            }
        });
    }
}

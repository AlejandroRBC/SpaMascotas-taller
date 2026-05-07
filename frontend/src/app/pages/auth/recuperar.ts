import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { CommonModule } from '@angular/common';
import { AuthService } from '@/app/core/services/auth.service';

@Component({
    selector: 'app-recuperar',
    standalone: true,
    imports: [ButtonModule, InputTextModule, FormsModule, RouterModule, RippleModule, CommonModule],
    template: `
        <div class="spa-auth-wrapper">
            <!-- PANEL IZQUIERDO -->
            <div class="spa-auth-left">
                <div class="spa-auth-brand">
                    <span class="spa-paw">🐾</span>
                    <h1 class="spa-brand-title">Spa Mascotas</h1>
                </div>

                <div class="spa-auth-hero">
                    <h2 class="spa-hero-title">¿Olvidaste tu<br />contraseña?</h2>
                    <p class="spa-hero-subtitle">
                        Sin problemas. Ingresa tu correo electrónico y te enviaremos instrucciones
                        para restablecer el acceso a tu cuenta de forma segura.
                    </p>
                </div>

                <ul class="spa-features">
                    <li>
                        <span class="spa-feature-icon">📧</span>
                        <span>Instrucciones enviadas a tu correo</span>
                    </li>
                    <li>
                        <span class="spa-feature-icon">⏱️</span>
                        <span>Proceso rápido de menos de 2 minutos</span>
                    </li>
                    <li>
                        <span class="spa-feature-icon">🔒</span>
                        <span>Proceso completamente seguro</span>
                    </li>
                </ul>
            </div>

            <!-- PANEL DERECHO -->
            <div class="spa-auth-right">
                <div class="spa-login-card">
                    <div class="spa-login-header">
                        <h2>Recuperar contraseña</h2>
                        <p>Te enviaremos instrucciones a tu correo</p>
                    </div>

                    @if (errorMensaje()) {
                        <div class="spa-alert spa-alert-error">
                            <i class="pi pi-exclamation-circle"></i>
                            {{ errorMensaje() }}
                        </div>
                    }

                    @if (exitoMensaje()) {
                        <div class="spa-alert spa-alert-exito">
                            <i class="pi pi-check-circle"></i>
                            {{ exitoMensaje() }}
                        </div>
                    }

                    <div class="spa-field">
                        <label for="rec-email">Correo electrónico</label>
                        <input
                            id="rec-email"
                            pInputText
                            type="email"
                            placeholder="correo@ejemplo.com"
                            [(ngModel)]="email"
                            class="spa-input"
                        />
                    </div>

                    <p-button
                        id="btn-recuperar"
                        label="{{ cargando() ? 'Enviando...' : 'Enviar instrucciones' }}"
                        styleClass="spa-btn-primary"
                        [disabled]="cargando()"
                        (onClick)="onRecuperar()"
                    />

                    <div class="spa-login-links">
                        <a routerLink="/auth/login" class="spa-link">← Volver al inicio de sesión</a>
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
        }
        .spa-auth-left {
            flex: 1;
            background: linear-gradient(145deg, var(--spa-primario) 0%, #1a9e97 60%, #0d6f6a 100%);
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 3rem 3.5rem;
            color: #fff;
            position: relative;
            overflow: hidden;
        }
        .spa-auth-left::before {
            content: '';
            position: absolute;
            top: -80px;
            right: -80px;
            width: 320px;
            height: 320px;
            border-radius: 50%;
            background: rgba(255,255,255,0.06);
        }
        .spa-auth-left::after {
            content: '';
            position: absolute;
            bottom: -100px;
            left: -60px;
            width: 260px;
            height: 260px;
            border-radius: 50%;
            background: rgba(255,255,255,0.05);
        }
        .spa-auth-brand {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 3rem;
        }
        .spa-paw { font-size: 2rem; }
        .spa-brand-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #fff;
            letter-spacing: -0.02em;
        }
        .spa-hero-title {
            font-size: 2.4rem;
            font-weight: 700;
            line-height: 1.2;
            margin-bottom: 1.25rem;
            color: #fff;
        }
        .spa-hero-subtitle {
            font-size: 1rem;
            line-height: 1.7;
            color: rgba(255,255,255,0.85);
            margin-bottom: 2.5rem;
            max-width: 420px;
        }
        .spa-features {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        .spa-features li {
            display: flex;
            align-items: center;
            gap: 0.85rem;
            font-size: 0.95rem;
            color: rgba(255,255,255,0.9);
        }
        .spa-feature-icon {
            font-size: 1.25rem;
            width: 2.2rem;
            height: 2.2rem;
            border-radius: 50%;
            background: rgba(255,255,255,0.15);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        .spa-auth-right {
            width: 480px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--spa-superficie);
            padding: 2rem;
        }
        .spa-login-card {
            width: 100%;
            max-width: 380px;
        }
        .spa-login-header {
            margin-bottom: 2rem;
        }
        .spa-login-header h2 {
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--spa-texto);
            margin-bottom: 0.35rem;
        }
        .spa-login-header p {
            font-size: 0.95rem;
            color: rgba(8, 51, 68, 0.6);
        }
        .spa-alert {
            display: flex;
            align-items: center;
            gap: 0.6rem;
            padding: 0.75rem 1rem;
            border-radius: 8px;
            font-size: 0.9rem;
            font-weight: 600;
            margin-bottom: 1.25rem;
        }
        .spa-alert-error { background: #fee2e2; color: #991b1b; }
        .spa-alert-exito { background: #d1fae5; color: #065f46; }
        .spa-field {
            display: flex;
            flex-direction: column;
            gap: 0.4rem;
            margin-bottom: 1.25rem;
        }
        .spa-field label {
            font-size: 0.8rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--spa-texto);
        }
        :host ::ng-deep .spa-input,
        :host ::ng-deep .spa-input input {
            width: 100% !important;
            padding: 0.65rem 0.9rem !important;
            border: 2px solid var(--spa-capa1) !important;
            border-radius: 8px !important;
            font-family: var(--spa-fuente) !important;
            font-size: 0.95rem !important;
            color: var(--spa-texto) !important;
            background: var(--spa-superficie) !important;
            transition: border-color 0.2s !important;
            outline: none !important;
            box-shadow: none !important;
        }
        :host ::ng-deep .spa-input:focus {
            border-color: var(--spa-primario) !important;
        }
        :host ::ng-deep .spa-btn-primary {
            width: 100%;
            background: var(--spa-primario) !important;
            border-color: var(--spa-primario) !important;
            border-radius: 8px !important;
            font-weight: 700 !important;
            font-size: 0.95rem !important;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            padding: 0.75rem 1.5rem !important;
            margin-top: 0.5rem;
            transition: opacity 0.2s !important;
        }
        :host ::ng-deep .spa-btn-primary:hover:not(:disabled) { opacity: 0.88 !important; }
        :host ::ng-deep .spa-btn-primary:disabled { opacity: 0.5 !important; }
        .spa-login-links {
            display: flex;
            justify-content: center;
            margin-top: 1.5rem;
        }
        .spa-link {
            color: var(--spa-primario);
            font-size: 0.875rem;
            font-weight: 600;
            text-decoration: none;
            transition: opacity 0.2s;
        }
        .spa-link:hover { opacity: 0.75; text-decoration: underline; }
        @media (max-width: 768px) {
            .spa-auth-wrapper { flex-direction: column; }
            .spa-auth-left { padding: 2rem 1.5rem; }
            .spa-hero-title { font-size: 1.75rem; }
            .spa-auth-right { width: 100%; padding: 2rem 1.5rem; }
        }
    `]
})
export class Recuperar {
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

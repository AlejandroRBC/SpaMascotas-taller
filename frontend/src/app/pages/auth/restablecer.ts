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
            <div class="spa-auth-left">
                <div class="spa-auth-brand">
                    <span class="spa-paw">🐾</span>
                    <h1 class="spa-brand-title">Spa Mascotas</h1>
                </div>
                <div class="spa-auth-hero">
                    <h2 class="spa-hero-title">Nueva<br />Contraseña</h2>
                    <p class="spa-hero-subtitle">Ingresa el código que recibiste en tu email y tu nueva contraseña para recuperar el acceso.</p>
                </div>
            </div>

            <div class="spa-auth-right">
                <div class="spa-login-card">
                    <div class="spa-login-header">
                        <h2>Restablecer</h2>
                        <p>Completa los datos para continuar</p>
                    </div>

                    @if (errorMensaje()) {
                        <div class="spa-alert spa-alert-error">
                            <i class="pi pi-exclamation-circle"></i> {{ errorMensaje() }}
                        </div>
                    }
                    @if (exitoMensaje()) {
                        <div class="spa-alert spa-alert-success">
                            <i class="pi pi-check-circle"></i> {{ exitoMensaje() }}
                        </div>
                    }

                    <div class="spa-field">
                        <label>Código de 6 dígitos</label>
                        <input pInputText [(ngModel)]="codigo" placeholder="Ej: 123456" class="spa-input" />
                    </div>

                    <div class="spa-field">
                        <label>Nueva Contraseña</label>
                        <p-password [(ngModel)]="nuevaContrasenia" [toggleMask]="true" [feedback]="true" placeholder="Mínimo 6 caracteres" styleClass="spa-input" />
                    </div>

                    <p-button label="ACTUALIZAR CONTRASEÑA" styleClass="spa-btn-primary" [disabled]="cargando()" (onClick)="onRestablecer()" />

                    <div class="spa-login-links">
                        <a routerLink="/auth/login" class="spa-link">← Volver al inicio de sesión</a>
                    </div>
                </div>
            </div>
        </div>
    `
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

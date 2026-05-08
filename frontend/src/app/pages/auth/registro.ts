import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { AuthService } from '@/app/core/services/auth.service';
import { ClienteService } from '@/app/core/services/cliente.service';
import { DialogModule } from 'primeng/dialog';

@Component({
    selector: 'app-registro',
    standalone: true,
    imports: [ButtonModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, CommonModule, DialogModule],
    providers: [MessageService],
    template: `
        <div class="spa-auth-wrapper">
            <!-- PANEL IZQUIERDO -->
            <div class="spa-auth-left">
                <div class="spa-auth-brand animate-fade-in">
                    <i class="pi pi-heart-fill spa-logo-icon"></i>
                    <h1 class="spa-brand-title">Spa Mascotas</h1>
                </div>

                <div class="spa-auth-hero animate-slide-up">
                    <h2 class="spa-hero-title">Únete a nuestra<br />comunidad</h2>
                    <p class="spa-hero-subtitle">
                        Crea tu cuenta y empieza a gestionar tu negocio de spa y cuidado de mascotas de forma
                        profesional desde el primer día.
                    </p>
                </div>

                <ul class="spa-features">
                    <li class="animate-slide-up" style="animation-delay: 0.1s">
                        <span class="spa-feature-icon">
                            <i class="pi pi-bolt"></i>
                        </span>
                        <span>Configuración rápida en minutos</span>
                    </li>
                    <li class="animate-slide-up" style="animation-delay: 0.2s">
                        <span class="spa-feature-icon">
                            <i class="pi pi-lock"></i>
                        </span>
                        <span>Datos seguros con cifrado JWT</span>
                    </li>
                    <li class="animate-slide-up" style="animation-delay: 0.3s">
                        <span class="spa-feature-icon">
                            <i class="pi pi-mobile"></i>
                        </span>
                        <span>Acceso desde cualquier dispositivo</span>
                    </li>
                    <li class="animate-slide-up" style="animation-delay: 0.4s">
                        <span class="spa-feature-icon">
                            <i class="pi pi-lightbulb"></i>
                        </span>
                        <span>Panel intuitivo sin curva de aprendizaje</span>
                    </li>
                </ul>
            </div>

            <!-- PANEL DERECHO -->
            <div class="spa-auth-right">
                <div class="spa-login-card animate-fade-in">
                    <div class="spa-login-header">
                        <div class="spa-icon-badge">
                            <i class="pi pi-user-plus"></i>
                        </div>
                        <h2>Crear cuenta</h2>
                        <p>Regístrate para comenzar</p>
                    </div>

                    @if (errorMensaje()) {
                        <div class="spa-alert spa-alert-error animate-shake">
                            <i class="pi pi-exclamation-circle"></i>
                            {{ errorMensaje() }}
                        </div>
                    }

                    <div class="spa-field">
                        <label for="reg-email">Correo electrónico</label>
                        <span class="p-input-icon-left w-full">
                            <i class="pi pi-envelope"></i>
                            <input
                                id="reg-email"
                                pInputText
                                type="email"
                                placeholder="correo@ejemplo.com"
                                [(ngModel)]="email"
                                class="spa-input"
                            />
                        </span>
                    </div>

                    <div class="spa-field">
                        <label for="reg-contrasenia">Contraseña</label>
                        <p-password
                            id="reg-contrasenia"
                            [(ngModel)]="contrasenia"
                            placeholder="Mínimo 8 caracteres"
                            [toggleMask]="true"
                            [feedback]="true"
                            promptLabel="Ingresa una contraseña"
                            weakLabel="Débil"
                            mediumLabel="Media"
                            strongLabel="Fuerte"
                            styleClass="spa-password-input"
                            inputStyleClass="spa-input-pass"
                            [style]="{'width':'100%'}"
                        >
                            <ng-template pTemplate="footer">
                                <div class="mt-3">
                                    <p class="text-sm font-semibold mb-2 text-gray-700" style="font-size: 0.85rem; color: #334155;">
                                        Sugerencia proactiva: Usa <strong class="text-teal-600">Passphrases</strong> (frases de 3 o 4 palabras) para mayor seguridad.
                                    </p>
                                    <ul class="pl-0 m-0 flex flex-column gap-1" style="list-style-type: none; font-size: 0.8rem;">
                                        <li [ngStyle]="{'color': tieneLongitud() ? '#16a34a' : '#64748b'}">
                                            <i class="pi" [ngClass]="tieneLongitud() ? 'pi-check-circle' : 'pi-circle'"></i> Mínimo 8 caracteres
                                        </li>
                                        <li [ngStyle]="{'color': tieneMayuscula() ? '#16a34a' : '#64748b'}">
                                            <i class="pi" [ngClass]="tieneMayuscula() ? 'pi-check-circle' : 'pi-circle'"></i> Al menos una mayúscula
                                        </li>
                                        <li [ngStyle]="{'color': tieneMinuscula() ? '#16a34a' : '#64748b'}">
                                            <i class="pi" [ngClass]="tieneMinuscula() ? 'pi-check-circle' : 'pi-circle'"></i> Al menos una minúscula
                                        </li>
                                        <li [ngStyle]="{'color': tieneNumero() ? '#16a34a' : '#64748b'}">
                                            <i class="pi" [ngClass]="tieneNumero() ? 'pi-check-circle' : 'pi-circle'"></i> Al menos un número
                                        </li>
                                        <li [ngStyle]="{'color': tieneSimbolo() ? '#16a34a' : '#64748b'}">
                                            <i class="pi" [ngClass]="tieneSimbolo() ? 'pi-check-circle' : 'pi-circle'"></i> Al menos un símbolo (*, #, !, etc.)
                                        </li>
                                    </ul>
                                </div>
                            </ng-template>
                        </p-password>
                    </div>

                    <div class="spa-field">
                        <label for="reg-confirmar">Confirmar contraseña</label>
                        <p-password
                            id="reg-confirmar"
                            [(ngModel)]="confirmarContrasenia"
                            placeholder="Repite tu contraseña"
                            [toggleMask]="true"
                            [feedback]="false"
                            styleClass="spa-password-input"
                            inputStyleClass="spa-input-pass"
                            [style]="{'width':'100%'}"
                        />
                    </div>

                    <div class="spa-field">
                        <label>¿Qué tipo de cuenta deseas?</label>
                        <div class="spa-role-selector">
                            <div class="spa-role-option" [class.active]="rol === 'CLIENTE'" (click)="rol = 'CLIENTE'">
                                <i class="pi pi-user role-icon"></i>
                                <span>Cliente</span>
                            </div>
                            <div class="spa-role-option" [class.active]="rol === 'ADMIN'" (click)="rol = 'ADMIN'">
                                <i class="pi pi-cog role-icon"></i>
                                <span>Administrador</span>
                            </div>
                        </div>
                    </div>

                    <p-button
                        id="btn-registro"
                        label="{{ cargando() ? 'Creando cuenta...' : 'Registrarme' }}"
                        styleClass="spa-btn-primary"
                        [disabled]="cargando()"
                        (onClick)="onRegistrar()"
                    >
                        <ng-template pTemplate="icon">
                            <i class="pi pi-user-plus mr-2" *ngIf="!cargando()"></i>
                            <i class="pi pi-spin pi-spinner mr-2" *ngIf="cargando()"></i>
                        </ng-template>
                    </p-button>

                    <div class="spa-login-links">
                        <span class="spa-hint">¿Ya tienes cuenta?</span>
                        <a routerLink="/auth/login" class="spa-link">Iniciar sesión</a>
                    </div>
                </div>
            </div>
        </div>

        <p-dialog 
            header="Datos Personales del Cliente" 
            [(visible)]="mostrarDialogCliente" 
            [modal]="true" 
            [closable]="false"
            [style]="{ width: '450px' }"
            styleClass="p-fluid"
        >
            <ng-template pTemplate="content">
                <p class="mb-4">Para terminar tu registro como cliente, por favor completa tus datos personales:</p>
                <div class="field mb-4">
                    <label for="ci" class="font-bold block mb-2">Cédula de Identidad (CI)</label>
                    <input id="ci" pInputText [(ngModel)]="ci" placeholder="Ej: 1234567" />
                </div>
                <div class="field mb-4">
                    <label for="nombreC" class="font-bold block mb-2">Nombre Completo</label>
                    <input id="nombreC" pInputText [(ngModel)]="nombreCompleto" placeholder="Tu nombre y apellidos" />
                </div>
                <div class="field mb-4">
                    <label for="tel" class="font-bold block mb-2">Teléfono</label>
                    <input id="tel" pInputText [(ngModel)]="telefono" placeholder="Ej: 77889900" />
                </div>
            </ng-template>

            <ng-template pTemplate="footer">
                <p-button 
                    label="Finalizar Registro" 
                    icon="pi pi-check" 
                    (onClick)="finalizarRegistroCliente()" 
                    [disabled]="!ci || !nombreCompleto"
                    styleClass="spa-btn-primary"
                />
            </ng-template>
        </p-dialog>
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
        .spa-role-selector {
            display: flex;
            gap: 1rem;
            margin-top: 0.5rem;
        }
        .spa-role-option {
            flex: 1;
            padding: 1rem;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
            cursor: pointer;
            transition: all 0.2s;
            background: #fff;
        }
        .spa-role-option:hover {
            border-color: var(--spa-primario);
            background: rgba(32, 178, 170, 0.05);
        }
        .spa-role-option.active {
            border-color: var(--spa-primario);
            background: rgba(32, 178, 170, 0.1);
            color: var(--spa-primario);
        }
        .role-icon { font-size: 1.5rem; }
        .spa-role-option span {
            font-size: 0.9rem;
            font-weight: 700;
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
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 0.5rem;
            margin-top: 2rem;
        }
        .spa-hint {
            font-size: 0.95rem;
            color: #64748b;
        }
        .spa-link {
            color: var(--spa-primario);
            font-weight: 700;
            text-decoration: none;
            font-size: 0.95rem;
            transition: opacity 0.2s;
        }
        .spa-link:hover { opacity: 0.8; }

        /* Animations */
        .animate-fade-in { animation: fadeIn 0.6s ease-out; }
        .animate-slide-up { animation: slideUp 0.6s ease-out both; }
        .animate-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
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
export class Registro {
    private authService = inject(AuthService);
    private clienteService = inject(ClienteService);
    private router = inject(Router);

    email = '';
    contrasenia = '';
    confirmarContrasenia = '';
    rol = 'CLIENTE';

    // Datos del cliente
    mostrarDialogCliente = false;
    ci = '';
    nombreCompleto = '';
    telefono = '';

    cargando = signal(false);
    errorMensaje = signal('');

    tieneLongitud = () => this.contrasenia.length >= 8;
    tieneMayuscula = () => /[A-Z]/.test(this.contrasenia);
    tieneMinuscula = () => /[a-z]/.test(this.contrasenia);
    tieneNumero = () => /\d/.test(this.contrasenia);
    tieneSimbolo = () => /[!@#$%^&*(),.?":{}|<>\-_+/=~`]/.test(this.contrasenia);

    esPasswordValido = () => {
        return this.tieneLongitud() && this.tieneMayuscula() && this.tieneMinuscula() && this.tieneNumero() && this.tieneSimbolo();
    }

    onRegistrar() {
        if (!this.email || !this.contrasenia || !this.confirmarContrasenia) {
            this.errorMensaje.set('Todos los campos son obligatorios');
            return;
        }

        if (this.contrasenia !== this.confirmarContrasenia) {
            this.errorMensaje.set('Las contraseñas no coinciden');
            return;
        }

        if (this.contrasenia.length < 8) {
            this.errorMensaje.set('La contraseña debe tener al menos 8 caracteres');
            return;
        }

        if (!this.esPasswordValido()) {
            this.errorMensaje.set('La contraseña no cumple con los requisitos de complejidad');
            return;
        }

        this.cargando.set(true);
        this.errorMensaje.set('');

        this.authService.registro({ 
            email: this.email, 
            contrasenia: this.contrasenia,
            rol: this.rol 
        }).subscribe({
            next: (respuesta) => {
                this.authService.guardarSesion(respuesta.token, respuesta.rol);
                
                if (this.rol === 'CLIENTE') {
                    this.cargando.set(false);
                    this.mostrarDialogCliente = true;
                } else {
                    this.router.navigate(['/']);
                }
            },
            error: (err) => {
                this.errorMensaje.set(err.error?.error || 'Error al registrarse');
                this.cargando.set(false);
            },
        });
    }

    finalizarRegistroCliente() {
        this.cargando.set(true);
        this.clienteService.guardar({
            ci: this.ci,
            nombre: this.nombreCompleto,
            telefono: this.telefono,
            activo: true,
            email: this.email
        }).subscribe({
            next: () => {
                this.router.navigate(['/']);
            },
            error: (err) => {
                this.errorMensaje.set('Cuenta creada, pero hubo un error al guardar tus datos personales. Puedes completarlos luego.');
                this.router.navigate(['/']);
            }
        });
    }
}

import { Component, signal, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { CommonModule } from '@angular/common';
import { AuthService } from '@/app/core/services/auth.service';

@Component({
    selector: 'app-cambiar-contrasenia-inicial',
    standalone: true,
    imports: [ButtonModule, PasswordModule, FormsModule, CommonModule],
    template: `
        <div class="spa-auth-wrapper">
            <div class="spa-center-card animate-fade-in">
                <div class="spa-icon-badge">
                    <i class="pi pi-lock"></i>
                </div>
                <h2>Cambia tu contraseña</h2>
                <p class="spa-subtitle">
                    Es tu primer acceso. Debes establecer una contraseña nueva antes de continuar.
                </p>

                @if (errorMensaje()) {
                    <div class="spa-alert spa-alert-error animate-shake">
                        <i class="pi pi-exclamation-circle"></i>
                        {{ errorMensaje() }}
                    </div>
                }

                @if (exito()) {
                    <div class="spa-alert spa-alert-success">
                        <i class="pi pi-check-circle"></i>
                        Contraseña actualizada. Redirigiendo...
                    </div>
                }

                <div class="spa-field">
                    <label>Nueva contraseña</label>
                    <p-password
                        [(ngModel)]="nuevaContrasenia"
                        placeholder="Nueva contraseña"
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
                                    Sugerencia: Usa frases de 3 o 4 palabras para mayor seguridad.
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
                                        <i class="pi" [ngClass]="tieneSimbolo() ? 'pi-check-circle' : 'pi-circle'"></i> Al menos un símbolo
                                    </li>
                                </ul>
                            </div>
                        </ng-template>
                    </p-password>
                </div>

                <div class="spa-field">
                    <label>Confirmar contraseña</label>
                    <p-password
                        [(ngModel)]="confirmarContrasenia"
                        placeholder="Repite la contraseña"
                        [toggleMask]="true"
                        [feedback]="false"
                        styleClass="spa-password-input"
                        inputStyleClass="spa-input-pass"
                        [style]="{'width':'100%'}"
                    />
                </div>

                <p-button
                    label="{{ cargando() ? 'Guardando...' : 'Establecer contraseña' }}"
                    styleClass="spa-btn-primary"
                    [disabled]="cargando() || exito()"
                    (onClick)="onCambiar()"
                >
                    <ng-template pTemplate="icon">
                        <i class="pi pi-check mr-2" *ngIf="!cargando()"></i>
                        <i class="pi pi-spin pi-spinner mr-2" *ngIf="cargando()"></i>
                    </ng-template>
                </p-button>
            </div>
        </div>
    `,
    styles: [`
        .spa-auth-wrapper {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--spa-capa1, #E0F2FE);
            font-family: var(--spa-fuente, 'Urbanist', sans-serif);
        }
        .spa-center-card {
            background: #fff;
            border-radius: 20px;
            padding: 3rem;
            width: 100%;
            max-width: 440px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.08);
        }
        .spa-icon-badge {
            width: 60px;
            height: 60px;
            background: var(--spa-capa1, #E0F2FE);
            color: var(--spa-primario, #20B2AA);
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
        }
        h2 {
            font-size: 1.8rem;
            font-weight: 800;
            color: var(--spa-texto, #083344);
            margin: 0 0 0.5rem;
        }
        .spa-subtitle {
            color: #64748b;
            font-size: 0.95rem;
            margin-bottom: 2rem;
            line-height: 1.5;
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
        .spa-alert-success { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
        .spa-field {
            margin-bottom: 1.5rem;
        }
        .spa-field label {
            display: block;
            font-size: 0.85rem;
            font-weight: 700;
            color: var(--spa-texto, #083344);
            margin-bottom: 0.5rem;
            text-transform: uppercase;
            letter-spacing: 0.025em;
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
            background: var(--spa-primario, #20B2AA) !important;
            border: none !important;
            border-radius: 12px !important;
            font-weight: 700 !important;
            font-size: 1rem !important;
            box-shadow: 0 4px 12px rgba(32,178,170,0.2) !important;
            transition: all 0.3s !important;
        }
        :host ::ng-deep .spa-btn-primary:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(32,178,170,0.3) !important;
        }
        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
        .animate-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shake {
            10%, 90% { transform: translate3d(-1px, 0, 0); }
            20%, 80% { transform: translate3d(2px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
            40%, 60% { transform: translate3d(4px, 0, 0); }
        }
    `]
})
export class CambiarContraseniaInicial implements OnInit {
    private authService = inject(AuthService);
    private router = inject(Router);

    email = '';
    nuevaContrasenia = '';
    confirmarContrasenia = '';

    cargando = signal(false);
    errorMensaje = signal('');
    exito = signal(false);

    tieneLongitud = () => this.nuevaContrasenia.length >= 8;
    tieneMayuscula = () => /[A-Z]/.test(this.nuevaContrasenia);
    tieneMinuscula = () => /[a-z]/.test(this.nuevaContrasenia);
    tieneNumero = () => /\d/.test(this.nuevaContrasenia);
    tieneSimbolo = () => /[!@#$%^&*(),.?":{}|<>\-_+/=~`]/.test(this.nuevaContrasenia);

    esPasswordValido = () => {
        return this.tieneLongitud() && this.tieneMayuscula() && this.tieneMinuscula() && this.tieneNumero() && this.tieneSimbolo();
    }

    ngOnInit() {
        // En Angular, durante ngOnInit el navigation ya terminó, 
        // por lo que usamos history.state para recuperar los datos enviados
        this.email = history.state?.email ?? '';

        if (!this.email) {
            // Si llega sin email (acceso directo a la URL), volver al login
            this.router.navigate(['/auth/login']);
        }
    }

    onCambiar() {
        this.errorMensaje.set('');

        if (!this.nuevaContrasenia || !this.confirmarContrasenia) {
            this.errorMensaje.set('Por favor completa ambos campos');
            return;
        }

        if (this.nuevaContrasenia !== this.confirmarContrasenia) {
            this.errorMensaje.set('Las contraseñas no coinciden');
            return;
        }

        if (!this.esPasswordValido()) {
            this.errorMensaje.set('La contraseña no cumple con los requisitos de complejidad');
            return;
        }

        this.cargando.set(true);

        this.authService.cambiarContraseniaInicial(this.email, this.nuevaContrasenia).subscribe({
            next: () => {
                this.exito.set(true);
                this.cargando.set(false);
                setTimeout(() => this.router.navigate(['/']), 1500);
            },
            error: (err) => {
                this.errorMensaje.set(err.error?.error || 'Error al cambiar la contraseña');
                this.cargando.set(false);
            }
        });
    }
}

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Empleado, EmpleadoService } from '@/app/core/services/empleado.service';
import { Rol, RolService } from '@/app/core/services/rol.service';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
    selector: 'app-empleados',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, DialogModule, ToolbarModule, ToastModule, SelectModule, ToggleButtonModule, ProgressSpinnerModule],
    providers: [MessageService],
    template: `
        <div class="card">
            <p-toast />
            <p-toolbar styleClass="mb-4 gap-2">
                <ng-template pTemplate="left">
                    <p-button label="Nuevo Empleado" icon="pi pi-plus" severity="success" class="mr-2" (onClick)="openNew()" />
                </ng-template>
                <ng-template pTemplate="right">
                    <div class="flex align-items-center gap-2">
                        <span class="font-bold">Mostrar Inactivos</span>
                        <p-toggleButton [(ngModel)]="mostrarInactivos" onLabel="Sí" offLabel="No" (onChange)="loadEmpleados()" />
                    </div>
                </ng-template>
            </p-toolbar>

            <div class="flex gap-2 mb-4">
                <p-button [severity]="currentTab() === 'RECEPCIONISTA' ? 'primary' : 'secondary'" label="Recepcionistas" (onClick)="currentTab.set('RECEPCIONISTA')" />
                <p-button [severity]="currentTab() === 'GROOMER' ? 'primary' : 'secondary'" label="Groomers" (onClick)="currentTab.set('GROOMER')" />
            </div>

            <p-table #dt [value]="filteredEmpleados()" [rows]="10" [paginator]="true" [responsiveLayout]="'scroll'"
                     [globalFilterFields]="['nombre', 'email']" [rowHover]="true" dataKey="id">
                <ng-template pTemplate="caption">
                    <div class="flex align-items-center justify-content-between">
                        <h5 class="m-0">Gestión de {{ currentTab() === 'RECEPCIONISTA' ? 'Recepcionistas' : 'Groomers' }}</h5>
                        <span class="p-input-icon-left">
                            <i class="pi pi-search"></i>
                            <input pInputText type="text" placeholder="Buscar..." (input)="dt.filterGlobal($any($event.target).value, 'contains')" />
                        </span>
                    </div>
                </ng-template>
                <ng-template pTemplate="header">
                    <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-empleado>
                    <tr>
                        <td>{{ empleado.nombre }}</td>
                        <td>{{ empleado.usuario?.email || empleado.email }}</td>
                        <td>
                            <span [class]="'customer-badge status-' + (empleado.activo ? 'qualified' : 'unqualified')">
                                {{ empleado.activo ? 'ACTIVO' : 'INACTIVO' }}
                            </span>
                        </td>
                        <td>
                            <p-button icon="pi pi-pencil" [rounded]="true" severity="success" class="mr-2" (onClick)="editEmpleado(empleado)" pTooltip="Editar" />
                            @if (empleado.activo) {
                                <p-button icon="pi pi-key" [rounded]="true" severity="warn" class="mr-2" (onClick)="resetPassword(empleado)" pTooltip="Resetear Contraseña" />
                                <p-button icon="pi pi-trash" [rounded]="true" severity="danger" (onClick)="deleteEmpleado(empleado)" pTooltip="Desactivar" />
                            } @else {
                                <p-button icon="pi pi-refresh" [rounded]="true" severity="info" (onClick)="reactivarEmpleado(empleado)" pTooltip="Reactivar" />
                            }
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>

        <p-dialog [visible]="empleadoDialog()" (visibleChange)="empleadoDialog.set($event)" [style]="{ width: '450px' }" header="Detalles del Empleado" [modal]="true" styleClass="p-fluid">
            <ng-template pTemplate="content">
                <div class="field">
                    <label for="nombre">Nombre</label>
                    <input type="text" pInputText id="nombre" [(ngModel)]="empleado.nombre" required autofocus />
                </div>
                <div class="field">
                    <label for="email">Email (Usuario)</label>
                    <input type="email" pInputText id="email" [(ngModel)]="empleado.email" required />
                </div>
                <div class="field">
                    <label for="rol">Rol (Puesto)</label>
                    <p-select [options]="rolesList()" [(ngModel)]="empleado.rol" optionLabel="nombre" optionValue="nombre" placeholder="Seleccione un rol" appendTo="body" styleClass="w-full"></p-select>
                </div>
            </ng-template>

            <ng-template pTemplate="footer">
                <p-button label="Cancelar" icon="pi pi-times" [text]="true" (onClick)="hideDialog()" />
                <p-button label="Guardar" icon="pi pi-check" [text]="true" (onClick)="saveEmpleado()" />
            </ng-template>
        </p-dialog>

        <!-- Diálogo de carga (Spinner) -->
        <p-dialog [visible]="cargando()" [modal]="true" [closable]="false" [showHeader]="false" [style]="{ width: '200px' }">
            <div class="flex flex-column align-items-center justify-content-center p-4">
                <p-progressSpinner styleClass="w-4rem h-4rem" strokeWidth="4" />
                <span class="mt-3 font-bold">Procesando...</span>
            </div>
        </p-dialog>
    `
})
export class Empleados implements OnInit {
    private empleadoService = inject(EmpleadoService);
    private rolService = inject(RolService);
    private messageService = inject(MessageService);

    empleados = signal<Empleado[]>([]);
    rolesList = signal<Rol[]>([]);
    currentTab = signal<'RECEPCIONISTA' | 'GROOMER'>('RECEPCIONISTA');
    mostrarInactivos = false;
    cargando = signal(false);

    empleado: Empleado = { nombre: '', rol: '', activo: true };
    empleadoDialog = signal(false);

    ngOnInit() {
        this.loadEmpleados();
        this.loadRoles();
    }

    loadRoles() {
        this.rolService.listar().subscribe({
            next: (data) => {
                // Filtrar solo los roles que nos interesan para empleados o mostrar todos
                const rolesFiltrados = data.filter(r => r.nombre === 'RECEPCIONISTA' || r.nombre === 'GROOMER');
                this.rolesList.set(rolesFiltrados);
            },
            error: (err) => console.error(err)
        });
    }

    filteredEmpleados() {
        return this.empleados().filter(emp => {
            const roleName = emp.usuario?.roles?.[0]?.nombre;
            return roleName === this.currentTab();
        });
    }

    loadEmpleados() {
        this.empleadoService.listar(this.mostrarInactivos).subscribe({
            next: (data) => {
                console.log('Empleados cargados con éxito:', data);
                this.empleados.set(data);
            },
            error: (err) => {
                console.error('Error al cargar empleados:', err);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los empleados' });
            }
        });
    }

    openNew() {
        this.empleado = { nombre: '', rol: this.currentTab(), activo: true, email: '' };
        this.empleadoDialog.set(true);
    }

    editEmpleado(empleado: Empleado) {
        const roleName = empleado.usuario?.roles?.[0]?.nombre || '';
        this.empleado = { ...empleado, email: empleado.usuario?.email, rol: roleName };
        this.empleadoDialog.set(true);
    }

    deleteEmpleado(empleado: Empleado) {
        if (confirm(`¿Eliminar a ${empleado.nombre}?`)) {
            this.empleadoService.eliminar(empleado.id!).subscribe(() => {
                this.loadEmpleados();
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Empleado eliminado' });
            });
        }
    }

    hideDialog() {
        this.empleadoDialog.set(false);
    }

    saveEmpleado() {
        if (this.empleado.nombre.trim()) {
            this.cargando.set(true);

            // Timeout de seguridad de 5 segundos
            const timeout = setTimeout(() => {
                if (this.cargando()) {
                    this.cargando.set(false);
                    this.messageService.add({ severity: 'warn', summary: 'Tiempo agotado', detail: 'La operación está tardando más de lo esperado' });
                }
            }, 10000);

            this.empleadoService.guardar(this.empleado).subscribe({
                next: () => {
                    clearTimeout(timeout);
                    this.loadEmpleados();
                    this.hideDialog();
                    this.cargando.set(false);
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Empleado guardado' });
                },
                error: () => {
                    clearTimeout(timeout);
                    this.cargando.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el empleado' });
                }
            });
        }
    }

    reactivarEmpleado(empleado: Empleado) {
        if (confirm(`¿Reactivar a ${empleado.nombre}?`)) {
            this.empleadoService.reactivar(empleado.id!).subscribe(() => {
                this.loadEmpleados();
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Empleado reactivado' });
            });
        }
    }

    resetPassword(empleado: Empleado) {
        if (confirm(`¿Resetear contraseña de ${empleado.nombre}? Se enviará una nueva al correo.`)) {
            this.empleadoService.resetPassword(empleado.id!).subscribe(() => {
                this.messageService.add({ severity: 'success', summary: 'Enviado', detail: 'Nueva contraseña enviada al email' });
            });
        }
    }
}

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

@Component({
    selector: 'app-empleados',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, DialogModule, ToolbarModule, ToastModule, SelectModule],
    providers: [MessageService],
    template: `
        <div class="card">
            <p-toast />
            <p-toolbar styleClass="mb-4 gap-2">
                <ng-template pTemplate="left">
                    <p-button label="Nuevo Empleado" icon="pi pi-plus" severity="success" class="mr-2" (onClick)="openNew()" />
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
                            <p-button icon="pi pi-pencil" [rounded]="true" severity="success" class="mr-2" (onClick)="editEmpleado(empleado)" />
                            <p-button icon="pi pi-trash" [rounded]="true" severity="danger" (onClick)="deleteEmpleado(empleado)" />
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
    `
})
export class Empleados implements OnInit {
    private empleadoService = inject(EmpleadoService);
    private rolService = inject(RolService);
    private messageService = inject(MessageService);

    empleados = signal<Empleado[]>([]);
    rolesList = signal<Rol[]>([]);
    currentTab = signal<'RECEPCIONISTA' | 'GROOMER'>('RECEPCIONISTA');
    
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
        this.empleadoService.listar().subscribe({
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
            this.empleadoService.guardar(this.empleado).subscribe(() => {
                this.loadEmpleados();
                this.hideDialog();
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Empleado guardado' });
            });
        }
    }
}

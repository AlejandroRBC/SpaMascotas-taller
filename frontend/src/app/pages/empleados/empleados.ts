import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Empleado, EmpleadoService } from '@/app/core/services/empleado.service';

@Component({
    selector: 'app-empleados',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, DialogModule, ToolbarModule, ToastModule],
    providers: [MessageService],
    template: `
        <div class="card">
            <p-toast />
            <p-toolbar styleClass="mb-4 gap-2">
                <ng-template pTemplate="left">
                    <p-button label="Nuevo Empleado" icon="pi pi-plus" severity="success" class="mr-2" (onClick)="openNew()" />
                </ng-template>
            </p-toolbar>

            <p-table [value]="empleados" [rows]="10" [paginator]="true" [responsiveLayout]="'scroll'"
                     [globalFilterFields]="['nombre', 'puesto']" [rowHover]="true" dataKey="id">
                <ng-template pTemplate="caption">
                    <div class="flex align-items-center justify-content-between">
                        <h5 class="m-0">Gestión de Empleados</h5>
                        <span class="p-input-icon-left">
                            <i class="pi pi-search"></i>
                            <input pInputText type="text" placeholder="Buscar..." />
                        </span>
                    </div>
                </ng-template>
                <ng-template pTemplate="header">
                    <tr>
                        <th>Nombre</th>
                        <th>Puesto</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-empleado>
                    <tr>
                        <td>{{ empleado.nombre }}</td>
                        <td>{{ empleado.puesto }}</td>
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

        <p-dialog [(visible)]="empleadoDialog" [style]="{ width: '450px' }" header="Detalles del Empleado" [modal]="true" styleClass="p-fluid">
            <ng-template pTemplate="content">
                <div class="field">
                    <label for="nombre">Nombre</label>
                    <input type="text" pInputText id="nombre" [(ngModel)]="empleado.nombre" required autofocus />
                </div>
                <div class="field">
                    <label for="puesto">Puesto</label>
                    <input type="text" pInputText id="puesto" [(ngModel)]="empleado.puesto" required />
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
    private messageService = inject(MessageService);

    empleados: Empleado[] = [];
    empleado: Empleado = { nombre: '', puesto: '', activo: true };
    empleadoDialog: boolean = false;

    ngOnInit() {
        this.loadEmpleados();
    }

    loadEmpleados() {
        this.empleadoService.listar().subscribe(data => this.empleados = data);
    }

    openNew() {
        this.empleado = { nombre: '', puesto: '', activo: true };
        this.empleadoDialog = true;
    }

    editEmpleado(empleado: Empleado) {
        this.empleado = { ...empleado };
        this.empleadoDialog = true;
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
        this.empleadoDialog = false;
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

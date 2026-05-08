import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Cliente, ClienteService } from '@/app/core/services/cliente.service';

@Component({
    selector: 'app-clientes',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, DialogModule, ToolbarModule, ToastModule],
    providers: [MessageService],
    template: `
        <div class="card">
            <p-toast />
            <p-toolbar styleClass="mb-4 gap-2">
                <ng-template pTemplate="left">
                    <p-button label="Nuevo Cliente" icon="pi pi-plus" severity="success" class="mr-2" (onClick)="openNew()" />
                </ng-template>
            </p-toolbar>

            <p-table #dt [value]="clientes()" [rows]="10" [paginator]="true" [responsiveLayout]="'scroll'"
                     [globalFilterFields]="['nombre', 'ci', 'email']" [rowHover]="true" dataKey="id">
                <ng-template pTemplate="caption">
                    <div class="flex align-items-center justify-content-between">
                        <h5 class="m-0">Gestión de Clientes</h5>
                        <span class="p-input-icon-left">
                            <i class="pi pi-search"></i>
                            <input pInputText type="text" placeholder="Buscar..." (input)="dt.filterGlobal($any($event.target).value, 'contains')" />
                        </span>
                    </div>
                </ng-template>
                <ng-template pTemplate="header">
                    <tr>
                        <th>CI</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-cliente>
                    <tr>
                        <td>{{ cliente.ci }}</td>
                        <td>{{ cliente.nombre }}</td>
                        <td>{{ cliente.usuario?.email || cliente.email }}</td>
                        <td>{{ cliente.telefono }}</td>
                        <td>
                            <span [class]="'customer-badge status-' + (cliente.activo ? 'qualified' : 'unqualified')">
                                {{ cliente.activo ? 'ACTIVO' : 'INACTIVO' }}
                            </span>
                        </td>
                        <td>
                            <p-button icon="pi pi-pencil" [rounded]="true" severity="success" class="mr-2" (onClick)="editCliente(cliente)" />
                            <p-button icon="pi pi-trash" [rounded]="true" severity="danger" (onClick)="deleteCliente(cliente)" />
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>

        <p-dialog [visible]="clienteDialog()" (visibleChange)="clienteDialog.set($event)" [style]="{ width: '450px' }" header="Detalles del Cliente" [modal]="true" styleClass="p-fluid">
            <ng-template pTemplate="content">
                <div class="field">
                    <label for="ci">CI</label>
                    <input type="text" pInputText id="ci" [(ngModel)]="cliente.ci" required autofocus />
                </div>
                <div class="field">
                    <label for="nombre">Nombre</label>
                    <input type="text" pInputText id="nombre" [(ngModel)]="cliente.nombre" required />
                </div>
                <div class="field">
                    <label for="email">Email</label>
                    <input type="email" pInputText id="email" [(ngModel)]="cliente.email" required />
                </div>
                <div class="field">
                    <label for="telefono">Teléfono</label>
                    <input type="text" pInputText id="telefono" [(ngModel)]="cliente.telefono" />
                </div>
            </ng-template>

            <ng-template pTemplate="footer">
                <p-button label="Cancelar" icon="pi pi-times" [text]="true" (onClick)="hideDialog()" />
                <p-button label="Guardar" icon="pi pi-check" [text]="true" (onClick)="saveCliente()" />
            </ng-template>
        </p-dialog>
    `
})
export class Clientes implements OnInit {
    private clienteService = inject(ClienteService);
    private messageService = inject(MessageService);

    clientes = signal<Cliente[]>([]);
    cliente: Cliente = { ci: '', nombre: '', telefono: '', activo: true, email: '' };
    clienteDialog = signal(false);

    ngOnInit() {
        this.loadClientes();
    }

    loadClientes() {
        this.clienteService.listar().subscribe({
            next: (data) => {
                this.clientes.set(data);
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los clientes' });
            }
        });
    }

    openNew() {
        this.cliente = { ci: '', nombre: '', telefono: '', activo: true, email: '' };
        this.clienteDialog.set(true);
    }

    editCliente(cliente: Cliente) {
        this.cliente = { ...cliente, email: cliente.usuario?.email };
        this.clienteDialog.set(true);
    }

    deleteCliente(cliente: Cliente) {
        if (confirm(`¿Eliminar al cliente ${cliente.nombre}?`)) {
            this.clienteService.eliminar(cliente.id!).subscribe(() => {
                this.loadClientes();
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente eliminado' });
            });
        }
    }

    hideDialog() {
        this.clienteDialog.set(false);
    }

    saveCliente() {
        if (this.cliente.ci.trim() && this.cliente.nombre.trim()) {
            this.clienteService.guardar(this.cliente).subscribe(() => {
                this.loadClientes();
                this.hideDialog();
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente guardado' });
            });
        }
    }
}

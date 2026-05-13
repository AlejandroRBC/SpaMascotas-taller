import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SystemLog, LogService } from '@/app/core/services/log.service';

@Component({
    selector: 'app-logs',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, InputTextModule, ButtonModule],
    template: `
        <div class="card">
            <p-table #dtLogs [value]="logs()" [rows]="10" [paginator]="true" [responsiveLayout]="'scroll'"
                     [globalFilterFields]="['usuarioInfo', 'accion', 'ipAddress']" [rowHover]="true" dataKey="id">
                <ng-template pTemplate="caption">
                    <div class="flex align-items-center justify-content-between">
                        <h5 class="m-0">Registro de Eventos del Sistema (Logs)</h5>
                        <span class="p-input-icon-left">
                            <i class="pi pi-search"></i>
                            <input pInputText type="text" placeholder="Buscar en logs..." (input)="dtLogs.filterGlobal($any($event.target).value, 'contains')" />
                        </span>
                    </div>
                </ng-template>
                <ng-template pTemplate="header">
                    <tr>
                        <th>Fecha y Hora</th>
                        <th>Usuario (ID - Rol)</th>
                        <th>Acción</th>
                        <th>IP Address</th>
                        <th>Navegador</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-log>
                    <tr>
                        <td>{{ log.fechaHora | date:'medium' }}</td>
                        <td>{{ log.usuarioInfo }}</td>
                        <td><span class="font-bold text-primary">{{ log.accion }}</span></td>
                        <td>{{ log.ipAddress }}</td>
                        <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" [title]="log.userAgent">
                            {{ log.userAgent }}
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `
})
export class Logs implements OnInit {
    private logService = inject(LogService);
    logs = signal<SystemLog[]>([]);

    ngOnInit() {
        this.loadLogs();
    }

    loadLogs() {
        this.logService.listar().subscribe({
            next: (data) => {
                this.logs.set(data);
            },
            error: (err) => console.error('Error al cargar logs:', err)
        });
    }
}

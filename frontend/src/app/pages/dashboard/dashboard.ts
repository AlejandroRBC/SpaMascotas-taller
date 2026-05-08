import { Component, OnInit } from '@angular/core';
import { NotificationsWidget } from './components/notificationswidget';
import { StatsWidget } from './components/statswidget';
import { RecentSalesWidget } from './components/recentsaleswidget';
import { BestSellingWidget } from './components/bestsellingwidget';
import { RevenueStreamWidget } from './components/revenuestreamwidget';

import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { AuthService } from '@/app/core/services/auth.service';
import { TimelineModule } from 'primeng/timeline';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, StatsWidget, RecentSalesWidget, BestSellingWidget, RevenueStreamWidget, NotificationsWidget, TimelineModule, CardModule, ButtonModule, TableModule],
    template: `
        <div class="grid grid-cols-12 gap-8" *ngIf="rol === 'ADMIN'">
            <app-stats-widget class="contents" />
            <div class="col-span-12 xl:col-span-6">
                <app-recent-sales-widget />
                <app-best-selling-widget />
            </div>
            <div class="col-span-12 xl:col-span-6">
                <app-revenue-stream-widget />
                <app-notifications-widget />
            </div>
        </div>

        <div class="card p-8 text-center animate-fade-in" *ngIf="rol === 'CLIENTE'">
            <div class="flex flex-col align-items-center gap-4">
                <div class="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="pi pi-heart text-primary-500 text-4xl"></i>
                </div>
                <h1 class="text-4xl font-bold text-900 mb-2">¡Bienvenido a Spa Mascotas!</h1>
                <p class="text-xl text-600 max-w-2xl mx-auto">
                    Estamos felices de tenerte aquí. Muy pronto podrás ver el historial de tus mascotas, 
                    hacer nuevas reservas y mucho más desde este panel.
                </p>
                <div class="mt-6 flex justify-center gap-4">
                    <button pButton label="Mis Mascotas" icon="pi pi-list" class="p-button-outlined"></button>
                    <button pButton label="Nueva Reserva" icon="pi pi-calendar-plus"></button>
                </div>
            </div>
        </div>

        <!-- Vista Groomer -->
        <div class="grid grid-cols-12 gap-8" *ngIf="rol === 'GROOMER'">
            <div class="col-span-12">
                <div class="card mb-4 p-6 bg-primary-50 border-none">
                    <h1 class="text-3xl font-bold text-primary-900 m-0">Bienvenido {{ rol }}</h1>
                    <p class="text-primary-700 mt-2">Aquí tienes el seguimiento de tus tareas del día.</p>
                </div>
                
                <div class="card">
                    <div class="font-semibold text-xl mb-4">Timeline de Tareas</div>
                    <p-timeline [value]="groomerEvents" align="alternate">
                        <ng-template #marker let-event>
                            <span class="flex w-8 h-8 items-center justify-center text-white rounded-full z-10 shadow-sm" [style]="{ 'background-color': event.color }">
                                <i [class]="event.icon"></i>
                            </span>
                        </ng-template>
                        <ng-template #content let-event>
                            <p-card [header]="event.status" [subheader]="event.date">
                                <p>{{ event.description }}</p>
                                <p-button label="Detalles" [text]="true" />
                            </p-card>
                        </ng-template>
                    </p-timeline>
                </div>
            </div>
        </div>

        <!-- Vista Recepcionista -->
        <div class="grid grid-cols-12 gap-8" *ngIf="rol === 'RECEPCIONISTA'">
            <div class="col-span-12">
                <div class="card mb-4 p-6 bg-indigo-50 border-none">
                    <h1 class="text-3xl font-bold text-indigo-900 m-0">Bienvenido {{ rol }}</h1>
                    <p class="text-indigo-700 mt-2">Gestiona las citas y el calendario de hoy.</p>
                </div>

                <div class="card">
                    <div class="font-semibold text-xl mb-4">Calendario de Citas</div>
                    <p-table [value]="calendarData" [tableStyle]="{ 'min-width': '50rem' }">
                        <ng-template #header>
                            <tr>
                                <th>Hora</th>
                                <th>Lunes</th>
                                <th>Martes</th>
                                <th>Miércoles</th>
                                <th>Jueves</th>
                                <th>Viernes</th>
                            </tr>
                        </ng-template>
                        <ng-template #body let-row>
                            <tr>
                                <td class="font-bold">{{ row.hour }}</td>
                                <td>{{ row.mon }}</td>
                                <td>{{ row.tue }}</td>
                                <td>{{ row.wed }}</td>
                                <td>{{ row.thu }}</td>
                                <td>{{ row.fri }}</td>
                            </tr>
                        </ng-template>
                    </p-table>
                </div>
            </div>
        </div>
    `
})
export class Dashboard implements OnInit {
    private authService = inject(AuthService);
    rol = this.authService.obtenerRol();

    groomerEvents: any[] = [];
    calendarData: any[] = [];

    ngOnInit() {
        this.groomerEvents = [
            {
                status: 'Recepción Mascota',
                date: '08:00 AM',
                icon: 'pi pi-sign-in',
                color: '#9C27B0',
                description: 'Recibir a "Punky" para su sesión de baño.'
            },
            {
                status: 'Corte de Pelo',
                date: '10:30 AM',
                icon: 'pi pi-palette',
                color: '#673AB7',
                description: 'Corte tipo león para el caniche "Coco".'
            },
            {
                status: 'Secado y Peinado',
                date: '12:00 PM',
                icon: 'pi pi-sun',
                color: '#FF9800',
                description: 'Finalizar estética de "Luna".'
            },
            {
                status: 'Entrega a Dueño',
                date: '02:00 PM',
                icon: 'pi pi-check',
                color: '#607D8B',
                description: 'Verificar que el cliente esté satisfecho.'
            }
        ];

        this.calendarData = [
            { hour: '09:00', mon: 'Cita: Firulais', tue: '-', wed: 'Cita: Toby', thu: '-', fri: 'Cita: Max' },
            { hour: '10:00', mon: '-', tue: 'Cita: Bella', wed: '-', thu: 'Cita: Rocky', fri: '-' },
            { hour: '11:00', mon: 'Cita: Luna', tue: '-', wed: 'Cita: Milo', thu: '-', fri: 'Cita: Daisy' },
            { hour: '12:00', mon: '-', tue: 'Cita: Simba', wed: '-', thu: 'Cita: Chloe', fri: '-' }
        ];
    }
}

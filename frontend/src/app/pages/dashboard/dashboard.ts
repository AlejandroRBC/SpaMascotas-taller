import { Component } from '@angular/core';
import { NotificationsWidget } from './components/notificationswidget';
import { StatsWidget } from './components/statswidget';
import { RecentSalesWidget } from './components/recentsaleswidget';
import { BestSellingWidget } from './components/bestsellingwidget';
import { RevenueStreamWidget } from './components/revenuestreamwidget';

import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { AuthService } from '@/app/core/services/auth.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, StatsWidget, RecentSalesWidget, BestSellingWidget, RevenueStreamWidget, NotificationsWidget],
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
    `
})
export class Dashboard {
    private authService = inject(AuthService);
    rol = this.authService.obtenerRol();
}

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { AuthService } from '@/app/core/services/auth.service';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        @for (item of model; track item.label) {
            @if (!item.separator) {
                <li app-menuitem [item]="item" [root]="true"></li>
            } @else {
                <li class="menu-separator"></li>
            }
        }
    </ul> `,
})
export class AppMenu implements OnInit {
    private authService = inject(AuthService);
    model: MenuItem[] = [];
    userRol: string | null = null;

    ngOnInit() {
        this.userRol = this.authService.obtenerRol();
        
        this.model = [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
            }
        ];

        // Solo Administradores ven la sección de Administración
        if (this.userRol === 'ADMIN') {
            this.model.push({
                label: 'Administración',
                items: [
                    { label: 'Empleados', icon: 'pi pi-fw pi-users', routerLink: ['/empleados'] },
                    { label: 'Clientes', icon: 'pi pi-fw pi-user-plus', routerLink: ['/clientes'] },
                    { label: 'Logs del Sistema', icon: 'pi pi-fw pi-server', routerLink: ['/logs'] }
                ]
            });
        }

        // Si es CLIENTE, tal vez solo mostrar ciertas opciones o una simplificada
        if (this.userRol === 'CLIENTE') {
            // De momento solo el dashboard, pero podríamos añadir "Mis Mascotas", etc.
        }

        // Solo Administradores ven componentes de UI y Layout (opcional, para desarrollo)
        if (this.userRol === 'ADMIN') {
            this.model.push(
                {
                    label: 'UI Components',
                    items: [
                        { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
                        { label: 'Input', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/input'] },
                        { label: 'Button', icon: 'pi pi-fw pi-mobile', class: 'rotated-icon', routerLink: ['/uikit/button'] },
                        { label: 'Table', icon: 'pi pi-fw pi-table', routerLink: ['/uikit/table'] },
                        { label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/uikit/list'] },
                        { label: 'Tree', icon: 'pi pi-fw pi-share-alt', routerLink: ['/uikit/tree'] },
                        { label: 'Panel', icon: 'pi pi-fw pi-tablet', routerLink: ['/uikit/panel'] },
                        { label: 'Overlay', icon: 'pi pi-fw pi-clone', routerLink: ['/uikit/overlay'] },
                        { label: 'Media', icon: 'pi pi-fw pi-image', routerLink: ['/uikit/media'] },
                        { label: 'Menu', icon: 'pi pi-fw pi-bars', routerLink: ['/uikit/menu'] },
                        { label: 'Message', icon: 'pi pi-fw pi-comment', routerLink: ['/uikit/message'] },
                        { label: 'File', icon: 'pi pi-fw pi-file', routerLink: ['/uikit/file'] },
                        { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/charts'] },
                        { label: 'Timeline', icon: 'pi pi-fw pi-calendar', routerLink: ['/uikit/timeline'] },
                        { label: 'Misc', icon: 'pi pi-fw pi-circle', routerLink: ['/uikit/misc'] }
                    ]
                },
                {
                    label: 'Pages',
                    icon: 'pi pi-fw pi-briefcase',
                    path: '/pages',
                    items: [
                        { label: 'Landing', icon: 'pi pi-fw pi-globe', routerLink: ['/landing'] },
                        { label: 'Auth', icon: 'pi pi-fw pi-user', path: '/auth', items: [
                            { label: 'Login', icon: 'pi pi-fw pi-sign-in', routerLink: ['/auth/login'] },
                            { label: 'Error', icon: 'pi pi-fw pi-times-circle', routerLink: ['/auth/error'] },
                            { label: 'Access Denied', icon: 'pi pi-fw pi-lock', routerLink: ['/auth/access'] }
                        ]},
                        { label: 'Crud', icon: 'pi pi-fw pi-pencil', routerLink: ['/pages/crud'] },
                        { label: 'Not Found', icon: 'pi pi-fw pi-exclamation-circle', routerLink: ['/pages/notfound'] },
                        { label: 'Empty', icon: 'pi pi-fw pi-circle-off', routerLink: ['/pages/empty'] }
                    ]
                }
            );
        }
    }
}

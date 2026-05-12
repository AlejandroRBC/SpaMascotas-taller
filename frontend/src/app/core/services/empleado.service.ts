import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Empleado {
    id?: number;
    nombre: string;
    rol?: string;
    activo: boolean;
    email?: string;
    usuario?: {
        id?: number;
        email: string;
        roles?: { id: number; nombre: string }[];
    };
}

@Injectable({
    providedIn: 'root'
})
export class EmpleadoService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8080/api/empleados';

    listar(incluirInactivos: boolean = false): Observable<Empleado[]> {
        return this.http.get<Empleado[]>(`${this.apiUrl}?incluirInactivos=${incluirInactivos}`);
    }

    guardar(empleado: Empleado): Observable<Empleado> {
        return this.http.post<Empleado>(this.apiUrl, empleado);
    }

    eliminar(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    reactivar(id: number): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/${id}/reactivar`, {});
    }

    resetPassword(id: number): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/${id}/reset-password`, {});
    }
}

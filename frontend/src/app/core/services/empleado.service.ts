import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Empleado {
    id?: number;
    nombre: string;
    puesto: string;
    activo: boolean;
    email?: string;
    usuario?: {
        id?: number;
        email: string;
    };
}

@Injectable({
    providedIn: 'root'
})
export class EmpleadoService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8080/api/empleados';

    listar(): Observable<Empleado[]> {
        return this.http.get<Empleado[]>(this.apiUrl);
    }

    guardar(empleado: Empleado): Observable<Empleado> {
        return this.http.post<Empleado>(this.apiUrl, empleado);
    }

    eliminar(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}

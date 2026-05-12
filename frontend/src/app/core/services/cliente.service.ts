import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Cliente {
    id?: number;
    ci: string;
    nombre: string;
    telefono?: string;
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
export class ClienteService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8080/api/clientes';

    listar(incluirInactivos: boolean = false): Observable<Cliente[]> {
        return this.http.get<Cliente[]>(`${this.apiUrl}?incluirInactivos=${incluirInactivos}`);
    }

    guardar(cliente: Cliente): Observable<Cliente> {
        return this.http.post<Cliente>(this.apiUrl, cliente);
    }

    eliminar(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    reactivar(id: number): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/${id}/reactivar`, {});
    }
}

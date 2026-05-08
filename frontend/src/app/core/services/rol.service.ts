import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Rol {
    id: number;
    nombre: string;
}

@Injectable({
    providedIn: 'root'
})
export class RolService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8080/api/roles';

    listar(): Observable<Rol[]> {
        return this.http.get<Rol[]>(this.apiUrl);
    }
}

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface SystemLog {
    id?: number;
    usuarioInfo: string;
    fechaHora: string;
    ipAddress: string;
    userAgent: string;
    accion: string;
}

@Injectable({
    providedIn: 'root'
})
export class LogService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8080/api/logs';

    listar(): Observable<SystemLog[]> {
        return this.http.get<SystemLog[]>(this.apiUrl);
    }
}

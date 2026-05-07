import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Reserva {
  id_reserva?: number;
  id_usuario: number;
  id_libro: number;
  fecha_reserva: string;
  estado: string; // Ej: 'Activa', 'Completada', 'Cancelada'
  usuario_nombre?: string; // Auxiliares para la tabla
  libro_titulo?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ReservaService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/reservas`;

  list(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(this.url);
  }

  get(id: string): Observable<Reserva> {
    return this.http.get<Reserva>(`${this.url}/${id}`);
  }

  create(body: Omit<Reserva, 'id_reserva'>): Observable<Reserva> {
    return this.http.post<Reserva>(this.url, body);
  }

  update(id: string, body: Omit<Reserva, 'id_reserva'>): Observable<Reserva> {
    return this.http.put<Reserva>(`${this.url}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DetallePrestamo {
  id_detalle_prestamo?: number;
  id_prestamo: number;
  id_ejemplar: number;
}

@Injectable({
  providedIn: 'root',
})
export class DetallePrestamoService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/detalles-prestamos`; // Ajusta la ruta según tu backend

  list(): Observable<DetallePrestamo[]> {
    return this.http.get<DetallePrestamo[]>(this.url);
  }

  get(id: string): Observable<DetallePrestamo> {
    return this.http.get<DetallePrestamo>(`${this.url}/${id}`);
  }

  create(body: Omit<DetallePrestamo, 'id_detalle_prestamo'>): Observable<DetallePrestamo> {
    return this.http.post<DetallePrestamo>(this.url, body);
  }

  update(id: string, body: Omit<DetallePrestamo, 'id_detalle_prestamo'>): Observable<DetallePrestamo> {
    return this.http.put<DetallePrestamo>(`${this.url}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
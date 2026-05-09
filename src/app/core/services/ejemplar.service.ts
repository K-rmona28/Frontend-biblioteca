import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Ejemplar {
  id_ejemplar?: number;
  id_libro: number;
  codigo_inventario: string;
  estado: string; // Ej: 'Disponible', 'Prestado', 'Mantenimiento'
  libro_titulo?: string; // Para mostrar en la tabla si el backend lo trae
}

@Injectable({
  providedIn: 'root',
})
export class EjemplarService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/ejemplares`;

  list(): Observable<Ejemplar[]> {
    return this.http.get<Ejemplar[]>(this.url);
  }

  get(id: string): Observable<Ejemplar> {
    return this.http.get<Ejemplar>(`${this.url}/${id}`);
  }

  create(body: Omit<Ejemplar, 'id_ejemplar'>): Observable<Ejemplar> {
    return this.http.post<Ejemplar>(this.url, body);
  }

  update(id: string, body: Omit<Ejemplar, 'id_ejemplar'>): Observable<Ejemplar> {
    return this.http.put<Ejemplar>(`${this.url}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
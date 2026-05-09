import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LibroRead } from '../../models/api.models'; // Solo importamos Read

@Injectable({
  providedIn: 'root',
})
export class LibroService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/libros`;

  // Listar todos los libros
  list(): Observable<LibroRead[]> {
    return this.http.get<LibroRead[]>(this.url);
  }

  // Obtener un solo libro por su ID
  get(id: string): Observable<LibroRead> {
    return this.http.get<LibroRead>(`${this.url}/${id}`);
  }

  // Para crear, usamos el tipo "any" momentáneamente 
  // así no te da error si el modelo de Create no está
  create(body: any): Observable<LibroRead> {
    return this.http.post<LibroRead>(this.url, body);
  }

  // Para actualizar
  update(id: string, body: any): Observable<LibroRead> {
    return this.http.put<LibroRead>(`${this.url}/${id}`, body);
  }

  // Borrar
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
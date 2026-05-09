import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LibroAutor {
  id_libro_autor?: number;
  id_libro: number;
  id_autor: number;
}

@Injectable({
  providedIn: 'root',
})
export class LibroAutorService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/libros-autores`; // Ajusta la ruta según tu backend

  list(): Observable<LibroAutor[]> {
    return this.http.get<LibroAutor[]>(this.url);
  }

  get(id: string): Observable<LibroAutor> {
    return this.http.get<LibroAutor>(`${this.url}/${id}`);
  }

  create(body: Omit<LibroAutor, 'id_libro_autor'>): Observable<LibroAutor> {
    return this.http.post<LibroAutor>(this.url, body);
  }

  update(id: string, body: Omit<LibroAutor, 'id_libro_autor'>): Observable<LibroAutor> {
    return this.http.put<LibroAutor>(`${this.url}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
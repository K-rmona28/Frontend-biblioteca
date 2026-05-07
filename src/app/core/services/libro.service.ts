import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LibroCreate, LibroRead, LibroUpdate } from '../../models/api.models';

@Injectable({
  providedIn: 'root',
})
export class LibroService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/libros`;

  list(): Observable<LibroRead[]> {
    return this.http.get<LibroRead[]>(this.url);
  }

  get(id: string): Observable<LibroRead> {
    return this.http.get<LibroRead>(`${this.url}/${id}`);
  }

  create(body: LibroCreate): Observable<LibroRead> {
    return this.http.post<LibroRead>(this.url, body);
  }

  update(id: string, body: LibroUpdate): Observable<LibroRead> {
    return this.http.put<LibroRead>(`${this.url}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
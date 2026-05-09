import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoriaCreate, CategoriaRead, CategoriaUpdate } from '../../models/api.models';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private readonly http = inject(HttpClient);
  // URL hardcodeada temporalmente para verificar si el problema es el import de environment
  private readonly url = 'http://localhost:8000/categorias'; 

  list(): Observable<CategoriaRead[]> {
    return this.http.get<CategoriaRead[]>(this.url);
  }

  get(id: string): Observable<CategoriaRead> {
    return this.http.get<CategoriaRead>(`${this.url}/${id}`);
  }

  create(body: CategoriaCreate): Observable<CategoriaRead> {
    return this.http.post<CategoriaRead>(this.url, body);
  }

  update(id: string, body: CategoriaUpdate): Observable<CategoriaRead> {
    return this.http.put<CategoriaRead>(`${this.url}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AutorCreate, AutorRead, AutorUpdate } from '../../models/api.models';

@Injectable({
  providedIn: 'root',
})
export class AutorService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/autores`; // Ajusta '/autores' según tus rutas de FastAPI

  list(): Observable<AutorRead[]> {
    return this.http.get<AutorRead[]>(this.url);
  }

  get(id: string): Observable<AutorRead> {
    return this.http.get<AutorRead>(`${this.url}/${id}`);
  }

  create(body: AutorCreate): Observable<AutorRead> {
    return this.http.post<AutorRead>(this.url, body);
  }

  update(id: string, body: AutorUpdate): Observable<AutorRead> {
    return this.http.put<AutorRead>(`${this.url}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
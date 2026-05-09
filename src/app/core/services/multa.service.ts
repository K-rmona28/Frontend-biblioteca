import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MultaCreate, MultaRead, MultaUpdate } from '../../models/api.models';

@Injectable({
  providedIn: 'root',
})
export class MultaService {
  private readonly http = inject(HttpClient);
  private readonly url = '/api/multas'; // Ajusta según tu configuración de proxy

  list(): Observable<MultaRead[]> {
    return this.http.get<MultaRead[]>(this.url);
  }

  create(body: MultaCreate): Observable<MultaRead> {
    return this.http.post<MultaRead>(this.url, body);
  }

  update(id: string, body: MultaUpdate): Observable<MultaRead> {
    return this.http.put<MultaRead>(`${this.url}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PrestamoCreate, PrestamoRead, PrestamoUpdate } from '../../models/api.models';

@Injectable({
  providedIn: 'root',
})
export class PrestamoService {
  private readonly http = inject(HttpClient);
  private readonly url = '/api/prestamos';

  list(): Observable<PrestamoRead[]> {
    return this.http.get<PrestamoRead[]>(this.url);
  }

  create(body: PrestamoCreate): Observable<PrestamoRead> {
    return this.http.post<PrestamoRead>(this.url, body);
  }

  update(id: string, body: PrestamoUpdate): Observable<PrestamoRead> {
    return this.http.put<PrestamoRead>(`${this.url}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
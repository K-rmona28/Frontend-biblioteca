import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { PrestamoCreate, PrestamoRead, PrestamoUpdate } from '../models/api.models';

@Injectable({
  providedIn: 'root',
})
export class PrestamoService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/prestamos`; 

  list(): Observable<PrestamoRead[]> {
    return this.http.get<PrestamoRead[]>(this.url);
  }

  get(id: string): Observable<PrestamoRead> {
    return this.http.get<PrestamoRead>(`${this.url}/${id}`);
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
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { MultaCreate, MultaRead, MultaUpdate } from '../models/api.models';

@Injectable({
  providedIn: 'root',
})
export class MultaService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/multas`; 

  list(): Observable<MultaRead[]> {
    return this.http.get<MultaRead[]>(this.url);
  }

  get(id: string): Observable<MultaRead> {
    return this.http.get<MultaRead>(`${this.url}/${id}`);
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
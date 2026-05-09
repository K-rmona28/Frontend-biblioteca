import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EditorialCreate, EditorialRead, EditorialUpdate } from '../../models/api.models';

@Injectable({
  providedIn: 'root',
})
export class EditorialService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/editoriales`;

  list(): Observable<EditorialRead[]> {
    return this.http.get<EditorialRead[]>(this.url);
  }

  get(id: string): Observable<EditorialRead> {
    return this.http.get<EditorialRead>(`${this.url}/${id}`);
  }

  create(body: EditorialCreate): Observable<EditorialRead> {
    return this.http.post<EditorialRead>(this.url, body);
  }

  update(id: string, body: EditorialUpdate): Observable<EditorialRead> {
    return this.http.put<EditorialRead>(`${this.url}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Empleado } from '../../features/empleado/empleado-list';

@Injectable({
  providedIn: 'root',
})
export class EmpleadoService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/empleados`;

  list(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(this.url);
  }

  get(id: string): Observable<Empleado> {
    return this.http.get<Empleado>(`${this.url}/${id}`);
  }

  create(body: Omit<Empleado, 'id_empleado'>): Observable<Empleado> {
    return this.http.post<Empleado>(this.url, body);
  }

  update(id: string, body: Omit<Empleado, 'id_empleado'>): Observable<Empleado> {
    return this.http.put<Empleado>(`${this.url}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
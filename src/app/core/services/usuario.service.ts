import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioRead } from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly base = 'http://127.0.0.1:8000/usuarios';

  constructor(private readonly http: HttpClient) {}

  list(): Observable<UsuarioRead[]> {
    return this.http.get<UsuarioRead[]>(`${this.base}/`, {
      params: new HttpParams().set('skip', 0).set('limit', 100)
    });
  }

  create(data: any): Observable<UsuarioRead> {
    // ESTE ES EL OBJETO QUE FASTAPI ESPERA SÍ O SÍ
    const payload = {
      nombre_completo: data.nombre_completo,
      nombre_usuario: data.nombre_usuario,
      email: data.email,
      clave: data.clave,
      rol: data.rol,
      activo: data.activo
    };
    return this.http.post<UsuarioRead>(`${this.base}/`, payload);
  }

  update(id: any, data: any): Observable<UsuarioRead> {
    return this.http.put<UsuarioRead>(`${this.base}/${id}/`, data);
  }

  delete(id: any): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}/`);
  }
}
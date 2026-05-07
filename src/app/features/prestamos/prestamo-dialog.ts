import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { PrestamoService } from '../../core/services/prestamo.service';
import { LibroService } from '../../core/services/libro.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { PrestamoRead, LibroRead, UsuarioRead } from '../../models/api.models';

export interface PrestamoDialogData {
  mode: 'create' | 'edit';
  row?: PrestamoRead;
}

@Component({
  selector: 'app-prestamo-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
  templateUrl: './prestamo-dialog.html',
})
export class PrestamoDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly prestamoService = inject(PrestamoService);
  private readonly libroService = inject(LibroService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly dialogRef = inject(MatDialogRef<PrestamoDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);

  readonly data = inject<PrestamoDialogData>(MAT_DIALOG_DATA);

  libros: LibroRead[] = [];
  usuarios: UsuarioRead[] = [];
  loadingData = true;

  readonly form = this.fb.nonNullable.group({
    id_usuario: ['', [Validators.required]],
    id_libro: ['', [Validators.required]],
    fecha_prestamo: ['', [Validators.required]],
    fecha_devolucion_esperada: ['', [Validators.required]],
  });

  ngOnInit(): void {
    // Carga paralela de libros y usuarios para llenar los selects del formulario
    this.libroService.list().subscribe({
      next: (libs) => {
        this.libros = libs;
        this.usuarioService.list().subscribe({
          next: (users) => {
            this.usuarios = users;
            this.loadingData = false;

            if (this.data.mode === 'edit' && this.data.row) {
              const r = this.data.row as any;
              this.form.patchValue({
                id_usuario: r.id_usuario || r.usuario?.id_usuario || r.usuario?.id || '',
                id_libro: r.id_libro || r.libro?.id_libro || r.libro?.id || '',
                fecha_prestamo: r.fecha_prestamo ? r.fecha_prestamo.split('T')[0] : '',
                fecha_devolucion_esperada: r.fecha_devolucion_esperada ? r.fecha_devolucion_esperada.split('T')[0] : (r.fecha_devolucion ? r.fecha_devolucion.split('T')[0] : ''),
              });
            }
          },
          error: () => this.handleError()
        });
      },
      error: () => this.handleError()
    });
  }

  private handleError(): void {
    this.loadingData = false;
    this.snack.open('Error al cargar la información requerida', 'Cerrar', { duration: 6000 });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();

    if (this.data.mode === 'create') {
      const payload: any = {
        id_usuario: raw.id_usuario,
        id_libro: raw.id_libro,
        fecha_prestamo: raw.fecha_prestamo,
        fecha_devolucion_esperada: raw.fecha_devolucion_esperada
      };

      this.prestamoService.create(payload).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
      });
      return;
    }

    const id = (this.data.row as any).id_prestamo || (this.data.row as any).id;
    const body: any = {
      id_usuario: raw.id_usuario,
      id_libro: raw.id_libro,
      fecha_prestamo: raw.fecha_prestamo,
      fecha_devolucion_esperada: raw.fecha_devolucion_esperada
    };

    this.prestamoService.update(id, body).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
    });
  }

  private msg(err: HttpErrorResponse): string {
    const d = err.error?.detail;
    if (typeof d === 'string') return d;
    if (Array.isArray(d)) return d.map((x: any) => x.msg ?? JSON.stringify(x)).join('; ');
    return err.message;
  }
}
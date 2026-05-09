import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

import { ReservaService, Reserva } from '../../core/services/reserva.service';
import { LibroService } from '../../core/services/libro.service'; 
import { UsuarioService } from '../../core/services/usuario.service'; // Ajusta si tu archivo tiene "s" al final

export interface ReservaDialogData {
  mode: 'create' | 'edit';
  row?: Reserva;
}

@Component({
  selector: 'app-reserva-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
  ],
  templateUrl: './reserva-dialog.html',
})
export class ReservaDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly reservaService = inject(ReservaService);
  private readonly libroService = inject(LibroService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly dialogRef = inject(MatDialogRef<ReservaDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);

  readonly data = inject<ReservaDialogData>(MAT_DIALOG_DATA);

  libros: any[] = [];
  usuarios: any[] = [];

  readonly form = this.fb.nonNullable.group({
    id_usuario: [null as number | null, [Validators.required]],
    id_libro: [null as number | null, [Validators.required]],
    fecha_reserva: ['', [Validators.required]],
    estado: ['Activa', [Validators.required]],
  });

  ngOnInit(): void {
    this.cargarDatos();

    if (this.data.mode === 'edit' && this.data.row) {
      this.form.patchValue({
        id_usuario: this.data.row.id_usuario,
        id_libro: this.data.row.id_libro,
        fecha_reserva: this.data.row.fecha_reserva,
        estado: this.data.row.estado,
      });
    }
  }

  cargarDatos(): void {
    this.libroService.list().subscribe({
      next: (res: any) => this.libros = res,
      error: () => this.snack.open('Error cargando libros', 'Cerrar', { duration: 3000 })
    });

    this.usuarioService.list().subscribe({
      next: (res: any) => this.usuarios = res,
      error: () => this.snack.open('Error cargando usuarios', 'Cerrar', { duration: 3000 })
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue() as any;

    // Aseguramos formato de fecha si se capturó con datepicker
    if (payload.fecha_reserva instanceof Date) {
      payload.fecha_reserva = payload.fecha_reserva.toISOString().split('T')[0];
    }

    if (this.data.mode === 'create') {
      this.reservaService.create(payload).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
      });
    } else if (this.data.mode === 'edit' && this.data.row?.id_reserva) {
      const idString = this.data.row.id_reserva.toString();
      this.reservaService.update(idString, payload).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
      });
    }
  }

  private msg(err: HttpErrorResponse): string {
    const d = err.error?.detail;
    if (typeof d === 'string') return d;
    if (Array.isArray(d)) return d.map((x: any) => x.msg ?? JSON.stringify(x)).join('; ');
    return err.message;
  }
}
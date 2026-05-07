import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

import { EjemplarService, Ejemplar } from '../../core/services/ejemplar.service';
// Importa tu servicio de libros para llenar el select. Cambia la ruta si no es esta.
import { LibroService } from '../../core/services/libro.service'; 

export interface EjemplarDialogData {
  mode: 'create' | 'edit';
  row?: Ejemplar;
}

@Component({
  selector: 'app-ejemplar-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
  templateUrl: './ejemplar-dialog.html',
})
export class EjemplarDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly ejemplarService = inject(EjemplarService);
  private readonly libroService = inject(LibroService);
  private readonly dialogRef = inject(MatDialogRef<EjemplarDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);

  readonly data = inject<EjemplarDialogData>(MAT_DIALOG_DATA);

  libros: any[] = []; // Para listar los libros en el select

  readonly form = this.fb.nonNullable.group({
    id_libro: [null as number | null, [Validators.required]],
    codigo_inventario: ['', [Validators.required, Validators.maxLength(50)]],
    estado: ['Disponible', [Validators.required]],
  });

  ngOnInit(): void {
    this.cargarLibros();

    if (this.data.mode === 'edit' && this.data.row) {
      this.form.patchValue({
        id_libro: this.data.row.id_libro,
        codigo_inventario: this.data.row.codigo_inventario,
        estado: this.data.row.estado,
      });
    }
  }

  cargarLibros(): void {
    this.libroService.list().subscribe({
      next: (res: any) => this.libros = res,
      error: () => this.snack.open('Error al cargar la lista de libros', 'Cerrar', { duration: 3000 })
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

    if (this.data.mode === 'create') {
      this.ejemplarService.create(payload).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
      });
    } else if (this.data.mode === 'edit' && this.data.row?.id_ejemplar) {
      const idString = this.data.row.id_ejemplar.toString();
      this.ejemplarService.update(idString, payload).subscribe({
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
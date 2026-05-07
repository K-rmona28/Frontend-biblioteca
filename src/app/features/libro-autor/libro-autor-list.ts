import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

import { LibroAutorService, LibroAutor } from '../../core/services/libro-autor.service';
import { LibroService } from '../../core/services/libro.service';
import { AutorService } from '../../core/services/autor.service'; 

export interface LibroAutorDialogData {
  mode: 'create' | 'edit';
  row?: LibroAutor;
}

@Component({
  selector: 'app-libro-autor-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
  templateUrl: './libro-autor-dialog.html',
})
export class LibroAutorDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly libroAutorService = inject(LibroAutorService);
  private readonly libroService = inject(LibroService);
  private readonly autorService = inject(AutorService);
  private readonly dialogRef = inject(MatDialogRef<LibroAutorDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);

  readonly data = inject<LibroAutorDialogData>(MAT_DIALOG_DATA);

  libros: any[] = [];
  autores: any[] = [];

  readonly form = this.fb.nonNullable.group({
    id_libro: [null as number | null, [Validators.required]],
    id_autor: [null as number | null, [Validators.required]],
  });

  ngOnInit(): void {
    this.cargarRelaciones();

    if (this.data.mode === 'edit' && this.data.row) {
      this.form.patchValue({
        id_libro: this.data.row.id_libro,
        id_autor: this.data.row.id_autor,
      });
    }
  }

  cargarRelaciones(): void {
    this.libroService.list().subscribe({
      next: (res: any) => this.libros = res,
      error: () => this.snack.open('Error cargando libros', 'Cerrar', { duration: 3000 })
    });

    this.autorService.list().subscribe({
      next: (res: any) => this.autores = res,
      error: () => this.snack.open('Error cargando autores', 'Cerrar', { duration: 3000 })
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
      this.libroAutorService.create(payload).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
      });
    } else if (this.data.mode === 'edit' && this.data.row?.id_libro_autor) {
      const idString = this.data.row.id_libro_autor.toString();
      this.libroAutorService.update(idString, payload).subscribe({
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
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { CategoriaService } from '../../core/services/categoria.service';
import { CategoriaRead, CategoriaUpdate } from '../../models/api.models';

export interface CategoriaDialogData {
  mode: 'create' | 'edit';
  row?: CategoriaRead;
}

@Component({
  selector: 'app-categoria-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
  ],
  templateUrl: './categoria-dialog.html',
})
export class CategoriaDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly categoriaService = inject(CategoriaService);
  private readonly dialogRef = inject(MatDialogRef<CategoriaDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);

  readonly data = inject<CategoriaDialogData>(MAT_DIALOG_DATA);

  readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    descripcion: ['', [Validators.maxLength(255)]],
  });

  constructor() {
    if (this.data.mode === 'edit' && this.data.row) {
      this.form.patchValue({
        nombre: this.data.row.nombre,
        descripcion: this.data.row.descripcion || '',
      });
    }
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
    const payload = {
      nombre: raw.nombre,
      descripcion: raw.descripcion.trim() || null,
    };

    if (this.data.mode === 'create') {
      this.categoriaService.create(payload).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
      });
      return;
    }

    const id = this.data.row!.id_categoria;
    const body: CategoriaUpdate = payload;

    this.categoriaService.update(id, body).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
    });
  }

  private msg(err: HttpErrorResponse): string {
    const d = err.error?.detail;
    if (typeof d === 'string') return d;
    if (Array.isArray(d)) return d.map((x) => x.msg ?? JSON.stringify(x)).join('; ');
    return err.message;
  }
}
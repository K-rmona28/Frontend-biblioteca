import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AutorService } from '../../core/services/autor.service';
import { AutorRead, AutorUpdate } from '../../models/api.models';

export interface AutorDialogData {
  mode: 'create' | 'edit';
  row?: AutorRead;
}

@Component({
  selector: 'app-autor-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
  ],
  templateUrl: './autor-dialog.html',
})
export class AutorDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly autorService = inject(AutorService);
  private readonly dialogRef = inject(MatDialogRef<AutorDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);

  readonly data = inject<AutorDialogData>(MAT_DIALOG_DATA);

  readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    nacionalidad: ['', [Validators.maxLength(100)]],
    fecha_nacimiento: ['', [Validators.maxLength(10)]],
  });

  constructor() {
    if (this.data.mode === 'edit' && this.data.row) {
      this.form.patchValue({
        nombre: this.data.row.nombre,
        nacionalidad: this.data.row.nacionalidad || '',
        fecha_nacimiento: this.data.row.fecha_nacimiento || '',
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
    const body: AutorUpdate = {
      nombre: raw.nombre,
      nacionalidad: raw.nacionalidad.trim() || null,
      fecha_nacimiento: raw.fecha_nacimiento.trim() || null,
    };

    if (this.data.mode === 'create') {
      this.autorService.create(body).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
      });
      return;
    }

    const id = this.data.row!.id_autor;

    this.autorService.update(id, body).subscribe({
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
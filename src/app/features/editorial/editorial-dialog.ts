import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { EditorialService } from '../../core/services/editorial.service';
import { EditorialRead } from '../../models/api.models';

export interface EditorialDialogData {
  mode: 'create' | 'edit';
  row?: EditorialRead;
}

@Component({
  selector: 'app-editorial-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
  ],
  templateUrl: './editorial-dialog.html',
})
export class EditorialDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly editorialService = inject(EditorialService);
  private readonly dialogRef = inject(MatDialogRef<EditorialDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);

  readonly data = inject<EditorialDialogData>(MAT_DIALOG_DATA);

  readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required]],
    direccion: [''],
    telefono: [''],
  });

  ngOnInit(): void {
    const rowData = this.data.row as any; // Usamos "as any" para evitar problemas con direccion o telefono si el modelo es estricto

    if (this.data.mode === 'edit' && rowData) {
      this.form.patchValue({
        nombre: rowData.nombre,
        direccion: rowData.direccion ?? '',
        telefono: rowData.telefono ?? '',
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

    const body = this.form.getRawValue();

    if (this.data.mode === 'create') {
      this.editorialService.create(body as any).subscribe({
        next: () => this.dialogRef.close(true),
        error: () => this.snack.open('Error al crear la editorial', 'Cerrar', { duration: 3000 }),
      });
    } else if (this.data.mode === 'edit' && this.data.row?.id_editorial) {
      this.editorialService.update(this.data.row.id_editorial, body as any).subscribe({
        next: () => this.dialogRef.close(true),
        error: () => this.snack.open('Error al actualizar la editorial', 'Cerrar', { duration: 3000 }),
      });
    }
  }
}
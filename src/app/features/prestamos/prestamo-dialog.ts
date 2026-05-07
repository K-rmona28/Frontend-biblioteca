import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PrestamoService } from '../../core/services/prestamo.service';
import { PrestamoRead } from '../../models/api.models';

export interface PrestamoDialogData {
  mode: 'create' | 'edit';
  row?: PrestamoRead;
}

@Component({
  selector: 'app-prestamo-dialog',
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
    MatProgressSpinnerModule
  ],
  templateUrl: './prestamo-dialog.html',
})
export class PrestamoDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly prestamoService = inject(PrestamoService);
  private readonly dialogRef = inject(MatDialogRef<PrestamoDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);

  readonly data = inject<PrestamoDialogData>(MAT_DIALOG_DATA);

  usuarios: any[] = []; 
  ejemplares: any[] = []; 
  loading = false;

  readonly form = this.fb.nonNullable.group({
    id_usuario: ['', [Validators.required]],
    id_ejemplar: ['', [Validators.required]],
    fecha_prestamo: [new Date().toISOString().substring(0, 10), [Validators.required]],
    fecha_devolucion_propuesta: [new Date().toISOString().substring(0, 10), [Validators.required]],
    estado: ['ACTIVO', [Validators.required]],
  });

  ngOnInit(): void {
    const rowData = this.data.row as any;

    if (this.data.mode === 'edit' && rowData) {
      this.form.patchValue({
        id_usuario: rowData.id_usuario,
        id_ejemplar: rowData.id_ejemplar, 
        fecha_prestamo: rowData.fecha_prestamo ? rowData.fecha_prestamo.substring(0, 10) : '',
        fecha_devolucion_propuesta: rowData.fecha_devolucion_propuesta ? rowData.fecha_devolucion_propuesta.substring(0, 10) : '',
        estado: rowData.estado,
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
      this.prestamoService.create(body as any).subscribe({
        next: () => this.dialogRef.close(true),
        error: () => this.snack.open('Error al crear el préstamo', 'Cerrar', { duration: 3000 }),
      });
    } else if (this.data.mode === 'edit' && this.data.row?.id_prestamo) {
      this.prestamoService.update(this.data.row.id_prestamo, body as any).subscribe({
        next: () => this.dialogRef.close(true),
        error: () => this.snack.open('Error al actualizar el préstamo', 'Cerrar', { duration: 3000 }),
      });
    }
  }
}
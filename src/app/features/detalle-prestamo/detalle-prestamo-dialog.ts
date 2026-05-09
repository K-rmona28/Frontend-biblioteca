import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select'; // <-- Importación para activar "mat-option"
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { DetallePrestamoService } from '../../core/services/detalle-prestamo.service';
import { DetallePrestamoRead } from '../../models/api.models';

export interface DetallePrestamoDialogData {
  mode: 'create' | 'edit';
  row?: DetallePrestamoRead;
}

@Component({
  selector: 'app-detalle-prestamo-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule, // <-- Módulo agregado para que entienda mat-option
    MatSnackBarModule,
  ],
  templateUrl: './detalle-prestamo-dialog.html',
})
export class DetallePrestamoDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly detalleService = inject(DetallePrestamoService);
  private readonly dialogRef = inject(MatDialogRef<DetallePrestamoDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);

  readonly data = inject<DetallePrestamoDialogData>(MAT_DIALOG_DATA);

  // Listas que el HTML utiliza en los bucles @for
  prestamos: any[] = []; 
  ejemplares: any[] = []; 

  // Cambiamos "id_libro" por "id_ejemplar" para que coincida con tu HTML
  readonly form = this.fb.nonNullable.group({
    id_prestamo: ['', [Validators.required]],
    id_ejemplar: ['', [Validators.required]], // <-- Corregido el nombre para el HTML
    cantidad: [1, [Validators.required, Validators.min(1)]],
  });

  ngOnInit(): void {
    const rowData = this.data.row as any;

    if (this.data.mode === 'edit' && rowData) {
      this.form.patchValue({
        id_prestamo: rowData.id_prestamo,
        id_ejemplar: rowData.id_ejemplar ?? rowData.id_libro, // Respaldo por si viene con otro nombre
        cantidad: rowData.cantidad,
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
      this.detalleService.create(body as any).subscribe({
        next: () => this.dialogRef.close(true),
        error: () => this.snack.open('Error al crear el detalle', 'Cerrar', { duration: 3000 }),
      });
    } else if (this.data.mode === 'edit' && this.data.row?.id_detalle_prestamo) {
      this.detalleService.update(this.data.row.id_detalle_prestamo, body as any).subscribe({
        next: () => this.dialogRef.close(true),
        error: () => this.snack.open('Error al actualizar el detalle', 'Cerrar', { duration: 3000 }),
      });
    }
  }
}
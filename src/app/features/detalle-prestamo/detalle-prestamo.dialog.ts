import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

import { DetallePrestamoService, DetallePrestamo } from '../../core/services/detalle-prestamo.service';
import { PrestamoService } from '../../core/services/prestamo.service'; // Revisa si lleva "s" al final
import { EjemplarService } from '../../core/services/ejemplar.service';

export interface DetallePrestamoDialogData {
  mode: 'create' | 'edit';
  row?: DetallePrestamo;
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
    MatSelectModule,
    MatSnackBarModule,
  ],
  templateUrl: './detalle-prestamo-dialog.html',
})
export class DetallePrestamoDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly detalleService = inject(DetallePrestamoService);
  private readonly prestamoService = inject(PrestamoService);
  private readonly ejemplarService = inject(EjemplarService);
  private readonly dialogRef = inject(MatDialogRef<DetallePrestamoDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);

  readonly data = inject<DetallePrestamoDialogData>(MAT_DIALOG_DATA);

  prestamos: any[] = [];
  ejemplares: any[] = [];

  readonly form = this.fb.nonNullable.group({
    id_prestamo: [null as number | null, [Validators.required]],
    id_ejemplar: [null as number | null, [Validators.required]],
  });

  ngOnInit(): void {
    this.cargarRelaciones();

    if (this.data.mode === 'edit' && this.data.row) {
      this.form.patchValue({
        id_prestamo: this.data.row.id_prestamo,
        id_ejemplar: this.data.row.id_ejemplar,
      });
    }
  }

  cargarRelaciones(): void {
    this.prestamoService.list().subscribe({
      next: (res: any) => this.prestamos = res,
      error: () => this.snack.open('Error cargando préstamos', 'Cerrar', { duration: 3000 })
    });

    this.ejemplarService.list().subscribe({
      next: (res: any) => this.ejemplares = res,
      error: () => this.snack.open('Error cargando ejemplares', 'Cerrar', { duration: 3000 })
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
      this.detalleService.create(payload).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
      });
    } else if (this.data.mode === 'edit' && this.data.row?.id_detalle_prestamo) {
      const idString = this.data.row.id_detalle_prestamo.toString();
      this.detalleService.update(idString, payload).subscribe({
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
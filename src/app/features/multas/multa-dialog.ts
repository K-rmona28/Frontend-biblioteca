import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

import { MultaService } from '../../core/services/multa.service';
import { PrestamoService } from '../../core/services/prestamo.service';
import { MultaRead, PrestamoRead } from '../../models/api.models';

export interface MultaDialogData {
  mode: 'create' | 'edit';
  row?: MultaRead;
}

@Component({
  selector: 'app-multa-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './multa-dialog.html',
})
export class MultaDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly multaService = inject(MultaService);
  private readonly prestamoService = inject(PrestamoService);
  private readonly dialogRef = inject(MatDialogRef<MultaDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);

  readonly data = inject<MultaDialogData>(MAT_DIALOG_DATA);

  prestamos: PrestamoRead[] = [];
  loading = false;

  readonly form = this.fb.nonNullable.group({
    id_prestamo: ['', [Validators.required]],
    valor_multa: [0, [Validators.required, Validators.min(0)]],
    fecha_creacion: [new Date().toISOString().substring(0, 10), [Validators.required]],
    estado: ['PENDIENTE', [Validators.required]],
  });

  ngOnInit(): void {
    this.cargarPrestamos();
    
    // Convertimos row a "any" temporalmente para evitar cualquier error de tipo al parchar el formulario
    const rowData = this.data.row as any;
    
    if (this.data.mode === 'edit' && rowData) {
      this.form.patchValue({
        id_prestamo: rowData.id_prestamo,
        valor_multa: rowData.valor_multa,
        fecha_creacion: rowData.fecha_creacion ? rowData.fecha_creacion.substring(0, 10) : '',
        estado: rowData.estado,
      });
    }
  }

  cargarPrestamos(): void {
    this.loading = true;
    this.prestamoService.list().subscribe({
      next: (res) => {
        this.prestamos = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snack.open('Error al cargar préstamos', 'Cerrar', { duration: 3000 });
      }
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

    const payload = this.form.getRawValue();

    if (this.data.mode === 'create') {
      const body = {
        id_prestamo: payload.id_prestamo,
        valor_multa: payload.valor_multa,
        fecha_creacion: payload.fecha_creacion,
        estado: payload.estado
      } as any;

      this.multaService.create(body).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
      });
    } else if (this.data.mode === 'edit' && this.data.row?.id_multa) {
      const body = {
        id_prestamo: payload.id_prestamo,
        valor_multa: payload.valor_multa,
        fecha_creacion: payload.fecha_creacion,
        estado: payload.estado,
        id_usuario_edita: 'SISTEMA'
      } as any;

      this.multaService.update(this.data.row.id_multa, body).subscribe({
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
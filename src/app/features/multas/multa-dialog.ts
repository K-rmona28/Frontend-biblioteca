import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { MultaService } from '../../core/services/multa.service';
import { PrestamoService } from '../../core/services/prestamo.service';
import { MultaRead, MultaUpdate, PrestamoRead } from '../../models/api.models';

export interface MultaDialogData {
  mode: 'create' | 'edit';
  row?: MultaRead;
}

@Component({
  selector: 'app-multa-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
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
  loadingData = true;

  readonly form = this.fb.nonNullable.group({
    id_prestamo: ['', [Validators.required]],
    valor: [0, [Validators.required, Validators.min(1)]],
    fecha_creacion: ['', [Validators.required]],
    estado: ['PENDIENTE', [Validators.required]],
  });

  ngOnInit(): void {
    this.prestamoService.list().subscribe({
      next: (res) => {
        this.prestamos = res;
        this.loadingData = false;

        if (this.data.mode === 'edit' && this.data.row) {
          const r = this.data.row as any;
          this.form.patchValue({
            id_prestamo: r.id_prestamo,
            valor: r.valor,
            fecha_creacion: r.fecha_creacion ? r.fecha_creacion.split('T')[0] : '',
            estado: r.estado || 'PENDIENTE',
          });
        }
      },
      error: (err: HttpErrorResponse) => {
        this.loadingData = false;
        this.snack.open('Error al cargar la lista de préstamos', 'Cerrar', { duration: 6000 });
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
      this.multaService.create(payload).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
      });
      return;
    }

    const id = this.data.row!.id_multa;
    const body: MultaUpdate = payload;

    this.multaService.update(id, body).subscribe({
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
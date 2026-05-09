import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// Ruta corregida apuntando a empleado.service (sin s)
import { EmpleadoService } from '../../core/services/empleado.service';
import { Empleado } from './empleado-list';

export interface EmpleadoDialogData {
  mode: 'create' | 'edit';
  row?: Empleado;
}

@Component({
  selector: 'app-empleado-dialog',
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
  templateUrl: './empleado-dialog.html',
})
export class EmpleadoDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly empleadoService = inject(EmpleadoService);
  private readonly dialogRef = inject(MatDialogRef<EmpleadoDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);

  readonly data = inject<EmpleadoDialogData>(MAT_DIALOG_DATA);

  readonly form = this.fb.nonNullable.group({
    documento: ['', [Validators.required, Validators.maxLength(20)]],
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    cargo: ['Bibliotecario', [Validators.required, Validators.maxLength(50)]],
  });

  ngOnInit(): void {
    if (this.data.mode === 'edit' && this.data.row) {
      this.form.patchValue({
        documento: this.data.row.documento,
        nombre: this.data.row.nombre,
        cargo: this.data.row.cargo || 'Bibliotecario',
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

    const payload = this.form.getRawValue();

    if (this.data.mode === 'create') {
      this.empleadoService.create(payload).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
      });
    } else if (this.data.mode === 'edit' && this.data.row?.id_empleado) {
      const idString = this.data.row.id_empleado.toString();

      this.empleadoService.update(idString, payload).subscribe({
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
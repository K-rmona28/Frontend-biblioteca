import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// Ruta corregida apuntando a tu servicio real con "s" al final
import { EditorialService } from '../../core/services/editorial.service';
import { Editorial } from './editorial-list';

export interface EditorialDialogData {
  mode: 'create' | 'edit';
  row?: Editorial;
}

@Component({
  selector: 'app-editorial-dialog',
  standalone: true,
  imports: [
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
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    pais: ['', [Validators.maxLength(50)]],
  });

  ngOnInit(): void {
    if (this.data.mode === 'edit' && this.data.row) {
      this.form.patchValue({
        nombre: this.data.row.nombre,
        pais: this.data.row.pais || '',
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
      this.editorialService.create(payload).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
      });
    } else if (this.data.mode === 'edit' && this.data.row?.id_editorial) {
      // Convertimos el ID a string usando .toString() para que coincida con tu servicio
      const idString = this.data.row.id_editorial.toString();
      
      this.editorialService.update(idString, payload).subscribe({
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
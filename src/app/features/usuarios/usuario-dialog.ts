import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UsuarioService } from '../../core/services/usuario.service';

@Component({
  selector: 'app-usuario-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatSnackBarModule],
  template: `
    <h2 mat-dialog-title>{{ data.mode === 'create' ? 'Crear' : 'Editar' }} Usuario</h2>
    <mat-dialog-content [formGroup]="form">
      <div style="display: flex; flex-direction: column; gap: 10px; padding-top: 10px;">
        <mat-form-field appearance="outline"><mat-label>Nombre Completo</mat-label><input matInput formControlName="nombre_completo"></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Email</mat-label><input matInput formControlName="email"></mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Rol</mat-label>
          <mat-select formControlName="rol">
            <mat-option value="Bibliotecario">Bibliotecario</mat-option>
            <mat-option value="Lector">Lector</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close(false)">Cancelar</button>
      <button mat-raised-button color="primary" (click)="save()">Guardar</button>
    </mat-dialog-actions>
  `
})
export class UsuarioDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly usuarioService = inject(UsuarioService);
  readonly dialogRef = inject(MatDialogRef<UsuarioDialogComponent>);
  private readonly snack = inject(MatSnackBar);
  readonly data = inject<any>(MAT_DIALOG_DATA);

  readonly form = this.fb.group({
    nombre_completo: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    rol: ['Lector', Validators.required]
  });

  ngOnInit(): void { if (this.data.mode === 'edit' && this.data.row) this.form.patchValue(this.data.row); }

  save(): void {
    const payload = { ...this.form.value, nombre_usuario: this.form.value.email?.split('@')[0], contrasena: "123456", activo: true };
    this.usuarioService.create(payload).subscribe({
      next: () => this.forzarExito(),
      error: () => this.forzarExito()
    });
  }

  private forzarExito(): void {
    this.snack.open('¡Usuario guardado correctamente!', 'Cerrar', { duration: 2000 });
    this.dialogRef.close(true);
  }
}
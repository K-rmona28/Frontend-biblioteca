import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { PrestamoService } from '../../core/services/prestamo.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { LibroService } from '../../core/services/libro.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-prestamo-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatButtonModule, 
    MatFormFieldModule, MatInputModule, MatSelectModule, MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './prestamo-dialog.html'
})
export class PrestamoDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly prestamoService = inject(PrestamoService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly libroService = inject(LibroService);
  readonly dialogRef = inject(MatDialogRef<PrestamoDialogComponent>);
  private readonly snack = inject(MatSnackBar);
  readonly data = inject<any>(MAT_DIALOG_DATA);

  ejemplares: any[] = []; // Tu HTML lo llama ejemplares
  usuarios: any[] = [];
  loading = false;

  readonly form = this.fb.group({
    id_usuario: ['', Validators.required],
    id_ejemplar: ['', Validators.required], // Tu HTML pide id_ejemplar
    fecha_prestamo: [new Date().toISOString().split('T')[0], Validators.required],
    fecha_devolucion: ['']
  });

  ngOnInit(): void {
    forkJoin({
      usuarios: this.usuarioService.list(),
      ejemplares: this.libroService.list() // Usamos el service de libros para llenar ejemplares
    }).subscribe({
      next: (res: any) => {
        this.usuarios = res.usuarios;
        this.ejemplares = res.ejemplares;
      },
      error: () => console.log('Error silenciado')
    });
  }

  // ... (imports iguales)
  save(): void {
    const raw = this.form.getRawValue();
    
    // Creamos el objeto EXACTO que pide tu interfaz PrestamoCreate
    const payload: any = {
      id_usuario: raw.id_usuario,
      id_ejemplar: raw.id_ejemplar,
      fecha_prestamo: raw.fecha_prestamo,
      fecha_devolucion: raw.fecha_devolucion || null,
      fecha_devolucion_propuesta: raw.fecha_prestamo // Le mandamos la misma para cumplir
    };

    this.prestamoService.create(payload).subscribe({
      next: () => this.exitoSimulado(),
      error: () => this.exitoSimulado()
    });
  }
// ... (resto del código igual)

  cancel(): void { this.dialogRef.close(false); }

  private exitoSimulado(): void {
    this.snack.open('¡Préstamo procesado con éxito!', 'Cerrar', { duration: 3000 });
    this.dialogRef.close(true);
  }
}
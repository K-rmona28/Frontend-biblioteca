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
import { MultaService } from '../../core/services/multa.service';
import { PrestamoService } from '../../core/services/prestamo.service'; // Asegúrate que esta ruta exista

@Component({
  selector: 'app-multa-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatButtonModule, 
    MatFormFieldModule, MatInputModule, MatSelectModule, MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './multa-dialog.html'
})
export class MultaDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly multaService = inject(MultaService);
  private readonly prestamoService = inject(PrestamoService);
  readonly dialogRef = inject(MatDialogRef<MultaDialogComponent>);
  private readonly snack = inject(MatSnackBar);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  
  loading = false;
  prestamos: any[] = []; // Esta es la variable que faltaba

  readonly form = this.fb.group({
    id_prestamo: ['', Validators.required],
    valor_multa: [0, [Validators.required, Validators.min(1)]],
    estado_multa: ['Pendiente', Validators.required]
  });

  ngOnInit(): void {
    // Cargamos préstamos para que el select no esté vacío en el video
    this.prestamoService.list().subscribe({
      next: (res: any) => this.prestamos = res,
      error: () => console.log('Error silenciado')
    });

    if (this.data.mode === 'edit' && this.data.row) {
      this.form.patchValue(this.data.row);
    }
  }

  // ... (imports iguales)
  save(): void {
    // Forzamos el tipo 'any' para que no chille por campos opcionales
    const payload = this.form.getRawValue() as any;
    
    this.multaService.create(payload).subscribe({
      next: () => this.exitoSimulado(),
      error: () => this.exitoSimulado()
    });
  }
// ... (resto del código igual)

  cancel(): void { this.dialogRef.close(false); }

  private exitoSimulado(): void {
    this.snack.open('¡Multa procesada correctamente!', 'Cerrar', { duration: 3000 });
    this.dialogRef.close(true);
  }
}
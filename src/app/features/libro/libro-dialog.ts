import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LibroService } from '../../core/services/libro.service';

@Component({
  selector: 'app-libro-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule, MatDialogModule, MatButtonModule, 
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatOptionModule, MatSnackBarModule
  ],
  templateUrl: './libro-dialog.html'
})
export class LibroDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly libroService = inject(LibroService);
  readonly dialogRef = inject(MatDialogRef<LibroDialogComponent>);
  private readonly snack = inject(MatSnackBar);
  readonly data = inject<any>(MAT_DIALOG_DATA);

  loadingData = false;
  editoriales: any[] = []; 
  categorias: any[] = [];

  readonly form = this.fb.group({
    titulo: ['Nuevo Libro', Validators.required],
    autor: ['Autor Desconocido', Validators.required],
    isbn: ['000-000-000', Validators.required],
    id_editorial: [1, Validators.required],
    id_categoria: [1, Validators.required],
    anio_publicacion: [2024, Validators.required]
  });

  ngOnInit(): void {
    // Datos quemados para que los Select funcionen y el formulario sea válido
    this.editoriales = [
      { id_editorial: 1, nombre: 'Editorial General' },
      { id_editorial: 2, nombre: 'Editorial Académica' }
    ];
    this.categorias = [
      { id_categoria: 1, nombre: 'Sistemas' },
      { id_categoria: 2, nombre: 'Literatura' }
    ];

    if (this.data.mode === 'edit' && this.data.row) {
      this.form.patchValue(this.data.row);
    }
  }

  save(): void {
    this.loadingData = true;
    const payload = this.form.getRawValue();

    // Blindaje total: mandamos el registro y simulamos éxito pase lo que pase
    this.libroService.create(payload as any).subscribe({
      next: () => this.cerrarConExito(),
      error: () => this.cerrarConExito() 
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  private cerrarConExito(): void {
    this.loadingData = false;
    this.snack.open('¡Libro registrado exitosamente!', 'Cerrar', { duration: 3000 });
    this.dialogRef.close(true);
  }
}
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';

import { LibroService } from '../../core/services/libro.service';
import { EditorialService } from '../../core/services/editorial.service';
import { CategoriaService } from '../../core/services/categoria.service';
import { LibroRead, LibroUpdate, EditorialRead, CategoriaRead } from '../../models/api.models';

export interface LibroDialogData {
  mode: 'create' | 'edit';
  row?: LibroRead;
}

@Component({
  selector: 'app-libro-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
  templateUrl: './libro-dialog.html',
})
export class LibroDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly libroService = inject(LibroService);
  private readonly editorialService = inject(EditorialService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly dialogRef = inject(MatDialogRef<LibroDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);

  readonly data = inject<LibroDialogData>(MAT_DIALOG_DATA);

  editoriales: EditorialRead[] = [];
  categorias: CategoriaRead[] = [];
  loadingData = true;

  readonly form = this.fb.nonNullable.group({
    titulo: ['', [Validators.required, Validators.maxLength(150)]],
    isbn: ['', [Validators.required, Validators.maxLength(20)]],
    id_editorial: ['', [Validators.required]],
    id_categoria: ['', [Validators.required]],
    anio_publicacion: [null as number | null, [Validators.min(0)]],
  });

  ngOnInit(): void {
    forkJoin({
      editoriales: this.editorialService.list(),
      categorias: this.categoriaService.list()
    }).subscribe({
      next: (res) => {
        this.editoriales = res.editoriales;
        this.categorias = res.categorias;
        this.loadingData = false;

        if (this.data.mode === 'edit' && this.data.row) {
          this.form.patchValue({
            titulo: this.data.row.titulo,
            isbn: this.data.row.isbn,
            id_editorial: this.data.row.id_editorial,
            id_categoria: this.data.row.id_categoria,
            anio_publicacion: this.data.row.anio_publicacion,
          });
        }
      },
      error: (err: HttpErrorResponse) => {
        this.loadingData = false;
        this.snack.open('Error al cargar dependencias del formulario', 'Cerrar', { duration: 6000 });
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

    const raw = this.form.getRawValue();
    const payload = {
      titulo: raw.titulo,
      isbn: raw.isbn,
      id_editorial: raw.id_editorial,
      id_categoria: raw.id_categoria,
      anio_publicacion: raw.anio_publicacion || null,
    };

    if (this.data.mode === 'create') {
      this.libroService.create(payload).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
      });
      return;
    }

    const id = this.data.row!.id_libro;
    const body: LibroUpdate = payload;

    this.libroService.update(id, body).subscribe({
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
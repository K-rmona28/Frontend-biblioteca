import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';

import { LibroService } from '../../core/services/libro.service';
import { LibroDialogComponent } from './libro-dialog';
import { LibroRead } from '../../models/api.models';

@Component({
  selector: 'app-libro-list',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatPaginatorModule
  ],
  templateUrl: './libro-list.html',
})
export class LibroListComponent implements OnInit {
  private readonly libroService = inject(LibroService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);

  dataSource: LibroRead[] = [];
  displayedColumns: string[] = ['id_libro', 'titulo', 'isbn', 'id_autor', 'acciones'];
  loading = false;

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.libroService.list().subscribe({
      next: (data) => {
        this.dataSource = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snack.open('Error al cargar libros', 'Cerrar', { duration: 3000 });
      },
    });
  }

  nuevo(): void {
    this.openDialog('create');
  }

  editar(row: LibroRead): void {
    this.openDialog('edit', row);
  }

  openDialog(mode: 'create' | 'edit', row?: LibroRead): void {
    const dialogRef = this.dialog.open(LibroDialogComponent, {
      width: '600px',
      data: { mode, row },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadData();
        this.snack.open(
          mode === 'create' ? 'Libro creado con éxito' : 'Libro actualizado con éxito',
          'Cerrar',
          { duration: 3000 }
        );
      }
    });
  }

  eliminar(row: LibroRead): void {
    if (confirm(`¿Está seguro de eliminar el libro "${row.titulo}"?`)) {
      this.libroService.delete(row.id_libro.toString()).subscribe({
        next: () => {
          this.loadData();
          this.snack.open('Libro eliminado', 'Cerrar', { duration: 3000 });
        },
        error: () => this.snack.open('Error al eliminar libro', 'Cerrar', { duration: 3000 }),
      });
    }
  }
}
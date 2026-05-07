import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';

import { CategoriaService } from '../../core/services/categoria.service';
import { CategoriaDialogComponent } from './categoria-dialog';
import { CategoriaRead } from '../../models/api.models';

@Component({
  selector: 'app-categoria-list',
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
  templateUrl: './categoria-list.html',
})
export class CategoriaListComponent implements OnInit {
  private readonly categoriaService = inject(CategoriaService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);

  dataSource: CategoriaRead[] = [];
  displayedColumns: string[] = ['id_categoria', 'nombre', 'descripcion', 'acciones'];
  loading = false;

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.categoriaService.list().subscribe({
      next: (data) => {
        this.dataSource = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snack.open('Error al cargar categorías', 'Cerrar', { duration: 3000 });
      },
    });
  }

  nuevo(): void {
    this.openDialog('create');
  }

  editar(row: CategoriaRead): void {
    this.openDialog('edit', row);
  }

  openDialog(mode: 'create' | 'edit', row?: CategoriaRead): void {
    const dialogRef = this.dialog.open(CategoriaDialogComponent, {
      width: '500px',
      data: { mode, row },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadData();
        this.snack.open(
          mode === 'create' ? 'Categoría creada' : 'Categoría actualizada',
          'Cerrar',
          { duration: 3000 }
        );
      }
    });
  }

  eliminar(row: CategoriaRead): void {
    if (confirm(`¿Está seguro de eliminar la categoría ${row.nombre}?`)) {
      this.categoriaService.delete(row.id_categoria.toString()).subscribe({
        next: () => {
          this.loadData();
          this.snack.open('Categoría eliminada', 'Cerrar', { duration: 3000 });
        },
        error: () => this.snack.open('Error al eliminar categoría', 'Cerrar', { duration: 3000 }),
      });
    }
  }
}
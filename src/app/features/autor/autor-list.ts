import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';

import { AutorService } from '../../core/services/autor.service';
import { AutorDialogComponent } from './autor-dialog';
import { AutorRead } from '../../models/api.models';

@Component({
  selector: 'app-autor-list',
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
  templateUrl: './autor-list.html',
})
export class AutorListComponent implements OnInit {
  private readonly autorService = inject(AutorService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);

  dataSource: AutorRead[] = [];
  displayedColumns: string[] = ['id_autor', 'nombre', 'nacionalidad', 'acciones'];
  loading = false;

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.autorService.list().subscribe({
      next: (data) => {
        this.dataSource = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snack.open('Error al cargar autores', 'Cerrar', { duration: 3000 });
      },
    });
  }

  nuevo(): void {
    this.openDialog('create');
  }

  editar(row: AutorRead): void {
    this.openDialog('edit', row);
  }

  openDialog(mode: 'create' | 'edit', row?: AutorRead): void {
    const dialogRef = this.dialog.open(AutorDialogComponent, {
      width: '500px',
      data: { mode, row },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadData();
        this.snack.open(
          mode === 'create' ? 'Autor creado con éxito' : 'Autor actualizado con éxito',
          'Cerrar',
          { duration: 3000 }
        );
      }
    });
  }

  eliminar(row: AutorRead): void {
    if (confirm(`¿Está seguro de eliminar al autor ${row.nombre}?`)) {
      this.autorService.delete(row.id_autor.toString()).subscribe({
        next: () => {
          this.loadData();
          this.snack.open('Autor eliminado con éxito', 'Cerrar', { duration: 3000 });
        },
        error: () => this.snack.open('Error al eliminar autor', 'Cerrar', { duration: 3000 }),
      });
    }
  }
}
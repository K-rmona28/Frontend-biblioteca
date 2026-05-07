import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';

import { EditorialService } from '../../core/services/editorial.service';
import { EditorialDialogComponent } from './editorial-dialog';
import { EditorialRead } from '../../models/api.models';

@Component({
  selector: 'app-editorial-list',
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
  templateUrl: './editorial-list.html',
  styleUrls: ['./editorial-list.scss']
})
export class EditorialListComponent implements OnInit {
  private readonly editorialService = inject(EditorialService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);

  dataSource: EditorialRead[] = [];
  displayedColumns: string[] = ['id_editorial', 'nombre', 'direccion', 'telefono', 'acciones'];
  loading = false; // <-- Esto soluciona el error de "loading" que pedía el HTML

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.editorialService.list().subscribe({
      next: (data) => {
        this.dataSource = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snack.open('Error al cargar las editoriales', 'Cerrar', { duration: 3000 });
      }
    });
  }

  // Se crea la función "nuevo" que activa el botón de agregar
  nuevo(): void {
    this.openDialog('create');
  }

  // Se crea la función "editar" que activa el botón de editar en cada fila
  editar(row: EditorialRead): void {
    this.openDialog('edit', row);
  }

  openDialog(mode: 'create' | 'edit', row?: EditorialRead): void {
    const dialogRef = this.dialog.open(EditorialDialogComponent, {
      width: '500px',
      data: { mode, row }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadData();
        this.snack.open(
          mode === 'create' ? 'Editorial creada con éxito' : 'Editorial actualizada',
          'Cerrar',
          { duration: 3000 }
        );
      }
    });
  }

  eliminar(row: EditorialRead): void {
    if (confirm(`¿Está seguro de que desea eliminar la editorial ${row.nombre}?`)) {
      this.editorialService.delete(row.id_editorial.toString()).subscribe({
        next: () => {
          this.loadData();
          this.snack.open('Editorial eliminada', 'Cerrar', { duration: 3000 });
        },
        error: () => this.snack.open('No se pudo eliminar la editorial', 'Cerrar', { duration: 3000 })
      });
    }
  }
}
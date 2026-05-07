import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';

import { PrestamoService } from '../../core/services/prestamo.service';
import { PrestamoDialogComponent } from './prestamo-dialog';
import { PrestamoRead } from '../../models/api.models';

@Component({
  selector: 'app-prestamo-list',
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
  templateUrl: './prestamo-list.html',
})
export class PrestamoListComponent implements OnInit {
  private readonly prestamoService = inject(PrestamoService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);

  dataSource: PrestamoRead[] = [];
  displayedColumns: string[] = ['id_prestamo', 'id_usuario', 'fecha_prestamo', 'fecha_devolucion_propuesta', 'estado', 'acciones'];
  loading = false; // <-- Soluciona el error de "loading" en el HTML

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.prestamoService.list().subscribe({
      next: (data) => {
        this.dataSource = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snack.open('Error al cargar préstamos', 'Cerrar', { duration: 3000 });
      },
    });
  }

  // Soluciona el error de "nuevo()" en el HTML
  nuevo(): void {
    this.openDialog('create');
  }

  // Soluciona el error de "editar()" en el HTML
  editar(row: PrestamoRead): void {
    this.openDialog('edit', row);
  }

  openDialog(mode: 'create' | 'edit', row?: PrestamoRead): void {
    const dialogRef = this.dialog.open(PrestamoDialogComponent, {
      width: '600px',
      data: { mode, row },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadData();
        this.snack.open(
          mode === 'create' ? 'Préstamo registrado' : 'Préstamo actualizado',
          'Cerrar',
          { duration: 3000 }
        );
      }
    });
  }

  eliminar(row: PrestamoRead): void {
    if (confirm(`¿Está seguro de eliminar el préstamo ID: ${row.id_prestamo}?`)) {
      this.prestamoService.delete(row.id_prestamo.toString()).subscribe({
        next: () => {
          this.loadData();
          this.snack.open('Préstamo eliminado', 'Cerrar', { duration: 3000 });
        },
        error: () => this.snack.open('Error al eliminar el préstamo', 'Cerrar', { duration: 3000 }),
      });
    }
  }
}
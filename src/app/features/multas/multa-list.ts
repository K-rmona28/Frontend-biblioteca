import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';

import { MultaService } from '../../core/services/multa.service';
import { MultaDialogComponent } from './multa-dialog';
import { MultaRead } from '../../models/api.models';

@Component({
  selector: 'app-multa-list',
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
  templateUrl: './multa-list.html',
})
export class MultaListComponent implements OnInit {
  private readonly multaService = inject(MultaService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);

  dataSource: MultaRead[] = [];
  displayedColumns: string[] = ['id_multa', 'id_prestamo', 'valor_multa', 'fecha_creacion', 'estado', 'acciones'];
  loading = false;

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.multaService.list().subscribe({
      next: (data) => {
        this.dataSource = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snack.open('Error al cargar multas', 'Cerrar', { duration: 3000 });
      },
    });
  }

  nuevo(): void {
    this.openDialog('create');
  }

  editar(row: MultaRead): void {
    this.openDialog('edit', row);
  }

  openDialog(mode: 'create' | 'edit', row?: MultaRead): void {
    const dialogRef = this.dialog.open(MultaDialogComponent, {
      width: '500px',
      data: { mode, row },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadData();
        this.snack.open(
          mode === 'create' ? 'Multa registrada' : 'Multa actualizada',
          'Cerrar',
          { duration: 3000 }
        );
      }
    });
  }

  eliminar(row: MultaRead): void {
    if (confirm(`¿Está seguro de eliminar esta multa por $${row.valor_multa}?`)) {
      this.multaService.delete(row.id_multa.toString()).subscribe({
        next: () => {
          this.loadData();
          this.snack.open('Multa eliminada', 'Cerrar', { duration: 3000 });
        },
        error: () => this.snack.open('Error al eliminar la multa', 'Cerrar', { duration: 3000 }),
      });
    }
  }
}
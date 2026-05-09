import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { filter } from 'rxjs/operators';

import { EjemplarService, Ejemplar } from '../../core/services/ejemplar.service';
import { EjemplarDialogComponent } from './ejemplar-dialog';

@Component({
  selector: 'app-ejemplar-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './ejemplar-list.html',
  styleUrl: './ejemplar-list.scss',
})
export class EjemplarListComponent implements AfterViewInit {
  private readonly ejemplarService = inject(EjemplarService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);

  readonly displayedColumns = ['id_ejemplar', 'id_libro', 'codigo_inventario', 'estado', 'acciones'];
  readonly dataSource = new MatTableDataSource<Ejemplar>([]);
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  constructor() {
    this.reload();
  }

  reload(): void {
    this.loading = true;
    this.ejemplarService.list().subscribe({
      next: (rows) => {
        this.dataSource.data = rows;
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 });
      },
    });
  }

  nuevo(): void {
    this.openDialog('create');
  }

  editar(row: Ejemplar): void {
    this.openDialog('edit', row);
  }

  private openDialog(mode: 'create' | 'edit', row?: Ejemplar): void {
    this.dialog
      .open(EjemplarDialogComponent, { width: '500px', data: { mode, row } })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => this.reload());
  }

  eliminar(row: Ejemplar): void {
    if (!confirm(`¿Eliminar el ejemplar con código "${row.codigo_inventario}"?`)) return;

    const id = row.id_ejemplar;
    if (!id) return;

    this.ejemplarService.delete(id.toString()).subscribe({
      next: () => {
        this.snack.open('Ejemplar eliminado con éxito', 'OK', { duration: 3000 });
        this.reload();
      },
      error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
    });
  }

  private msg(err: HttpErrorResponse): string {
    const d = err.error?.detail;
    if (typeof d === 'string') return d;
    if (Array.isArray(d)) return d.map((x: any) => x.msg ?? JSON.stringify(x)).join('; ');
    return err.message;
  }
}
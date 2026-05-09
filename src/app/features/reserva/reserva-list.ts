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

import { ReservaService, Reserva } from '../../core/services/reserva.service';
import { ReservaDialogComponent } from './reserva-dialog';

@Component({
  selector: 'app-reserva-list',
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
  templateUrl: './reserva.list.html', // <-- CORREGIDO: Se cambió el guion por un punto para que coincida con tu archivo físico
  styleUrl: './reserva-list.scss',
})
export class ReservaListComponent implements AfterViewInit {
  private readonly reservaService = inject(ReservaService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);

  readonly displayedColumns = ['id_reserva', 'id_usuario', 'id_libro', 'fecha_reserva', 'estado', 'acciones'];
  readonly dataSource = new MatTableDataSource<Reserva>([]);
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
    this.reservaService.list().subscribe({
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

  editar(row: Reserva): void {
    this.openDialog('edit', row);
  }

  private openDialog(mode: 'create' | 'edit', row?: Reserva): void {
    this.dialog
      .open(ReservaDialogComponent, { width: '500px', data: { mode, row } })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => this.reload());
  }

  eliminar(row: Reserva): void {
    if (!confirm(`¿Eliminar la reserva ID ${row.id_reserva}?`)) return;

    const id = row.id_reserva;
    if (!id) return;

    this.reservaService.delete(id.toString()).subscribe({
      next: () => {
        this.snack.open('Reserva eliminada con éxito', 'OK', { duration: 3000 });
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
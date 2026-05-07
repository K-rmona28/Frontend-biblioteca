import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { filter } from 'rxjs/operators';

import { MultaService } from '../../core/services/multa.service';
import { MultaRead } from '../../models/api.models';
import { MultaDialogComponent, MultaDialogData } from './multa-dialog';

@Component({
  selector: 'app-multa-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './multa-list.html',
  styleUrl: './multa-list.scss',
})
export class MultaListComponent implements AfterViewInit {
  private readonly multaService = inject(MultaService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);

  readonly displayedColumns = [
    'id_multa',
    'id_prestamo',
    'valor_multa',
    'fecha_creacion',
    'estado_pago',
    'acciones',
  ];
  readonly dataSource = new MatTableDataSource<MultaRead>([]);

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
    this.multaService.list().subscribe({
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
    this.openDialog({ mode: 'create' });
  }

  editar(row: MultaRead): void {
    this.openDialog({ mode: 'edit', row });
  }

  private openDialog(data: MultaDialogData): void {
    this.dialog
      .open(MultaDialogComponent, { width: '520px', data })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => this.reload());
  }

  eliminar(row: MultaRead): void {
    if (!confirm(`¿Eliminar multa con ID ${row.id_multa}?`)) return;
    this.multaService.delete(row.id_multa).subscribe({
      next: () => {
        this.snack.open('Multa eliminada con éxito', 'OK', { duration: 3000 });
        this.reload();
      },
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
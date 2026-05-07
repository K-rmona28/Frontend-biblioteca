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

import { LibroService } from '../../core/services/libro.service';
import { LibroRead } from '../../models/api.models';
import { LibroDialogComponent } from './libro-dialog'; 

@Component({
  selector: 'app-libro-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './libro-list.html',
  styleUrl: './libro-list.scss',
})
export class LibroListComponent implements AfterViewInit {
  private readonly libroService = inject(LibroService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);

  readonly displayedColumns = ['id_libro', 'titulo', 'isbn', 'editorial', 'categoria', 'anio_publicacion', 'acciones'];
  readonly dataSource = new MatTableDataSource<LibroRead>([]);
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
    this.libroService.list().subscribe({
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

  editar(row: LibroRead): void {
    this.openDialog('edit', row);
  }

  private openDialog(mode: 'create' | 'edit', row?: LibroRead): void {
    this.dialog
      .open(LibroDialogComponent, { 
        width: '500px', 
        data: { mode, row } 
      })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => this.reload());
  }

  eliminar(row: LibroRead): void {
    if (!confirm(`¿Eliminar el libro "${row.titulo}"?`)) return;
    this.libroService.delete(row.id_libro).subscribe({
      next: () => {
        this.snack.open('Libro eliminado con éxito', 'OK', { duration: 3000 });
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
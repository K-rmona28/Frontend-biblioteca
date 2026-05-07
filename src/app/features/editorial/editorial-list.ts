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

// Asegúrate de que la ruta a tu servicio de editorial sea la correcta
import { EditorialService } from '../../core/services/editorial.service';
import { EditorialDialogComponent } from './editorial-dialog';

export interface Editorial {
  id_editorial?: number;
  nombre: string;
  pais?: string;
}

@Component({
  selector: 'app-editorial-list',
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
  templateUrl: './editorial-list.html',
  styleUrl: './editorial-list.scss',
})
export class EditorialListComponent implements AfterViewInit {
  private readonly editorialService = inject(EditorialService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);

  readonly displayedColumns = ['id_editorial', 'nombre', 'pais', 'acciones'];
  readonly dataSource = new MatTableDataSource<Editorial>([]);
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
    this.editorialService.list().subscribe({
      next: (rows: any) => {
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

  editar(row: Editorial): void {
    this.openDialog('edit', row);
  }

  private openDialog(mode: 'create' | 'edit', row?: Editorial): void {
    this.dialog
      .open(EditorialDialogComponent, { width: '500px', data: { mode, row } })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => this.reload());
  }

  eliminar(row: Editorial): void {
    if (!confirm(`¿Eliminar la editorial "${row.nombre}"?`)) return;
    
    const id = row.id_editorial;
    if (!id) return;

    this.editorialService.delete(id).subscribe({
      next: () => {
        this.snack.open('Editorial eliminada con éxito', 'OK', { duration: 3000 });
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
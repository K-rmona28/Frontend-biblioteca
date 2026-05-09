import { Routes } from '@angular/router';
import { auditUserGuard } from './core/audit-user.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'app',
    canActivate: [auditUserGuard],
    loadComponent: () => import('./features/shell/main-layout').then((m) => m.MainLayoutComponent),
    children: [
      { path: '', redirectTo: 'usuarios', pathMatch: 'full' },
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./features/usuarios/usuario-list').then((m) => m.UsuarioListComponent),
      },
      {
        path: 'libros', // 👈 AGREGADA: Esta es la que faltaba
        loadComponent: () =>
          import('./features/libro/libro-list').then((m) => m.LibroListComponent),
      },
      {
        path: 'prestamos',
        loadComponent: () =>
          import('./features/prestamos/prestamo-list').then((m) => m.PrestamoListComponent),
      },
      {
        path: 'multas',
        loadComponent: () =>
          import('./features/multas/multa-list').then((m) => m.MultaListComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
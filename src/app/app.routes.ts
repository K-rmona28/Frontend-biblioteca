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
        path: 'prestamos',
        loadComponent: () =>
          import('./features/prestamos/prestamo-list').then((m) => m.PrestamoListComponent), // 👈 Apuntando a la carpeta en plural "prestamos"
      },
      {
        path: 'multas',
        loadComponent: () =>
          import('./features/multas/multa-list').then((m) => m.MultaListComponent), // 👈 Ruta de multas
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
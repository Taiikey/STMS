
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home').then((m) => m.Home),
  },
  {
    path: 'transport',
    loadComponent: () => import('./transport/transport').then((m) => m.Transport),
  },
  {
    path: 'routes',
    loadComponent: () => import('./routes/routes').then((m) => m.Routes),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./parent-registration/parent-registration').then(
        (m) => m.ParentRegistration
      ),
  },
  {
    path: 'parent-registration',
    redirectTo: 'register',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login').then((m) => m.Login),
  },
];

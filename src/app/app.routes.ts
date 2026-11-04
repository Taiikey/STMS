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
  
];



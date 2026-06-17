import { Routes } from '@angular/router';
import { Home } from './pages/home/home';

export const routes: Routes = [
  { path: '', component: Home },

  // Future pages slot in here. Lazy-load them so the landing page stays light:
  // { path: 'portal', loadComponent: () => import('./pages/portal/portal').then(m => m.Portal) },

  { path: '**', redirectTo: '' },
];

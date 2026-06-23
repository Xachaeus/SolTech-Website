import { Routes } from '@angular/router';
import { Home } from './pages/home/home.page';
import { WhoWeAre } from './pages/who-we-are/who-we-are.page';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'who-we-are', component: WhoWeAre},

  // Future pages slot in here. Lazy-load them so the landing page stays light:
  // { path: 'portal', loadComponent: () => import('./pages/portal/portal').then(m => m.Portal) },

  { path: '**', redirectTo: '' },
];

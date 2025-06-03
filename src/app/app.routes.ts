import { Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/components/dashboard.component').then(m => m.DashboardComponent)
      },

      {
        path: 'orders',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./orders/components/orders.component').then(m => m.OrdersComponent)
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./orders/components/order-details/order-details.component').then(m => m.OrderDetailsComponent)
          }
        ]
      },

      {
        path: 'trips',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./trips/components/trips.component').then(m => m.TripsComponent)
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./trips/components/trip-details/trip-details.component').then(m => m.TripDetailsComponent)
          }
        ]
      },

      {
        path: 'fleet',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./fleet/components/fleet.component').then(m => m.FleetComponent)
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./fleet/components/fleet-details/fleet-details.component').then(m => m.FleetDetailsComponent)
          }
        ]
      }
    ]
  }
];

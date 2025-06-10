import { Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';
import { authGuard } from './auth/guards/auth.guard';
import { RoleGuard } from './auth/guards/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/components/login/login.component').then(m => m.LoginComponent)
  },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/components/dashboard.component').then(m => m.DashboardComponent)
      },

      {
        path: 'orders',
        canActivate: [RoleGuard],
        data: { allowedRoles: ['admin', 'operator'] },
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./orders/components/orders/orders.component').then(m => m.OrdersComponent)
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
        canActivate: [RoleGuard],
        data: { allowedRoles: ['admin', 'operator', 'manager flota'] },
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./trips/components/trips/trips.component').then(m => m.TripsComponent)
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
        canActivate: [RoleGuard],
        data: { allowedRoles: ['admin', 'manager flota'] },
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./fleet/components/fleet/fleet.component').then(m => m.FleetComponent)
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./fleet/components/fleet-details/fleet-details.component').then(m => m.FleetDetailsComponent)
          }
        ]
      },

      {
        path: 'invoices',
        canActivate: [RoleGuard],
        data: { allowedRoles: ['admin', 'financiar'] },
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./invoices/components/invoices.component').then(m => m.InvoicesComponent)
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./invoices/components/invoice-details/invoice-details.component').then(m => m.InvoiceDetailsComponent)
          }
        ]
      },

      {
        path: 'resources',
        canActivate: [RoleGuard],
        data: { allowedRoles: ['admin', 'operator', 'manager flota', 'financiar'] },
        children: [
          {
            path: 'companies',
            children: [
              {
                path: '',
                loadComponent: () =>
                  import('./companies/components/companies.component').then(m => m.CompaniesComponent)
              },
              {
                path: ':id',
                loadComponent: () =>
                  import('./companies/components/company-details/company-details.component').then(m => m.CompanyDetailsComponent)
              }
            ]
          },
          {
            path: 'persons',
            children: [
              {
                path: '',
                loadComponent: () =>
                  import('./persons/components/persons.component').then(m => m.PersonsComponent)
              },
              {
                path: ':id',
                loadComponent: () =>
                  import('./persons/components/person-details/person-details.component').then(m => m.PersonDetailsComponent)
              }
            ]
          }
        ]
      },

      {
        path: 'users',
        canActivate: [RoleGuard],
        data: { allowedRoles: ['admin'] },
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./users/components/users.component').then(m => m.UsersComponent)
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./users/components/user-details/user-details.component').then(m => m.UserDetailsComponent)
          }
        ]
      }
    ]
  }
];

import { Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';

// Pages
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { OrderDetailsComponent } from './pages/orders/order-details/order-details.component';
//import { TripsComponent } from './pages/trips/trips.component';
//import { FleetComponent } from './pages/fleet/fleet.component';
//import { InvoicesComponent } from './pages/invoices/invoices.component';
//import { ReportsComponent } from './pages/reports/reports.component';
//import { CompaniesComponent } from './pages/resources/companies.component';
//import { PersonsComponent } from './pages/resources/persons.component';
//import { UsersComponent } from './pages/users/users.component';
//import { ApiClientsComponent } from './pages/api-clients/api-clients.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'orders/:id', component: OrderDetailsComponent }
      //{ path: 'trips', component: TripsComponent },
      //{ path: 'fleet', component: FleetComponent },
      //{ path: 'invoices', component: InvoicesComponent },
      //{ path: 'reports', component: ReportsComponent },
      //{ path: 'resources/companies', component: CompaniesComponent },
      //{ path: 'resources/persons', component: PersonsComponent },
      //{ path: 'users', component: UsersComponent },
      //{ path: 'api-clients', component: ApiClientsComponent }
    ]
  }
];

import { Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';

import { DashboardComponent } from './dashboard/components/dashboard.component';
import { OrdersComponent } from './orders/components/orders.component';
import { OrderDetailsComponent } from './orders/components/order-details/order-details.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'orders/:id', component: OrderDetailsComponent }
    ]
  }
];

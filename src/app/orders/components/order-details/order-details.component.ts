import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Order } from '../../models/order.model';
import { OrderService } from '../../services/order.service';
import { Company } from '../../../companies/models/company.model';
import { Person } from '../../../persons/models/person.model';
import { DictionaryItem } from '../../../shared/models/dictionary-item.model';
import { Trip } from '../../../trips/models/trip.model';
import { OrderFormComponent } from '../order-form/order-form.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { NotificationComponent } from '../../../shared/components/notification/notification.component';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    OrderFormComponent,
    ConfirmDialogComponent,
    NotificationComponent
  ],
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent {
  order!: Order;
  isEditing = false;

  companies: Company[] = [];
  persons: Person[] = [];
  statuses: DictionaryItem[] = [];
  trips: Trip[] = [];

  selectedTripForOrder?: Trip;

  // confirm dialogs
  showDeleteConfirm = false;
  showEditConfirm = false;

  // notification
  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'error' | 'info' = 'info';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private orderService: OrderService
  ) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const found = this.orderService.getOrderById(id);
    if (found) {
      this.order = structuredClone(found);
      this.selectedTripForOrder = this.order.trip;
    }

    this.companies = this.orderService.getMockCompanies();
    this.persons = this.orderService.getMockPersons();
    this.statuses = this.orderService.getMockStatuses();
    this.trips = this.orderService.getMockTrips();
  }

  showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;
    setTimeout(() => (this.showNotification = false), 3000);
  }

  enableEdit(): void {
    if (this.order.status.name === 'Finalizată') {
      this.showEditConfirm = true;
      return;
    }
    this.isEditing = true;
  }

  confirmEnableEdit(): void {
    this.showEditConfirm = false;
    this.isEditing = true;
  }

  cancelEnableEdit(): void {
    this.showEditConfirm = false;
  }

  save(): void {
    this.order.trip = this.selectedTripForOrder;

    if (this.order.trip) {
      this.order.status = this.statuses.find(s => s.name === 'Inclusă în cursă')!;
      const trip = this.trips.find(t => t.id === this.order.trip?.id);
      if (trip) {
        if (!trip.orders) trip.orders = [];
        const alreadyInTrip = trip.orders.some(o => o.id === this.order.id);
        if (!alreadyInTrip) trip.orders.push(this.order);
      }
    } else {
      this.order.status = this.statuses.find(s => s.name === 'Inițiat')!;
    }

    this.orderService.updateOrder(this.order);
    this.isEditing = false;
    this.showToast('Comanda a fost salvată.', 'success');
  }

  cancel(): void {
    this.isEditing = false;
    const found = this.orderService.getOrderById(this.order.id);
    if (found) {
      this.order = structuredClone(found);
      this.selectedTripForOrder = this.order.trip;
    }
  }

  requestDelete(): void {
    this.showDeleteConfirm = true;
  }

  confirmDelete(): void {
    this.showDeleteConfirm = false;
    this.orderService.deleteOrder(this.order.id);
    this.showToast('Comanda a fost ștearsă.', 'success');
    this.goBack();
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
  }

  removeFromTrip(): void {
    if (this.order.trip) {
      const trip = this.trips.find(t => t.id === this.order.trip?.id);
      if (trip?.orders) {
        const idx = trip.orders.findIndex(o => o.id === this.order.id);
        if (idx !== -1) trip.orders.splice(idx, 1);
      }
      this.order.trip = undefined;
      this.selectedTripForOrder = undefined;
      this.order.status = this.statuses.find(s => s.name === 'Inițiat')!;
      this.showToast('Comanda a fost scoasă din cursă.', 'info');
    }
  }

  goBack(): void {
    this.location.back();
  }
}

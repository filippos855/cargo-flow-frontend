import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Order } from '../../models/order.model';
import { OrderService } from '../../services/order.service';
import { Trip } from '../../../trips/models/trip.model';
import { NotificationComponent } from '../../../shared/components/notification/notification.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { OrderFormComponent } from '../order-form/order-form.component';
import { TripService } from '../../../trips/services/trip.service';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NotificationComponent,
    ConfirmDialogComponent,
    OrderFormComponent
  ],
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent {
  order!: Order;
  trips: Trip[] = [];

  isEditing = false;
  selectedTripForOrder?: Trip;

  showDeleteConfirm = false;
  showEditConfirm = false;
  showRemoveConfirm = false;

  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'error' | 'info' = 'info';

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private orderService: OrderService,
    private tripService: TripService
  ) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.orderService.getOrderById(id).subscribe({
      next: found => {
        this.order = { ...found };
        this.selectedTripForOrder = this.order.trip;
      },
      error: () => {
        this.showToast('Comanda nu a fost găsită.', 'error');
      }
    });

    this.tripService.getTrips('', 'startDate', 'desc', 1, 100).subscribe({
      next: resp => {
        this.trips = resp.items;
      }
    });
  }

  showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;
    setTimeout(() => (this.showNotification = false), 3000);
  }

  enableEdit(): void {
    if (this.order.status?.name === 'Finalizată') {
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
    this.orderService.updateOrder(this.order).subscribe({
      next: () => {
        this.isEditing = false;
        this.showToast('Comanda a fost salvată.', 'success');
      },
      error: () => {
        this.showToast('Eroare la salvare.', 'error');
      }
    });
  }

  cancel(): void {
    this.isEditing = false;
    this.orderService.getOrderById(this.order.id).subscribe({
      next: refreshed => {
        this.order = { ...refreshed };
        this.selectedTripForOrder = this.order.trip;
      }
    });
  }

  requestDelete(): void {
    this.showDeleteConfirm = true;
  }

  confirmDelete(): void {
    this.showDeleteConfirm = false;
    this.orderService.deleteOrder(this.order.id).subscribe({
      next: () => {
        this.showToast('Comanda a fost ștearsă.', 'success');
        this.goBack();
      },
      error: () => {
        this.showToast('Eroare la ștergere.', 'error');
      }
    });
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
  }

  requestRemoveFromTrip(): void {
    this.showRemoveConfirm = true;
  }

  cancelRemoveFromTrip(): void {
    this.showRemoveConfirm = false;
  }

  confirmRemoveFromTrip(): void {
    this.order.trip = undefined;
    this.selectedTripForOrder = undefined;
    this.orderService.updateOrder(this.order).subscribe({
      next: () => {
        this.showToast('Comanda a fost scoasă din cursă.', 'info');
      },
      error: () => {
        this.showToast('Eroare la actualizarea comenzii.', 'error');
      }
    });
    this.showRemoveConfirm = false;
  }

  goBack(): void {
    this.location.back();
  }
}
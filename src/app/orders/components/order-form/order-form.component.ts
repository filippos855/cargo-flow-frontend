import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Company } from '../../../companies/models/company.model';
import { Person } from '../../../persons/models/person.model';
import { DictionaryItem } from '../../../shared/models/dictionary-item.model';
import { Trip } from '../../../trips/models/trip.model';
import { Order } from '../../models/order.model';
import { NotificationComponent } from '../../../shared/components/notification/notification.component';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationComponent],
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss']
})
export class OrderFormComponent {
  @Input() order!: Order;
  @Input() companies: Company[] = [];
  @Input() persons: Person[] = [];
  @Input() statuses: DictionaryItem[] = [];
  @Input() trips: Trip[] = [];
  @Input() isEditMode: boolean = false;

  @Output() save = new EventEmitter<Order>();
  @Output() cancel = new EventEmitter<void>();

  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'error' | 'info' = 'info';

  submitForm(): void {
    if (
      this.order.company &&
      this.order.deliveryPerson &&
      this.order.status &&
      this.order.address
    ) {
      this.save.emit(this.order);
    } else {
      this.showToast('Toate câmpurile obligatorii trebuie completate!', 'error');
    }
  }

  cancelForm(): void {
    this.cancel.emit();
  }

  clearTrip(): void {
    this.order.trip = undefined;
  }

  showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;
    setTimeout(() => (this.showNotification = false), 3000);
  }
}

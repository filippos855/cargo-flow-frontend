import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Invoice } from '../../models/invoice.model';
import { Company } from '../../../companies/models/company.model';
import { Order } from '../../../orders/models/order.model';
import { Trip } from '../../../trips/models/trip.model';
import { DictionaryItem } from '../../../shared/models/dictionary-item.model';
import { NotificationComponent } from '../../../shared/components/notification/notification.component';

@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationComponent],
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.scss']
})
export class InvoiceFormComponent {
  @Input() invoice!: Invoice;
  @Input() isEditMode = false;
  @Output() save = new EventEmitter<Invoice>();
  @Output() cancel = new EventEmitter<void>();

  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'error' = 'success';

  companies: Company[] = [
    { id: 1, name: 'EMAG SRL', code: 'EMAG', contactPerson: { id: 1, fullName: 'Ion Popescu' } },
    { id: 2, name: 'Altex SRL', code: 'ALTEX', contactPerson: { id: 2, fullName: 'Maria Ionescu' } }
  ];

  orders: Order[] = [
    { id: 1, number: 'EMAG001', createdDate: new Date(), company: this.companies[0], deliveryPerson: { id: 3, fullName: 'Livrator 1' }, address: 'București', status: { id: 1, name: 'Creată', dictionaryId: 1 } }
  ];

  trips: Trip[] = [
    { id: 1, number: 'TRIP001', startDate: new Date(), status: { id: 2, name: 'Planificată', dictionaryId: 2 }, transportCompany: this.companies[1] }
  ];

  invoiceTypes: DictionaryItem[] = [
    { id: 1, name: 'Emisă', dictionaryId: 10 },
    { id: 2, name: 'Primită', dictionaryId: 10 }
  ];

  statuses: DictionaryItem[] = [
    { id: 1, name: 'Neachitată', dictionaryId: 11 },
    { id: 2, name: 'Achitată', dictionaryId: 11 }
  ];

  submitForm(): void {
    if (!this.invoice.number || !this.invoice.company || !this.invoice.invoiceType || !this.invoice.status || !this.invoice.issueDate || !this.invoice.amount) {
      this.notificationMessage = 'Completează toate câmpurile obligatorii.';
      this.notificationType = 'error';
      this.showNotification = true;
      return;
    }

    const typeName = this.invoice.invoiceType.name.toLowerCase();

    if (typeName === 'emisă' && !this.invoice.order) {
      this.notificationMessage = 'Facturile emise trebuie să fie asociate unei comenzi.';
      this.notificationType = 'error';
      this.showNotification = true;
      return;
    }

    if (typeName === 'primită' && !this.invoice.trip) {
      this.notificationMessage = 'Facturile primite trebuie să fie asociate unei curse.';
      this.notificationType = 'error';
      this.showNotification = true;
      return;
    }

    if (this.invoice.order) {
      this.invoice.trip = undefined;
    } else if (this.invoice.trip) {
      this.invoice.order = undefined;
    }

    this.save.emit(this.invoice);
    this.notificationMessage = this.isEditMode ? 'Factura actualizată cu succes.' : 'Factura adăugată.';
    this.notificationType = 'success';
    this.showNotification = true;
  }

  cancelForm(): void {
    this.cancel.emit();
  }
}

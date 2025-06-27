import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Invoice } from '../../models/invoice.model';
import { Company } from '../../../companies/models/company.model';
import { Order } from '../../../orders/models/order.model';
import { Trip } from '../../../trips/models/trip.model';
import { DictionaryItem } from '../../../shared/models/dictionary-item.model';
import { NotificationComponent } from '../../../shared/components/notification/notification.component';

import { CompanyService } from '../../../companies/services/company.service';
import { OrderService } from '../../../orders/services/order.service';
import { TripService } from '../../../trips/services/trip.service';
import { DictionaryItemsService } from '../../../shared/services/dictionary-items.service';

@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationComponent],
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.scss']
})
export class InvoiceFormComponent implements OnInit {
  @Input() invoice!: Invoice;
  @Input() isEditMode = false;
  @Output() save = new EventEmitter<Invoice>();
  @Output() cancel = new EventEmitter<void>();

  companies: Company[] = [];
  orders: Order[] = [];
  trips: Trip[] = [];
  invoiceTypes: DictionaryItem[] = [];
  statuses: DictionaryItem[] = [];

  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'error' | 'info' = 'info';

  loading = true;

  constructor(
    private companyService: CompanyService,
    private orderService: OrderService,
    private tripService: TripService,
    private dictionaryItemsService: DictionaryItemsService
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.companyService.getCompanies('', 'name', 'asc', 1, 100).subscribe({
      next: resp => {
        this.companies = resp.items;
        if (this.invoice?.company) {
          const match = this.companies.find(c => c.id === this.invoice.company.id);
          if (match) this.invoice.company = match;
        }
      },
      error: () => this.showToast('Eroare la încărcarea firmelor.', 'error')
    });

    this.orderService.getOrders('', 'createdDate', 'desc', 1, 100).subscribe({
      next: resp => {
        this.orders = resp.items;
        if (this.invoice?.order) {
          const match = this.orders.find(o => o.id === this.invoice.order?.id);
          if (match) this.invoice.order = match;
        }
      },
      error: () => this.showToast('Eroare la încărcarea comenzilor.', 'error')
    });

    this.tripService.getTrips('', 'startDate', 'desc', 1, 100).subscribe({
      next: resp => {
        this.trips = resp.items;
        if (this.invoice?.trip) {
          const match = this.trips.find(t => t.id === this.invoice.trip?.id);
          if (match) this.invoice.trip = match;
        }
      },
      error: () => this.showToast('Eroare la încărcarea curselor.', 'error')
    });

    this.dictionaryItemsService.getDictionaryItemsByName('Tip factura').subscribe({
      next: resp => {
        this.invoiceTypes = resp;
        if (this.invoice?.invoiceType) {
          const match = this.invoiceTypes.find(s => s.id === this.invoice.invoiceType.id);
          if (match) this.invoice.invoiceType = match;
        }
      },
      error: () => this.showToast('Eroare la încărcarea tipurilor de factură.', 'error')
    });

    this.dictionaryItemsService.getDictionaryItemsByName('Status facturi').subscribe({
      next: resp => {
        this.statuses = resp;
        if (this.invoice?.status) {
          const match = this.statuses.find(s => s.id === this.invoice.status.id);
          if (match) this.invoice.status = match;
        }
        this.loading = false;
      },
      error: () => this.showToast('Eroare la încărcarea statusurilor.', 'error')
    });
  }

  submitForm(): void {
    if (
      !this.invoice.number ||
      !this.invoice.company ||
      !this.invoice.invoiceType ||
      !this.invoice.status ||
      !this.invoice.issueDate ||
      !this.invoice.amount
    ) {
      this.showToast('Completează toate câmpurile obligatorii.', 'error');
      return;
    }

    const typeName = this.invoice.invoiceType.name?.toLowerCase();

    if (typeName === 'Emisa' && !this.invoice.order) {
      this.showToast('Facturile emise trebuie să fie asociate unei comenzi.', 'error');
      return;
    }
    if (typeName === 'Primita' && !this.invoice.trip) {
      this.showToast('Facturile primite trebuie să fie asociate unei curse.', 'error');
      return;
    }

    if (this.invoice.order) {
      this.invoice.trip = undefined;
    } else if (this.invoice.trip) {
      this.invoice.order = undefined;
    }

    this.save.emit(this.invoice);
    this.showToast(this.isEditMode ? 'Factura actualizată cu succes.' : 'Factura adăugată.', 'success');
  }

  cancelForm(): void {
    this.cancel.emit();
  }

  private showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;
    setTimeout(() => (this.showNotification = false), 3000);
  }
}

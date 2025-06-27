import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Company } from '../../../companies/models/company.model';
import { Person } from '../../../persons/models/person.model';
import { DictionaryItem } from '../../../shared/models/dictionary-item.model';
import { Trip } from '../../../trips/models/trip.model';
import { Order } from '../../models/order.model';
import { CompanyService } from '../../../companies/services/company.service';
import { PersonService } from '../../../persons/services/person.service';
import { DictionaryItemsService } from '../../../shared/services/dictionary-items.service';
import { NotificationComponent } from '../../../shared/components/notification/notification.component';
import { TripService } from '../../../trips/services/trip.service';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationComponent],
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss']
})
export class OrderFormComponent implements OnInit {
  @Input() order!: Order;
  @Input() isEditMode: boolean = false;
  @Output() save = new EventEmitter<Order>();
  @Output() cancel = new EventEmitter<void>();

  companies: Company[] = [];
  persons: Person[] = [];
  statuses: DictionaryItem[] = [];
  trips: Trip[] = [];

  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'error' | 'info' = 'info';

  constructor(
    private companyService: CompanyService,
    private personService: PersonService,
    private dictionaryItemsService: DictionaryItemsService,
    private tripService: TripService
  ) {}

  ngOnInit(): void {
    this.companyService.getCompanies('', 'name', 'asc', 1, 100).subscribe({
      next: resp => {
        this.companies = resp.items;
        if (this.order?.company) {
          const match = this.companies.find(c => c.id === this.order.company.id);
          if (match) this.order.company = match;
        }
      },
      error: () => this.showToast('Eroare la încărcarea firmelor.', 'error')
    });
  
    this.personService.getAllPersons().subscribe({
      next: resp => {
        this.persons = resp;
        if (this.order?.deliveryPerson) {
          const match = this.persons.find(p => p.id === this.order.deliveryPerson.id);
          if (match) this.order.deliveryPerson = match;
        }
      },
      error: () => this.showToast('Eroare la încărcarea persoanelor.', 'error')
    });
  
    this.dictionaryItemsService.getDictionaryItemsByName('Status comenzi').subscribe({
      next: resp => {
        this.statuses = resp;
        if (this.order?.status) {
          const match = this.statuses.find(s => s.id === this.order.status.id);
          if (match) this.order.status = match;
        }
      },
      error: () => this.showToast('Eroare la încărcarea statusurilor.', 'error')
    });

    this.tripService.getTrips('', 'startDate', 'desc', 1, 100).subscribe({
      next: resp => {
        this.trips = resp.items;
        if (this.order?.trip && this.order.trip.id) {
          const match = this.trips.find(t => t.id === this.order.trip?.id);
          this.order.trip = match ?? undefined;
        } 
        else if ((this.order as any).tripId) {
          const match = this.trips.find(t => t.id === (this.order as any).tripId);
          if (match) this.order.trip = match;
        }
      },
      error: () => this.showToast('Eroare la încărcarea curselor.', 'error')
});

  }

  submitForm(): void {
    if (
      !this.order.company ||
      !this.order.deliveryPerson ||
      !this.order.status ||
      !this.order.address
    ) {
      this.showToast('Toate câmpurile obligatorii trebuie completate!', 'error');
      return;
    }

    this.save.emit(this.order);
    this.showToast(this.isEditMode ? 'Comanda actualizată' : 'Comanda adăugată', 'success');
  }

  cancelForm(): void {
    this.cancel.emit();
  }

  clearTrip(): void {
    this.order.trip = undefined;
  }

  private showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;
    setTimeout(() => (this.showNotification = false), 3000);
  }
}

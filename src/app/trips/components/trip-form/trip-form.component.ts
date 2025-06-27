import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Company } from '../../../companies/models/company.model';
import { Person } from '../../../persons/models/person.model';
import { FleetVehicle } from '../../../fleet/models/fleet-vehicle.model';
import { DictionaryItem } from '../../../shared/models/dictionary-item.model';
import { Trip } from '../../models/trip.model';
import { CompanyService } from '../../../companies/services/company.service';
import { PersonService } from '../../../persons/services/person.service';
import { FleetService } from '../../../fleet/services/fleet.service';
import { DictionaryItemsService } from '../../../shared/services/dictionary-items.service';
import { NotificationComponent } from '../../../shared/components/notification/notification.component';

@Component({
  selector: 'app-trip-form',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationComponent],
  templateUrl: './trip-form.component.html',
  styleUrls: ['./trip-form.component.scss']
})
export class TripFormComponent implements OnInit {
  @Input() trip!: Trip;
  @Input() isEditMode: boolean = false;
  @Output() save = new EventEmitter<Trip>();
  @Output() cancel = new EventEmitter<void>();

  companies: Company[] = [];
  persons: Person[] = [];
  vehicles: FleetVehicle[] = [];
  statuses: DictionaryItem[] = [];

  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'error' | 'info' = 'info';

  constructor(
    private companyService: CompanyService,
    private personService: PersonService,
    private fleetService: FleetService,
    private dictionaryItemsService: DictionaryItemsService
  ) {}

  ngOnInit(): void {
    this.companyService.getCompanies('', 'name', 'asc', 1, 100).subscribe({
      next: resp => {
        this.companies = resp.items;
        if (this.trip?.transportCompany) {
          const match = this.companies.find(c => c.id === this.trip.transportCompany.id);
          if (match) this.trip.transportCompany = match;
        }
      },
      error: () => this.showToast('Eroare la încărcarea firmelor.', 'error')
    });

    this.personService.getAllPersons().subscribe({
      next: resp => {
        this.persons = resp;
        if (this.trip?.driver) {
          const match = this.persons.find(p => p.id === this.trip.driver?.id);
          if (match) this.trip.driver = match;
        }
      },
      error: () => this.showToast('Eroare la încărcarea șoferilor.', 'error')
    });

    this.fleetService.getFleet('', 'identifier', 'asc', 1, 100).subscribe({
      next: resp => {
        this.vehicles = resp.items;
        if (this.trip?.tractorUnit) {
          const match = this.vehicles.find(v => v.id === this.trip.tractorUnit?.id);
          if (match) this.trip.tractorUnit = match;
        }
        if (this.trip?.trailer) {
          const match = this.vehicles.find(v => v.id === this.trip.trailer?.id);
          if (match) this.trip.trailer = match;
        }
      },
      error: () => this.showToast('Eroare la încărcarea vehiculelor.', 'error')
    });

    this.dictionaryItemsService.getDictionaryItemsByName('Status curse').subscribe({
      next: resp => {
        this.statuses = resp;
        if (this.trip?.status) {
          const match = this.statuses.find(s => s.id === this.trip.status.id);
          if (match) this.trip.status = match;
        }
      },
      error: () => this.showToast('Eroare la încărcarea statusurilor.', 'error')
    });
  }

  submitForm(): void {
    if (!this.trip.transportCompany || !this.trip.status || !this.trip.startDate) {
      this.showToast('Toate câmpurile obligatorii trebuie completate!', 'error');
      return;
    }
    this.save.emit(this.trip);
    this.showToast(this.isEditMode ? 'Cursă actualizată' : 'Cursă adăugată', 'success');
  }

  cancelForm(): void {
    this.cancel.emit();
  }

  clearTractor(): void {
    this.trip.tractorUnit = undefined;
  }

  clearTrailer(): void {
    this.trip.trailer = undefined;
  }

  private showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;
    setTimeout(() => (this.showNotification = false), 3000);
  }
}

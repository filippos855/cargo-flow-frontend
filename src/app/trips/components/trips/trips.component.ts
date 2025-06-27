import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TripService } from '../../services/trip.service';
import { Trip } from '../../models/trip.model';
import { TripFormComponent } from '../trip-form/trip-form.component';
import { NotificationComponent } from '../../../shared/components/notification/notification.component';
import { Company } from '../../../companies/models/company.model';
import { Person } from '../../../persons/models/person.model';
import { FleetVehicle } from '../../../fleet/models/fleet-vehicle.model';
import { DictionaryItem } from '../../../shared/models/dictionary-item.model';

@Component({
  selector: 'app-trips',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TripFormComponent,
    NotificationComponent
  ],
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.scss']
})
export class TripsComponent implements OnInit {
  trips: Trip[] = [];
  totalCount = 0;
  isAdding = false;
  newTrip!: Trip;

  companies: Company[] = [];
  persons: Person[] = [];
  vehicles: FleetVehicle[] = [];
  statuses: DictionaryItem[] = [];

  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'info' | 'error' = 'success';

  searchTerm = '';
  filterStartDateFrom?: string;
  filterStartDateTo?: string;

  sortKey: 'number' | 'startDate' | 'driver' = 'startDate';
  sortDirection: 'asc' | 'desc' = 'asc';
  currentPage = 1;
  pageSize = 15;

  constructor(private tripService: TripService) {}

  ngOnInit(): void {
    this.loadTrips();
  }

  loadTrips(): void {
    this.tripService.getTrips(
      this.searchTerm,
      this.sortKey,
      this.sortDirection,
      this.currentPage,
      this.pageSize,
      this.filterStartDateFrom,
      this.filterStartDateTo
    ).subscribe({
      next: (response) => {
        this.trips = response.items;
        this.totalCount = response.totalCount;
      },
      error: () => {
        this.showToast('Eroare la încărcarea curselor.', 'error');
      }
    });
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadTrips();
  }

  setSort(key: 'number' | 'startDate' | 'driver'): void {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }
    this.loadTrips();
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  changePage(offset: number): void {
    const nextPage = this.currentPage + offset;
    if (nextPage >= 1 && nextPage <= this.totalPages) {
      this.currentPage = nextPage;
      this.loadTrips();
    }
  }

  addTrip(): void {
    this.isAdding = true;
    this.newTrip = {
      id: 0,
      number: '',
      startDate: new Date(),
      status: {} as DictionaryItem,
      transportCompany: {} as Company,
      orders: []
    };
  }

  saveNewTrip(trip: Trip): void {
    this.tripService.addTrip(trip).subscribe({
      next: () => {
        this.loadTrips();
        this.isAdding = false;
        this.showToast('Cursa a fost adăugată cu succes.', 'success');
      },
      error: () => {
        this.showToast('Eroare la adăugare.', 'error');
      }
    });
  }

  cancelNewTrip(): void {
    this.isAdding = false;
    this.showToast('Adăugarea cursei a fost anulată.', 'info');
  }

  private showToast(message: string, type: 'success' | 'info' | 'error') {
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;
    setTimeout(() => (this.showNotification = false), 3000);
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Trip } from '../../models/trip.model';
import { TripService } from '../../services/trip.service';
import { FormsModule } from '@angular/forms';
import { NotificationComponent } from '../../../shared/components/notification/notification.component';
import { TripFormComponent } from '../trip-form/trip-form.component';
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
  isAdding = false;
  newTrip!: Trip;

  companies: Company[] = [];
  persons: Person[] = [];
  vehicles: FleetVehicle[] = [];
  statuses: DictionaryItem[] = [];

  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'info' |'error' = 'success';

  searchTerm = '';
  filterStartDateFrom?: string;
  filterStartDateTo?: string;

  sortKey: 'number' | 'startDate' | 'driver' = 'startDate';
  sortDirection: 'asc' | 'desc' = 'asc';
  currentPage = 1;
  pageSize = 15;

  constructor(private tripService: TripService) {}

  ngOnInit(): void {
    this.companies = this.tripService.getMockCompanies?.() ?? [];
    this.persons = this.tripService.getMockPersons?.() ?? [];
    this.vehicles = this.tripService.getMockFleet?.() ?? [];
    this.statuses = this.tripService.getMockTripStatuses?.() ?? [];

    this.loadTrips();
  }

  loadTrips(): void {
    this.tripService.getTrips().subscribe(data => {
      this.trips = data;
    });
  }

  get filteredTrips(): Trip[] {
    const search = this.searchTerm.toLowerCase();
    const from = this.filterStartDateFrom ? new Date(this.filterStartDateFrom) : null;
    const to = this.filterStartDateTo ? new Date(this.filterStartDateTo) : null;

    const filtered = this.trips.filter(t => {
      const matchesSearch =
        t.number.toLowerCase().includes(search) ||
        t.transportCompany.name.toLowerCase().includes(search) ||
        t.driver?.fullName?.toLowerCase().includes(search) ||
        t.status.name.toLowerCase().includes(search);

      const matchesFrom = !from || new Date(t.startDate) >= from;
      const matchesTo = !to || new Date(t.startDate) <= to;

      return matchesSearch && matchesFrom && matchesTo;
    });

    const sorted = [...filtered].sort((a, b) => {
      let aVal = this.sortKey === 'driver'
        ? a.driver?.fullName ?? ''
        : a[this.sortKey];
      let bVal = this.sortKey === 'driver'
        ? b.driver?.fullName ?? ''
        : b[this.sortKey];

      return this.sortDirection === 'asc'
        ? (aVal < bVal ? -1 : aVal > bVal ? 1 : 0)
        : (aVal > bVal ? -1 : aVal < bVal ? 1 : 0);
    });

    const start = (this.currentPage - 1) * this.pageSize;
    return sorted.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    const total = this.filteredTrips.length;
    return Math.ceil(total / this.pageSize);
  }

  setSort(key: 'number' | 'startDate' | 'driver'): void {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }
  }

  changePage(offset: number): void {
    const nextPage = this.currentPage + offset;
    if (nextPage >= 1 && nextPage <= this.totalPages) {
      this.currentPage = nextPage;
    }
  }

  addTrip(): void {
    this.isAdding = true;
    this.newTrip = {
      id: 0,
      number: `TRIP${Math.floor(Math.random() * 1000)}`,
      startDate: new Date(),
      status: {} as DictionaryItem,
      transportCompany: {} as Company,
      orders: []
    };
  }

  saveNewTrip(trip: Trip): void {
    this.tripService.addMockTrip(trip);
    this.loadTrips();
    this.isAdding = false;

    this.notificationMessage = 'Cursa a fost adăugată cu succes.';
    this.notificationType = 'success';
    this.showNotification = true;
  }

  cancelNewTrip(): void {
    this.isAdding = false;

    this.notificationMessage = 'Adăugarea cursei a fost anulată.';
    this.notificationType = 'info';
    this.showNotification = true;
  }
}

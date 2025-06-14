import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TripService } from '../../services/trip.service';
import { Trip } from '../../models/trip.model';
import { Observable, switchMap } from 'rxjs';
import { TripFormComponent } from '../trip-form/trip-form.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { NotificationComponent } from '../../../shared/components/notification/notification.component';
import { Company } from '../../../companies/models/company.model';
import { Person } from '../../../persons/models/person.model';
import { FleetVehicle } from '../../../fleet/models/fleet-vehicle.model';
import { DictionaryItem } from '../../../shared/models/dictionary-item.model';

@Component({
  selector: 'app-trip-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TripFormComponent,
    ConfirmDialogComponent,
    NotificationComponent
  ],
  templateUrl: './trip-details.component.html',
  styleUrls: ['./trip-details.component.scss']
})
export class TripDetailsComponent implements OnInit {
  trip$!: Observable<Trip | null>;
  trip!: Trip;

  isEditing = false;
  showDeleteConfirm = false;
  showEditConfirm = false;
  showFinalizedDeleteConfirm = false;
  showFinalizedIncludeConfirm = false;
  showFinalizedExcludeConfirmId: number | null = null;

  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'error' = 'success';

  companies: Company[] = [];
  persons: Person[] = [];
  vehicles: FleetVehicle[] = [];
  statuses: DictionaryItem[] = [];

  availableOrders = this.tripService.getMockAvailableOrders?.() ?? [];
  selectedOrderForTrip: any = undefined;
  showOrderSelector = false;

  // 🔍🔢🔁 Căutare, sortare, paginare (manuală)
  searchTerm = '';
  filtered: any[] = [];
  sortKey: 'number' | 'company' | 'createdDate' = 'createdDate';
  sortDirection: 'asc' | 'desc' = 'asc';
  currentPage = 1;
  pageSize = 10;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private tripService: TripService
  ) {}

  ngOnInit(): void {
    this.companies = this.tripService.getMockCompanies?.() ?? [];
    this.persons = this.tripService.getMockPersons?.() ?? [];
    this.vehicles = this.tripService.getMockFleet?.() ?? [];
    this.statuses = this.tripService.getMockTripStatuses?.() ?? [];

    this.trip$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        return this.tripService.getTripById(id);
      })
    );

    this.trip$.subscribe(trip => {
      if (trip) {
        this.trip = structuredClone(trip);
        this.applyFilters();
      }
    });
  }

  applyFilters(): void {
    const all = this.trip.orders ?? [];

    let result = all.filter(order =>
      order.number.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      order.company.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    result = result.sort((a, b) => {
      const aVal = this.sortKey === 'company' ? a.company.name : a[this.sortKey];
      const bVal = this.sortKey === 'company' ? b.company.name : b[this.sortKey];

      return this.sortDirection === 'asc'
        ? (aVal < bVal ? -1 : aVal > bVal ? 1 : 0)
        : (aVal > bVal ? -1 : aVal < bVal ? 1 : 0);
    });

    this.currentPage = 1;
    this.filtered = result;
  }

  get paginatedOrders(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filtered.length / this.pageSize);
  }

  setSort(key: 'number' | 'company' | 'createdDate'): void {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  changePage(offset: number): void {
    const nextPage = this.currentPage + offset;
    if (nextPage >= 1 && nextPage <= this.totalPages) {
      this.currentPage = nextPage;
    }
  }

  goBack(): void {
    this.location.back();
  }

  enableEdit(): void {
    if (this.trip.status.name === 'Finalizat') {
      this.showEditConfirm = true;
    } else {
      this.isEditing = true;
    }
  }

  confirmEnableEdit(): void {
    this.isEditing = true;
    this.showEditConfirm = false;
  }

  cancelEnableEdit(): void {
    this.showEditConfirm = false;
  }

  requestDelete(): void {
    if (this.trip.status.name === 'Finalizat') {
      this.showFinalizedDeleteConfirm = true;
    } else {
      this.showDeleteConfirm = true;
    }
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.showFinalizedDeleteConfirm = false;
  }

  confirmDelete(): void {
    this.tripService.deleteTripById(this.trip.id);
    this.notificationMessage = 'Cursa a fost ștearsă.';
    this.notificationType = 'success';
    this.showNotification = true;
    this.goBack();
  }

  save(): void {
    this.tripService.updateTrip(this.trip);
    this.isEditing = false;
    this.notificationMessage = 'Cursa a fost salvată cu succes.';
    this.notificationType = 'success';
    this.showNotification = true;
  }

  cancel(): void {
    this.isEditing = false;
    this.ngOnInit();
  }

  toggleOrderSelector(): void {
    this.showOrderSelector = !this.showOrderSelector;
  }

  includeOrder(): void {
    if (!this.selectedOrderForTrip) return;

    if (this.trip.status.name === 'Finalizat') {
      this.showFinalizedIncludeConfirm = true;
      return;
    }

    this._includeOrderNow();
  }

  confirmIncludeOrder(): void {
    this._includeOrderNow();
    this.showFinalizedIncludeConfirm = false;
  }

  cancelIncludeOrder(): void {
    this.showFinalizedIncludeConfirm = false;
  }

  private _includeOrderNow(): void {
    this.trip.orders = this.trip.orders ?? [];
    this.trip.orders.push(this.selectedOrderForTrip);

    this.notificationMessage = 'Comanda a fost inclusă în cursă.';
    this.notificationType = 'success';
    this.showNotification = true;

    this.selectedOrderForTrip = undefined;
    this.showOrderSelector = false;

    this.applyFilters();
  }

  excludeOrder(orderId: number): void {
    if (this.trip.status.name === 'Finalizat') {
      this.showFinalizedExcludeConfirmId = orderId;
      return;
    }

    this._excludeOrderNow(orderId);
  }

  confirmExcludeOrder(): void {
    if (this.showFinalizedExcludeConfirmId !== null) {
      this._excludeOrderNow(this.showFinalizedExcludeConfirmId);
      this.showFinalizedExcludeConfirmId = null;
    }
  }

  cancelExcludeOrder(): void {
    this.showFinalizedExcludeConfirmId = null;
  }

  private _excludeOrderNow(orderId: number): void {
    this.trip.orders = this.trip.orders?.filter(o => o.id !== orderId);

    this.notificationMessage = 'Comanda a fost exclusă din cursă.';
    this.notificationType = 'success';
    this.showNotification = true;

    this.applyFilters();
  }
}
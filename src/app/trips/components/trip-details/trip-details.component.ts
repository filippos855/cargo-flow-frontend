import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TripService } from '../../services/trip.service';
import { Trip } from '../../models/trip.model';
import { TripFormComponent } from '../trip-form/trip-form.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { NotificationComponent } from '../../../shared/components/notification/notification.component';
import { Company } from '../../../companies/models/company.model';
import { Person } from '../../../persons/models/person.model';
import { FleetVehicle } from '../../../fleet/models/fleet-vehicle.model';
import { DictionaryItem } from '../../../shared/models/dictionary-item.model';
import { Order } from '../../../orders/models/order.model';
import { OrderService } from '../../../orders/services/order.service';

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

  availableOrders: Order[] = [];
  selectedOrderForTrip: Order | undefined = undefined;
  showOrderSelector = false;

  searchTerm = '';
  sortKey: 'number' | 'company' | 'createdDate' = 'createdDate';
  sortDirection: 'asc' | 'desc' = 'asc';
  currentPage = 1;
  pageSize = 10;
  filtered: Order[] = [];

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private tripService: TripService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadTrip();
    this.loadAvailableOrders();
  }

  loadTrip(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.tripService.getTripById(id).subscribe({
      next: trip => {
        this.trip = trip;
        this.applyFilters();
      },
      error: () => {
        this.notificationMessage = 'Cursa nu a fost găsită.';
        this.notificationType = 'error';
        this.showNotification = true;
      }
    });
  }

  loadAvailableOrders(): void {
    this.orderService.getOrders('', 'createdDate', 'asc', 1, 100).subscribe({
      next: (response) => {
        this.availableOrders = response.items.filter(o => !o.trip);
      },
      error: () => {
        this.availableOrders = [];
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

  get paginatedOrders(): Order[] {
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
      this.applyFilters();
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
    if (this.trip.status.name === 'Finalizata') {
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
    this.tripService.deleteTripById(this.trip.id).subscribe({
      next: () => {
        this.notificationMessage = 'Cursa a fost ștearsă.';
        this.notificationType = 'success';
        this.showNotification = true;
        this.goBack();
      },
      error: () => {
        this.notificationMessage = 'Eroare la ștergere.';
        this.notificationType = 'error';
        this.showNotification = true;
      }
    });
  }

  save(): void {
    this.tripService.updateTrip(this.trip).subscribe({
      next: () => {
        this.isEditing = false;
        this.notificationMessage = 'Cursa a fost salvată cu succes.';
        this.notificationType = 'success';
        this.showNotification = true;
        this.loadTrip();
        this.loadAvailableOrders();
      },
      error: () => {
        this.notificationMessage = 'Eroare la salvare.';
        this.notificationType = 'error';
        this.showNotification = true;
      }
    });
  }

  cancel(): void {
    this.isEditing = false;
    this.loadTrip();
    this.loadAvailableOrders();
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
    if (!this.selectedOrderForTrip) return;
    this.tripService.addOrderToTrip(this.trip.id, this.selectedOrderForTrip.id).subscribe({
      next: () => {
        this.notificationMessage = 'Comanda a fost inclusă în cursă.';
        this.notificationType = 'success';
        this.showNotification = true;
        this.selectedOrderForTrip = undefined;
        this.showOrderSelector = false;
        this.loadTrip();
        this.loadAvailableOrders();
      },
      error: () => {
        this.notificationMessage = 'Eroare la includere comandă.';
        this.notificationType = 'error';
        this.showNotification = true;
      }
    });
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
    this.tripService.removeOrderFromTrip(this.trip.id, orderId).subscribe({
      next: () => {
        this.notificationMessage = 'Comanda a fost exclusă din cursă.';
        this.notificationType = 'success';
        this.showNotification = true;
        this.loadTrip();
        this.loadAvailableOrders();
      },
      error: () => {
        this.notificationMessage = 'Eroare la excludere comandă.';
        this.notificationType = 'error';
        this.showNotification = true;
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FleetService } from '../../services/fleet.service';
import { FleetVehicle } from '../../models/fleet-vehicle.model';
import { DictionaryItem } from '../../../shared/models/dictionary-item.model';
import { NotificationComponent } from '../../../shared/components/notification/notification.component';
import { FleetFormComponent } from '../fleet-form/fleet-form.component';

@Component({
  selector: 'app-fleet',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NotificationComponent, FleetFormComponent],
  templateUrl: './fleet.component.html',
  styleUrls: ['./fleet.component.scss']
})
export class FleetComponent implements OnInit {
  fleet: FleetVehicle[] = [];
  totalCount = 0;
  isAdding = false;
  newVehicle!: FleetVehicle;

  searchTerm = '';
  filterItpExpired = false;
  filterRcaExpired = false;
  filterAvailable = false;

  currentPage = 1;
  pageSize = 10;

  sortKey: keyof FleetVehicle | 'type' = 'identifier';
  sortDirection: 'asc' | 'desc' = 'asc';

  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'info' | 'error' = 'success';

  constructor(private fleetService: FleetService) {}

  ngOnInit(): void {
    this.loadFleet();
  }

  loadFleet(): void {
    this.fleetService.getFleet(
      this.searchTerm,
      this.sortKey,
      this.sortDirection,
      this.currentPage,
      this.pageSize,
      this.filterItpExpired,
      this.filterRcaExpired,
      this.filterAvailable
    ).subscribe({
      next: (response) => {
        this.fleet = response.items;
        this.totalCount = response.totalCount;
      },
      error: () => {
        this.showToast('Eroare la încărcarea flotei.', 'error');
      }
    });
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadFleet();
  }

  setSort(key: keyof FleetVehicle | 'type'): void {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }
    this.loadFleet();
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  changePage(offset: number): void {
    const nextPage = this.currentPage + offset;
    if (nextPage >= 1 && nextPage <= this.totalPages) {
      this.currentPage = nextPage;
      this.loadFleet();
    }
  }

  addVehicle(): void {
    this.isAdding = true;
    this.newVehicle = {
      id: 0,
      identifier: '',
      type: {} as DictionaryItem,
      itpExpiration: new Date(),
      rcaExpiration: new Date(),
      isAvailable: true
    };
  }

  saveNewVehicle(vehicle: FleetVehicle): void {
    this.fleetService.addVehicle(vehicle).subscribe({
      next: () => {
        this.loadFleet();
        this.isAdding = false;
        this.showToast('Vehiculul a fost adăugat.', 'success');
      },
      error: () => {
        this.showToast('Eroare la adăugare.', 'error');
      }
    });
  }

  cancelNewVehicle(): void {
    this.isAdding = false;
    this.showToast('Adăugarea a fost anulată.', 'info');
  }

  private showToast(message: string, type: 'success' | 'info' | 'error') {
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;
    setTimeout(() => (this.showNotification = false), 3000);
  }
}

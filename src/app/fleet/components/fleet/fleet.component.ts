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
  filtered: FleetVehicle[] = [];
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
    this.fleet = this.fleetService.getFleet();
    this.applyFilters();
  }

  applyFilters(): void {
    const search = this.searchTerm.toLowerCase();
    const now = new Date();

    let result = this.fleet.filter(v =>
      v.identifier.toLowerCase().includes(search) ||
      v.type.name.toLowerCase().includes(search)
    );

    if (this.filterItpExpired) {
      result = result.filter(v => new Date(v.itpExpiration) < now);
    }

    if (this.filterRcaExpired) {
      result = result.filter(v => new Date(v.rcaExpiration) < now);
    }

    if (this.filterAvailable) {
      result = result.filter(v => v.isAvailable);
    }

    result.sort((a, b) => {
      let aVal: any;
      let bVal: any;

      if (this.sortKey === 'type') {
        aVal = a.type.name;
        bVal = b.type.name;
      } else {
        aVal = a[this.sortKey];
        bVal = b[this.sortKey];
      }

      return this.sortDirection === 'asc'
        ? aVal > bVal ? 1 : aVal < bVal ? -1 : 0
        : aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
    });

    this.currentPage = 1;
    this.filtered = result;
  }

  setSort(key: keyof FleetVehicle | 'type'): void {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }

    this.applyFilters();
  }

  get paginatedFleet(): FleetVehicle[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filtered.length / this.pageSize);
  }

  changePage(offset: number): void {
    const nextPage = this.currentPage + offset;
    if (nextPage >= 1 && nextPage <= this.totalPages) {
      this.currentPage = nextPage;
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
    this.fleetService.addVehicle(vehicle);
    this.loadFleet();
    this.isAdding = false;
    this.showNotification = true;
    this.notificationMessage = 'Vehiculul a fost adăugat cu succes.';
    this.notificationType = 'success';
  }

  cancelNewVehicle(): void {
    this.isAdding = false;
    this.showNotification = true;
    this.notificationMessage = 'Adăugarea vehiculului a fost anulată.';
    this.notificationType = 'info';
  }
}

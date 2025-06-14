import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Trip } from '../../models/trip.model';
import { Company } from '../../../companies/models/company.model';
import { Person } from '../../../persons/models/person.model';
import { FleetVehicle } from '../../../fleet/models/fleet-vehicle.model';
import { DictionaryItem } from '../../../shared/models/dictionary-item.model';
import { NotificationComponent } from '../../../shared/components/notification/notification.component';

@Component({
  selector: 'app-trip-form',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationComponent],
  templateUrl: './trip-form.component.html',
  styleUrls: ['./trip-form.component.scss']
})
export class TripFormComponent {
  @Input() trip!: Trip;
  @Input() companies: Company[] = [];
  @Input() persons: Person[] = [];
  @Input() vehicles: FleetVehicle[] = [];
  @Input() statuses: DictionaryItem[] = [];
  @Input() isEditMode = false;

  @Output() save = new EventEmitter<Trip>();
  @Output() cancel = new EventEmitter<void>();

  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'error' = 'success';

  submitForm(): void {
    if (!this.trip.transportCompany || !this.trip.status || !this.trip.startDate) {
      this.notificationMessage = 'Completează toate câmpurile obligatorii';
      this.notificationType = 'error';
      this.showNotification = true;
      return;
    }

    this.save.emit(this.trip);
    this.notificationMessage = this.isEditMode ? 'Cursă salvată cu succes' : 'Cursă adăugată cu succes';
    this.notificationType = 'success';
    this.showNotification = true;
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
}

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FleetVehicle } from '../../models/fleet-vehicle.model';
import { DictionaryItem } from '../../../shared/models/dictionary-item.model';
import { NotificationComponent } from '../../../shared/components/notification/notification.component';

@Component({
  selector: 'app-fleet-form',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationComponent],
  templateUrl: './fleet-form.component.html',
  styleUrls: ['./fleet-form.component.scss']
})
export class FleetFormComponent {
  @Input() vehicle!: FleetVehicle;
  @Input() isEditMode = false;
  @Output() save = new EventEmitter<FleetVehicle>();
  @Output() cancel = new EventEmitter<void>();

  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'error' = 'success';

  typeOptions: DictionaryItem[] = [
    { id: 1, name: 'Tractor', dictionaryId: 3 },
    { id: 2, name: 'Trailer', dictionaryId: 3 }
  ];

  submitForm(): void {
    if (!this.vehicle.identifier || !this.vehicle.type) {
      this.notificationMessage = 'Completează toate câmpurile obligatorii';
      this.notificationType = 'error';
      this.showNotification = true;
      return;
    }

    this.save.emit(this.vehicle);
    this.notificationMessage = this.isEditMode ? 'Vehicul actualizat' : 'Vehicul adăugat';
    this.notificationType = 'success';
    this.showNotification = true;
  }

  cancelForm(): void {
    this.cancel.emit();
  }
}

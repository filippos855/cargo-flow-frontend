import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FleetVehicle } from '../../models/fleet-vehicle.model';
import { DictionaryItem } from '../../../shared/models/dictionary-item.model';
import { NotificationComponent } from '../../../shared/components/notification/notification.component';
import { DictionaryItemsService } from '../../../shared/services/dictionary-items.service';

@Component({
  selector: 'app-fleet-form',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationComponent],
  templateUrl: './fleet-form.component.html',
  styleUrls: ['./fleet-form.component.scss'],
  providers: [DictionaryItemsService]
})
export class FleetFormComponent implements OnInit {
  @Input() vehicle!: FleetVehicle;
  @Input() isEditMode = false;
  @Output() save = new EventEmitter<FleetVehicle>();
  @Output() cancel = new EventEmitter<void>();

  typeOptions: DictionaryItem[] = [];

  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'error' = 'success';

  constructor(private DictionaryItemsService: DictionaryItemsService) {}

  ngOnInit(): void {
    this.DictionaryItemsService.getDictionaryItemsByName('Tip vehicul').subscribe({
      next: (items) => {
        this.typeOptions = items;

        const selectedId = this.vehicle?.type?.id;
        if (selectedId) {
          const match = items.find(t => t.id === selectedId);
          if (match) {
            this.vehicle.type = match;
          }
        }
      },
      error: () => this.showToast('Eroare la încărcarea tipurilor de vehicul.', 'error')
    });
  }

  submitForm(): void {
    if (!this.vehicle.identifier || !this.vehicle.type || !this.vehicle.itpExpiration || !this.vehicle.rcaExpiration) {
      this.showToast('Completează toate câmpurile obligatorii', 'error');
      return;
    }

    this.save.emit(this.vehicle);
    this.showToast(this.isEditMode ? 'Vehicul actualizat' : 'Vehicul adăugat', 'success');
  }

  cancelForm(): void {
    this.cancel.emit();
  }

  private showToast(message: string, type: 'success' | 'error') {
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;
    setTimeout(() => (this.showNotification = false), 3000);
  }
}

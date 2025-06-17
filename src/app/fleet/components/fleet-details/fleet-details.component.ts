import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { FleetVehicle } from '../../models/fleet-vehicle.model';
import { FleetService } from '../../services/fleet.service';
import { TripService } from '../../../trips/services/trip.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { NotificationComponent } from '../../../shared/components/notification/notification.component';
import { FleetFormComponent } from '../fleet-form/fleet-form.component';

@Component({
  selector: 'app-fleet-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    FleetFormComponent,
    ConfirmDialogComponent,
    NotificationComponent
  ],
  templateUrl: './fleet-details.component.html',
  styleUrls: ['./fleet-details.component.scss']
})
export class FleetDetailsComponent {
  vehicle!: FleetVehicle;
  isEditing = false;

  showDeleteConfirm = false;
  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'error' = 'success';

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private fleetService: FleetService,
    private tripService: TripService
  ) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.fleetService.getVehicleById(id).subscribe({
      next: (v) => {
        this.vehicle = { ...v };
      },
      error: () => {
        this.notificationMessage = 'Vehiculul nu a fost găsit.';
        this.notificationType = 'error';
        this.showNotification = true;
      }
    });
  }

  enableEdit(): void {
    this.isEditing = true;
  }

  save(): void {
    this.fleetService.updateVehicle(this.vehicle).subscribe({
      next: () => {
        this.isEditing = false;
        this.notificationMessage = 'Vehiculul a fost salvat cu succes.';
        this.notificationType = 'success';
        this.showNotification = true;
      },
      error: () => {
        this.notificationMessage = 'Eroare la salvare.';
        this.notificationType = 'error';
        this.showNotification = true;
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  requestDelete(): void {
    this.showDeleteConfirm = true;
  }

  confirmDelete(): void {
    this.fleetService.deleteVehicleById(this.vehicle.id).subscribe({
      next: () => {
        this.notificationMessage = 'Vehiculul a fost șters.';
        this.notificationType = 'success';
        this.showNotification = true;
        this.goBack();
      },
      error: (error) => {
        this.notificationMessage = error.error || 'Eroare la ștergere.';
        this.notificationType = 'error';
        this.showNotification = true;
      }
    });
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
  }

  cancelEdit(): void {
    this.fleetService.getVehicleById(this.vehicle.id).subscribe({
      next: (refreshed) => {
        this.vehicle = { ...refreshed };
        this.isEditing = false;
      }
    });
  }
}

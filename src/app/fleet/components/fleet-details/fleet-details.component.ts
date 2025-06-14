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
    const found = this.fleetService.getVehicleById(id);
    if (found) {
      this.vehicle = { ...found };
    }
  }

  enableEdit(): void {
    this.isEditing = true;
  }

  save(): void {
    this.fleetService.updateVehicle(this.vehicle);
    this.isEditing = false;
    this.notificationMessage = 'Vehiculul a fost salvat cu succes.';
    this.notificationType = 'success';
    this.showNotification = true;
  }

  goBack(): void {
    this.location.back();
  }

  requestDelete(): void {
    const used = this.tripService.isVehicleUsedInTrips(this.vehicle.id);
    if (used) {
      this.notificationMessage = 'Vehiculul nu poate fi șters – este folosit într-o cursă.';
      this.notificationType = 'error';
      this.showNotification = true;
      return;
    }

    this.showDeleteConfirm = true;
  }

  confirmDelete(): void {
    this.fleetService.deleteVehicleById(this.vehicle.id);
    this.notificationMessage = 'Vehiculul a fost șters.';
    this.notificationType = 'success';
    this.showNotification = true;
    this.goBack();
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
  }

  cancelEdit(): void {
    this.isEditing = false;
    const refreshed = this.fleetService.getVehicleById(this.vehicle.id);
    if (refreshed) {
      this.vehicle = { ...refreshed };
    }
  }
}

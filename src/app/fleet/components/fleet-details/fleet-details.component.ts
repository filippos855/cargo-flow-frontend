import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { FleetVehicle } from '../../models/fleet-vehicle.model';
import { FleetService } from '../../services/fleet.service';

@Component({
  selector: 'app-fleet-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './fleet-details.component.html',
  styleUrls: ['./fleet-details.component.scss']
})
export class FleetDetailsComponent {
  vehicle!: FleetVehicle;
  isEditing = false;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private fleetService: FleetService
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
    alert('Vehiculul a fost salvat.');
  }

  goBack(): void {
    this.location.back();
  }
}

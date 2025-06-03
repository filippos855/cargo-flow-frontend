import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FleetService } from '../services/fleet.service';
import { FleetVehicle } from '../models/fleet-vehicle.model';

@Component({
  selector: 'app-fleet',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './fleet.component.html',
  styleUrls: ['./fleet.component.scss']
})
export class FleetComponent implements OnInit {
  fleet: FleetVehicle[] = [];

  constructor(
    private router: Router,
    private fleetService: FleetService
  ) {}

  ngOnInit(): void {
    this.fleet = this.fleetService.getFleet();
  }

  viewVehicle(vehicle: FleetVehicle): void {
    this.router.navigate(['/fleet', vehicle.id]);
  }

  addVehicle(): void {
    alert('Funcționalitatea de adăugare vehicul va fi implementată.');
  }
}

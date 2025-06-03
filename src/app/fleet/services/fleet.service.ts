import { Injectable } from '@angular/core';
import { FleetVehicle } from '../models/fleet-vehicle.model';
import { DictionaryItem } from '../../shared/models/dictionary-item.model';

@Injectable({
  providedIn: 'root'
})
export class FleetService {
  private fleet: FleetVehicle[] = [];

  constructor() {
    const tractorType: DictionaryItem = {
      id: 1,
      name: 'Tractor',
      dictionaryId: 3
    };

    const trailerType: DictionaryItem = {
      id: 2,
      name: 'Trailer',
      dictionaryId: 3
    };

    this.fleet = [
      {
        id: 10,
        identifier: 'B123XYZ',
        type: tractorType,
        itpExpiration: new Date('2025-12-31'),
        rcaExpiration: new Date('2025-11-30'),
        isAvailable: true
      },
      {
        id: 11,
        identifier: 'CJ55ABC',
        type: trailerType,
        itpExpiration: new Date('2025-10-15'),
        rcaExpiration: new Date('2025-08-01'),
        isAvailable: false
      }
    ];
  }

  getFleet(): FleetVehicle[] {
    return this.fleet;
  }

  getVehicleById(id: number): FleetVehicle | undefined {
    return this.fleet.find(v => v.id === id);
  }

  updateVehicle(updated: FleetVehicle): void {
    const index = this.fleet.findIndex(v => v.id === updated.id);
    if (index !== -1) {
      this.fleet[index] = { ...updated };
    }
  }
}

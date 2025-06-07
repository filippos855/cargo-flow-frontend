import { TestBed } from '@angular/core/testing';
import { FleetService } from './fleet.service';
import { FleetVehicle } from '../models/fleet-vehicle.model';
import { DictionaryItem } from '../../shared/models/dictionary-item.model';

describe('FleetService', () => {
  let service: FleetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FleetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all fleet vehicles', () => {
    const vehicles = service.getFleet();
    expect(Array.isArray(vehicles)).toBeTrue();
    expect(vehicles.length).toBeGreaterThan(0);
  });

  it('should return a vehicle by ID', () => {
    const vehicle = service.getVehicleById(10);
    expect(vehicle).toBeDefined();
    expect(vehicle?.id).toBe(10);
  });

  it('should update a vehicle', () => {
    const original = service.getVehicleById(10)!;
    const updated: FleetVehicle = {
      ...original,
      isAvailable: false
    };

    service.updateVehicle(updated);

    const result = service.getVehicleById(10);
    expect(result?.isAvailable).toBeFalse();
  });

  it('should not update a non-existent vehicle', () => {
    const initialLength = service.getFleet().length;

    const fakeType: DictionaryItem = {
      id: 999,
      name: 'Unknown',
      dictionaryId: 3
    };

    const fakeVehicle: FleetVehicle = {
      id: 999,
      identifier: 'ZZZ999',
      type: fakeType,
      itpExpiration: new Date(),
      rcaExpiration: new Date(),
      isAvailable: true
    };

    service.updateVehicle(fakeVehicle);
    expect(service.getFleet().length).toBe(initialLength);
    expect(service.getVehicleById(999)).toBeUndefined();
  });
});

import { VehicleType } from './vehicle-type.model';

export interface FleetVehicle {
  id: number;
  identifier: string;
  type: VehicleType;      // Dicționar extern
  itpExpiration: Date;
  rcaExpiration: Date;
  isAvailable: boolean;
}

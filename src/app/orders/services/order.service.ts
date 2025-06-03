import { Injectable } from '@angular/core';
import { Order } from '../models/order.model';
import { Company } from '../../shared/models/company.model';
import { Person } from '../../shared/models/person.model';
import { Trip } from '../../trips/models/trip.model';
import { FleetVehicle } from '../../fleet/models/fleet-vehicle.model';
import { DictionaryItem } from '../../shared/models/dictionary-item.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orders: Order[] = [];

  constructor() {
    const company: Company = {
      id: 1,
      name: 'EMAG SRL',
      code: 'EMAG',
      contactPerson: { id: 1, fullName: 'Ion Popescu' }
    };

    const deliveryPerson: Person = {
      id: 2,
      fullName: 'Maria Ionescu'
    };

    const statusInitiat: DictionaryItem = {
      id: 1,
      name: 'Inițiat',
      dictionaryId: 1
    };

    const statusInCursa: DictionaryItem = {
      id: 2,
      name: 'Inclusă în cursă',
      dictionaryId: 1
    };

    const trip: Trip = {
      id: 101,
      number: 'TRIP2024001',
      startDate: new Date(),
      status: {
        id: 3,
        name: 'Planificată',
        dictionaryId: 2
      },
      transportCompany: company,
      driver: { id: 3, fullName: 'George Vasile' },
      tractorUnit: {
        id: 10,
        identifier: 'B123XYZ',
        type: { id: 1, name: 'Tractor', dictionaryId: 3 },
        itpExpiration: new Date(),
        rcaExpiration: new Date(),
        isAvailable: true
      },
      trailer: {
        id: 11,
        identifier: 'CJ55ABC',
        type: { id: 2, name: 'Trailer', dictionaryId: 3 },
        itpExpiration: new Date(),
        rcaExpiration: new Date(),
        isAvailable: true
      },
      orders: []
    };

    this.orders = [
      {
        id: 1,
        number: 'EMAG1',
        createdDate: new Date(),
        company,
        deliveryPerson,
        status: statusInitiat,
        trip: undefined
      },
      {
        id: 2,
        number: 'EMAG2',
        createdDate: new Date(),
        company,
        deliveryPerson,
        status: statusInCursa,
        trip
      }
    ];
  }

  getOrders(): Order[] {
    return this.orders;
  }

  getOrderById(id: number): Order | undefined {
    return this.orders.find(order => order.id === id);
  }

  updateOrder(updated: Order): void {
    const index = this.orders.findIndex(o => o.id === updated.id);
    if (index !== -1) {
      this.orders[index] = { ...updated };
    }
  }

  includeInMockTrip(order: Order): void {
    const company: Company = {
      id: 1,
      name: 'Transport SRL',
      code: 'TRANS',
      contactPerson: { id: 2, fullName: 'Vasile Ion' }
    };

    const driver: Person = { id: 3, fullName: 'Popa Mihai' };

    const tractorUnit: FleetVehicle = {
      id: 10,
      identifier: 'B123ABC',
      type: { id: 1, name: 'Tractor', dictionaryId: 3 },
      itpExpiration: new Date(),
      rcaExpiration: new Date(),
      isAvailable: true
    };

    const trailer: FleetVehicle = {
      id: 11,
      identifier: 'CJ07XYZ',
      type: { id: 2, name: 'Trailer', dictionaryId: 3 },
      itpExpiration: new Date(),
      rcaExpiration: new Date(),
      isAvailable: true
    };

    const mockTrip: Trip = {
      id: 1,
      number: 'TRIP2024001',
      startDate: new Date(),
      status: { id: 3, name: 'Planificată', dictionaryId: 2 },
      transportCompany: company,
      driver,
      tractorUnit,
      trailer,
      orders: [order]
    };

    order.trip = mockTrip;
    order.status = { id: 2, name: 'Inclusă în cursă', dictionaryId: 1 };

    this.updateOrder(order);
  }
}

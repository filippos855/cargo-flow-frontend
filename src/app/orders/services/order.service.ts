import { Injectable } from '@angular/core';
import { Order } from '../models/order.model';
import { Company } from '../../companies/models/company.model';
import { Person } from '../../persons/models/person.model';
import { Trip } from '../../trips/models/trip.model';
import { FleetVehicle } from '../../fleet/models/fleet-vehicle.model';
import { DictionaryItem } from '../../shared/models/dictionary-item.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orders: Order[] = [];
  private mockTrips: Trip[] = [];
  private nextId = 3;

  private mockCompanies: Company[] = [
    { id: 1, name: 'EMAG SRL', code: 'EMAG', contactPerson: { id: 1, fullName: 'Ion Popescu' } },
    { id: 2, name: 'ALtex SRL', code: 'ALTEX', contactPerson: { id: 3, fullName: 'Mihai Georgescu' } }
  ];

  private mockPersons: Person[] = [
    { id: 2, fullName: 'Maria Ionescu' },
    { id: 4, fullName: 'Adrian Vlad' }
  ];

  private statusInitiat: DictionaryItem = { id: 1, name: 'Inițiat', dictionary: { id: 1, name:"test" } };
  private statusInCursa: DictionaryItem = { id: 2, name: 'Inclusă în cursă', dictionary: { id: 1, name:"test" } };
  private statusFinalizata: DictionaryItem = { id: 3, name: 'Finalizată', dictionary: { id: 1, name:"test" } };

  constructor() {
    const company1 = this.mockCompanies[0];
    const company2 = this.mockCompanies[1];
    const deliveryPerson = this.mockPersons[0];

    const tractor: FleetVehicle = {
      id: 10,
      identifier: 'B123XYZ',
      type: { id: 1, name: 'Tractor', dictionary: { id: 1, name:"test" } },
      itpExpiration: new Date(),
      rcaExpiration: new Date(),
      isAvailable: true
    };

    const trailer: FleetVehicle = {
      id: 11,
      identifier: 'CJ55ABC',
      type: { id: 2, name: 'Trailer', dictionary: { id: 1, name:"test" } },
      itpExpiration: new Date(),
      rcaExpiration: new Date(),
      isAvailable: true
    };

    this.mockTrips = [
      {
        id: 101,
        number: 'TRIP2024001',
        startDate: new Date('2025-06-01'),
        status: { id: 3, name: 'Planificată', dictionary: { id: 1, name:"test" } },
        transportCompany: company1,
        driver: { id: 5, fullName: 'George Vasile' },
        tractorUnit: tractor,
        trailer: trailer,
        orders: []
      },
      {
        id: 102,
        number: 'TRIP2024002',
        startDate: new Date('2025-06-03'),
        status: { id: 3, name: 'Planificată', dictionary: { id: 1, name:"test" } },
        transportCompany: company2,
        driver: { id: 6, fullName: 'Raluca Moraru' },
        tractorUnit: tractor,
        trailer: trailer,
        orders: []
      }
    ];

    this.orders = [
      {
        id: 1,
        number: 'EMAG1',
        createdDate: new Date(),
        company: company1,
        deliveryPerson,
        address: 'Str. Aviatorilor 10, București',
        status: this.statusInitiat
      },
      {
        id: 2,
        number: 'EMAG2',
        createdDate: new Date(),
        company: company1,
        deliveryPerson,
        address: 'Bd. Libertății 5, București',
        status: this.statusInCursa,
        trip: this.mockTrips[0]
      }
    ];

    this.mockTrips[0].orders?.push(this.orders[1]);
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

  createOrder(order: Order): void {
    order.id = this.nextId++;
    order.createdDate = new Date();
    this.orders.push(order);

    if (order.trip) {
      const trip = this.mockTrips.find(t => t.id === order.trip?.id);
      if (trip) {
        if (!trip.orders) trip.orders = [];
        const alreadyIncluded = trip.orders.some(o => o.id === order.id);
        if (!alreadyIncluded) {
          trip.orders.push(order);
        }
      }
    }
  }

  deleteOrder(id: number): void {
    const order = this.getOrderById(id);
    if (!order) return;

    if (order.trip) {
      const trip = this.mockTrips.find(t => t.id === order.trip?.id);
      if (trip?.orders) {
        const index = trip.orders.findIndex(o => o.id === id);
        if (index !== -1) {
          trip.orders.splice(index, 1);
        }
      }
    }

    this.orders = this.orders.filter(order => order.id !== id);
  }

  getMockCompanies(): Company[] {
    return this.mockCompanies;
  }

  getMockPersons(): Person[] {
    return this.mockPersons;
  }

  getMockStatuses(): DictionaryItem[] {
    return [this.statusInitiat, this.statusInCursa, this.statusFinalizata];
  }

  getMockTrips(): Trip[] {
    return this.mockTrips;
  }

  includeInMockTrip(order: Order): void {
    const trip = this.mockTrips[1];
    order.trip = trip;
    order.status = this.statusInCursa;

    if (!trip.orders) {
      trip.orders = [];
    }

    const alreadyIncluded = trip.orders.some(o => o.id === order.id);
    if (!alreadyIncluded) {
      trip.orders.push(order);
    }

    this.updateOrder(order);
  }
}

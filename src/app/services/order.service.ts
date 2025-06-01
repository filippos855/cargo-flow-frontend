import { Injectable } from '@angular/core';
import { Order } from '../models/order.model';
import { Company } from '../models/company.model';
import { Person } from '../models/person.model';
import { OrderStatus } from '../models/order-status.model';
import { Trip } from '../models/trip.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orders: Order[] = [];

  constructor() {
    // Mock company
    const company: Company = {
      id: 1,
      name: 'EMAG SRL',
      code: 'EMAG',
      contactPerson: { id: 1, fullName: 'Ion Popescu' }
    };

    // Mock person (destinatar)
    const deliveryPerson: Person = {
      id: 2,
      fullName: 'Maria Ionescu'
    };

    // Mock statuses
    const statusInitiat: OrderStatus = { id: 1, name: 'Inițiat' };
    const statusInCursa: OrderStatus = { id: 2, name: 'Inclusă în cursă' };

    // Mock trip
    const trip: Trip = {
      id: 101,
      number: 'TRIP2024001',
      startDate: new Date(),
      status: { id: 1, name: 'Planificată' },
      transportCompany: company,
      driver: { id: 3, fullName: 'George Vasile' },
      tractorUnit: {
        id: 10,
        identifier: 'B123XYZ',
        type: { id: 1, name: 'Tractor' },
        itpExpiration: new Date(),
        rcaExpiration: new Date(),
        isAvailable: true
      },
      trailer: {
        id: 11,
        identifier: 'CJ55ABC',
        type: { id: 2, name: 'Trailer' },
        itpExpiration: new Date(),
        rcaExpiration: new Date(),
        isAvailable: true
      },
      orders: [] // se poate popula ulterior
    };

    this.orders = [
      {
        id: 1,
        number: 'EMAG1',
        createdDate: new Date(),
        company: company,
        deliveryPerson: deliveryPerson,
        status: statusInitiat,
        trip: undefined
      },
      {
        id: 2,
        number: 'EMAG2',
        createdDate: new Date(),
        company: company,
        deliveryPerson: deliveryPerson,
        status: statusInCursa,
        trip: trip
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
}

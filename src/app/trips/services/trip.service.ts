import { Injectable } from '@angular/core';
import { Trip } from '../models/trip.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private mockTrips: Trip[] = [
    {
      id: 1,
      number: 'TRIP001',
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-06-03'),
      status: { id: 1, name: 'Creată', dictionaryId: 2 },
      transportCompany: {
        id: 1,
        name: 'FastTrans SRL',
        code: 'FAST',
        cui: 'RO12345678',
        address: 'Str. Transportatorilor 1, București',
        contactPerson: {
          id: 1,
          fullName: 'Adrian Pop',
          phone: '0722123456',
          email: 'adrian.pop@fasttrans.ro'
        }
      },
      driver: {
        id: 2,
        fullName: 'Vasile Mihai',
        phone: '0722555888',
        email: 'vasile.mihai@fasttrans.ro'
      },
      tractorUnit: {
        id: 101,
        identifier: 'B-123-TRC',
        type: { id: 1, name: 'Tractor', dictionaryId: 3 },
        itpExpiration: new Date('2025-01-01'),
        rcaExpiration: new Date('2024-12-01'),
        isAvailable: true
      },
      trailer: {
        id: 201,
        identifier: 'B-456-RMC',
        type: { id: 2, name: 'Trailer', dictionaryId: 3 },
        itpExpiration: new Date('2025-03-01'),
        rcaExpiration: new Date('2025-02-01'),
        isAvailable: true
      },
      orders: [
        {
          id: 10,
          number: 'ORD1234',
          createdDate: new Date('2024-05-29'),
          company: {
            id: 2,
            name: 'Emag SRL',
            code: 'EMAG',
            cui: 'RO98765432',
            address: 'Bd. Libertății 1, București',
            contactPerson: {
              id: 3,
              fullName: 'Ion Ionescu',
              phone: '0733777444',
              email: 'ion.ionescu@emag.ro'
            }
          },
          deliveryPerson: {
            id: 4,
            fullName: 'Andrei Stancu',
            phone: '0733000111',
            email: 'andrei.stancu@emag.ro'
          },
          address: 'Str. Tineretului 15, București',
          status: { id: 2, name: 'În curs', dictionaryId: 1 },
          trip: undefined
        }
      ]
    }
  ];

  getTrips(): Observable<Trip[]> {
    return of(this.mockTrips);
  }

  getTripById(id: number): Observable<Trip | null> {
    const trip = this.mockTrips.find(t => t.id === id);
    return of(trip ?? null);
  }

  addMockTrip(trip: Trip): void {
    this.mockTrips.push(trip);
  }
}

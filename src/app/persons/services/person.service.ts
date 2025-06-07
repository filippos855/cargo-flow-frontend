import { Injectable } from '@angular/core';
import { Person } from '../models/person.model';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private persons: Person[] = [];

  constructor() {
    this.persons = [
      {
        id: 1,
        fullName: 'Popescu Ion',
        phone: '0712345678',
        email: 'ion.popescu@example.com'
      },
      {
        id: 2,
        fullName: 'Ionescu Maria',
        phone: '0722333444',
        email: 'maria.ionescu@example.com'
      },
      {
        id: 3,
        fullName: 'Vasile George',
        phone: '0733555666',
        email: 'george.vasile@example.com'
      }
    ];
  }

  getPersons(): Person[] {
    return this.persons;
  }

  getPersonById(id: number): Person | undefined {
    return this.persons.find(p => p.id === id);
  }

  updatePerson(updated: Person): void {
    const index = this.persons.findIndex(p => p.id === updated.id);
    if (index !== -1) {
      this.persons[index] = { ...updated };
    }
  }
}

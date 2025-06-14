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
        cnp: '1980101223344',
        phone: '0712345678',
        email: 'ion.popescu@example.com'
      },
      {
        id: 2,
        fullName: 'Ionescu Maria',
        cnp: '2870508332211',
        phone: '0722333444',
        email: 'maria.ionescu@example.com'
      },
      {
        id: 3,
        fullName: 'Vasile George',
        cnp: '1950719222111',
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

  addPerson(person: Person): void {
    person.id = Math.floor(Math.random() * 10000);
    this.persons.push(person);
  }

  deletePersonById(id: number): void {
    this.persons = this.persons.filter(p => p.id !== id);
  }
}

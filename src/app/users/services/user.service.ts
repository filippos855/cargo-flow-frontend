import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Person } from '../../persons/models/person.model';
import { DictionaryItem } from '../../shared/models/dictionary-item.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [];

  constructor() {
    const roles: DictionaryItem[] = [
      { id: 1, name: 'admin', dictionaryId: 4 },
      { id: 2, name: 'operator', dictionaryId: 4 },
      { id: 3, name: 'manager flota', dictionaryId: 4 },
      { id: 4, name: 'financiar', dictionaryId: 4 }
    ];

    const persons: Person[] = [
      { id: 1, fullName: 'Andrei Admin', email: 'admin@example.com', phone: '0711111111' },
      { id: 2, fullName: 'Olivia Operator', email: 'operator@example.com', phone: '0722222222' },
      { id: 3, fullName: 'Mihai Manager', email: 'manager@example.com', phone: '0733333333' },
      { id: 4, fullName: 'Claudia Financiar', email: 'financiar@example.com', phone: '0744444444' }
    ];

    this.users = [
      {
        id: 1,
        username: 'admin',
        passwordHash: 'admin123',
        role: roles[0],
        person: persons[0],
        isActive: true
      },
      {
        id: 2,
        username: 'operator',
        passwordHash: 'operator123',
        role: roles[1],
        person: persons[1],
        isActive: true
      },
      {
        id: 3,
        username: 'manager',
        passwordHash: 'manager123',
        role: roles[2],
        person: persons[2],
        isActive: true
      },
      {
        id: 4,
        username: 'financiar',
        passwordHash: 'financiar123',
        role: roles[3],
        person: persons[3],
        isActive: true
      }
    ];
  }

  getUsers(): User[] {
    return this.users;
  }

  getUserById(id: number): User | undefined {
    return this.users.find(u => u.id === id);
  }

  updateUser(updated: User): void {
    const index = this.users.findIndex(u => u.id === updated.id);
    if (index !== -1) {
      this.users[index] = { ...updated };
    }
  }

  addUser(user: User): void {
    user.id = Math.floor(Math.random() * 10000);
    this.users.push(user);
  }

  deleteUserById(id: number): void {
    this.users = this.users.filter(u => u.id !== id);
  }
}

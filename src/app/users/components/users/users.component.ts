import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { NotificationComponent } from '../../../shared/components/notification/notification.component';
import { DictionaryItem } from '../../../shared/models/dictionary-item.model';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NotificationComponent, UserFormComponent],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  filtered: User[] = [];
  isAdding = false;
  newUser!: User;

  searchTerm = '';
  filterActive = true;

  currentPage = 1;
  pageSize = 10;

  sortKey: keyof User | 'person' | 'role' = 'username';
  sortDirection: 'asc' | 'desc' = 'asc';

  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'info' | 'error' = 'success';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.users = this.userService.getUsers();
    this.applyFilters();
  }

  applyFilters(): void {
    const search = this.searchTerm.toLowerCase();

    let result = this.users.filter(u =>
      u.username.toLowerCase().includes(search) ||
      u.person.fullName.toLowerCase().includes(search) ||
      u.role.name.toLowerCase().includes(search)
    );

    result = result.filter(u => u.isActive === this.filterActive);

    result.sort((a, b) => {
      let aVal: any, bVal: any;

      if (this.sortKey === 'person') {
        aVal = a.person.fullName;
        bVal = b.person.fullName;
      } else if (this.sortKey === 'role') {
        aVal = a.role.name;
        bVal = b.role.name;
      } else {
        aVal = a[this.sortKey];
        bVal = b[this.sortKey];
      }

      return this.sortDirection === 'asc'
        ? aVal > bVal ? 1 : aVal < bVal ? -1 : 0
        : aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
    });

    this.currentPage = 1;
    this.filtered = result;
  }

  setSort(key: keyof User | 'person' | 'role'): void {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }

    this.applyFilters();
  }

  get paginatedUsers(): User[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filtered.length / this.pageSize);
  }

  changePage(offset: number): void {
    const nextPage = this.currentPage + offset;
    if (nextPage >= 1 && nextPage <= this.totalPages) {
      this.currentPage = nextPage;
    }
  }

  addUser(): void {
    this.isAdding = true;
    this.newUser = {
      id: 0,
      username: '',
      passwordHash: '',
      role: {} as DictionaryItem,
      person: { id: 0, fullName: '' },
      isActive: true
    };
  }

  saveNewUser(user: User): void {
    this.userService.addUser(user);
    this.loadUsers();
    this.isAdding = false;
    this.showNotification = true;
    this.notificationMessage = 'Utilizatorul a fost adăugat cu succes.';
    this.notificationType = 'success';
  }

  cancelNewUser(): void {
    this.isAdding = false;
    this.showNotification = true;
    this.notificationMessage = 'Adăugarea utilizatorului a fost anulată.';
    this.notificationType = 'info';
  }
}

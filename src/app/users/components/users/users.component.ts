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
  totalCount = 0;
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
    this.userService.getUsers(
      this.searchTerm,
      this.sortKey,
      this.sortDirection,
      this.currentPage,
      this.pageSize,
      this.filterActive
    ).subscribe({
      next: (response) => {
        this.users = response.items;
        this.totalCount = response.totalCount;
      },
      error: () => {
        this.showToast('Eroare la încărcarea utilizatorilor.', 'error');
      }
    });
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadUsers();
  }

  setSort(key: keyof User | 'person' | 'role'): void {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }
    this.loadUsers();
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  changePage(offset: number): void {
    const nextPage = this.currentPage + offset;
    if (nextPage >= 1 && nextPage <= this.totalPages) {
      this.currentPage = nextPage;
      this.loadUsers();
    }
  }

  addUser(): void {
    this.isAdding = true;
    this.newUser = {
      id: 0,
      username: '',
      password: '',
      role: {} as DictionaryItem,
      person: { id: 0, fullName: '' },
      isActive: true
    };
  }

  saveNewUser(user: User): void {
    this.userService.addUser({
      username: user.username,
      password: user.password,
      role: user.role,
      person: user.person,
      isActive: user.isActive
    }).subscribe({
      next: () => {
        this.loadUsers();
        this.isAdding = false;
        this.showToast('Utilizatorul a fost adăugat cu succes.', 'success');
      },
      error: () => {
        this.showToast('Eroare la adăugarea utilizatorului.', 'error');
      }
    });
  }


  cancelNewUser(): void {
    this.isAdding = false;
    this.showToast('Adăugarea utilizatorului a fost anulată.', 'info');
  }

  private showToast(message: string, type: 'success' | 'info' | 'error') {
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;
    setTimeout(() => (this.showNotification = false), 3000);
  }
}

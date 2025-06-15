import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Person } from '../../models/person.model';
import { PersonService } from '../../services/person.service';
import { NotificationComponent } from '../../../shared/components/notification/notification.component';
import { PersonFormComponent } from '../person-form/person-form.component';

@Component({
  selector: 'app-persons',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NotificationComponent, PersonFormComponent],
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.scss']
})
export class PersonsComponent implements OnInit {
  persons: Person[] = [];
  isAdding = false;
  newPerson!: Person;

  searchTerm = '';
  sortKey: keyof Person = 'fullName';
  sortDirection: 'asc' | 'desc' = 'asc';

  currentPage = 1;
  pageSize = 10;
  totalCount = 0;

  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'info' | 'error' = 'success';

  constructor(
    private personService: PersonService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPersons();
  }

  loadPersons(): void {
    this.personService
      .getPersons(
        this.searchTerm,
        this.sortKey,
        this.sortDirection,
        this.currentPage,
        this.pageSize
      )
      .subscribe({
        next: (response) => {
          this.persons = response.items;
          this.totalCount = response.totalCount;
        },
        error: () => {
          this.showToast('Eroare la încărcarea persoanelor.', 'error');
        }
      });
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadPersons();
  }

  setSort(key: keyof Person): void {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }
    this.loadPersons();
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  changePage(offset: number): void {
    const next = this.currentPage + offset;
    if (next >= 1 && next <= this.totalPages) {
      this.currentPage = next;
      this.loadPersons();
    }
  }

  addPerson(): void {
    this.isAdding = true;
    this.newPerson = {
      id: 0,
      fullName: '',
      cnp: '',
      phone: '',
      email: ''
    };
  }

  saveNewPerson(person: Person): void {
    this.personService.addPerson(person).subscribe({
      next: () => {
        this.loadPersons();
        this.isAdding = false;
        this.showToast('Persoana a fost adăugată.', 'success');
      },
      error: (err) => {
        const errorMessage = this.extractBackendError(err);
        this.showToast(errorMessage || 'Eroare la adăugare.', 'error');
      }
    });
  }

  cancelNewPerson(): void {
    this.isAdding = false;
    this.showToast('Adăugarea persoanei a fost anulată.', 'info');
  }

  getSortIcon(key: keyof Person): string {
    if (this.sortKey !== key) return '';
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  showToast(message: string, type: 'success' | 'info' | 'error' = 'info'): void {
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;
    setTimeout(() => (this.showNotification = false), 3000);
  }

  viewPerson(person: Person): void {
    this.router.navigate(['/resources/persons', person.id]);
  }

  private extractBackendError(error: any): string | null {
    if (error?.error?.errors) {
      const errorObj = error.error.errors;
      const firstKey = Object.keys(errorObj)[0];
      return errorObj[firstKey]?.[0] || null;
    }

    if (error?.error?.error) {
      return error.error.error;
    }

    return null;
  }
}

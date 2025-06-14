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
  filtered: Person[] = [];
  isAdding = false;
  newPerson!: Person;

  searchTerm = '';
  sortKey: keyof Person = 'fullName';
  sortDirection: 'asc' | 'desc' = 'asc';

  currentPage = 1;
  pageSize = 10;

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
    this.persons = this.personService.getPersons();
    this.applyFilters();
  }

  applyFilters(): void {
    const search = this.searchTerm.toLowerCase();

    let result = this.persons.filter(p =>
      p.fullName.toLowerCase().includes(search) ||
      p.cnp?.toLowerCase().includes(search)
    );

    result.sort((a, b) => {
      const aVal = (a[this.sortKey] ?? '').toString().toLowerCase();
      const bVal = (b[this.sortKey] ?? '').toString().toLowerCase();

      return this.sortDirection === 'asc'
        ? aVal > bVal ? 1 : aVal < bVal ? -1 : 0
        : aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
    });

    this.currentPage = 1;
    this.filtered = result;
  }

  setSort(key: keyof Person): void {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }

    this.applyFilters();
  }

  get paginatedPersons(): Person[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filtered.length / this.pageSize);
  }

  changePage(offset: number): void {
    const next = this.currentPage + offset;
    if (next >= 1 && next <= this.totalPages) {
      this.currentPage = next;
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
    this.personService.addPerson(person);
    this.loadPersons();
    this.isAdding = false;
    this.showToast('Persoana a fost adăugată.', 'success');
  }

  cancelNewPerson(): void {
    this.isAdding = false;
    this.showToast('Adăugarea persoanei a fost anulată.', 'info');
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
}

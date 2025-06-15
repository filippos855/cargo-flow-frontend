import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Company } from '../../models/company.model';
import { Person } from '../../../persons/models/person.model';
import { NotificationComponent } from '../../../shared/components/notification/notification.component';
import { PersonService } from '../../../persons/services/person.service';

@Component({
  selector: 'app-company-form',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationComponent],
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.scss']
})
export class CompanyFormComponent implements OnInit {
  @Input() company!: Company;
  @Input() isEditMode = false;
  @Output() save = new EventEmitter<Company>();
  @Output() cancel = new EventEmitter<void>();

  persons: Person[] = [];

  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'error' = 'success';

  constructor(private personService: PersonService) {}

  ngOnInit(): void {
    this.loadPersons();
  }

  loadPersons(): void {
    this.personService.getPersons('', 'fullName', 'asc', 1, 1000).subscribe({
      next: (response) => {
        this.persons = response.items;

        const selectedId = this.company?.contactPerson?.id;
        if (selectedId) {
          const match = this.persons.find(p => p.id === selectedId);
          if (match) {
            this.company.contactPerson = match;
          }
        }
      },
      error: () => this.showToast('Eroare la încărcarea persoanelor.', 'error')
    });
  }

  submitForm(): void {
    if (!this.company.name?.trim() || !this.company.code?.trim() || !this.company.contactPerson) {
      this.showToast('Completează denumirea, codul și persoana de contact.', 'error');
      return;
    }

    const isEdit = !!this.company.id;

    const payload = {
      name: this.company.name,
      code: this.company.code,
      cui: this.company.cui,
      address: this.company.address,
      contactPersonId: this.company.contactPerson.id,
      ...(isEdit ? { id: this.company.id } : {})
    };

    this.save.emit(payload as any);
    this.showNotification = false;
  }



  cancelForm(): void {
    this.cancel.emit();
  }

  private showToast(message: string, type: 'success' | 'error') {
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;
    setTimeout(() => (this.showNotification = false), 3000);
  }
}

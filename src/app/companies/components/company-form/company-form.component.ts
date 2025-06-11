import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Company } from '../../models/company.model';
import { Person } from '../../../persons/models/person.model';
import { NotificationComponent } from '../../../shared/components/notification/notification.component';

@Component({
  selector: 'app-company-form',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationComponent],
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.scss']
})
export class CompanyFormComponent {
  @Input() company!: Company;
  @Input() isEditMode = false;
  @Output() save = new EventEmitter<Company>();
  @Output() cancel = new EventEmitter<void>();

  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'error' = 'success';

  persons: Person[] = [
    { id: 1, fullName: 'Ion Popescu' },
    { id: 2, fullName: 'Maria Ionescu' },
    { id: 3, fullName: 'George Vasile' }
  ];

  submitForm(): void {
    if (!this.company.name || !this.company.code || !this.company.contactPerson) {
      this.notificationMessage = 'Completează toate câmpurile obligatorii: denumire, cod și persoană contact.';
      this.notificationType = 'error';
      this.showNotification = true;
      return;
    }

    this.save.emit(this.company);
    this.notificationMessage = this.isEditMode ? 'Firma a fost actualizată.' : 'Firma a fost adăugată.';
    this.notificationType = 'success';
    this.showNotification = true;
  }

  cancelForm(): void {
    this.cancel.emit();
  }
}

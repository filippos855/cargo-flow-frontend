import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { User } from '../../models/user.model';
import { Person } from '../../../persons/models/person.model';
import { DictionaryItem } from '../../../shared/models/dictionary-item.model';
import { NotificationComponent } from '../../../shared/components/notification/notification.component';
import { PersonService } from '../../../persons/services/person.service';
import { DictionaryItemsService } from '../../../shared/services/dictionary-items.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationComponent],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  @Input() user!: User;
  @Input() isEditMode = false;

  @Output() save = new EventEmitter<User>();
  @Output() cancel = new EventEmitter<void>();

  persons: Person[] = [];
  roles: DictionaryItem[] = [];

  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'error' = 'success';

  constructor(
    private personService: PersonService,
    private dictionaryItemsService: DictionaryItemsService
  ) {}

  ngOnInit(): void {
    this.loadPersons();
    this.loadRoles();
  }

  loadPersons(): void {
    this.personService.getAllPersons().subscribe({
      next: (p) => {
        this.persons = p;
      
        const selectedPersonId = this.user.person?.id;
        if (selectedPersonId) {
          const match = this.persons.find(person => person.id === selectedPersonId);
          if (match) {
            this.user.person = match;
          }
        }
      },
      error: () => {
        this.showToast('Eroare la încărcarea persoanelor.', 'error');
      }
    });
  }
  
  loadRoles(): void {
    this.dictionaryItemsService.getDictionaryItemsByName('Rol utilizator').subscribe({
      next: (r) => {
        this.roles = r;
      
        const selectedRoleId = this.user.role?.id;
        if (selectedRoleId) {
          const match = this.roles.find(role => role.id === selectedRoleId);
          if (match) {
            this.user.role = match;
          }
        }
      },
      error: () => {
        this.showToast('Eroare la încărcarea rolurilor.', 'error');
      }
    });
  }


  submitForm(): void {
    if (!this.user.username || !this.user.person || !this.user.role) {
      this.showToast('Completează toate câmpurile obligatorii', 'error');
      return;
    }

    if (!this.isEditMode && !this.user.password) {
      this.showToast('Completează parola pentru utilizator nou', 'error');
      return;
    }

    this.save.emit(this.user);
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

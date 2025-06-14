import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { User } from '../../models/user.model';
import { Person } from '../../../persons/models/person.model';
import { DictionaryItem } from '../../../shared/models/dictionary-item.model';
import { NotificationComponent } from '../../../shared/components/notification/notification.component';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationComponent],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent {
  @Input() user!: User;
  @Input() persons: Person[] = [];
  @Input() roles: DictionaryItem[] = [];
  @Input() isEditMode = false;

  @Output() save = new EventEmitter<User>();
  @Output() cancel = new EventEmitter<void>();

  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'error' = 'success';

  submitForm(): void {
    if (!this.user.username || !this.user.person || !this.user.role) {
      this.notificationMessage = 'Completează toate câmpurile obligatorii';
      this.notificationType = 'error';
      this.showNotification = true;
      return;
    }

    this.save.emit(this.user);
    this.notificationMessage = this.isEditMode ? 'Utilizator actualizat' : 'Utilizator adăugat';
    this.notificationType = 'success';
    this.showNotification = true;
  }

  cancelForm(): void {
    this.cancel.emit();
  }
}

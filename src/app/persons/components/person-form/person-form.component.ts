import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Person } from '../../models/person.model';
import { NotificationComponent } from '../../../shared/components/notification/notification.component';

@Component({
  selector: 'app-person-form',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationComponent],
  templateUrl: './person-form.component.html',
  styleUrls: ['./person-form.component.scss']
})
export class PersonFormComponent {
  @Input() person!: Person;
  @Input() isEditMode = false;
  @Output() save = new EventEmitter<Person>();
  @Output() cancel = new EventEmitter<void>();

  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'error' = 'success';

  submitForm(): void {
    if (!this.person.fullName || !this.person.cnp) {
      this.notificationMessage = 'Completează numele și CNP-ul';
      this.notificationType = 'error';
      this.showNotification = true;
      return;
    }

    this.save.emit(this.person);
    this.showNotification = false;
  }

  cancelForm(): void {
    this.cancel.emit();
  }
}

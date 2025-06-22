import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

import { NotificationComponent } from '../../../shared/components/notification/notification.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NotificationComponent,
    ConfirmDialogComponent,
    UserFormComponent
  ],
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent {
  user!: User;
  isEditing = false;

  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'error' = 'success';

  showDeleteConfirm = false;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private userService: UserService
  ) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadUser(id);
  }

  loadUser(id: number): void {
    this.userService.getUserById(id).subscribe({
      next: (u) => {
        this.user = { ...u, password: '' };  // password gol la editare — perfect
      },
      error: () => {
        this.showToast('Utilizatorul nu a fost găsit.', 'error');
      }
    });
  }

  enableEdit(): void {
    this.isEditing = true;
  }

  save(): void {
    this.userService.updateUser({
      id: this.user.id,
      username: this.user.username,
      password: this.user.password,
      role: this.user.role,
      person: this.user.person,
      isActive: this.user.isActive
    }).subscribe({
      next: () => {
        this.isEditing = false;
        this.showToast('Utilizatorul a fost salvat cu succes.', 'success');
        this.loadUser(this.user.id);
      },
      error: () => {
        this.showToast('Eroare la salvare.', 'error');
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  requestDelete(): void {
    this.showDeleteConfirm = true;
  }

  confirmDelete(): void {
    this.userService.deleteUserById(this.user.id).subscribe({
      next: () => {
        this.showToast('Utilizatorul a fost șters.', 'success');
        this.goBack();
      },
      error: (error) => {
        this.showToast(error.error || 'Eroare la ștergere.', 'error');
      }
    });
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.loadUser(this.user.id);
  }

  private showToast(message: string, type: 'success' | 'error') {
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;
    setTimeout(() => (this.showNotification = false), 3000);
  }
}

import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

import { NotificationComponent } from '../../../shared/components/notification/notification.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NotificationComponent,
    ConfirmDialogComponent
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
    const found = this.userService.getUserById(id);
    if (found) {
      this.user = { ...found };
    }
  }

  enableEdit(): void {
    this.isEditing = true;
  }

  save(): void {
    this.userService.updateUser(this.user);
    this.isEditing = false;
    this.notificationMessage = 'Utilizatorul a fost salvat cu succes.';
    this.notificationType = 'success';
    this.showNotification = true;
  }

  goBack(): void {
    this.location.back();
  }

  requestDelete(): void {
    this.showDeleteConfirm = true;
  }

  confirmDelete(): void {
    this.userService.deleteUserById(this.user.id);
    this.notificationMessage = 'Utilizatorul a fost șters.';
    this.notificationType = 'success';
    this.showNotification = true;
    this.goBack();
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
  }

  cancelEdit(): void {
    this.isEditing = false;
    const refreshed = this.userService.getUserById(this.user.id);
    if (refreshed) {
      this.user = { ...refreshed };
    }
  }
}

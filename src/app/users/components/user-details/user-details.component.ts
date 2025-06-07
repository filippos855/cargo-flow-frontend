import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent {
  user!: User;
  isEditing = false;

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
    alert('Utilizatorul a fost salvat.');
  }

  goBack(): void {
    this.location.back();
  }
}

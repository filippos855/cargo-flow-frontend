import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = '';
  password = '';
  showPassword = false;
  rememberMe = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  login(): void {
    this.authService.login(this.username, this.password, this.rememberMe).subscribe(success => {
      if (success) {
        this.router.navigate(['/dashboard']);
      } else {
        this.error = 'Nume de utilizator sau parolă incorectă.';
      }
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}
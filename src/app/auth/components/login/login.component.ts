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
    this.authService.login(this.username, this.password, this.rememberMe).subscribe({
      next: success => {
        if (success) {
          this.router.navigate(['/dashboard']);
        }
      },
      error: err => {
        if (err.status === 401 && err.error) {
          this.error = err.error;
        } else {
          this.error = 'A apărut o eroare. Vă rugăm încercați din nou.';
        }
      }
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}
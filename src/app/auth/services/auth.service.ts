import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../users/models/user.model';
import { UserService } from '../../users/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;

  constructor(private userService: UserService, private router: Router) {
    const storedUser =
      localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
  }

  login(username: string, password: string, remember: boolean): boolean {
    const users = this.userService.getUsers();
    const user = users.find(u => u.username === username && u.passwordHash === password);
    if (user) {
      this.currentUser = user;

      const storage = remember ? localStorage : sessionStorage;
      storage.setItem('currentUser', JSON.stringify(user));

      const otherStorage = remember ? sessionStorage : localStorage;
      otherStorage.removeItem('currentUser');

      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }
}

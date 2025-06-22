import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../../core/services/app-config.service';
import { User } from '../../users/models/user.model';
import { Observable, of, tap, catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;
  private readonly storageKey = 'currentUser';

  constructor(
    private http: HttpClient,
    private config: AppConfigService,
    private router: Router
  ) {
    const storedUser =
      localStorage.getItem(this.storageKey) || sessionStorage.getItem(this.storageKey);
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
  }

  login(username: string, password: string, remember: boolean): Observable<boolean> {
    return this.http.post<User>(`${this.config.apiUrl}/auth/login`, {
      username,
      password
    }).pipe(
      tap(user => {
        this.currentUser = user;

        const storage = remember ? localStorage : sessionStorage;
        storage.setItem(this.storageKey, JSON.stringify(user));

        const otherStorage = remember ? sessionStorage : localStorage;
        otherStorage.removeItem(this.storageKey);
      }),
      map(() => true),
      catchError(() => of(false))
    );
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem(this.storageKey);
    sessionStorage.removeItem(this.storageKey);
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

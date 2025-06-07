import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../../users/models/user.model';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentUser: User | null = this.authService.getCurrentUser();
    const allowedRoles: string[] = route.data['allowedRoles'];

    if (!currentUser || !currentUser.role || !allowedRoles.includes(currentUser.role.name.toLowerCase())) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}

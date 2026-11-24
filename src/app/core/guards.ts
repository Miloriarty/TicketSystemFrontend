import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { AuthService } from './services/auth.service';
import { Role } from './models/role.model';

const ROLE_HOME: Record<Role, string> = {
  admin: '/admin',
  manager: '/manager',
  employee: '/employees',
};

export function homeFor(role: string | null | undefined): string {
  return (role && ROLE_HOME[role.toLowerCase() as Role]) || '/login';
}

export const roleGuard: CanActivateFn = (route) => {
  const user = inject(AuthService).user();
  const router = inject(Router);

  if (!user) return router.parseUrl('/login');

  const allowed = route.data['roles'] as Role[];
  if (allowed.includes(user.role)) return true;

  return router.parseUrl(homeFor(user.role));
};

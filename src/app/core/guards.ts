import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';

const ROLE_HOME: Record<string, string> = {
  admin: '/admin',
  manager: '/manager',
  employee: '/employees',
};

export function homeFor(role: string | null | undefined): string {
  return (role && ROLE_HOME[role.toLowerCase()]) || '/login';
}

export const roleGuard: CanActivateFn = (route) => {
  const user = inject(AuthService).user();
  const router = inject(Router);

  if (!user) return router.parseUrl('/login');

  const allowed = route.data['roles'] as string[];
  if (allowed.includes(user.role)) return true;

  return router.parseUrl(homeFor(user.role));
};

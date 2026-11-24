import { Routes } from '@angular/router';
import { inject } from '@angular/core';

import { AdminComponent } from './pages/admin/admin.component';
import { ManagerComponent } from './pages/manager/manager.component';
import { EmployeeComponent } from './pages/employee/employee.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthService } from './core/services/auth.service';
import { homeFor, roleGuard } from './core/guards';
import { Role } from './core/models/role.model';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: () => homeFor(inject(AuthService).user()?.role) },
  {
    path: 'manager',
    component: ManagerComponent,
    canActivate: [roleGuard],
    data: { roles: [Role.Manager] },
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [roleGuard],
    data: { roles: [Role.Admin] },
  },
  {
    path: 'employees',
    component: EmployeeComponent,
    canActivate: [roleGuard],
    data: { roles: [Role.Employee] },
  },
  { path: 'login', component: LoginComponent },
];

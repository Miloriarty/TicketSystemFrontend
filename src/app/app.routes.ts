import { Routes } from '@angular/router';
import {AdminComponent} from './pages/admin/admin.component';
import {ManagerComponent} from './pages/manager/manager.component';
import {EmployeeComponent} from './pages/employee/employee.component';
import {LoginComponent} from './pages/login/login.component';
import {AuthService} from './core/services/auth.service';
import {inject} from '@angular/core';
import {homeFor, roleGuard} from './core/guards';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: () => homeFor(inject(AuthService).user()?.role)},
  { path: 'manager', component: ManagerComponent, canActivate: [roleGuard], data: {roles: ['manager']} },
  { path: 'admin', component: AdminComponent, canActivate: [roleGuard], data: {roles: ['admin']} },
  { path: 'employees', component: EmployeeComponent, canActivate: [roleGuard], data: {roles: ['employee']} },
  { path: 'login', component: LoginComponent },
];

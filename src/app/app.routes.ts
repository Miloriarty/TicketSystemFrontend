import { Routes } from '@angular/router';
import {AdminComponent} from './pages/admin/admin';
import {ManagerComponent} from './pages/manager/manager';
import {EmployeeComponent} from './pages/employee/employee';

export const routes: Routes = [
  { path: '', redirectTo: 'manager', pathMatch: 'full' },
  { path: 'manager', component: ManagerComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'employees', component: EmployeeComponent },
];

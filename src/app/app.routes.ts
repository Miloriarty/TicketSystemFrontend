import { Routes } from '@angular/router';
import {AdminComponent} from './admin/admin';
import {ManagerComponent} from './manager/manager';
import {EmployeeComponent} from './employee/employee';

export const routes: Routes = [
  { path: '', redirectTo: 'manager', pathMatch: 'full' },
  { path: 'manager', component: ManagerComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'employees', component: EmployeeComponent },
];

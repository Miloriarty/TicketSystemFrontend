import { Routes } from '@angular/router';
import {AdminComponent} from './pages/admin/admin.component';
import {ManagerComponent} from './pages/manager/manager.component';
import {EmployeeComponent} from './pages/employee/employee.component';

export const routes: Routes = [
  { path: '', redirectTo: 'manager', pathMatch: 'full' },
  { path: 'manager', component: ManagerComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'employees', component: EmployeeComponent },
];

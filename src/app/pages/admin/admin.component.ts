import { Component, computed, inject, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardAvatar,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatFormField, MatInput, MatLabel, MatPrefix } from '@angular/material/input';
import { MatChipListbox, MatChipOption } from '@angular/material/chips';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { switchMap, filter } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CategoryService } from '../../core/services/category.service';
import { EmployeeService } from '../../core/services/employee.service';
import { TicketService } from '../../core/services/ticket.service';
import { Category, CategoryRequest } from '../../core/models/category.model';
import { Employee, EmployeeRequest } from '../../core/models/employee.model';
import { Ticket } from '../../core/models/ticket.model';
import { Role, ROLES } from '../../core/models/role.model';
import { ConfirmService } from '../../shared/confirm-dialog/confirm.service';
import { httpErrorMessage } from '../../core/http-error';
import { AuthService } from '../../core/services/auth.service';
import { EmployeeCardComponent } from './employee-card/employee-card.component';
import { CategoriesCardComponent } from './categories-card/categories-card.component';

@Component({
  imports: [
    MatIcon,
    FormsModule,
    MatButton,
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    MatCardAvatar,
    MatPrefix,
    MatChipListbox,
    MatChipOption,
    EmployeeCardComponent,
    CategoriesCardComponent,
  ],
  selector: 'app-admin',
  styleUrl: './admin.component.scss',
  templateUrl: './admin.component.html',
})
export class AdminComponent {
  categoryService = inject(CategoryService);
  employeeService = inject(EmployeeService);
  ticketService = inject(TicketService);
  confirmService = inject(ConfirmService);
  authService = inject(AuthService);
  _snackBar = inject(MatSnackBar);

  myId = this.authService.user()?.id;

  fullName = signal<string>('');

  position = signal<string>('');

  password = signal<string>('');

  categories = signal<Category[]>([]);
  selectedCategories = signal<Category[]>([]);
  selectedCategoriesFilter = signal<number[]>([]);

  readonly roles = ROLES;
  selectedRole = signal<Role | null>(null);

  employees = signal<Employee[]>([]);
  selectedRoleFilter = signal<Role | undefined>(undefined);
  searchEmployee = signal<string>('');
  visibleEmployees = computed(() => {
    const role = this.selectedRoleFilter();
    const categoryIds = this.selectedCategoriesFilter();
    const search = this.searchEmployee().trim().toLowerCase();

    return this.employees().filter(
      (e) =>
        (!role || e.role === role) &&
        (categoryIds.length === 0 || categoryIds.some((id) => e.categoryIds.includes(id))) &&
        (e.fullName.toLowerCase().includes(search) || e.position.toLowerCase().includes(search)),
    );
  });
  editingEmployeeId = signal<number | null>(null);

  tickets = signal<Ticket[]>([]);

  newCategoryName = signal<string>('');

  constructor() {
    this.categoryService.getCategories().subscribe({
      next: (categories) => this.categories.set(categories),
      error: (err) => this.showErrorShackBar(httpErrorMessage(err, 'load categories')),
    });

    this.employeeService.getEmployees().subscribe({
      next: (employees) => this.employees.set(employees),
      error: (err) => this.showErrorShackBar(httpErrorMessage(err, 'load employees')),
    });

    this.ticketService.getTickets().subscribe({
      next: (tickets) => this.tickets.set(tickets),
      error: (err) => this.showErrorShackBar(httpErrorMessage(err, 'load tickets')),
    });
  }

  protected canCreateEmployee(): boolean {
    if (this.editingEmployeeId() === null) {
      return (
        this.fullName().trim().length > 0 &&
        this.position().trim().length > 0 &&
        this.selectedRole() !== null &&
        this.password().trim().length > 0 &&
        (!this.haveCategories(this.selectedRole()) || this.selectedCategories().length > 0)
      );
    } else {
      return (
        this.fullName().trim().length > 0 &&
        this.position().trim().length > 0 &&
        this.selectedRole() !== null &&
        (!this.haveCategories(this.selectedRole()) || this.selectedCategories().length > 0)
      );
    }
  }

  protected createEmployee(): void {
    const employee: EmployeeRequest = {
      fullName: this.fullName(),
      position: this.position(),
      password: this.password(),
      role: this.selectedRole()!,
      categoryIds: this.selectedCategories().map((c) => c.id),
    };

    const id = this.editingEmployeeId();

    if (id === null) {
      this.employeeService.createEmployee(employee).subscribe({
        next: (employee) => {
          this.clearEmployeeForm();
          this.employees.update((list) => [...list, employee]);
        },
        error: (err) => {
          this.showErrorShackBar(httpErrorMessage(err, 'create employee'));
        },
      });
    } else {
      this.employeeService.editEmployee(id, employee).subscribe({
        next: (employee) => {
          this.clearEmployeeForm();
          this.employees.update((list) => list.map((e) => (e.id === employee.id ? employee : e)));
          this.editingEmployeeId.set(null);
        },
        error: (err) => {
          this.showErrorShackBar(httpErrorMessage(err, 'update employee', 'Employee not found'));
        },
      });
    }
  }

  protected onCategoriesChange(categories: Category[]) {
    this.selectedCategories.set(categories);
  }

  protected onRolesChange(role: Role) {
    this.selectedRole.set(role);
    if (!this.haveCategories(role)) this.selectedCategories.set([]);
  }

  protected deleteCategory(cat: Category) {
    const id = cat.id;
    this.confirmService
      .confirm({
        title: 'Delete category',
        message: `Delete category ${cat.name}?`,
      })
      .pipe(
        filter(Boolean),
        switchMap(() => this.categoryService.deleteCategory(id)),
      )
      .subscribe({
        next: () => {
          this.categories.update((list) => list.filter((c) => c.id !== id));
        },
        error: (error) => {
          this.showErrorShackBar(httpErrorMessage(error, 'delete category', 'Category not found'));
        },
      });
  }

  protected createCategory(name: string) {
    const cat: CategoryRequest = {
      name: name,
    };
    this.categoryService.createCategory(cat).subscribe({
      next: (category) => {
        this.clearCategoryForm();
        this.categories.update((list) => [...list, category]);
      },
      error: (err) => {
        this.showErrorShackBar(httpErrorMessage(err, 'create category'));
      },
    });
  }

  protected editEmployee(employee: Employee) {
    this.editingEmployeeId.set(employee.id);
    this.fullName.set(employee.fullName);
    this.position.set(employee.position);
    this.selectedCategories.set(
      this.categories().filter((c) => employee.categoryIds.includes(c.id)),
    );
    this.selectedRole.set(employee.role);
  }

  protected deleteEmployee(employee: Employee) {
    const employeeId = employee.id;
    this.confirmService
      .confirm({
        title: 'Delete employee',
        message: `Delete employee ${employee.fullName}?`,
      })
      .pipe(
        filter(Boolean),
        switchMap(() => this.employeeService.deleteEmployee(employeeId)),
      )
      .subscribe({
        next: () => {
          this.employees.update((list) => list.filter((e) => e.id !== employeeId));
        },
        error: (error) => {
          this.showErrorShackBar(httpErrorMessage(error, 'delete employee', 'Employee not found'));
        },
      });
  }

  protected showErrorShackBar(error: string): void {
    this._snackBar.open(error, 'Ok', {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

  protected canCancelEmployee(): boolean {
    return (
      this.fullName().trim().length > 0 ||
      this.position().trim().length > 0 ||
      this.selectedCategories().length > 0 ||
      this.selectedRole() !== null
    );
  }

  protected clearEmployeeForm(): void {
    this.fullName.set('');
    this.position.set('');
    this.password.set('');
    this.selectedRole.set(null);
    this.selectedCategories.set([]);
  }

  protected haveCategories(role: Role | null) {
    return role === 'employee';
  }

  protected clearCategoryForm(): void {
    this.newCategoryName.set('');
  }
}

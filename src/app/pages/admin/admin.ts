import {Component, computed, inject, signal} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import {MatButton, MatIconButton} from '@angular/material/button';
import {
  MatCard,
  MatCardActions, MatCardAvatar,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {CategoryService} from '../../core/services/category';
import {EmployeeService} from '../../core/services/employee';
import {TicketService} from '../../core/services/ticket';
import {RoleService} from '../../core/services/role';
import {Category, CategoryRequest} from '../../core/models/category';
import {Employee, EmployeeRequest} from '../../core/models/employee';
import {Ticket} from '../../core/models/ticket';
import {Role} from '../../core/models/role';
import {DatePipe} from '@angular/common';
import {NamesByIdsPipe} from '../../shared/pipes/names-by-ids';

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
    MatIconButton,
    DatePipe,
    NamesByIdsPipe
  ],
  selector: 'app-admin',
  styleUrl: './admin.css',
  templateUrl: './admin.html',
})
export class AdminComponent { // todo delete action, validation
  categoryService = inject(CategoryService);
  employeeService = inject(EmployeeService);
  ticketService = inject(TicketService);
  roleService = inject(RoleService);

  fullName = signal<string>('');

  position = signal<string>('');

  categories = signal<Category[]>([]);
  selectedCategories = signal<Category[]>([]);

  roles = signal<Role[]>([]);
  selectedRole = signal<Role | null>(null);

  employees = signal<Employee[]>([]);
  editingEmployeeId =signal<number | null>(null);

  tickets = signal<Ticket[]>([]);

  createCategoryField = signal<string>('');
  searchCategory = signal<string>('');
  editingCategoryId = signal<number | null>(null);

  filteredCategories = computed(() => {
    const query = this.searchCategory().trim().toLowerCase();
    return this.categories().filter(c => c.name.toLowerCase().includes(query));
  })

  constructor() {
    this.categoryService.getCategories().subscribe(categories => {
      this.categories.set(categories);
    });

    this.employeeService.getEmployees().subscribe(employees => {
      this.employees.set(employees);
    })

    this.ticketService.getTickets().subscribe(tickets => {
      this.tickets.set(tickets);
    })

    this.roleService.getRoles().subscribe(roles => {
      this.roles.set(roles);
    })
  }

  protected canCreateEmployee(): boolean {
    return this.fullName().trim().length > 0
      && this.position().trim().length > 0
      && this.selectedCategories().length > 0
      && this.selectedRole() !== null;
  }

  protected createEmployee(): void {
    const employee: EmployeeRequest = {
      fullName: this.fullName(),
      position: this.position(),
      roleId: this.selectedRole()!.id,
      categoriesId: this.selectedCategories().map(c => c.id),
    }

    const id = this.editingEmployeeId();

    if (id === null){
      this.employeeService.createEmployee(employee).subscribe({
        next: employee => {
          console.log('Employee created: ', employee);

          this.clearEmployeeForm();
          this.employees().push(employee);
        },
        error: err => {
          console.error("Failed to create employee: ", err)
        }
      })
    } else {
      this.employeeService.editEmployee(id, employee).subscribe({
        next: employee => {
          console.log('Employee updated: ', employee);

          this.clearEmployeeForm();
          this.employees.update(list =>
            list.map(e => e.id === employee.id ? employee: e)
          )
          this.editingEmployeeId.set(null);
        },
        error: err => {
          console.error("Failed to update employee: ", err)
        }
      })
    }
  }

  protected canCreateCategory(): boolean {
    return this.createCategoryField().trim().length > 0;
  }

  protected onCategoriesChange(categories: Category[]) {
    this.selectedCategories.set(categories);
  }

  protected onRolesChange(role: Role) {
      this.selectedRole.set(role);
  }

  protected onCrateCategoryFieldChange(categoryName: string) {
    this.createCategoryField.set(categoryName);
  }

  protected onSearchCategoryChange(text: string) {
    this.searchCategory.set(text);
  }

  protected editCategory(cat: Category) {
    this.editingCategoryId.set(cat.id);
    this.createCategoryField.set(cat.name);
  }

  protected deleteCategory(cat: Category) {

  }

  protected createCategory() {
    const cat: CategoryRequest =  {
      name: this.createCategoryField()
    }
    this.createCategoryField.set('');

    if (this.editingCategoryId() === null) {
      this.categoryService.createCategory(cat).subscribe({
        next: category => {
          console.log('Category created: ', category);
          this.clearCategoryForm()
          this.categories().push(category);
        },
        error: err => {
          console.error("Failed to create category: ", err)
        }
      })
    } else {
      this.categoryService.updateCategory(this.editingCategoryId()!, cat).subscribe({
        next: cat => {
            console.log('Category updated: ', cat);

            this.clearCategoryForm();
            this.categories.update(list =>
              list.map(e => e.id === cat.id ? cat: e)
            )
            this.editingCategoryId.set(null);
        },
        error: err => {
          console.error("Failed to update category: ", err)
        }
      })
    }

  }

  protected editEmployee(employee: Employee) {
    this.editingEmployeeId.set(employee.id);
    this.fullName.set(employee.fullName);
    this.position.set(employee.position);
    this.selectedCategories.set(
      this.categories().filter(c => employee.categoriesId.includes(c.id))
    )
    this.selectedRole.set(
      this.roles().find(r => r.id === employee.roleId) ?? null
    )
  }

  protected deleteEmployee(employeeId: number) {
    this.employeeService.deleteEmployee(employeeId).subscribe({
      next: () => {
        console.log('Employee deleted: ', employeeId);
        this.employees.update(list => list.filter(e => e.id !== employeeId));
      },
      error: error => {
        console.error("Failed to delete employee: ", error);
      }
    })
  }

  protected canCancelEmployee(): boolean {
    return this.fullName().trim().length > 0
    || this.position().trim().length > 0
    || this.selectedCategories().length > 0
    || this.selectedRole() !== null;
  }

  protected clearEmployeeForm(): void {
    this.fullName.set('');
    this.position.set('');
    this.fullName.set('');
    this.position.set('');
    this.selectedRole.set(null);
    this.selectedCategories.set([]);
  }

  protected clearCategoryForm(): void {
    this.createCategoryField.set('');
  }
}

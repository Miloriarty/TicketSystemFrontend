import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card';
import {MatOption, MatSelect} from '@angular/material/select';
import {CategoryService, Category} from '../services/category';
import {EmployeeService, Employee} from '../services/employee';
import {TicketService, Ticket, TicketRequest, TicketStatus} from '../services/ticket';
import {DatePipe, NgClass} from '@angular/common';
import {AppHeader} from '../app-header/app-header';


@Component({
  imports: [
    MatButtonModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatCardContent,
    MatFormField,
    MatCard,
    MatLabel,
    MatCardActions,
    MatCardTitle,
    MatCardHeader,
    MatCardSubtitle,
    MatSelect,
    MatOption,
    DatePipe,
    AppHeader,
    NgClass,
  ],
  standalone: true,
  selector: 'app-manager',
  styleUrl: './manager.css',
  templateUrl: './manager.html',
})
export class ManagerComponent {
  categoryService = inject(CategoryService);
  employeeService = inject(EmployeeService);
  ticketService = inject(TicketService);

  title = signal<string>('');
  description = signal<string>("");

  categories = signal<Category[]>([]);
  selectedCategories = signal<Category[]>([]);

  employees = signal<Employee[]>([]);
  selectedEmployees = signal<Employee[]>([]);

  tickets = signal<Ticket[]>([]);

  constructor() {
    this.categoryService.getCategories().subscribe(categories => {
      //console.log("Categories" + categories)
      this.categories.set(categories);
    });

    this.employeeService.getEmployees().subscribe(employees => {
      //console.log("Employees: " + employees);
      this.employees.set(employees);
    })

    this.ticketService.getTickets().subscribe(tickets => {
      this.tickets.set(tickets);
    })
  }

  protected readonly statusClass: Record<TicketStatus, string> = {
    [TicketStatus.New]: 'new',
    [TicketStatus.InProgress]: 'progress',
    [TicketStatus.Cancelled]: 'cancelled',
    [TicketStatus.Completed]: 'completed',
  };

  protected onCategoriesChange(categories: Category[]) {
    this.selectedCategories.set(categories);
  }

  protected canCreateTicket() {
    return this.title().toString().trim().length > 0
    && this.description().toString().trim().length > 0
    && this.isAllCategoriesCovered()
  }

  protected createTicket() {
    const ticket: TicketRequest = {
      description: this.description(),
      status: TicketStatus.New,
      employeesId: this.selectedEmployees().map(e => e.id),
      categoriesId: this.selectedCategories().map(c => c.id)
    }

    this.ticketService.createTicket(ticket).subscribe({
      next: ticket => {
        console.log('Ticket created: ', ticket);

        this.title.set('');
        this.description.set('');
        this.selectedCategories.set([]);
        this.selectedEmployees.set([]);
      },
      error: error => {
        console.error('Failed to create ticket: ', error);
      }
    });
  }

  protected categorySelected() {
    return this.selectedCategories().length > 0;
  }

  protected onEmployeesChange(employees: Employee[]) {
    this.selectedEmployees.set(employees);
  }

  protected isAllCategoriesCovered() {
    let categoriesId = this.selectedCategories().map(c => c.id);
    let employeeCategoriesId = new Set(this.selectedEmployees().flatMap(e => e.categoriesId));
    if (categoriesId.length === 0) return false;

    return categoriesId.every(c => employeeCategoriesId.has(c));
  }

  protected getCategoryNames(categoriesId: number[]): string[] {
    return categoriesId
        .map(id => this.categories().find(c => c.id === id)?.name)
        .filter(name => name !== undefined);
  }

  protected getEmployeeNames(employeesId: number[]): string[] {
    return employeesId
      .map(id => this.employees().find(e => e.id === id)?.fullName)
      .filter(name => name !== undefined);
  }

  protected allCategories() {
    return this.categoryService.getCategories()
  }

  protected readonly TicketStatus = TicketStatus;
}

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
import {CategoryService} from '../../core/services/category';
import {EmployeeService} from '../../core/services/employee';
import {TicketService} from '../../core/services/ticket';
import {Category} from '../../core/models/category';
import {Employee} from '../../core/models/employee';
import {Ticket, TicketRequest, TicketStatus, TICKET_STATUS_CLASS} from '../../core/models/ticket';
import {DatePipe, NgClass} from '@angular/common';
import {NamesByIdsPipe} from '../../shared/pipes/names-by-ids';
import {ConfirmService} from '../../shared/confirm-dialog/confirm-service';
import {switchMap, filter} from 'rxjs';


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
    NgClass,
    NamesByIdsPipe,
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
  confirmService = inject(ConfirmService);

  title = signal<string>('');
  description = signal<string>("");

  categories = signal<Category[]>([]);
  selectedCategories = signal<Category[]>([]);

  employees = signal<Employee[]>([]);
  selectedEmployees = signal<Employee[]>([]);

  tickets = signal<Ticket[]>([]);
  editingTicketId = signal<number | null>(null);

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

  protected readonly statusClass = TICKET_STATUS_CLASS;

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

  protected editTicket(ticket: Ticket) {
    this.editingTicketId.set(ticket.id);
    this.title.set("Todo title"); // todo title
    this.description.set(ticket.description);
    this.selectedCategories.set(this.categories()
      .filter(c => ticket.categoriesId.includes(c.id)));
    this.selectedEmployees.set(this.employees()
      .filter(e => e.ticketsId.includes(ticket.id))
    )
  }

  protected deleteTicket(ticketId: number) {
    this.confirmService.confirm({
      title: "Delete ticket",
      message: "Delete this ticket?"
    }).pipe(
      filter(Boolean),
      switchMap(() => this.ticketService.deleteTicket(ticketId))
    ).subscribe({
      next: () => {
        console.log('Ticket deleted: ', ticketId);
        this.tickets.update(list => list.filter(t => t.id !== ticketId));
      },
      error: error => {
        console.error('Failed to delete ticket: ', error);
      }
    })
  }

  protected canCancel() {
    return this.title().length > 0
      || this.description().length > 0
      || this.selectedCategories().length > 0
      || this.selectedEmployees().length > 0;
  }

  protected clearForm() {
    this.editingTicketId.set(null);
    this.title.set('');
    this.description.set('');
    this.selectedCategories.set([]);
    this.selectedEmployees.set([]);
  }

  protected readonly TicketStatus = TicketStatus;
}

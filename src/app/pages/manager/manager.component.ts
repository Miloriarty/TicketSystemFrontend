import { Component, signal, inject, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatOption, MatSelect, MatSelectTrigger } from '@angular/material/select';
import { DatePipe, NgClass } from '@angular/common';
import { switchMap, filter } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatChipListbox, MatChipOption } from '@angular/material/chips';

import { CategoryService } from '../../core/services/category.service';
import { EmployeeService } from '../../core/services/employee.service';
import { TicketService } from '../../core/services/ticket.service';
import { Category } from '../../core/models/category.model';
import { Employee } from '../../core/models/employee.model';
import {
  Ticket,
  TicketRequest,
  TicketStatus,
  TICKET_STATUS_CLASS,
} from '../../core/models/ticket.model';
import { NamesByIdsPipe } from '../../shared/pipes/names-by-ids.pipe';
import { ConfirmService } from '../../shared/confirm-dialog/confirm.service';
import { httpErrorMessage } from '../../core/http-error';

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
    MatSelectTrigger,
    DatePipe,
    NgClass,
    NamesByIdsPipe,
    MatChipListbox,
    MatChipOption,
  ],
  selector: 'app-manager',
  styleUrl: './manager.component.scss',
  templateUrl: './manager.component.html',
})
export class ManagerComponent {
  categoryService = inject(CategoryService);
  employeeService = inject(EmployeeService);
  ticketService = inject(TicketService);
  confirmService = inject(ConfirmService);
  _snackBar = inject(MatSnackBar);

  title = signal<string>('');
  description = signal<string>('');

  categories = signal<Category[]>([]);
  selectedCategories = signal<Category[]>([]);

  employees = signal<Employee[]>([]);
  selectedEmployees = signal<Employee[]>([]);
  filteredEmployees = computed(() => {
    const ids = this.selectedCategories().map((c) => c.id);
    return this.employees().filter((e) => e.categoryIds.some((id) => ids.includes(id)));
  });

  tickets = signal<Ticket[]>([]);
  editingTicketId = signal<number | null>(null);
  sortedTickets = computed(() =>
    [...this.tickets()].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    ),
  );

  selectedStatusFilter = signal<string | undefined>(undefined);
  searchTicket = signal<string>('');
  visibleTickets = computed(() => {
    const search = this.searchTicket().trim().toLowerCase();
    const status = this.selectedStatusFilter();

    return this.tickets().filter(
      (t) =>
        (!status || t.status === status) &&
        (t.title.toLowerCase().includes(search) || t.description.toLowerCase().includes(search)),
    );
  });

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

  protected readonly statusClass = TICKET_STATUS_CLASS;

  protected onCategoriesChange(categories: Category[]) {
    this.selectedCategories.set(categories);
  }

  protected canCreateTicket() {
    return (
      this.title().toString().trim().length > 0 &&
      this.description().toString().trim().length > 0 &&
      this.isAllCategoriesCovered()
    );
  }

  protected createTicket() {
    const editingId = this.editingTicketId();
    const editing = this.tickets().find((t) => t.id === editingId);
    const request: TicketRequest = {
      title: this.title(),
      description: this.description(),
      status: editing?.status ?? TicketStatus.New,
      employeeIds: this.selectedEmployees().map((e) => e.id),
      categoryIds: this.selectedCategories().map((c) => c.id),
    };

    if (editingId === null) {
      this.ticketService.createTicket(request).subscribe({
        next: (ticket) => {
          this.tickets.update((list) => [...list, ticket]);
          this.clearForm();
        },
        error: (error) => {
          this.showErrorShackBar(httpErrorMessage(error, 'create ticket'));
        },
      });
    } else {
      this.ticketService.updateTicket(editingId, request).subscribe({
        next: (ticket) => {
          this.tickets.update((list) => list.map((t) => (t.id === ticket.id ? ticket : t)));
          this.clearForm();
        },
        error: (error) => {
          this.showErrorShackBar(httpErrorMessage(error, 'update ticket', 'Ticket not found'));
        },
      });
    }
  }

  protected categorySelected() {
    return this.selectedCategories().length > 0;
  }

  protected onEmployeesChange(employees: Employee[]) {
    this.selectedEmployees.set(employees);
  }

  protected employeeNames() {
    return this.selectedEmployees()
      .map((e) => e.fullName)
      .join(', ');
  }

  protected isAllCategoriesCovered() {
    let categoryIds = this.selectedCategories().map((c) => c.id);
    let employeeCategoryIds = new Set(this.selectedEmployees().flatMap((e) => e.categoryIds));
    if (categoryIds.length === 0) return false;

    return categoryIds.every((c) => employeeCategoryIds.has(c));
  }

  protected editTicket(ticket: Ticket) {
    this.editingTicketId.set(ticket.id);
    this.title.set(ticket.title);
    this.description.set(ticket.description);
    this.selectedCategories.set(this.categories().filter((c) => ticket.categoryIds.includes(c.id)));
    this.selectedEmployees.set(this.employees().filter((e) => ticket.employeeIds.includes(e.id)));
  }

  protected deleteTicket(ticketId: number) {
    this.confirmService
      .confirm({
        title: 'Delete ticket',
        message: 'Delete this ticket?',
      })
      .pipe(
        filter(Boolean),
        switchMap(() => this.ticketService.deleteTicket(ticketId)),
      )
      .subscribe({
        next: () => {
          this.tickets.update((list) => list.filter((t) => t.id !== ticketId));
        },
        error: (error) => {
          this.showErrorShackBar(httpErrorMessage(error, 'delete ticket', 'Ticket not found'));
        },
      });
  }

  protected reopenTicket(ticket: Ticket) {
    let request: TicketRequest = {
      title: ticket.title,
      description: ticket.description,
      status: TicketStatus.New,
      employeeIds: ticket.employeeIds,
      categoryIds: ticket.categoryIds,
    };
    this.ticketService.updateTicket(ticket.id, request).subscribe({
      next: (ticket) => {
        this.tickets.update((list) => list.map((t) => (t.id === ticket.id ? ticket : t)));
      },
      error: (error) => {
        this.showErrorShackBar(httpErrorMessage(error, 'update ticket', 'Ticket not found'));
      },
    });
  }

  protected canCancel() {
    return (
      this.title().length > 0 ||
      this.description().length > 0 ||
      this.selectedCategories().length > 0 ||
      this.selectedEmployees().length > 0
    );
  }

  protected canDelete(ticket: Ticket): boolean {
    if (ticket.status === TicketStatus.New || ticket.status === TicketStatus.InProgress) {
      return false;
    } else {
      return true;
    }
  }

  protected canReopen(ticket: Ticket): boolean {
    return ticket.status === TicketStatus.Completed || ticket.status === TicketStatus.Cancelled;
  }

  protected clearForm() {
    this.editingTicketId.set(null);
    this.title.set('');
    this.description.set('');
    this.selectedCategories.set([]);
    this.selectedEmployees.set([]);
  }

  protected showErrorShackBar(error: string): void {
    this._snackBar.open(error, 'Ok', {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

  protected readonly TicketStatus = TicketStatus;
  protected readonly statuses = Object.values(TicketStatus);
}

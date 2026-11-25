import { Component, computed, inject, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatChipListbox, MatChipOption } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatInput, MatPrefix } from '@angular/material/input';

import { TicketService } from '../../core/services/ticket.service';
import { CategoryService } from '../../core/services/category.service';
import { Ticket, TicketRequest, TicketStatus } from '../../core/models/ticket.model';
import { Category } from '../../core/models/category.model';
import { httpErrorMessage } from '../../core/http-error';
import { AuthService } from '../../core/services/auth.service';
import { ClosedStatus, EmployeeCardComponent } from './employee-card/employee-card.component';

type SortDirection = 'asc' | 'desc';

@Component({
  imports: [
    MatIcon,
    MatButton,
    MatChipOption,
    MatChipListbox,
    FormsModule,
    MatFormField,
    MatInput,
    MatPrefix,
    EmployeeCardComponent,
  ],
  selector: 'app-employee',
  styleUrl: './employee.component.scss',
  templateUrl: './employee.component.html',
})
export class EmployeeComponent {
  _snackBar = inject(MatSnackBar);
  authService = inject(AuthService);

  sortDirection = signal<SortDirection>('desc');
  selectedStatusFilter = signal<TicketStatus | undefined>(undefined);
  visibleTickets = computed(() => {
    const myId = this.authService.user()?.id;
    const status = this.selectedStatusFilter();
    const search = this.searchTicket().trim().toLowerCase();
    const direction = this.sortDirection() === 'asc' ? 1 : -1;

    return this.tickets()
      .filter(
        (t) =>
          myId != null &&
          t.employeeIds.includes(myId) &&
          !this.isClosed(t.status) &&
          (!status || t.status === status) &&
          (t.title.toLowerCase().includes(search) || t.description.toLowerCase().includes(search)),
      )
      .sort(
        (a, b) => (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * direction,
      );
  });

  ticketService = inject(TicketService);
  categoryService = inject(CategoryService);

  tickets = signal<Ticket[]>([]);
  categories = signal<Category[]>([]);

  searchTicket = signal<string>('');

  constructor() {
    this.ticketService.getTickets().subscribe({
      next: (tickets) => {
        this.tickets.set(tickets);
      },
      error: (err) => this.showErrorShackBar(httpErrorMessage(err, 'load tickets')),
    });

    this.categoryService.getCategories().subscribe({
      next: (categories) => this.categories.set(categories),
      error: (err) => this.showErrorShackBar(httpErrorMessage(err, 'load categories')),
    });
  }

  protected changeStatus(ticket: Ticket, status: TicketStatus) {
    const request: TicketRequest = {
      title: ticket.title,
      description: ticket.description,
      status: status,
      employeeIds: ticket.employeeIds,
      categoryIds: ticket.categoryIds,
    };

    this.ticketService.updateTicket(ticket.id, request).subscribe({
      next: (updated) => {
        this.tickets.update((list) => {
          const exists = list.some((t) => t.id === updated.id);

          const next = exists
            ? list.map((t) => (t.id === updated.id ? updated : t))
            : [...list, updated];
          return next.filter((t) => !this.isClosed(t.status));
        });
      },
      error: (err) => {
        this.showErrorShackBar(httpErrorMessage(err, 'update ticket', 'Ticket not found'));
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

  private isClosed(status: TicketStatus) {
    return status === TicketStatus.Cancelled || status === TicketStatus.Completed;
  }

  protected closeTicket(ticket: Ticket, status: ClosedStatus) {
    this.changeStatus(ticket, status);
    this.showSnackBar(ticket, status === TicketStatus.Cancelled ? 'cancelled' : 'finished');
  }

  protected showSnackBar(ticket: Ticket, message: string) {
    const found = this.tickets().findIndex((t) => t.id === ticket.id);
    const index = found < 0 ? this.tickets().length : found;

    const ref = this._snackBar.open(`Ticket ${message}`, 'Undo', { duration: 5000 });
    ref.onAction().subscribe(() => {
      this.tickets.update((list) =>
        list.some((t) => t.id === ticket.id)
          ? list
          : [...list.slice(0, index), ticket, ...list.slice(index)],
      );
      this.changeStatus(ticket, ticket.status);
    });
  }

  protected toggleSort() {
    this.sortDirection.update((d) => (d === 'asc' ? 'desc' : 'asc'));
  }

  protected readonly TicketStatus = TicketStatus;
}

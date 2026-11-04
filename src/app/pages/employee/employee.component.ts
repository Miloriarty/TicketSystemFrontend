import {Component, inject, signal} from '@angular/core';
import {TicketService} from '../../core/services/ticket.service';
import {CategoryService} from '../../core/services/category.service';
import {Ticket, TicketRequest, TicketStatus, TICKET_STATUS_CLASS} from '../../core/models/ticket.model';
import {Category} from '../../core/models/category.model';
import {DatePipe, NgClass} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {MatCard, MatCardActions} from '@angular/material/card';
import {NamesByIdsPipe} from '../../shared/pipes/names-by-ids.pipe';
import {MatButton} from '@angular/material/button';
import {MatChip} from '@angular/material/chips';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {filter} from 'rxjs';
import {TicketDialogComponent, TicketDialogData} from './ticket-dialog/ticket-dialog.component';
import {httpErrorMessage} from '../../core/http-error';
import {AuthService} from '../../core/services/auth.service';

@Component({
  imports: [
    DatePipe,
    MatIcon,
    MatCard,
    MatChip,
    MatCardActions,
    MatButton,
    NgClass,
    NamesByIdsPipe
  ],
  selector: 'app-employee',
  styleUrl: './employee.component.css',
  templateUrl: './employee.component.html',
})
export class EmployeeComponent {
  _snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  authService = inject(AuthService);

  ticketService = inject(TicketService);
  categoryService = inject(CategoryService);

  tickets = signal<Ticket[]>([]);
  categories = signal<Category[]>([]);

  constructor() {
    this.ticketService.getTickets().subscribe({
      next: tickets => {
        let filtered = tickets.filter(t =>
          t.employeeIds.includes(this.authService.user()!.id)
        )
        this.tickets.set(filtered.filter(t => t.status !== TicketStatus.Cancelled))
      },
      error: err => this.showErrorShackBar(httpErrorMessage(err, 'load tickets')),
    });

    this.categoryService.getCategories().subscribe({
      next: categories => this.categories.set(categories),
      error: err => this.showErrorShackBar(httpErrorMessage(err, 'load categories')),
    });
  }

  protected readonly statusClass = TICKET_STATUS_CLASS;


  protected changeStatus(ticket: Ticket, status: TicketStatus) {
    const request: TicketRequest = {
      title: ticket.title,
      description: ticket.description,
      status: status,
      employeeIds: ticket.employeeIds,
      categoryIds: ticket.categoryIds
    }

    this.ticketService.updateTicket(ticket.id, request).subscribe({
      next: updated => {
        this.tickets.update(list => {
          const exists = list.some(t => t.id === updated.id);

          const next = exists
            ? list.map(t => t.id === updated.id ? updated : t)
            : [...list, updated];
          return next.filter(t => t.status !== TicketStatus.Cancelled);
        });

        console.log("Ticket changed");
      },
      error: err => {
        console.error("Failed to update ticket: ", err);
        this.showErrorShackBar(httpErrorMessage(err, 'update ticket', 'Ticket not found'));
      }
    });
  }

  protected showErrorShackBar(error: string): void {
    this._snackBar.open(error, "Ok", {
      duration: 2000,
      verticalPosition: "top",
      horizontalPosition: "center"
    });
  }

  protected showSnackBar(ticket: Ticket) {
    const found = this.tickets().findIndex(t => t.id === ticket.id);
    const index = found < 0 ? this.tickets().length : found;

    const ref = this._snackBar.open(
      "Ticket cancelled",
      "Undo",
      {duration: 5000}
    );
    ref.onAction().subscribe(() => {
      this.tickets.update(list =>
        list.some(t => t.id === ticket.id)
          ? list
          : [...list.slice(0, index), ticket, ...list.slice(index)]
      );
      this.changeStatus(ticket, ticket.status);
    });
  }

  protected openTicket(ticket: Ticket) {
    const categoryNames = this.categories()
      .filter(c => ticket.categoryIds.includes(c.id))
      .map(c => c.name);

    this.dialog
      .open<TicketDialogComponent, TicketDialogData, TicketStatus>(TicketDialogComponent, {
        data: {ticket, categoryNames},
        width: '500px',
        maxWidth: '95vw',
      })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(status => {
        this.changeStatus(ticket, status);
        if (status === TicketStatus.Cancelled) this.showSnackBar(ticket);
      });
  }

  protected readonly TicketStatus = TicketStatus;
}

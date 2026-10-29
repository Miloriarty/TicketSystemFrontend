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

  ticketService = inject(TicketService);
  categoryService = inject(CategoryService);

  tickets = signal<Ticket[]>([]);
  categories = signal<Category[]>([]);

  constructor() {
    this.ticketService.getTickets().subscribe(ticket => {
      this.tickets.set(ticket)
    })

    this.categoryService.getCategories().subscribe(category => {
      this.categories.set(category)
    })
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
      next: ticket => {
        this.tickets.update(list =>
          list.map(t => t.id == ticket.id ? ticket : t)
        )

        console.log("Ticket changed");
      },
      error: err => {
        console.error("Failed to update ticket: " + err);
      }
    });
  }

  protected showSnackBar(ticket: Ticket): boolean {
    let ref = this._snackBar.open("Ticket cancelled", "cancel", {duration: 5000});
    ref.onAction().subscribe(() => {
      this.changeStatus(ticket, TicketStatus.New);
    });

    return true;
  }

  protected readonly TicketStatus = TicketStatus;
}

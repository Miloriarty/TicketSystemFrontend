import {Component, inject, signal} from '@angular/core';
import {TicketService} from '../../core/services/ticket';
import {CategoryService} from '../../core/services/category';
import {Ticket, TicketRequest, TicketStatus, TICKET_STATUS_CLASS} from '../../core/models/ticket';
import {Category} from '../../core/models/category';
import {DatePipe, NgClass} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {MatCard, MatCardActions} from '@angular/material/card';
import {NamesByIdsPipe} from '../../shared/pipes/names-by-ids';
import {MatButton} from '@angular/material/button';
import {MatChip} from '@angular/material/chips';



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
  styleUrl: './employee.css',
  templateUrl: './employee.html',
})
export class EmployeeComponent {
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
      description: ticket.description,
      status: status,
      employeesId: ticket.employeesId,
      categoriesId: ticket.categoriesId
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

  protected deleteTicket(ticketId: number) {

  }

  protected readonly TicketStatus = TicketStatus;
}

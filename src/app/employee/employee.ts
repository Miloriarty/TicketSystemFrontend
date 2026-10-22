import {Component, inject, signal} from '@angular/core';
import {EmployeeService} from '../services/employee';
import {Ticket, TicketRequest, TicketService, TicketStatus} from '../services/ticket';
import {DatePipe, NgClass} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {Category, CategoryService} from '../services/category';
import {MatCard, MatCardActions} from '@angular/material/card';
import {AppHeader} from '../app-header/app-header';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatChip} from '@angular/material/chips';



@Component({
  imports: [
    DatePipe,
    MatIcon,
    MatCard,
    AppHeader,
    MatIconButton,
    MatChip,
    MatCardActions,
    MatButton,
    NgClass
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

  protected readonly statusClass: Record<TicketStatus, string> = {
    [TicketStatus.New]: 'new',
    [TicketStatus.InProgress]: 'progress',
    [TicketStatus.Cancelled]: 'cancelled',
    [TicketStatus.Completed]: 'completed',
  };


  protected getCategoryNames(categoriesId: number[]): string[] {
    return this.categories()
      .filter(cat => categoriesId.includes(cat.id))
      .map(cat => cat.name)
  }

  protected cancelTicket(ticket: Ticket) {
    const request: TicketRequest = {
      description: ticket.description,
      status: TicketStatus.Cancelled,
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

  protected takeTicket(ticket: Ticket) {
    const request: TicketRequest = {
      description: ticket.description,
      status: TicketStatus.InProgress,
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

  protected completeTicket(ticket: Ticket) {
    const request: TicketRequest = {
      description: ticket.description,
      status: TicketStatus.Completed,
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

import { Component, computed, input, output } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { MatCard } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Ticket, TicketStatus, TICKET_STATUS_CLASS } from '../../../core/models/ticket.model';
import { Employee } from '../../../core/models/employee.model';
import { NamesByIdsPipe } from '../../../shared/pipes/names-by-ids.pipe'

@Component({
  imports: [MatCard, MatButtonModule, MatIconModule, DatePipe, NgClass, NamesByIdsPipe],
  selector: 'app-ticket-card',
  styleUrl: './ticket-card.component.scss',
  templateUrl: './ticket-card.component.html',
})
export class TicketCardComponent {
  ticket = input.required<Ticket>();
  employees = input<Employee[]>([]);

  edit = output<Ticket>();
  delete = output<number>();
  reopen = output<Ticket>();

  protected readonly statusClass = TICKET_STATUS_CLASS;

  protected canDelete = computed(() => {
    const status = this.ticket().status;
    return status !== TicketStatus.New && status !== TicketStatus.Completed;
  })

  protected canReopen = computed(() => {
    const status = this.ticket().status;
    return status === TicketStatus.Completed || status === TicketStatus.Cancelled;
  })
}

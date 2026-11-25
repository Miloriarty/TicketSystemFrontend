import { Component, inject, input, output } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardActions } from '@angular/material/card';
import { MatChip } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs';

import { NamesByIdsPipe } from '../../../shared/pipes/names-by-ids.pipe';
import { Ticket, TICKET_STATUS_CLASS, TicketStatus } from '../../../core/models/ticket.model';
import { Category } from '../../../core/models/category.model';
import { TicketDialogComponent, TicketDialogData } from '../ticket-dialog/ticket-dialog.component';

export type ClosedStatus = TicketStatus.Cancelled | TicketStatus.Completed;

export interface TicketStatusEvent<S extends TicketStatus = TicketStatus> {
  ticket: Ticket;
  status: S;
}

@Component({
  imports: [
    DatePipe,
    MatButton,
    MatCard,
    MatCardActions,
    MatChip,
    MatIcon,
    NamesByIdsPipe,
    NgClass,
  ],
  selector: 'app-employee-card',
  styleUrl: './employee-card.component.scss',
  templateUrl: './employee-card.component.html',
})
export class EmployeeCardComponent {
  ticket = input.required<Ticket>();
  categories = input.required<Category[]>();

  closeTicket = output<TicketStatusEvent<ClosedStatus>>();
  changeStatus = output<TicketStatusEvent>();

  dialog = inject(MatDialog);

  TicketStatus = TicketStatus;
  statusClass = TICKET_STATUS_CLASS;

  protected close(status: ClosedStatus) {
    this.closeTicket.emit({ ticket: this.ticket(), status });
  }

  protected setStatus(status: TicketStatus) {
    this.changeStatus.emit({ ticket: this.ticket(), status });
  }

  protected openTicket() {
    const ticket = this.ticket();
    const categoryNames = this.categories()
      .filter((c) => ticket.categoryIds.includes(c.id))
      .map((c) => c.name);

    this.dialog
      .open<TicketDialogComponent, TicketDialogData, TicketStatus>(TicketDialogComponent, {
        data: { ticket, categoryNames },
        width: '500px',
        maxWidth: '95vw',
      })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe((status) => {
        if (status === TicketStatus.Cancelled || status === TicketStatus.Completed) {
          this.close(status);
        } else {
          this.setStatus(status);
        }
      });
  }
}

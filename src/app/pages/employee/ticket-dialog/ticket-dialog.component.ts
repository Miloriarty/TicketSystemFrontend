import {Component, inject} from '@angular/core';
import {DatePipe, NgClass} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {MatChip} from '@angular/material/chips';
import {
  MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle,
} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';
import {Ticket, TICKET_STATUS_CLASS, TicketStatus} from '../../../core/models/ticket.model';

export interface TicketDialogData {
  ticket: Ticket;
  categoryNames: string[];
}

@Component({
  selector: 'app-ticket-dialog',
  imports: [
    DatePipe, NgClass, MatButton, MatChip, MatIcon,
    MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose
  ],
  templateUrl: './ticket-dialog.component.html',
  styleUrl: './ticket-dialog.component.css',
})
export class TicketDialogComponent {
  protected readonly data = inject<TicketDialogData>(MAT_DIALOG_DATA);
  protected readonly statusClass = TICKET_STATUS_CLASS;
  protected readonly TicketStatus = TicketStatus;
}


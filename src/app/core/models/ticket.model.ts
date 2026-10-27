export interface Ticket {
  id: number;
  description: string;
  status: TicketStatus;
  createdAt: Date;
  employeeIds: Array<number>;
  categoryIds: Array<number>;
}

export interface TicketRequest {
  description: string;
  status: TicketStatus;
  employeeIds: Array<number>;
  categoryIds: Array<number>;
}

export enum TicketStatus {
  New = "New",
  InProgress = "progress",
  Cancelled = "Cancelled",
  Completed = "Completed",
}

export const TICKET_STATUS_CLASS: Record<TicketStatus, string> = {
  [TicketStatus.New]: 'new',
  [TicketStatus.InProgress]: 'progress',
  [TicketStatus.Cancelled]: 'cancelled',
  [TicketStatus.Completed]: 'completed',
};

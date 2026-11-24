import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_URL } from '../api';
import { Ticket, TicketRequest } from '../models/ticket.model';

@Service()
export class TicketService {
  private readonly client = inject<HttpClient>(HttpClient);
  private readonly apiUrl = `${API_URL}/tickets`;

  getTickets(): Observable<Ticket[]> {
    return this.client.get<Ticket[]>(this.apiUrl);
  }

  createTicket(ticket: TicketRequest): Observable<Ticket> {
    return this.client.post<Ticket>(this.apiUrl, ticket);
  }

  updateTicket(id: number, ticket: TicketRequest): Observable<Ticket> {
    return this.client.put<Ticket>(`${this.apiUrl}/${id}`, ticket);
  }

  deleteTicket(id: number): Observable<void> {
    return this.client.delete<void>(`${this.apiUrl}/${id}`);
  }
}

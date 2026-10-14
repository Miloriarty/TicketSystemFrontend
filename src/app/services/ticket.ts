import {inject, Service} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface Ticket {
  id: number;
  description: string;
  status: string;
  createdAt: Date;
  employeesId: Array<number>;
  categoriesId: Array<number>;
}

export interface TicketRequest {
  description: string;
  status: string;
  employeesId: Array<number>;
  categoriesId: Array<number>;
}

@Service()
export class TicketService {
  private readonly client = inject<HttpClient>(HttpClient);
  private readonly apiUrl = "http://localhost:5042/api/tickets";

  public getTickets() : Observable<Ticket[]> {
    return this.client.get<Ticket[]>(this.apiUrl);
  }

  public createTicket(ticket: TicketRequest): Observable<Ticket> {
    return this.client.post<Ticket>(this.apiUrl, ticket);
  }
}

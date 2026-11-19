import {Role} from './role.model';

export interface Employee {
  id: number;
  fullName: string;
  position: string;
  startDate: Date;
  role: Role;
  categoryIds: Array<number>;
  ticketIds: Array<number>;
}

export interface EmployeeRequest {
  fullName: string;
  position: string;
  password?: string;
  role: Role;
  categoryIds: Array<number>;
}

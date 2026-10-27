export interface Employee {
  id: number;
  fullName: string;
  position: string;
  startDate: Date;
  roleId: number;
  categoryIds: Array<number>;
  ticketIds: Array<number>;
}

export interface EmployeeRequest {
  fullName: string;
  position: string;
  roleId: number;
  categoryIds: Array<number>;
}

export interface Employee {
  id: number;
  fullName: string;
  position: string;
  startDate: Date;
  roleId: number;
  categoriesId: Array<number>;
  ticketsId: Array<number>;
}

export interface EmployeeRequest {
  fullName: string;
  position: string;
  roleId: number;
  categoriesId: Array<number>;
}

export interface Category {
  id: number;
  name: string;
  employeeIds: Array<number>,
  ticketIds: Array<number>
}

export interface CategoryRequest {
  name: string;
}

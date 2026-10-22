export interface Category {
  id: number;
  name: string;
  employeesId: Array<number>,
  ticketsId: Array<number>
}

export interface CategoryRequest {
  name: string;
}

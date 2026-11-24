import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { NamesByIdsPipe } from '../../../shared/pipes/names-by-ids.pipe';
import { Employee } from '../../../core/models/employee.model';
import { Category } from '../../../core/models/category.model';

@Component({
  imports: [DatePipe, MatCard, MatIcon, MatIconButton, NamesByIdsPipe],
  selector: 'app-employee-card',
  styleUrl: './employee-card.component.scss',
  templateUrl: './employee-card.component.html',
})
export class EmployeeCardComponent {
  employee = input.required<Employee>();
  categories = input.required<Category[]>();
  myId = input<number>();

  edit = output<Employee>();
  delete = output<Employee>();
}

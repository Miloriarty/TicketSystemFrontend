import { Component } from '@angular/core';
import {ManagerComponent} from './manager/manager';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ManagerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}

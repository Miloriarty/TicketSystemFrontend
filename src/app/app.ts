import { Component } from '@angular/core';
import {ManagerComponent} from './manager/manager';
import {AdminComponent} from './admin/admin';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ManagerComponent, AdminComponent, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}

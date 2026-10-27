import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {AppHeader} from './layout/app-header/app-header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AppHeader, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class App {}

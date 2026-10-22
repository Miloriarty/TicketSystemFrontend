import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {AppHeader} from './layout/app-header/app-header';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AppHeader, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}

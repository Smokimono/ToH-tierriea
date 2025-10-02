import { Component, signal } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {Heroes} from './components/heroes/heroes';
import { Message } from './components/message/message';
import { Weapon } from './components/weapon/weapon';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Heroes, Message, RouterLink, Weapon],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'ToH2025';
}

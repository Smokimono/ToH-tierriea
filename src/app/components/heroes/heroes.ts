import { Component , OnInit} from '@angular/core';
import { HeroInterface} from '../../Data/heroInterface';
import {UpperCasePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HeroService} from '../../services/hero';
import { MessageService } from '../../services/message';

import { CommonModule } from '@angular/common';
import {HeroDetail} from '../hero-detail/hero-detail';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-heroes',
  imports: [
    UpperCasePipe,
    FormsModule,
    HeroDetail,
    RouterLink
  ],
  templateUrl: './heroes.html',
  styleUrl: './heroes.css'
})
export class Heroes implements OnInit {
  heroes: HeroInterface[] = [];
  selectedHero?: HeroInterface;
  showCreateForm = false;
  newHeroName = '';

  constructor(private heroService: HeroService, private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.getHeroes();
  }

  onSelect(hero: HeroInterface): void {
    this.selectedHero = hero;
    this.messageService.add(`HeroesComponent: Selected hero id=${hero.id}`);
  }

  getHeroes(): void {
    this.heroService.getHeroes().subscribe(heroes=> this.heroes = heroes);
  }

  newHero() {
    if (!this.newHeroName.trim()) return;
    let hero: HeroInterface = {id: '', name: this.newHeroName.trim(), attack: 10, dodging: 10, damage: 10, hp: 10, idWeapon:""};
    this.heroService.addHero(hero);
    this.newHeroName = '';
    this.showCreateForm = false;
  }
}

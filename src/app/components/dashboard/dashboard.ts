import {Component, OnInit} from '@angular/core';
import {Heroes} from '../heroes/heroes';
import {HeroService} from '../../services/hero';
import {HeroInterface} from '../../Data/heroInterface';
import {RouterLink} from '@angular/router';
import {HeroDetail} from '../hero-detail/hero-detail';


@Component({
  selector: 'app-dashboard',
  imports: [
    RouterLink
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  heroes: HeroInterface[] = [];

  constructor(private heroService: HeroService) { }

  ngOnInit(): void {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getHeroes()
      .subscribe(heroes => this.heroes = heroes.slice(1, 5));
  }
}

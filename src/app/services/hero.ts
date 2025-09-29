import { Injectable } from '@angular/core';
import {HeroInterface} from "../Data/heroInterface";
import {HEROES} from "../Data/mock-heroes";
import {Observable, of} from "rxjs";
import {MessageService} from "./message"

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  constructor(private messageService: MessageService) { }

  /*getHeroes(): Observable<HeroInterface[]> {
    const heroes = of(HEROES);
    return heroes;
  }*/
  getHeroes(): Observable<HeroInterface[]> {
  //const heroes = of(HEROES);
  // Simulation d'une arrivée en retard des données
    const heroes: Observable<HeroInterface[]> = new Observable(observer => {
      observer.next(HEROES.slice(0, 2)); // 2 éléments envoyés
      setTimeout(() => {
        observer.next(HEROES);
        observer.complete();
      }, 3000);
    });
    this.messageService.add("Hero Service fetched heroes");
    return heroes;
  }

  getHero(id: number): Observable<HeroInterface> {
    // For now, assume that a hero with the specified `id` always exists.
    // Error handling will be added in the next step of the tutorial.
    const hero = HEROES.find(h => h.id === id)!;
    this.messageService.add(`HeroService: fetched hero id=${id}`);
    return of(hero);
  }
}

import { Injectable } from '@angular/core';
import {HeroInterface} from "../Data/heroInterface";
import {HEROES} from "../Data/mock-heroes";
import {Observable, of} from "rxjs";
import {MessageService} from "./message"
import {FirebaseApp} from '@angular/fire/app';
import {collection, collectionData, deleteDoc, doc, docData, Firestore, setDoc} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  constructor(private messageService: MessageService, private firestore: Firestore) { }

  /*getHeroes(): Observable<HeroInterface[]> {
    const heroes = of(HEROES);
    return heroes;
  }*/

  // URL d'accès aux documents sur Firebase
  private static url = 'heroes';


  // getHeroes(): Observable<HeroInterface[]> {
  // //const heroes = of(HEROES);
  // // Simulation d'une arrivée en retard des données
  //   const heroes: Observable<HeroInterface[]> = new Observable(observer => {
  //     observer.next(HEROES.slice(0, 2)); // 2 éléments envoyés
  //     setTimeout(() => {
  //       observer.next(HEROES);
  //       observer.complete();
  //     }, 3000);
  //   });
  //   this.messageService.add("Hero Service fetched heroes");
  //   return heroes;
  // }


  getHeroes(): Observable<HeroInterface[]> {
// get a reference to the hero collection
    const heroCollection = collection(this.firestore, HeroService.url);
///////////
// Solution 1 : Transformation en une liste d'objets "prototype" de type Hero
// get documents (data) from the collection using collectionData
    return collectionData(heroCollection, { idField: 'id' }) as Observable<HeroInterface[]>;
  }

  // getHero(id: number): Observable<HeroInterface> {
  //   // For now, assume that a hero with the specified `id` always exists.
  //   // Error handling will be added in the next step of the tutorial.
  //   const hero = HEROES.find(h => h.id === id)!;
  //   this.messageService.add(`HeroService: fetched hero id=${id}`);
  //   return of(hero);
  // }

  getHero(id: string): Observable<HeroInterface> {
// Récupération du DocumentReference
    const heroDocument = doc(this.firestore, HeroService.url + "/" + id);
///////////
// Solution 1 : Transformation en un objet "prototype" de type Hero
// get documents (data) from the collection using collectionData
    return docData(heroDocument, { idField: 'id' }) as Observable<HeroInterface>;
  }
  deleteHero(id: string): Promise<void> {
// Récupération du DocumentReference
    const heroDocument = doc(this.firestore, HeroService.url + "/" + id);
//
    return deleteDoc(heroDocument);
  }
  updateHero(hero: HeroInterface): Promise<void> {
    const heroDocument = doc(this.firestore, HeroService.url + '/' + hero.id);
    // On utilise setDoc pour écraser le document avec les nouvelles valeurs
    return setDoc(heroDocument, hero);
  }
}

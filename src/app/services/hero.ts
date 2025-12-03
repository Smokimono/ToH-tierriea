import { Injectable } from '@angular/core';
import {HeroInterface} from "../Data/heroInterface";
import {HEROES} from "../Data/mock-heroes";
import {Observable, of} from "rxjs";
import {MessageService} from "./message"
import {FirebaseApp} from '@angular/fire/app';
import {addDoc, collection, collectionData, deleteDoc, doc, docData, Firestore, setDoc} from '@angular/fire/firestore';

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
    this.messageService.add("HeroService: Liste des héros récupérée");
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
    this.messageService.add(`HeroService: Héros id=${id} récupéré`);
// get documents (data) from the collection using collectionData
    return docData(heroDocument, { idField: 'id' }) as Observable<HeroInterface>;
  }
  deleteHero(id: string): Promise<void> {
// Récupération du DocumentReference
    this.messageService.add(`HeroService: Héros id=${id} supprimé`);
    const heroDocument = doc(this.firestore, HeroService.url + "/" + id);
//
    return deleteDoc(heroDocument);
  }
  updateHero(hero: HeroInterface): Promise<void> {
    this.messageService.add(`HeroService: Héros ${hero.name} mis à jour`);
    const heroDocument = doc(this.firestore, HeroService.url + '/' + hero.id);
    const heroJSON = HeroService.transformationToJSON(hero);
    return setDoc(heroDocument, heroJSON, { merge: true });
  }
  addHero(hero: HeroInterface): Promise<HeroInterface> {

    // get a reference to the hero collection
    const heroCollection = collection(this.firestore, HeroService.url);

    let heroPromise: Promise<HeroInterface> = new Promise( (resolve, reject) => {
      addDoc(heroCollection, HeroService.transformationToJSON(hero)).then(
        heroDocument => { // success
          hero.id = heroDocument.id;
          resolve(hero);
        },
        msg => { // error
          reject(msg);
        });
    });

    //
    return heroPromise;
  }
  updateHeroWeapon(id: string, idWeapon: string | null): Promise<void> {
    const heroDocument = doc(this.firestore, HeroService.url + '/' + id);
    return setDoc(heroDocument, { idWeapon }, { merge: true });
  }
  updateHeroPhoto(id: string, photoURL: string | null): Promise<void> {
    const heroDocument = doc(this.firestore, HeroService.url + '/' + id);
    return setDoc(heroDocument, { photoURL }, { merge: true });
  }

  private static transformationToJSON(hero: HeroInterface): any {
    const newHeroJSON: any = {
      name: hero.name,
      attack: hero.attack,
      dodging: hero.dodging,
      damage: hero.damage,
      hp: hero.hp
    };
    if (hero.idWeapon !== undefined) newHeroJSON.idWeapon = hero.idWeapon;
    if (hero.photoURL !== undefined) newHeroJSON.photoURL = hero.photoURL;
    return newHeroJSON;
  }
}

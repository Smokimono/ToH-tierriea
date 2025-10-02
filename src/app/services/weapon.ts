import { Injectable } from '@angular/core';
import {HeroInterface} from "../Data/heroInterface";
import {Observable, of} from "rxjs";
import {MessageService} from "./message"
import {FirebaseApp} from '@angular/fire/app';
import {addDoc, collection, collectionData, deleteDoc, doc, docData, Firestore, setDoc} from '@angular/fire/firestore';
import {WeaponInterface} from '../Data/weaponInterface';

@Injectable({
  providedIn: 'root'
})
export class WeaponService {
  constructor(private messageService: MessageService, private firestore: Firestore) { }

  /*getHeroes(): Observable<HeroInterface[]> {
    const heroes = of(HEROES);
    return heroes;
  }*/

  // URL d'accès aux documents sur Firebase
  private static url = 'weapon';


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


  getWeapons(): Observable<WeaponInterface[]> {
// get a reference to the hero collection
    const weaponCollection = collection(this.firestore, WeaponService.url);
///////////
// Solution 1 : Transformation en une liste d'objets "prototype" de type Hero
// get documents (data) from the collection using collectionData
    return collectionData(weaponCollection, { idField: 'id' }) as Observable<WeaponInterface[]>;
  }

  // getHero(id: number): Observable<HeroInterface> {
  //   // For now, assume that a hero with the specified `id` always exists.
  //   // Error handling will be added in the next step of the tutorial.
  //   const hero = HEROES.find(h => h.id === id)!;
  //   this.messageService.add(`HeroService: fetched hero id=${id}`);
  //   return of(hero);
  // }

  getWeapon(id: string): Observable<WeaponInterface> {
// Récupération du DocumentReference
    const weaponDocument = doc(this.firestore, WeaponService.url + "/" + id);
///////////
// Solution 1 : Transformation en un objet "prototype" de type Hero
// get documents (data) from the collection using collectionData
    return docData(weaponDocument, { idField: 'id' }) as Observable<WeaponInterface>;
  }
  deleteHero(id: string): Promise<void> {
// Récupération du DocumentReference
    const heroDocument = doc(this.firestore, WeaponService.url + "/" + id);
//
    return deleteDoc(heroDocument);
  }
  updateWeapon(weapon: WeaponInterface): Promise<void> {
    const weaponDocument = doc(this.firestore, WeaponService.url + '/' + weapon.id);
    // On utilise setDoc pour écraser le document avec les nouvelles valeurs
    return setDoc(weaponDocument, weapon);
  }
  addWeapon(weapon: WeaponInterface): Promise<WeaponInterface> {

    // get a reference to the hero collection
    const weaponCollection = collection(this.firestore, WeaponService.url);

    let heroPromise: Promise<HeroInterface> = new Promise( (resolve, reject) => {
      addDoc(weaponCollection, WeaponService.transformationToJSON(weapon)).then(
        heroDocument => { // success
          weapon.id = heroDocument.id;
          resolve(weapon);
        },
        msg => { // error
          reject(msg);
        });
    });

    //
    return heroPromise;
  }

  private static transformationToJSON(weapon: WeaponInterface): any {

    ///////
    // Il n'est pas nécessaire d'evnoyer l'id dans le corps du document donc suppression de cette information
    ///////

    // Solution 1 : création d'un JSON object "ad hoc" (sans la propriété id)
    let newHeroJSON = {name: weapon.name, attack: weapon.attack, dodging: weapon.dodging, damage: weapon.damage, hp: weapon.hp};

    // Solution 2 : création d'un JSON object en supprimant la propriété id
    // let newHeroJSON = Object.assign({}, hero);   // Cette solution met l'id dans firebase au niveau du document
    // delete newHeroJSON.id;

    //
    return newHeroJSON;
  }
}

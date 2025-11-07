import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {WeaponInterface} from '../../Data/weaponInterface';
import {WeaponService} from '../../services/weapon';
import {HeroService} from '../../services/hero';
import {MessageService} from '../../services/message';
import {RouterLink} from '@angular/router';
@Component({
  selector: 'app-weapon',
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './weapon.html',
  styleUrl: './weapon.css'
})
export class Weapon implements  OnInit {
  showCreateForm = false;
  weapons: WeaponInterface[] = [];
  newWeaponName: string = "";
  searchTerm: string = '';

  constructor(private weaponService: WeaponService, private messageService: MessageService) {}


  ngOnInit(): void {
    this.getweapons();
  }

  getweapons(): void {
    this.weaponService.getWeapons().subscribe(weapons=> this.weapons = weapons);
  }

  newWeapon() {
    if (!this.newWeaponName.trim()) return;
    let weapon: WeaponInterface = {id: "", name: this.newWeaponName.trim(), attack: 0, dodging: 0, damage: 0, hp: 0};
    this.weaponService.addWeapon(weapon);
    this.newWeaponName = "";
    this.showCreateForm = false;
  }

  get filteredWeapons(): WeaponInterface[] {
    if (!this.searchTerm.trim()) return this.weapons;
    const term = this.searchTerm.trim().toLowerCase();
    return this.weapons.filter(weapon =>
      weapon.name.toLowerCase().includes(term)
    );
  }
  sortBy(stat: keyof WeaponInterface) {
    this.weapons = [...this.weapons].sort((a, b) => parseInt(b[stat] as any, 10) - parseInt(a[stat] as any, 10));
  }
}

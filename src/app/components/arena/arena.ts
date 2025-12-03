import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {combineLatest} from 'rxjs';
import {HeroInterface} from '../../Data/heroInterface';
import {WeaponInterface} from '../../Data/weaponInterface';
import {HeroService} from '../../services/hero';
import {WeaponService} from '../../services/weapon';

interface CombatantState {
  hero: HeroInterface;
  weapon?: WeaponInterface;
  currentHp: number;
  log: string[];
}

@Component({
  selector: 'app-arena',
  imports: [CommonModule, FormsModule],
  templateUrl: './arena.html',
  styleUrl: './arena.css'
})
export class Arena implements OnInit {
  heroes: HeroInterface[] = [];
  weapons: WeaponInterface[] = [];

  hero1Id: string | null = null;
  hero2Id: string | null = null;

  combatant1?: CombatantState;
  combatant2?: CombatantState;

  inProgress = false;
  finished = false;
  winner?: CombatantState;

  private stepTimer: any;
  stepDelayMs = 1000;

  constructor(private heroService: HeroService,
              private weaponService: WeaponService) {}

  ngOnInit(): void {
    combineLatest([
      this.heroService.getHeroes(),
      this.weaponService.getWeapons()
    ]).subscribe(([heroes, weapons]) => {
      this.heroes = heroes;
      this.weapons = weapons;
    });
  }

  get selectedHeroesValid(): boolean {
    return !!this.hero1Id && !!this.hero2Id && this.hero1Id !== this.hero2Id;
  }

  private toNum(value: any): number {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }

  private buildCombatant(hero: HeroInterface): CombatantState {
    const weapon = hero.idWeapon ? this.weapons.find(w => w.id === hero.idWeapon) : undefined;
    const effectiveHp = this.toNum(hero.hp) + this.toNum(weapon?.hp ?? 0);
    return { hero, weapon, currentHp: effectiveHp, log: [] };
  }

  initFight(): void {
    if (!this.selectedHeroesValid) return;
    const h1 = this.heroes.find(h => h.id === this.hero1Id)!;
    const h2 = this.heroes.find(h => h.id === this.hero2Id)!;
    this.combatant1 = this.buildCombatant(h1);
    this.combatant2 = this.buildCombatant(h2);
    this.inProgress = true;
    this.finished = false;
    this.winner = undefined;
    this.startStepMode();
  }

  private startStepMode(): void {
    let attackerIsFirst = true;
    this.stepTimer = setInterval(() => {
      if (!this.combatant1 || !this.combatant2) return;
      if (this.combatant1.currentHp <= 0 || this.combatant2.currentHp <= 0) {
        this.finishCombat();
        return;
      }
      if (attackerIsFirst) {
        this.executeTurn(this.combatant1, this.combatant2);
      } else {
        this.executeTurn(this.combatant2, this.combatant1);
      }
      attackerIsFirst = !attackerIsFirst;
    }, this.stepDelayMs);
  }

  computeAttackValue(c: CombatantState): number {
    return this.toNum(c.hero.attack) + this.toNum(c.weapon?.attack ?? 0);
  }
  computeDodgingValue(c: CombatantState): number {
    return this.toNum(c.hero.dodging) + this.toNum(c.weapon?.dodging ?? 0);
  }
  computeDamageValue(c: CombatantState): number {
    return this.toNum(c.hero.damage) + this.toNum(c.weapon?.damage ?? 0);
  }

  private attemptHit(attacker: CombatantState, defender: CombatantState): boolean {
    const atk = this.computeAttackValue(attacker);
    const dodge = this.computeDodgingValue(defender);
    const denom = atk + dodge;
    const chance = denom > 0 ? atk / denom : 0.5;
    return Math.random() < chance;
  }

  private executeTurn(attacker: CombatantState, defender: CombatantState): void {
    if (defender.currentHp <= 0) return;
    const hit = this.attemptHit(attacker, defender);
    if (hit) {
      const dmg = this.computeDamageValue(attacker);
      defender.currentHp = Math.max(0, this.toNum(defender.currentHp) - this.toNum(dmg));
      const msg = `${attacker.hero.name} touche ${defender.hero.name} pour ${dmg} dmg (HP restant: ${defender.currentHp})`;
      attacker.log.push(msg);
    } else {
      const msg = `${attacker.hero.name} rate son attaque contre ${defender.hero.name}`;
      attacker.log.push(msg);
    }
    if (defender.currentHp <= 0) {
      this.finishCombat();
    }
  }

  private finishCombat(): void {
    if (this.finished) return;
    if (this.stepTimer) {
      clearInterval(this.stepTimer);
      this.stepTimer = null;
    }
    this.inProgress = false;
    this.finished = true;
    if (this.combatant1 && this.combatant2) {
      this.winner = this.combatant1.currentHp > 0 ? this.combatant1 : this.combatant2;
    }
  }

  reset(): void {
    if (this.stepTimer) {
      clearInterval(this.stepTimer);
      this.stepTimer = null;
    }
    this.inProgress = false;
    this.finished = false;
    this.winner = undefined;
    this.combatant1 = undefined;
    this.combatant2 = undefined;
    this.hero1Id = null;
    this.hero2Id = null;
  }
}

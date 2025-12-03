import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Arena } from './arena';
import {HeroService} from '../../services/hero';
import {WeaponService} from '../../services/weapon';
import {of} from 'rxjs';
import {HeroInterface} from '../../Data/heroInterface';
import {WeaponInterface} from '../../Data/weaponInterface';

const mockHeroes: HeroInterface[] = [
  {id: 'h1', name: 'Hero1', attack: 10, dodging: 5, damage: 4, hp: 30},
  {id: 'h2', name: 'Hero2', attack: 8, dodging: 7, damage: 6, hp: 28}
];
const mockWeapons: WeaponInterface[] = [
  {id: 'w1', name: 'Sword', attack: 2, dodging: 0, damage: 3, hp: 0}
];

class MockHeroService { getHeroes() { return of(mockHeroes); } }
class MockWeaponService { getWeapons() { return of(mockWeapons); } }

describe('Arena', () => {
  let component: Arena;
  let fixture: ComponentFixture<Arena>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Arena],
      providers: [
        {provide: HeroService, useClass: MockHeroService},
        {provide: WeaponService, useClass: MockWeaponService}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Arena);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should simulate a fight and produce a winner', () => {
    component.hero1Id = 'h1';
    component.hero2Id = 'h2';
    component.initFight();
    expect(component.finished).toBeTrue();
    expect(component.winner).toBeDefined();
    expect([mockHeroes[0].name, mockHeroes[1].name]).toContain(component.winner!.hero.name);
  });
});

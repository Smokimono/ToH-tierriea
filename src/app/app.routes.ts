import { Routes } from '@angular/router';
import {Heroes} from "./components/heroes/heroes";
import {Dashboard} from './components/dashboard/dashboard';
import {HeroDetail} from './components/hero-detail/hero-detail';
import {Weapon} from './components/weapon/weapon';
import {WeaponDetail} from './components/weapon-detail/weapon-detail';
import { Arena } from './components/arena/arena';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'heroes', component: Heroes },
  { path: 'dashboard', component: Dashboard },
  { path: 'weapon', component: Weapon },
  { path: 'arena', component: Arena },
  { path: 'detail/:id', component: HeroDetail },
  { path: 'weapondetail/:id', component: WeaponDetail },
];

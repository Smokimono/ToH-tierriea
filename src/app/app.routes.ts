import { Routes } from '@angular/router';
import {Heroes} from "./components/heroes/heroes";
import {Dashboard} from './components/dashboard/dashboard';
import {HeroDetail} from './components/hero-detail/hero-detail';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'heroes', component: Heroes },
  { path: 'dashboard', component: Dashboard },
  { path: 'detail/:id', component: HeroDetail },
];

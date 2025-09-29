import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location, UpperCasePipe } from '@angular/common';
import { HeroInterface } from '../../Data/heroInterface';
import { HeroService } from '../../services/hero';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { statsAreCoherent } from '../../validators/validator-stats';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.html',
  imports: [
    UpperCasePipe,
    ReactiveFormsModule,
    FormsModule
  ],
  styleUrls: ['./hero-detail.css']
})
export class HeroDetail implements OnInit {
  hero: HeroInterface | undefined;
  heroForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.heroService.getHero(id)
      .subscribe(hero => {
        this.hero = hero;
        this.initForm(hero);
      });
  }

  initForm(hero: HeroInterface): void {
    this.heroForm = this.fb.group({
      name: [hero.name, Validators.required],
      attack: [hero.attack, Validators.required],
      dodging: [hero.dodging, Validators.required],
      damage: [hero.damage, Validators.required],
      hp: [hero.hp, Validators.required]
    }, { validators: statsAreCoherent });
  }

  goBack(): void {
    this.location.back();
  }
}

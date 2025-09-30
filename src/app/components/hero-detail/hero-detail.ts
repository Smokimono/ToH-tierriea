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
    const id = String(this.route.snapshot.paramMap.get('id'));
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

  save(): void {
    if (this.hero && this.heroForm.valid) {
      const updatedHero = { ...this.hero, ...this.heroForm.value };
      this.heroService.updateHero(updatedHero).then(() => this.goBack());
    } else {
      this.heroForm.markAllAsTouched();
    }
  }

  pointsRestants(): number {
    if (!this.heroForm) return 0;
    const { attack, dodging, damage, hp } = this.heroForm.value;
    const sum = Number(attack || 0) + Number(dodging || 0) + Number(damage || 0) + Number(hp || 0);
    return 40 - sum;
  }
}

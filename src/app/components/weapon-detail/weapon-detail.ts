import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {Location, UpperCasePipe} from '@angular/common';
import {WeaponInterface} from '../../Data/weaponInterface';
import {WeaponService} from '../../services/weapon';
import {WeaponsStatsAreCoherent} from '../../validators/validator-stats-weapon';

@Component({
  selector: 'app-weapon-detail',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    UpperCasePipe
  ],
  templateUrl: './weapon-detail.html',
  styleUrl: './weapon-detail.css'
})
export class WeaponDetail implements  OnInit {
  weapon: WeaponInterface | undefined;
  weaponForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private weaponService: WeaponService,
    private location: Location,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getweapon();
  }

  getweapon(): void {
    const id = String(this.route.snapshot.paramMap.get('id'));
    this.weaponService.getWeapon(id)
      .subscribe(weapon => {
        this.weapon = weapon;
        this.initForm(weapon);
      });
  }

  initForm(weapon: WeaponInterface): void {
    this.weaponForm = this.fb.group({
      name: [weapon.name, Validators.required],
      attack: [weapon.attack, Validators.required],
      dodging: [weapon.dodging, Validators.required],
      damage: [weapon.damage, Validators.required],
      hp: [weapon.hp, Validators.required]
    }, { validators: WeaponsStatsAreCoherent });
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (this.weapon && this.weaponForm.valid) {
      const updatedweapon = { ...this.weapon, ...this.weaponForm.value };
      this.weaponService.updateWeapon(updatedweapon).then(() => this.goBack());
    } else {
      this.weaponForm.markAllAsTouched();
    }
  }

  pointsRestants(): number {
    if (!this.weaponForm) return 0;
    const { attack, dodging, damage, hp } = this.weaponForm.value;
    const sum = Number(attack || 0) + Number(dodging || 0) + Number(damage || 0) + Number(hp || 0);
    return 40 - sum;
  }
}

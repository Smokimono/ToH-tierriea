import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location, UpperCasePipe } from '@angular/common';
import { HeroInterface } from '../../Data/heroInterface';
import { HeroService } from '../../services/hero';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { statsAreCoherent } from '../../validators/validator-stats';
import { WeaponInterface } from '../../Data/weaponInterface';
import { WeaponService } from '../../services/weapon';
import { HeroImageService } from '../../services/hero-image';

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
  weapons: WeaponInterface[] = [];
  equippedWeapon: WeaponInterface | null = null;
  errorMessage: string = '';
  isDragOver: boolean = false;
  uploading: boolean = false;
  previewUrl: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location,
    private fb: FormBuilder,
    private weaponService: WeaponService,
    private heroImageService: HeroImageService
  ) {}

  ngOnInit(): void {
    this.getHero();
    this.getWeapons();
  }

  getHero(): void {
    const id = String(this.route.snapshot.paramMap.get('id'));
    this.heroService.getHero(id)
      .subscribe(hero => {
        this.hero = hero;
        this.initForm(hero);
        if (hero.idWeapon) {
          this.weaponService.getWeapon(hero.idWeapon).subscribe(weapon => {
            this.equippedWeapon = weapon;
          });
        } else {
          this.equippedWeapon = null;
        }
      });
  }

  getWeapons(): void {
    this.weaponService.getWeapons().subscribe(weapons => {
      this.weapons = weapons;
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

  canEquipWeapon(weapon: WeaponInterface): boolean {
    if (!this.hero) return false;
    const att = parseInt(this.hero.attack as any, 10) + parseInt(weapon.attack as any, 10);
    const esq = parseInt(this.hero.dodging as any, 10) + parseInt(weapon.dodging as any, 10);
    const deg = parseInt(this.hero.damage as any, 10) + parseInt(weapon.damage as any, 10);
    const pv = parseInt(this.hero.hp as any, 10) + parseInt(weapon.hp as any, 10);
    return att >= 1 && esq >= 1 && deg >= 1 && pv >= 1;
  }

  async equipWeapon(weapon: WeaponInterface): Promise<void> {
    if (!this.hero) return;
    if (this.canEquipWeapon(weapon)) {
      try {
        await this.heroService.updateHeroWeapon(this.hero.id, weapon.id);
        this.equippedWeapon = weapon;
        this.hero.idWeapon = weapon.id;
        this.errorMessage = '';
      } catch (e) {
        this.errorMessage = "Erreur lors de l'enregistrement de l'arme équipée.";
      }
    } else {
      this.errorMessage = "Impossible d'équiper cette arme : une caractéristique passerait en dessous de 1.";
    }
  }

  async unequipWeapon(): Promise<void> {
    if (!this.hero || !this.equippedWeapon) return;
    try {
      await this.heroService.updateHeroWeapon(this.hero.id, null);
      if (this.hero.idWeapon !== undefined) {
        delete this.hero.idWeapon;
      }
      this.equippedWeapon = null;
      this.errorMessage = '';
    } catch (e) {
      this.errorMessage = "Erreur lors du déséquipement de l'arme.";
    }
  }

  getFinalStats(): any {
    if (!this.hero) return null;
    const weapon = this.equippedWeapon;
    return {
      attack: parseInt(this.hero.attack as any, 10) + parseInt(weapon?.attack as any ?? 0, 10),
      dodging: parseInt(this.hero.dodging as any, 10) + parseInt(weapon?.dodging as any ?? 0, 10),
      damage: parseInt(this.hero.damage as any, 10) + parseInt(weapon?.damage as any ?? 0, 10),
      hp: parseInt(this.hero.hp as any, 10) + parseInt(weapon?.hp as any ?? 0, 10)
    };
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (this.hero && this.heroForm.valid) {
      const { name, attack, dodging, damage, hp } = this.heroForm.value;
      const updatedHero = {
        id: this.hero.id,
        name,
        attack,
        dodging,
        damage,
        hp
      } as any;
      this.heroService.updateHero(updatedHero).then(() => this.goBack());
    } else {
      this.heroForm.markAllAsTouched();
    }
  }

  pointsRestants(): number {
    if (!this.heroForm) return 0;
    const { attack, dodging, damage, hp } = this.heroForm.value;
    const sum = parseInt(attack ?? 0, 10) + parseInt(dodging ?? 0, 10) + parseInt(damage ?? 0, 10) + parseInt(hp ?? 0, 10);
    return 40 - sum;
  }

  onDragOver(event: DragEvent): void { event.preventDefault(); this.isDragOver = true; }
  onDragLeave(event: DragEvent): void { event.preventDefault(); this.isDragOver = false; }
  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    if (!event.dataTransfer || !event.dataTransfer.files.length || !this.hero) return;
    this.processFile(event.dataTransfer.files[0]);
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files.length || !this.hero) return;
    this.processFile(input.files[0]);
  }
  private processFile(file: File): void {
    if (!file.type.startsWith('image/')) { this.errorMessage = 'Le fichier doit être une image.'; return; }
    this.errorMessage = '';
    this.previewUrl = URL.createObjectURL(file);
    this.uploading = true;
    this.heroImageService.uploadHeroImage(this.hero!.id, file).subscribe({
      next: url => {
        if (this.hero) {
          this.hero.photoURL = url;
          this.heroService.updateHeroPhoto(this.hero.id, url).catch(() => {
          });
        }
        this.uploading = false;
        this.previewUrl = null;
      },
      error: () => {
        this.errorMessage = "Erreur lors de l'upload de l'image.";
        this.uploading = false;
      }
    });
  }

  removePhoto(): void {
    if (!this.hero || !this.hero.photoURL) return;
    const url = this.hero.photoURL;
    this.heroImageService.deleteHeroImage(this.hero.id, url).subscribe({
      next: () => {
        this.heroService.updateHeroPhoto(this.hero!.id, null).finally(() => {
          if (this.hero) this.hero.photoURL = undefined;
        });
      },
      error: () => {
        this.errorMessage = "Impossible de supprimer l'image.";
      }
    });
  }

  openFilePicker(input: HTMLInputElement, event?: Event): void {
    if (event) event.stopPropagation();
    input.value = '';
    input.click();
  }
}

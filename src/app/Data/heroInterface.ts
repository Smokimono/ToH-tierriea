export interface HeroInterface {
  id: string;
  name: string;
  attack: number;
  dodging: number;
  damage: number;
  hp: number;
  idWeapon?: string;
  photoURL?: string; // URL de la photo du héros
}

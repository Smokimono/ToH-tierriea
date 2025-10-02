import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';

export const WeaponsStatsAreCoherent: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const attack = Number(group.get('attack')?.value ?? 0);
  const dodging = Number(group.get('dodging')?.value ?? 0);
  const damage = Number(group.get('damage')?.value ?? 0);
  const hp = Number(group.get('hp')?.value ?? 0);
  const sum = attack + dodging + damage + hp;

  if (
    attack < -5 || attack > 5 ||
    dodging < -5 || dodging > 5 ||
    damage < -5 || damage > 5 ||
    hp < -5 || hp > 5
  ) {
    console.log('[WeaponStatsAreCoherent] valueOutOfRange:', { attack, dodging, damage, hp });
    return { valueOutOfRange: true };
  }
  if (sum !== 0) {
    console.log('[WeaponStatsAreCoherent] sumNotEqualToZero:', { attack, dodging, damage, hp, sum });
    return { sumNotEqualToZero: true };
  }
  return null;
};

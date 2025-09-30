import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';

export const statsAreCoherent: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const attack = Number(group.get('attack')?.value ?? 0);
  const dodging = Number(group.get('dodging')?.value ?? 0);
  const damage = Number(group.get('damage')?.value ?? 0);
  const hp = Number(group.get('hp')?.value ?? 0);
  const sum = attack + dodging + damage + hp;

  if (attack < 1 || dodging < 1 || damage < 1 || hp < 1) {
    console.log('[statsAreCoherent] valueTooLow:', { attack, dodging, damage, hp });
    return { valueTooLow: true };
  }
  if (sum > 40) {
    console.log('[statsAreCoherent] sumTooHigh:', { attack, dodging, damage, hp, sum });
    return { sumTooHigh: true };
  }
  if (sum < 40) {
    console.log('[statsAreCoherent] sumTooLow:', { attack, dodging, damage, hp, sum });
    return { sumTooLow: true };
  }
  return null;
};

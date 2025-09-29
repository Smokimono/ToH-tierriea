import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';

export const statsAreCoherent: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const attack = group.get('attack')?.value ?? 0;
  const dodging = group.get('dodging')?.value ?? 0;
  const damage = group.get('damage')?.value ?? 0;
  const hp = group.get('hp')?.value ?? 0;

  if (attack < 1 || dodging < 1 || damage < 1 || hp < 1) {
    return { valueTooLow: true };
  }
  else if (attack + dodging + damage + hp > 40) {
    return { sumTooHigh: true };
  }

  return null;
};

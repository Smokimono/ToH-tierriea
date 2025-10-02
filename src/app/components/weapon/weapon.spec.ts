import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Weapon } from './weapon';

describe('Weapon', () => {
  let component: Weapon;
  let fixture: ComponentFixture<Weapon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Weapon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Weapon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

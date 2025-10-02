import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeaponDetail } from './weapon-detail';

describe('WeaponDetail', () => {
  let component: WeaponDetail;
  let fixture: ComponentFixture<WeaponDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeaponDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeaponDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

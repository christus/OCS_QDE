import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaxMinLimitsComponent } from './max-min-limits.component';

describe('MaxMinLimitsComponent', () => {
  let component: MaxMinLimitsComponent;
  let fixture: ComponentFixture<MaxMinLimitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaxMinLimitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaxMinLimitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewEligibilityComponent } from './review-eligibility.component';

describe('ReviewEligibilityComponent', () => {
  let component: ReviewEligibilityComponent;
  let fixture: ComponentFixture<ReviewEligibilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewEligibilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewEligibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

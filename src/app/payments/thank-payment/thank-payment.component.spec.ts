import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThankPaymentComponent } from './thank-payment.component';

describe('ThankPaymentComponent', () => {
  let component: ThankPaymentComponent;
  let fixture: ComponentFixture<ThankPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThankPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThankPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

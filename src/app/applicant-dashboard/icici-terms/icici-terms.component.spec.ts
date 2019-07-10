import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IciciTermsComponent } from './icici-terms.component';

describe('IciciTermsComponent', () => {
  let component: IciciTermsComponent;
  let fixture: ComponentFixture<IciciTermsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IciciTermsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IciciTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

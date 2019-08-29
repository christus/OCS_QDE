import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsHeaderComponent } from './leads-header.component';

describe('LeadsHeaderComponent', () => {
  let component: LeadsHeaderComponent;
  let fixture: ComponentFixture<LeadsHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadsHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

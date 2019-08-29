import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsSidebarComponent } from './leads-sidebar.component';

describe('LeadsSidebarComponent', () => {
  let component: LeadsSidebarComponent;
  let fixture: ComponentFixture<LeadsSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadsSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadsSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

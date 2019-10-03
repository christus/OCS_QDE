import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAuditTrialComponent } from './admin-audit-trial.component';

describe('AdminAuditTrialComponent', () => {
  let component: AdminAuditTrialComponent;
  let fixture: ComponentFixture<AdminAuditTrialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAuditTrialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAuditTrialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

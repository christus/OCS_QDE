import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectorLeadCreateComponent } from './connector-lead-create.component';

describe('ConnectorLeadCreateComponent', () => {
  let component: ConnectorLeadCreateComponent;
  let fixture: ComponentFixture<ConnectorLeadCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectorLeadCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectorLeadCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

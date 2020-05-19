import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMyStudentsComponent } from './dashboard-my-students.component';

describe('DashboardMyStudentsComponent', () => {
  let component: DashboardMyStudentsComponent;
  let fixture: ComponentFixture<DashboardMyStudentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardMyStudentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardMyStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

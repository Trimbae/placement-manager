import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMyTasksComponent } from './dashboard-my-tasks.component';

describe('DashboardMyTasksComponent', () => {
  let component: DashboardMyTasksComponent;
  let fixture: ComponentFixture<DashboardMyTasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardMyTasksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardMyTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMyTasksComponent } from './dashboard-my-tasks.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {LoadingSpinnerComponent} from '../common/loading-spinner/loading-spinner.component';
import {NgbProgressbar} from '@ng-bootstrap/ng-bootstrap';

describe('DashboardMyTasksComponent', () => {
  let component: DashboardMyTasksComponent;
  let fixture: ComponentFixture<DashboardMyTasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardMyTasksComponent, LoadingSpinnerComponent, NgbProgressbar ],
      imports: [
        HttpClientTestingModule
      ]
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

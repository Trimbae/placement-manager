import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionComponent } from './submission.component';
import {of} from 'rxjs';
import {ActivatedRoute, convertToParamMap} from '@angular/router';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('SubmissionComponent', () => {
  let component: SubmissionComponent;
  let fixture: ComponentFixture<SubmissionComponent>;

  const fakeActivatedRoute = {
    paramMap: of(
      convertToParamMap( {taskId: null})
    ),
    queryParamMap: of(
      convertToParamMap({idSelected: null})
    )
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmissionComponent ],
      imports: [HttpClientTestingModule],
      providers: [
        {provide: ActivatedRoute, useValue: fakeActivatedRoute}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

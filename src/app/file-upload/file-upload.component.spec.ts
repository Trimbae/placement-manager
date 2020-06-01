import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadComponent } from './file-upload.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {of} from 'rxjs';
import {ActivatedRoute, convertToParamMap} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {TaskService} from '../services/task-service/task.service';
import {DebugElement} from '@angular/core';
import {Task} from '../common/classes/task';

describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;
  let de: DebugElement;
  let taskService: TaskService;
  let spy: jasmine.Spy;

  const fakeActivatedRoute = {
    paramMap: of(
      convertToParamMap( {taskId: null})
    )
  };

  beforeEach(async(() => {
     TestBed.configureTestingModule({
      declarations: [ FileUploadComponent ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        TaskService,
        {provide: ActivatedRoute, useValue: fakeActivatedRoute}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;

    taskService = de.injector.get(TaskService);
    spy = spyOn(taskService, 'getTaskById').and.returnValue(of({} as Task));

    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

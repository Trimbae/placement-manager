import {async, ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';

import { CreateTaskComponent } from './create-task.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ActivatedRoute, Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {TaskService} from '../services/task-service/task.service';
import {CUSTOM_ELEMENTS_SCHEMA, DebugElement} from '@angular/core';
import {ActivatedRouteStub} from '../../testing/activated-route.stub';
import {of} from 'rxjs';
import {ViewTasksComponent} from '../view-tasks/view-tasks.component';
import {Task} from '../common/classes/task';

fdescribe('CreateTaskComponent', () => {
  let component: CreateTaskComponent;
  let fixture: ComponentFixture<CreateTaskComponent>;
  let de: DebugElement;
  let taskService: TaskService;
  let router: Router;
  let testTask: any;
  const activatedRoute = new ActivatedRouteStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTaskComponent ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([{path: 'tasks/view', component: ViewTasksComponent}])
      ],
      providers: [
        TaskService,
        {provide: ActivatedRoute, useValue: activatedRoute}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    activatedRoute.setParamMap({taskId: '0'});
    fixture = TestBed.createComponent(CreateTaskComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    taskService = TestBed.inject(TaskService);
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization behaviour: ', () => {
    it(`should be 'create' (not edit) page by default`, () => {
      expect(component.isEdit).toBeFalsy();
    });
    it('should define minDate', () => {
      expect(component.minDate).toBeDefined();
    });
    it('should call function to check route params for task to edit', () => {
      spyOn(component, 'checkParamsForTask');
      component.ngOnInit();
      expect(component.checkParamsForTask).toHaveBeenCalled();
    });
  });

  describe('buildData', () => {
    it('should map data from form correctly to object', () => {
      component.form.patchValue({
        taskId: '1',
        taskName: 'Upload Report',
        description: 'test description',
        type: 'upload',
        uploadType: 'assessment',
        marksAvailable: 75,
        dueDate: '2020-04-20T01:00:00.000Z',
        dueTime: '21:27'
      });

      const expectedOutput = {
        taskId: '1',
        displayName: 'Upload Report',
        description: 'test description',
        name: 'upload-report',
        type: 'upload',
        uploadInfo: {
          uploadType: 'assessment',
          marksAvailable: 75
        },
        dueDateTime: new Date('2020-04-20 21:27'),
        isPublished: true
      } as any;

      const actualOutput = component.buildData();

      expect(actualOutput).toEqual(expectedOutput);
    });
    it('should call methods for building data', () => {
      spyOn(component, 'getUrlFriendlyName');
      spyOn(component, 'getUploadInfoObject');
      spyOn(component, 'createDateTime');

      component.buildData();

      expect(component.getUrlFriendlyName).toHaveBeenCalled();
      expect(component.getUploadInfoObject).not.toHaveBeenCalled();
      expect(component.createDateTime).toHaveBeenCalled();
    });
    it('should call getUploadInfoObject if form type upload', () => {
      spyOn(component, 'getUrlFriendlyName');
      spyOn(component, 'getUploadInfoObject');
      spyOn(component, 'createDateTime');
      component.form.patchValue({type: 'upload'});

      component.buildData();

      expect(component.getUrlFriendlyName).toHaveBeenCalled();
      expect(component.getUploadInfoObject).toHaveBeenCalled();
      expect(component.createDateTime).toHaveBeenCalled();
    });
  });

  describe('checkParamsForTask', () => {
    it('should remain edit form if no taskId parameter', () => {
      spyOn(component, 'editTask');
    });
    it('should call editTask if taskID route param detected', fakeAsync(() => {
      const testTaskId = '3';
      spyOn(component, 'editTask');
      activatedRoute.setParamMap({taskId: testTaskId});

      component.checkParamsForTask();

      expect(component.editTask).toHaveBeenCalled();
      expect(component.editTask).toHaveBeenCalledWith(testTaskId);
    }));
  });

  describe('createDateTime', () => {
    it('should create date object with correct time and date based off date and time form fields', () => {
      component.form.patchValue(
        {
          dueDate: new Date('2020-01-01'),
          dueTime : '11:00'
        }
      );
      const createdDate = component.createDateTime();

      expect(createdDate).toEqual(new Date('2020-01-01 11:00'));
    });
  });

  describe('editTask', () => {
    it('should call TaskService with taskId', () => {
      const testTaskId = '3';
      spyOn(taskService, 'getTaskById').and.returnValue(of({} as Task));

      component.editTask(testTaskId);

      expect(taskService.getTaskById).toHaveBeenCalled();
      expect(taskService.getTaskById).toHaveBeenCalledWith(testTaskId);
    });
    it('should set isEdit to true if response from TaskService', () => {
      const testTaskId = '3';
      spyOn(taskService, 'getTaskById').and.returnValue(of({} as Task));
      expect(component.isEdit).toBeFalsy();

      component.editTask(testTaskId);

      expect(component.isEdit).toBeTruthy();
    });
    it('should call patchValuesToForm if response from TaskService', () => {
      const testTaskId = '3';
      const testTaskData = {} as Task;

      spyOn(taskService, 'getTaskById').and.returnValue(of(testTaskData));
      spyOn(component, 'patchValuesToForm');

      component.editTask(testTaskId);

      expect(component.patchValuesToForm).toHaveBeenCalledWith(testTaskData);
    });
  });


  describe('getTimeFromFullDate', () => {
    it('should return correct time in HH:mm form from input date object', () => {
      const time = component.getTimeFromFullDate(new Date('2020-01-01 09:00'));

      expect(time).toEqual('09:00');
    });
    it('should return correct time in 24 hour HH:mm form from input date object', () => {
      const time = component.getTimeFromFullDate(new Date('2020-01-01 19:43'));

      expect(time).toEqual('19:43');
    });
  });

  describe('getUploadInfoObject', () => {
    it('should return correctly formatted uploadInfo object based on form values', () => {
      const formData = {uploadType: 'assessment', marksAvailable: 99};
      component.form.patchValue(formData);

      const uploadInfo = component.getUploadInfoObject();

      expect(uploadInfo).toEqual(formData);
    });
  });

  describe('getUrlFriendlyName', () => {
    it('should return all lower case', () => {
      component.form.patchValue({taskName: 'UpLoAd-ForM'});

      const actualOutput = component.getUrlFriendlyName();

      expect(actualOutput).toEqual('upload-form');
    });
    it('should replace spaces with dashes', () => {
      component.form.patchValue({taskName: 'Upload Form 1'});

      const actualOutput = component.getUrlFriendlyName();

      expect(actualOutput).toEqual('upload-form-1');
    });
  });

  describe('patchValuesToForm', () => {
    beforeEach(() => {
      testTask = Object.assign({}, require('../../testing/mock-data/task.json'));
    });

    it('should default uploadType and marksAvailable to empty string if no uploadInfo', () => {
      testTask.uploadInfo = null;

      component.patchValuesToForm(testTask);

      expect(component.form.value.uploadType).toEqual('');
      expect(component.form.value.marksAvailable).toEqual('');

    });

    it('should set form fields based on task data', () => {
      component.patchValuesToForm(testTask);

      expect(component.form.value.taskId).toEqual(testTask.testId);
      expect(component.form.value.taskName).toEqual(testTask.displayName);
      expect(component.form.value.type).toEqual(testTask.type);
      expect(component.form.value.description).toEqual(testTask.description);
      expect(component.form.value.uploadType).toEqual(testTask.uploadInfo.uploadType);
      expect(component.form.value.marksAvailable).toEqual('');
      expect(component.form.value.dueDate).toEqual(new Date('2020-04-20 22:00'));
      expect(component.form.value.dueTime).toEqual('22:00');
    });

    it('should default  marksAvailable to empty string if uploadInfo but no marksAvailable', () => {

      testTask.uploadInfo = {uploadType: 'supporting-documents', marksAvailable: null};

      component.patchValuesToForm(testTask);

      expect(component.form.value.uploadType).toEqual('supporting-documents');
      expect(component.form.value.marksAvailable).toEqual('');

    });
  });

  describe('submit', () => {
    it('should call taskService.editTask && not call taskService.createTask if isEdit true', () => {
      spyOn(taskService, 'editTask').and.returnValue(of({}));
      spyOn(taskService, 'createTask').and.returnValue(of({}));
      component.isEdit = true;

      component.submit();

      expect(taskService.editTask).toHaveBeenCalled();
      expect(taskService.createTask).not.toHaveBeenCalled();
    });
    it('should call taskService.createTask and not taskService.editTask if isEdit false', () => {
      spyOn(taskService, 'editTask').and.returnValue(of({}));
      spyOn(taskService, 'createTask').and.returnValue(of({}));
      component.isEdit = false;

      component.submit();

      expect(taskService.editTask).not.toHaveBeenCalled();
      expect(taskService.createTask).toHaveBeenCalled();
    });
    it('should call buildData for edit task', () => {
      spyOn(taskService, 'editTask').and.returnValue(of({}));
      spyOn(component, 'buildData');
      component.isEdit = true;

      component.submit();

      expect(component.buildData).toHaveBeenCalled();
    });
    it('should call buildData for create task', () => {
      spyOn(component, 'buildData');
      spyOn(taskService, 'createTask').and.returnValue(of({}));
      component.isEdit = false;

      component.submit();

      expect(component.buildData).toHaveBeenCalled();
    });
    it('should navigate to view for edit task', () => {
      spyOn(taskService, 'editTask').and.returnValue(of({}));
      spyOn(router, 'navigate');

      component.isEdit = true;

      component.submit();

      expect(router.navigate).toHaveBeenCalledWith(['/admin/view-tasks']);

    });
    it('should navigate to view for create task', fakeAsync(() => {
      spyOn(taskService, 'createTask').and.returnValue(of({}));
      spyOn(router, 'navigate');
      component.isEdit = false;

      component.submit();

      expect(router.navigate).toHaveBeenCalledWith(['/admin/view-tasks']);
    }));
  });
});

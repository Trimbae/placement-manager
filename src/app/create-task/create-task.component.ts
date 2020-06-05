import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TaskService} from '../services/task-service/task.service';
import {ActivatedRoute, Router} from '@angular/router';
import {formatDate} from '@angular/common';
import {UUID} from 'angular2-uuid';

// TODO: add option to publish task as draft, make multiple spaces invalid input

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent implements OnInit {
  // assign random string as ID
  newTaskId = UUID.UUID();
  minDate: Date;
  isEdit = false;

  form = new FormGroup({
    taskName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.pattern(/^[\w\s]+$/)
    ]),
    taskId: new FormControl({value: this.newTaskId, disabled: true}, Validators.required),
    type: new FormControl('', Validators.required),
    uploadType: new FormControl(''),
    marksAvailable: new FormControl(''),
    description: new FormControl('', Validators.required),
    dueDate: new FormControl('', Validators.required),
    dueTime: new FormControl('', Validators.required)
  });

  taskTypes = [
    { id: 'upload', name: 'Upload'},
    { id: 'meeting', name: 'Meeting'}
  ];
  uploadTypes = [
    { id: 'assessment', name: 'Assessment'},
    { id: 'supporting-documents', name: 'Supporting Documents'}
  ];

  constructor(private taskService: TaskService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    // set minimum date for form task due date as today
    this.minDate = new Date();
    this.checkParamsForTask();
  }

  // these getter methods allow us to easily access the form control objects in the template
  get taskId() {
    return this.form.get('taskId');
  }
  get taskName() {
    return this.form.get('taskName');
  }
  get type() {
    return this.form.get('type');
  }
  get uploadType() {
    return this.form.get('uploadType');
  }
  get marksAvailable() {
    return this.form.get('marksAvailable');
  }
  get description() {
    return this.form.get('description');
  }
  get dueDate() {
    return this.form.get('dueDate');
  }
  get dueTime() {
    return this.form.get('dueTime');
  }

  buildData() {
    const data = this.form.getRawValue();
    return {
      taskId: data.taskId,
      displayName: data.taskName,
      description: data.description,
      name: this.getUrlFriendlyName(),
      type: data.type,
      uploadInfo: data.type === 'upload' ? this.getUploadInfoObject() : null,
      dueDateTime: this.createDateTime(),
      isPublished: true
    };
  }

  checkParamsForTask() {
    this.route.paramMap
      .subscribe(params => {
        const taskId = params.get('taskId');
        if (taskId) {
          this.editTask(taskId);
        }
      });
  }

  createDateTime(): Date {
    const hours = this.dueTime.value.split(':')[0];
    const mins = this.dueTime.value.split(':')[1];

    const  newDate = new Date(this.dueDate.value);
    newDate.setHours(hours, mins);
    return newDate;
  }

  editTask(taskId) {
    this.taskService.getTaskById(taskId)
      .subscribe((response: any) => {
        this.patchValuesToForm(response);
        this.isEdit = true;
      });
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getTimeFromFullDate(dateTime: Date) {
    return formatDate(dateTime, 'HH:mm', 'en');
  }

  getUploadInfoObject() {
    return {
      uploadType: this.uploadType.value,
      marksAvailable: this.uploadType.value === 'assessment' ? this.marksAvailable.value : null
    };
  }

  getUrlFriendlyName() {
    let urlFriendlyName = this.taskName.value.toLowerCase();
    urlFriendlyName = urlFriendlyName.replace(/\s/g , '-');
    console.log(urlFriendlyName);
    return urlFriendlyName;
  }

  patchValuesToForm(task) {
    let parsedDueDateTime = null;
    if (task.dueDateTime) {
      parsedDueDateTime = new Date(task.dueDateTime);
    }
    this.form.patchValue({
      taskId: task.taskId,
      taskName: task.displayName,
      description: task.description,
      type: task.type,
      uploadType: task.uploadInfo ? task.uploadInfo.uploadType : '',
      marksAvailable: task.uploadInfo && task.uploadInfo.marksAvailable ? task.uploadInfo.taskType : '',
      dueDate: parsedDueDateTime,
      dueTime: parsedDueDateTime ? this.getTimeFromFullDate(parsedDueDateTime) : null
    });
  }

  submit() {
    if (this.isEdit) {
      this.taskService.editTask(this.buildData())
        .subscribe(() => {
          this.router.navigate(['/admin/view-tasks']);
        });
    } else {
      this.taskService.createTask(this.buildData())
        .subscribe(() => {
          this.router.navigate(['/admin/view-tasks']);
        });
    }
  }

}

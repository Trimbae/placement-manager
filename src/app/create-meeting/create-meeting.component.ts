import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MeetingService} from '../services/meeting-service/meeting.service';
import {UserService} from '../services/user-service/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from '../common/classes/user';
import {Task} from '../common/classes/task';
import {TaskService} from '../services/task-service/task.service';

@Component({
  selector: 'app-create-meeting',
  templateUrl: './create-meeting.component.html',
  styleUrls: ['./create-meeting.component.css']
})
export class CreateMeetingComponent implements OnInit {

  currentUser: User;
  minDate = new Date();
  loading = true;
  task: Task;

  constructor(private meetingService: MeetingService,
              private route: ActivatedRoute,
              private router: Router,
              private userService: UserService,
              private taskService: TaskService) { }

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    time: new FormControl('', Validators.required),
    location: new FormControl('')
  });

  get name() {
    return this.form.get('name');
  }
  get date() {
    return this.form.get('date');
  }
  get time() {
    return this.form.get('time');
  }
  get location() {
    return this.form.get('location');
  }

  ngOnInit(): void {
    this.route.paramMap
      .subscribe( params => {
        const taskId = +params.get('taskId');
        this.getTask(taskId);
      });
    this.currentUser = this.userService.currentUserValue;
  }

  buildMeetingData() {
    return {
      name: this.name.value,
      studentId: this.currentUser.universityId,
      supervisorId: this.currentUser.studentData.supervisorId,
      taskId: this.task.taskId,
      time: this.createDateTime(),
      location: this.location.value
    };
  }

  createDateTime(): Date {
    const hours = this.time.value.split(':')[0];
    const mins = this.time.value.split(':')[1];

    const  newDate = new Date(this.date.value);
    newDate.setHours(hours, mins);
    return newDate;
  }

  getTask(taskId: number) {
    this.taskService.getTaskById(taskId)
      .subscribe(response => {
        this.task = response;
        this.loading = false;
      });
  }

  submit() {
    const meetingData = this.buildMeetingData();
    this.meetingService.scheduleMeeting(meetingData)
      .subscribe(res => {
        console.log(res);
        this.router.navigate(['/student', this.currentUser.universityId], {queryParams: {active: 'Meetings'}});
      });
  }

}

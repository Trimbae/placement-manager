import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../services/user-service/user.service';
import {environment} from '../../environments/environment';
import {TaskService} from '../services/task-service/task.service';
import { Task } from '../common/classes/task';
import {User} from '../common/classes/user';
import {MeetingService} from '../services/meeting-service/meeting.service';
import {Meeting} from '../common/classes/meeting';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {

  activeSection = 'Details';
  canEdit = false;
  currentUser: User;
  loading = true;
  meetings: Meeting[];
  student: User;
  photoUrl: string;
  tasks: Task[] = [];


  sections = [
    'Details', 'Submissions', 'Meetings'
  ];

  constructor( private route: ActivatedRoute,
               private meetingService: MeetingService,
               private router: Router,
               private userService: UserService,
               private taskService: TaskService) { }
  // on init get university id from url params and use it to get student and check permissions
  ngOnInit(): void {
    this.route.paramMap
      .subscribe(params => {
        const universityId = params.get('universityId');
        if (universityId) {
          this.checkPermissions(universityId);
          this.getStudent(universityId);
        }
    });
    // get active tab from query params if passed
    this.route.queryParamMap
      .subscribe( queryParams => {
        const active = queryParams.get('active');
        if (active) {
          this.activeSection = active;
        }
      });
  }


  // should only be able to view this page if supervisor or if current student is viewing their own details
  checkPermissions(universityId: string): void {
    this.currentUser = this.userService.currentUserValue;
    if (this.currentUser.universityId !== universityId && this.currentUser.userType !== 'supervisor') {
      // if not authorised, go to error page
      this.router.navigate(['error'], { queryParams: { errorCode: 'userNotAuthorized' }});
    }
  }
  // get meetings between student and their supervisor
  getMeetings() {
    this.meetingService.getMeetingsById(this.student.universityId, this.student.studentData.supervisorId)
      .subscribe( meetings => {
        this.meetings = meetings;
      });
  }
  // create url to get profile photo
  getProfilePhotoUrl() {
    if (this.student) {
      this.photoUrl = environment.urls.PLACEMENT_MANAGER_API + '/images/' + this.student.universityId + '.jpg';
    }
  }
  // get Student from id, then call other tasks that use student info
  getStudent(universityId: string) {
    this.userService.getUserById(universityId)
      .subscribe(response => {
        this.student = response;
        this.setEditPrivileges();
        this.getProfilePhotoUrl();
        this.getTasks();
        this.getMeetings();
        this.loading = false;
      });
  }
  // get upload tasks completed by student for submissions tab
  getTasks() {
    this.taskService.getPublishedTasks()
      .subscribe(response  => {
        for (const task of response) {
          if (task.type === 'upload' && this.student.tasksCompleted.includes(task.taskId)) {
            this.tasks.push(task);
          }
        }
      });
  }
  // if no profile photo, use default avatar
  setDefaultAvatar() {
    this.photoUrl = './assets/img/default-user-icon.png';
  }
  // user can mark assignment or approve meetings if they are this students supervisor or an admin
  setEditPrivileges(): void {
    if (this.currentUser.universityId === this.student.studentData.supervisorId || this.currentUser.accessLevel.isAdmin) {
      this.canEdit = true;
    }
  }
  // change section to show
  show(section: string) {
    this.activeSection = section;
  }


}

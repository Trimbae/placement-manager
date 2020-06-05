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
  feedbackSubmitted = false;
  feedbackTaskName: string;
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

  ngOnInit(): void {
    this.route.paramMap
      .subscribe(params => {
        const universityId = params.get('universityId');
        if (universityId) {
          this.checkPermissions(universityId);
          this.getStudent(universityId);
        }
    });
    this.route.queryParamMap
      .subscribe( queryParams => {
        const active = queryParams.get('active');
        if (active) {
          this.activeSection = active;
        }
      });
  }



  checkPermissions(universityId: string): void {
    this.currentUser = this.userService.currentUserValue;
    if (this.currentUser.universityId !== universityId
      && !this.currentUser.accessLevel.isAdmin && this.currentUser.userType !== 'supervisor') {
      this.router.navigate(['error'], { queryParams: { errorCode: 'userNotAuthorized' }});
    }
  }

  getMeetings() {
    this.meetingService.getMeetingsById(this.student.universityId, this.student.studentData.supervisorId)
      .subscribe( meetings => {
        this.meetings = meetings;
      });
  }

  getProfilePhotoUrl() {
    if (this.student) {
      this.photoUrl = environment.urls.PLACEMENT_MANAGER_API + '/images/' + this.student.universityId + '.jpg';
    }
  }

  getStudent(universityId: string) {
    this.userService.getUserById(universityId)
      .subscribe(response => {
        this.student = response;
        this.setEditPrivileges();
        this.getProfilePhotoUrl();
        this.getTasks();
        this.getMeetings();
      });
  }

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

  setDefaultAvatar() {
    this.photoUrl = './assets/img/default-user-icon.png';
  }

  setEditPrivileges(): void {
    if (this.currentUser.universityId === this.student.studentData.supervisorId || this.currentUser.accessLevel.isAdmin) {
      this.canEdit = true;
    }
  }

  show(section: string) {
    this.activeSection = section;
  }


}

import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../services/user-service/user.service';
import {environment} from '../../environments/environment';
import {TaskService} from '../services/task-service/task.service';
import { Task } from '../common/classes/task';
import {User, FeedbackData} from '../common/classes/user';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MarkAssignmentModalComponent} from '../mark-assignment-modal/mark-assignment-modal.component';
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
  scheduledMeetings: Meeting[] = [];
  pendingMeetings: Meeting[] = [];
  student: User;
  photoUrl: string;
  tasks: Task[] = [];


  sections = [
    'Details', 'Submissions', 'Meetings'
  ];

  constructor( private route: ActivatedRoute,
               private meetingService: MeetingService,
               private modalService: NgbModal,
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

  approveMeeting(meeting: Meeting) {
    const index = this.pendingMeetings.indexOf(meeting);
    this.meetingService.approveMeeting(meeting)
      .subscribe(() => {
        console.log('meeting approved');
        this.pendingMeetings.splice(index, 1);
        this.scheduledMeetings.push(meeting);
      });
  }

  cancelMeeting(meeting: Meeting): void {
    const index = this.scheduledMeetings.indexOf(meeting);
    this.meetingService.cancelMeeting(meeting)
      .subscribe(response => {
        console.log('meeting cancelled', response);
        this.scheduledMeetings.splice(index, 1);
      });
  }

  checkPermissions(universityId: string): void {
    this.currentUser = this.userService.currentUserValue;
    if (this.currentUser.universityId !== universityId
      && !this.currentUser.accessLevel.isAdmin && !this.currentUser.accessLevel.isSupervisor) {
      this.router.navigate(['error'], { queryParams: { errorCode: 'userNotAuthorized' }});
    }
  }

  getMeetings() {
    this.meetingService.getMeetingsById(this.student.universityId, this.student.studentData.supervisorId)
      .subscribe( meetings => {
        this.sortMeetings(meetings);
      });
  }

  getProfilePhotoUrl() {
    if (this.student) {
      this.photoUrl = environment.urls.PLACEMENT_MANAGER_API + '/images/' + this.student.universityId + '.jpg';
    }
  }

  getStudent(universityId: string) {
    this.userService.getStudentById(universityId)
      .subscribe(response => {
        this.student = response as User;
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

  onMarkClicked(task: Task) {
    console.log('mark clicked');
    const modalRef = this.modalService.open(MarkAssignmentModalComponent, {size: 'lg', windowClass: 'modal-holder', centered: true});
    modalRef.componentInstance.student = this.student;
    modalRef.componentInstance.task = task;

    modalRef.result.then( (feedback: FeedbackData) => {
      feedback.taskId = task.taskId;
      console.log(feedback);
      this.userService.addFeedback(this.student.universityId, feedback)
        .subscribe(response => {
          console.log(response);
          this.feedbackSubmitted = true;
          this.feedbackTaskName = task.displayName;
        });
    }, () => {
      // modal dismissed
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

  sortMeetings(meetings: Meeting[]) {
    for (const meeting of meetings) {
      if (meeting.approved) {
        this.scheduledMeetings.push(meeting);
      } else {
        this.pendingMeetings.push(meeting);
      }
    }
  }
}

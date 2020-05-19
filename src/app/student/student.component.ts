import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../services/user-service/user.service';
import {environment} from '../../environments/environment';
import {TaskService} from '../services/task-service/task.service';
import { Task } from '../common/classes/task';
import {Student} from '../common/classes/student';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MarkAssignmentModalComponent} from '../mark-assignment-modal/mark-assignment-modal.component';
import {FeedbackData} from '../common/classes/feedback-data';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {

  activeSection = 'Details';
  feedbackSubmitted = false;
  feedbackTaskName: string;
  student: Student;
  photoUrl: string;
  tasks: Task[] = [];


  sections = [
    'Details', 'Submissions', 'Meetings'
  ];

  constructor( private route: ActivatedRoute,
               private modalService: NgbModal,
               private userService: UserService,
               private taskService: TaskService) { }

  ngOnInit(): void {
    this.route.paramMap
      .subscribe(params => {
        const universityId = params.get('universityId');
        if (universityId) {
          this.getStudent(universityId);
        }
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
        this.student = response as Student;
        this.getProfilePhotoUrl();
        this.getTasks();
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

  show(section: string) {
    this.activeSection = section;
  }
}

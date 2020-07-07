import {Component, Input, OnInit} from '@angular/core';
import {Task} from '../common/classes/task';
import {FeedbackData, User} from '../common/classes/user';
import {MarkAssignmentModalComponent} from '../mark-assignment-modal/mark-assignment-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {UserService} from '../services/user-service/user.service';


@Component({
  selector: 'app-student-submissions',
  templateUrl: './student-submissions.component.html',
  styleUrls: ['./student-submissions.component.css']
})
export class StudentSubmissionsComponent implements OnInit {
  @Input() tasks: Task[];
  @Input() student: User;
  @Input() canEdit: boolean;
  feedbackSubmitted = false;
  feedbackTaskName: string;

  constructor(private modalService: NgbModal, private userService: UserService) { }

  ngOnInit(): void {
  }
  onMarkClicked(task: Task) {
    // call mark assignment modal for student and task
    const modalRef = this.modalService.open(MarkAssignmentModalComponent, {size: 'lg', windowClass: 'modal-holder', centered: true});
    modalRef.componentInstance.student = this.student;
    modalRef.componentInstance.task = task;
    // called when user clicks 'submit' button on modal
    modalRef.result.then( (feedback: FeedbackData) => {
      // post feedback to userService, set notification
      feedback.taskId = task.taskId;
      this.userService.addFeedback(this.student.universityId, feedback)
        .subscribe(response => {
          this.feedbackSubmitted = true;
          this.feedbackTaskName = task.displayName;
        });
    }, () => {
      // modal dismissed
    });
  }
}

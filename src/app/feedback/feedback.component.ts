import { Component, OnInit } from '@angular/core';
import {TaskService} from '../services/task-service/task.service';
import { Task } from '../common/classes/task';
import {FeedbackData, User} from '../common/classes/user';
import {UserService} from '../services/user-service/user.service';
import {MsalService} from '@azure/msal-angular';
import {forkJoin} from 'rxjs';

export interface Feedback {
  task: Task;
  feedback: FeedbackData;
}
@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})

export class FeedbackComponent implements OnInit {
  user: User;
  taskFeedback: Feedback[] = [];
  activeTaskFeedback: Feedback;

  constructor(private taskService: TaskService, private userService: UserService, private authService: MsalService) { }

  ngOnInit(): void {
    this.getPageData();
  }

  getTasksWithFeedback(tasks: Task[]) {
    if (this.user.feedback) {
      for (const feedbackObject of this.user.feedback) {
        for (const task of tasks) {
          if (feedbackObject.taskId === task.taskId) {
            this.taskFeedback.push({task, feedback: feedbackObject});
          }
        }
      }
    }
    if (this.taskFeedback.length > 0) {
      this.activeTaskFeedback = this.taskFeedback[0];
    }
  }

  getPageData() {
    this.authService.acquireTokenSilent({scopes: ['user.read']})
      .then(response => {
        forkJoin({
          user: this.userService.getCurrentUser(response.accessToken),
          tasks: this.taskService.getPublishedTasks()
        })
          .subscribe(res => {
            this.user = res.user;
            this.getTasksWithFeedback(res.tasks);
          });
      });
  }

}

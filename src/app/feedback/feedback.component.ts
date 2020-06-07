import { Component, OnInit } from '@angular/core';
import {TaskService} from '../services/task-service/task.service';
import { Task } from '../common/classes/task';
import {FeedbackData, User} from '../common/classes/user';
import {UserService} from '../services/user-service/user.service';

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

  constructor(private taskService: TaskService, private userService: UserService) { }

  ngOnInit(): void {
    this.getPageData();
  }
  // iterate through user feedback, if taskId matches taskId of a published task, push to array
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
    // set first feedback object as active
    if (this.taskFeedback.length > 0) {
      this.activeTaskFeedback = this.taskFeedback[0];
    }
  }
  // get user and task data
  getPageData() {
    this.user = this.userService.currentUserValue;
    this.taskService.getPublishedTasks()
      .subscribe(tasks => {
        this.getTasksWithFeedback(tasks);
      });
  }

}

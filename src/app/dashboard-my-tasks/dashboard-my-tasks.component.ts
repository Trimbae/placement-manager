import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {TaskService} from '../services/task-service/task.service';
import { Task } from '../common/classes/task';

@Component({
  selector: 'app-dashboard-my-tasks',
  templateUrl: './dashboard-my-tasks.component.html',
  styleUrls: ['./dashboard-my-tasks.component.css']
})
export class DashboardMyTasksComponent implements OnInit, OnChanges {

  @Input() user;
  percentageCompleted: number;
  tasks: Task[];

  getPercentageCompleted() {
    if (this.user && this.tasks) {
      // const completedTaskCount = this.user.tasksCompleted.length;
      // console.log(this.user.tasksCompleted);
      let completedTaskCount = 0;
      for (const task of this.tasks) {
        if (this.user.tasksCompleted.includes(task.taskId)) {
          completedTaskCount ++;
        }
      }
      return Math.floor(completedTaskCount / this.tasks.length * 100);
    }
    return null;
  }

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.taskService.getPublishedTasks()
      .subscribe(response => {
        console.log(response);
        this.tasks = response;
        this.sortTasks();
        this.percentageCompleted = this.getPercentageCompleted();
      });
  }
  ngOnChanges(): void {
    this.percentageCompleted = this.getPercentageCompleted();
  }

  isTaskCompleted(taskId: number) {
    return this.user && this.user.tasksCompleted.includes(taskId);
  }

  sortTasks() {
    this.tasks.sort((a, b) => {
      return a.orderIndex - b.orderIndex;
    });
  }

}

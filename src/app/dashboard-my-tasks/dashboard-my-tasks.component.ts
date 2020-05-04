import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {TaskService} from '../services/task-service/task.service';

@Component({
  selector: 'app-dashboard-my-tasks',
  templateUrl: './dashboard-my-tasks.component.html',
  styleUrls: ['./dashboard-my-tasks.component.css']
})
export class DashboardMyTasksComponent implements OnInit, OnChanges {

  @Input() user;
  percentageCompleted: number;
  tasks: any;

  getPercentageCompleted() {
    if (this.user && this.tasks) {
      const completedTaskCount = this.user.tasksCompleted.length;
      console.log(this.user.tasksCompleted);
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
        this.percentageCompleted = this.getPercentageCompleted();
      });
  }
  ngOnChanges(): void {
    this.percentageCompleted = this.getPercentageCompleted();
  }

  isTaskCompleted(taskId: string) {
    return this.user && this.user.tasksCompleted.includes(+taskId);
  }

}

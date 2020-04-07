import {Component, Input, OnInit} from '@angular/core';
import {TaskService} from '../services/task.service';

@Component({
  selector: 'app-dashboard-my-tasks',
  templateUrl: './dashboard-my-tasks.component.html',
  styleUrls: ['./dashboard-my-tasks.component.css']
})
export class DashboardMyTasksComponent implements OnInit {

  @Input() user;
  percentageCompleted: number;
  tasks: any;

  getPercentageCompleted() {
    let completedTaskCount = 0;
    for (const task of this.tasks) {
      if (task.isCompleted) {
        completedTaskCount++;
      }
    }
    return Math.floor(completedTaskCount / this.tasks.length * 100);
  }

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.tasks = this.taskService.getTasks();
    this.percentageCompleted = this.getPercentageCompleted();
  }

}

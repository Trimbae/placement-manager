import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-my-tasks',
  templateUrl: './dashboard-my-tasks.component.html',
  styleUrls: ['./dashboard-my-tasks.component.css']
})
export class DashboardMyTasksComponent implements OnInit {

  percentageCompleted: number;

  tasks = [
    {id: 1, name: 'Upload induction checklist', isCompleted: true},
    {id: 2, name: 'Upload authorisation letter', isCompleted: true},
    {id: 3, name: 'Schedule supervisor meeting', isCompleted: true},
    {id: 4, name: 'Upload Employer Evaluation Form', isCompleted: false},
    {id: 5, name: 'Upload SFIA Mapping Document', isCompleted: false},
    {id: 6, name: 'Schedule supervisor meeting', isCompleted: false}
    ];

  getPercentageCompleted() {
    let completedTaskCount = 0;
    for (const task of this.tasks) {
      if (task.isCompleted) {
        completedTaskCount++;
      }
    }
    return Math.floor(completedTaskCount / this.tasks.length * 100);
  }

  constructor() { }

  ngOnInit(): void {
    this.percentageCompleted = this.getPercentageCompleted();
  }

}

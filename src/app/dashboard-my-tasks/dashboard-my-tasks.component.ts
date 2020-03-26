import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-my-tasks',
  templateUrl: './dashboard-my-tasks.component.html',
  styleUrls: ['./dashboard-my-tasks.component.css']
})
export class DashboardMyTasksComponent implements OnInit {

  tasks = {
    upcoming: [
      {id: 4, name: 'Upload Employer Evaluation Form'},
      {id: 5, name: 'Upload SFIA Mapping Document'},
      {id: 6, name: 'Schedule supervisor meeting'}
    ],
    completed: [
      {id: 1, name: 'Upload induction checklist'},
      {id: 2, name: 'Upload authorisation letter'},
      {id: 3, name: 'Schedule supervisor meeting'}
    ]
  };

  constructor() { }

  ngOnInit(): void {
  }

}

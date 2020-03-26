import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-profile',
  templateUrl: './dashboard-profile.component.html',
  styleUrls: ['./dashboard-profile.component.css']
})
export class DashboardProfileComponent implements OnInit {

  user = {
    id: 'C1525379',
    name: 'Matthew Trimby',
    placementEmployer: 'BT',
    img: './assets/img/Profile-pic-example.JPG',
    supervisor: {
      id: 1,
      name: 'Carl Jones'
    },
    workSupervisor: 'Clare Lewis',
    startDate: '09/09/2019'
  };

  constructor() { }

  ngOnInit(): void {
  }

}

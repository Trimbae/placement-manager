import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-tools',
  templateUrl: './dashboard-tools.component.html',
  styleUrls: ['./dashboard-tools.component.css']
})
export class DashboardToolsComponent implements OnInit {

  tools = [
    {id: 1, name: 'Upload Documents', link: ''},
    {id: 2, name: 'My Feedback', link: ''},
    {id: 3, name: 'Edit Profile', link: ''},
    {id: 4, name: 'Contact Placement Team', link: ''}
  ];

  constructor() { }

  ngOnInit(): void {
  }

}

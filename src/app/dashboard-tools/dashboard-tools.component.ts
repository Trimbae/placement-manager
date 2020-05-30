import {Component, Input, OnInit} from '@angular/core';
import {User} from '../common/classes/user';

@Component({
  selector: 'app-dashboard-tools',
  templateUrl: './dashboard-tools.component.html',
  styleUrls: ['./dashboard-tools.component.css']
})
export class DashboardToolsComponent implements OnInit {

  @Input() user: User;

  tools = [
    {id: 1, name: 'Upload Documents', link: ''},
    {id: 3, name: 'Edit Profile', link: ''},
    {id: 4, name: 'Contact Placement Team', link: ''}
  ];

  constructor() { }

  ngOnInit(): void {
  }

}

import {Component, Input, OnInit} from '@angular/core';
import {User} from '../common/classes/user';

@Component({
  selector: 'app-dashboard-tools',
  templateUrl: './dashboard-tools.component.html',
  styleUrls: ['./dashboard-tools.component.css']
})
export class DashboardToolsComponent implements OnInit {

  @Input() user: User;

  constructor() { }

  ngOnInit(): void {
  }

}

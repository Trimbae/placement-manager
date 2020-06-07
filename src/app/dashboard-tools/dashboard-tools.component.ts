import {Component, Input, } from '@angular/core';
import {User} from '../common/classes/user';

@Component({
  selector: 'app-dashboard-tools',
  templateUrl: './dashboard-tools.component.html',
  styleUrls: ['./dashboard-tools.component.css']
})
export class DashboardToolsComponent {

  @Input() user: User;

  constructor() { }

}

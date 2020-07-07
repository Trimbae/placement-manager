import {Component, Input, OnInit} from '@angular/core';
import {User} from '../common/classes/user';

@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.component.html',
  styleUrls: ['./student-details.component.css']
})
export class StudentDetailsComponent implements OnInit {

  @Input() student: User;

  constructor() { }

  ngOnInit(): void {
  }

}

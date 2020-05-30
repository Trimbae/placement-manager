import {Component, Input, OnInit} from '@angular/core';
import {UserService} from '../services/user-service/user.service';

@Component({
  selector: 'app-dashboard-my-students',
  templateUrl: './dashboard-my-students.component.html',
  styleUrls: ['./dashboard-my-students.component.css']
})
export class DashboardMyStudentsComponent implements OnInit {
  @Input() user;
  loading = true;
  studentsSupervising;
  studentsModerating;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.getStudents();
  }

  getStudents() {
    this.userService.getStudentsBySupervisor(this.user.universityId)
      .subscribe(response => {
        this.studentsSupervising = response;
        this.loading = false;
      });
  }
}

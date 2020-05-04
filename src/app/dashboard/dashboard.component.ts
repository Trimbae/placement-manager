import { Component, OnInit } from '@angular/core';
import {AppError} from '../common/app.error';
import {NotFoundError} from '../common/not-found.error';
import {UserService} from '../services/user-service/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userData;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getCurrentUser().
      subscribe(data => this.userData = data,
      (error: AppError) => {
        if (error instanceof NotFoundError) {
          alert('Resource not found');
        } else {
          throw error;
        }
      });
  }

}

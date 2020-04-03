import { Component, OnInit } from '@angular/core';
import {MsalService} from '@azure/msal-angular';
import {AppError} from '../common/app.error';
import {NotFoundError} from '../common/not-found.error';
import {PostService} from '../services/post.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userData;

  constructor(private authService: MsalService, private userService: PostService) { }

  ngOnInit(): void {
    this.userService.get('/me').
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

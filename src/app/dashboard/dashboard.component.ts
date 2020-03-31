import { Component, OnInit } from '@angular/core';
import {MsalService} from '@azure/msal-angular';
import {MsGraphService} from '../services/ms-graph.service';
import {AppError} from '../common/app.error';
import {NotFoundError} from '../common/not-found.error';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  msUser;

  constructor(private authService: MsalService, private msService: MsGraphService) { }

  ngOnInit(): void {
    this.msService.get('/me').
      subscribe(user => this.msUser = user,
      (error: AppError) => {
        if (error instanceof NotFoundError) {
          alert('Resource not found');
        } else {
          throw error;
        }
      });
  }

}

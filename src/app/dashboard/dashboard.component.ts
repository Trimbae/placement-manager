import { Component, OnInit } from '@angular/core';
import {AppError} from '../common/app.error';
import {NotFoundError} from '../common/not-found.error';
import {UserService} from '../services/user-service/user.service';
import {MsalService} from '@azure/msal-angular';
import {InvalidMsalTokenError} from '../common/invalid-msal-token.error';
import {ClientAuthError} from 'msal';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userData;
  userToken: string;
  errorMessage: string;

  constructor(private userService: UserService, private authService: MsalService) { }

  ngOnInit(): void {
    this.getUserToken();
  }

  getCurrentUser() {
    this.userService.getCurrentUser(this.userToken).
    subscribe(data => this.userData = data,
      (error: AppError) => {
        if (error instanceof NotFoundError) {
          alert('Resource not found');
        } else if (error instanceof InvalidMsalTokenError) {
          this.getUserConsent();
        } else {
          throw error;
        }
      });
  }

  getUserToken() {
    this.authService.acquireTokenSilent({scopes: ['user.read']})
      .then(response => {
        this.userToken = response.accessToken;
        this.getCurrentUser();
      });
  }

  getUserConsent() {
    this.authService.acquireTokenPopup({scopes: ['user.read']})
      .then( response => {
        this.userToken = response.accessToken;
        this.getCurrentUser();
      }).catch( err => {
        if (err instanceof ClientAuthError) {
          this.errorMessage = 'dashboard.errors.needPermissions';
        }
    });
  }
}

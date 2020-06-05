import { Component, OnInit } from '@angular/core';
import {AppError} from '../common/app.error';
import {NotFoundError} from '../common/not-found.error';
import {UserService} from '../services/user-service/user.service';
import {MsalService} from '@azure/msal-angular';
import {InvalidMsalTokenError} from '../common/invalid-msal-token.error';
import {ClientAuthError} from 'msal';
import {Router} from '@angular/router';
import {User} from '../common/classes/user';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: User;
  userToken: string;
  errorMessage: string;
  loading = true;

  constructor(private userService: UserService, private authService: MsalService, private router: Router) { }

  ngOnInit(): void {
    this.getUserToken();
  }

  getCurrentUser() {
    // get user data from user service
    this.userService.getCurrentUser(this.userToken)
      .subscribe(data => {
        // set user data
        this.user = data;
        console.log(this.user);
        // set loading to false
        this.loading = false;
    },
      (error: AppError) => {
        // if user not found, redirect to error page
        if (error instanceof NotFoundError) {
          this.router.navigate(['error'], { queryParams: { errorCode: 'userNotFound' }});
        } else if (error instanceof InvalidMsalTokenError) {
          // if token retrieved does not have required permissions, we need to explicitly ask for users consent for app to get their data
          this.getUserConsent();
        } else {
          throw error;
        }
      });
  }

  getUserToken() {
    // get token to use to read user data from Microsoft Graph Authentication from MsalService
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
          // displays error message to user informing them they need to disable pop-ups to grant permissions
          this.errorMessage = 'dashboard.errors.needPermissions';
        }
    });
  }
}

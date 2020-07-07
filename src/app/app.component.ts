import {Component, OnInit} from '@angular/core';
import {CryptoUtils, Logger} from 'msal';
import { BroadcastService, MsalService } from '@azure/msal-angular';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Placement Manager';

  isIframe = false;
  loggedIn = false;

  constructor(private broadcastService: BroadcastService, private authService: MsalService, private router: Router) { }

  ngOnInit() {
    this.isIframe = window !== window.parent && !window.opener;
    // checks if user logged in on initialisation
    this.checkoutAccount();

    // listen for log in success
    this.broadcastService.subscribe('msal:loginSuccess', () => {
      this.checkoutAccount();
    });
    // handles redirect if using redirect login method (only IE)
    this.authService.handleRedirectCallback((authError, response) => {
      if (authError) {
        console.error('Redirect Error: ', authError.errorMessage);
        return;
      }

      console.log('Redirect Success: ', response.accessToken);
    });
    // creates logger for MSAL
    this.authService.setLogger(new Logger((logLevel, message) => {
      console.log('MSAL Logging: ', message);
    }, {
      correlationId: CryptoUtils.createNewGuid(),
      piiLoggingEnabled: false
    }));
  }
  // if user not logged in, navigate to login page
  checkoutAccount() {
    this.loggedIn = !!this.authService.getAccount();
    if (!this.loggedIn) {
      this.router.navigate(['/login']);
    }
  }
}

// Much of this code is adapted from the Angular 9 MSAL Example App
// available at: https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/samples/angular9-sample-app

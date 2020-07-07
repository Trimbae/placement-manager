import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {MsalService} from '@azure/msal-angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private router: Router, private authService: MsalService, ) {
  }

  // function called when user clicks log in button
  login() {
    // check if user is on Internet Explorer
    const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

    if (isIE) {
      // if on internet explorer, log in with redirect
      this.authService.loginRedirect();
      this.loginSuccess();
    } else {
      // if not IE, use popup - on success call loginSuccess function
      this.authService.loginPopup().then(() => {
        this.loginSuccess();
      });
    }
  }

  loginSuccess() {
    // navigate to dashboard on login
    this.router.navigate(['/dashboard']);
  }

}

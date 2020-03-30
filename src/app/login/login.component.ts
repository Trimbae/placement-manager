import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {LoginValidators} from './login.validators';
import {Router} from '@angular/router';
import {MsalService} from '@azure/msal-angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: any;

  constructor(private router: Router, fb: FormBuilder, private authService: MsalService, ) {
    this.loginForm = fb.group({
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        LoginValidators.cannotContainSpace]
        , LoginValidators.shouldBeUnique
      ],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  login() {
    const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

    if (isIE) {
      this.authService.loginRedirect();
      this.loginSuccess();
    } else {
      this.authService.loginPopup().then(() => {
        this.loginSuccess();
      });
    }
  }

  loginSuccess() {
    this.router.navigate(['/dashboard']);
  }

}

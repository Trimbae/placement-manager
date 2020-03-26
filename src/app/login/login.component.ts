import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {LoginValidators} from './login.validators';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: any;

  login() {
    if (this.loginForm.get('username').value === 'C1525379') {
      this.loginSuccess();
    } else {
      this.loginForm.setErrors({
        invalidLogin: true
      });
    }
  }

  loginSuccess() {
    this.router.navigate(['/dashboard']);
  }

  constructor(private router: Router, fb: FormBuilder) {
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

}

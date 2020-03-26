import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {LoginValidators} from './login.validators';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      LoginValidators.cannotContainSpace
    ], LoginValidators.shouldBeUnique),
    password: new FormControl('', Validators.required)
  });

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

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

}

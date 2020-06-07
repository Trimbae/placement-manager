import { Component } from '@angular/core';
import {MsalService} from '@azure/msal-angular';
import {UserService} from '../services/user-service/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(private authService: MsalService, private userService: UserService) { }

  logout() {
    this.userService.logout();
    this.authService.logout();
  }
}

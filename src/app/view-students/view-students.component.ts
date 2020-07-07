import {Component, OnInit} from '@angular/core';
import {PermissionService} from '../services/permission-service/permission.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-view-students',
  templateUrl: './view-students.component.html',
  styleUrls: ['./view-students.component.css']
})
export class ViewStudentsComponent implements OnInit {

  constructor(private permissionService: PermissionService, private router: Router) { }

  ngOnInit(): void {
    this.checkPermissions();
  }

  checkPermissions(): void {
    if (!this.permissionService.isAdmin()) {
      this.router.navigate(['error'], { queryParams: { errorCode: 'userNotAuthorized' }});
    }
  }

}

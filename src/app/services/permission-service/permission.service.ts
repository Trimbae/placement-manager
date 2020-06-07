import { Injectable } from '@angular/core';
import {UserService} from '../user-service/user.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor( private userService: UserService) { }

  isAdmin() {
    const currentUser = this.userService.currentUserValue;
    return currentUser.accessLevel.isAdmin;
  }

  isCurrentUser(universityId: string): boolean {
    const currentUser = this.userService.currentUserValue;
    return currentUser.universityId === universityId;
  }

  isSupervisorOfStudent(universityId: string) {
    const currentUser = this.userService.currentUserValue;
    this.userService.getUserById(universityId)
      .subscribe(student => {
        return(currentUser.universityId === student.studentData.supervisorId);
      });
    return false;
  }
}

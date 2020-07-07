import {Component} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {environment} from '../../environments/environment';
import {UserService} from '../services/user-service/user.service';
import {User} from '../common/classes/user';

@Component({
  selector: 'app-modal-profile',
  templateUrl: './modal-profile.component.html',
  styleUrls: ['./modal-profile.component.css']
})
export class ModalProfileComponent {
  private id: string;
  loading = true;
  photoUrl = environment.urls.PLACEMENT_MANAGER_API + '/images/CJones.jpg';
  supervisor: User;

  constructor(public activeModal: NgbActiveModal, private userService: UserService) {
  }

  get supervisorId(): string {
    return this.id;
  }
  // set id variable and call get supervisor when supervisorId is set externally
  set supervisorId(supervisorId: string) {
    this.id = supervisorId;
    this.getSupervisor();
  }
  // get supervisor data
  getSupervisor(): void {
    this.userService.getUserById(this.supervisorId)
      .subscribe(response => {
        this.supervisor = response;
        this.loading = false;
      });
  }
  // if no profile photo, use default avatar
  setDefaultAvatar() {
    this.photoUrl = './assets/img/default-user-icon.png';
  }
}

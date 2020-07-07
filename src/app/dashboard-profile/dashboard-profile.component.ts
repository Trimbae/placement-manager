import {Component, Input, OnChanges} from '@angular/core';
import {environment} from '../../environments/environment';
import {ModalProfileComponent} from '../modal-profile/modal-profile.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {User} from '../common/classes/user';

@Component({
  selector: 'app-dashboard-profile',
  templateUrl: './dashboard-profile.component.html',
  styleUrls: ['./dashboard-profile.component.css']
})
export class DashboardProfileComponent implements OnChanges {

  @Input() user: User;
  photoUrl;
  isImageLoaded = false;

  constructor(private modalService: NgbModal ) {}

  ngOnChanges() {
    this.getProfilePhotoUrl();
  }
  // makes url for user profile photo
  getProfilePhotoUrl() {
    if (this.user) {
      this.photoUrl = environment.urls.PLACEMENT_MANAGER_API + '/images/' + this.user.universityId + '.jpg';
      this.isImageLoaded = true;
    }
  }
  // opens supervisor profile modal
  openModal() {
    const modalRef = this.modalService.open(ModalProfileComponent, {windowClass: 'modal-holder', centered: true});
    modalRef.componentInstance.supervisorId = this.user.studentData.supervisorId;
  }
  // if no profile photo, sets default
  setDefaultAvatar() {
    this.photoUrl = './assets/img/default-user-icon.png';
  }
}

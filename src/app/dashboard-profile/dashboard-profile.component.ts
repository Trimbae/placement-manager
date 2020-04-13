import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {environment} from '../../environments/environment';
import {ModalProfileComponent} from '../modal-profile/modal-profile.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dashboard-profile',
  templateUrl: './dashboard-profile.component.html',
  styleUrls: ['./dashboard-profile.component.css']
})
export class DashboardProfileComponent implements OnInit, OnChanges {

  @Input() user: any;
  photoUrl;
  isImageLoaded = false;

  constructor(private modalService: NgbModal ) {}

  ngOnInit(): void {

  }

  ngOnChanges() {
    this.getProfilePhotoUrl();
  }

  getProfilePhotoUrl() {
    if (this.user) {
      this.photoUrl = environment.urls.PLACEMENT_MANAGER_API + '/images/' + this.user.universityId + '.jpg';
      this.isImageLoaded = true;
    }
  }

  openModal() {
    const modalRef = this.modalService.open(ModalProfileComponent, {windowClass: 'modal-holder', centered: true});
    modalRef.componentInstance.userData = {
      name: 'Carl Jones',
      jobTitle: 'Staff In Computer Science',
      department: 'COMSC',
      officeLocation: 'NSA NEWPORT',
      email: 'JonesC162@cardiff.ac.uk',
      phone: '029 555 5555'
    };
  }
}

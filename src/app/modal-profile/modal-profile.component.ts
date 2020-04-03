import {Component, Input, OnInit} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-modal-profile',
  templateUrl: './modal-profile.component.html',
  styleUrls: ['./modal-profile.component.css']
})
export class ModalProfileComponent implements OnInit {
  @Input() userData;
  photoUrl = environment.urls.PLACEMENT_MANAGER_API + '/images/CJones.jpg';

  constructor(public activeModal: NgbActiveModal) {
  }

  ngOnInit(): void {
  }
}

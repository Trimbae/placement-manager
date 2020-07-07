import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {UserService} from '../services/user-service/user.service';
import {environment} from '../../environments/environment';
import {User} from '../common/classes/user';


@Component({
  selector: 'app-assign-supervisor-modal',
  templateUrl: './assign-supervisor-modal.component.html',
  styleUrls: ['./assign-supervisor-modal.component.css']
})

export class AssignSupervisorModalComponent implements OnInit {

  @Input() student;
  @Input() isReassign: boolean;
  supervisors: User[];
  selected: User;

  constructor(public activeModal: NgbActiveModal, private userService: UserService) { }
  // called on modal initialisation
  ngOnInit(): void {
    this.getSupervisors();
  }
  // get list of supervisors from user service
  getSupervisors() {
    this.userService.getUsersByType(environment.userTypes.USER_TYPE_SUPERVISOR)
      .subscribe(response => {
        this.supervisors = response;
        this.getActiveSupervisor();
      });
  }
  // if this is a re-assign, set students current supervisor as selected
  getActiveSupervisor() {
    if (this.isReassign) {
      for (const supervisor of this.supervisors) {
        if (supervisor.universityId === this.student.studentData.supervisorId) {
          this.selected = supervisor;
        }
      }
    }
  }
  // called when supervisor in list is clicked
  select(supervisor: User) {
    this.selected = supervisor;
  }

}

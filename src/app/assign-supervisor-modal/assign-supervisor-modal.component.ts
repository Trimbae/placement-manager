import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {UserService} from '../services/user-service/user.service';
import {environment} from '../../environments/environment';

export interface Supervisor {
  name: string;
  universityId: string;
}

@Component({
  selector: 'app-assign-supervisor-modal',
  templateUrl: './assign-supervisor-modal.component.html',
  styleUrls: ['./assign-supervisor-modal.component.css']
})

export class AssignSupervisorModalComponent implements OnInit {

  @Input() student;
  @Input() isReassign: boolean;
  supervisors: Supervisor[];
  selected: Supervisor;

  constructor(public activeModal: NgbActiveModal, private userService: UserService) { }

  ngOnInit(): void {
    this.getSupervisors();
  }

  getSupervisors() {
    this.userService.getUsersByType(environment.userTypes.USER_TYPE_SUPERVISOR)
      .subscribe(response => {
        console.log(response);
        this.supervisors = response;
        this.getCurrentSupervisor();
      });
  }

  getCurrentSupervisor() {
    if (this.isReassign) {
      for (const supervisor of this.supervisors) {
        if (supervisor.universityId === this.student.studentData.supervisorId) {
          this.selected = supervisor;
        }
      }
    }
  }

  select(supervisor: Supervisor) {
    this.selected = supervisor;
  }

}

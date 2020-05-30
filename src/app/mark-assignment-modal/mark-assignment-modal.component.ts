import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {User} from '../common/classes/user';
import { Task } from '../common/classes/task';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-mark-assignment-modal',
  templateUrl: './mark-assignment-modal.component.html',
  styleUrls: ['./mark-assignment-modal.component.css']
})
export class MarkAssignmentModalComponent implements OnInit, AfterViewInit {

  @Input() student: User;
  @Input() task: Task;
  max: number;

  constructor(public activeModal: NgbActiveModal) { }

  form = new FormGroup({
    mark: new FormControl('', [Validators.required, Validators.min(0)]),
    comments: new FormControl()
  });

  ngAfterViewInit() {
    this.mark.setValidators(Validators.max(this.task.uploadInfo.marksAvailable));
  }

  get mark() {
    return this.form.get('mark');
  }
  get comments() {
    return this.form.get('comments');
  }

  ngOnInit(): void {
  }

}

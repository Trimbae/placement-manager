import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatTable} from '@angular/material/table';
import { StudentTableDataSource, StudentTableItem } from './student-table-datasource';
import {UserService} from '../services/user-service/user.service';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {fromEvent, merge} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AssignSupervisorModalComponent} from '../assign-supervisor-modal/assign-supervisor-modal.component';

@Component({
  selector: 'app-student-table',
  templateUrl: './student-table.component.html',
  styleUrls: ['./student-table.component.css']
})
export class StudentTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<StudentTableItem>;
  @ViewChild('filterInput') input: ElementRef;

  dataSource: StudentTableDataSource;
  tableSize: number;
  showSpinner = true;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['universityId', 'name', 'supervisorName', 'placementProvider', 'assign'];

  constructor(private userService: UserService, private modalService: NgbModal) {}

  ngOnInit() {
    this.getTableSize();
    this.dataSource = new StudentTableDataSource(this.userService);
    this.dataSource.loadStudents();
  }

  ngAfterViewInit() {

    this.table.dataSource = this.dataSource;
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadStudentsPage();
        })
      )
      .subscribe();

    merge(this.paginator.page, this.sort.sortChange)
      .pipe(
        tap(() => this.loadStudentsPage())
      )
      .subscribe();
  }

  assignSupervisor(student, isReassign: boolean) {
    const modalRef = this.modalService.open(AssignSupervisorModalComponent, {size: 'lg', windowClass: 'modal-holder', centered: true});
    modalRef.componentInstance.student = student;
    modalRef.componentInstance.isReassign = isReassign;

    modalRef.result.then( selectedSupervisor => {
      student.studentData.supervisorName = selectedSupervisor.name;
      student.studentData.supervisorId = selectedSupervisor.universityId;
      this.userService.updateUser(student).
        subscribe(response => {
          console.log(response);
      });
    }, () => {
      // modal dismissed
    });
  }

  getTableSize() {
    this.userService.getUserCount(environment.userTypes.USER_TYPE_STUDENT)
      .subscribe(res => {
        const countObj = res as any;
        this.tableSize = countObj.userCount;
      });
  }

  loadStudentsPage() {
    this.dataSource.loadStudents(
      this.input.nativeElement.value,
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      this.sort.direction
    );
  }
}

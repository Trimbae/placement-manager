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

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['universityId', 'name', 'supervisorName', 'placementProvider', 'assign'];

  constructor(private userService: UserService, private modalService: NgbModal) {}

  ngOnInit() {
    this.getTableSize();
    this.dataSource = new StudentTableDataSource(this.userService);
    this.dataSource.loadStudents();
  }
  // function called after view initialised (all children paginator, sort etc are loaded)
  ngAfterViewInit() {

    this.table.dataSource = this.dataSource;
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    // function executed whenever user types in filter input box
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        // limits calls to load students to every 200 milliseconds, prevents unnecessary calls while typing
        debounceTime(200),
        // only calls if filter input has changed
        distinctUntilChanged(),
        tap(() => {
          // reset page index to 0 for paginator
          this.paginator.pageIndex = 0;
          // load student data from datasource
          this.loadStudentsPage();
        })
      )
      .subscribe();

    // merge function waits for observables to emit from paginator and sort, then emits them concurrently
    // in effect this function waits for a change in either paginator or sort (or both) and calls the load students function
    merge(this.paginator.page, this.sort.sortChange)
      .pipe(
        tap(() => this.loadStudentsPage())
      )
      .subscribe();
  }

  // function called when 'assign' or 'reassign' button clicked, arguments are passed from the list item where the button is clicked
  assignSupervisor(student, isReassign: boolean) {
    // open ngBootstrap modal for assigning supervisors and set input parameters
    const modalRef = this.modalService.open(AssignSupervisorModalComponent, {size: 'lg', windowClass: 'modal-holder', centered: true});
    modalRef.componentInstance.student = student;
    modalRef.componentInstance.isReassign = isReassign;

    // after modal closed
    modalRef.result.then( selectedSupervisor => {
      // if assign button was clicked, set supervisor name and id for student then push data to backend
      student.studentData.supervisorName = selectedSupervisor.name;
      student.studentData.supervisorId = selectedSupervisor.universityId;
      this.userService.updateUser(student).
        subscribe(response => {
          console.log(response);
      });
    }, () => {
      // modal dismissed, do nothing
    });
  }

  // gets total count of students for pagination
  getTableSize() {
    this.userService.getUserCount(environment.userTypes.USER_TYPE_STUDENT)
      .subscribe(res => {
        const countObj = res as any;
        this.tableSize = countObj.userCount;
      });
  }
  // calls the loadStudents method of the data source according to user parameters
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

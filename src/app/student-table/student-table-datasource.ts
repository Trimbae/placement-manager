import { DataSource } from '@angular/cdk/collections';
import {catchError, finalize} from 'rxjs/operators';
import {Observable, BehaviorSubject, of} from 'rxjs';
import {UserService} from '../services/user-service/user.service';
import {environment} from '../../environments/environment';

export interface StudentTableItem {
  name: string;
  universityId: string;
  supervisorName: string;
  placementProvider: string;

}

/**
 * Data source for the StudentTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class StudentTableDataSource extends DataSource<StudentTableItem> {

  private studentsSubject = new BehaviorSubject<StudentTableItem[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private userService: UserService) {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<StudentTableItem[]> {
    return this.studentsSubject.asObservable();
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {
    this.studentsSubject.complete();
    this.loadingSubject.complete();
  }

  loadStudents(filter = '', pageIndex = 0, pageSize = 10, sortBy = 'universityId', sortOrder = 'asc') {
    this.loadingSubject.next(true);

    this.userService.findUsers(filter, pageIndex, pageSize, sortBy, sortOrder, environment.userTypes.USER_TYPE_STUDENT)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(users => this.studentsSubject.next(users));
  }
}

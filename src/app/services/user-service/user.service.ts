import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';
import {StudentTableItem} from '../../student-table/student-table-datasource';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url = environment.urls.PLACEMENT_MANAGER_API + '/users';

  constructor(private http: HttpClient) { }

  // tslint:disable-next-line:max-line-length
  findUsers(
    filter = '',
    pageIndex = 0,
    pageSize = 10,
    sortBy = 'universityId',
    sortOrder = 'asc',
    userType = environment.userTypes.USER_TYPE_STUDENT
  ): Observable<StudentTableItem[]> {
    return this.http.get(this.url + '/search', {
      params: new HttpParams()
        .set('filter', filter)
        .set('pageIndex', pageIndex.toString())
        .set('pageSize', pageSize.toString())
        .set('sortBy', sortBy)
        .set('sortOrder', sortOrder)
        .set('userType', userType)
    }).pipe(
      map(res => res as StudentTableItem[])
    );
  }

  getAllUsers() {
    return this.http.get(this.url);
  }

  getCurrentUser() {
    return this.http.get(this.url + '/me');
  }

  getUserCount(userType: string) {
    return this.http.get(this.url + '/count', {
      params: new HttpParams()
        .set('userType', userType)
    });
  }

  getUsersByType(userType = ''): Observable<[]> {
    return this.http.get(this.url, {
      params: new HttpParams()
        .set('userType', userType)
    }).pipe(
      map(res => res as [])
    );
  }

  markTaskCompleteForUser(universityId, task) {
    return this.http.patch(this.url + '/' + universityId + '/tasks', {taskId: task});
  }

  updateUser(userData) {
    return this.http.patch(this.url, userData);
  }
}

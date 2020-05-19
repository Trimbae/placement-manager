import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {catchError, map} from 'rxjs/operators';
import {StudentTableItem} from '../../student-table/student-table-datasource';
import {Observable, throwError} from 'rxjs';
import {InvalidMsalTokenError} from '../../common/invalid-msal-token.error';
import {NotFoundError} from '../../common/not-found.error';
import {FeedbackData} from '../../common/classes/feedback-data';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url = environment.urls.PLACEMENT_MANAGER_API + '/users';

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // client-side error
      console.log('An unknown error occurred: ', error.error.message);
    } else {
      // back-end returned unsuccessful response code
      if (error.status === 401) {
        return throwError( new InvalidMsalTokenError(error));
      }
      if (error.status === 404) {
        return throwError(new NotFoundError());
      }
    }

    return throwError(
      'Something bad happened, please try again later'
    );
  }

  addFeedback(universityId: string, feedback: FeedbackData ) {
    return this.http.patch(this.url + '/' + universityId + '/feedback', feedback);
  }

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

  getCurrentUser(token: string) {
    return this.http.get(this.url + '/me', {
      headers: new HttpHeaders()
        .set('Authorization', token)
    })
      .pipe(
        catchError(this.handleError)
      );
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

  getStudentById(universityId: string) {
    return this.http.get(this.url + '/' + universityId)
      .pipe(
      catchError(this.handleError)
    );
  }

  getStudentsBySupervisor(supervisorId: string) {
    return this.http.get(this.url, {
      params: new HttpParams()
        .set('supervisorId', supervisorId)
    }).pipe(
      catchError(this.handleError)
    );
  }

  markTaskCompleteForUser(universityId, task) {
    return this.http.patch(this.url + '/' + universityId + '/tasks', {taskId: task});
  }

  updateUser(userData) {
    return this.http.patch(this.url, userData);
  }
}
